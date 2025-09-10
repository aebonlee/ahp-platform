import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ResultsAnalysis from '../analysis/ResultsAnalysis';
import InteractiveTreeModel from '../visualization/InteractiveTreeModel';
import ExportManager from '../export/ExportManager';
import HelpSystem from '../help/HelpSystem';

// 구독 서비스 관련 인터페이스
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  maxProjects: number;
  maxEvaluators: number;
  features: string[];
  isPopular?: boolean;
  limits?: {
    maxPersonalAdmins?: number;
    maxProjectsPerAdmin?: number;
    maxEvaluatorsPerProject?: number;
  };
}

interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  startDate: string;
  endDate: string;
  currentProjects?: number;
  currentEvaluators?: number;
  autoRenew: boolean;
  currentUsage?: {
    personalAdminsCount?: number;
    totalProjectsCount?: number;
    totalSurveysCount?: number;
    storageUsed?: number;
  };
}

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'service_tester' | 'evaluator';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  subscription?: UserSubscription;
}

interface ProjectInfo {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerEmail: string;
  status: 'active' | 'completed' | 'draft' | 'archived';
  createdAt: string;
  evaluatorCount: number;
  completionRate: number;
  lastActivity: string;
}

interface OperationalStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalProjects: number;
  monthlyRevenue: number;
  systemUptime: string;
  serverLoad: number;
  storageUsed: string;
  dailyActiveUsers: number;
}

type TabType = 'dashboard' | 'subscriptions' | 'users' | 'projects' | 'revenue' | 'analytics' | 'system' | 'settings';

interface SuperAdminDashboardProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ 
  activeTab: externalActiveTab, 
  onTabChange: externalOnTabChange 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(externalActiveTab || 'dashboard');
  const [stats, setStats] = useState<OperationalStats>({
    totalUsers: 1247,
    activeSubscriptions: 892,
    totalProjects: 3456,
    monthlyRevenue: 125600000,
    systemUptime: '99.9%',
    serverLoad: 23,
    storageUsed: '1.2TB',
    dailyActiveUsers: 345
  });

  // 구독 플랜 정의
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: '베이직',
      price: 29000,
      currency: 'KRW',
      maxProjects: 5,
      maxEvaluators: 10,
      features: ['기본 AHP 분석', '표준 리포트', '이메일 지원'],
      limits: {
        maxPersonalAdmins: 3,
        maxProjectsPerAdmin: 5,
        maxEvaluatorsPerProject: 10
      }
    },
    {
      id: 'professional',
      name: '프로페셔널',
      price: 79000,
      currency: 'KRW',
      maxProjects: 20,
      maxEvaluators: 50,
      features: ['고급 AHP 분석', '민감도 분석', '커스텀 리포트', '우선 지원'],
      isPopular: true,
      limits: {
        maxPersonalAdmins: 10,
        maxProjectsPerAdmin: 20,
        maxEvaluatorsPerProject: 50
      }
    },
    {
      id: 'enterprise',
      name: '엔터프라이즈',
      price: 199000,
      currency: 'KRW',
      maxProjects: -1,
      maxEvaluators: -1,
      features: ['모든 프로 기능', '무제한 프로젝트', '전담 지원', 'API 접근', '온프레미스 옵션'],
      limits: {
        maxPersonalAdmins: -1,
        maxProjectsPerAdmin: -1,
        maxEvaluatorsPerProject: -1
      }
    }
  ];

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);

  // 외부에서 activeTab이 변경되면 내부 상태도 업데이트
  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]);

  // 내부에서 탭이 변경되면 외부로 전달
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (externalOnTabChange) {
      externalOnTabChange(tab);
    }
  };

  useEffect(() => {
    loadOperationalData();
  }, []);

  const loadOperationalData = async () => {
    // 목업 사용자 데이터
    const mockUsers: AdminUser[] = [
      {
        id: '1',
        firstName: '김',
        lastName: '대표',
        email: 'john@company.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: '2024-03-10T09:30:00Z',
        subscription: {
          userId: '1',
          planId: 'professional',
          status: 'active',
          startDate: '2024-01-15',
          endDate: '2024-12-15',
          currentProjects: 8,
          currentEvaluators: 24,
          autoRenew: true
        }
      },
      {
        id: '2',
        firstName: '이',
        lastName: '팀장',
        email: 'sarah@startup.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-02-01',
        lastLogin: '2024-03-09T14:20:00Z',
        subscription: {
          userId: '2',
          planId: 'basic',
          status: 'active',
          startDate: '2024-02-01',
          endDate: '2024-08-01',
          currentProjects: 3,
          currentEvaluators: 7,
          autoRenew: false
        }
      }
    ];

    // 목업 프로젝트 데이터
    const mockProjects: ProjectInfo[] = [
      {
        id: '1',
        title: 'AI 개발 활용 방안 평가',
        description: '기업 내 AI 기술 도입을 위한 다기준 의사결정',
        ownerId: '1',
        ownerEmail: 'john@company.com',
        status: 'active',
        createdAt: '2024-02-15',
        evaluatorCount: 12,
        completionRate: 75,
        lastActivity: '2024-03-10T15:30:00Z'
      },
      {
        id: '2',
        title: '신제품 출시 전략 결정',
        description: '마케팅 전략 및 출시 시기 결정',
        ownerId: '2',
        ownerEmail: 'sarah@startup.com',
        status: 'completed',
        createdAt: '2024-01-20',
        evaluatorCount: 8,
        completionRate: 100,
        lastActivity: '2024-02-28T10:15:00Z'
      }
    ];

    setUsers(mockUsers);
    setProjects(mockProjects);
    setSubscriptions(mockUsers.map(u => u.subscription).filter(Boolean) as UserSubscription[]);
  };

  // 대시보드 메인 화면
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">운영 대시보드</h2>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">데이터 새로고침</Button>
          <Button variant="primary" size="sm">월간 리포트</Button>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="📊 총 사용자">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">활성 사용자</div>
            <div className="text-xs text-green-600 mt-2">↗ +12% 전월 대비</div>
          </div>
        </Card>

        <Card title="💰 월간 수익">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              ₩{(stats.monthlyRevenue / 10000).toFixed(0)}만
            </div>
            <div className="text-sm text-gray-600 mt-1">이번 달 매출</div>
            <div className="text-xs text-green-600 mt-2">↗ +8% 전월 대비</div>
          </div>
        </Card>

        <Card title="📋 활성 프로젝트">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.totalProjects.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">진행 중 프로젝트</div>
            <div className="text-xs text-blue-600 mt-2">↗ +5% 전월 대비</div>
          </div>
        </Card>

        <Card title="⚡ 시스템 상태">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.systemUptime}</div>
            <div className="text-sm text-gray-600 mt-1">가동률 (30일)</div>
            <div className="text-xs text-gray-500 mt-2">서버 부하: {stats.serverLoad}%</div>
          </div>
        </Card>
      </div>

      {/* 구독 현황 요약 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="📈 구독 현황">
          <div className="space-y-4">
            {subscriptionPlans.map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-sm text-gray-600">₩{plan.price.toLocaleString()}/월</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">
                    {Math.floor(stats.activeSubscriptions * (plan.id === 'professional' ? 0.6 : plan.id === 'basic' ? 0.3 : 0.1))}
                  </div>
                  <div className="text-xs text-gray-500">활성 구독</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="📊 사용량 분석">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">평균 프로젝트/사용자</span>
              <span className="font-semibold">2.8개</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">평균 평가자/프로젝트</span>
              <span className="font-semibold">12명</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">프로젝트 완료율</span>
              <span className="font-semibold text-green-600">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">고객 만족도</span>
              <span className="font-semibold text-blue-600">4.6/5.0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // 구독 관리 화면
  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">구독 관리</h2>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">플랜 수정</Button>
          <Button variant="primary" size="sm">새 플랜 추가</Button>
        </div>
      </div>

      {/* 구독 플랜 관리 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map(plan => (
          <Card key={plan.id} title={plan.name}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">₩{plan.price.toLocaleString()}</div>
                <div className="text-sm text-gray-600">월 요금</div>
                {plan.isPopular && (
                  <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded mt-2 inline-block">
                    인기 플랜
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">최대 프로젝트</span>
                  <span className="font-medium">{plan.maxProjects === -1 ? '무제한' : `${plan.maxProjects}개`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">최대 평가자</span>
                  <span className="font-medium">{plan.maxEvaluators === -1 ? '무제한' : `${plan.maxEvaluators}명`}</span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">포함 기능</div>
                <ul className="text-xs space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600">
                  활성 구독자: {Math.floor(stats.activeSubscriptions * (plan.id === 'professional' ? 0.6 : plan.id === 'basic' ? 0.3 : 0.1))}명
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // 사용자 관리 화면
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">사용자 관리</h2>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">사용자 내보내기</Button>
          <Button variant="primary" size="sm">새 사용자 추가</Button>
        </div>
      </div>

      {/* 사용자 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="전체 사용자">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">등록된 사용자</div>
          </div>
        </Card>
        <Card title="활성 사용자">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.dailyActiveUsers}</div>
            <div className="text-sm text-gray-600">일일 활성 사용자</div>
          </div>
        </Card>
        <Card title="구독 사용자">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.activeSubscriptions}</div>
            <div className="text-sm text-gray-600">유료 구독자</div>
          </div>
        </Card>
        <Card title="이번 달 신규">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">47</div>
            <div className="text-sm text-gray-600">신규 가입자</div>
          </div>
        </Card>
      </div>

      {/* 사용자 목록 */}
      <Card title="사용자 목록">
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="사용자 검색..."
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <select className="border border-gray-300 rounded px-3 py-2">
            <option value="">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="suspended">정지</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-2">
            <option value="">모든 플랜</option>
            <option value="basic">베이직</option>
            <option value="professional">프로페셔널</option>
            <option value="enterprise">엔터프라이즈</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">사용자 정보</th>
                <th className="text-left p-3">구독 플랜</th>
                <th className="text-left p-3">사용량</th>
                <th className="text-left p-3">상태</th>
                <th className="text-left p-3">마지막 로그인</th>
                <th className="text-left p-3">액션</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const subscription = user.subscription;
                const plan = subscription ? subscriptionPlans.find(p => p.id === subscription.planId) : null;
                return (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-500">가입: {new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      {plan ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {plan.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">무료</span>
                      )}
                    </td>
                    <td className="p-3">
                      {subscription ? (
                        <div className="text-sm">
                          <div>프로젝트: {subscription.currentUsage?.totalProjectsCount || 0}/{plan?.limits?.maxProjectsPerAdmin === -1 ? '∞' : plan?.limits?.maxProjectsPerAdmin || 0}</div>
                          <div>관리자: {subscription.currentUsage?.personalAdminsCount || 0}/{plan?.limits?.maxPersonalAdmins === -1 ? '∞' : plan?.limits?.maxPersonalAdmins || 0}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? '활성' : 
                         user.status === 'inactive' ? '비활성' : '정지'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-600">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '미접속'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="secondary" size="sm">편집</Button>
                        <Button variant="secondary" size="sm">상세</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // 프로젝트 관리 화면
  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">프로젝트 관리</h2>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">프로젝트 내보내기</Button>
          <Button variant="primary" size="sm">통계 리포트</Button>
        </div>
      </div>

      {/* 프로젝트 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="전체 프로젝트">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
            <div className="text-sm text-gray-600">등록된 프로젝트</div>
          </div>
        </Card>
        <Card title="활성 프로젝트">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">진행 중</div>
          </div>
        </Card>
        <Card title="완료 프로젝트">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">완료됨</div>
          </div>
        </Card>
        <Card title="평균 완료율">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">87%</div>
            <div className="text-sm text-gray-600">전체 평균</div>
          </div>
        </Card>
      </div>

      {/* 프로젝트 목록 */}
      <Card title="프로젝트 목록">
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">소유자: {project.ownerEmail}</span>
                    <span className="text-xs text-gray-500">평가자: {project.evaluatorCount}명</span>
                    <span className="text-xs text-gray-500">완료율: {project.completionRate}%</span>
                    <span className="text-xs text-gray-500">마지막 활동: {new Date(project.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status === 'active' ? '진행중' : 
                     project.status === 'completed' ? '완료' : 
                     project.status === 'draft' ? '초안' : '보관'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // 수익 분석 화면
  const renderRevenue = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">수익 분석</h2>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">수익 리포트</Button>
          <Button variant="primary" size="sm">재무 요약</Button>
        </div>
      </div>

      {/* 수익 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="이번 달 수익">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ₩{(stats.monthlyRevenue / 10000).toFixed(0)}만
            </div>
            <div className="text-sm text-gray-600">3월 총 수익</div>
            <div className="text-xs text-green-600 mt-1">↗ +8% 전월 대비</div>
          </div>
        </Card>
        
        <Card title="연간 수익 예상">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ₩{((stats.monthlyRevenue * 12) / 100000000).toFixed(1)}억
            </div>
            <div className="text-sm text-gray-600">2024년 예상</div>
            <div className="text-xs text-blue-600 mt-1">↗ +15% YoY</div>
          </div>
        </Card>

        <Card title="평균 고객 가치">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ₩{Math.floor(stats.monthlyRevenue / stats.activeSubscriptions / 1000)}만
            </div>
            <div className="text-sm text-gray-600">월간 ARPU</div>
            <div className="text-xs text-purple-600 mt-1">↗ +3% 전월 대비</div>
          </div>
        </Card>

        <Card title="구독 갱신율">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">94%</div>
            <div className="text-sm text-gray-600">월간 갱신율</div>
            <div className="text-xs text-green-600 mt-1">↗ +1% 전월 대비</div>
          </div>
        </Card>
      </div>

      {/* 플랜별 수익 분석 */}
      <Card title="플랜별 수익 분석">
        <div className="space-y-4">
          {subscriptionPlans.map(plan => {
            const subscribers = Math.floor(stats.activeSubscriptions * (plan.id === 'professional' ? 0.6 : plan.id === 'basic' ? 0.3 : 0.1));
            const monthlyRevenue = subscribers * plan.price;
            return (
              <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-sm text-gray-600">{subscribers}명 구독 중</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">₩{(monthlyRevenue / 10000).toFixed(0)}만</div>
                  <div className="text-sm text-gray-600">월간 수익</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  // 분석 도구 화면
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">분석 도구</h2>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">데이터 내보내기</Button>
          <Button variant="primary" size="sm">맞춤 리포트</Button>
        </div>
      </div>

      {/* AHP for Paper 통합 분석 도구 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="🔬 결과 분석">
          <ResultsAnalysis 
            projectId="demo-analytics" 
            evaluationMode="theoretical" 
          />
        </Card>

        <Card title="🌳 인터랙티브 트리 모델">
          <InteractiveTreeModel projectId="demo-tree" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="📊 내보내기 관리">
          <ExportManager 
            projectId="demo-export" 
            projectData={{}} 
          />
        </Card>

        <Card title="❓ 도움말 시스템">
          <HelpSystem />
        </Card>
      </div>
    </div>
  );

  // 시스템 관리 화면
  const renderSystem = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">시스템 관리</h2>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">시스템 진단</Button>
          <Button variant="primary" size="sm">백업 실행</Button>
        </div>
      </div>

      {/* 시스템 상태 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="서버 상태">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">정상</div>
            <div className="text-sm text-gray-600">가동률 {stats.systemUptime}</div>
          </div>
        </Card>
        <Card title="서버 부하">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.serverLoad}%</div>
            <div className="text-sm text-gray-600">현재 CPU 사용률</div>
          </div>
        </Card>
        <Card title="저장소 사용">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.storageUsed}</div>
            <div className="text-sm text-gray-600">총 사용량</div>
          </div>
        </Card>
        <Card title="활성 세션">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.dailyActiveUsers}</div>
            <div className="text-sm text-gray-600">현재 접속자</div>
          </div>
        </Card>
      </div>

      {/* 시스템 로그 */}
      <Card title="최근 시스템 로그">
        <div className="space-y-2">
          <div className="text-sm p-2 bg-green-50 rounded">
            <span className="text-green-600 font-medium">[정상]</span> 
            <span className="text-gray-600 ml-2">2024-03-10 15:30 - 자동 백업 완료</span>
          </div>
          <div className="text-sm p-2 bg-blue-50 rounded">
            <span className="text-blue-600 font-medium">[정보]</span> 
            <span className="text-gray-600 ml-2">2024-03-10 14:20 - 사용자 로그인: john@company.com</span>
          </div>
          <div className="text-sm p-2 bg-yellow-50 rounded">
            <span className="text-yellow-600 font-medium">[경고]</span> 
            <span className="text-gray-600 ml-2">2024-03-10 13:15 - 서버 부하 일시적 증가 (85%)</span>
          </div>
        </div>
      </Card>
    </div>
  );

  // 설정 관리 화면
  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">시스템 설정</h2>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">설정 내보내기</Button>
          <Button variant="primary" size="sm">변경사항 저장</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 일반 설정 */}
        <Card title="일반 설정">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">시스템 이름</label>
              <input
                type="text"
                value="AHP Decision Support System"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">관리자 이메일</label>
              <input
                type="email"
                value="admin@ahp-system.com"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">시간대</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="Asia/Seoul">Asia/Seoul (KST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 보안 설정 */}
        <Card title="보안 설정">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">2단계 인증 강제</span>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">자동 로그아웃</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">IP 제한</span>
              <input type="checkbox" className="rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">세션 타임아웃 (분)</label>
              <input
                type="number"
                value="30"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </Card>

        {/* 구독 설정 */}
        <Card title="구독 설정">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">자동 갱신 허용</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">무료 체험 기간</span>
              <select className="border border-gray-300 rounded px-3 py-2">
                <option value="7">7일</option>
                <option value="14">14일</option>
                <option value="30">30일</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">할인 코드 유효 기간 (일)</label>
              <input
                type="number"
                value="30"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </Card>

        {/* 알림 설정 */}
        <Card title="알림 설정">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">이메일 알림</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">결제 완료 알림</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">시스템 장애 알림</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">월간 리포트 자동 발송</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">총괄 관리자 대시보드</h1>
          <p className="text-gray-600">AHP 구독 서비스 운영 및 전체 시스템 관리</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            마지막 업데이트: {new Date().toLocaleString()}
          </div>
          <Button variant="secondary" size="sm">
            새로고침
          </Button>
        </div>
      </div>

      {/* 메뉴 탭 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {/* First Row - Core Management */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'dashboard', label: '운영 대시보드', icon: '📊', desc: '전체 현황 및 통계' },
              { id: 'subscriptions', label: '구독 관리', icon: '💳', desc: '플랜 및 구독자 관리' },
              { id: 'users', label: '사용자 관리', icon: '👥', desc: '계정 및 권한 관리' },
              { id: 'projects', label: '프로젝트 관리', icon: '📋', desc: '모든 프로젝트 통합 관리' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as TabType)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  activeTab === item.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          {/* Second Row - Advanced Functions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'revenue', label: '수익 분석', icon: '💰', desc: '매출 및 재무 현황' },
              { id: 'analytics', label: '분석 도구', icon: '🔬', desc: '고급 AHP 분석' },
              { id: 'system', label: '시스템 관리', icon: '⚡', desc: '서버 및 성능 모니터링' },
              { id: 'settings', label: '설정 관리', icon: '⚙️', desc: '전역 설정 및 정책' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as TabType)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  activeTab === item.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          {(() => {
            switch (activeTab as TabType) {
              case 'dashboard':
                return renderDashboard();
              case 'subscriptions':
                return renderSubscriptions();
              case 'users':
                return renderUsers();
              case 'projects':
                return renderProjects();
              case 'revenue':
                return renderRevenue();
              case 'analytics':
                return renderAnalytics();
              case 'system':
                return renderSystem();
              case 'settings':
                return renderSettings();
              default:
                return renderDashboard();
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;