import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import ColorThemeSelector from './ColorThemeSelector';
import { useTheme } from '../../hooks/useTheme';

const ThemeSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const themeInfo = {
    light: { name: '라이트 모드', icon: '☀️', description: '밝은 테마' },
    dark: { name: '다크 모드', icon: '🌙', description: '어두운 테마' },
    system: { name: '시스템 설정', icon: '💻', description: '시스템 설정에 따라' }
  };

  return (
    <>
      {/* Floating Theme Button */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)',
            backdropFilter: 'blur(10px)'
          }}
          title="테마 설정"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🎨</span>
        </button>
      </div>

      {/* Theme Settings Modal */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative rounded-2xl shadow-2xl max-w-md w-full mx-4"
               style={{
                 backgroundColor: 'var(--bg-secondary)',
                 borderRadius: 'var(--radius-lg)',
                 boxShadow: 'var(--shadow-2xl)',
                 border: '1px solid var(--border-light)'
               }}>
            
            {/* Header */}
            <div className="px-6 py-4 border-b"
                 style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}>
                  ⚙️ 테마 설정
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span style={{ color: 'var(--text-muted)' }}>✕</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Dark/Light Mode Section */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}>
                  {resolvedTheme === 'dark' ? '🌙' : '☀️'} 다크/라이트 모드
                </h4>
                
                <div className="grid grid-cols-1 gap-2">
                  {(['light', 'dark', 'system'] as const).map((themeOption) => {
                    const info = themeInfo[themeOption];
                    const isActive = theme === themeOption;
                    
                    return (
                      <button
                        key={themeOption}
                        onClick={() => setTheme(themeOption)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                          isActive ? 'ring-2 ring-offset-2' : ''
                        }`}
                        style={{
                          backgroundColor: isActive ? 'var(--accent-light)' : 'var(--bg-elevated)',
                          borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-light)'
                        }}
                      >
                        <span className="text-xl">{info.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium"
                               style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                            {info.name}
                          </div>
                          <div className="text-sm"
                               style={{ color: 'var(--text-muted)' }}>
                            {info.description}
                          </div>
                        </div>
                        {isActive && (
                          <span className="text-sm"
                                style={{ color: 'var(--accent-primary)' }}>
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Theme Section */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}>
                  🎨 컬러 테마
                </h4>
                
                <div className="flex justify-center">
                  <ColorThemeSelector />
                </div>
              </div>

              {/* Info */}
              <div className="p-4 rounded-xl"
                   style={{ 
                     backgroundColor: 'var(--bg-elevated)',
                     border: '1px solid var(--border-light)'
                   }}>
                <p className="text-sm flex items-start gap-2"
                   style={{ color: 'var(--text-muted)' }}>
                  <span>💡</span>
                  <span>
                    설정은 브라우저에 자동 저장되며, 다음 방문 시에도 유지됩니다. 
                    시스템 모드는 운영체제의 다크/라이트 모드 설정을 따릅니다.
                  </span>
                </p>
              </div>
              
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ThemeSettings;