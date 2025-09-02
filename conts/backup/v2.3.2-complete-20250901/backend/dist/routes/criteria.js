"use strict";
/**
 * 기준(Criteria) 관리 API 라우터
 * AHP 프로젝트의 평가 기준을 생성, 조회, 수정, 삭제하는 기능을 제공
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const connection_1 = require("../database/connection");
const router = express_1.default.Router();
/**
 * 프로젝트의 모든 기준 조회
 * GET /api/criteria/:projectId
 */
router.get('/:projectId', auth_1.authenticateToken, [
    (0, express_validator_1.param)('projectId').isInt().withMessage('Project ID must be an integer')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { projectId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        // 프로젝트 접근 권한 확인
        let accessQuery = 'SELECT id FROM projects WHERE id = ?';
        let accessParams = [projectId];
        if (userRole === 'evaluator') {
            accessQuery += ` AND (admin_id = ? OR EXISTS (
          SELECT 1 FROM project_evaluators pe WHERE pe.project_id = ? AND pe.evaluator_id = ?
        ))`;
            accessParams = [projectId, userId, projectId, userId];
        }
        else {
            accessQuery += ' AND admin_id = ?';
            accessParams.push(userId);
        }
        const accessResult = await (0, connection_1.query)(accessQuery, accessParams);
        if (accessResult.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }
        // 기준 목록 조회 (계층 구조 포함)
        const criteriaResult = await (0, connection_1.query)(`SELECT 
          id,
          project_id,
          name,
          description,
          parent_id,
          level,
          weight,
          position,
          created_at,
          updated_at
         FROM criteria 
         WHERE project_id = ? 
         ORDER BY level ASC, position ASC, name ASC`, [projectId]);
        res.json({
            criteria: criteriaResult.rows,
            total: criteriaResult.rows.length
        });
    }
    catch (error) {
        console.error('Criteria fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch criteria' });
    }
});
/**
 * 새 기준 생성
 * POST /api/criteria
 */
router.post('/', auth_1.authenticateToken, [
    (0, express_validator_1.body)('project_id').isInt().withMessage('Valid project ID is required'),
    (0, express_validator_1.body)('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
    (0, express_validator_1.body)('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('parent_id').optional().isInt().withMessage('Parent ID must be an integer'),
    (0, express_validator_1.body)('level').optional().isInt({ min: 1, max: 4 }).withMessage('Level must be between 1 and 4'),
    (0, express_validator_1.body)('position').optional().isInt({ min: 0 }).withMessage('Position must be non-negative')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { project_id, name, description, parent_id, level, position } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        // 관리자 권한 확인
        if (userRole !== 'admin') {
            return res.status(403).json({ error: 'Only project admins can create criteria' });
        }
        // 프로젝트 소유권 확인
        const accessResult = await (0, connection_1.query)('SELECT id FROM projects WHERE id = ? AND admin_id = ?', [project_id, userId]);
        if (accessResult.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }
        // 부모 기준 유효성 검사
        if (parent_id) {
            const parentResult = await (0, connection_1.query)('SELECT level FROM criteria WHERE id = ? AND project_id = ?', [parent_id, project_id]);
            if (parentResult.rows.length === 0) {
                return res.status(404).json({ error: 'Parent criterion not found' });
            }
            if (parentResult.rows[0].level >= 4) {
                return res.status(400).json({ error: 'Cannot create more than 4 levels of criteria hierarchy' });
            }
        }
        // 다음 위치 계산
        let nextPosition = position || 0;
        if (!position && position !== 0) {
            const positionResult = await (0, connection_1.query)('SELECT MAX(position) as max_position FROM criteria WHERE project_id = ? AND level = ?', [project_id, level || 1]);
            nextPosition = (positionResult.rows[0]?.max_position || 0) + 1;
        }
        // 기준 생성
        const result = await (0, connection_1.query)(`INSERT INTO criteria (project_id, name, description, parent_id, level, weight, position)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            project_id,
            name,
            description || null,
            parent_id || null,
            level || 1,
            0, // 초기 가중치
            nextPosition
        ]);
        // 생성된 기준 조회
        const createdCriterion = await (0, connection_1.query)('SELECT * FROM criteria WHERE id = ?', [result.lastID]);
        res.status(201).json({
            message: 'Criterion created successfully',
            criterion: createdCriterion.rows[0]
        });
    }
    catch (error) {
        console.error('Criterion creation error:', error);
        res.status(500).json({ error: 'Failed to create criterion' });
    }
});
/**
 * 기준 수정
 * PUT /api/criteria/:id
 */
router.put('/:id', auth_1.authenticateToken, [
    (0, express_validator_1.param)('id').isInt().withMessage('Criterion ID must be an integer'),
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),
    (0, express_validator_1.body)('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('weight').optional().isFloat({ min: 0, max: 1 }).withMessage('Weight must be between 0 and 1'),
    (0, express_validator_1.body)('position').optional().isInt({ min: 0 }).withMessage('Position must be non-negative')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { id } = req.params;
        const userId = req.user.id;
        const updates = req.body;
        // 기준 존재 및 접근 권한 확인
        const checkResult = await (0, connection_1.query)(`SELECT c.*, p.admin_id 
         FROM criteria c
         JOIN projects p ON c.project_id = p.id
         WHERE c.id = ?`, [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Criterion not found' });
        }
        if (checkResult.rows[0].admin_id !== userId) {
            return res.status(403).json({ error: 'Access denied. Only project admin can modify criteria' });
        }
        // 업데이트 필드 구성
        const updateFields = [];
        const updateValues = [];
        if (updates.name !== undefined) {
            updateFields.push('name = ?');
            updateValues.push(updates.name);
        }
        if (updates.description !== undefined) {
            updateFields.push('description = ?');
            updateValues.push(updates.description);
        }
        if (updates.weight !== undefined) {
            updateFields.push('weight = ?');
            updateValues.push(updates.weight);
        }
        if (updates.position !== undefined) {
            updateFields.push('position = ?');
            updateValues.push(updates.position);
        }
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        // 기준 업데이트
        await (0, connection_1.query)(`UPDATE criteria SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
        // 업데이트된 기준 조회
        const updatedCriterion = await (0, connection_1.query)('SELECT * FROM criteria WHERE id = ?', [id]);
        res.json({
            message: 'Criterion updated successfully',
            criterion: updatedCriterion.rows[0]
        });
    }
    catch (error) {
        console.error('Criterion update error:', error);
        res.status(500).json({ error: 'Failed to update criterion' });
    }
});
/**
 * 기준 삭제
 * DELETE /api/criteria/:id
 */
router.delete('/:id', auth_1.authenticateToken, [
    (0, express_validator_1.param)('id').isInt().withMessage('Criterion ID must be an integer')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { id } = req.params;
        const userId = req.user.id;
        // 기준 존재 및 접근 권한 확인
        const checkResult = await (0, connection_1.query)(`SELECT c.*, p.admin_id 
         FROM criteria c
         JOIN projects p ON c.project_id = p.id
         WHERE c.id = ?`, [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Criterion not found' });
        }
        if (checkResult.rows[0].admin_id !== userId) {
            return res.status(403).json({ error: 'Access denied. Only project admin can delete criteria' });
        }
        // 하위 기준 확인
        const childrenResult = await (0, connection_1.query)('SELECT COUNT(*) as count FROM criteria WHERE parent_id = ?', [id]);
        if (childrenResult.rows[0].count > 0) {
            return res.status(400).json({
                error: 'Cannot delete criterion with sub-criteria. Please delete sub-criteria first.'
            });
        }
        // 기준과 관련된 비교 데이터 확인
        const comparisonsResult = await (0, connection_1.query)('SELECT COUNT(*) as count FROM pairwise_comparisons WHERE element_a_id = ? OR element_b_id = ? OR parent_criteria_id = ?', [id, id, id]);
        if (comparisonsResult.rows[0].count > 0) {
            return res.status(400).json({
                error: 'Cannot delete criterion with existing comparisons. Please delete comparison data first.'
            });
        }
        // 기준 삭제
        await (0, connection_1.query)('DELETE FROM criteria WHERE id = ?', [id]);
        res.json({
            message: 'Criterion deleted successfully',
            deleted_id: parseInt(id)
        });
    }
    catch (error) {
        console.error('Criterion deletion error:', error);
        res.status(500).json({ error: 'Failed to delete criterion' });
    }
});
/**
 * 기준 순서 변경
 * PUT /api/criteria/:id/reorder
 */
router.put('/:id/reorder', auth_1.authenticateToken, [
    (0, express_validator_1.param)('id').isInt().withMessage('Criterion ID must be an integer'),
    (0, express_validator_1.body)('new_position').isInt({ min: 0 }).withMessage('New position must be a non-negative integer')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { id } = req.params;
        const { new_position } = req.body;
        const userId = req.user.id;
        // 기준 존재 및 접근 권한 확인
        const checkResult = await (0, connection_1.query)(`SELECT c.*, p.admin_id 
         FROM criteria c
         JOIN projects p ON c.project_id = p.id
         WHERE c.id = ?`, [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Criterion not found' });
        }
        if (checkResult.rows[0].admin_id !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const criterion = checkResult.rows[0];
        // 같은 레벨의 다른 기준들 위치 조정
        await (0, connection_1.query)(`UPDATE criteria 
         SET position = CASE 
           WHEN position >= ? AND id != ? THEN position + 1
           ELSE position 
         END
         WHERE project_id = ? AND level = ? AND parent_id ${criterion.parent_id ? '= ?' : 'IS NULL'}`, criterion.parent_id
            ? [new_position, id, criterion.project_id, criterion.level, criterion.parent_id]
            : [new_position, id, criterion.project_id, criterion.level]);
        // 대상 기준 위치 업데이트
        await (0, connection_1.query)('UPDATE criteria SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [new_position, id]);
        res.json({
            message: 'Criterion position updated successfully',
            criterion_id: parseInt(id),
            new_position
        });
    }
    catch (error) {
        console.error('Criterion reorder error:', error);
        res.status(500).json({ error: 'Failed to reorder criterion' });
    }
});
exports.default = router;
