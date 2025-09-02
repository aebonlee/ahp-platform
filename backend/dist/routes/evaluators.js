"use strict";
/**
 * 평가자 관리 API 라우터
 * 평가자 배정, 가중치 설정, 진행상황 추적 등을 처리
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const connection_1 = require("../database/connection");
const crypto_1 = __importDefault(require("crypto"));
const router = express_1.default.Router();
/**
 * 프로젝트에 평가자 추가
 * POST /api/evaluators/assign
 */
router.post('/assign', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), [
    (0, express_validator_1.body)('project_id').isInt().withMessage('Project ID must be an integer'),
    (0, express_validator_1.body)('evaluator_code').isString().isLength({ min: 1, max: 50 }).withMessage('Evaluator code is required'),
    (0, express_validator_1.body)('evaluator_name').isString().isLength({ min: 1 }).withMessage('Evaluator name is required'),
    (0, express_validator_1.body)('weight').optional().isFloat({ min: 0.1, max: 10 }).withMessage('Weight must be between 0.1 and 10')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { project_id, evaluator_code, evaluator_name, weight = 1.0 } = req.body;
        const adminId = req.user.userId;
        // 프로젝트 소유권 확인
        const projectCheck = await (0, connection_1.query)('SELECT * FROM projects WHERE id = $1 AND created_by = $2', [project_id, adminId]);
        if (projectCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 평가자 코드 중복 확인
        const duplicateCheck = await (0, connection_1.query)('SELECT * FROM project_evaluators WHERE project_id = $1 AND evaluator_code = $2', [project_id, evaluator_code.toUpperCase()]);
        if (duplicateCheck.rowCount > 0) {
            return res.status(400).json({ error: 'Evaluator code already exists in this project' });
        }
        // 평가자 계정 생성 또는 조회
        let evaluatorUser;
        const existingUser = await (0, connection_1.query)('SELECT * FROM users WHERE email = $1', [`${evaluator_code.toLowerCase()}@evaluator.local`]);
        if (existingUser.rowCount > 0) {
            evaluatorUser = existingUser.rows[0];
        }
        else {
            // 새 평가자 계정 생성
            const newUser = await (0, connection_1.query)(`INSERT INTO users (email, password_hash, first_name, last_name, role)
           VALUES ($1, $2, $3, $4, 'evaluator')
           RETURNING *`, [
                `${evaluator_code.toLowerCase()}@evaluator.local`,
                await hashPassword('defaultpassword'), // 임시 비밀번호
                evaluator_name,
                'Evaluator'
            ]);
            evaluatorUser = newUser.rows[0];
        }
        // 접속키 생성
        const accessKey = generateAccessKey(evaluator_code.toUpperCase(), project_id);
        // 프로젝트에 평가자 배정
        const assignment = await (0, connection_1.query)(`INSERT INTO project_evaluators (project_id, evaluator_id, evaluator_code, access_key)
         VALUES ($1, $2, $3, $4)
         RETURNING *`, [project_id, evaluatorUser.id, evaluator_code.toUpperCase(), accessKey]);
        // 평가자 가중치 설정
        await (0, connection_1.query)(`INSERT INTO evaluator_weights (project_id, evaluator_id, weight)
         VALUES ($1, $2, $3)`, [project_id, evaluatorUser.id, weight]);
        // 진행상황 초기화
        await (0, connection_1.query)(`INSERT INTO evaluator_progress (project_id, evaluator_id, total_tasks, completed_tasks, completion_rate)
         VALUES ($1, $2, 0, 0, 0.0)`, [project_id, evaluatorUser.id]);
        res.status(201).json({
            message: 'Evaluator assigned successfully',
            evaluator: {
                id: evaluatorUser.id,
                code: evaluator_code.toUpperCase(),
                name: evaluator_name,
                email: evaluatorUser.email,
                access_key: accessKey,
                weight: weight,
                assignment_id: assignment.rows[0].id
            }
        });
    }
    catch (error) {
        console.error('Error assigning evaluator:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 프로젝트의 평가자 목록 조회
 * GET /api/evaluators/project/:projectId
 */
router.get('/project/:projectId', auth_1.authenticateToken, [
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
        const projectId = parseInt(req.params.projectId);
        const userId = req.user.userId;
        const userRole = req.user.role;
        // 접근 권한 확인
        let accessQuery;
        if (userRole === 'admin') {
            // 관리자는 자신이 생성한 프로젝트의 평가자 목록 조회
            accessQuery = await (0, connection_1.query)('SELECT * FROM projects WHERE id = $1 AND created_by = $2', [projectId, userId]);
        }
        else {
            // 평가자는 자신이 배정된 프로젝트인지 확인
            accessQuery = await (0, connection_1.query)('SELECT * FROM project_evaluators WHERE project_id = $1 AND evaluator_id = $2', [projectId, userId]);
        }
        if (accessQuery.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 평가자 목록 조회
        const evaluators = await (0, connection_1.query)(`SELECT 
          u.id,
          u.name,
          u.email,
          pe.evaluator_code,
          pe.access_key,
          ew.weight,
          ep.completion_rate,
          ep.is_completed,
          ep.completed_at,
          pe.created_at as assigned_at
         FROM project_evaluators pe
         JOIN users u ON pe.evaluator_id = u.id
         LEFT JOIN evaluator_weights ew ON pe.project_id = ew.project_id AND pe.evaluator_id = ew.evaluator_id
         LEFT JOIN evaluator_progress ep ON pe.project_id = ep.project_id AND pe.evaluator_id = ep.evaluator_id
         WHERE pe.project_id = $1
         ORDER BY pe.evaluator_code`, [projectId]);
        res.json({
            evaluators: evaluators.rows.map(row => ({
                id: row.id,
                code: row.evaluator_code,
                name: row.name,
                email: userRole === 'admin' ? row.email : undefined, // 이메일은 관리자만 조회
                access_key: userRole === 'admin' ? row.access_key : undefined, // 접속키는 관리자만 조회
                weight: row.weight || 1.0,
                completion_rate: row.completion_rate || 0,
                is_completed: row.is_completed || false,
                completed_at: row.completed_at,
                assigned_at: row.assigned_at
            }))
        });
    }
    catch (error) {
        console.error('Error fetching evaluators:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 평가자 초대 이메일 발송
 * POST /api/evaluators/invite
 */
router.post('/invite', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), [
    (0, express_validator_1.body)('evaluatorId').isString().withMessage('Evaluator ID is required'),
    (0, express_validator_1.body)('projectId').isString().withMessage('Project ID is required'),
    (0, express_validator_1.body)('emailContent').isObject().withMessage('Email content is required'),
    (0, express_validator_1.body)('shortLink').isString().withMessage('Short link is required')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { evaluatorId, projectId, emailContent, shortLink } = req.body;
        // 여기서 실제 이메일 발송 로직 구현
        // 예: SendGrid, Nodemailer 등 사용
        console.log('Sending invitation email:', {
            to: emailContent.to,
            subject: emailContent.subject,
            body: emailContent.body,
            shortLink
        });
        // 초대 상태 업데이트 (project_evaluators 테이블에 저장)
        await (0, connection_1.query)(`UPDATE project_evaluators 
         SET invitation_sent_at = NOW()
         WHERE evaluator_id = $1 AND project_id = $2`, [evaluatorId, projectId]);
        res.json({
            success: true,
            message: 'Invitation sent successfully',
            evaluatorId,
            shortLink
        });
    }
    catch (error) {
        console.error('Error sending invitation:', error);
        res.status(500).json({ error: 'Failed to send invitation' });
    }
});
/**
 * 평가자 목록 조회 (개선된 버전)
 * GET /api/evaluators
 */
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { projectId } = req.query;
        let evaluatorsQuery = `
        SELECT 
          u.id,
          u.email,
          u.first_name || ' ' || u.last_name as name,
          u.created_at,
          array_agg(DISTINCT pe.project_id) as assigned_projects
        FROM users u
        LEFT JOIN project_evaluators pe ON u.id = pe.evaluator_id
        WHERE u.role = 'evaluator'
      `;
        const params = [];
        if (projectId) {
            evaluatorsQuery += ` AND pe.project_id = $1`;
            params.push(projectId);
        }
        evaluatorsQuery += ` GROUP BY u.id ORDER BY u.created_at DESC`;
        const result = await (0, connection_1.query)(evaluatorsQuery, params);
        res.json({
            evaluators: result.rows.map(row => ({
                id: row.id,
                email: row.email,
                name: row.name,
                assignedProjects: row.assigned_projects || [],
                createdAt: row.created_at
            }))
        });
    }
    catch (error) {
        console.error('Error fetching evaluators:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 평가자 추가 (개선된 버전)
 * POST /api/evaluators
 */
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('name').isString().isLength({ min: 1 }).withMessage('Name is required'),
    (0, express_validator_1.body)('phone').optional().isString(),
    (0, express_validator_1.body)('projectId').optional().isString()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { email, name, phone, projectId } = req.body;
        const adminId = req.user.userId;
        // 이메일 중복 확인 (users 테이블에서 확인)
        const existingCheck = await (0, connection_1.query)('SELECT * FROM users WHERE email = $1', [email]);
        if (existingCheck.rowCount > 0) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        // 평가자 사용자 생성 (users 테이블에)
        const hashedPassword = await hashPassword('defaultpassword'); // 임시 비밀번호
        const result = await (0, connection_1.query)(`INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, 'evaluator')
         RETURNING *`, [email, hashedPassword, name, 'Evaluator']);
        const evaluator = result.rows[0];
        // 프로젝트에 배정
        if (projectId) {
            // 평가자 코드 생성
            const evaluatorCode = `EVAL${evaluator.id}`;
            const accessKey = generateAccessKey(evaluatorCode, projectId);
            await (0, connection_1.query)(`INSERT INTO project_evaluators (project_id, evaluator_id, evaluator_code, access_key)
           VALUES ($1, $2, $3, $4)`, [projectId, evaluator.id, evaluatorCode, accessKey]);
        }
        res.json({
            evaluator: {
                id: evaluator.id,
                email: evaluator.email,
                name: evaluator.name,
                phone: evaluator.phone,
                assignedProjects: projectId ? [projectId] : [],
                invitationStatus: 'pending',
                createdAt: evaluator.created_at
            }
        });
    }
    catch (error) {
        console.error('Error creating evaluator:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 평가자 가중치 업데이트
 * PUT /api/evaluators/:evaluatorId/weight
 */
router.put('/:evaluatorId/weight', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), [
    (0, express_validator_1.param)('evaluatorId').isInt().withMessage('Evaluator ID must be an integer'),
    (0, express_validator_1.body)('project_id').isInt().withMessage('Project ID must be an integer'),
    (0, express_validator_1.body)('weight').isFloat({ min: 0.1, max: 10 }).withMessage('Weight must be between 0.1 and 10')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const evaluatorId = parseInt(req.params.evaluatorId);
        const { project_id, weight } = req.body;
        const adminId = req.user.userId;
        // 프로젝트 소유권 확인
        const projectCheck = await (0, connection_1.query)('SELECT * FROM projects WHERE id = $1 AND created_by = $2', [project_id, adminId]);
        if (projectCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 평가자 배정 확인
        const evaluatorCheck = await (0, connection_1.query)('SELECT * FROM project_evaluators WHERE project_id = $1 AND evaluator_id = $2', [project_id, evaluatorId]);
        if (evaluatorCheck.rowCount === 0) {
            return res.status(404).json({ error: 'Evaluator not assigned to this project' });
        }
        // 가중치 업데이트
        await (0, connection_1.query)(`INSERT INTO evaluator_weights (project_id, evaluator_id, weight)
         VALUES ($1, $2, $3)
         ON CONFLICT (project_id, evaluator_id)
         DO UPDATE SET weight = $3, updated_at = CURRENT_TIMESTAMP`, [project_id, evaluatorId, weight]);
        res.json({
            message: 'Evaluator weight updated successfully',
            project_id,
            evaluator_id: evaluatorId,
            weight
        });
    }
    catch (error) {
        console.error('Error updating evaluator weight:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 프로젝트에서 평가자 제거
 * DELETE /api/evaluators/:evaluatorId/project/:projectId
 */
router.delete('/:evaluatorId/project/:projectId', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), [
    (0, express_validator_1.param)('evaluatorId').isInt().withMessage('Evaluator ID must be an integer'),
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
        const evaluatorId = parseInt(req.params.evaluatorId);
        const projectId = parseInt(req.params.projectId);
        const adminId = req.user.userId;
        // 프로젝트 소유권 확인
        const projectCheck = await (0, connection_1.query)('SELECT * FROM projects WHERE id = $1 AND created_by = $2', [projectId, adminId]);
        if (projectCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 트랜잭션으로 평가자 관련 모든 데이터 삭제
        await (0, connection_1.query)('BEGIN');
        try {
            // 1. 워크숍 참가자 삭제
            await (0, connection_1.query)('DELETE FROM workshop_participants WHERE workshop_session_id IN (SELECT id FROM workshop_sessions WHERE project_id = $1) AND participant_id = $2', [projectId, evaluatorId]);
            // 2. 평가자 진행 상황 삭제
            await (0, connection_1.query)('DELETE FROM evaluator_progress WHERE project_id = $1 AND evaluator_id = $2', [projectId, evaluatorId]);
            // 3. 평가자 가중치 삭제
            await (0, connection_1.query)('DELETE FROM evaluator_weights WHERE project_id = $1 AND evaluator_id = $2', [projectId, evaluatorId]);
            // 4. 평가자의 평가 데이터 삭제
            await (0, connection_1.query)('DELETE FROM evaluator_assessments WHERE participant_id IN (SELECT id FROM workshop_participants WHERE participant_id = $1)', [evaluatorId]);
            // 5. 프로젝트-평가자 연결 삭제
            const result = await (0, connection_1.query)('DELETE FROM project_evaluators WHERE project_id = $1 AND evaluator_id = $2 RETURNING *', [projectId, evaluatorId]);
            if (result.rowCount === 0) {
                await (0, connection_1.query)('ROLLBACK');
                return res.status(404).json({ error: 'Evaluator not found in this project' });
            }
            await (0, connection_1.query)('COMMIT');
            res.json({
                message: 'Evaluator and all related data removed successfully',
                project_id: projectId,
                evaluator_id: evaluatorId,
                removed_data: {
                    project_evaluator: true,
                    evaluator_weights: true,
                    evaluator_progress: true,
                    workshop_participation: true,
                    evaluation_assessments: true
                }
            });
        }
        catch (error) {
            await (0, connection_1.query)('ROLLBACK');
            throw error;
        }
    }
    catch (error) {
        console.error('Error removing evaluator:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 평가자 완전 삭제 (모든 프로젝트에서 제거)
 * DELETE /api/evaluators/:evaluatorId
 */
router.delete('/:evaluatorId', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), [
    (0, express_validator_1.param)('evaluatorId').isInt().withMessage('Evaluator ID must be an integer')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const evaluatorId = parseInt(req.params.evaluatorId);
        // 트랜잭션으로 평가자 완전 삭제
        await (0, connection_1.query)('BEGIN');
        try {
            // 평가자가 참여한 모든 프로젝트에서 데이터 삭제
            const projectsResult = await (0, connection_1.query)('SELECT DISTINCT project_id FROM project_evaluators WHERE evaluator_id = $1', [evaluatorId]);
            for (const project of projectsResult.rows) {
                const projectId = project.project_id;
                // 워크숍 데이터 삭제
                await (0, connection_1.query)('DELETE FROM workshop_participants WHERE workshop_session_id IN (SELECT id FROM workshop_sessions WHERE project_id = $1) AND participant_id = $2', [projectId, evaluatorId]);
                // 평가자 관련 데이터 삭제
                await (0, connection_1.query)('DELETE FROM evaluator_progress WHERE project_id = $1 AND evaluator_id = $2', [projectId, evaluatorId]);
                await (0, connection_1.query)('DELETE FROM evaluator_weights WHERE project_id = $1 AND evaluator_id = $2', [projectId, evaluatorId]);
            }
            // 모든 프로젝트에서 평가자 제거
            await (0, connection_1.query)('DELETE FROM project_evaluators WHERE evaluator_id = $1', [evaluatorId]);
            // 평가자 계정 삭제 (role이 evaluator인 경우만)
            const userResult = await (0, connection_1.query)('DELETE FROM users WHERE id = $1 AND role = $2 RETURNING *', [evaluatorId, 'evaluator']);
            if (userResult.rowCount === 0) {
                await (0, connection_1.query)('ROLLBACK');
                return res.status(404).json({ error: 'Evaluator not found or cannot be deleted' });
            }
            await (0, connection_1.query)('COMMIT');
            res.json({
                message: 'Evaluator completely removed from all projects',
                evaluator_id: evaluatorId,
                removed_from_projects: projectsResult.rows.length,
                deleted_user_account: true
            });
        }
        catch (error) {
            await (0, connection_1.query)('ROLLBACK');
            throw error;
        }
    }
    catch (error) {
        console.error('Error completely removing evaluator:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 평가자 진행상황 조회
 * GET /api/evaluators/progress/:projectId
 */
router.get('/progress/:projectId', auth_1.authenticateToken, [
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
        const projectId = parseInt(req.params.projectId);
        const userId = req.user.userId;
        const userRole = req.user.role;
        // 접근 권한 확인
        let accessQuery;
        if (userRole === 'admin') {
            accessQuery = await (0, connection_1.query)('SELECT * FROM projects WHERE id = $1 AND created_by = $2', [projectId, userId]);
        }
        else {
            accessQuery = await (0, connection_1.query)('SELECT * FROM project_evaluators WHERE project_id = $1 AND evaluator_id = $2', [projectId, userId]);
        }
        if (accessQuery.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 진행상황 조회
        const progress = await (0, connection_1.query)(`SELECT 
          u.id as evaluator_id,
          u.name as evaluator_name,
          pe.evaluator_code,
          ep.total_tasks,
          ep.completed_tasks,
          ep.completion_rate,
          ep.is_completed,
          ep.completed_at,
          ep.updated_at
         FROM evaluator_progress ep
         JOIN project_evaluators pe ON ep.project_id = pe.project_id AND ep.evaluator_id = pe.evaluator_id
         JOIN users u ON ep.evaluator_id = u.id
         WHERE ep.project_id = $1
         ORDER BY ep.completion_rate DESC, pe.evaluator_code`, [projectId]);
        // 전체 진행률 계산
        const totalProgress = progress.rows.length > 0
            ? progress.rows.reduce((sum, row) => sum + row.completion_rate, 0) / progress.rows.length
            : 0;
        const completedCount = progress.rows.filter(row => row.is_completed).length;
        res.json({
            project_id: projectId,
            overall_progress: totalProgress,
            total_evaluators: progress.rows.length,
            completed_evaluators: completedCount,
            evaluator_progress: progress.rows
        });
    }
    catch (error) {
        console.error('Error fetching evaluator progress:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 접속키로 평가자 인증
 * POST /api/evaluators/auth/access-key
 */
router.post('/auth/access-key', [
    (0, express_validator_1.body)('access_key').isString().isLength({ min: 1 }).withMessage('Access key is required')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { access_key } = req.body;
        // 접속키로 평가자 정보 조회
        const evaluatorInfo = await (0, connection_1.query)(`SELECT 
          pe.project_id,
          pe.evaluator_id,
          pe.evaluator_code,
          pe.access_key,
          u.name as evaluator_name,
          p.title as project_title,
          p.description as project_description
         FROM project_evaluators pe
         JOIN users u ON pe.evaluator_id = u.id
         JOIN projects p ON pe.project_id = p.id
         WHERE pe.access_key = $1`, [access_key.toUpperCase()]);
        if (evaluatorInfo.rowCount === 0) {
            return res.status(401).json({ error: 'Invalid access key' });
        }
        const info = evaluatorInfo.rows[0];
        res.json({
            valid: true,
            evaluator_id: info.evaluator_id,
            evaluator_code: info.evaluator_code,
            evaluator_name: info.evaluator_name,
            project_id: info.project_id,
            project_title: info.project_title,
            project_description: info.project_description
        });
    }
    catch (error) {
        console.error('Error validating access key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 헬퍼 함수들
 */
// 접속키 생성
function generateAccessKey(evaluatorCode, projectId) {
    const projectCode = projectId.toString().padStart(4, '0');
    return `${evaluatorCode}-${projectCode}`;
}
// 비밀번호 해시 생성 (간단한 구현)
async function hashPassword(password) {
    return crypto_1.default.createHash('sha256').update(password).digest('hex');
}
exports.default = router;
