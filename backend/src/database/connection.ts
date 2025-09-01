import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

let query: (sql: string, params?: any[]) => Promise<any>;
let initDatabase: () => Promise<void>;

// PostgreSQL 연결 설정
const databaseUrl = process.env.DATABASE_URL;

// DATABASE_URL이 없으면 경고만 표시하고 계속 진행
if (!databaseUrl) {
  console.warn('⚠️ DATABASE_URL not set. Database features will be disabled.');
  console.warn('To enable database, set DATABASE_URL environment variable in Render.com dashboard.');
}

const pool = databaseUrl ? new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('render.com') || databaseUrl.includes('postgresql://') 
    ? { rejectUnauthorized: false } 
    : false
}) : null as any;

if (pool) {
  console.log('Connecting to PostgreSQL:', databaseUrl.includes('render.com') ? 'Remote Render.com database' : 'PostgreSQL database');
} else {
  console.log('Running without database connection');
}

if (pool) {
  pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });
}

query = pool ? (text: string, params?: any[]) => pool.query(text, params) : 
  async () => { 
    console.warn('Database query attempted but DATABASE_URL not configured');
    throw new Error('Database not configured');
  };

initDatabase = async () => {
  if (!pool) {
    console.warn('⚠️ Skipping database initialization - DATABASE_URL not configured');
    return;
  }
  
  try {
    console.log('Initializing PostgreSQL database...');
    
    // 기본 테이블 생성 (001_initial_schema.sql 내용)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) CHECK(role IN ('admin', 'evaluator')) NOT NULL DEFAULT 'evaluator',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        description TEXT,
        objective TEXT,
        admin_id INTEGER NOT NULL REFERENCES users(id),
        status VARCHAR(20) DEFAULT 'draft',
        evaluation_mode VARCHAR(20) DEFAULT 'practical' CHECK (evaluation_mode IN ('practical', 'theoretical', 'direct_input')),
        workflow_stage VARCHAR(20) DEFAULT 'creating' CHECK (workflow_stage IN ('creating', 'waiting', 'evaluating', 'completed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 기준(Criteria) 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS criteria (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        parent_id INTEGER REFERENCES criteria(id) ON DELETE CASCADE,
        level INTEGER NOT NULL DEFAULT 1,
        weight DECIMAL(10,6) DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 대안(Alternatives) 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS alternatives (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cost DECIMAL(12,2) DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 평가자 배정 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS project_evaluators (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        evaluator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, evaluator_id)
      )
    `);

    // 쌍대비교 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS pairwise_comparisons (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        evaluator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        criterion_id INTEGER REFERENCES criteria(id) ON DELETE CASCADE,
        element1_id INTEGER NOT NULL,
        element2_id INTEGER NOT NULL,
        element1_type VARCHAR(20) NOT NULL CHECK (element1_type IN ('criterion', 'alternative')),
        element2_type VARCHAR(20) NOT NULL CHECK (element2_type IN ('criterion', 'alternative')),
        comparison_value DECIMAL(10,6) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, evaluator_id, criterion_id, element1_id, element2_id, element1_type, element2_type)
      )
    `);

    // 결과 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        evaluator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        criterion_id INTEGER REFERENCES criteria(id) ON DELETE CASCADE,
        element_id INTEGER NOT NULL,
        element_type VARCHAR(20) NOT NULL CHECK (element_type IN ('criterion', 'alternative')),
        local_weight DECIMAL(10,6) NOT NULL,
        global_weight DECIMAL(10,6),
        consistency_ratio DECIMAL(10,6),
        calculation_type VARCHAR(20) NOT NULL CHECK (calculation_type IN ('individual', 'group')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 직접 입력 데이터 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS direct_input_data (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        evaluator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        criterion_id INTEGER REFERENCES criteria(id) ON DELETE CASCADE,
        element_id INTEGER NOT NULL,
        element_type VARCHAR(20) NOT NULL CHECK (element_type IN ('criterion', 'alternative')),
        input_value DECIMAL(10,6) NOT NULL,
        input_method VARCHAR(20) NOT NULL DEFAULT 'weight' CHECK (input_method IN ('weight', 'score', 'rating')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, evaluator_id, criterion_id, element_id, element_type)
      )
    `);

    // 평가 방식 이력 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS evaluation_mode_history (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        previous_mode VARCHAR(20),
        new_mode VARCHAR(20) NOT NULL,
        changed_by INTEGER NOT NULL REFERENCES users(id),
        change_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 고객지원 게시판 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS support_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        author_email VARCHAR(255),
        category VARCHAR(50) NOT NULL DEFAULT 'general',
        status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 고객지원 답글 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS support_replies (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES support_posts(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        author_email VARCHAR(255),
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 뉴스 게시판 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS news_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        author_name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'platform',
        featured BOOLEAN DEFAULT false,
        published BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 워크플로우 상태 이력 테이블
    await query(`
      CREATE TABLE IF NOT EXISTS workflow_stage_history (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        previous_stage VARCHAR(20),
        new_stage VARCHAR(20) NOT NULL,
        changed_by INTEGER NOT NULL REFERENCES users(id),
        change_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 인덱스 생성
    await query(`CREATE INDEX IF NOT EXISTS idx_projects_admin_id ON projects(admin_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_projects_evaluation_mode ON projects(evaluation_mode)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_projects_workflow_stage ON projects(workflow_stage)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_criteria_project_id ON criteria(project_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_alternatives_project_id ON alternatives(project_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_project_evaluators_project_id ON project_evaluators(project_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_project_evaluators_evaluator_id ON project_evaluators(evaluator_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_pairwise_comparisons_project_id ON pairwise_comparisons(project_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_pairwise_comparisons_evaluator_id ON pairwise_comparisons(evaluator_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_results_project_id ON results(project_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_direct_input_data_project_evaluator ON direct_input_data(project_id, evaluator_id)`);

    // 트리거 함수들 생성
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await query(`
      CREATE OR REPLACE FUNCTION record_evaluation_mode_change()
      RETURNS TRIGGER AS $$
      BEGIN
          IF OLD.evaluation_mode IS DISTINCT FROM NEW.evaluation_mode THEN
              INSERT INTO evaluation_mode_history (project_id, previous_mode, new_mode, changed_by)
              VALUES (NEW.id, OLD.evaluation_mode, NEW.evaluation_mode, NEW.admin_id);
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await query(`
      CREATE OR REPLACE FUNCTION record_workflow_stage_change()
      RETURNS TRIGGER AS $$
      BEGIN
          IF OLD.workflow_stage IS DISTINCT FROM NEW.workflow_stage THEN
              INSERT INTO workflow_stage_history (project_id, previous_stage, new_stage, changed_by)
              VALUES (NEW.id, OLD.workflow_stage, NEW.workflow_stage, NEW.admin_id);
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 트리거 생성
    await query(`
      DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
      CREATE TRIGGER trigger_projects_updated_at
          BEFORE UPDATE ON projects
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS trigger_evaluation_mode_change ON projects;
      CREATE TRIGGER trigger_evaluation_mode_change
          AFTER UPDATE ON projects
          FOR EACH ROW
          EXECUTE FUNCTION record_evaluation_mode_change();
    `);

    await query(`
      DROP TRIGGER IF EXISTS trigger_workflow_stage_change ON projects;
      CREATE TRIGGER trigger_workflow_stage_change
          AFTER UPDATE ON projects
          FOR EACH ROW
          EXECUTE FUNCTION record_workflow_stage_change();
    `);

    await query(`
      DROP TRIGGER IF EXISTS trigger_direct_input_data_updated_at ON direct_input_data;
      CREATE TRIGGER trigger_direct_input_data_updated_at
          BEFORE UPDATE ON direct_input_data
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);

    // 뷰 생성
    await query(`
      CREATE OR REPLACE VIEW project_status_summary AS
      SELECT 
          p.id,
          p.name,
          p.title,
          p.description,
          p.status,
          p.evaluation_mode,
          p.workflow_stage,
          p.created_at,
          p.updated_at,
          u.first_name || ' ' || u.last_name AS admin_name,
          COUNT(DISTINCT pe.evaluator_id) AS evaluator_count,
          COUNT(DISTINCT pc.id) AS comparison_count,
          COUNT(DISTINCT did.id) AS direct_input_count,
          CASE 
              WHEN p.workflow_stage = 'creating' THEN '모델 구축 중'
              WHEN p.workflow_stage = 'waiting' THEN '평가 대기 중'
              WHEN p.workflow_stage = 'evaluating' THEN '평가 진행 중'
              WHEN p.workflow_stage = 'completed' THEN '평가 완료'
              ELSE '알 수 없음'
          END AS stage_description,
          CASE 
              WHEN p.evaluation_mode = 'practical' THEN '쌍대비교 - 실용'
              WHEN p.evaluation_mode = 'theoretical' THEN '쌍대비교 - 이론'
              WHEN p.evaluation_mode = 'direct_input' THEN '직접 입력'
              ELSE '알 수 없음'
          END AS mode_description
      FROM projects p
      LEFT JOIN users u ON p.admin_id = u.id
      LEFT JOIN project_evaluators pe ON p.id = pe.project_id
      LEFT JOIN pairwise_comparisons pc ON p.id = pc.project_id
      LEFT JOIN direct_input_data did ON p.id = did.project_id
      GROUP BY p.id, u.first_name, u.last_name;
    `);

    await query(`
      CREATE OR REPLACE VIEW project_progress AS
      SELECT 
          p.id AS project_id,
          p.name AS project_name,
          p.title AS project_title,
          p.workflow_stage,
          COUNT(DISTINCT c.id) AS criteria_count,
          COUNT(DISTINCT a.id) AS alternative_count,
          COUNT(DISTINCT pe.evaluator_id) AS evaluator_count,
          COUNT(DISTINCT pc.evaluator_id) AS active_evaluator_count,
          CASE 
              WHEN COUNT(DISTINCT pe.evaluator_id) = 0 THEN 0
              ELSE ROUND(
                  (COUNT(DISTINCT pc.evaluator_id)::DECIMAL / COUNT(DISTINCT pe.evaluator_id) * 100), 2
              )
          END AS completion_percentage
      FROM projects p
      LEFT JOIN criteria c ON p.id = c.project_id
      LEFT JOIN alternatives a ON p.id = a.project_id
      LEFT JOIN project_evaluators pe ON p.id = pe.project_id
      LEFT JOIN pairwise_comparisons pc ON p.id = pc.project_id
      GROUP BY p.id, p.name, p.title, p.workflow_stage;
    `);

    // 기본 관리자 계정 생성
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    try {
      await query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, ['admin@ahp-system.com', hashedPassword, 'Admin', 'User', 'admin', true]);
    } catch (error) {
      console.log('Admin user already exists, skipping...');
    }

    // 샘플 데이터 생성 (개발 환경에서만)
    if (process.env.NODE_ENV !== 'production') {
      await createSampleData();
      await createSampleNewsData();
      await createSampleSupportData();
    }

    console.log('PostgreSQL database initialized successfully');
  } catch (error) {
    console.error('Error initializing PostgreSQL database:', error);
    throw error;
  }
};

async function createSampleData() {
  try {
    // 샘플 프로젝트 생성
    const projectResult = await query(`
      INSERT INTO projects (title, name, description, objective, admin_id, status, evaluation_mode, workflow_stage) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      'AI 개발 활용 방안 중요도 분석',
      'AI 개발 활용 방안 중요도 분석', 
      '소프트웨어 개발자의 AI 활용 방안에 대한 중요도 분석',
      '개발 생산성 향상을 위한 AI 도구들의 우선순위 결정',
      1,
      'active',
      'practical',
      'evaluating'
    ]);

    const projectId = projectResult.rows[0]?.id || 1;

    // 기준 데이터 생성
    await query(`
      INSERT INTO criteria (project_id, name, description, level, order_index) VALUES
      ($1, '개발 생산성 효율화', 'AI 도구를 통한 개발 속도 및 효율성 향상', 1, 1),
      ($2, '코딩 실무 품질 적합화', 'AI 지원을 통한 코드 품질 및 최적화 개선', 1, 2),
      ($3, '개발 프로세스 자동화', 'AI 기반 자동화를 통한 반복 작업 최소화', 1, 3)
      ON CONFLICT DO NOTHING
    `, [projectId, projectId, projectId]);

    // 대안 데이터 생성
    await query(`
      INSERT INTO alternatives (project_id, name, description, order_index) VALUES
      ($1, 'Claude Code', 'AI 페어 프로그래밍 및 코드 작성 지원', 1),
      ($2, 'GitHub Copilot', 'GitHub 통합 AI 코딩 어시스턴트', 2),
      ($3, 'Cursor AI', 'AI 기반 코드 에디터 및 개발 환경', 3),
      ($4, 'Tabnine', 'AI 코드 완성 및 제안 도구', 4),
      ($5, 'CodeT5', '오픈소스 AI 코딩 모델', 5),
      ($6, 'Amazon CodeWhisperer', 'AWS 통합 AI 개발 도구', 6),
      ($7, 'Replit Ghostwriter', '클라우드 기반 AI 코딩 도구', 7),
      ($8, 'Kite', 'Python 중심 AI 코드 어시스턴트', 8),
      ($9, 'DeepCode', 'AI 기반 코드 리뷰 및 버그 탐지', 9)
      ON CONFLICT DO NOTHING
    `, Array(9).fill(projectId));

    console.log('Sample data created successfully');
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}

async function createSampleNewsData() {
  try {
    console.log('Creating sample news data...');
    
    // 뉴스 샘플 데이터
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
      '사용자 피드백을 반영하여 전면적인 디자인 개선을 완료했습니다. 미니멀하고 깔끔한 인터페이스로 연구 효율성을 높였습니다. 새로운 디자인은 AURI 웹사이트의 모던한 디자인 트렌드를 적용하여 사용자 경험을 크게 향상시켰습니다.',
      '새로운 AURI 스타일 디자인으로 UI/UX 전면 개편',
      '개발팀',
      'platform',
      true,
      true,
      324,
      
      '국내 주요 대학 1,000+ 논문에서 AHP 분석 도구 활용 검증',
      '서울대, 연세대, 고려대 등 주요 대학의 논문 연구에서 우리 플랫폼을 활용한 AHP 분석 결과가 높은 신뢰도를 보였습니다. 특히 일관성 비율과 분석 정확도에서 기존 도구 대비 우수한 성능을 입증했습니다.',
      '주요 대학 1,000+ 논문에서 AHP 도구 활용 성과 검증',
      '연구팀',
      'research',
      true,
      true,
      567,
      
      '한국직업능력개발센터와 AHP 연구 플랫폼 파트너십 체결',
      '교육 및 연구 분야의 의사결정 지원을 위한 전략적 파트너십을 체결했습니다. 이를 통해 더 많은 연구자들이 고품질의 AHP 분석 서비스를 이용할 수 있게 되었습니다.',
      '교육 연구 분야 의사결정 지원 파트너십 체결',
      '경영진',
      'news',
      false,
      true,
      445,
      
      '삼성전자 연구소 - AHP를 활용한 신제품 개발 우선순위 분석 사례',
      '삼성전자 연구소에서 신제품 개발 프로젝트의 우선순위를 결정하기 위해 우리 플랫폼을 활용했습니다. 50명의 전문가가 참여한 대규모 평가를 통해 성공적인 의사결정을 이끌어냈습니다.',
      '삼성전자 연구소 신제품 개발 우선순위 분석 성공 사례',
      '사례연구팀',
      'case',
      false,
      true,
      678,
      
      '2024년 하반기 AHP 연구 워크샵 개최 안내',
      '9월 15일부터 17일까지 3일간 AHP 방법론과 플랫폼 활용법을 배우는 워크샵을 개최합니다. 초급자부터 고급 사용자까지 수준별 프로그램을 제공합니다.',
      'AHP 방법론 및 플랫폼 활용 워크샵 개최',
      '교육팀',
      'event',
      false,
      true,
      234,
      
      'AI 기반 일관성 개선 기능 베타 출시',
      '인공지능을 활용하여 쌍대비교의 일관성을 자동으로 개선해주는 새로운 기능을 베타 버전으로 출시했습니다. 평가자의 판단 패턴을 학습하여 더 나은 결과를 제안합니다.',
      'AI 기반 쌍대비교 일관성 자동 개선 기능 베타 출시',
      'AI개발팀',
      'platform',
      false,
      true,
      512
    ]);

    console.log('Sample news data created successfully');
  } catch (error) {
    console.error('Error creating sample news data:', error);
  }
}

async function createSampleSupportData() {
  try {
    console.log('Creating sample support data...');
    
    // 고객지원 샘플 데이터
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

    console.log('Sample support data created successfully');
  } catch (error) {
    console.error('Error creating sample support data:', error);
  }
}

export { query, initDatabase };
export default pool;