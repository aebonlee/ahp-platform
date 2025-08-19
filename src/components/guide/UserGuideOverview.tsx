import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
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
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">샘플 프로젝트</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">프로젝트명</p>
                <p className="font-medium">{DEMO_PROJECTS[0].title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">설명</p>
                <p className="text-sm">{DEMO_PROJECTS[0].description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">목적</p>
                <p className="text-sm">{DEMO_PROJECTS[0].objective}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">상태</p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {DEMO_PROJECTS[0].status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '📋 2단계: 기준 설정',
      description: '의사결정에 사용할 평가 기준들을 계층적으로 구성합니다.',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">🌳 기준 계층구조</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">표시 방식:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLayoutMode('vertical')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    layoutMode === 'vertical' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📋 세로형
                </button>
                <button
                  onClick={() => setLayoutMode('horizontal')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    layoutMode === 'horizontal' 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📊 가로형
                </button>
              </div>
            </div>
          </div>
          <HierarchyTreeVisualization
            nodes={demoCriteria}
            title="AI 개발 활용 방안 기준 계층구조 (샘플)"
            showWeights={true}
            interactive={false}
            layout={layoutMode}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h5 className="font-medium text-green-900 mb-2">상위 기준 (Level 1)</h5>
              <ul className="text-sm text-green-700 space-y-1">
                {DEMO_CRITERIA.map(c => (
                  <li key={c.id}>• {c.name}</li>
                ))}
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h5 className="font-medium text-purple-900 mb-2">세부 기준 (Level 2)</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                {DEMO_SUB_CRITERIA.map(c => (
                  <li key={c.id}>• {c.name}</li>
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
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-3">평가 대안 목록</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {DEMO_ALTERNATIVES.map((alt, index) => (
                <div key={alt.id} className="bg-white border border-orange-300 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🔹</span>
                    <h5 className="font-medium text-gray-900">{alt.name}</h5>
                  </div>
                  <p className="text-sm text-gray-600">{alt.description}</p>
                  <div className="mt-2 text-xs text-orange-600">
                    대안 {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: '⚖️ 4단계: 쌍대비교 평가',
      description: '기준별로 대안들을 쌍으로 비교하여 중요도를 평가합니다.',
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-3">쌍대비교 매트릭스 예시</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">비교 기준</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">GPT-4</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Claude</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Gemini</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">성능</td>
                    <td className="px-3 py-2 text-center text-sm text-blue-600">1.0</td>
                    <td className="px-3 py-2 text-center text-sm text-green-600">0.8</td>
                    <td className="px-3 py-2 text-center text-sm text-purple-600">0.7</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">비용</td>
                    <td className="px-3 py-2 text-center text-sm text-blue-600">0.6</td>
                    <td className="px-3 py-2 text-center text-sm text-green-600">1.0</td>
                    <td className="px-3 py-2 text-center text-sm text-purple-600">0.9</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">사용성</td>
                    <td className="px-3 py-2 text-center text-sm text-blue-600">0.9</td>
                    <td className="px-3 py-2 text-center text-sm text-green-600">0.7</td>
                    <td className="px-3 py-2 text-center text-sm text-purple-600">1.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-indigo-600">
              * 값이 클수록 해당 대안이 더 우수함을 의미합니다.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: '📊 5단계: 결과 분석',
      description: '평가 결과를 분석하고 최적의 대안을 도출합니다.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">📈 종합 점수</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">🥇 GPT-4</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-sm font-bold text-blue-600">0.42</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">🥈 Claude</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <span className="text-sm font-bold text-green-600">0.37</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">🥉 Gemini</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <span className="text-sm font-bold text-purple-600">0.32</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-3">🎯 권장 사항</h4>
              <div className="space-y-2 text-sm text-yellow-800">
                <p>• <strong>1순위:</strong> GPT-4 - 종합 성능 우수</p>
                <p>• <strong>2순위:</strong> Claude - 비용 대비 효율성</p>
                <p>• <strong>3순위:</strong> Gemini - 사용 편의성</p>
                <div className="mt-3 p-2 bg-yellow-100 rounded text-xs">
                  💡 <strong>결론:</strong> 프로젝트 규모와 예산을 고려하여 GPT-4를 우선 검토하되, 비용이 중요한 경우 Claude를 대안으로 고려하세요.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = guideSteps.find(step => step.id === currentStep);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 AHP 의사결정 지원 시스템 사용 가이드
          </h1>
          <p className="text-gray-600">
            샘플 데이터를 통해 전체 프로세스를 체험해보세요
          </p>
        </div>
      </div>

      {/* Step Navigation */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">단계별 가이드</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">진행도:</span>
            <div className="flex space-x-1">
              {guideSteps.map(step => (
                <div
                  key={step.id}
                  className={`w-8 h-2 rounded-full transition-colors ${
                    step.id <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-blue-600">
              {currentStep}/{guideSteps.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {guideSteps.map(step => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`p-3 rounded-lg text-center transition-all ${
                currentStep === step.id
                  ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {step.title.split(':')[0]}
              </div>
              <div className="text-xs opacity-75">
                {step.title.split(':')[1]?.trim()}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Current Step Content */}
      {currentStepData && (
        <Card>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600">
              {currentStepData.description}
            </p>
          </div>

          {currentStepData.content}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              ← 이전 단계
            </Button>

            <div className="text-sm text-gray-500">
              {currentStep} / {guideSteps.length} 단계
            </div>

            {currentStep < guideSteps.length ? (
              <Button
                variant="primary"
                onClick={() => setCurrentStep(Math.min(guideSteps.length, currentStep + 1))}
              >
                다음 단계 →
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onNavigateToService}
                className="bg-green-600 hover:bg-green-700"
              >
                실제 서비스 시작하기 🚀
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Quick Access */}
      <Card title="빠른 접근" className="bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border"
          >
            <span className="text-lg">🎯</span>
            <span className="text-sm font-medium">프로젝트 생성</span>
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-green-50 transition-colors border"
          >
            <span className="text-lg">📋</span>
            <span className="text-sm font-medium">기준 설정</span>
          </button>
          <button
            onClick={() => setCurrentStep(4)}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors border"
          >
            <span className="text-lg">⚖️</span>
            <span className="text-sm font-medium">쌍대비교</span>
          </button>
          <button
            onClick={() => setCurrentStep(5)}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-yellow-50 transition-colors border"
          >
            <span className="text-lg">📊</span>
            <span className="text-sm font-medium">결과 분석</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default UserGuideOverview;