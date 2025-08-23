import React, { useState, useEffect } from 'react';
import UnifiedButton from '../common/UnifiedButton';
import LayerPopup from '../common/LayerPopup';
import sessionService from '../../services/sessionService';

interface HeaderProps {
  user?: {
    first_name: string;
    last_name: string;
    role: 'super_admin' | 'admin' | 'evaluator';
    admin_type?: 'super' | 'personal';
  } | null;
  onLogout?: () => void;
  onLogoClick?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onLogoClick, activeTab, onTabChange }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 세션 상태 확인 및 시간 업데이트
    const updateSessionStatus = () => {
      const sessionValid = sessionService.isSessionValid();
      setIsLoggedIn(sessionValid);
      
      if (sessionValid) {
        setRemainingTime(sessionService.getRemainingTime());
      }
    };

    if (user) {
      updateSessionStatus();
      const interval = setInterval(updateSessionStatus, 60000); // 1분마다 업데이트
      return () => clearInterval(interval);
    }
  }, [user]);

  const getTimeColor = () => {
    if (remainingTime > 10) return 'bg-green-100 text-green-800 border-green-200';
    if (remainingTime > 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getTimeIcon = () => {
    if (remainingTime > 10) return '🟢';
    if (remainingTime > 5) return '🟡';
    return '🔴';
  };
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else if (user) {
      // 로그인 상태에서는 적절한 대시보드로 이동
      if (onTabChange) {
        if (user.role === 'super_admin' && user.admin_type === 'super') {
          onTabChange('super-admin');
        } else if (user.admin_type === 'personal') {
          onTabChange('personal-service');
        } else {
          onTabChange('welcome');
        }
      }
    } else {
      // 비로그인 상태에서는 홈페이지로
      window.location.href = '/';
    }
  };
  
  const handleQuickNavigation = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  
  const getQuickNavItems = () => {
    if (!user) return [];
    
    const items = [];
    
    if (user.role === 'super_admin' && user.admin_type === 'super') {
      items.push(
        { label: '대시보드', tab: 'super-admin', icon: '📊' },
        { label: '사용자', tab: 'users', icon: '👥' },
        { label: '모니터링', tab: 'monitoring', icon: '📈' }
      );
    } else if (user.admin_type === 'personal') {
      items.push(
        { label: '내 프로젝트', tab: 'my-projects', icon: '📋' },
        { label: '프로젝트 생성', tab: 'project-creation', icon: '➕' },
        { label: '결과 분석', tab: 'results-analysis', icon: '📊' }
      );
    } else if (user.role === 'evaluator') {
      items.push(
        { label: '평가 대시보드', tab: 'evaluator-dashboard', icon: '⚖️' },
        { label: '내 평가', tab: 'evaluator-status', icon: '📝' }
      );
    }
    
    return items;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-2"
              >
                {/* AHP 로고 아이콘 */}
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="2" fill="white"/>
                    <circle cx="8" cy="14" r="1.5" fill="white"/>
                    <circle cx="16" cy="14" r="1.5" fill="white"/>
                    <circle cx="6" cy="18" r="1" fill="white"/>
                    <circle cx="10" cy="18" r="1" fill="white"/>
                    <circle cx="14" cy="18" r="1" fill="white"/>
                    <circle cx="18" cy="18" r="1" fill="white"/>
                    <line x1="12" y1="10" x2="8" y2="12.5" stroke="white" strokeWidth="1" opacity="0.7"/>
                    <line x1="12" y1="10" x2="16" y2="12.5" stroke="white" strokeWidth="1" opacity="0.7"/>
                    <line x1="8" y1="15.5" x2="6" y2="17" stroke="white" strokeWidth="0.8" opacity="0.7"/>
                    <line x1="8" y1="15.5" x2="10" y2="17" stroke="white" strokeWidth="0.8" opacity="0.7"/>
                    <line x1="16" y1="15.5" x2="14" y2="17" stroke="white" strokeWidth="0.8" opacity="0.7"/>
                    <line x1="16" y1="15.5" x2="18" y2="17" stroke="white" strokeWidth="0.8" opacity="0.7"/>
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                    AHP for Paper
                  </h1>
                  <p className="text-xs text-gray-500 leading-tight">
                    연구 논문을 위한 AHP 분석
                  </p>
                </div>
              </button>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              {/* 빠른 네비게이션 */}
              <div className="hidden lg:flex items-center space-x-2">
                {getQuickNavItems().map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => handleQuickNavigation(item.tab)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === item.tab
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={item.label}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              
              {/* 세션 상태 및 컨트롤 */}
              {isLoggedIn && (
                <div className="flex items-center space-x-3">
                  {/* 세션 상태 표시 */}
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center space-x-2 ${getTimeColor()}`}>
                    <span>{getTimeIcon()}</span>
                    <span className="hidden sm:inline">세션: </span>
                    <span>{remainingTime}분</span>
                  </div>
                  
                  {remainingTime <= 5 && (
                    <div className="text-sm text-red-600 font-medium animate-pulse hidden md:block">
                      ⚠️ 곧 만료!
                    </div>
                  )}
                  
                  {/* 세션 컨트롤 버튼들 */}
                  <div className="flex items-center space-x-1">
                    <UnifiedButton
                      variant="info"
                      size="sm"
                      onClick={() => {
                        sessionService.extendSession();
                        setRemainingTime(30);
                      }}
                      icon="⏰"
                    >
                      <span className="hidden sm:inline">연장</span>
                    </UnifiedButton>
                    
                    <LayerPopup
                      trigger={
                        <UnifiedButton
                          variant="secondary"
                          size="sm"
                          icon="ℹ️"
                        >
                          <span className="hidden sm:inline">세션</span>
                        </UnifiedButton>
                      }
                      title="세션 상세 정보"
                      content={
                        <div className="space-y-6">
                          {/* 세션 상태 요약 */}
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-blue-900">현재 세션 상태</h4>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTimeColor()}`}>
                                {getTimeIcon()} {remainingTime}분 남음
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all duration-500 ${
                                  remainingTime > 10 ? 'bg-green-500' :
                                  remainingTime > 5 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.max(0, (remainingTime / 30) * 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-blue-700 mt-2">
                              {remainingTime > 10 ? '세션이 안정적으로 유지되고 있습니다.' :
                               remainingTime > 5 ? '세션이 곧 만료됩니다. 연장을 고려하세요.' :
                               '세션이 곧 만료됩니다! 즉시 연장하세요.'}
                            </p>
                          </div>

                          {/* 상세 정보 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border">
                              <div className="text-gray-600 text-sm mb-1">로그인 시간</div>
                              <div className="font-medium text-gray-900">
                                {localStorage.getItem('login_time') ? 
                                  new Date(parseInt(localStorage.getItem('login_time') || '0')).toLocaleString() : 
                                  '정보 없음'
                                }
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border">
                              <div className="text-gray-600 text-sm mb-1">마지막 활동</div>
                              <div className="font-medium text-gray-900">
                                {localStorage.getItem('last_activity') ? 
                                  new Date(parseInt(localStorage.getItem('last_activity') || '0')).toLocaleString() : 
                                  '정보 없음'
                                }
                              </div>
                            </div>
                          </div>

                          {/* 빠른 액션 */}
                          <div className="flex justify-center">
                            <UnifiedButton
                              variant="info"
                              size="md"
                              onClick={() => {
                                sessionService.extendSession();
                                setRemainingTime(30);
                              }}
                              icon="⏰"
                            >
                              지금 30분 연장하기
                            </UnifiedButton>
                          </div>
                        </div>
                      }
                      width="lg"
                    />
                  </div>
                </div>
              )}
              
              {/* 사용자 정보 */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-medium text-white">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 capitalize">
                      {user.role === 'super_admin' ? '시스템 관리자' : 
                       user.role === 'admin' ? '관리자' : '평가자'}
                    </span>
                    {user.admin_type && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {user.admin_type === 'super' ? '시스템' : '개인서비스'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 로그아웃 버튼 */}
              {onLogout && (
                <UnifiedButton
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('로그아웃 하시겠습니까?')) {
                      sessionService.logout();
                      onLogout();
                    }
                  }}
                  icon="🚪"
                >
                  <span className="hidden sm:inline">로그아웃</span>
                </UnifiedButton>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;