import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import CriteriaManagement from './CriteriaManagement';
import AlternativeManagement from './AlternativeManagement';
import EvaluatorAssignment from './EvaluatorAssignment';
import EnhancedEvaluatorManagement from './EnhancedEvaluatorManagement';
import SurveyLinkManager from './SurveyLinkManager';
import ModelFinalization from './ModelFinalization';
import WorkflowStageIndicator, { WorkflowStage } from '../workflow/WorkflowStageIndicator';
import { EvaluationMode } from '../evaluation/EvaluationModeSelector';
import PaymentSystem from '../payment/PaymentSystem';
import WorkshopManagement from '../workshop/WorkshopManagement';
import DecisionSupportSystem from '../decision/DecisionSupportSystem';
import PaperManagement from '../paper/PaperManagement';
import ProjectSelector from '../project/ProjectSelector';
import SurveyFormBuilder from '../survey/SurveyFormBuilder';
import dataService from '../../services/dataService';
import type { ProjectData } from '../../services/dataService';

interface PersonalServiceProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'evaluator';
    admin_type?: 'super' | 'personal';
  };
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface UserProject extends Omit<ProjectData, 'evaluation_method'> {
  evaluator_count?: number;
  completion_rate?: number;
  criteria_count: number;
  alternatives_count: number;
  last_modified: string;
  evaluation_method: 'pairwise' | 'direct' | 'mixed'; // 레거시 호환성
}


const PersonalServiceDashboard: React.FC<PersonalServiceProps> = ({ 
  user, 
  activeTab: externalActiveTab,
  onTabChange: externalOnTabChange
}) => {
  const [projects, setProjects] = useState<UserProject[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'overview' | 'projects' | 'criteria' | 'alternatives' | 'evaluators' | 'finalize'>('overview');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<UserProject | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    objective: '',
    evaluation_method: 'pairwise' as 'pairwise' | 'direct' | 'mixed',
    evaluation_mode: 'practical' as EvaluationMode,
    workflow_stage: 'creating' as WorkflowStage
  });
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [projectSelectorConfig, setProjectSelectorConfig] = useState<{
    title: string;
    description: string;
    nextAction: string;
  } | null>(null);
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'projects' | 'creation' | 'model-builder' | 'evaluators' | 'survey-links' | 'monitoring' | 'analysis' | 'paper' | 'export' | 'workshop' | 'decision-support' | 'settings' | 'payment' | 'demographic-survey'>(
    externalActiveTab === 'personal-service' ? 'dashboard' :
    externalActiveTab === 'demographic-survey' ? 'demographic-survey' :
    externalActiveTab === 'my-projects' ? 'projects' :
    externalActiveTab === 'project-creation' ? 'creation' :
    externalActiveTab === 'model-builder' ? 'model-builder' :
    externalActiveTab === 'evaluator-management' ? 'evaluators' :
    externalActiveTab === 'progress-monitoring' ? 'monitoring' :
    externalActiveTab === 'results-analysis' ? 'analysis' :
    externalActiveTab === 'paper-management' ? 'paper' :
    externalActiveTab === 'export-reports' ? 'export' :
    externalActiveTab === 'workshop-management' ? 'workshop' :
    externalActiveTab === 'decision-support-system' ? 'decision-support' :
    externalActiveTab === 'personal-settings' ? 'settings' :
    'dashboard'
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectTemplate, setProjectTemplate] = useState<'blank' | 'business' | 'technical' | 'academic'>('blank');
  
  // Project management UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'active' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'progress' | 'status'>('date');

  const projectTemplates = {
    blank: { name: '빈 프로젝트', desc: '처음부터 설정' },
    business: { name: '비즈니스 결정', desc: '경영 의사결정 템플릿' },
    technical: { name: '기술 선택', desc: '기술 대안 비교 템플맿' },
    academic: { name: '연구 분석', desc: '학술 연구용 템플맿' }
  };

  // 외부에서 activeTab이 변경되면 내부 activeMenu도 업데이트
  useEffect(() => {
    if (externalActiveTab) {
      const menuMap: Record<string, string> = {
        'personal-service': 'dashboard',
        'demographic-survey': 'demographic-survey',
        'my-projects': 'projects',
        'project-creation': 'creation',
        'model-builder': 'model-builder',
        'evaluator-management': 'evaluators',
        'progress-monitoring': 'monitoring',
        'results-analysis': 'analysis',
        'paper-management': 'paper',
        'export-reports': 'export',
        'workshop-management': 'workshop',
        'decision-support-system': 'decision-support',
        'personal-settings': 'settings'
      };
      const mappedMenu = menuMap[externalActiveTab] || 'dashboard';
      setActiveMenu(mappedMenu as any);
    }
  }, [externalActiveTab]);

  useEffect(() => {
    loadProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 활성 메뉴가 변경될 때 프로젝트 관련 탭이면 데이터를 다시 로드
  useEffect(() => {
    if (activeMenu === 'projects' || activeMenu === 'dashboard') {
      loadProjects();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 통합 데이터 서비스에서 프로젝트 로드');
      
      // 통합 데이터 서비스 사용 (자동으로 온라인/오프라인 모드 처리)
      const projectsData = await dataService.getProjects();
      
      // ProjectData를 UserProject로 변환
      const convertedProjects: UserProject[] = projectsData.map((project: ProjectData) => ({
        ...project,
        evaluator_count: 0, // TODO: 평가자 수 계산
        completion_rate: 0, // TODO: 실제 완료율 계산
        last_modified: project.updated_at || project.created_at || new Date().toISOString(),
        evaluation_method: (project.evaluation_mode || 'pairwise') as 'pairwise' | 'direct' | 'mixed',
        criteria_count: project.criteria_count || 0,
        alternatives_count: project.alternatives_count || 0
      }));
      
      setProjects(convertedProjects);
      console.log(`✅ 프로젝트 ${convertedProjects.length}개 로드 완료`);
    } catch (error) {
      console.error('❌ 프로젝트 로드 실패:', error);
      setError('프로젝트를 로드할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newMenu: typeof activeMenu) => {
    setActiveMenu(newMenu);
    
    // 외부 탭 변경 콜백 호출
    if (externalOnTabChange) {
      const reverseMenuMap: Record<string, string> = {
        'dashboard': 'personal-service',
        'demographic-survey': 'demographic-survey',
        'projects': 'my-projects',
        'creation': 'project-creation',
        'model-builder': 'model-builder',
        'evaluators': 'evaluator-management',
        'monitoring': 'progress-monitoring',
        'analysis': 'results-analysis',
        'paper': 'paper-management',
        'export': 'export-reports',
        'workshop': 'workshop-management',
        'decision-support': 'decision-support-system',
        'settings': 'personal-settings'
      };
      const externalTab = reverseMenuMap[newMenu] || 'personal-service';
      externalOnTabChange(externalTab);
    }
  };

  const handleProjectAction = (actionType: 'model-builder' | 'evaluators' | 'monitoring' | 'analysis', project?: UserProject) => {
    if (project) {
      setActiveProject(project.id || '');
      setSelectedProjectId(project.id || '');
    }
    
    if (actionType === 'model-builder') {
      setProjectSelectorConfig({
        title: '모델 구축할 프로젝트 선택',
        description: '기준과 대안을 설정할 프로젝트를 선택하세요.',
        nextAction: 'model-builder'
      });
      setShowProjectSelector(true);
    } else {
      setActiveMenu(actionType);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '알 수 없음';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active': return '진행중';
      case 'completed': return '완료';
      case 'draft': return '초안';
      default: return '대기중';
    }
  };

  // 인구통계학적 설문조사 컨텐츠 렌더링
  if (activeMenu === 'demographic-survey') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <SurveyFormBuilder 
          onSave={(questions) => {
            console.log('설문 폼 저장:', questions);
            alert('설문 폼이 저장되었습니다.');
            handleTabChange('dashboard');
          }}
          onCancel={() => handleTabChange('dashboard')}
        />
      </div>
    );
  }

  // 기타 메뉴 컨텐츠 렌더링
  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">내 프로젝트</h2>
              <Button
                onClick={() => setActiveMenu('creation')}
                variant="primary"
                size="md"
                className="bg-blue-600 hover:bg-blue-700"
              >
                ➕ 새 프로젝트
              </Button>
            </div>
            
            {/* 프로젝트 목록 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {project.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description || '설명 없음'}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">기준</span>
                        <span className="font-medium">{project.criteria_count}개</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">대안</span>
                        <span className="font-medium">{project.alternatives_count}개</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">수정일</span>
                        <span className="font-medium">{formatDate(project.last_modified)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleProjectAction('model-builder', project)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        🏗️ 편집
                      </Button>
                      <Button
                        onClick={() => handleProjectAction('analysis', project)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        📊 분석
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {projects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">프로젝트가 없습니다</h3>
                <p className="text-gray-500 mb-6">첫 번째 프로젝트를 생성해보세요</p>
                <Button
                  onClick={() => setActiveMenu('creation')}
                  variant="primary"
                  size="md"
                >
                  ➕ 새 프로젝트 만들기
                </Button>
              </div>
            )}
          </div>
        );

      case 'creation':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">새 프로젝트 생성</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                AHP 의사결정 분석을 위한 새로운 프로젝트를 생성합니다. 템플릿을 선택하거나 빈 프로젝트로 시작할 수 있습니다.
              </p>
            </div>
            
            {/* 템플릿 선택 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(projectTemplates).map(([key, template]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all ${
                    projectTemplate === key 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setProjectTemplate(key as any)}
                >
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">
                      {key === 'blank' ? '📄' : key === 'business' ? '💼' : key === 'technical' ? '⚙️' : '🎓'}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm">{template.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* 프로젝트 정보 입력 */}
            <Card>
              <div className="p-6 space-y-6">
                <h3 className="text-xl font-semibold">프로젝트 정보</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      프로젝트 제목 *
                    </label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="예: 신제품 개발 전략 선택"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      평가 방법
                    </label>
                    <select
                      value={projectForm.evaluation_method}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, evaluation_method: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pairwise">쌍대비교</option>
                      <option value="direct">직접입력</option>
                      <option value="mixed">혼합방식</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로젝트 설명
                  </label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="프로젝트의 목적과 배경을 설명해주세요"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    의사결정 목표
                  </label>
                  <input
                    type="text"
                    value={projectForm.objective}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, objective: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: 가장 적합한 마케팅 전략을 선택한다"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    onClick={() => setActiveMenu('dashboard')}
                    variant="outline"
                    size="md"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={() => {
                      // TODO: 프로젝트 생성 로직
                      alert('프로젝트가 생성되었습니다!');
                      setActiveMenu('projects');
                    }}
                    variant="primary"
                    size="md"
                    disabled={!projectForm.title.trim()}
                  >
                    프로젝트 생성
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'model-builder':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">모델 구축</h2>
              <Button onClick={() => setActiveMenu('projects')} variant="outline">
                ← 프로젝트 목록
              </Button>
            </div>
            
            <WorkflowStageIndicator 
              currentStage={currentStep as WorkflowStage}
            />
            
            {currentStep === 'criteria' && (
              <CriteriaManagement 
                projectId={selectedProjectId}
                onComplete={() => setCurrentStep('alternatives')}
              />
            )}
            
            {currentStep === 'alternatives' && (
              <AlternativeManagement 
                projectId={selectedProjectId}
                onComplete={() => setCurrentStep('evaluators')}
              />
            )}
            
            {currentStep === 'evaluators' && (
              <EvaluatorAssignment 
                projectId={selectedProjectId}
                onComplete={() => setCurrentStep('finalize')}
              />
            )}
            
            {currentStep === 'finalize' && (
              <ModelFinalization 
                projectId={selectedProjectId}
                onFinalize={() => setActiveMenu('monitoring')}
                isReadyToFinalize={true}
              />
            )}
          </div>
        );

      case 'evaluators':
        return (
          <EnhancedEvaluatorManagement 
            projectId={selectedProjectId}
          />
        );

      case 'survey-links':
        return (
          <SurveyLinkManager 
            projectId={selectedProjectId}
          />
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">결과 분석</h2>
              <Button onClick={() => setActiveMenu('projects')} variant="outline">
                ← 프로젝트 목록
              </Button>
            </div>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">결과 분석</h3>
              <p className="text-gray-500">분석할 프로젝트를 선택하세요</p>
            </div>
          </div>
        );

      case 'paper':
        return <PaperManagement />;

      case 'workshop':
        return <WorkshopManagement />;

      case 'decision-support':
        return <DecisionSupportSystem />;

      case 'export':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">보고서 내보내기</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📤</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">보고서 내보내기</h3>
              <p className="text-gray-500">내보낼 프로젝트를 선택하세요</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">개인 설정</h2>
            
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">계정 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이름</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">역할</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {user.role === 'admin' ? '관리자' : '평가자'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'payment':
        return <PaymentSystem />;

      default:
        return (
          <div className="space-y-8">
            {/* 대시보드 헤더 */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                안녕하세요, <span className="text-blue-600">{user.first_name} {user.last_name}</span>님
              </h1>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                <span className="font-medium">Premium Member</span>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                전문적인 AHP 의사결정 분석으로 복잡한 문제를 체계적으로 해결해보세요
              </p>
            </div>

            {/* 프로젝트 현황 */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="text-center p-6">
                <div className="text-4xl mb-4">📋</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{projects.length}</div>
                <div className="text-gray-600">전체 프로젝트</div>
              </Card>
              
              <Card className="text-center p-6">
                <div className="text-4xl mb-4">🔄</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {projects.filter(p => p.status === 'active').length}
                </div>
                <div className="text-gray-600">진행중</div>
              </Card>
              
              <Card className="text-center p-6">
                <div className="text-4xl mb-4">✅</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {projects.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-gray-600">완료됨</div>
              </Card>
            </div>

            {/* 빠른 작업 */}
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">빠른 작업</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button
                    onClick={() => setActiveMenu('creation')}
                    variant="outline"
                    size="lg"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <span className="text-2xl">➕</span>
                    <span>새 프로젝트</span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveMenu('projects')}
                    variant="outline"
                    size="lg"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <span className="text-2xl">📂</span>
                    <span>내 프로젝트</span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveMenu('analysis')}
                    variant="outline"
                    size="lg"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <span className="text-2xl">📊</span>
                    <span>결과 분석</span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveMenu('demographic-survey')}
                    variant="outline"
                    size="lg"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <span className="text-2xl">📋</span>
                    <span>설문 생성</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* 최근 프로젝트 */}
            {projects.length > 0 && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">최근 프로젝트</h3>
                    <Button
                      onClick={() => setActiveMenu('projects')}
                      variant="ghost"
                      size="sm"
                    >
                      전체 보기 →
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {projects.slice(0, 4).map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleProjectAction('model-builder', project)}
                      >
                        <div className="text-2xl">📋</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{project.title}</h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(project.last_modified)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {renderMenuContent()}
      
      {/* 프로젝트 선택 모달 */}
      {showProjectSelector && projectSelectorConfig && (
        <ProjectSelector
          title={projectSelectorConfig.title}
          description={projectSelectorConfig.description}
          onProjectSelect={(project) => {
            setSelectedProjectId(project.id || '');
            setActiveProject(project.id || '');
            setShowProjectSelector(false);
            setActiveMenu(projectSelectorConfig.nextAction as any);
          }}
          onCancel={() => {
            setShowProjectSelector(false);
            setProjectSelectorConfig(null);
          }}
        />
      )}
    </div>
  );
};

export default PersonalServiceDashboard;