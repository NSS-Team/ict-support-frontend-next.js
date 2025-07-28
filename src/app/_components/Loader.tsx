'use client';

import { useState, useEffect } from 'react';

export default function Loader() {
  const [currentDot, setCurrentDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDot((prev) => (prev + 1) % 3);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center">
      {/* Modern Spinner with Blue/Grey/Black/White Theme */}
      <div className="relative w-12 h-12">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-400 rounded-full animate-spin"></div>
        
        {/* Middle Ring */}
        <div className="absolute inset-2 border-3 border-transparent border-t-slate-700 border-l-slate-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Inner Ring */}
        <div className="absolute inset-4 border-2 border-transparent border-t-gray-800 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
        
        {/* Center Pulsing Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-slate-700 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-1 left-1/2 w-1 h-1 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/2 -right-1 w-1 h-1 bg-slate-600 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-1 left-1/2 w-1 h-1 bg-gray-700 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 -left-1 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
}