import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

type LoginMode = 'selection' | 'service' | 'register' | 'admin-select';

interface LoginFormProps {
  onLogin: (email: string, password: string, role?: string) => Promise<void>;
  onRegister?: () => void;
  loading?: boolean;
  error?: string;
  isAdmin?: boolean; // 관리자 권한 여부
  userEmail?: string; // 로그인한 사용자 이메일
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister, loading = false, error, isAdmin = false, userEmail = '' }) => {
  const [mode, setMode] = useState<LoginMode>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 관리자 권한 확인 후 서비스 선택 모드로 전환
  React.useEffect(() => {
    if (isAdmin && mode === 'service') {
      setMode('admin-select');
    }
  }, [isAdmin, mode]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      // 서비스 로그인 시 역할을 'evaluator'로 설정
      // 실제 역할(admin/user)은 백엔드에서 이메일 기반으로 결정
      const role = mode === 'service' ? 'evaluator' : 'user';
      await onLogin(email, password, role);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleModeSelect = (selectedMode: 'service' | 'register') => {
    setMode(selectedMode);
    setEmail('');
    setPassword('');
    setValidationErrors({});
  };

  // 관리자 서비스 선택 핸들러
  const handleAdminServiceSelect = (serviceType: 'admin' | 'personal') => {
    if (serviceType === 'admin') {
      // 관리자 페이지로 이동하는 로직
      onLogin(userEmail, '', 'admin');
    } else {
      // 개인 서비스로 이동하는 로직  
      onLogin(userEmail, '', 'evaluator');
    }
  };

  const handleBackToSelection = () => {
    setMode('selection');
    setEmail('');
    setPassword('');
    setValidationErrors({});
  };

  if (mode === 'selection') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
        backgroundColor: 'var(--bg-primary)'
      }}>
        {/* 고급스러운 그라디언트 배경 */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom right, var(--bg-elevated), var(--accent-primary), var(--accent-secondary))'
        }}></div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top right, transparent, rgba(var(--accent-rgb), 0.1), rgba(var(--accent-rgb), 0.2))'
        }}></div>
        
        {/* 세련된 기하학적 패턴 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl w-full space-y-8 relative z-10">
          {/* 개선된 헤더 디자인 */}
          <div className="text-center">
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3" style={{
                color: '#1f2937'
              }}>
                AHP for Paper
              </h1>
              <p className="text-lg sm:text-xl font-medium" style={{
                color: '#374151'
              }}>
                전문가급 의사결정 지원 시스템
              </p>
              <p className="text-base mt-2 font-normal" style={{
                color: '#6b7280'
              }}>
                Analytic Hierarchy Process Decision Support System
              </p>
            </div>
          </div>

          {/* 개선된 서비스 선택 카드 - 2가지 옵션 (회원가입, 서비스 이용) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto px-6 sm:px-8">
            {/* 회원가입 카드 (첫 번째) */}
            <Card 
              variant="glass" 
              hoverable={true} 
              className="bg-gray-50/95 backdrop-blur-xl border-2 border-purple-200/60 hover:border-purple-300/80 transform hover:scale-102 cursor-pointer hover:bg-gray-100/95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div 
                className="text-center p-6 sm:p-8 lg:p-10"
                onClick={() => handleModeSelect('register')}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-6 lg:mb-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6" style={{
                  color: '#1f2937',
                  fontWeight: '800'
                }}>
                  회원가입
                </h3>
                
                <p className="mb-6 lg:mb-8 leading-normal font-medium text-base sm:text-lg lg:text-xl" style={{
                  color: '#4b5563',
                  lineHeight: '1.4'
                }}>
                  연구용 계정을 생성하여
                  전문 AHP 분석을 시작하세요
                </p>
                
                <div className="space-y-3 lg:space-y-4 text-sm sm:text-base lg:text-lg mb-6 lg:mb-8" style={{
                  color: '#374151'
                }}>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#8b5cf6' }}>✓</span>
                    <span className="font-medium">연구 프로젝트 전용 계정</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#8b5cf6' }}>✓</span>
                    <span className="font-medium">학술 연구 완벽 지원</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#8b5cf6' }}>✓</span>
                    <span className="font-medium">가이드 학습 프로그램</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#8b5cf6' }}>✓</span>
                    <span className="font-medium">실제 연구 즉시 적용</span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-full text-lg font-bold py-4 lg:py-5"
                  onClick={() => handleModeSelect('register')}
                >
                  🎯 회원가입 시작하기
                </Button>
              </div>
            </Card>

            {/* 서비스 이용 카드 (두 번째) */}
            <Card 
              variant="glass" 
              hoverable={true} 
              className="bg-gray-50/95 backdrop-blur-xl border-2 border-blue-200/60 hover:border-blue-300/80 transform hover:scale-102 cursor-pointer hover:bg-gray-100/95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div 
                className="text-center p-6 sm:p-8 lg:p-10"
                onClick={() => handleModeSelect('service')}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-6 lg:mb-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6" style={{
                  color: '#1f2937',
                  fontWeight: '800'
                }}>
                  서비스 이용
                </h3>
                
                <p className="mb-6 lg:mb-8 leading-normal font-medium text-base sm:text-lg lg:text-xl" style={{
                  color: '#4b5563',
                  lineHeight: '1.4'
                }}>
                  AHP 의사결정 분석 플랫폼
                  개인/관리자 서비스 이용
                </p>
                
                <div className="space-y-3 lg:space-y-4 text-sm sm:text-base lg:text-lg mb-6 lg:mb-8" style={{
                  color: '#374151'
                }}>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#3b82f6' }}>✓</span>
                    <span className="font-medium">프로젝트 생성 및 관리</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#3b82f6' }}>✓</span>
                    <span className="font-medium">평가자 초대 및 설문 진행</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#3b82f6' }}>✓</span>
                    <span className="font-medium">실시간 결과 분석</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#3b82f6' }}>✓</span>
                    <span className="font-medium">관리자 권한 자동 인식</span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-full text-lg font-bold py-4 lg:py-5"
                  onClick={() => handleModeSelect('service')}
                >
                  🚀 서비스 로그인
                </Button>
              </div>
            </Card>
          </div>

          {/* 개선된 하단 정보 */}
          <div className="text-center text-sm">
            <p className="font-normal" style={{
              color: '#6b7280'
            }}>Powered by Advanced Analytics & Decision Intelligence</p>
          </div>
        </div>
      </div>
    );
  }

  // 회원가입 폼 화면
  if (mode === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
        backgroundColor: 'var(--bg-primary)'
      }}>
        {/* 보라색 테마 그라디언트 배경 */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom right, var(--bg-elevated), #8b5cf6, #7c3aed)'
        }}></div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top right, transparent, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.2))'
        }}></div>
        
        {/* 세련된 기하학적 패턴 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{
            backgroundColor: 'rgba(168, 85, 247, 0.2)'
          }}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000" style={{
            backgroundColor: 'rgba(147, 51, 234, 0.15)'
          }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{
            backgroundColor: 'rgba(196, 181, 253, 0.1)'
          }}></div>
        </div>

        <div className="max-w-xl w-full space-y-6 relative z-10">
          {/* 개선된 헤더 */}
          <div className="text-center">
            <button
              onClick={handleBackToSelection}
              className="inline-flex items-center hover:bg-gray-100 mb-4 border-0 transition-all duration-200 px-4 py-2 rounded-lg"
              style={{ color: '#374151' }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전으로 돌아가기
            </button>
            
            <h2 className="text-3xl font-bold mb-3" style={{
              color: '#1f2937'
            }}>
              회원가입
            </h2>
            
            <p className="mt-2 text-base font-normal" style={{
              color: '#4b5563'
            }}>
              AHP 분석 서비스에 가입하여 전문적인 의사결정을 시작하세요
            </p>
          </div>
          
          {/* 회원가입 폼 */}
          <Card variant="glass" className="bg-white/95 backdrop-blur-xl border-2 border-gray-200 shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border-2 border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <Input
                id="email"
                type="email"
                label="이메일 주소"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={setEmail}
                error={validationErrors.email}
                required
                variant="bordered"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              <Input
                id="password"
                type="password"
                label="비밀번호"
                placeholder="6자리 이상 비밀번호"
                value={password}
                onChange={setPassword}
                error={validationErrors.password}
                required
                variant="bordered"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              <div className="mt-6 space-y-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="xl"
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      가입 처리 중...
                    </>
                  ) : (
                    <>
                      🎯 계정 생성하기
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm mb-2" style={{
                    color: '#6b7280'
                  }}>이미 계정이 있으신가요?</p>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleModeSelect('service')}
                      className="font-semibold text-sm transition-colors duration-200"
                      style={{ 
                        color: '#3b82f6'
                      }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#1d4ed8'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#3b82f6'}
                    >
                      서비스 로그인하기
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // 관리자 서비스 선택 화면
  if (mode === 'admin-select') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
        backgroundColor: 'var(--bg-primary)'
      }}>
        {/* 그라디언트 배경 */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom right, var(--bg-elevated), #059669, #047857)'
        }}></div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top right, transparent, rgba(5, 150, 105, 0.1), rgba(4, 120, 87, 0.2))'
        }}></div>
        
        {/* 기하학적 패턴 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{
            backgroundColor: 'rgba(5, 150, 105, 0.2)'
          }}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000" style={{
            backgroundColor: 'rgba(4, 120, 87, 0.15)'
          }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{
            backgroundColor: 'rgba(6, 182, 212, 0.1)'
          }}></div>
        </div>

        <div className="max-w-6xl w-full space-y-8 relative z-10">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{
              color: '#1f2937',
              fontWeight: '800'
            }}>
              관리자 서비스 선택
            </h1>
            <p className="text-lg font-medium mb-2" style={{
              color: '#374151'
            }}>
              안녕하세요, {userEmail}님
            </p>
            <p className="text-base font-normal" style={{
              color: '#6b7280'
            }}>
              이용하실 서비스를 선택해주세요
            </p>
          </div>

          {/* 서비스 선택 카드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto px-4 sm:px-6">
            {/* 관리자 페이지 카드 */}
            <Card 
              variant="glass" 
              hoverable={true} 
              className="bg-gray-50/95 backdrop-blur-xl border-2 border-green-200/60 hover:border-green-300/80 transform hover:scale-102 cursor-pointer hover:bg-gray-100/95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div 
                className="text-center p-6 sm:p-8 lg:p-10"
                onClick={() => handleAdminServiceSelect('admin')}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-6 lg:mb-8 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6" style={{
                  color: '#1f2937',
                  fontWeight: '800'
                }}>
                  관리자 페이지
                </h3>
                
                <p className="mb-6 lg:mb-8 leading-normal font-medium text-base sm:text-lg lg:text-xl" style={{
                  color: '#4b5563',
                  lineHeight: '1.4'
                }}>
                  시스템 운영 및 사용자 관리를 위한
                  관리자 전용 대시보드
                </p>
                
                <div className="space-y-3 lg:space-y-4 text-sm sm:text-base lg:text-lg mb-6 lg:mb-8" style={{
                  color: '#374151'
                }}>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#059669' }}>⚙️</span>
                    <span className="font-medium">사용자 및 권한 관리</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#059669' }}>📊</span>
                    <span className="font-medium">구독 서비스 운영</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#059669' }}>📈</span>
                    <span className="font-medium">시스템 모니터링</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#059669' }}>📋</span>
                    <span className="font-medium">운영 통계 및 분석</span>
                  </div>
                </div>

                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full text-lg font-bold py-4 lg:py-5"
                  onClick={() => handleAdminServiceSelect('admin')}
                >
                  🔧 관리자 페이지로 이동
                </Button>
              </div>
            </Card>

            {/* 개인 서비스 카드 */}
            <Card 
              variant="glass" 
              hoverable={true} 
              className="bg-gray-50/95 backdrop-blur-xl border-2 border-blue-200/60 hover:border-blue-300/80 transform hover:scale-102 cursor-pointer hover:bg-gray-100/95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div 
                className="text-center p-6 sm:p-8 lg:p-10"
                onClick={() => handleAdminServiceSelect('personal')}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-6 lg:mb-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6" style={{
                  color: '#1f2937',
                  fontWeight: '800'
                }}>
                  개인 서비스
                </h3>
                
                <p className="mb-6 lg:mb-8 leading-normal font-medium text-base sm:text-lg lg:text-xl" style={{
                  color: '#4b5563',
                  lineHeight: '1.4'
                }}>
                  개인 연구자로서
                  AHP 분석 프로젝트 이용
                </p>
                
                <div className="space-y-3 lg:space-y-4 text-sm sm:text-base lg:text-lg mb-6 lg:mb-8" style={{
                  color: '#374151'
                }}>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#3b82f6' }}>📝</span>
                    <span className="font-medium">프로젝트 생성 및 관리</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#3b82f6' }}>👥</span>
                    <span className="font-medium">평가자 초대 및 설문 진행</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#3b82f6' }}>📊</span>
                    <span className="font-medium">실시간 결과 분석</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-3 text-lg lg:text-xl font-bold" style={{ color: '#3b82f6' }}>📄</span>
                    <span className="font-medium">리포트 생성 및 내보내기</span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-full text-lg font-bold py-4 lg:py-5"
                  onClick={() => handleAdminServiceSelect('personal')}
                >
                  🚀 개인 서비스로 이동
                </Button>
              </div>
            </Card>
          </div>

          {/* 하단 정보 */}
          <div className="text-center">
            <button
              onClick={() => setMode('selection')}
              className="inline-flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200"
              style={{ 
                color: '#6b7280'
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              다른 계정으로 로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 개선된 로그인 폼 화면 (서비스)
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      backgroundColor: 'var(--bg-primary)'
    }}>
      {/* 고급스러운 그라디언트 배경 */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom right, var(--bg-elevated), var(--accent-primary), var(--accent-secondary))'
      }}></div>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top right, transparent, rgba(var(--accent-rgb), 0.1), rgba(var(--accent-rgb), 0.2))'
      }}></div>
      
      {/* 세련된 기하학적 패턴 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{
          backgroundColor: 'rgba(var(--accent-rgb), 0.2)'
        }}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000" style={{
          backgroundColor: 'rgba(var(--accent-rgb), 0.15)'
        }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{
          backgroundColor: 'rgba(var(--accent-rgb), 0.1)'
        }}></div>
      </div>

      <div className="max-w-xl w-full space-y-6 relative z-10">
        {/* 개선된 헤더 */}
        <div className="text-center">
          <button
            onClick={handleBackToSelection}
            className="inline-flex items-center hover:bg-gray-100 mb-4 border-0 transition-all duration-200 px-4 py-2 rounded-lg"
            style={{ 
              color: '#374151'
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전으로 돌아가기
          </button>
          
          <h2 className="text-3xl font-bold mb-3" style={{
            color: '#1f2937'
          }}>
            서비스 로그인
          </h2>
          
          <p className="mt-2 text-base font-normal" style={{
            color: '#4b5563'
          }}>
            AHP 의사결정 분석 서비스에 로그인하세요
            <br />
            <span className="text-sm" style={{ color: '#6b7280' }}>관리자 권한은 이메일 기반으로 자동 인식됩니다</span>
          </p>
        </div>
        
        {/* 개선된 로그인 폼 */}
        <Card variant="glass" className="bg-white/95 backdrop-blur-xl border-2 border-gray-200 shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border-2 border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              </div>
            )}

            <Input
              id="email"
              type="email"
              label="이메일 주소"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={setEmail}
              error={validationErrors.email}
              required
              variant="bordered"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />

            <Input
              id="password"
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={setPassword}
              error={validationErrors.password}
              required
              variant="bordered"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="xl"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </>
              ) : (
                <>
                  🚀 서비스 로그인
                </>
              )}
            </Button>
          </form>

          {/* 개선된 회원가입 링크 */}
          {onRegister && (
            <div className="mt-6 text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-normal" style={{
                color: '#6b7280'
              }}>
                계정이 없으신가요?{' '}
                <button
                  onClick={() => handleModeSelect('register')}
                  className="font-semibold transition-all duration-200 hover:underline"
                  style={{
                    color: '#3b82f6'
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#1d4ed8'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#3b82f6'}
                >
                  회원가입하기 →
                </button>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;