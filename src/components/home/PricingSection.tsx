import React from 'react';

interface PricingSectionProps {
  onLoginClick: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onLoginClick }) => {
  const plans = [
    {
      name: '기본 연구자',
      price: '₩29,000',
      period: '/월',
      description: '개인 연구자를 위한 기본 플랜',
      popular: false,
      features: [
        '월 5개 프로젝트',
        '기본 AHP 분석 도구',
        '표준 보고서 생성',
        '이메일 지원',
        '클라우드 저장소 5GB',
        '기본 가이드 학습'
      ],
      buttonText: '기본 플랜 시작',
      buttonVariant: 'outline' as const
    },
    {
      name: '프로 연구자',
      price: '₩59,000',
      period: '/월',
      description: '전문 연구자를 위한 고급 플랜',
      popular: true,
      features: [
        '월 20개 프로젝트',
        '고급 AHP 분석 + 민감도 분석',
        '커스텀 보고서 템플릿',
        '우선 이메일 + 채팅 지원',
        '클라우드 저장소 50GB',
        '고급 가이드 + 1:1 컨설팅',
        '협업 기능 (5명까지)',
        '데이터 내보내기'
      ],
      buttonText: '프로 플랜 시작',
      buttonVariant: 'primary' as const
    },
    {
      name: '연구기관',
      price: '₩159,000',
      period: '/월',
      description: '연구기관·대학교를 위한 엔터프라이즈',
      popular: false,
      features: [
        '무제한 프로젝트',
        '전체 AHP 분석 스위트',
        '브랜드 커스터마이징',
        '전담 지원팀 + 전화 지원',
        '클라우드 저장소 500GB',
        '맞춤형 교육 프로그램',
        '무제한 협업 사용자',
        'API 접근 권한',
        '온프레미스 배포 옵션',
        'SLA 보장'
      ],
      buttonText: '연구기관 문의',
      buttonVariant: 'secondary' as const
    }
  ];

  return (
    <section id="pricing" className="py-20" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            연구 규모에 맞는 요금제
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            개인 연구자부터 대형 연구기관까지, 모든 연구 환경에 최적화된 플랜을 제공합니다
          </p>
        </div>

        {/* 요금제 카드들 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? 'shadow-xl'
                  : 'shadow-sm hover:shadow-lg'
              }`}
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: plan.popular ? 'var(--accent-primary)' : 'var(--border-medium)'
              }}
            >
              {/* 인기 배지 */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="text-white px-6 py-2 rounded-full text-sm font-semibold" style={{
                    background: `linear-gradient(to right, var(--accent-primary), var(--accent-secondary))`
                  }}>
                    가장 인기
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* 플랜 이름 */}
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {plan.name}
                </h3>
                
                {/* 설명 */}
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {plan.description}
                </p>

                {/* 가격 */}
                <div className="mb-8">
                  <span className="text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {plan.price}
                  </span>
                  <span className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                    {plan.period}
                  </span>
                  {plan.name === '연구기관' && (
                    <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                      * 사용자 수에 따라 할인 적용
                    </p>
                  )}
                </div>

                {/* 기능 목록 */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA 버튼 */}
                <button
                  onClick={onLoginClick}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: plan.buttonVariant === 'outline' 
                      ? 'transparent' 
                      : 'var(--accent-primary)',
                    color: plan.buttonVariant === 'outline' 
                      ? 'var(--accent-primary)' 
                      : 'white',
                    border: plan.buttonVariant === 'outline' 
                      ? `2px solid var(--accent-primary)` 
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (plan.buttonVariant === 'outline') {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-primary)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'white';
                    } else {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.buttonVariant === 'outline') {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-primary)';
                    } else {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-primary)';
                    }
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 추가 정보 */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl p-8 shadow-sm border" style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-light)' 
          }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              모든 플랜에 포함된 기본 혜택
            </h3>
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--accent-light)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>품질 보장</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>검증된 AHP 알고리즘</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--accent-light)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>보안</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>데이터 암호화 및 보호</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--accent-light)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>지원</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>한국어 고객 지원</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--accent-light)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>업데이트</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>정기 기능 업데이트</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            자주 묻는 질문
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="rounded-xl p-6 shadow-sm border" style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-light)' 
            }}>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Q. 중도에 플랜을 변경할 수 있나요?
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 시점부터 새로운 요금이 적용됩니다.
              </p>
            </div>
            <div className="rounded-xl p-6 shadow-sm border" style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-light)' 
            }}>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Q. 무료 체험 기간이 있나요?
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                모든 플랜에서 14일 무료 체험을 제공합니다. 체험 기간 중 언제든 취소 가능합니다.
              </p>
            </div>
            <div className="rounded-xl p-6 shadow-sm border" style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-light)' 
            }}>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Q. 연구기관 할인이 있나요?
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                대학교, 연구소 등 교육기관은 별도 문의를 통해 특별 할인 혜택을 받으실 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl p-6 shadow-sm border" style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-light)' 
            }}>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Q. 데이터는 안전하게 보관되나요?
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                모든 데이터는 AWS 기반 클라우드에 암호화되어 저장되며, 정기 백업과 보안 모니터링을 실시합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;