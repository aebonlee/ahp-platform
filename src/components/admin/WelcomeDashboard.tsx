import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface WelcomeDashboardProps {
  user: {
    first_name: string;
    last_name: string;
    role: 'super_admin' | 'admin' | 'evaluator';
    admin_type?: 'super' | 'personal';
  };
  onGetStarted: () => void;
  onAdminTypeSelect: (type: 'super' | 'personal') => void;
  onNavigate?: (tab: string) => void;
}

const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({ 
  user, 
  onGetStarted, 
  onAdminTypeSelect,
  onNavigate 
}) => {
  // 시스템 관리자는 모드 선택, 일반 사용자는 바로 서비스 시작
  const isSystemAdmin = user.role === 'super_admin';
  const needsModeSelection = isSystemAdmin && !user.admin_type;
  
  if (needsModeSelection) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-6">
        {/* 간결한 헤더 */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">
              환영합니다, {user.first_name} {user.last_name}님! 👋
            </h1>
            <p className="text-primary-600 font-medium">관리자 모드를 선택해주세요</p>
          </div>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            시스템 관리와 고객 서비스 모드 중 선택하세요. 언제든지 전환 가능합니다.
          </p>
        </div>

        {/* 모드 선택 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 시스템 관리자 모드 */}
          <Card 
            hoverable={true}
            className="border border-primary-200 hover:border-primary-400 cursor-pointer group"
            onClick={() => onAdminTypeSelect('super')}
          >
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900">시스템 관리자</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                전체 시스템 관리, 사용자 관리, 운영 모니터링
              </p>
              <div className="space-y-2 text-xs text-neutral-600">
                <div className="flex items-center space-x-2">
                  <span className="text-primary-500">✓</span>
                  <span>전체 사용자 관리</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-primary-500">✓</span>
                  <span>모든 프로젝트 모니터링</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-primary-500">✓</span>
                  <span>시스템 설정 및 성능 관리</span>
                </div>
              </div>
              <Button 
                variant="primary" 
                className="w-full"
                onClick={(e) => {
                  e?.stopPropagation();
                  onAdminTypeSelect('super');
                }}
              >
                시스템 관리자로 시작
              </Button>
            </div>
          </Card>

          {/* 고객 서비스 모드 */}
          <Card 
            hoverable={true}
            className="border border-secondary-200 hover:border-secondary-400 cursor-pointer group"
            onClick={() => onAdminTypeSelect('personal')}
          >
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900">고객 서비스</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                개인 프로젝트 생성 및 AHP 분석 수행
              </p>
              <div className="space-y-2 text-xs text-neutral-600">
                <div className="flex items-center space-x-2">
                  <span className="text-secondary-500">✓</span>
                  <span>개인 프로젝트 생성</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-secondary-500">✓</span>
                  <span>평가자 초대 및 관리</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-secondary-500">✓</span>
                  <span>결과 분석 및 내보내기</span>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={(e) => {
                  e?.stopPropagation();
                  onAdminTypeSelect('personal');
                }}
              >
                고객 서비스로 시작
              </Button>
            </div>
          </Card>
        </div>

        {/* 안내 메시지 */}
        <div className="text-center bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            💡 언제든지 상단 메뉴에서 모드를 전환할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  // 사용자 환영 화면
  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* 헤더 */}
      <div className="text-center space-y-3">
        <div className="inline-block p-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">
            환영합니다, {user.first_name} {user.last_name}님! 🎉
          </h1>
          <p className="text-primary-600 font-medium">
            {user.admin_type === 'super' ? '🏢 시스템 관리자' : '👤 고객 서비스'} 모드
          </p>
        </div>
      </div>

      {/* 주요 기능 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable={true} className="border border-blue-200 hover:border-blue-400">
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
            <h3 className="font-bold text-gray-900">사용자 가이드</h3>
            <p className="text-sm text-gray-600">단계별 사용법을 확인하세요</p>
            <Button 
              variant="primary" 
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => onNavigate?.('user-guide')}
            >
              가이드 보기
            </Button>
          </div>
        </Card>

        <Card hoverable={true} className="border border-primary-200 hover:border-primary-400">
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
            <h3 className="font-bold text-gray-900">새 프로젝트</h3>
            <p className="text-sm text-gray-600">AHP 분석 프로젝트를 생성하세요</p>
            <Button 
              variant="primary" 
              size="sm"
              className="w-full"
              onClick={() => onNavigate?.('project-creation')}
            >
              프로젝트 생성
            </Button>
          </div>
        </Card>

        <Card hoverable={true} className="border border-secondary-200 hover:border-secondary-400">
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">📂</span>
            </div>
            <h3 className="font-bold text-gray-900">내 프로젝트</h3>
            <p className="text-sm text-gray-600">기존 프로젝트를 관리하세요</p>
            <Button 
              variant="secondary" 
              size="sm"
              className="w-full"
              onClick={() => onNavigate?.('my-projects')}
            >
              프로젝트 보기
            </Button>
          </div>
        </Card>

        <Card hoverable={true} className="border border-accent-200 hover:border-accent-400">
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="font-bold text-gray-900">평가자 관리</h3>
            <p className="text-sm text-gray-600">평가자를 초대하고 관리하세요</p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full"
              onClick={() => onNavigate?.('evaluator-management')}
            >
              평가자 관리
            </Button>
          </div>
        </Card>

        <Card hoverable={true} className="border border-orange-200 hover:border-orange-400">
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="font-bold text-gray-900">결과 분석</h3>
            <p className="text-sm text-gray-600">분석 결과를 확인하세요</p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full"
              onClick={() => onNavigate?.('results-analysis')}
            >
              결과 보기
            </Button>
          </div>
        </Card>
      </div>

      {/* 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50">
          <div className="text-center space-y-2 p-4">
            <div className="text-2xl font-bold text-primary-600">0</div>
            <div className="text-sm text-gray-600">진행 중인 프로젝트</div>
          </div>
        </Card>
        <Card className="bg-secondary-50">
          <div className="text-center space-y-2 p-4">
            <div className="text-2xl font-bold text-secondary-600">0</div>
            <div className="text-sm text-gray-600">완료된 프로젝트</div>
          </div>
        </Card>
        <Card className="bg-accent-50">
          <div className="text-center space-y-2 p-4">
            <div className="text-2xl font-bold text-accent-600">0</div>
            <div className="text-sm text-gray-600">참여 평가자</div>
          </div>
        </Card>
      </div>

      {/* 빠른 링크 */}
      <Card title="빠른 시작" className="bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
          <button
            onClick={() => onNavigate?.('workshop-management')}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors border"
          >
            <span className="text-lg">🎯</span>
            <span className="text-sm font-medium">워크숍 관리</span>
          </button>
          <button
            onClick={() => onNavigate?.('decision-support-system')}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors border"
          >
            <span className="text-lg">🧠</span>
            <span className="text-sm font-medium">의사결정 지원</span>
          </button>
          <button
            onClick={() => onNavigate?.('export-reports')}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors border"
          >
            <span className="text-lg">📤</span>
            <span className="text-sm font-medium">보고서 내보내기</span>
          </button>
          <button
            onClick={() => onNavigate?.('personal-settings')}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors border"
          >
            <span className="text-lg">⚙️</span>
            <span className="text-sm font-medium">개인 설정</span>
          </button>
        </div>
      </Card>

      {/* 시스템 관리자 전환 옵션 */}
      {user.role === 'super_admin' && (
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white">🔧</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">시스템 관리자 기능</h3>
                <p className="text-sm text-gray-600">시스템 관리자 모드로 전환할 수 있습니다</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => onAdminTypeSelect('super')}
            >
              모드 전환
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WelcomeDashboard;