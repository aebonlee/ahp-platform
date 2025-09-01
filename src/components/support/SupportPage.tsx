import React, { useState, useEffect } from 'react';

interface SupportPost {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  category: string;
  status: 'open' | 'answered' | 'closed';
  replies: number;
  views: number;
}

interface SupportPageProps {
  onBackClick: () => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onBackClick }) => {
  const [posts, setPosts] = useState<SupportPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'general', label: '일반 문의' },
    { value: 'technical', label: '기술 지원' },
    { value: 'billing', label: '결제/요금' },
    { value: 'guide', label: '사용법 문의' },
    { value: 'bug', label: '버그 신고' }
  ];

  const samplePosts: SupportPost[] = [
    {
      id: 1,
      title: 'AHP 분석 결과의 일관성 비율이 0.1을 초과할 때 해결 방법',
      content: '쌍대비교를 진행했는데 일관성 비율이 0.15가 나왔습니다. 어떻게 개선할 수 있을까요?',
      author: '연구자김',
      created_at: '2024-08-30',
      category: 'technical',
      status: 'answered',
      replies: 3,
      views: 127
    },
    {
      id: 2,
      title: '평가자 초대 메일이 발송되지 않는 문제',
      content: '프로젝트에 평가자를 초대했는데 메일이 발송되지 않고 있습니다.',
      author: '교수박',
      created_at: '2024-08-29',
      category: 'bug',
      status: 'open',
      replies: 1,
      views: 89
    },
    {
      id: 3,
      title: '기관 플랜 할인 문의',
      content: '대학교에서 단체로 이용할 예정인데 할인 혜택이 있나요?',
      author: '관리자이',
      created_at: '2024-08-28',
      category: 'billing',
      status: 'answered',
      replies: 2,
      views: 156
    }
  ];

  useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post: SupportPost = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      author: '사용자',
      created_at: new Date().toISOString().split('T')[0],
      category: newPost.category,
      status: 'open',
      replies: 0,
      views: 0
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: 'general' });
    setShowNewPostForm(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: '답변대기', color: '#f59e0b', bg: '#fef3e2' },
      answered: { label: '답변완료', color: '#22c55e', bg: '#e8f5e8' },
      closed: { label: '해결완료', color: '#6b7280', bg: '#f3f4f6' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    
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
          <div className="flex items-center justify-between">
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
                  고객지원
                </h1>
                <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                  문의사항이나 기술적 문제를 해결해드립니다
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewPostForm(true)}
              className="px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white'
              }}
            >
              문의하기
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* 사이드바 - 카테고리 및 연락처 */}
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

              {/* 연락처 정보 */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border-light)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>직접 문의</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="var(--accent-primary)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>이메일</div>
                      <div style={{ color: 'var(--text-secondary)' }}>aebon@naver.com</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="var(--accent-primary)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>전화</div>
                      <div style={{ color: 'var(--text-secondary)' }}>010-3700-0629</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="var(--accent-primary)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>카카오톡</div>
                      <div style={{ color: 'var(--text-secondary)' }}>ID: aebon</div>
                    </div>
                  </div>
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
                    문의 게시판
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      아직 문의글이 없습니다
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      첫 번째 문의를 남겨보세요!
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getStatusBadge(post.status)}
                            <span className="ml-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                              {categories.find(c => c.value === post.category)?.label}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600" style={{ color: 'var(--text-primary)' }}>
                            {post.title}
                          </h3>
                          <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                            {post.content}
                          </p>
                          <div className="flex items-center text-xs space-x-4" style={{ color: 'var(--text-muted)' }}>
                            <span>작성자: {post.author}</span>
                            <span>{post.created_at}</span>
                            <span>답글 {post.replies}</span>
                            <span>조회 {post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 새 게시글 작성 모달 */}
      {showNewPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  새 문의 작성
                </h2>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 카테고리 선택 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  카테고리
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{ borderColor: 'var(--border-medium)' }}
                >
                  {categories.slice(1).map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 제목 입력 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  제목
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="문의 제목을 입력하세요"
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{ borderColor: 'var(--border-medium)' }}
                />
              </div>

              {/* 내용 입력 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  내용
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="문의 내용을 자세히 설명해주세요"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border resize-none"
                  style={{ borderColor: 'var(--border-medium)' }}
                />
              </div>

              {/* 제출 버튼 */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="px-6 py-3 rounded-lg border font-medium transition-colors"
                  style={{ 
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitPost}
                  className="px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white'
                  }}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                >
                  문의 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;