import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'navy' | 'emerald' | 'amber' | 'rose' | 'slate' | 'outline' | 'orange';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  size = 'md',
  className
}) => {
  const base = "inline-flex items-center font-bold rounded-full border transition-all";
  
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs"
  };

  const variantStyles = {
    orange: "bg-[#FFF0E6] text-[#F97316] border-[#FFD8C2]",
    blue: "bg-[#FFF0E6] text-[#F97316] border-[#FFD8C2]",
    navy: "bg-[#111827] text-white border-transparent",
    emerald: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
    amber: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
    rose: "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]",
    slate: "bg-[#F7F3E8] text-[#4A4A45] border-[#E5E0D5]",
    outline: "bg-transparent text-[#111111] border-[#E5E0D5]"
  };

  return (
    <span className={clsx(base, sizeStyles[size], variantStyles[variant], className)}>
      {children}
    </span>
  );
};
