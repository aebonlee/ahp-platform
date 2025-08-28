import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: boolean;
  variant?: 'default' | 'gradient' | 'glass' | 'bordered';
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  className = '', 
  padding = true,
  variant = 'default',
  hoverable = false,
  onClick
}) => {
  // CSS 변수 기반 variant 스타일
  const getVariantStyle = (variant: string) => {
    switch (variant) {
      case 'gradient':
        return {
          background: 'var(--bg-gradient)',
          border: '1px solid var(--border-light)',
          backdropFilter: 'blur(10px)'
        };
      case 'glass':
        return {
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-glass)'
        };
      case 'bordered':
        return {
          backgroundColor: 'var(--card-bg)',
          border: '2px solid var(--accent-primary)'
        };
      default:
        return {
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)'
        };
    }
  };


  return (
    <div 
      onClick={onClick}
      className={`transition-all duration-300 ${className}`}
      style={{
        ...getVariantStyle(variant),
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        cursor: (hoverable || onClick) ? 'pointer' : 'default'
      }}
      onMouseEnter={(e) => {
        if (hoverable || onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable || onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}>
      {title && (
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
          <h3 className="text-lg font-bold flex items-center" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;