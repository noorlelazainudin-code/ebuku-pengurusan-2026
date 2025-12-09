import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Permissions, SiteConfig } from '../types';

export const AdminSettings: React.FC = () => {
  const { user, permissions, updatePermissions, showToast, siteConfig, updateSiteConfig, saveToCloud, loadFromCloud, isSyncing } = useApp();
  const [localPermissions, setLocalPermissions] = useState<Permissions>(permissions);
  const [localConfig, setLocalConfig] = useState<SiteConfig>(siteConfig);

  useEffect(() => {
    setLocalPermissions(permissions);
    setLocalConfig(siteConfig);
  }, [permissions, siteConfig]);

  if (user?.role !== 'adminsistem') {
    return (
      <div className="p-10 text-center">
        <h2 className="text-red-500 text-2xl font-bold">Akses Ditolak</h2>
        <p className="text-gray-400">Hanya Admin Sistem dibenarkan mengubah tetapan ini.</p>
      </div>
    );
  }

  const handleToggle = (key: keyof Permissions) => {
    setLocalPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveSettings = () => {
    updatePermissions(localPermissions);
    updateSiteConfig(localConfig);
    showToast("Tetapan sistem berjaya disimpan secara lokal!");
  };

  return (
    <div className="p-8 space-y-8 fade-in pb-20">
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-white font-montserrat flex items-center gap-3">
          <span>⚙️</span> Tetapan Admin
        </h2>
        <p className="text-gray-400 mt-1">Konfigurasi kebenaran modul dan pangkalan data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Permissions Card */}
        <div className="bg-[#1C2541] p-6 rounded-xl border-t-4 border-[#C9B458] shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Kebenaran Modul</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(localPermissions).map((key) => (
              <label key={key} className="flex items-center space-x-3 p-3 rounded-lg bg-[#0B132B] hover:bg-[#253252] cursor-pointer transition-colors border border-gray-700">
                <input
                  type="checkbox"
                  checked={localPermissions[key as keyof Permissions]}
                  onChange={() => handleToggle(key as keyof Permissions)}
                  className="w-5 h-5 accent-[#C9B458] rounded focus:ring-offset-0"
                />
                <span className="text-gray-200 capitalize font-medium">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* System Info & Cloud Sync */}
        <div className="space-y-8">
            <div className="bg-[#1C2541] p-6 rounded-xl border-t-4 border-[#3A506B] shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6">Maklumat Sistem</h3>
            <div className="space-y-4">
                <div>
                <label className="block text-sm text-[#C9B458] mb-1">Tajuk Sistem</label>
                <input 
                    type="text" 
                    value={localConfig.systemTitle}
                    onChange={(e) => setLocalConfig({...localConfig, systemTitle: e.target.value})}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded px-3 py-2 text-white focus:border-[#C9B458] outline-none"
                />
                </div>
                <div>
                <label className="block text-sm text-[#C9B458] mb-1">Nama Sekolah</label>
                <input 
                    type="text" 
                    value={localConfig.schoolName}
                    onChange={(e) => setLocalConfig({...localConfig, schoolName: e.target.value})}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded px-3 py-2 text-white focus:border-[#C9B458] outline-none"
                />
                </div>
                <div>
                <label className="block text-sm text-[#C9B458] mb-1">Mesej Alu-aluan</label>
                <input 
                    type="text" 
                    value={localConfig.welcomeMessage}
                    onChange={(e) => setLocalConfig({...localConfig, welcomeMessage: e.target.value})}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded px-3 py-2 text-white focus:border-[#C9B458] outline-none"
                />
                </div>
            </div>
            </div>

            {/* Google Integration */}
            <div className="bg-[#1C2541] p-6 rounded-xl border-t-4 border-green-600 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-green-500">☁️</span> Integrasi Google Sheet
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                    Hubungkan sistem ini dengan Google Apps Script untuk menyimpan data secara kekal.
                </p>
                <div className="mb-4">
                    <label className="block text-sm text-[#C9B458] mb-1">URL Google Apps Script (Web App)</label>
                    <input 
                        type="text" 
                        value={localConfig.googleScriptUrl || ''}
                        onChange={(e) => setLocalConfig({...localConfig, googleScriptUrl: e.target.value})}
                        className="w-full bg-[#0B132B] border border-gray-600 rounded px-3 py-2 text-white text-xs font-mono focus:border-green-500 outline-none"
                        placeholder="https://script.google.com/macros/s/..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={saveToCloud}
                        disabled={isSyncing}
                        className={`py-2 px-4 rounded font-bold text-sm flex items-center justify-center gap-2
                            ${isSyncing ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 text-white'}
                        `}
                    >
                        {isSyncing ? 'Sedang Proses...' : '📤 Simpan ke Cloud'}
                    </button>
                    <button 
                        onClick={loadFromCloud}
                        disabled={isSyncing}
                        className={`py-2 px-4 rounded font-bold text-sm flex items-center justify-center gap-2
                            ${isSyncing ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600 text-white'}
                        `}
                    >
                        {isSyncing ? 'Sedang Proses...' : '📥 Muat Turun Data'}
                    </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 italic text-center">
                    * Pastikan anda telah 'Deploy' script sebagai Web App dengan akses 'Anyone'.
                </p>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-700 mt-8">
        <button
          onClick={saveSettings}
          className="bg-[#C9B458] text-[#0B132B] px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 shadow-lg transform hover:-translate-y-1 transition-all"
        >
          Simpan Tetapan Lokal
        </button>
      </div>
    </div>
  );
};