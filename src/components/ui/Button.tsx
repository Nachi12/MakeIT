import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'navy' | 'whiteNavy';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

  const sizes = {
    sm: "px-4 py-2 text-xs gap-1.5 h-9",
    md: "px-6 py-2.5 text-sm gap-2 h-11",
    lg: "px-7 py-3.5 text-base gap-2.5 h-12"
  };

  const variants = {
    primary: "bg-[#F97316] text-white hover:bg-[#EA580C] shadow-xs active:bg-[#C2410C]",
    secondary: "bg-[#111111] text-white hover:bg-[#2A2A2A] shadow-xs",
    outline: "bg-white text-[#111111] border border-[#E5E0D5] hover:bg-[#F7F3E8] hover:border-[#F97316]",
    ghost: "bg-transparent text-[#4A4A45] hover:text-[#F97316]",
    navy: "bg-[#111827] text-white hover:bg-[#1F2937] shadow-xs",
    whiteNavy: "bg-white text-[#111827] hover:bg-[#F7F3E8] font-bold shadow-xs"
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current fill-none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
