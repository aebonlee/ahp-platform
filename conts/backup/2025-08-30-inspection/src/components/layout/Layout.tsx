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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', fontFamily: 'Pretendard, Inter, system-ui, sans-serif' }}>
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
              className="fixed z-10 p-3 rounded-lg transition-luxury focus-luxury hover:scale-105"
              style={{
                top: 'calc(var(--header-height) + 1rem)',
                left: sidebarCollapsed ? '5rem' : 'calc(var(--sidebar-width) + 1rem)',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-md)',
                borderRadius: 'var(--radius-md)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--gold-primary)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'var(--gold-primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <span className="text-base font-medium">
                {sidebarCollapsed ? '→' : '←'}
              </span>
            </button>
          </>
        )}
        
        <main className="flex-1 transition-luxury" 
              style={{
                marginLeft: user ? (sidebarCollapsed ? '4rem' : 'var(--sidebar-width)') : '0',
                minHeight: 'calc(100vh - var(--header-height))',
                backgroundColor: 'var(--bg-primary)',
                transition: 'margin-left 0.3s ease, background-color 0.3s var(--transition-luxury)'
              }}>
          <div className="container-adaptive section-padding">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;