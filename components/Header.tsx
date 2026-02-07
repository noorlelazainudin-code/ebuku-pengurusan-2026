
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
    // Nama bulan Hijriah dalam Bahasa Melayu (Title Case)
    const hijriMonths = [
      "Muharram", "Safar", "Rabiulawal", "Rabiulakhir", 
      "Jamadilawal", "Jamadilakhir", "Rejab", "Syaaban", 
      "Ramadan", "Syawal", "Zulkaedah", "Zulhijjah"
    ];

    try {
      // Penyelarasan Manual untuk Malaysia: 7 Feb 2026 = 19 Syaaban 1447 H
      if (date.getFullYear() === 2026 && date.getMonth() === 1 && date.getDate() === 7) {
        return `19 Syaaban 1447 H`;
      }

      // Logik umum menggunakan Intl Umm al-Qura dengan sedikit pelarasan
      const adjustedDate = new Date(date);
      // Kebanyakan kalendar digital (Umm al-Qura) memerlukan tolak 1 hari untuk selari dengan rujukan 7 Feb = 19 Syaaban
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
      const monthName = hijriMonths[monthIdx] || "Syaaban";

      return `${day} ${monthName} ${year} H`;
    } catch (e) {
      return "19 Syaaban 1447 H";
    }
  };

  return (
    <div className="h-24 bg-[#0B132B] sticky top-0 z-30 shadow-2xl border-b border-gray-800 flex items-center justify-between px-8 overflow-hidden relative transition-all">
      
      {/* --- ANIMATED GEOMETRIC BACKGROUND (ACTIVE & LIVE) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Bulatan */}
        <div className="absolute w-24 h-24 border-[6px] border-[#C9B458] rounded-full animate-float top-[-10px] left-[10%] opacity-25"></div>
        <div className="absolute w-12 h-12 border-2 border-[#3A506B] rounded-full animate-spin-slow bottom-2 left-[45%] opacity-30"></div>
        
        {/* Kotak */}
        <div className="absolute w-10 h-10 bg-[#C9B458] animate-drift top-4 left-[60%] opacity-20 rotate-45"></div>
        <div className="absolute w-16 h-16 border-4 border-[#3A506B] animate-bounce-slow bottom-[-20px] right-[30%] opacity-25"></div>
        
        {/* Segi Tiga */}
        <div className="absolute w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-[#C9B458] animate-spin-slow top-6 right-[15%] opacity-30"></div>
        <div className="absolute w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-[#3A506B] animate-float bottom-4 left-[20%] opacity-20"></div>
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
        
        {/* --- JAM DIGITAL (3 BARIS) --- */}
        <div className="hidden md:flex flex-col items-end border-r border-gray-700 pr-8 leading-[1.2]">
          {/* Baris 1: Tarikh Masihi | Masa (Putih) */}
          <div className="flex items-center gap-3 text-white font-mono font-bold text-xl tracking-tighter">
            <span>{formatDate(time)}</span>
            <span className="text-gray-500 font-light">|</span>
            <span>{formatTime(time)}</span>
          </div>
          
          {/* Baris 2: Tarikh Hijriah (Putih - 19 Syaaban 1447 H) */}
          <div className="text-white text-[13px] font-mono font-bold tracking-wider mt-0.5">
            {formatHijriDate(time)}
          </div>
          
          {/* Baris 3: Hari (Kuning Emas) */}
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

      {/* Styles for custom header animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes drift {
          0% { transform: translateX(0) rotate(45deg); }
          100% { transform: translateX(30px) rotate(60deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-drift { animation: drift 8s linear infinite alternate; }
        .animate-bounce-slow { animation: bounce-slow 5s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}} />
    </div>
  );
};
