"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const migrate_1 = require("./database/migrate");
const connection_1 = require("./database/connection");
const workshopSync_1 = __importDefault(require("./services/workshopSync"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const projects_1 = __importDefault(require("./routes/projects"));
const criteria_1 = __importDefault(require("./routes/criteria"));
const alternatives_1 = __importDefault(require("./routes/alternatives"));
const comparisons_1 = __importDefault(require("./routes/comparisons"));
const evaluate_1 = __importDefault(require("./routes/evaluate"));
const evaluators_1 = __importDefault(require("./routes/evaluators"));
const results_1 = __importDefault(require("./routes/results"));
const analysis_1 = __importDefault(require("./routes/analysis"));
const matrix_1 = __importDefault(require("./routes/matrix"));
const compute_1 = __importDefault(require("./routes/compute"));
const export_1 = __importDefault(require("./routes/export"));
const subscription_1 = __importDefault(require("./routes/subscription"));
const support_1 = __importDefault(require("./routes/support"));
const news_1 = __importDefault(require("./routes/news"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 5000;
// Initialize WebSocket service (disabled for deployment)
const workshopSync = new workshopSync_1.default(httpServer);
console.log('🚀 AHP Platform Backend v2.3.2 - Auth Routes Fix');
// Trust proxy for Render.com
app.set('trust proxy', 1);
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
}));
// Enhanced CORS configuration for production
const allowedOrigins = [
    'http://localhost:3000',
    'https://aebonlee.github.io',
    'https://ahp-platform.onrender.com'
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.CORS_ORIGIN === origin) {
            return callback(null, true);
        }
        // In development, allow any origin
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Manual migration endpoint for production debugging
app.post('/api/admin/migrate', async (req, res) => {
    try {
        console.log('🔧 Manual migration requested...');
        await (0, migrate_1.runMigrations)();
        res.json({ success: true, message: 'Database migrations completed successfully' });
    }
    catch (error) {
        console.error('❌ Manual migration failed:', error);
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
});
// Check users in database
app.get('/api/admin/users', async (req, res) => {
    try {
        const { query } = await Promise.resolve().then(() => __importStar(require('./database/connection')));
        const result = await query('SELECT id, email, first_name, last_name, role, is_active FROM users ORDER BY id');
        res.json({ users: result.rows });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
});
// Create test user endpoint
app.post('/api/admin/create-test-user', async (req, res) => {
    try {
        const { query } = await Promise.resolve().then(() => __importStar(require('./database/connection')));
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('test123', 10);
        await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) 
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active
    `, ['test@ahp.com', hashedPassword, 'Test', 'User', 'admin', true]);
        res.json({ success: true, message: 'Test user created: test@ahp.com / test123' });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
});
// Emergency phantom project cleanup endpoint (no auth required)
app.post('/api/emergency/cleanup-phantom-projects', async (req, res) => {
    try {
        const { confirm } = req.body;
        if (confirm !== 'CLEANUP_PHANTOM_PROJECTS_EMERGENCY') {
            return res.status(400).json({
                success: false,
                message: 'To confirm cleanup, send { "confirm": "CLEANUP_PHANTOM_PROJECTS_EMERGENCY" }'
            });
        }
        console.log('🚨 긴급 허수 프로젝트 정리 시작...');
        const { query } = await Promise.resolve().then(() => __importStar(require('./database/connection')));
        // 1. 현재 프로젝트 목록 확인
        const projectsResult = await query(`
      SELECT p.id, p.title, p.name, p.description, p.status, p.admin_id, p.created_at,
             u.email as admin_email,
             (SELECT COUNT(*) FROM criteria WHERE project_id = p.id) as criteria_count,
             (SELECT COUNT(*) FROM alternatives WHERE project_id = p.id) as alternatives_count,
             (SELECT COUNT(*) FROM project_evaluators WHERE project_id = p.id) as evaluators_count
      FROM projects p
      LEFT JOIN users u ON p.admin_id = u.id
      ORDER BY p.created_at DESC
    `);
        console.log(`📊 현재 프로젝트 총 개수: ${projectsResult.rows.length}개`);
        // 2. 허수/테스트 데이터 식별
        const phantomProjects = projectsResult.rows.filter((project) => {
            const title = (project.title || '').toLowerCase();
            const description = (project.description || '').toLowerCase();
            const name = (project.name || '').toLowerCase();
            // 테스트 관련 키워드
            const testKeywords = [
                '테스트', 'test', 'sample', 'demo', 'example', 'prototype',
                'ai 개발 활용', '스마트폰 선택', '직원 채용', '투자 포트폴리오',
                'artificial', 'smartphone', 'employee', 'investment', '중요도 분석'
            ];
            // 빈 프로젝트 (criteria, alternatives, evaluators 모두 0인 경우)
            const isEmpty = project.criteria_count === 0 &&
                project.alternatives_count === 0 &&
                project.evaluators_count === 0;
            // 키워드 매칭
            const hasTestKeyword = testKeywords.some(keyword => title.includes(keyword) || description.includes(keyword) || name.includes(keyword));
            // 관리자가 test@ahp.com인 경우 (테스트 계정)
            const isTestAccount = project.admin_email === 'test@ahp.com';
            return hasTestKeyword || isEmpty || isTestAccount;
        });
        console.log(`🔍 발견된 허수/테스트 프로젝트: ${phantomProjects.length}개`);
        console.log('삭제 대상:', phantomProjects.map(p => `${p.id}: "${p.title}"`));
        if (phantomProjects.length === 0) {
            return res.json({
                success: true,
                message: '삭제할 허수 데이터가 없습니다.',
                deleted_count: 0,
                remaining_count: projectsResult.rows.length
            });
        }
        // 3. 허수 프로젝트 삭제 (CASCADE로 관련 데이터 자동 삭제)
        console.log('🗑️ 허수 프로젝트 삭제 중...');
        const phantomProjectIds = phantomProjects.map((p) => p.id);
        // 배치 삭제
        await query('DELETE FROM projects WHERE id = ANY($1)', [phantomProjectIds]);
        // 4. 정리 후 상태 확인
        const finalResult = await query('SELECT COUNT(*) as count FROM projects');
        const remainingCount = parseInt(finalResult.rows[0].count);
        console.log(`✅ ${phantomProjects.length}개 허수 프로젝트 삭제 완료`);
        console.log(`📊 정리 후 프로젝트 개수: ${remainingCount}개`);
        res.json({
            success: true,
            message: `${phantomProjects.length}개의 허수 프로젝트가 성공적으로 삭제되었습니다.`,
            deleted_count: phantomProjects.length,
            remaining_count: remainingCount,
            deleted_projects: phantomProjects.map((p) => ({
                id: p.id,
                title: p.title,
                admin_email: p.admin_email,
                criteria_count: p.criteria_count,
                alternatives_count: p.alternatives_count,
                evaluators_count: p.evaluators_count
            }))
        });
    }
    catch (error) {
        console.error('❌ 긴급 허수 프로젝트 정리 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '허수 프로젝트 정리 중 오류가 발생했습니다.',
            error: error.message
        });
    }
});
// Sample data creation endpoint for production
app.post('/api/admin/create-sample-data', async (req, res) => {
    try {
        console.log('🔧 Creating sample data...');
        const { query } = await Promise.resolve().then(() => __importStar(require('./database/connection')));
        // Create sample news posts
        await query(`
      INSERT INTO news_posts (title, content, summary, author_name, category, featured, published, views) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8),
      ($9, $10, $11, $12, $13, $14, $15, $16),
      ($17, $18, $19, $20, $21, $22, $23, $24),
      ($25, $26, $27, $28, $29, $30, $31, $32),
      ($33, $34, $35, $36, $37, $38, $39, $40),
      ($41, $42, $43, $44, $45, $46, $47, $48)
      ON CONFLICT DO NOTHING
    `, [
            'AURI 스타일 UI/UX 개편 완료 - 더욱 직관적인 사용자 경험 제공',
            '사용자 피드백을 반영하여 전면적인 디자인 개선을 완료했습니다. 미니멀하고 깔끔한 인터페이스로 연구 효율성을 높였습니다.',
            '새로운 AURI 스타일 디자인으로 UI/UX 전면 개편',
            '개발팀',
            'platform',
            true,
            true,
            324,
            '국내 주요 대학 1,000+ 논문에서 AHP 분석 도구 활용 검증',
            '서울대, 연세대, 고려대 등 주요 대학의 논문 연구에서 우리 플랫폼을 활용한 AHP 분석 결과가 높은 신뢰도를 보였습니다.',
            '주요 대학 1,000+ 논문에서 AHP 도구 활용 성과 검증',
            '연구팀',
            'research',
            true,
            true,
            567,
            '한국직업능력개발센터와 AHP 연구 플랫폼 파트너십 체결',
            '교육 및 연구 분야의 의사결정 지원을 위한 전략적 파트너십을 체결했습니다.',
            '교육 연구 분야 의사결정 지원 파트너십 체결',
            '경영진',
            'news',
            false,
            true,
            445,
            '삼성전자 연구소 - AHP를 활용한 신제품 개발 우선순위 분석 사례',
            '삼성전자 연구소에서 신제품 개발 프로젝트의 우선순위를 결정하기 위해 우리 플랫폼을 활용했습니다.',
            '삼성전자 연구소 신제품 개발 우선순위 분석 성공 사례',
            '사례연구팀',
            'case',
            false,
            true,
            678,
            '2024년 하반기 AHP 연구 워크샵 개최 안내',
            '9월 15일부터 17일까지 3일간 AHP 방법론과 플랫폼 활용법을 배우는 워크샵을 개최합니다.',
            'AHP 방법론 및 플랫폼 활용 워크샵 개최',
            '교육팀',
            'event',
            false,
            true,
            234,
            'AI 기반 일관성 개선 기능 베타 출시',
            '인공지능을 활용하여 쌍대비교의 일관성을 자동으로 개선해주는 새로운 기능을 베타 버전으로 출시했습니다.',
            'AI 기반 쌍대비교 일관성 자동 개선 기능 베타 출시',
            'AI개발팀',
            'platform',
            false,
            true,
            512
        ]);
        // Create sample support posts
        await query(`
      INSERT INTO support_posts (title, content, author_name, author_email, category, status, views) VALUES
      ($1, $2, $3, $4, $5, $6, $7),
      ($8, $9, $10, $11, $12, $13, $14),
      ($15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT DO NOTHING
    `, [
            'AHP 분석 결과의 일관성 비율이 0.1을 초과할 때 해결 방법',
            '쌍대비교를 진행했는데 일관성 비율이 0.15가 나왔습니다. 어떻게 개선할 수 있을까요?',
            '연구자김',
            'kim.researcher@university.ac.kr',
            'technical',
            'answered',
            127,
            '평가자 초대 메일이 발송되지 않는 문제',
            '프로젝트에 평가자를 초대했는데 메일이 발송되지 않고 있습니다.',
            '교수박',
            'park.professor@college.edu',
            'bug',
            'open',
            89,
            '기관 플랜 할인 문의',
            '대학교에서 단체로 이용할 예정인데 할인 혜택이 있나요?',
            '관리자이',
            'lee.admin@institution.org',
            'billing',
            'answered',
            156
        ]);
        console.log('✅ Sample data created successfully');
        res.json({ success: true, message: 'Sample data created successfully' });
    }
    catch (error) {
        console.error('❌ Sample data creation failed:', error);
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
});
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/criteria', criteria_1.default);
app.use('/api/alternatives', alternatives_1.default);
app.use('/api/comparisons', comparisons_1.default);
app.use('/api/evaluate', evaluate_1.default);
app.use('/api/evaluators', evaluators_1.default);
app.use('/api/results', results_1.default);
app.use('/api/analysis', analysis_1.default);
app.use('/api/matrix', matrix_1.default);
app.use('/api/compute', compute_1.default);
app.use('/api/export', export_1.default);
app.use('/api/subscription', subscription_1.default);
app.use('/api/support', support_1.default);
app.use('/api/news', news_1.default);
app.use('/api/admin', admin_1.default);
// API-only backend - no static file serving
app.get('/', (req, res) => {
    res.json({
        message: 'AHP Platform Backend API Server',
        version: '2.3.2',
        status: 'running',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth/*',
            users: '/api/users/*',
            projects: '/api/projects/*'
        }
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Workshop status API endpoints
app.get('/api/workshop/:projectId', (req, res) => {
    const workshopInfo = workshopSync.getWorkshopInfo(req.params.projectId);
    if (workshopInfo) {
        res.json(workshopInfo);
    }
    else {
        res.status(404).json({ error: 'Workshop not found' });
    }
});
app.get('/api/workshops', (req, res) => {
    const workshops = workshopSync.getAllWorkshops();
    res.json({ workshops });
});
// Start server
const server = httpServer.listen(PORT, async () => {
    console.log(`🚀 AHP Backend Server started with PostgreSQL`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🔗 Health check: /api/health`);
    try {
        console.log('🔧 Initializing PostgreSQL database...');
        await (0, connection_1.initDatabase)();
        console.log('✅ PostgreSQL database initialized successfully');
    }
    catch (error) {
        console.error('❌ Failed to initialize database:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        // Continue running the server even if database init fails
        console.log('⚠️ Server starting without database initialization');
    }
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
