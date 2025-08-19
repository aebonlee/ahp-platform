import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import HierarchyTreeVisualization from '../common/HierarchyTreeVisualization';
import BulkCriteriaInput from '../criteria/BulkCriteriaInput';
import { DEMO_CRITERIA, DEMO_SUB_CRITERIA } from '../../data/demoData';

interface Criterion {
  id: string;
  name: string;
  description?: string;
  parent_id?: string | null;
  level: number;
  children?: Criterion[];
  weight?: number;
}

interface CriteriaManagementProps {
  projectId: string;
  onComplete: () => void;
  onCriteriaChange?: (criteriaCount: number) => void;
}

const CriteriaManagement: React.FC<CriteriaManagementProps> = ({ projectId, onComplete, onCriteriaChange }) => {
  // DEMO_CRITERIA와 DEMO_SUB_CRITERIA를 조합하여 완전한 계층구조 생성
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [showHelp, setShowHelp] = useState(false);
  const [showBulkInput, setShowBulkInput] = useState(false);

  useEffect(() => {
    // 프로젝트별 기준 데이터 로드 (localStorage에서)
    const loadProjectCriteria = () => {
      const storageKey = `ahp_criteria_${projectId}`;
      const savedCriteria = localStorage.getItem(storageKey);
      
      if (savedCriteria) {
        try {
          const parsed = JSON.parse(savedCriteria);
          setCriteria(parsed);
          console.log(`Loaded ${getAllCriteria(parsed).length} criteria for project ${projectId}`);
        } catch (error) {
          console.error('Failed to parse saved criteria:', error);
          setCriteria([]);
        }
      } else {
        // 새 프로젝트는 빈 배열로 시작
        setCriteria([]);
        console.log(`New project ${projectId} - starting with empty criteria`);
      }
    };

    if (projectId) {
      loadProjectCriteria();
    }
  }, [projectId]);

  // 기준이 변경될 때마다 부모 컴포넌트에 개수 알림
  useEffect(() => {
    const totalCount = getAllCriteria(criteria).length;
    if (onCriteriaChange) {
      onCriteriaChange(totalCount);
    }
  }, [criteria, onCriteriaChange]);

  const [evaluationMethod, setEvaluationMethod] = useState<'pairwise' | 'direct'>('pairwise');
  const [newCriterion, setNewCriterion] = useState({ name: '', description: '', parentId: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 프로젝트별 기준 데이터 저장
  const saveProjectCriteria = (criteriaData: Criterion[]) => {
    const storageKey = `ahp_criteria_${projectId}`;
    localStorage.setItem(storageKey, JSON.stringify(criteriaData));
    console.log(`Saved ${getAllCriteria(criteriaData).length} criteria for project ${projectId}`);
  };

  const validateCriterion = (name: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = '기준명을 입력해주세요.';
    } else if (name.length < 2) {
      newErrors.name = '기준명은 2자 이상이어야 합니다.';
    } else {
      // Check for duplicate names
      const allCriteria = getAllCriteria(criteria);
      if (allCriteria.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        newErrors.name = '동일한 기준명이 이미 존재합니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getAllCriteria = (criteriaList: Criterion[]): Criterion[] => {
    const all: Criterion[] = [];
    const traverse = (items: Criterion[]) => {
      items.forEach(item => {
        all.push(item);
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(criteriaList);
    return all;
  };

  // 시각화를 위한 평면 배열 생성
  const getFlatCriteriaForVisualization = (criteriaList: Criterion[]): Criterion[] => {
    const flat: Criterion[] = [];
    const traverse = (items: Criterion[], parentLevel: number = 0) => {
      items.forEach(item => {
        // 아이템의 실제 레벨 사용 (저장된 레벨이 있으면 사용, 없으면 부모 레벨 + 1)
        const actualLevel = item.level || (parentLevel + 1);
        
        // 평면 배열에 추가 (children 제거)
        flat.push({
          id: item.id,
          name: item.name,
          description: item.description,
          parent_id: item.parent_id,
          level: actualLevel,
          weight: item.weight
        });
        
        // 하위 항목이 있으면 재귀적으로 처리
        if (item.children && item.children.length > 0) {
          traverse(item.children, actualLevel);
        }
      });
    };
    traverse(criteriaList);
    return flat;
  };

  const handleAddCriterion = () => {
    if (!validateCriterion(newCriterion.name)) {
      return;
    }

    const newId = Date.now().toString();
    // 부모가 있으면 부모 레벨 + 1, 없으면 1레벨
    let level = 1;
    if (newCriterion.parentId) {
      const parent = getAllCriteria(criteria).find(c => c.id === newCriterion.parentId);
      level = parent ? parent.level + 1 : 2;
    }
    
    // 최대 5레벨까지만 허용
    if (level > 5) {
      setErrors({ name: '최대 5단계까지만 기준을 생성할 수 있습니다.' });
      return;
    }
    
    const criterion: Criterion = {
      id: newId,
      name: newCriterion.name,
      description: newCriterion.description,
      parent_id: newCriterion.parentId || null,
      level
    };

    let updatedCriteria: Criterion[];
    
    if (newCriterion.parentId) {
      // Add as child - 재귀적으로 부모 찾기
      const addToParent = (items: Criterion[]): Criterion[] => {
        return items.map(item => {
          if (item.id === newCriterion.parentId) {
            return {
              ...item,
              children: [...(item.children || []), criterion]
            };
          } else if (item.children && item.children.length > 0) {
            return {
              ...item,
              children: addToParent(item.children)
            };
          }
          return item;
        });
      };
      updatedCriteria = addToParent(criteria);
    } else {
      // Add as top-level criterion
      updatedCriteria = [...criteria, criterion];
    }

    setCriteria(updatedCriteria);
    saveProjectCriteria(updatedCriteria);
    setNewCriterion({ name: '', description: '', parentId: '' });
    setErrors({});
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteCriterion = (id: string) => {
    const filter = (items: Criterion[]): Criterion[] => {
      return items.filter(item => {
        if (item.id === id) return false;
        if (item.children) {
          item.children = filter(item.children);
        }
        return true;
      });
    };
    
    const updatedCriteria = filter(criteria);
    setCriteria(updatedCriteria);
    saveProjectCriteria(updatedCriteria);
  };


  // 상위 기준으로 선택 가능한 모든 기준 (최대 4레벨까지, 5레벨을 만들기 위해)
  const getAvailableParentCriteria = () => {
    const flatCriteria = getAllCriteria(criteria);
    // 최대 4레벨까지만 상위 기준으로 선택 가능 (5레벨까지 지원)
    return flatCriteria.filter(c => c.level <= 4);
  };

  // 레벨별 아이콘 반환
  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return '🎯'; // 목표(Goal)
      case 2: return '📋'; // 기준(Criteria) 
      case 3: return '🎪'; // 대안(Alternatives)
      case 4: return '📝'; // 하위기준(Sub-criteria)
      case 5: return '🔹'; // 세부기준(Detailed criteria)
      default: return '📄';
    }
  };

  // 레벨별 명칭 반환
  const getLevelName = (level: number) => {
    switch (level) {
      case 1: return '목표(Goal)';
      case 2: return '기준(Criteria)';
      case 3: return '대안(Alternatives)';
      case 4: return '하위기준(Sub-criteria)';
      case 5: return '세부기준(Detailed)';
      default: return `레벨 ${level}`;
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ 모든 기준 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      setCriteria([]);
      saveProjectCriteria([]);
      setNewCriterion({ name: '', description: '', parentId: '' });
      setErrors({});
    }
  };

  const handleLoadDemoData = () => {
    if (criteria.length > 0) {
      if (!window.confirm('⚠️ 기존 데이터가 있습니다. 데모 데이터로 교체하시겠습니까?')) {
        return;
      }
    }
    
    // 데모 데이터를 컴포넌트 형식으로 변환
    const combinedCriteria = [
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
    setCriteria(combinedCriteria);
    saveProjectCriteria(combinedCriteria);
    setNewCriterion({ name: '', description: '', parentId: '' });
    setErrors({});
  };

  const handleBulkImport = (importedCriteria: Criterion[]) => {
    // 기존 기준과 새로 가져온 기준을 병합
    const updatedCriteria = [...criteria, ...importedCriteria];
    setCriteria(updatedCriteria);
    saveProjectCriteria(updatedCriteria);
    setShowBulkInput(false);
    
    // 성공 메시지
    const count = getAllCriteria(importedCriteria).length;
    alert(`✅ ${count}개의 기준이 성공적으로 추가되었습니다.`);
  };

  const renderHelpModal = () => {
    if (!showHelp) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">📚 기준 설정 도움말</h3>
            <button
              onClick={() => setShowHelp(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">🎯 AHP 기준 계층구조란?</h4>
              <p className="text-gray-700 leading-relaxed">
                AHP(Analytic Hierarchy Process)에서 기준 계층구조는 의사결정 문제를 체계적으로 분해하여 
                상위 목표부터 세부 기준까지 단계별로 구성하는 구조입니다.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-green-900 mb-2">📊 AHP 5단계 계층구조</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>🎯 Level 1 (목표):</strong> 최종 의사결정 목표</li>
                <li><strong>📋 Level 2 (기준):</strong> 주요 평가 영역 (3-7개 권장)</li>
                <li><strong>🎪 Level 3 (대안):</strong> 선택 가능한 대안들 (표준 AHP)</li>
                <li><strong>📝 Level 4 (하위기준):</strong> 세분화된 평가 기준</li>
                <li><strong>🔹 Level 5 (세부기준):</strong> 최상세 수준 기준</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-purple-900 mb-2">🔄 레이아웃 모드</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-900">📋 세로형</div>
                  <div className="text-xs text-blue-700">계층구조를 세로로 표시, 상세 정보 확인에 적합</div>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-900">📊 가로형</div>
                  <div className="text-xs text-green-700">계층구조를 가로로 표시, 전체 구조 파악에 적합</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-red-900 mb-2">⚠️ 주의사항</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>기준명은 중복될 수 없습니다</li>
                <li>기존 데이터를 삭제하면 복구할 수 없습니다</li>
                <li>너무 많은 기준(9개 이상)은 평가의 일관성을 떨어뜨릴 수 있습니다</li>
                <li>평가방법(쌍대비교/직접입력)은 신중히 선택하세요</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-orange-900 mb-2">💡 실무 팁</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>기준 설명을 명확히 작성하여 평가자의 이해를 돕습니다</li>
                <li>비슷한 성격의 기준들은 하나의 상위 기준으로 그룹화하세요</li>
                <li>측정 가능한 기준과 주관적 기준을 적절히 균형있게 구성하세요</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={() => setShowHelp(false)}>
              확인
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderHelpModal()}
      <Card title="2-1단계 — 기준추가">
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">📋 AHP 계층 구조 가이드</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 1레벨(목표) → 2레벨(기준) → 3레벨(대안) 순서로 추가</li>
                <li>• 필요시 4-5레벨까지 하위 기준 세분화 가능</li>
                <li>• 기준명은 중복될 수 없으며, 최대 5단계까지 지원</li>
              </ul>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHelp(true)}
              >
                📚 도움말
              </Button>
              {criteria.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearAllData}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  🗑️ 모든 데이터 삭제
                </Button>
              )}
            </div>
          </div>

          {/* Evaluation Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              평가방법 선택
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pairwise"
                  checked={evaluationMethod === 'pairwise'}
                  onChange={(e) => setEvaluationMethod(e.target.value as 'pairwise')}
                  className="mr-2"
                />
                <span className="text-sm">쌍대비교</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="direct"
                  checked={evaluationMethod === 'direct'}
                  onChange={(e) => setEvaluationMethod(e.target.value as 'direct')}
                  className="mr-2"
                />
                <span className="text-sm">직접입력</span>
              </label>
            </div>
          </div>

          {/* Current Criteria Tree Visualization */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">🌳 기준 계층구조 시각화</h4>
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLoadDemoData}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 ml-2"
                >
                  📝 데모 데이터
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowBulkInput(true)}
                  className="text-green-600 border-green-300 hover:bg-green-50 ml-2"
                >
                  🗂️ 일괄 입력
                </Button>
                {criteria.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearAllData}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    🗑️ 초기화
                  </Button>
                )}
              </div>
            </div>
            <HierarchyTreeVisualization
              nodes={getFlatCriteriaForVisualization(criteria)}
              title="AI 개발 활용 방안 기준 계층구조"
              showWeights={true}
              interactive={true}
              layout={layoutMode}
              onLayoutChange={setLayoutMode}
              onNodeClick={(node) => {
                console.log('선택된 기준:', node);
                // 추후 편집 모드 구현 가능
              }}
            />
          </div>

          {/* Add New Criterion */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">➕ 새 기준 추가</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상위 기준
                </label>
                <select
                  value={newCriterion.parentId}
                  onChange={(e) => setNewCriterion(prev => ({ ...prev, parentId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">🎯 최상위 기준 (목표)</option>
                  {getAvailableParentCriteria().map(criterion => (
                    <option key={criterion.id} value={criterion.id}>
                      {getLevelIcon(criterion.level)} {criterion.name} ({getLevelName(criterion.level)})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                id="criterionName"
                label="기준명"
                placeholder="기준명을 입력하세요"
                value={newCriterion.name}
                onChange={(value) => setNewCriterion(prev => ({ ...prev, name: value }))}
                error={errors.name}
                required
              />

              <Input
                id="criterionDescription"
                label="기준 설명 (선택)"
                placeholder="기준에 대한 설명"
                value={newCriterion.description}
                onChange={(value) => setNewCriterion(prev => ({ ...prev, description: value }))}
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleAddCriterion} variant="primary">
                기준 추가
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-600">
              총 {getAllCriteria(criteria).length}개 기준 (
              {[1,2,3,4,5].map(level => {
                const count = getAllCriteria(criteria).filter(c => c.level === level).length;
                return count > 0 ? `L${level}: ${count}개` : null;
              }).filter(Boolean).join(', ') || '없음'}
              ) | 평가방법: {evaluationMethod === 'pairwise' ? '쌍대비교' : '직접입력'}
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary">
                저장
              </Button>
              <Button
                variant="primary"
                onClick={onComplete}
                disabled={criteria.length === 0}
              >
                다음 단계로
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Criteria Input Modal */}
      {showBulkInput && (
        <BulkCriteriaInput
          onImport={handleBulkImport}
          onCancel={() => setShowBulkInput(false)}
          existingCriteria={criteria}
        />
      )}
    </div>
  );
};

export default CriteriaManagement;