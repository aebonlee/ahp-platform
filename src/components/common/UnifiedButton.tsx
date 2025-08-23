import React from 'react';

interface UnifiedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  title?: string;
}

const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon,
  title
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 theme-focus disabled:opacity-50 disabled:cursor-not-allowed border';
  
  const sizeClasses = {
    sm: 'min-w-[80px] px-3 py-2 text-sm',
    md: 'min-w-[100px] px-4 py-2.5 text-base', 
    lg: 'min-w-[120px] px-6 py-3 text-lg'
  };

  const variantStyles = {
    primary: {
      background: 'var(--accent-gold)',
      color: 'white',
      borderColor: 'var(--accent-gold)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      background: 'var(--surface-2)',
      color: 'var(--text-1)',
      borderColor: 'var(--border)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)'
    },
    info: {
      background: 'var(--info)',
      color: 'white',
      borderColor: 'var(--info)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)'
    },
    success: {
      background: 'var(--success)',
      color: 'white',
      borderColor: 'var(--success)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)'
    },
    warning: {
      background: 'var(--warning)',
      color: 'white', 
      borderColor: 'var(--warning)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)'
    },
    danger: {
      background: 'var(--danger)',
      color: 'white',
      borderColor: 'var(--danger)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)'
    }
  };

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  const buttonStyle = {
    ...variantStyles[variant],
    cursor: disabled ? 'not-allowed' : 'pointer'
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      const element = e.currentTarget;
      element.style.transform = 'translateY(-1px)';
      element.style.boxShadow = 'var(--shadow-md)';
      
      if (variant === 'primary') {
        element.style.background = 'var(--accent-gold-2)';
      } else if (variant === 'secondary') {
        element.style.background = 'var(--accent-ivory)';
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      const element = e.currentTarget;
      element.style.transform = 'translateY(0)';
      element.style.boxShadow = variantStyles[variant].boxShadow;
      element.style.background = variantStyles[variant].background;
    }
  };

  return (
    <button
      className={buttonClasses}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default UnifiedButton;