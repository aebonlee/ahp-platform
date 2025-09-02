"use strict";
/**
 * 고급 분석 API 라우터
 * 민감도 분석, 예산배분 최적화 등 고급 분석 기능
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const connection_1 = require("../database/connection");
const sensitivityAnalyzer_1 = __importDefault(require("../services/sensitivityAnalyzer"));
const budgetOptimizer_1 = __importDefault(require("../services/budgetOptimizer"));
const router = express_1.default.Router();
/**
 * 실시간 민감도 분석
 * POST /api/analysis/sensitivity/realtime
 */
router.post('/sensitivity/realtime', auth_1.authenticateToken, [
    (0, express_validator_1.body)('project_id').isInt().withMessage('Project ID must be an integer'),
    (0, express_validator_1.body)('criteria_hierarchy').isArray().withMessage('Criteria hierarchy must be an array'),
    (0, express_validator_1.body)('alternative_scores').isArray().withMessage('Alternative scores must be an array'),
    (0, express_validator_1.body)('target_criterion_id').isString().withMessage('Target criterion ID is required'),
    (0, express_validator_1.body)('weight_adjustments').isArray().withMessage('Weight adjustments must be an array')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { project_id, criteria_hierarchy, alternative_scores, target_criterion_id, weight_adjustments } = req.body;
        const userId = req.user.userId;
        // 프로젝트 접근 권한 확인
        const projectCheck = await (0, connection_1.query)(`SELECT pe.* FROM project_evaluators pe 
         WHERE pe.project_id = $1 AND pe.evaluator_id = $2`, [project_id, userId]);
        if (projectCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 민감도 분석 수행
        const sensitivityInput = {
            criteriaHierarchy: criteria_hierarchy,
            alternativeScores: alternative_scores,
            targetCriterionId: target_criterion_id,
            weightAdjustments: weight_adjustments
        };
        const result = sensitivityAnalyzer_1.default.performRealTimeSensitivity(sensitivityInput);
        res.json({
            project_id,
            target_criterion_id,
            analysis_result: result
        });
    }
    catch (error) {
        console.error('Error performing sensitivity analysis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 민감도 시각화 데이터 생성
 * POST /api/analysis/sensitivity/visualization
 */
router.post('/sensitivity/visualization', auth_1.authenticateToken, [
    (0, express_validator_1.body)('project_id').isInt().withMessage('Project ID must be an integer'),
    (0, express_validator_1.body)('criterion_id').isString().withMessage('Criterion ID is required'),
    (0, express_validator_1.body)('alternative_scores').isArray().withMessage('Alternative scores must be an array'),
    (0, express_validator_1.body)('weight_range').optional().isArray().withMessage('Weight range must be an array'),
    (0, express_validator_1.body)('steps').optional().isInt({ min: 5, max: 100 }).withMessage('Steps must be between 5 and 100')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { project_id, criterion_id, alternative_scores, weight_range = [0, 1], steps = 21 } = req.body;
        const userId = req.user.userId;
        // 프로젝트 접근 권한 확인
        const projectCheck = await (0, connection_1.query)(`SELECT pe.* FROM project_evaluators pe 
         WHERE pe.project_id = $1 AND pe.evaluator_id = $2`, [project_id, userId]);
        if (projectCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 시각화 데이터 생성
        const visualizationData = sensitivityAnalyzer_1.default.generateVisualizationData(criterion_id, alternative_scores, weight_range, steps);
        res.json({
            project_id,
            criterion_id,
            weight_range,
            steps,
            visualization_data: visualizationData
        });
    }
    catch (error) {
        console.error('Error generating visualization data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 이진 선택형 예산배분 최적화 (0/1 배낭문제)
 * POST /api/analysis/budget/binary-optimization
 */
router.post('/budget/binary-optimization', auth_1.authenticateToken, [
    (0, express_validator_1.body)('project_id').isInt().withMessage('Project ID must be an integer'),
    (0, express_validator_1.body)('budget_items').isArray().withMessage('Budget items must be an array'),
    (0, express_validator_1.body)('total_budget').isFloat({ min: 0 }).withMessage('Total budget must be positive'),
    (0, express_validator_1.body)('mandatory_items').optional().isArray().withMessage('Mandatory items must be an array'),
    (0, express_validator_1.body)('excluded_items').optional().isArray().withMessage('Excluded items must be an array')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { project_id, budget_items, total_budget, mandatory_items = [], excluded_items = [] } = req.body;
        const userId = req.user.userId;
        // 프로젝트 접근 권한 확인
        const projectCheck = await (0, connection_1.query)(`SELECT pe.* FROM project_evaluators pe 
         WHERE pe.project_id = $1 AND pe.evaluator_id = $2`, [project_id, userId]);
        if (projectCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 예산 제약조건 구성
        const constraint = {
            totalBudget: total_budget,
            mandatoryItems: mandatory_items,
            excludedItems: excluded_items
        };
        // 0/1 배낭문제 해결
        const optimizationResult = budgetOptimizer_1.default.solveBinaryKnapsack(budget_items, constraint);
        // 인사이트 생성
        const insights = budgetOptimizer_1.default.generateInsights(optimizationResult, budget_items);
        res.json({
            project_id,
            optimization_type: 'binary_knapsack',
            constraint,
            result: optimizationResult,
            insights
        });
    }
    catch (error) {
        console.error('Error performing binary optimization:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 연속 배분형 예산배분 최적화 (선형계획법)
 * POST /api/analysis/budget/continuous-optimization
 */
router.post('/budget/continuous-optimization', auth_1.authenticateToken, [
    (0, express_validator_1.body)('project_id').isInt().withMessage('Project ID must be an integer'),
    (0, express_validator_1.body)('budget_items').isArray().withMessage('Budget items must be an array'),
    (0, express_validator_1.body)('total_budget').isFloat({ min: 0 }).withMessage('Total budget must be positive'),
    (0, express_validator_1.body)('min_budget_per_item').optional().isFloat({ min: 0 }).withMessage('Min budget per item must be non-negative'),
    (0, express_validator_1.body)('max_budget_per_item').optional().isFloat({ min: 0 }).withMessage('Max budget per item must be non-negative')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { project_id, budget_items, total_budget, min_budget_per_item, max_budget_per_item } = req.body;
        const userId = req.user.userId;
        // 프로젝트 접근 권한 확인
        const projectCheck = await (0, connection_1.query)(`SELECT pe.* FROM project_evaluators pe 
         WHERE pe.project_id = $1 AND pe.evaluator_id = $2`, [project_id, userId]);
        if (projectCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 예산 제약조건 구성
        const constraint = {
            totalBudget: total_budget,
            minBudgetPerItem: min_budget_per_item,
            maxBudgetPerItem: max_budget_per_item
        };
        // 연속 배분 최적화
        const optimizationResult = budgetOptimizer_1.default.solveContinuousAllocation(budget_items, constraint);
        // 인사이트 생성
        const insights = budgetOptimizer_1.default.generateInsights(optimizationResult, budget_items);
        res.json({
            project_id,
            optimization_type: 'continuous_allocation',
            constraint,
            result: optimizationResult,
            insights
        });
    }
    catch (error) {
        console.error('Error performing continuous optimization:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 예산 시나리오 분석
 * POST /api/analysis/budget/scenario-analysis
 */
router.post('/budget/scenario-analysis', auth_1.authenticateToken, [
    (0, express_validator_1.body)('project_id').isInt().withMessage('Project ID must be an integer'),
    (0, express_validator_1.body)('budget_items').isArray().withMessage('Budget items must be an array'),
    (0, express_validator_1.body)('base_budget').isFloat({ min: 0 }).withMessage('Base budget must be positive'),
    (0, express_validator_1.body)('scenarios').optional().isArray().withMessage('Scenarios must be an array'),
    (0, express_validator_1.body)('is_binary').optional().isBoolean().withMessage('is_binary must be boolean'),
    (0, express_validator_1.body)('mandatory_items').optional().isArray().withMessage('Mandatory items must be an array'),
    (0, express_validator_1.body)('excluded_items').optional().isArray().withMessage('Excluded items must be an array')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { project_id, budget_items, base_budget, scenarios = [-20, -10, 10, 20], is_binary = false, mandatory_items = [], excluded_items = [] } = req.body;
        const userId = req.user.userId;
        // 프로젝트 접근 권한 확인
        const projectCheck = await (0, connection_1.query)(`SELECT pe.* FROM project_evaluators pe 
         WHERE pe.project_id = $1 AND pe.evaluator_id = $2`, [project_id, userId]);
        if (projectCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 기본 제약조건 구성
        const baseConstraint = {
            totalBudget: base_budget,
            mandatoryItems: mandatory_items,
            excludedItems: excluded_items
        };
        // 시나리오 분석 수행
        const scenarioAnalysis = budgetOptimizer_1.default.performScenarioAnalysis(budget_items, baseConstraint, scenarios, is_binary);
        res.json({
            project_id,
            base_budget,
            scenarios,
            optimization_type: is_binary ? 'binary_knapsack' : 'continuous_allocation',
            analysis_result: scenarioAnalysis
        });
    }
    catch (error) {
        console.error('Error performing scenario analysis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * 효율성 기반 추천
 * GET /api/analysis/budget/efficiency-recommendations/:projectId
 */
router.get('/budget/efficiency-recommendations/:projectId', auth_1.authenticateToken, [
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
        const topK = parseInt(req.query.top_k) || 5;
        // 프로젝트 접근 권한 확인
        const projectCheck = await (0, connection_1.query)(`SELECT pe.* FROM project_evaluators pe 
         WHERE pe.project_id = $1 AND pe.evaluator_id = $2`, [projectId, userId]);
        if (projectCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Access denied to this project' });
        }
        // 대안별 최신 결과 조회
        const resultsQuery = await (0, connection_1.query)(`SELECT ar.alternative_scores, ar.criteria_weights
         FROM ahp_results ar
         WHERE ar.project_id = $1 AND ar.evaluator_id = $2 AND ar.result_type = 'individual'
         ORDER BY ar.updated_at DESC LIMIT 1`, [projectId, userId]);
        if (resultsQuery.rowCount === 0) {
            return res.status(404).json({ error: 'No results found for efficiency analysis' });
        }
        const alternativeScores = JSON.parse(resultsQuery.rows[0].alternative_scores);
        // 임시 비용 데이터 생성 (실제로는 별도 테이블에서 조회)
        const budgetItems = Object.entries(alternativeScores).map(([altId, score]) => ({
            alternativeId: altId,
            alternativeName: `Alternative ${altId}`,
            cost: Math.random() * 500000 + 100000, // 임시 비용
            utility: score,
            efficiency: score / (Math.random() * 500000 + 100000)
        }));
        // 효율성 기반 추천
        const recommendations = budgetOptimizer_1.default.getEfficiencyRecommendations(budgetItems, topK);
        res.json({
            project_id: projectId,
            top_k: topK,
            recommendations
        });
    }
    catch (error) {
        console.error('Error generating efficiency recommendations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
