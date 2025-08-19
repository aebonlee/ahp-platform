import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'evaluator';
    admin_type?: 'super' | 'personal';
    canSwitchModes?: boolean;
  } | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  onModeSwitch?: (mode: 'super' | 'personal') => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  activeTab, 
  onTabChange, 
  onLogout,
  onModeSwitch 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogoClick = () => {
    // 사용자 상태에 따라 적절한 메인 페이지로 이동
    if (user) {
      if (user.role === 'super_admin') {
        onTabChange('admin-type-selection');
      } else if (user.role === 'admin' && user.admin_type === 'personal') {
        onTabChange('personal-service');
      } else if (user.role === 'admin') {
        onTabChange('admin-type-selection');
      } else if (user.role === 'evaluator') {
        onTabChange('evaluator-dashboard');
      } else {
        onTabChange('landing');
      }
    } else {
      onTabChange('landing');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLogout={onLogout} 
        onLogoClick={handleLogoClick}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      
      <div className="flex">
        {user && (
          <>
            <Sidebar
              isCollapsed={sidebarCollapsed}
              userRole={user.role}
              adminType={user.admin_type}
              activeTab={activeTab}
              onTabChange={onTabChange}
              canSwitchModes={user.canSwitchModes}
              onModeSwitch={onModeSwitch}
            />
            
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="fixed top-20 left-2 z-10 bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              style={{ left: sidebarCollapsed ? '4rem' : '16rem' }}
            >
              <span className="text-sm">
                {sidebarCollapsed ? '→' : '←'}
              </span>
            </button>
          </>
        )}
        
        <main className={`flex-1 p-6 transition-all duration-300 ${
          user ? 'ml-0' : 'ml-0'
        }`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;