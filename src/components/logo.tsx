
import { cn } from '@/lib/utils';
import React from 'react';

const Logo = ({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) => {
  return (
    <div className={cn('flex items-center gap-2 font-headline', className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      {!iconOnly && <span className="text-xl font-bold text-foreground">Student Wellness Hub</span>}
    </div>
  );
};

export default Logo;
