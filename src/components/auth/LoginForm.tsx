import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

type LoginMode = 'selection' | 'service' | 'admin';

interface LoginFormProps {
  onLogin: (email: string, password: string, role?: string) => Promise<void>;
  onRegister?: () => void;
  loading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister, loading = false, error }) => {
  const [mode, setMode] = useState<LoginMode>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
      const role = mode === 'service' ? 'evaluator' : 'admin';
      await onLogin(email, password, role);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleModeSelect = (selectedMode: 'service' | 'admin') => {
    setMode(selectedMode);
    setEmail('');
    setPassword('');
    setValidationErrors({});
  };

  const handleBackToSelection = () => {
    setMode('selection');
    setEmail('');
    setPassword('');
    setValidationErrors({});
  };

  if (mode === 'selection') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Blocksy 스타일 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-cyan-200 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-200 rounded-full blur-lg"></div>
          <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-indigo-200 rounded-full blur-md"></div>
        </div>

        <div className="max-w-4xl w-full space-y-8 relative z-10">
          {/* Blocksy 스타일 헤더 */}
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg">
                AHP for Paper
              </h1>
              <p className="text-2xl text-blue-100 font-semibold">
                전문가급 의사결정 지원 시스템
              </p>
              <p className="text-lg text-blue-200 mt-2 font-medium">
                Analytic Hierarchy Process Decision Support System
              </p>
            </div>
          </div>

          {/* Blocksy 스타일 서비스 선택 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 서비스 이용 카드 */}
            <Card 
              variant="glass" 
              hoverable={true} 
              className="border-2 border-white/30 hover:border-primary-300 transform hover:scale-105 cursor-pointer"
            >
              <div 
                className="text-center p-8"
                onClick={() => handleModeSelect('service')}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-blocksy-xl flex items-center justify-center shadow-blocksy-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-black text-neutral-900 mb-4">
                  서비스 이용
                </h3>
                
                <p className="text-neutral-700 mb-6 leading-relaxed font-medium">
                  AHP 의사결정 분석을 위한<br />
                  프로젝트 생성 및 평가 서비스
                </p>
                
                <div className="space-y-3 text-sm text-neutral-700 mb-6">
                  <div className="flex items-center justify-center">
                    <span className="text-success-500 mr-2 text-lg">✓</span>
                    <span className="font-semibold">프로젝트 생성 및 관리</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-success-500 mr-2 text-lg">✓</span>
                    <span className="font-semibold">평가자 초대 및 설문 진행</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-success-500 mr-2 text-lg">✓</span>
                    <span className="font-semibold">실시간 결과 분석</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-success-500 mr-2 text-lg">✓</span>
                    <span className="font-semibold">리포트 생성 및 내보내기</span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-full"
                  onClick={() => handleModeSelect('service')}
                >
                  🚀 서비스 로그인
                </Button>
              </div>
            </Card>

            {/* 관리자 로그인 카드 */}
            <Card 
              variant="glass" 
              hoverable={true} 
              className="border-2 border-white/30 hover:border-secondary-300 transform hover:scale-105 cursor-pointer"
            >
              <div 
                className="text-center p-8"
                onClick={() => handleModeSelect('admin')}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-blocksy-xl flex items-center justify-center shadow-blocksy-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-black text-neutral-900 mb-4">
                  시스템 관리
                </h3>
                
                <p className="text-neutral-700 mb-6 leading-relaxed font-medium">
                  시스템 운영 및 사용자 관리를 위한<br />
                  관리자 전용 대시보드
                </p>
                
                <div className="space-y-3 text-sm text-neutral-700 mb-6">
                  <div className="flex items-center justify-center">
                    <span className="text-accent-500 mr-2 text-lg">✓</span>
                    <span className="font-semibold">사용자 및 권한 관리</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-accent-500 mr-2 text-lg">✓</span>
                    <span className="font-semibold">구독 서비스 운영</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-accent-500 mr-2 text-lg">✓</span>
                    <span className="font-semibold">시스템 모니터링</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-accent-500 mr-2 text-lg">✓</span>
                    <span className="font-semibold">운영 통계 및 분석</span>
                  </div>
                </div>

                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full"
                  onClick={() => handleModeSelect('admin')}
                >
                  ⚙️ 관리자 로그인
                </Button>
              </div>
            </Card>
          </div>

          {/* Blocksy 스타일 하단 정보 */}
          <div className="text-center text-blue-100 text-sm">
            <p className="font-medium">Powered by Advanced Analytics & Decision Intelligence</p>
          </div>
        </div>
      </div>
    );
  }

  // Blocksy 스타일 로그인 폼 화면 (서비스 또는 관리자)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Blocksy 스타일 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-cyan-200 rounded-full blur-lg"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-200 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Blocksy 스타일 헤더 */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="inline-flex items-center text-white hover:bg-white/20 mb-6 border-0"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전으로 돌아가기
          </Button>
          
          <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">
            {mode === 'service' ? (
              <>
                <span className="text-blue-200">서비스</span> 로그인
              </>
            ) : (
              <>
                <span className="text-green-200">관리자</span> 로그인
              </>
            )}
          </h2>
          
          <p className="mt-2 text-lg text-blue-100 font-medium">
            {mode === 'service' 
              ? 'AHP 의사결정 분석 서비스에 로그인하세요'
              : '시스템 관리 대시보드에 로그인하세요'
            }
          </p>
        </div>
        
        {/* Blocksy 스타일 로그인 폼 */}
        <Card variant="glass" className="shadow-blocksy-xl border-2 border-white/30">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-50 border-2 border-error-200 rounded-blocksy p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-error-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-error-700 font-semibold">{error}</p>
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
              variant={mode === 'service' ? 'primary' : 'secondary'}
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
                  {mode === 'service' ? '🚀' : '⚙️'} 로그인
                </>
              )}
            </Button>
          </form>

          {/* Blocksy 스타일 회원가입 링크 */}
          {onRegister && (
            <div className="mt-8 text-center p-4 bg-neutral-50 rounded-blocksy border border-neutral-200">
              <p className="text-sm text-neutral-700 font-medium">
                계정이 없으신가요?{' '}
                <button
                  onClick={onRegister}
                  className={`font-bold ${
                    mode === 'service' 
                      ? 'text-primary-600 hover:text-primary-700' 
                      : 'text-secondary-600 hover:text-secondary-700'
                  } transition-all duration-200 hover:underline`}
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