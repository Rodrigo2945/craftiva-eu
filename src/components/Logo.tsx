import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto drop-shadow-sm" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" /> {/* orange-500 */}
            <stop offset="100%" stopColor="#7c2d12" /> {/* orange-900 */}
          </linearGradient>
          <linearGradient id="logo-gradient-light" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" /> {/* orange-400 */}
            <stop offset="100%" stopColor="#ea580c" /> {/* orange-600 */}
          </linearGradient>
        </defs>
        
        {/* The "C" shape */}
        <path 
          d="M 75 25 A 35 35 0 1 0 75 75" 
          stroke="url(#logo-gradient)" 
          strokeWidth="18" 
          strokeLinecap="round" 
        />
        
        {/* Inner accent dot */}
        <circle 
          cx="55" 
          cy="50" 
          r="14" 
          fill="url(#logo-gradient-light)" 
        />
      </svg>
      <span className="font-serif font-bold text-2xl tracking-tighter text-gray-900">
        CRAFTIVA<span className="text-emerald-600">.EU</span>
      </span>
    </div>
  );
};
