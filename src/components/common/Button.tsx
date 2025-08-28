import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  style,
  onMouseEnter,
  onMouseLeave
}) => {
  // 글로벌 테마 시스템 기반 기본 클래스
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md rounded-lg';
  
  // 글로벌 테마 변수를 활용한 variant 클래스
  const variantClasses = {
    primary: 'bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover)] text-[var(--button-primary-text)] focus:ring-[var(--interactive-normal)]',
    secondary: 'bg-[var(--button-secondary-bg)] hover:bg-[var(--button-secondary-hover)] text-[var(--button-secondary-text)] focus:ring-[var(--interactive-normal)]',
    success: 'bg-[var(--semantic-success)] hover:bg-green-700 text-white focus:ring-[var(--semantic-success)]',
    warning: 'bg-[var(--semantic-warning)] hover:bg-amber-700 text-white focus:ring-[var(--semantic-warning)]',
    error: 'bg-[var(--semantic-danger)] hover:bg-red-700 text-white focus:ring-[var(--semantic-danger)]',
    outline: 'bg-[var(--surface-base)] border-2 border-[var(--interactive-normal)] text-[var(--interactive-normal)] hover:bg-[var(--surface-raised)] focus:ring-[var(--interactive-normal)]',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] focus:ring-[var(--interactive-normal)]'
  };
  
  // Blocksy 스타일 크기 클래스
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-sm min-h-[44px]',
    lg: 'px-8 py-4 text-base min-h-[52px]',
    xl: 'px-10 py-5 text-lg min-h-[60px]'
  };
  
  // 비활성화 상태 스타일
  const disabledClasses = disabled || loading 
    ? 'opacity-60 cursor-not-allowed transform-none hover:scale-100 hover:shadow-sm' 
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-3 h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;