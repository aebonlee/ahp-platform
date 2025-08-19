import React from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  userRole: 'super_admin' | 'admin' | 'evaluator' | null;
  adminType?: 'super' | 'personal';
  activeTab: string;
  onTabChange: (tab: string) => void;
  canSwitchModes?: boolean;
  onModeSwitch?: (mode: 'super' | 'personal') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, userRole, adminType, activeTab, onTabChange, canSwitchModes, onModeSwitch }) => {
  const superAdminMenuItems = [
    { id: 'dashboard', label: '시스템 대시보드', icon: '📊' },
    { id: 'users', label: '사용자 관리', icon: '👥' },
    { id: 'projects', label: '전체 프로젝트', icon: '📋' },
    { id: 'monitoring', label: '시스템 모니터링', icon: '⚡' },
    { id: 'database', label: 'DB 관리', icon: '🗄️' },
    { id: 'audit', label: '감사 로그', icon: '📝' },
    { id: 'settings', label: '시스템 설정', icon: '⚙️' },
    { id: 'backup', label: '백업/복원', icon: '💾' },
    { id: 'system', label: '시스템 정보', icon: '🖥️' },
    ...(canSwitchModes ? [{ id: 'mode-switch-to-personal', label: '고객 서비스로 전환', icon: '👤' }] : [])
  ];

  const personalServiceMenuItems = [
    { id: 'personal-service', label: '내 대시보드', icon: '🏠' },
    { id: 'user-guide', label: '사용자 가이드', icon: '📚' },
    { id: 'my-projects', label: '내 프로젝트', icon: '📂' },
    { id: 'project-creation', label: '새 프로젝트', icon: '➕' },
    { id: 'model-builder', label: '모델 구축', icon: '🏗️' },
    { id: 'evaluator-management', label: '평가자 관리', icon: '👥' },
    { id: 'progress-monitoring', label: '진행률 모니터링', icon: '📈' },
    { id: 'results-analysis', label: '결과 분석', icon: '📊' },
    { id: 'paper-management', label: '논문 작성 관리', icon: '📝' },
    { id: 'export-reports', label: '보고서 내보내기', icon: '📤' },
    { id: 'workshop-management', label: '워크숍 관리', icon: '🎯' },
    { id: 'decision-support-system', label: '의사결정 지원', icon: '🧠' },
    { id: 'personal-settings', label: '개인 설정', icon: '⚙️' }
  ];

  const evaluatorMenuItems = [
    { id: 'evaluator-dashboard', label: '평가자 홈', icon: '🏠' },
    { id: 'assigned-projects', label: '할당된 프로젝트', icon: '📋' },
    { id: 'pairwise-evaluation', label: '쌍대비교 평가', icon: '⚖️' },
    { id: 'direct-evaluation', label: '직접입력 평가', icon: '📝' },
    { id: 'my-evaluations', label: '내 평가 현황', icon: '📊' },
    { id: 'evaluation-history', label: '평가 이력', icon: '📜' },
    { id: 'consistency-check', label: '일관성 검증', icon: '✅' },
    { id: 'evaluation-guide', label: '평가 가이드', icon: '📖' },
    { id: 'evaluator-settings', label: '평가자 설정', icon: '⚙️' }
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const viewerMenuItems = [
    { id: 'viewer-dashboard', label: '조회 대시보드', icon: '👁️' },
    { id: 'public-projects', label: '공개 프로젝트', icon: '🌐' },
    { id: 'completed-results', label: '완료된 결과', icon: '✅' },
    { id: 'statistics-view', label: '통계 조회', icon: '📊' },
    { id: 'download-reports', label: '보고서 다운로드', icon: '⬇️' },
    { id: 'help-support', label: '도움말', icon: '❓' }
  ];

  const getMenuItems = () => {
    if (userRole === 'admin') {
      if (adminType === 'super') {
        return superAdminMenuItems;
      } else if (adminType === 'personal') {
        return personalServiceMenuItems;
      } else {
        // 관리자 유형이 선택되지 않은 경우 모드 선택만 표시
        return [{ id: 'admin-type-selection', label: '모드 선택', icon: '🔄' }];
      }
    }
    return evaluatorMenuItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen`}>
      <div className="p-4">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold mb-6 text-gray-100">
            {userRole === 'admin' 
              ? (adminType === 'super' ? '총괄 관리자' : adminType === 'personal' ? '개인 서비스' : '관리자')
              : '평가자'
            }
          </h2>
        )}
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isModeSwitch = item.id.startsWith('mode-switch-');
            const handleClick = () => {
              if (isModeSwitch && onModeSwitch) {
                if (item.id === 'mode-switch-to-personal') {
                  onModeSwitch('personal');
                } else if (item.id === 'mode-switch-to-super') {
                  onModeSwitch('super');
                }
              } else {
                onTabChange(item.id);
              }
            };
            
            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-primary-600 text-white'
                    : isModeSwitch
                    ? 'text-gray-300 hover:bg-orange-600 hover:text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;