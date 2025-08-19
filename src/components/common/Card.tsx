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
  // Blocksy 스타일 variant 클래스
  const variantClasses = {
    default: 'bg-white border border-neutral-200',
    gradient: 'bg-gradient-card border border-neutral-200/50',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20',
    bordered: 'bg-white border-2 border-primary-200'
  };

  // Blocksy 스타일 호버 효과
  const hoverClasses = hoverable 
    ? 'hover:shadow-blocksy-lg hover:-translate-y-1 cursor-pointer' 
    : '';

  return (
    <div 
      onClick={onClick}
      className={`
        ${variantClasses[variant]}
        rounded-blocksy-lg 
        shadow-blocksy 
        transition-all 
        duration-300 
        ${hoverClasses}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}>
      {title && (
        <div className="px-6 py-4 border-b border-neutral-200/50">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center">
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