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

interface FavoriteMenuItem {
  id: string;
  label: string;
  tab: string;
  icon: string;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onLogoClick, activeTab, onTabChange }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteMenuItem[]>([]);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);

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

  // 즐겨찾기 로드
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.first_name}_${user.last_name}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [user]);

  // 즐겨찾기 저장
  const saveFavorites = (newFavorites: FavoriteMenuItem[]) => {
    if (user) {
      localStorage.setItem(`favorites_${user.first_name}_${user.last_name}`, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    }
  };

  // 즐겨찾기 추가
  const addToFavorites = (item: Omit<FavoriteMenuItem, 'id'>) => {
    const newFavorite: FavoriteMenuItem = {
      ...item,
      id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const newFavorites = [...favorites, newFavorite];
    saveFavorites(newFavorites);
  };

  // 즐겨찾기 제거
  const removeFromFavorites = (id: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== id);
    saveFavorites(newFavorites);
  };

  // 현재 탭이 즐겨찾기에 있는지 확인
  const isCurrentTabFavorite = () => {
    return favorites.some(fav => fav.tab === activeTab);
  };

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
      <div className="w-full px-12" style={{ marginLeft: '50px', marginRight: '50px' }}>
        <div className="flex items-center justify-between h-18 py-2">
          {/* 왼쪽 로고 영역 */}
          <div className="flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-4 hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl p-3"
            >
              {/* AHP 로고 아이콘 */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="2" fill="white"/>
                  <circle cx="8" cy="14" r="1.5" fill="white"/>
                  <circle cx="16" cy="14" r="1.5" fill="white"/>
                  <circle cx="6" cy="18" r="1" fill="white"/>
                  <circle cx="10" cy="18" r="1" fill="white"/>
                  <circle cx="14" cy="18" r="1" fill="white"/>
                  <circle cx="18" cy="18" r="1" fill="white"/>
                  <line x1="12" y1="10" x2="8" y2="12.5" stroke="white" strokeWidth="1" opacity="0.8"/>
                  <line x1="12" y1="10" x2="16" y2="12.5" stroke="white" strokeWidth="1" opacity="0.8"/>
                  <line x1="8" y1="15.5" x2="6" y2="17" stroke="white" strokeWidth="0.8" opacity="0.8"/>
                  <line x1="8" y1="15.5" x2="10" y2="17" stroke="white" strokeWidth="0.8" opacity="0.8"/>
                  <line x1="16" y1="15.5" x2="14" y2="17" stroke="white" strokeWidth="0.8" opacity="0.8"/>
                  <line x1="16" y1="15.5" x2="18" y2="17" stroke="white" strokeWidth="0.8" opacity="0.8"/>
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 leading-tight">
                  AHP for Paper
                </h1>
                <p className="text-sm text-gray-600 font-medium leading-tight">
                  연구 논문을 위한 AHP 분석
                </p>
              </div>
            </button>
          </div>

          {/* 중앙 메뉴 영역 */}
          {user && (
            <div className="flex-1 flex items-center justify-center space-x-6">
              {/* 즐겨찾기 메뉴 */}
              <div className="flex items-center space-x-4">
                <LayerPopup
                  trigger={
                    <UnifiedButton
                      variant="secondary"
                      size="md"
                      icon="⭐"
                      className="relative"
                    >
                      <span>즐겨찾기</span>
                      {favorites.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
                    </UnifiedButton>
                  }
                  title="즐겨찾기 메뉴"
                  content={
                    <div className="space-y-4 w-80">
                      {favorites.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <span className="text-4xl mb-4 block">⭐</span>
                          <p>즐겨찾기가 비어있습니다</p>
                          <p className="text-sm mt-2">현재 페이지에서 ⭐ 버튼을 클릭하여 추가해보세요</p>
                        </div>
                      ) : (
                        <>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">내 즐겨찾기 ({favorites.length})</h4>
                            <p className="text-sm text-blue-700">자주 사용하는 메뉴를 빠르게 접근하세요</p>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {favorites.map((fav) => (
                              <div key={fav.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm">
                                <button
                                  onClick={() => {
                                    if (onTabChange) onTabChange(fav.tab);
                                  }}
                                  className="flex items-center space-x-3 flex-1 text-left hover:text-blue-600"
                                >
                                  <span className="text-lg">{fav.icon}</span>
                                  <span className="font-medium">{fav.label}</span>
                                </button>
                                <UnifiedButton
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeFromFavorites(fav.id)}
                                  icon="🗑️"
                                >
                                  
                                </UnifiedButton>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  }
                  width="md"
                />

                {/* 현재 페이지 즐겨찾기 토글 */}
                {activeTab && getQuickNavItems().some(item => item.tab === activeTab) && (
                  <UnifiedButton
                    variant={isCurrentTabFavorite() ? "warning" : "secondary"}
                    size="sm"
                    onClick={() => {
                      const currentItem = getQuickNavItems().find(item => item.tab === activeTab);
                      if (currentItem) {
                        if (isCurrentTabFavorite()) {
                          const favItem = favorites.find(fav => fav.tab === activeTab);
                          if (favItem) removeFromFavorites(favItem.id);
                        } else {
                          addToFavorites(currentItem);
                        }
                      }
                    }}
                    icon={isCurrentTabFavorite() ? "⭐" : "☆"}
                  >
                    
                  </UnifiedButton>
                )}
              </div>

              {/* 빠른 네비게이션 */}
              <div className="hidden lg:flex items-center space-x-2">
                {getQuickNavItems().slice(0, 4).map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => handleQuickNavigation(item.tab)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === item.tab
                        ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={item.label}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* 세션 상태 */}
              {isLoggedIn && (
                <div className="flex items-center space-x-3">
                  <div className={`px-4 py-2 rounded-xl text-sm font-medium border flex items-center space-x-2 ${getTimeColor()}`}>
                    <span className="text-base">{getTimeIcon()}</span>
                    <span className="hidden sm:inline">세션: </span>
                    <span className="font-bold">{remainingTime}분</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
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
                          
                        </UnifiedButton>
                      }
                      title="세션 상세 정보"
                      content={
                        <div className="space-y-6">
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
            </div>
          )}

          {/* 오른쪽 사용자 정보 및 로그아웃 영역 */}
          {user && (
            <div className="flex items-center space-x-4">
              {/* 사용자 정보 */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-base font-bold text-gray-900">
                    {user.first_name} {user.last_name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 capitalize">
                      {user.role === 'super_admin' ? '시스템 관리자' : 
                       user.role === 'admin' ? '관리자' : '평가자'}
                    </span>
                    {user.admin_type && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
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
                  size="md"
                  onClick={() => {
                    if (window.confirm('로그아웃 하시겠습니까?')) {
                      sessionService.logout();
                      onLogout();
                    }
                  }}
                  icon="🚪"
                >
                  <span className="hidden sm:inline font-medium">로그아웃</span>
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