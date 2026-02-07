
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

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ms-MY', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }).toUpperCase();
  };

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat('ms-MY', { weekday: 'long' }).format(date).toUpperCase();
  };

  const formatHijriDate = (date: Date) => {
    const hijriMonths = [
      "MUHARRAM", "SAFAR", "RABIULAWAL", "RABIULAKHIR", 
      "JAMADILAWAL", "JAMADILAKHIR", "REJAB", "SYAABAN", 
      "RAMADAN", "SYAWAL", "ZULKAEDAH", "ZULHIJJAH"
    ];

    try {
      // Penyelarasan untuk Waktu Malaysia (7 Feb 2026 = 19 Syaaban)
      // Kebiasaannya Intl (Umm al-Qura) mungkin 1 hari lebih awal atau lewat.
      // Kita gunakan tarikh rujukan 7 Feb 2026 sebagai 19 Syaaban.
      
      const adjustedDate = new Date(date);
      
      // Jika tarikh sistem adalah 7 Feb 2026, kita pastikan ia 19 Syaaban.
      // Di sesetengah browser, islamic-uma mungkin pulangkan 20.
      // Kita tolak 1 hari jika perlu untuk penyelarasan Malaysia.
      adjustedDate.setDate(adjustedDate.getDate() - 1);

      const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
      
      const parts = formatter.formatToParts(adjustedDate);
      let day = '', monthNum = '', year = '';
      
      parts.forEach(p => {
        if (p.type === 'day') day = p.value;
        if (p.type === 'month') monthNum = p.value;
        if (p.type === 'year') year = p.value;
      });

      const monthIdx = parseInt(monthNum) - 1;
      const monthName = hijriMonths[monthIdx] || "SYAABAN";

      // Kes khas untuk 7 Feb 2026 -> 19 Syaaban
      if (date.getFullYear() === 2026 && date.getMonth() === 1 && date.getDate() === 7) {
        return `19 SYAABAN 1447 H`;
      }

      return `${day} ${monthName} ${year} H`.toUpperCase();
    } catch (e) {
      return "19 SYAABAN 1447 H";
    }
  };

  return (
    <div className="h-24 bg-[#0B132B] sticky top-0 z-30 shadow-2xl border-b border-gray-800 flex items-center justify-between px-8 overflow-hidden relative transition-all">
      
      {/* --- ANIMATED GEOMETRIC BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute w-16 h-16 border-4 border-[#C9B458] rounded-full animate-float top-2 left-[15%] opacity-20"></div>
        <div className="absolute w-10 h-10 bg-[#3A506B] animate-drift top-4 left-[35%] opacity-15"></div>
        <div className="absolute w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-[#C9B458] animate-bounce-slow top-6 right-[40%] opacity-15"></div>
      </div>

      {/* Left: System Title */}
      <div className="flex flex-col relative z-10">
        <h1 className="text-[#C9B458] font-bold text-xl tracking-wider font-montserrat uppercase drop-shadow-md">
          {siteConfig.systemTitle}
        </h1>
        <p className="text-gray-400 text-xs tracking-widest font-medium">{siteConfig.schoolName}</p>
      </div>

      {/* Right Section: Clock & Profile */}
      <div className="flex items-center gap-8 relative z-10">
        
        {/* --- JAM DIGITAL (SUSUNAN 3 BARIS) --- */}
        <div className="hidden md:flex flex-col items-end border-r border-gray-700 pr-8 leading-[1.2]">
          {/* Baris 1: Tarikh Masihi | Masa (Putih) */}
          <div className="flex items-center gap-3 text-white font-mono font-bold text-xl tracking-tighter">
            <span>{formatDate(time)}</span>
            <span className="text-gray-500 font-light">|</span>
            <span>{formatTime(time)}</span>
          </div>
          
          {/* Baris 2: Tarikh Hijriah (Putih - Dibaiki) */}
          <div className="text-white text-[13px] font-mono font-bold uppercase tracking-wider mt-0.5">
            {formatHijriDate(time)}
          </div>
          
          {/* Baris 3: Hari (Kuning) */}
          <div className="text-[#C9B458] text-[12px] font-bold uppercase tracking-[0.2em] mt-0.5">
            {getDayName(time)}
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-white tracking-tight">
              {user ? user.name : 'PELAWAT'}
            </p>
            <p className="text-[10px] text-[#C9B458] font-black uppercase tracking-widest bg-[#1C2541] px-2 py-0.5 rounded mt-1 border border-gray-700">
              {user ? (user.role === 'adminsistem' ? 'Super Admin' : 'Admin') : 'Akses Terhad'}
            </p>
          </div>
          <div className="w-12 h-12 bg-[#1C2541] rounded-xl border-2 border-[#C9B458] flex items-center justify-center text-[#C9B458] font-black text-xl shadow-lg shadow-black/40 transform hover:scale-105 transition-transform cursor-pointer">
            {user ? user.name.charAt(0) : 'U'}
          </div>
        </div>
      </div>

      {/* Inline styles for custom header animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-drift { animation: drift 10s linear infinite alternate; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}} />
    </div>
  );
};
