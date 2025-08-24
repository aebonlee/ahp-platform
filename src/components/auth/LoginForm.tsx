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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* 고급스러운 그라디언트 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-600/10 to-cyan-500/20"></div>
        
        {/* 세련된 기하학적 패턴 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl w-full space-y-8 relative z-10">
          {/* 개선된 헤더 디자인 */}
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  AHP for Paper
                </span>
              </h1>
              <p className="text-2xl text-blue-200 font-light">
                전문가급 의사결정 지원 시스템
              </p>
              <p className="text-lg text-blue-300/70 mt-2 font-light">
                Analytic Hierarchy Process Decision Support System
              </p>
            </div>
          </div>

          {/* 개선된 서비스 선택 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 서비스 이용 카드 */}
            <Card 
              variant="glass" 
              hoverable={true} 
              className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-blue-400/50 transform hover:scale-105 cursor-pointer hover:bg-white/15 transition-all duration-300"
            >
              <div 
                className="text-center p-8"
                onClick={() => handleModeSelect('service')}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  서비스 이용
                </h3>
                
                <p className="text-blue-100 mb-6 leading-relaxed font-light">
                  AHP 의사결정 분석을 위한<br />
                  프로젝트 생성 및 평가 서비스
                </p>
                
                <div className="space-y-3 text-sm text-blue-100 mb-6">
                  <div className="flex items-center justify-center">
                    <span className="text-green-400 mr-2 text-lg">✓</span>
                    <span className="font-light">프로젝트 생성 및 관리</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-400 mr-2 text-lg">✓</span>
                    <span className="font-light">평가자 초대 및 설문 진행</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-400 mr-2 text-lg">✓</span>
                    <span className="font-light">실시간 결과 분석</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-400 mr-2 text-lg">✓</span>
                    <span className="font-light">리포트 생성 및 내보내기</span>
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
              className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-green-400/50 transform hover:scale-105 cursor-pointer hover:bg-white/15 transition-all duration-300"
            >
              <div 
                className="text-center p-8"
                onClick={() => handleModeSelect('admin')}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  시스템 관리
                </h3>
                
                <p className="text-blue-100 mb-6 leading-relaxed font-light">
                  시스템 운영 및 사용자 관리를 위한<br />
                  관리자 전용 대시보드
                </p>
                
                <div className="space-y-3 text-sm text-blue-100 mb-6">
                  <div className="flex items-center justify-center">
                    <span className="text-cyan-400 mr-2 text-lg">✓</span>
                    <span className="font-light">사용자 및 권한 관리</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-cyan-400 mr-2 text-lg">✓</span>
                    <span className="font-light">구독 서비스 운영</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-cyan-400 mr-2 text-lg">✓</span>
                    <span className="font-light">시스템 모니터링</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-cyan-400 mr-2 text-lg">✓</span>
                    <span className="font-light">운영 통계 및 분석</span>
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

          {/* 개선된 하단 정보 */}
          <div className="text-center text-blue-200/70 text-sm">
            <p className="font-light">Powered by Advanced Analytics & Decision Intelligence</p>
          </div>
        </div>
      </div>
    );
  }

  // 개선된 로그인 폼 화면 (서비스 또는 관리자)
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 고급스러운 그라디언트 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-600/10 to-cyan-500/20"></div>
      
      {/* 세련된 기하학적 패턴 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* 개선된 헤더 */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="inline-flex items-center text-white/80 hover:text-white hover:bg-white/10 mb-6 border-0 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전으로 돌아가기
          </Button>
          
          <h2 className="text-4xl font-bold mb-4">
            {mode === 'service' ? (
              <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                서비스 로그인
              </span>
            ) : (
              <span className="bg-gradient-to-r from-green-200 to-cyan-200 bg-clip-text text-transparent">
                관리자 로그인
              </span>
            )}
          </h2>
          
          <p className="mt-2 text-lg text-blue-200/80 font-light">
            {mode === 'service' 
              ? 'AHP 의사결정 분석 서비스에 로그인하세요'
              : '시스템 관리 대시보드에 로그인하세요'
            }
          </p>
        </div>
        
        {/* 개선된 로그인 폼 */}
        <Card variant="glass" className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border-2 border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-200 font-light">{error}</p>
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

          {/* 개선된 회원가입 링크 */}
          {onRegister && (
            <div className="mt-8 text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <p className="text-sm text-blue-100 font-light">
                계정이 없으신가요?{' '}
                <button
                  onClick={onRegister}
                  className={`font-medium ${
                    mode === 'service' 
                      ? 'text-blue-300 hover:text-blue-200' 
                      : 'text-green-300 hover:text-green-200'
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