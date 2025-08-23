import React, { useState } from 'react';
import Card from '../common/Card';
import Tooltip from '../common/Tooltip';
import LayerPopup from '../common/LayerPopup';
import UnifiedButton from '../common/UnifiedButton';
import HierarchyTreeVisualization from '../common/HierarchyTreeVisualization';
import { DEMO_CRITERIA, DEMO_SUB_CRITERIA, DEMO_ALTERNATIVES, DEMO_PROJECTS } from '../../data/demoData';

interface UserGuideOverviewProps {
  onNavigateToService: () => void;
}

const UserGuideOverview: React.FC<UserGuideOverviewProps> = ({ onNavigateToService }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');

  // 데모 데이터 조합
  const demoCriteria = [
    ...DEMO_CRITERIA.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      parent_id: c.parent_id,
      level: c.level,
      weight: c.weight
    })),
    ...DEMO_SUB_CRITERIA.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      parent_id: c.parent_id,
      level: c.level,
      weight: c.weight
    }))
  ];

  const guideSteps = [
    {
      id: 1,
      title: '🎯 1단계: 프로젝트 생성',
      description: 'AHP 의사결정 분석을 위한 프로젝트를 생성합니다.',
      tooltip: '새로운 의사결정 문제를 해결하기 위한 프로젝트를 만드는 첫 번째 단계입니다. 프로젝트명, 설명, 목적을 명확히 정의하세요.',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 lg:p-8">
            <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">📋</span>
              샘플 프로젝트 정보
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-base font-semibold text-gray-700 mb-2">프로젝트명</p>
                <p className="text-lg font-bold text-gray-900 bg-white p-3 rounded-lg border">
                  {DEMO_PROJECTS[0].title}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-gray-700 mb-2">현재 상태</p>
                <div className="bg-white p-3 rounded-lg border">
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 text-base font-medium rounded-lg">
                    ✅ {DEMO_PROJECTS[0].status}
                  </span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <p className="text-base font-semibold text-gray-700 mb-2">프로젝트 설명</p>
                <p className="text-base text-gray-800 bg-white p-4 rounded-lg border leading-relaxed">
                  {DEMO_PROJECTS[0].description}
                </p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <p className="text-base font-semibold text-gray-700 mb-2">프로젝트 목적</p>
                <p className="text-base text-gray-800 bg-white p-4 rounded-lg border leading-relaxed">
                  {DEMO_PROJECTS[0].objective}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 rounded-xl p-6">
            <h5 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
              <span className="text-xl mr-2">💡</span>
              프로젝트 생성 팁
            </h5>
            <ul className="text-base text-blue-800 space-y-2 ml-6">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>명확하고 구체적인 프로젝트명을 사용하세요</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>의사결정의 목적과 배경을 상세히 작성하세요</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>프로젝트 범위와 제약사항을 미리 정의하세요</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '📋 2단계: 기준 설정',
      description: '의사결정에 사용할 평가 기준들을 계층적으로 구성합니다.',
      tooltip: '의사결정 기준을 체계적으로 구성하는 단계입니다. 상위 기준과 세부 기준으로 나누어 계층구조를 만드세요.',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <h4 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-3">🌳</span>
              기준 계층구조 시각화
            </h4>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">표시 방식 선택</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Tooltip content="기준들을 세로로 나열하여 표시합니다. 계층구조를 명확하게 보기 좋습니다.">
                  <UnifiedButton
                    variant={layoutMode === 'vertical' ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={() => setLayoutMode('vertical')}
                    icon="📋"
                    className="w-full h-16"
                  >
                    <div className="flex flex-col">
                      <span className="text-base font-semibold">세로형 레이아웃</span>
                      <span className="text-xs text-gray-500">계층구조 중심</span>
                    </div>
                  </UnifiedButton>
                </Tooltip>
                <Tooltip content="기준들을 가로로 펼쳐서 표시합니다. 전체 구조를 한눈에 보기 좋습니다.">
                  <UnifiedButton
                    variant={layoutMode === 'horizontal' ? 'success' : 'secondary'}
                    size="lg"
                    onClick={() => setLayoutMode('horizontal')}
                    icon="📊"
                    className="w-full h-16"
                  >
                    <div className="flex flex-col">
                      <span className="text-base font-semibold">가로형 레이아웃</span>
                      <span className="text-xs text-gray-500">전체 조망 중심</span>
                    </div>
                  </UnifiedButton>
                </Tooltip>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <HierarchyTreeVisualization
              nodes={demoCriteria}
              title="AI 개발 활용 방안 기준 계층구조 (샘플)"
              showWeights={true}
              interactive={false}
              layout={layoutMode}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h5 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                <span className="text-xl mr-2">🎯</span>
                상위 기준 (Level 1)
              </h5>
              <ul className="text-base text-green-700 space-y-3">
                {DEMO_CRITERIA.map(c => (
                  <li key={c.id} className="flex items-start bg-white p-3 rounded-lg">
                    <span className="text-green-500 mr-3 text-lg">•</span>
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-green-600 mt-1">{c.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h5 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                <span className="text-xl mr-2">🔍</span>
                세부 기준 (Level 2)
              </h5>
              <ul className="text-base text-purple-700 space-y-3">
                {DEMO_SUB_CRITERIA.map(c => (
                  <li key={c.id} className="flex items-start bg-white p-3 rounded-lg">
                    <span className="text-purple-500 mr-3 text-lg">•</span>
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-purple-600 mt-1">{c.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '🔀 3단계: 대안 설정',
      description: '비교 평가할 대안들을 설정합니다.',
      tooltip: '의사결정에서 선택할 수 있는 여러 대안들을 정의하는 단계입니다. 최소 2개 이상의 대안이 필요합니다.',
      content: (
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 lg:p-8">
            <h4 className="text-xl font-bold text-orange-900 mb-6 flex items-center">
              <span className="text-2xl mr-3">🎲</span>
              평가 대안 목록
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {DEMO_ALTERNATIVES.map((alt, index) => (
                <div key={alt.id} className="bg-white border border-orange-300 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <h5 className="text-lg font-bold text-gray-900">{alt.name}</h5>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed mb-4">{alt.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                      대안 {index + 1}
                    </span>
                    <LayerPopup
                      trigger={
                        <UnifiedButton variant="info" size="sm" icon="ℹ️">
                          상세정보
                        </UnifiedButton>
                      }
                      title={`${alt.name} 상세 정보`}
                      content={
                        <div className="space-y-4">
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-900 mb-2">대안 설명</h4>
                            <p className="text-orange-800">{alt.description}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h5 className="font-medium text-blue-900 mb-1">장점</h5>
                              <p className="text-sm text-blue-800">높은 성능과 안정성을 제공합니다.</p>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg">
                              <h5 className="font-medium text-red-900 mb-1">단점</h5>
                              <p className="text-sm text-red-800">상대적으로 높은 비용이 필요합니다.</p>
                            </div>
                          </div>
                        </div>
                      }
                      width="lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-xl p-6">
            <h5 className="text-lg font-bold text-orange-900 mb-3 flex items-center">
              <span className="text-xl mr-2">📝</span>
              대안 설정 가이드라인
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-base text-orange-800 space-y-2">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>실현 가능한 대안들로 구성</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>상호 배타적인 대안들 선택</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>비교 가능한 수준의 대안들</span>
                </li>
              </ul>
              <ul className="text-base text-orange-800 space-y-2">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>최소 2개 이상 최대 9개 권장</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>각 대안의 특징을 명확히 정의</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>비용, 시간 등 제약사항 고려</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: '⚖️ 4단계: 쌍대비교 평가',
      description: '기준별로 대안들을 쌍으로 비교하여 중요도를 평가합니다.',
      tooltip: 'AHP의 핵심 단계입니다. 두 요소씩 짝을 지어 상대적 중요도를 평가하여 정확한 가중치를 도출합니다.',
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 lg:p-8">
            <h4 className="text-xl font-bold text-indigo-900 mb-6 flex items-center">
              <span className="text-2xl mr-3">📊</span>
              쌍대비교 매트릭스 예시
            </h4>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-700">비교 기준</th>
                    <th className="px-6 py-4 text-center text-base font-bold text-blue-700">GPT-4</th>
                    <th className="px-6 py-4 text-center text-base font-bold text-green-700">Claude</th>
                    <th className="px-6 py-4 text-center text-base font-bold text-purple-700">Gemini</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-base font-semibold text-gray-900">성능</td>
                    <td className="px-6 py-4 text-center text-base font-bold text-blue-600">1.0</td>
                    <td className="px-6 py-4 text-center text-base font-bold text-green-600">0.8</td>
                    <td className="px-6 py-4 text-center text-base font-bold text-purple-600">0.7</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-base font-semibold text-gray-900">비용</td>
                    <td className="px-6 py-4 text-center text-base font-bold text-blue-600">0.6</td>
                    <td className="px-6 py-4 text-center text-base font-bold text-green-600">1.0</td>
                    <td className="px-6 py-4 text-center text-base font-bold text-purple-600">0.9</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-base font-semibold text-gray-900">사용성</td>
                    <td className="px-6 py-4 text-center text-base font-bold text-blue-600">0.9</td>
                    <td className="px-6 py-4 text-center text-base font-bold text-green-600">0.7</td>
                    <td className="px-6 py-4 text-center text-base font-bold text-purple-600">1.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
              <p className="text-base text-indigo-800 flex items-start">
                <span className="text-indigo-600 mr-2 text-lg">💡</span>
                <span>값이 클수록 해당 대안이 더 우수함을 의미합니다. 1.0은 기준값이며, 상대적 중요도를 나타냅니다.</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h5 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                <span className="text-xl mr-2">🎯</span>
                평가 척도
              </h5>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border flex justify-between items-center">
                  <span className="text-base font-medium">9</span>
                  <span className="text-sm text-gray-600">극히 중요</span>
                </div>
                <div className="bg-white p-3 rounded-lg border flex justify-between items-center">
                  <span className="text-base font-medium">7</span>
                  <span className="text-sm text-gray-600">매우 중요</span>
                </div>
                <div className="bg-white p-3 rounded-lg border flex justify-between items-center">
                  <span className="text-base font-medium">5</span>
                  <span className="text-sm text-gray-600">중요</span>
                </div>
                <div className="bg-white p-3 rounded-lg border flex justify-between items-center">
                  <span className="text-base font-medium">3</span>
                  <span className="text-sm text-gray-600">조금 중요</span>
                </div>
                <div className="bg-white p-3 rounded-lg border flex justify-between items-center">
                  <span className="text-base font-medium">1</span>
                  <span className="text-sm text-gray-600">같음</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h5 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                <span className="text-xl mr-2">✅</span>
                일관성 검증
              </h5>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-medium">일관성 비율 (CR)</span>
                    <span className="text-lg font-bold text-green-600">0.08</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">✓ 우수한 일관성 (0.1 미만)</p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• CR &lt; 0.1: 일관성 우수</p>
                  <p>• CR &lt; 0.2: 일관성 양호</p>
                  <p>• CR &gt;= 0.2: 재평가 필요</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: '📊 5단계: 결과 분석',
      description: '평가 결과를 분석하고 최적의 대안을 도출합니다.',
      tooltip: '모든 평가를 종합하여 최종 결과를 도출하는 단계입니다. 순위와 점수를 확인하고 의사결정에 활용하세요.',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 lg:p-8">
              <h4 className="text-xl font-bold text-green-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">🏆</span>
                종합 결과 순위
              </h4>
              <div className="space-y-4">
                <div className="bg-white border border-green-300 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🥇</span>
                      <span className="text-lg font-bold text-gray-900">GPT-4</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">0.42</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">전체 기준에서 가장 높은 점수</p>
                </div>
                
                <div className="bg-white border border-green-300 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🥈</span>
                      <span className="text-lg font-bold text-gray-900">Claude</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">0.37</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-600 h-4 rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">비용 효율성이 우수함</p>
                </div>
                
                <div className="bg-white border border-green-300 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🥉</span>
                      <span className="text-lg font-bold text-gray-900">Gemini</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">0.32</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-purple-600 h-4 rounded-full transition-all duration-1000" style={{width: '65%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">사용 편의성이 뛰어남</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 lg:p-8">
              <h4 className="text-xl font-bold text-yellow-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">💼</span>
                의사결정 권고사항
              </h4>
              <div className="space-y-4">
                <div className="bg-white border border-yellow-300 rounded-xl p-4">
                  <div className="flex items-start space-x-3 mb-2">
                    <span className="text-lg">🎯</span>
                    <div>
                      <h6 className="text-base font-bold text-gray-900">1순위 권장: GPT-4</h6>
                      <p className="text-sm text-gray-700 mt-1">종합 성능이 가장 우수하며, 복잡한 작업 처리에 탁월</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-yellow-300 rounded-xl p-4">
                  <div className="flex items-start space-x-3 mb-2">
                    <span className="text-lg">💰</span>
                    <div>
                      <h6 className="text-base font-bold text-gray-900">2순위 권장: Claude</h6>
                      <p className="text-sm text-gray-700 mt-1">비용 대비 성능이 우수하며, 예산이 중요한 경우 추천</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-yellow-300 rounded-xl p-4">
                  <div className="flex items-start space-x-3 mb-2">
                    <span className="text-lg">🚀</span>
                    <div>
                      <h6 className="text-base font-bold text-gray-900">3순위 권장: Gemini</h6>
                      <p className="text-sm text-gray-700 mt-1">사용 편의성이 뛰어나며, 초보자에게 적합</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl border border-yellow-300">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <h6 className="text-base font-bold text-yellow-900 mb-2">종합 결론</h6>
                      <p className="text-sm text-yellow-800 leading-relaxed">
                        프로젝트 규모와 예산을 종합적으로 고려하여 GPT-4를 우선 검토하되, 
                        비용이 중요한 경우 Claude를 대안으로 고려하는 것이 최적의 전략입니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">📋</span>
              추가 분석 도구
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Tooltip content="다양한 시나리오에서 기준 가중치를 변경하여 결과가 어떻게 달라지는지 분석할 수 있습니다.">
                <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <span className="text-2xl">📈</span>
                    <h6 className="text-base font-medium mt-2">민감도 분석</h6>
                    <p className="text-sm text-gray-600 mt-1">가중치 변화 영향도</p>
                  </div>
                </div>
              </Tooltip>
              
              <Tooltip content="결과를 Excel 파일로 내보내어 상세한 데이터 분석이나 보고서 작성에 활용할 수 있습니다.">
                <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <span className="text-2xl">📊</span>
                    <h6 className="text-base font-medium mt-2">Excel 내보내기</h6>
                    <p className="text-sm text-gray-600 mt-1">상세 데이터 분석</p>
                  </div>
                </div>
              </Tooltip>
              
              <Tooltip content="전문적인 의사결정 보고서를 PDF 형태로 생성하여 조직 내 공유나 문서화에 활용할 수 있습니다.">
                <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <span className="text-2xl">📄</span>
                    <h6 className="text-base font-medium mt-2">PDF 보고서</h6>
                    <p className="text-sm text-gray-600 mt-1">의사결정 문서화</p>
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = guideSteps.find(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center space-y-6 py-8">
          <div className="inline-block p-6 lg:p-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              📚 AHP 의사결정 지원 시스템
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-3">
              완전한 사용 가이드
            </h2>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              샘플 데이터를 통해 AHP 분석의 전체 프로세스를 체험해보세요.<br/>
              단계별로 자세한 설명과 실제 예시를 확인할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <Card className="shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">단계별 가이드</h2>
            <div className="flex items-center space-x-3">
              <span className="text-base font-medium text-gray-700">진행도:</span>
              <div className="flex space-x-2">
                {guideSteps.map(step => (
                  <div
                    key={step.id}
                    className={`w-10 h-3 rounded-full transition-all duration-300 ${
                      step.id <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-base font-bold text-blue-600 ml-2">
                {currentStep}/{guideSteps.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
            {guideSteps.map(step => (
              <Tooltip key={step.id} content={step.tooltip}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`p-4 md:p-5 rounded-xl text-center transition-all duration-200 transform hover:scale-105 ${
                    currentStep === step.id
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-900 shadow-lg'
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:shadow-md'
                  }`}
                >
                  <div className="text-base md:text-lg font-bold mb-2">
                    {step.title.split(':')[0]}
                  </div>
                  <div className="text-sm md:text-base opacity-80 font-medium">
                    {step.title.split(':')[1]?.trim()}
                  </div>
                </button>
              </Tooltip>
            ))}
          </div>
        </Card>

        {/* Current Step Content */}
        {currentStepData && (
          <Card className="shadow-lg">
            <div className="mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {currentStepData.title}
              </h3>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {currentStepData.content}

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-8 border-t gap-4">
              <UnifiedButton
                variant="secondary"
                size="lg"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                icon="←"
              >
                이전 단계
              </UnifiedButton>

              <LayerPopup
                trigger={
                  <div className="text-lg font-medium text-blue-600 cursor-pointer hover:text-blue-800 transition-colors">
                    {currentStep} / {guideSteps.length} 단계 📋
                  </div>
                }
                title="가이드 진행 상황"
                content={
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">현재 진행 상황</h4>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${(currentStep / guideSteps.length) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-blue-800">
                        {currentStep}단계 / 총 {guideSteps.length}단계 ({Math.round((currentStep / guideSteps.length) * 100)}% 완료)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">단계별 목록</h4>
                      {guideSteps.map((step, index) => (
                        <div 
                          key={step.id}
                          className={`p-2 rounded-lg flex items-center ${
                            index + 1 === currentStep 
                              ? 'bg-blue-100 text-blue-900' 
                              : index + 1 < currentStep 
                              ? 'bg-green-100 text-green-900'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span className="mr-2">
                            {index + 1 < currentStep ? '✅' : index + 1 === currentStep ? '🔄' : '⏳'}
                          </span>
                          <span className="text-sm">{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                }
                width="md"
              />

              {currentStep < guideSteps.length ? (
                <UnifiedButton
                  variant="primary"
                  size="lg"
                  onClick={() => setCurrentStep(Math.min(guideSteps.length, currentStep + 1))}
                  icon="→"
                >
                  다음 단계
                </UnifiedButton>
              ) : (
                <UnifiedButton
                  variant="success"
                  size="lg"
                  onClick={onNavigateToService}
                  icon="🚀"
                >
                  실제 서비스 시작하기
                </UnifiedButton>
              )}
            </div>
          </Card>
        )}

        {/* Quick Access */}
        <Card title="빠른 단계 이동" className="bg-gradient-to-r from-gray-50 to-blue-50 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: 1, icon: "🎯", title: "프로젝트 생성", desc: "새 프로젝트 만들기", color: "blue" },
              { step: 2, icon: "📋", title: "기준 설정", desc: "평가 기준 정의", color: "green" },
              { step: 4, icon: "⚖️", title: "쌍대비교", desc: "중요도 평가", color: "purple" },
              { step: 5, icon: "📊", title: "결과 분석", desc: "최종 결과 확인", color: "yellow" }
            ].map(item => (
              <Tooltip key={item.step} content={item.desc}>
                <button
                  onClick={() => setCurrentStep(item.step)}
                  className={`flex flex-col items-center space-y-3 p-4 md:p-6 bg-white rounded-xl hover:shadow-md transition-all duration-200 border-2 transform hover:scale-105 ${
                    currentStep === item.step 
                      ? `border-${item.color}-500 bg-${item.color}-50` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl md:text-3xl">{item.icon}</span>
                  <span className="text-base md:text-lg font-bold text-gray-900">{item.title}</span>
                  <span className="text-sm text-gray-600 text-center">{item.desc}</span>
                </button>
              </Tooltip>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserGuideOverview;