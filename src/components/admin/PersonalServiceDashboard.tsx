import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import dataService, { ProjectData } from '../../services/dataService';
import ProjectSelector from '../project/ProjectSelector';
import NewProjectModal from '../modals/NewProjectModal';
import ModelBuilder from '../modals/ModelBuilder';
import DemographicSurvey from '../survey/DemographicSurvey';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  plan?: string;
  usage?: {
    projects: number;
    evaluators: number;
    storage: string;
  };
}

type MenuTab = 'dashboard' | 'projects' | 'creation' | 'analysis' | 'export' | 'survey-links' | 'workshop' | 'decision-support' | 'settings' | 'model-builder' | 'evaluators' | 'monitoring' | 'payment' | 'demographic-survey' | 'my-projects' | 'project-creation' | 'evaluator-management' | 'progress-monitoring' | 'results-analysis' | 'paper-management' | 'export-reports' | 'workshop-management' | 'decision-support-system' | 'personal-settings' | 'personal-service' | 'user-guide';

type ModelStep = 'overview' | 'details' | 'criteria' | 'alternatives' | 'evaluators' | 'complete';

interface ProjectSelectorConfig {
  title: string;
  description: string;
}

interface PersonalServiceDashboardProps {
  user?: User;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const PersonalServiceDashboard: React.FC<PersonalServiceDashboardProps> = ({ 
  user: propUser, 
  activeTab: propActiveTab, 
  onTabChange: propOnTabChange 
}) => {
  const { user: authUser } = useAuth();
  const [activeMenu, setActiveMenu] = useState<MenuTab>((propActiveTab as MenuTab) || 'dashboard');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showModelBuilder, setShowModelBuilder] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModelStep>('overview');
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [projectSelectorConfig, setProjectSelectorConfig] = useState<ProjectSelectorConfig | null>(null);

  // Use prop user if provided, otherwise fall back to auth user or defaults
  const user: User = propUser || {
    first_name: authUser?.first_name || 'AHP',
    last_name: authUser?.last_name || 'Tester',
    email: authUser?.email || 'tester@example.com',
    plan: authUser?.plan || 'Pro Plan 🔵',
    usage: {
      projects: projects.length,
      evaluators: 12,
      storage: '2.3GB'
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (propActiveTab) {
      setActiveMenu(propActiveTab as MenuTab);
    }
  }, [propActiveTab]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await dataService.getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error('프로젝트 데이터 로딩 실패:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: MenuTab) => {
    if (tab === 'model-builder') {
      setShowProjectSelector(true);
      setProjectSelectorConfig({
        title: '모델 구축할 프로젝트 선택',
        description: 'AHP 모델을 구축하고 기준과 대안을 설정할 프로젝트를 선택하세요.'
      });
    } else {
      setActiveMenu(tab);
      // If onTabChange prop is provided, call it too
      if (propOnTabChange) {
        propOnTabChange(tab);
      }
    }
  };

  const handleProjectSelect = (project: ProjectData) => {
    setCurrentProject(project);
    setSelectedProjectId(project.id || '');
    setShowProjectSelector(false);
    setShowModelBuilder(true);
    setCurrentStep('overview');
    setActiveMenu('model-builder');
  };

  const handleProjectSelectorCancel = () => {
    setShowProjectSelector(false);
    setProjectSelectorConfig(null);
  };

  const handleProjectClick = (project: ProjectData) => {
    setSelectedProjectId(project.id || '');
    setCurrentProject(project);
  };

  const getStepProgress = () => {
    const steps: ModelStep[] = ['overview', 'details', 'criteria', 'alternatives', 'evaluators', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '최근';
    }
  };

  const advancedFeatures = [
    { tab: 'analysis', label: '결과 분석', icon: '📊' },
    { tab: 'export', label: '보고서', icon: '📤' },
    { tab: 'survey-links', label: '설문 링크', icon: '🔗' },
    { tab: 'workshop', label: '워크숍', icon: '🎯' },
    { tab: 'decision-support', label: '의사결정 지원', icon: '🧠' },
    { tab: 'settings', label: '설정', icon: '⚙️' }
  ] as const;

  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'projects':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                📂 내 프로젝트
              </h2>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ➕ 새 프로젝트
              </button>
            </div>
            {/* Project list content would go here */}
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>프로젝트 목록이 여기에 표시됩니다.</p>
            </div>
          </div>
        );
      
      case 'creation':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              ➕ 새 프로젝트 생성
            </h2>
            <div className="text-center py-12">
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                프로젝트 생성 시작하기
              </button>
            </div>
          </div>
        );

      case 'demographic-survey':
        return (
          <DemographicSurvey 
            onSave={(data) => {
              console.log('설문조사 데이터 저장:', data);
              alert('설문조사가 저장되었습니다.');
              setActiveMenu('dashboard');
            }}
            onCancel={() => setActiveMenu('dashboard')}
          />
        );

      case 'my-projects':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                📂 내 프로젝트
              </h2>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ➕ 새 프로젝트
              </button>
            </div>
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>프로젝트 목록이 여기에 표시됩니다.</p>
            </div>
          </div>
        );

      case 'project-creation':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              ➕ 새 프로젝트 생성
            </h2>
            <div className="text-center py-12">
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                프로젝트 생성 시작하기
              </button>
            </div>
          </div>
        );

      case 'evaluator-management':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              👥 평가자 관리
            </h2>
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>평가자 관리 기능이 여기에 표시됩니다.</p>
            </div>
          </div>
        );

      case 'progress-monitoring':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              📈 진행률 모니터링
            </h2>
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>프로젝트 진행 상황이 여기에 표시됩니다.</p>
            </div>
          </div>
        );

      case 'results-analysis':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              📊 결과 분석
            </h2>
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>분석 결과가 여기에 표시됩니다.</p>
            </div>
          </div>
        );

      case 'paper-management':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              📝 논문 작성 관리
            </h2>
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>논문 작성 도구가 여기에 표시됩니다.</p>
            </div>
          </div>
        );

      case 'export-reports':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              📤 보고서 내보내기
            </h2>
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>보고서 내보내기 기능이 여기에 표시됩니다.</p>
            </div>
          </div>
        );

      case 'workshop-management':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              🎯 워크숍 관리
            </h2>
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>워크숍 관리 도구가 여기에 표시됩니다.</p>
            </div>
          </div>
        );

      case 'decision-support-system':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              🧠 의사결정 지원
            </h2>
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>의사결정 지원 시스템이 여기에 표시됩니다.</p>
            </div>
          </div>
        );

      case 'personal-settings':
      case 'settings':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              ⚙️ 설정 및 계정 정보
            </h2>
            
            {/* 개인 정보 섹션 */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/60 shadow-lg">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                개인 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>이름</label>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span style={{ color: 'var(--text-primary)' }}>{user.first_name} {user.last_name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>이메일</label>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span style={{ color: 'var(--text-primary)' }}>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 현재 요금제 정보 */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/60 shadow-lg">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                현재 요금제
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>현재 이용 중인 플랜</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>
                    무료 체험 중
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    프로젝트 1개, 평가자 10명까지 이용 가능
                  </p>
                </div>
              </div>
            </div>

            {/* 요금제 추가 신청 */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/60 shadow-lg">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                요금제 업그레이드
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Single Project Pack */}
                <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow" style={{ borderColor: 'var(--border-medium)' }}>
                  <h4 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    Single Project Pack
                  </h4>
                  <p className="text-2xl font-bold mb-3" style={{ color: 'var(--accent-primary)' }}>
                    ₩200,000
                  </p>
                  <ul className="space-y-2 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    <li>• 사용 기간: 1개월</li>
                    <li>• 프로젝트 수: 1개</li>
                    <li>• 평가자 인원: 30명</li>
                    <li>• 대학원 논문, 단기 과제용</li>
                  </ul>
                  <button 
                    onClick={() => alert('Single Project Pack 신청하기')}
                    className="w-full px-4 py-2 rounded-lg border transition-all"
                    style={{ 
                      borderColor: 'var(--accent-primary)', 
                      color: 'var(--accent-primary)' 
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--accent-primary)';
                    }}
                  >
                    선택하기
                  </button>
                </div>

                {/* Team Project Pack */}
                <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow relative" style={{ borderColor: 'var(--accent-primary)' }}>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">추천</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    Team Project Pack
                  </h4>
                  <p className="text-2xl font-bold mb-3" style={{ color: 'var(--accent-primary)' }}>
                    ₩500,000
                  </p>
                  <ul className="space-y-2 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    <li>• 사용 기간: 1개월</li>
                    <li>• 프로젝트 수: 3개</li>
                    <li>• 평가자 인원: 50명</li>
                    <li>• 기업·기관 연구과제용</li>
                  </ul>
                  <button 
                    onClick={() => alert('Team Project Pack 신청하기')}
                    className="w-full px-4 py-2 rounded-lg transition-all"
                    style={{ 
                      backgroundColor: 'var(--accent-primary)', 
                      color: 'white' 
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                    }}
                  >
                    선택하기
                  </button>
                </div>

                {/* Institution Pack */}
                <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow" style={{ borderColor: 'var(--border-medium)' }}>
                  <h4 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    Institution Pack
                  </h4>
                  <p className="text-2xl font-bold mb-3" style={{ color: 'var(--accent-primary)' }}>
                    ₩1,000,000
                  </p>
                  <ul className="space-y-2 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    <li>• 사용 기간: 1개월</li>
                    <li>• 프로젝트 수: 3개</li>
                    <li>• 평가자 인원: 100명</li>
                    <li>• 공공기관·대규모 프로젝트용</li>
                  </ul>
                  <button 
                    onClick={() => alert('Institution Pack 신청하기')}
                    className="w-full px-4 py-2 rounded-lg border transition-all"
                    style={{ 
                      borderColor: 'var(--accent-primary)', 
                      color: 'var(--accent-primary)' 
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--accent-primary)';
                    }}
                  >
                    선택하기
                  </button>
                </div>
              </div>

              {/* 추가 옵션 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  추가 옵션 (각 ₩50,000)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span style={{ color: 'var(--text-secondary)' }}>인공지능 활용</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span style={{ color: 'var(--text-secondary)' }}>문헌정보 정리</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span style={{ color: 'var(--text-secondary)' }}>평가자 10명 추가</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // 기본적으로 대시보드 콘텐츠를 보여줌
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p style={{ color: 'var(--text-primary)' }}>데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 특정 메뉴가 선택된 경우 해당 콘텐츠 표시 */}
      {activeMenu !== 'dashboard' && activeMenu !== 'personal-service' && renderMenuContent() ? (
        renderMenuContent()
      ) : (
        <>
      {/* 환영 메시지 + 요금제 정보 통합 - 원래 디자인 복원 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
        {/* 환영 메시지 - 원래 디자인 복원 */}
        <div className="text-center lg:text-left space-y-6">
          <div className="space-y-3">
            <h1 
              className="text-4xl lg:text-5xl font-light tracking-wide"
              style={{ 
                color: 'var(--text-primary)',
                fontFamily: "'Inter', 'Pretendard', system-ui, sans-serif"
              }}
            >
              안녕하세요, 
              <span 
                className="font-semibold ml-2"
                style={{ color: 'var(--accent-primary)' }}
              >
                {user.first_name} {user.last_name}
              </span>님
            </h1>
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <div 
                className="w-12 h-0.5 rounded-full"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              ></div>
              <span 
                className="text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full border"
                style={{ 
                  color: 'var(--accent-primary)',
                  borderColor: 'var(--accent-light)',
                  backgroundColor: 'var(--accent-light)'
                }}
              >
                Premium Member
              </span>
              <div 
                className="w-12 h-0.5 rounded-full"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              ></div>
            </div>
            <p 
              className="text-lg font-light max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              전문적인 AHP 의사결정 분석으로 복잡한 문제를 체계적으로 해결해보세요
            </p>
          </div>
        </div>

        {/* 사용량 정보만 표시 */}
        <div className="space-y-6">

          {/* 사용량 현황 - 블록 단위 100% 너비 활용 */}
          <div className="w-full">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/60 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
                현재 사용량 현황
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
                {/* 프로젝트 */}
                <div className="text-center space-y-4">
                  <div className="space-y-3">
                    <div 
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border-2 border-dashed shadow-lg"
                      style={{ borderColor: 'var(--accent-primary)', backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
                    >
                      <span className="text-3xl">📋</span>
                    </div>
                    <h4 
                      className="text-lg font-bold uppercase tracking-wider"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Projects
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div 
                        className="text-4xl font-bold mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {projects.length}
                      </div>
                      <div 
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        of 20 projects
                      </div>
                    </div>
                    
                    <div className="w-full max-w-32 mx-auto">
                      <div 
                        className="w-full rounded-full h-3 overflow-hidden shadow-inner"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                      >
                        <div 
                          className="h-3 rounded-full transition-all duration-700 shadow-sm"
                          style={{ 
                            width: `${Math.min((projects.length / 20) * 100, 100)}%`,
                            backgroundColor: 'var(--accent-primary)',
                            boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.5)'
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                        <span>0</span>
                        <span>20</span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span style={{ color: 'var(--text-muted)' }}>Total Elements: </span>
                      <span 
                        style={{ color: 'var(--accent-primary)' }}
                        className="font-bold text-lg"
                      >
                        {projects.reduce((sum, p) => sum + (p.criteria_count || 0) + (p.alternatives_count || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 평가자 */}
                <div className="text-center space-y-4">
                  <div className="space-y-3">
                    <div 
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border-2 border-dashed shadow-lg"
                      style={{ borderColor: 'var(--accent-secondary)', backgroundColor: 'rgba(var(--accent-secondary-rgb), 0.1)' }}
                    >
                      <span className="text-3xl">👥</span>
                    </div>
                    <h4 
                      className="text-lg font-bold uppercase tracking-wider"
                      style={{ color: 'var(--accent-secondary)' }}
                    >
                      Collaboration
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div 
                        className="text-4xl font-bold mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        12
                      </div>
                      <div 
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        of 100 evaluators
                      </div>
                    </div>
                    
                    <div className="w-full max-w-32 mx-auto">
                      <div 
                        className="w-full rounded-full h-3 overflow-hidden shadow-inner"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                      >
                        <div 
                          className="h-3 rounded-full transition-all duration-700 shadow-sm"
                          style={{ 
                            width: '12%',
                            backgroundColor: 'var(--accent-secondary)',
                            boxShadow: '0 0 10px rgba(var(--accent-secondary-rgb), 0.5)'
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                        <span>0</span>
                        <span>100</span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span style={{ color: 'var(--text-muted)' }}>Active Now: </span>
                      <span 
                        style={{ color: 'var(--accent-secondary)' }}
                        className="font-bold text-lg"
                      >
                        0
                      </span>
                    </div>
                  </div>
                </div>

                {/* 리소스 */}
                <div className="text-center space-y-4">
                  <div className="space-y-3">
                    <div 
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border-2 border-dashed shadow-lg"
                      style={{ borderColor: 'var(--status-success-bg)', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                    >
                      <span className="text-3xl">💾</span>
                    </div>
                    <h4 
                      className="text-lg font-bold uppercase tracking-wider"
                      style={{ color: 'var(--status-success-bg)' }}
                    >
                      Resources
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div 
                        className="text-4xl font-bold mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        2.3GB
                      </div>
                      <div 
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        of 10GB storage
                      </div>
                    </div>
                    
                    <div className="w-full max-w-32 mx-auto">
                      <div 
                        className="w-full rounded-full h-3 overflow-hidden shadow-inner"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                      >
                        <div 
                          className="h-3 rounded-full transition-all duration-700 shadow-sm"
                          style={{ 
                            width: '23%',
                            backgroundColor: 'var(--status-success-bg)',
                            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                        <span>0GB</span>
                        <span>10GB</span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span style={{ color: 'var(--text-muted)' }}>API Calls: </span>
                      <span 
                        style={{ color: 'var(--status-success-bg)' }}
                        className="font-bold text-lg"
                      >
                        847/5000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 고급 기능 메뉴 - 100% 너비 활용 */}
      <div className="w-full">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/60 shadow-lg">
          <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            🛠️ 고급 기능 메뉴
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {advancedFeatures.map((item, index) => (
              <button 
                key={index}
                onClick={() => handleTabChange(item.tab)}
                className="w-full p-5 lg:p-6 rounded-xl border-2 transition-all duration-300 text-center hover:scale-[1.02] hover:shadow-xl transform min-h-[120px] flex flex-col items-center justify-center space-y-2"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="text-3xl lg:text-4xl">{item.icon}</div>
                <div className="font-bold text-xs lg:text-sm leading-tight mt-2" style={{ color: 'var(--text-primary)' }}>
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 프로젝트 목록 */}
      <div className="w-full">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/60 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              📂 최근 프로젝트
            </h3>
            {projects.length > 0 && (
              <button
                onClick={() => handleTabChange('projects')}
                className="text-sm font-medium transition-all duration-300"
                style={{ color: 'var(--accent-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--accent-primary)';
                }}
              >
                모든 프로젝트 보기 →
              </button>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                아직 프로젝트가 없습니다
              </p>
              <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                첫 번째 AHP 프로젝트를 생성해보세요
              </p>
              <button
                onClick={() => handleTabChange('creation')}
                className="px-6 py-3 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-secondary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ➕ 새 프로젝트 만들기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {project.title}
                    </h4>
                    <div 
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: project.status === 'active' ? 'var(--status-success-light)' : project.status === 'completed' ? 'var(--status-info-light)' : 'var(--status-warning-light)',
                        color: project.status === 'active' ? 'var(--status-success-bg)' : project.status === 'completed' ? 'var(--status-info-bg)' : 'var(--status-warning-bg)'
                      }}
                    >
                      {project.status === 'active' ? '진행중' : project.status === 'completed' ? '완료' : '초안'}
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>기준</span>
                      <span style={{ color: 'var(--text-primary)' }}>{project.criteria_count || 0}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>대안</span>
                      <span style={{ color: 'var(--text-primary)' }}>{project.alternatives_count || 0}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>상태</span>
                      <span style={{ color: 'var(--text-primary)' }}>{project.workflow_stage || 'draft'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>수정일</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {formatDate(project.updated_at || project.created_at || new Date().toISOString())}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)}
          onProjectCreated={fetchProjects}
        />
      )}

      {showModelBuilder && currentProject && (
        <ModelBuilder
          project={currentProject}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onClose={() => {
            setShowModelBuilder(false);
            setCurrentProject(null);
            setActiveMenu('dashboard');
          }}
        />
      )}

      {showProjectSelector && projectSelectorConfig && (
        <ProjectSelector
          title={projectSelectorConfig.title}
          description={projectSelectorConfig.description}
          onProjectSelect={handleProjectSelect}
          onCancel={handleProjectSelectorCancel}
        />
      )}
        </>
      )}
    </div>
  );
};

export default PersonalServiceDashboard;