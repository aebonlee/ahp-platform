import React, { useState, useEffect } from 'react';
import UnifiedButton from './UnifiedButton';
import sessionService from '../../services/sessionService';

const SessionBar: React.FC = () => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [showSessionInfo, setShowSessionInfo] = useState(false);
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

    updateSessionStatus();
    const interval = setInterval(updateSessionStatus, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 로그인되지 않은 상태면 렌더링하지 않음
  if (!isLoggedIn) {
    return null;
  }

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

  return (
    <>
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* 세션 상태 표시 */}
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-lg text-sm font-medium border flex items-center space-x-2 ${getTimeColor()}`}>
                <span>{getTimeIcon()}</span>
                <span>세션: {remainingTime}분 남음</span>
              </div>
              
              {remainingTime <= 5 && (
                <div className="text-sm text-red-600 font-medium animate-pulse">
                  ⚠️ 곧 자동 로그아웃됩니다
                </div>
              )}
            </div>

            {/* 세션 컨트롤 버튼들 */}
            <div className="flex items-center space-x-2">
              <UnifiedButton
                variant="info"
                size="sm"
                onClick={() => {
                  sessionService.extendSession();
                  // 즉시 UI 업데이트
                  setRemainingTime(30);
                }}
                icon="⏰"
              >
                연장하기
              </UnifiedButton>
              
              <UnifiedButton
                variant="secondary"
                size="sm"
                onClick={() => setShowSessionInfo(!showSessionInfo)}
                icon="ℹ️"
              >
                세션정보
              </UnifiedButton>
              
              <UnifiedButton
                variant="danger"
                size="sm"
                onClick={() => {
                  sessionService.logout();
                  window.location.reload();
                }}
                icon="🚪"
              >
                로그아웃
              </UnifiedButton>
            </div>
          </div>
        </div>

        {/* 세션 정보 패널 */}
        {showSessionInfo && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h4 className="font-semibold text-gray-900 mb-3">세션 상세 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-gray-600 mb-1">로그인 시간</div>
                  <div className="font-medium text-gray-900">
                    {localStorage.getItem('login_time') ? 
                      new Date(parseInt(localStorage.getItem('login_time') || '0')).toLocaleString() : 
                      '정보 없음'
                    }
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-gray-600 mb-1">마지막 활동</div>
                  <div className="font-medium text-gray-900">
                    {localStorage.getItem('last_activity') ? 
                      new Date(parseInt(localStorage.getItem('last_activity') || '0')).toLocaleString() : 
                      '정보 없음'
                    }
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-gray-600 mb-1">자동 로그아웃</div>
                  <div className="font-medium text-gray-900">{remainingTime}분 후</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">💡</span>
                  <div className="text-sm text-blue-700">
                    <div className="font-medium mb-1">세션 관리 팁</div>
                    <ul className="space-y-1 text-xs">
                      <li>• 페이지를 새로고침(F5)해도 30분 이내라면 세션이 유지됩니다</li>
                      <li>• 클릭, 키보드 입력, 스크롤 등의 활동이 감지되면 마지막 활동 시간이 업데이트됩니다</li>
                      <li>• 자동 로그아웃 5분 전에 경고 알림이 표시됩니다</li>
                      <li>• 연장하기 버튼을 누르면 30분이 추가로 연장됩니다</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SessionBar;