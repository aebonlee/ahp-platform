import React, { useState, useEffect } from 'react';
import ThemeModeToggle from '../common/ThemeModeToggle';
import ColorThemeButton from '../common/ColorThemeButton';
import ParticleBackground from '../common/ParticleBackground';
import PricingSection from './PricingSection';

interface HomePageProps {
  onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick }) => {
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowScrollTop(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 테마 변경 감지
  useEffect(() => {
    const detectTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(theme === 'dark' || (!theme && systemPrefersDark) ? 'dark' : 'light');
    };

    // 초기 테마 설정
    detectTheme();

    // 테마 변경 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          detectTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => detectTheme();
    mediaQuery.addListener(handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeListener(handleMediaChange);
    };
  }, []);

  // 상단으로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen" style={{
      backgroundColor: 'var(--bg-primary, #ffffff)',
      color: 'var(--text-primary, #1f2937)'
    }}>
      {/* 헤더 - 잔디 스타일 */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 10 ? 'backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`} style={{
        backgroundColor: scrollY > 10 ? 'var(--bg-primary)95' : 'transparent'
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{
                backgroundImage: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))'
              }}>
                AHP for Paper
              </h1>
            </div>

            {/* 네비게이션 - 데스크톱 */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="transition-colors text-decoration-none hover:text-decoration-none" style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none'
              }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-primary)'}
                 onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'}>
                주요 기능
              </a>
              <a href="#how-it-works" className="transition-colors text-decoration-none hover:text-decoration-none" style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none'
              }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-primary)'}
                 onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'}>
                이용 방법
              </a>
              <a href="#guide" className="transition-colors text-decoration-none hover:text-decoration-none" style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none'
              }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-primary)'}
                 onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'}>
                사용 가이드
              </a>
              <a href="#pricing" className="transition-colors text-decoration-none hover:text-decoration-none" style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none'
              }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-primary)'}
                 onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'}>
                요금제
              </a>
              <a href="#research" className="transition-colors text-decoration-none hover:text-decoration-none" style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none'
              }} onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-primary)'}
                 onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'}>
                연구 사례
              </a>
            </nav>

            {/* CTA 버튼들 및 테마 컨트롤 */}
            <div className="hidden md:flex items-center gap-4">
              {/* 테마 컨트롤 */}
              <div className="flex items-center gap-2">
                <ThemeModeToggle />
                <ColorThemeButton />
              </div>
              
              <div className="w-px h-6" style={{ backgroundColor: 'var(--border-light)' }}></div>
              
              <button
                onClick={onLoginClick}
                className="px-5 py-2 transition-colors font-medium"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-primary)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'}
              >
                로그인
              </button>
              <button
                onClick={onLoginClick}
                className="px-6 py-2.5 text-white rounded-lg transition-all transform hover:scale-105 font-medium shadow-sm"
                style={{ backgroundColor: 'var(--accent-primary)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-hover)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-primary)'}
              >
                시작하기
              </button>
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="px-6 py-4 space-y-3">
              <a href="#features" className="block py-2" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>주요 기능</a>
              <a href="#how-it-works" className="block py-2" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>이용 방법</a>
              <a href="#guide" className="block py-2" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>사용 가이드</a>
              <a href="#pricing" className="block py-2" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>요금제</a>
              <a href="#research" className="block py-2" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>연구 사례</a>
              
              {/* 모바일 테마 컨트롤 */}
              <div className="flex items-center gap-3 py-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>테마:</span>
                <ThemeModeToggle />
                <ColorThemeButton />
              </div>
              
              <button 
                onClick={onLoginClick} 
                className="w-full py-3 mt-4 text-white rounded-lg"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                시작하기
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 히어로 섹션 - 모던 미니멀 */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* 심플한 배경 그라디언트 */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-subtle) 100%)`
        }}></div>
        
        {/* 미니멀 기하학적 요소들 */}
        <div className="absolute top-32 left-1/4 w-2 h-32 opacity-20" style={{
          backgroundColor: 'var(--accent-primary)',
          transform: 'rotate(15deg)'
        }}></div>
        <div className="absolute top-40 right-1/3 w-3 h-24 opacity-15" style={{
          backgroundColor: 'var(--accent-secondary)',
          transform: 'rotate(-25deg)'
        }}></div>
        <div className="absolute bottom-32 left-1/3 w-1 h-20 opacity-25" style={{
          backgroundColor: 'var(--accent-light)',
          transform: 'rotate(45deg)'
        }}></div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center">
            {/* 클린한 배지 */}
            <div className="inline-flex items-center px-6 py-2 rounded-full text-sm font-medium mb-8 border" style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-light)'
            }}>
              ✨ 논문 작성을 위한 전문 분석 도구
            </div>

            {/* 심플한 메인 타이틀 */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
              AHP 분석이
              <br />
              <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{
                backgroundImage: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))'
              }}>
                이렇게 쉬웠나?
              </span>
            </h1>

            {/* 심플한 서브 타이틀 */}
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              복잡한 의사결정을 <strong>3분 안에</strong> 체계적으로 분석하고
              <br />
              <strong>신뢰할 수 있는 연구 결과</strong>를 얻으세요
            </p>

            {/* 모던 CTA 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={onLoginClick}
                className="px-10 py-4 text-white rounded-2xl transition-all transform hover:scale-105 font-bold text-lg shadow-xl hover:shadow-2xl"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                🚀 무료로 시작하기
              </button>
              <button
                className="px-10 py-4 rounded-2xl transition-all font-bold text-lg border-2 hover:scale-105"
                style={{ 
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-medium)'
                }}
              >
                📖 사용법 보기
              </button>
            </div>

            {/* 심플한 통계 */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>1000+</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>논문 활용</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>98%</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>만족도</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>3분</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>평균 설정시간</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 - 모던 그리드 */}
      <section id="features" className="py-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              왜 AHP for Paper인가?
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              연구자가 필요로 하는 모든 기능을 하나의 플랫폼에서
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* 기능 카드 1 */}
              <div className="group rounded-3xl p-8 transition-all duration-300 hover:scale-105 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>3분 빠른 설정</h3>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  복잡한 설정 없이 바로 시작. 직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
                </p>
              </div>

              {/* 기능 카드 2 */}
              <div className="group rounded-3xl p-8 transition-all duration-300 hover:scale-105 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>자동 일관성 검증</h3>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  AI가 자동으로 일관성을 검증하고 개선 방안을 제시하여 신뢰할 수 있는 결과를 보장합니다.
                </p>
              </div>

              {/* 기능 카드 3 */}
              <div className="group rounded-3xl p-8 transition-all duration-300 hover:scale-105 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>논문 즉시 활용</h3>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  논문에 바로 사용할 수 있는 표, 그래프, 분석 결과를 자동으로 생성합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section id="how-it-works" className="py-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              간단한 3단계 프로세스
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              가이드를 따라 쉽게 연구를 진행하세요
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10">
            {/* 단계 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{
                  backgroundColor: 'var(--accent-primary)'
                }}>
                  1
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>계층 구조 설계</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  연구 목표와 평가 기준, 대안을 체계적으로 구성합니다
                </p>
              </div>
              {/* 연결선 */}
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5" style={{ backgroundColor: 'var(--border-medium)' }}></div>
            </div>

            {/* 단계 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{
                  backgroundColor: 'var(--accent-primary)'
                }}>
                  2
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>쌍대 비교</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  각 요소들을 1:1로 비교하여 상대적 중요도를 평가합니다
                </p>
              </div>
              {/* 연결선 */}
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5" style={{ backgroundColor: 'var(--border-medium)' }}></div>
            </div>

            {/* 단계 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{
                  backgroundColor: 'var(--accent-primary)'
                }}>
                  3
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>결과 분석</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  우선순위와 일관성 비율을 확인하고 최적 대안을 도출합니다
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사용 가이드 섹션 */}
      <section id="guide" className="py-20" style={{ backgroundColor: 'var(--bg-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              상세 사용 가이드
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              처음 사용자부터 전문가까지, 단계별 가이드로 쉽게 따라하세요
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 초보자 가이드 */}
              <div className="rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>초보자 가이드</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  AHP가 처음이신가요? 기본 개념부터 첫 프로젝트 완성까지
                </p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>• AHP 방법론 기초 이해</li>
                  <li>• 계정 생성 및 첫 프로젝트 만들기</li>
                  <li>• 기준과 대안 설정하기</li>
                  <li>• 쌍대비교 진행하기</li>
                  <li>• 결과 해석 및 활용하기</li>
                </ul>
              </div>

              {/* 중급자 가이드 */}
              <div className="rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>실무 활용 가이드</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  실제 연구에서 활용할 수 있는 고급 기능들을 익혀보세요
                </p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>• 다중 평가자 관리 및 협업</li>
                  <li>• 계층 구조 고도화</li>
                  <li>• 일관성 향상 기법</li>
                  <li>• 민감도 분석 수행</li>
                  <li>• 결과 시각화 및 보고서</li>
                </ul>
              </div>

              {/* 전문가 가이드 */}
              <div className="rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>논문 작성 가이드</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  학술 논문에서 AHP 결과를 효과적으로 활용하는 방법
                </p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>• 연구 방법론 서술 방법</li>
                  <li>• 일관성 비율 보고 기준</li>
                  <li>• 표와 그래프 작성 가이드</li>
                  <li>• 결과 해석 및 토론 작성</li>
                  <li>• 참고문헌 인용 방법</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 연구 사례 섹션 */}
      <section id="research" className="py-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              연구 활용 사례
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              다양한 분야에서 성공적으로 활용된 AHP 연구 사례들을 살펴보세요
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 사례 1 - 경영/경제 */}
              <div className="rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>경영전략 평가</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  기업의 신규 사업 진출 전략 우선순위 결정
                </p>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  기준: 수익성, 시장성, 리스크 • 대안: 5개 사업영역
                </div>
              </div>

              {/* 사례 2 - 공학/IT */}
              <div className="rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>SW 개발 도구 선택</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  프로젝트에 최적화된 개발 프레임워크 선정
                </p>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  기준: 성능, 개발속도, 유지보수성 • 대안: 7개 프레임워크
                </div>
              </div>

              {/* 사례 3 - 의료/보건 */}
              <div className="rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>의료서비스 우선순위</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  병원 진료과별 투자 우선순위 의사결정
                </p>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  기준: 환자수요, 수익성, 사회적가치 • 대안: 6개 진료과
                </div>
              </div>

              {/* 사례 4 - 교육 */}
              <div className="rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>교육과정 개선방안</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  대학 교육과정 개선을 위한 우선순위 분석
                </p>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  기준: 학습효과, 취업연계, 비용효율 • 대안: 8개 개선방안
                </div>
              </div>

              {/* 사례 5 - 환경 */}
              <div className="rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>환경정책 우선순위</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  지방자치단체 환경정책 투자 우선순위 결정
                </p>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  기준: 환경효과, 경제성, 실현가능성 • 대안: 9개 정책
                </div>
              </div>

              {/* 사례 6 - 사회과학 */}
              <div className="rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                    color: 'var(--accent-primary)'
                  }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>사회복지 정책 평가</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  지역사회 복지서비스 개선방안 우선순위 분석
                </p>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  기준: 사회적효과, 접근성, 지속가능성 • 대안: 7개 서비스
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 요금제 섹션 */}
      <PricingSection onLoginClick={onLoginClick} />

      {/* CTA 섹션 */}
      <section className="py-20" style={{
        background: `linear-gradient(to right, var(--accent-primary), var(--accent-secondary))`
      }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 바로 연구를 시작하세요
          </h2>
          <p className="text-xl mb-8" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            전문적인 AHP 분석으로 연구의 품질을 높이세요
          </p>
          <button
            onClick={onLoginClick}
            className="px-10 py-4 text-white rounded-xl transition-all transform hover:scale-105 font-semibold text-lg shadow-xl"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent-primary)' }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-secondary)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-primary)'}
          >
            14일 무료 체험 시작
          </button>
        </div>
      </section>


      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--text-inverse)',
        }}
        aria-label="상단으로 스크롤"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default HomePage;