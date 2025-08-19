import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { API_BASE_URL } from '../../config/api';
import { EvaluationMode } from '../evaluation/EvaluationModeSelector';
import { WorkflowStage } from '../workflow/WorkflowStageIndicator';

interface UserProject {
  id: string;
  title: string;
  description: string;
  objective: string;
  status: 'draft' | 'active' | 'completed';
  evaluation_mode: EvaluationMode;
  workflow_stage: WorkflowStage;
  created_at: string;
  evaluator_count: number;
  completion_rate: number;
  criteria_count: number;
  alternatives_count: number;
  last_modified: string;
  evaluation_method: 'pairwise' | 'direct' | 'mixed';
}

interface ProjectSelectorProps {
  onProjectSelect: (project: UserProject) => void;
  onCancel: () => void;
  title: string;
  description?: string;
}

// 토큰 유효성 검사 유틸리티 함수
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  onProjectSelect, 
  onCancel, 
  title, 
  description 
}) => {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !isTokenValid(token)) {
        setProjects([]);
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const formattedProjects = data.projects.map((project: any) => ({
          id: project.id.toString(),
          title: project.title || project.name,
          description: project.description || project.objective || '',
          objective: project.objective || project.description || '',
          status: project.status || 'draft',
          evaluation_mode: project.evaluation_mode || 'practical' as EvaluationMode,
          workflow_stage: project.workflow_stage || 'creating' as WorkflowStage,
          created_at: project.created_at || new Date().toISOString(),
          evaluator_count: project.evaluator_count || 0,
          completion_rate: project.completion_rate || 0,
          criteria_count: project.criteria_count || 0,
          alternatives_count: project.alternatives_count || 0,
          last_modified: project.last_modified || project.created_at || new Date().toISOString(),
          evaluation_method: project.evaluation_method || 'pairwise' as 'pairwise' | 'direct' | 'mixed'
        }));
        setProjects(formattedProjects);
        
        localStorage.setItem('ahp_projects_backup', JSON.stringify(formattedProjects));
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        setError('프로젝트를 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setError('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };

    const labels = {
      draft: '초안',
      active: '진행중',
      completed: '완료'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.draft}`}>
        {labels[status as keyof typeof labels] || '초안'}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '날짜 없음';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card title="프로젝트 로딩 중...">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">프로젝트를 불러오는 중입니다...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <Card title={title}>
          <div className="space-y-6">
            {description && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700">{description}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">프로젝트가 없습니다</h3>
                <p className="text-gray-500">먼저 새 프로젝트를 생성해주세요.</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onProjectSelect(project)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                            {getStatusBadge(project.status)}
                          </div>
                          
                          {project.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                            <div>
                              <span className="font-medium">기준:</span> {project.criteria_count}개
                            </div>
                            <div>
                              <span className="font-medium">대안:</span> {project.alternatives_count}개
                            </div>
                            <div>
                              <span className="font-medium">평가자:</span> {project.evaluator_count}명
                            </div>
                            <div>
                              <span className="font-medium">진행률:</span> {project.completion_rate}%
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>생성일: {formatDate(project.created_at)}</span>
                            <span>수정일: {formatDate(project.last_modified)}</span>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          <Button size="sm" variant="primary">
                            선택
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={onCancel}>
                취소
              </Button>
              {projects.length === 0 && (
                <Button variant="primary" onClick={onCancel}>
                  새 프로젝트 생성하기
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectSelector;