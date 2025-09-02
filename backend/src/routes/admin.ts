import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { query } from '../database/connection';

const router = express.Router();

/**
 * 관리자 전용 데이터 관리 API
 */

// 개별 프로젝트 하드 삭제 API (관리자 전용)
router.delete('/projects/:id/hard-delete', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ 관리자 요청: 프로젝트 ${id} 하드 삭제...`);
    
    // CASCADE 삭제로 관련 데이터 자동 삭제
    const result = await query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '프로젝트를 찾을 수 없습니다.'
      });
    }
    
    console.log(`✅ 프로젝트 ${id} 하드 삭제 완료`);
    
    res.json({
      success: true,
      message: '프로젝트가 완전히 삭제되었습니다.',
      deleted_project: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('❌ 프로젝트 하드 삭제 중 오류:', error);
    res.status(500).json({
      success: false,
      message: '프로젝트 삭제 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 테스트/허수 데이터 정리 API
router.delete('/cleanup-test-data', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    console.log('🧹 관리자 요청: 테스트 데이터 정리 시작...');
    
    // 1. 현재 프로젝트 목록 확인
    const projectsResult = await query('SELECT id, title, description, status, created_at FROM projects ORDER BY created_at DESC');
    console.log(`📊 현재 프로젝트 총 개수: ${projectsResult.rows.length}개`);
    
    // 2. 테스트/허수 데이터 식별
    const testProjects = projectsResult.rows.filter((project: any) => {
      return project.title.includes('테스트') || 
             project.title.includes('Test') ||
             project.title.includes('sample') ||
             project.title.includes('Sample') ||
             project.title.includes('demo') ||
             project.title.includes('Demo') ||
             project.title.includes('AI 개발 활용') || // 샘플 프로젝트
             project.description.includes('테스트') ||
             project.description.includes('샘플') ||
             project.description.includes('인공지능 기술의 개발'); // 샘플 설명
    });
    
    console.log(`🔍 발견된 테스트/허수 프로젝트: ${testProjects.length}개`);
    
    if (testProjects.length === 0) {
      return res.json({
        success: true,
        message: '삭제할 테스트 데이터가 없습니다.',
        deleted_count: 0,
        remaining_count: projectsResult.rows.length
      });
    }
    
    // 3. 관련 데이터 먼저 삭제 (외래키 제약조건 때문)
    console.log('🗑️ 관련 데이터 삭제 중...');
    
    // 3. CASCADE 삭제로 관련 데이터 자동 삭제
    
    // 4. 테스트 프로젝트 삭제
    const testProjectIds = testProjects.map((p: any) => p.id);
    await query('DELETE FROM projects WHERE id = ANY($1)', [testProjectIds]);
    
    // 5. 정리 후 상태 확인
    const finalResult = await query('SELECT COUNT(*) as count FROM projects');
    const remainingCount = parseInt(finalResult.rows[0].count);
    
    console.log(`✅ ${testProjects.length}개 테스트 프로젝트 삭제 완료`);
    console.log(`📊 정리 후 프로젝트 개수: ${remainingCount}개`);
    
    res.json({
      success: true,
      message: `${testProjects.length}개의 테스트 데이터가 성공적으로 삭제되었습니다.`,
      deleted_count: testProjects.length,
      remaining_count: remainingCount,
      deleted_projects: testProjects.map((p: any) => ({ id: p.id, title: p.title }))
    });
    
  } catch (error: any) {
    console.error('❌ 테스트 데이터 정리 중 오류:', error);
    res.status(500).json({
      success: false,
      message: '데이터 정리 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 프로젝트 목록 조회 (관리자용 - 상세 정보 포함)
router.get('/projects', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const result = await query(`
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM criteria WHERE project_id = p.id) as criteria_count,
        (SELECT COUNT(*) FROM alternatives WHERE project_id = p.id) as alternatives_count,
        (SELECT COUNT(*) FROM workshop_sessions WHERE project_id = p.id) as evaluator_count
      FROM projects p 
      ORDER BY p.created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
    
  } catch (error: any) {
    console.error('❌ 관리자 프로젝트 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '프로젝트 목록 조회에 실패했습니다.',
      error: error.message
    });
  }
});

export default router;