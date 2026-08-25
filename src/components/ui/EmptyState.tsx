import React from 'react';
import { Layers, FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = '',
}) => {
  return (
    <div className={`mnc-card p-12 text-center space-y-4 max-w-md mx-auto font-sans ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center mx-auto">
        {icon || <FolderOpen className="w-7 h-7" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-extrabold text-[#0B1F3A]">{title}</h3>
        <p className="text-xs text-[#475569] leading-relaxed font-normal">{description}</p>
      </div>

      {actionLabel && (
        <div className="pt-2">
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="primary" size="md">
                {actionLabel}
              </Button>
            </a>
          ) : (
            <Button variant="primary" size="md" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
