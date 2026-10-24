import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2 text-[#C65D3B] ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
        <path
          d="M22 7.5a10.5 10.5 0 1 0 .2 17"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-serif text-[1.7rem] leading-none tracking-tight">Craftiva</span>
    </span>
  );
};
