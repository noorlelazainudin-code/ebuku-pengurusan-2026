import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { user, siteConfig } = useApp();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-20 bg-[#0B132B]/95 backdrop-blur-sm sticky top-0 z-30 shadow-lg border-b border-gray-800 flex items-center justify-between px-8 transition-all">
      {/* Left: System Title */}
      <div className="flex flex-col">
        <h1 className="text-[#C9B458] font-bold text-xl tracking-wide font-montserrat uppercase">
          {siteConfig.systemTitle}
        </h1>
        <p className="text-gray-400 text-xs tracking-wider">{siteConfig.schoolName}</p>
      </div>

      {/* Right: Clock & Profile */}
      <div className="flex items-center gap-8">
        {/* Digital Clock */}
        <div className="bg-[#1C2541] px-4 py-2 rounded-lg border border-gray-700 shadow-inner flex items-center gap-2">
          <span className="text-xs text-[#C9B458]">Masa:</span>
          <span className="text-white font-mono font-bold text-lg">
            {time.toLocaleTimeString('ms-MY', { hour12: true })}
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">
              {user ? user.name : 'Pelawat'}
            </p>
            <p className="text-xs text-[#C9B458]">
              {user ? (user.role === 'adminsistem' ? 'Super Admin' : 'Admin') : 'Akses Terhad'}
            </p>
          </div>
          <div className="w-10 h-10 bg-[#3A506B] rounded-full border-2 border-[#C9B458] flex items-center justify-center text-white font-bold shadow-lg">
            {user ? user.name.charAt(0) : 'U'}
          </div>
        </div>
      </div>
    </div>
  );
};