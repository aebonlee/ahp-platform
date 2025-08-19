import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface HelpTopic {
  id: string;
  title: string;
  content: string;
  category: 'getting-started' | 'project-management' | 'evaluation' | 'analysis' | 'troubleshooting';
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ContextualHelp {
  context: string;
  tips: string[];
  relatedTopics: string[];
}

interface HelpSystemProps {
  currentContext?: string;
  onTopicSelect?: (topicId: string) => void;
}

const HelpSystem: React.FC<HelpSystemProps> = ({ currentContext, onTopicSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showContextualHelp, setShowContextualHelp] = useState(true);

  const categories = [
    { id: 'getting-started', name: '시작하기', icon: '🚀' },
    { id: 'project-management', name: '프로젝트 관리', icon: '📋' },
    { id: 'evaluation', name: '평가 방법', icon: '⚖️' },
    { id: 'analysis', name: '결과 분석', icon: '📊' },
    { id: 'troubleshooting', name: '문제 해결', icon: '🔧' }
  ];

  const helpTopics: HelpTopic[] = [
    {
      id: 'getting-started-overview',
      title: 'AHP 시스템 개요',
      category: 'getting-started',
      difficulty: 'beginner',
      keywords: ['시작', '개요', 'AHP', '소개'],
      content: `
        <h3>AHP (Analytic Hierarchy Process) 시스템이란?</h3>
        <p>AHP는 복잡한 의사결정 문제를 체계적으로 분석하는 방법론입니다. 
        다중 기준과 대안들을 계층적으로 구조화하여 최적의 선택을 도출합니다.</p>
        
        <h4>주요 특징:</h4>
        <ul>
          <li>계층적 구조화를 통한 문제 분해</li>
          <li>쌍대비교를 통한 객관적 평가</li>
          <li>일관성 검증을 통한 신뢰성 확보</li>
          <li>그룹 의사결정 지원</li>
        </ul>

        <h4>사용 절차:</h4>
        <ol>
          <li>프로젝트 생성 및 목표 설정</li>
          <li>기준과 대안 구성</li>
          <li>평가자 배정</li>
          <li>쌍대비교 평가 수행</li>
          <li>결과 분석 및 의사결정</li>
        </ol>
      `
    },
    {
      id: 'project-creation',
      title: '프로젝트 생성하기',
      category: 'project-management',
      difficulty: 'beginner',
      keywords: ['프로젝트', '생성', '새로 만들기'],
      content: `
        <h3>새 프로젝트 만들기</h3>
        
        <h4>1. 프로젝트 정보 입력</h4>
        <ul>
          <li><strong>프로젝트 이름:</strong> 의사결정 목표를 명확히 나타내는 이름</li>
          <li><strong>설명:</strong> 프로젝트의 배경과 목적을 상세히 기술</li>
          <li><strong>목표:</strong> 달성하고자 하는 구체적인 목표</li>
        </ul>

        <h4>2. 평가 방법 선택</h4>
        <ul>
          <li><strong>쌍대비교-실용:</strong> 실무에 적합한 최소한의 비교</li>
          <li><strong>쌍대비교-이론:</strong> 학술적 엄밀성을 위한 전체 비교</li>
          <li><strong>직접입력:</strong> 기존 데이터가 있는 경우 활용</li>
        </ul>

        <div class="tip">
          <strong>💡 팁:</strong> 대부분의 실무 상황에서는 '쌍대비교-실용' 방식을 권장합니다.
        </div>
      `
    },
    {
      id: 'evaluation-modes',
      title: '평가 방법의 차이점',
      category: 'evaluation',
      difficulty: 'intermediate',
      keywords: ['평가', '쌍대비교', '직접입력', '실용', '이론'],
      content: `
        <h3>평가 방법별 특징 및 활용</h3>

        <h4>쌍대비교-실용</h4>
        <ul>
          <li>최소한의 비교만으로 상대적 중요도 산출</li>
          <li>평가자의 부담 최소화</li>
          <li>실무 활용에 적합</li>
          <li>일관성 검증 포함</li>
        </ul>

        <h4>쌍대비교-이론</h4>
        <ul>
          <li>모든 쌍대비교를 수행</li>
          <li>학술적 엄밀성 확보</li>
          <li>높은 일관성 요구</li>
          <li>논문 작성에 적합</li>
        </ul>

        <h4>직접입력</h4>
        <ul>
          <li>기존 데이터나 측정값 활용</li>
          <li>객관적 지표가 있는 경우 유용</li>
          <li>빠른 결과 도출 가능</li>
          <li>주관적 판단 최소화</li>
        </ul>

        <div class="warning">
          <strong>⚠️ 주의:</strong> 평가 방법은 프로젝트 특성과 목적에 따라 신중히 선택해야 합니다.
        </div>
      `
    },
    {
      id: 'consistency-analysis',
      title: '일관성 분석 이해하기',
      category: 'analysis',
      difficulty: 'intermediate',
      keywords: ['일관성', 'CR', '비율', '검증'],
      content: `
        <h3>일관성 비율(CR) 이해하기</h3>

        <h4>일관성이란?</h4>
        <p>쌍대비교에서 논리적 모순이 없는 정도를 나타냅니다. 
        예: A>B, B>C라면 A>C여야 함</p>

        <h4>일관성 비율(CR) 기준</h4>
        <ul>
          <li><strong>CR ≤ 0.1:</strong> 일관성 있음 (허용 가능)</li>
          <li><strong>0.1 < CR ≤ 0.2:</strong> 주의 필요 (재검토 권장)</li>
          <li><strong>CR > 0.2:</strong> 일관성 없음 (재평가 필수)</li>
        </ul>

        <h4>일관성 개선 방법</h4>
        <ol>
          <li>가장 큰 고유벡터값을 가진 비교 찾기</li>
          <li>해당 쌍대비교 재검토</li>
          <li>전체적인 판단 기준 재정립</li>
          <li>필요시 기준 재구성 고려</li>
        </ol>

        <div class="tip">
          <strong>💡 팁:</strong> 일관성 문제는 대부분 판단 기준의 모호함에서 발생합니다.
        </div>
      `
    },
    {
      id: 'sensitivity-analysis',
      title: '민감도 분석 활용법',
      category: 'analysis',
      difficulty: 'advanced',
      keywords: ['민감도', '분석', '가중치', '변화'],
      content: `
        <h3>민감도 분석으로 안정성 검증하기</h3>

        <h4>민감도 분석이란?</h4>
        <p>기준의 가중치가 변할 때 대안 순위가 얼마나 민감하게 반응하는지 분석하는 방법입니다.</p>

        <h4>분석 방법</h4>
        <ol>
          <li>주요 기준의 가중치를 ±10~20% 변경</li>
          <li>각 시나리오에서 대안 순위 확인</li>
          <li>순위 변동 패턴 분석</li>
          <li>안정적인 대안 식별</li>
        </ol>

        <h4>결과 해석</h4>
        <ul>
          <li><strong>순위 변동 없음:</strong> 매우 안정적인 결과</li>
          <li><strong>소폭 변동:</strong> 안정적, 신뢰할 만한 결과</li>
          <li><strong>큰 변동:</strong> 가중치 설정에 주의 필요</li>
        </ul>

        <div class="warning">
          <strong>⚠️ 주의:</strong> 민감도가 높은 경우 기준 가중치의 정확성을 재검토하세요.
        </div>
      `
    },
    {
      id: 'troubleshooting-common',
      title: '자주 발생하는 문제들',
      category: 'troubleshooting',
      difficulty: 'beginner',
      keywords: ['문제', '오류', '해결', '트러블슈팅'],
      content: `
        <h3>자주 발생하는 문제와 해결방법</h3>

        <h4>1. 일관성 비율이 높게 나오는 경우</h4>
        <ul>
          <li>판단 기준을 명확히 정의</li>
          <li>극단적인 비교값 재검토</li>
          <li>기준의 독립성 확인</li>
        </ul>

        <h4>2. 평가자간 결과 차이가 큰 경우</h4>
        <ul>
          <li>평가 기준 재설명</li>
          <li>개별 면담 실시</li>
          <li>그룹 토론을 통한 합의</li>
        </ul>

        <h4>3. 예상과 다른 결과가 나온 경우</h4>
        <ul>
          <li>기준과 대안 구성 재검토</li>
          <li>은연중의 편견 확인</li>
          <li>추가 기준 고려</li>
        </ul>

        <h4>4. 시스템 사용 문제</h4>
        <ul>
          <li>브라우저 새로고침</li>
          <li>쿠키 및 캐시 삭제</li>
          <li>다른 브라우저 사용</li>
        </ul>
      `
    }
  ];

  const contextualHelp: Record<string, ContextualHelp> = {
    'project-creation': {
      context: '프로젝트 생성',
      tips: [
        '프로젝트 이름은 의사결정 목표를 명확히 표현해야 합니다.',
        '설명란에는 배경과 목적을 상세히 기술하세요.',
        '평가 방법은 프로젝트 특성에 따라 신중히 선택하세요.'
      ],
      relatedTopics: ['project-creation', 'evaluation-modes']
    },
    'evaluation': {
      context: '평가 진행',
      tips: [
        '쌍대비교 시 일관성을 유지하세요.',
        '극단적인 값(9:1) 사용은 신중히 하세요.',
        '판단이 어려운 경우 동등(1:1)으로 설정하세요.'
      ],
      relatedTopics: ['evaluation-modes', 'consistency-analysis']
    },
    'results': {
      context: '결과 분석',
      tips: [
        '일관성 비율을 먼저 확인하세요.',
        '민감도 분석으로 결과의 안정성을 검증하세요.',
        '예상과 다른 결과는 기준과 가중치를 재검토하세요.'
      ],
      relatedTopics: ['consistency-analysis', 'sensitivity-analysis']
    }
  };

  const filteredTopics = helpTopics.filter(topic => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getCurrentContextHelp = () => {
    return currentContext ? contextualHelp[currentContext] : null;
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    onTopicSelect?.(topicId);
  };

  return (
    <div className="space-y-6">
      {/* 상황별 도움말 */}
      {showContextualHelp && getCurrentContextHelp() && (
        <Card title={`💡 ${getCurrentContextHelp()?.context} 도움말`}>
          <div className="space-y-3">
            <ul className="space-y-2">
              {getCurrentContextHelp()?.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
            
            {(() => {
              const contextHelp = getCurrentContextHelp();
              return contextHelp?.relatedTopics && contextHelp.relatedTopics.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">관련 도움말:</p>
                  <div className="flex flex-wrap gap-2">
                    {contextHelp.relatedTopics.map(topicId => {
                    const topic = helpTopics.find(t => t.id === topicId);
                    return (
                      <Button
                        key={topicId}
                        size="sm"
                        variant="secondary"
                        onClick={() => handleTopicSelect(topicId)}
                      >
                        {topic?.title}
                      </Button>
                    );
                    })}
                  </div>
                </div>
              );
            })()}
            
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowContextualHelp(false)}
              className="mt-2"
            >
              닫기
            </Button>
          </div>
        </Card>
      )}

      {/* 검색 */}
      <Card title="도움말 검색">
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="도움말을 검색하세요..."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </Card>

      {/* 카테고리 탭 */}
      <Card title="도움말 카테고리">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            onClick={() => setSelectedCategory('all')}
          >
            전체
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? 'primary' : 'secondary'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* 도움말 목록 */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* 도움말 목록 */}
        <div className="md:col-span-1">
          <Card title="도움말 항목">
            <div className="space-y-2">
              {filteredTopics.map(topic => (
                <div
                  key={topic.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedTopic === topic.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{topic.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      topic.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {topic.difficulty === 'beginner' ? '초급' :
                       topic.difficulty === 'intermediate' ? '중급' : '고급'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {topic.keywords.slice(0, 3).map(keyword => (
                      <span key={keyword} className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 도움말 내용 */}
        <div className="md:col-span-2">
          <Card title="도움말 상세내용">
            {selectedTopic ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: helpTopics.find(t => t.id === selectedTopic)?.content || '' 
                }}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📖</div>
                <p>도움이 필요한 항목을 선택하세요.</p>
                <p className="text-sm mt-2">왼쪽 목록에서 관심 있는 주제를 클릭하면 상세 내용을 볼 수 있습니다.</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* 추가 도움 */}
      <Card title="추가 도움이 필요하신가요?">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl mb-2">📧</div>
            <h4 className="font-medium mb-1">이메일 문의</h4>
            <p className="text-sm text-gray-600 mb-2">기술적인 문제나 상세한 질문</p>
            <Button size="sm" variant="secondary">
              문의하기
            </Button>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl mb-2">🎓</div>
            <h4 className="font-medium mb-1">교육 신청</h4>
            <p className="text-sm text-gray-600 mb-2">AHP 방법론 전문 교육</p>
            <Button size="sm" variant="secondary">
              교육 신청
            </Button>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-medium mb-1">사용 가이드</h4>
            <p className="text-sm text-gray-600 mb-2">상세 매뉴얼 다운로드</p>
            <Button size="sm" variant="secondary">
              다운로드
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HelpSystem;