import React, { useState, useEffect } from 'react';

interface NewsPost {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  category: string;
  featured: boolean;
  views: number;
  image?: string;
}

interface NewsPageProps {
  onBackClick: () => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onBackClick }) => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'platform', label: '플랫폼 업데이트' },
    { value: 'research', label: '연구 성과' },
    { value: 'case', label: '활용 사례' },
    { value: 'news', label: '보도자료' },
    { value: 'event', label: '이벤트' }
  ];

  const newsPosts: NewsPost[] = [
    {
      id: 1,
      title: 'AURI 스타일 UI/UX 개편 완료 - 더욱 직관적인 사용자 경험 제공',
      content: '사용자 피드백을 반영하여 전면적인 디자인 개선을 완료했습니다. 미니멀하고 깔끔한 인터페이스로 연구 효율성을 높였습니다. 새로운 디자인은 AURI 웹사이트의 모던한 디자인 트렌드를 적용하여 사용자 경험을 크게 향상시켰습니다.',
      author: '개발팀',
      created_at: '2024-08-31',
      category: 'platform',
      featured: true,
      views: 324
    },
    {
      id: 2,
      title: '국내 주요 대학 1,000+ 논문에서 AHP 분석 도구 활용 검증',
      content: '서울대, 연세대, 고려대 등 주요 대학의 논문 연구에서 우리 플랫폼을 활용한 AHP 분석 결과가 높은 신뢰도를 보였습니다. 특히 일관성 비율과 분석 정확도에서 기존 도구 대비 우수한 성능을 입증했습니다.',
      author: '연구팀',
      created_at: '2024-08-25',
      category: 'research',
      featured: true,
      views: 567
    },
    {
      id: 3,
      title: '한국직업능력개발센터와 AHP 연구 플랫폼 파트너십 체결',
      content: '교육 및 연구 분야의 의사결정 지원을 위한 전략적 파트너십을 체결했습니다. 이를 통해 더 많은 연구자들이 고품질의 AHP 분석 서비스를 이용할 수 있게 되었습니다.',
      author: '경영진',
      created_at: '2024-08-20',
      category: 'news',
      featured: false,
      views: 445
    },
    {
      id: 4,
      title: '삼성전자 연구소 - AHP를 활용한 신제품 개발 우선순위 분석 사례',
      content: '삼성전자 연구소에서 신제품 개발 프로젝트의 우선순위를 결정하기 위해 우리 플랫폼을 활용했습니다. 50명의 전문가가 참여한 대규모 평가를 통해 성공적인 의사결정을 이끌어냈습니다.',
      author: '사례연구팀',
      created_at: '2024-08-15',
      category: 'case',
      featured: false,
      views: 678
    },
    {
      id: 5,
      title: '2024년 하반기 AHP 연구 워크샵 개최 안내',
      content: '9월 15일부터 17일까지 3일간 AHP 방법론과 플랫폼 활용법을 배우는 워크샵을 개최합니다. 초급자부터 고급 사용자까지 수준별 프로그램을 제공합니다.',
      author: '교육팀',
      created_at: '2024-08-10',
      category: 'event',
      featured: false,
      views: 234
    },
    {
      id: 6,
      title: 'AI 기반 일관성 개선 기능 베타 출시',
      content: '인공지능을 활용하여 쌍대비교의 일관성을 자동으로 개선해주는 새로운 기능을 베타 버전으로 출시했습니다. 평가자의 판단 패턴을 학습하여 더 나은 결과를 제안합니다.',
      author: 'AI개발팀',
      created_at: '2024-08-05',
      category: 'platform',
      featured: false,
      views: 512
    }
  ];

  useEffect(() => {
    setPosts(newsPosts);
  }, []);

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const featuredPosts = posts.filter(post => post.featured);

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      platform: { label: '플랫폼 업데이트', color: '#0066cc', bg: '#e3f2fd' },
      research: { label: '연구 성과', color: '#22c55e', bg: '#e8f5e8' },
      case: { label: '활용 사례', color: '#f59e0b', bg: '#fef3e2' },
      news: { label: '보도자료', color: '#8b5cf6', bg: '#f3e8ff' },
      event: { label: '이벤트', color: '#ef4444', bg: '#fee2e2' }
    };
    const config = categoryConfig[category as keyof typeof categoryConfig];
    
    return (
      <span 
        className="inline-block px-3 py-1 text-xs font-medium rounded-full"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      {/* 헤더 */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center">
            <button
              onClick={onBackClick}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                AHP NEWS
              </h1>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                최신 연구 동향과 플랫폼 업데이트 소식
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* 사이드바 - 카테고리 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              
              {/* 카테고리 필터 */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border-light)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>카테고리</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.value ? 'font-semibold' : ''
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category.value ? 'var(--accent-light)' : 'transparent',
                        color: selectedCategory === category.value ? 'var(--accent-primary)' : 'var(--text-secondary)'
                      }}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 주요 소식 */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border-light)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>주요 소식</h3>
                <div className="space-y-3">
                  {featuredPosts.map((post) => (
                    <div key={post.id} className="pb-3 border-b border-gray-100 last:border-0">
                      <h4 className="text-sm font-medium mb-1 line-clamp-2 hover:text-blue-600 cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                        {post.title}
                      </h4>
                      <div className="flex items-center text-xs space-x-2" style={{ color: 'var(--text-muted)' }}>
                        <span>{post.created_at}</span>
                        <span>조회 {post.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            
            {/* 게시글 목록 */}
            <div className="bg-white rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
              <div className="p-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    전체 소식
                  </h2>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    총 {filteredPosts.length}개의 게시글
                  </span>
                </div>
              </div>

              <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
                {filteredPosts.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{
                      backgroundColor: 'var(--bg-subtle)'
                    }}>
                      <svg className="w-8 h-8" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      해당 카테고리에 소식이 없습니다
                    </h3>
                  </div>
                ) : (
                  filteredPosts.map((post, index) => (
                    <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            {getCategoryBadge(post.category)}
                            {post.featured && (
                              <span className="ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full" style={{
                                backgroundColor: '#fee2e2',
                                color: '#ef4444'
                              }}>
                                주요
                              </span>
                            )}
                            <span className="ml-auto text-sm" style={{ color: 'var(--text-muted)' }}>
                              {post.created_at}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-3 hover:text-blue-600 transition-colors" style={{ color: 'var(--text-primary)' }}>
                            {post.title}
                          </h3>
                          <p className="text-sm mb-3 line-clamp-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {post.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs space-x-4" style={{ color: 'var(--text-muted)' }}>
                              <span>작성자: {post.author}</span>
                              <span>조회 {post.views}</span>
                            </div>
                            <button 
                              className="text-sm font-medium hover:underline"
                              style={{ color: 'var(--accent-primary)' }}
                            >
                              자세히 보기 →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 통계 정보 */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border text-center" style={{ borderColor: 'var(--border-light)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{
                  backgroundColor: 'var(--accent-light)'
                }}>
                  <svg className="w-6 h-6" fill="none" stroke="var(--accent-primary)" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>1,000+</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>논문 활용</div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border text-center" style={{ borderColor: 'var(--border-light)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{
                  backgroundColor: '#e8f5e8'
                }}>
                  <svg className="w-6 h-6" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>50+</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>기관 이용</div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border text-center" style={{ borderColor: 'var(--border-light)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{
                  backgroundColor: '#fef3e2'
                }}>
                  <svg className="w-6 h-6" fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>98%</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>연구자 만족도</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;