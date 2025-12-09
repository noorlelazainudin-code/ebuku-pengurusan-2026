import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Announcement, Program } from '../types';

export const Dashboard: React.FC = () => {
  const { user, permissions, announcements, programs, siteConfig, updateSiteConfig, addAnnouncement, addProgram } = useApp();
  
  // Element SDK Simulation: Editing Title
  const [isEditing, setIsEditing] = useState(false);
  const [tempWelcome, setTempWelcome] = useState(siteConfig.welcomeMessage);

  // Modal States
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);

  // Form States
  const [announceForm, setAnnounceForm] = useState({ title: '', date: '', summary: '' });
  const [programForm, setProgramForm] = useState({ 
      title: '', date: '', category: '', description: '', time: '', location: '', image1: '', image2: '' 
  });

  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  const saveEdit = () => {
    updateSiteConfig({ welcomeMessage: tempWelcome });
    setIsEditing(false);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Date.now();
    addAnnouncement({
      id: newId,
      title: announceForm.title,
      date: announceForm.date,
      summary: announceForm.summary,
      views: 0,
      likes: 0
    });
    setShowAnnounceModal(false);
    setAnnounceForm({ title: '', date: '', summary: '' });
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Date.now();
    addProgram({
      id: newId,
      title: programForm.title,
      date: programForm.date,
      time: programForm.time,
      location: programForm.location,
      category: programForm.category,
      description: programForm.description,
      image1: programForm.image1,
      image2: programForm.image2
    });
    setShowProgramModal(false);
    setProgramForm({ title: '', date: '', category: '', description: '', time: '', location: '', image1: '', image2: '' });
  };

  // Date helper
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  };

  const handleDateChange = (value: string, type: 'announce' | 'program') => {
      const parts = value.split('-');
      const formatted = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
      
      if (type === 'announce') {
          setAnnounceForm({...announceForm, date: formatted});
      } else {
          setProgramForm({...programForm, date: formatted});
      }
  };

  return (
    <div className="p-8 space-y-8 fade-in pb-20 relative">
      {/* Welcome Section */}
      <div className="flex justify-between items-end border-b border-gray-700 pb-4">
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <input 
                value={tempWelcome} 
                onChange={(e) => setTempWelcome(e.target.value)}
                className="bg-[#1C2541] border border-[#C9B458] text-white px-2 py-1 rounded"
              />
              <button onClick={saveEdit} className="text-green-400 text-sm">Simpan</button>
            </div>
          ) : (
            <h2 className="text-3xl font-bold text-white font-montserrat">
              {siteConfig.welcomeMessage}
              {user?.role === 'adminsistem' && (
                <button onClick={() => setIsEditing(true)} className="ml-3 text-xs text-gray-500 hover:text-[#C9B458]">
                  (Edit)
                </button>
              )}
            </h2>
          )}
          <p className="text-gray-400 mt-1">Paparan ringkas aktiviti dan status terkini sekolah.</p>
        </div>
        <div className="text-[#C9B458] text-sm font-semibold">
          Sesi Persekolahan 2026
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Jumlah Guru', value: '45', icon: '👨‍🏫', sub: 'Aktif: 42' },
          { label: 'Jumlah Murid', value: '850', icon: '👨‍🎓', sub: 'L: 420 | P: 430' },
          { label: 'Program Aktif', value: '12', icon: '🎯', sub: 'Bulan ini' },
          { label: 'Notis Baru', value: '8', icon: '📢', sub: 'Belum dibaca' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#1C2541] p-6 rounded-xl shadow-lg border-l-4 border-[#C9B458] hover:translate-y-[-5px] transition-transform duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-[#C9B458] transition-colors">{stat.value}</h3>
              </div>
              <span className="text-3xl bg-[#0B132B] p-2 rounded-lg">{stat.icon}</span>
            </div>
            <p className="text-xs text-gray-500 mt-4">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Announcements */}
        {permissions.pengumuman && (
          <div className="lg:col-span-2 bg-[#1C2541] rounded-xl shadow-lg overflow-hidden border border-gray-800">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-[#1C2541]">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>📢</span> Pengumuman Terkini
              </h3>
              {isAdmin && (
                <button 
                  onClick={() => setShowAnnounceModal(true)}
                  className="text-xs bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded-full font-bold hover:bg-yellow-400 transition-colors"
                >
                  + Tambah
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              {announcements.map((item) => (
                <div key={item.id} className="bg-[#0B132B] p-4 rounded-lg border border-gray-700 hover:border-[#C9B458] transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white group-hover:text-[#C9B458] transition-colors">{item.title}</h4>
                    <span className="text-xs bg-[#3A506B] text-white px-2 py-1 rounded">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{item.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1 hover:text-[#C9B458] cursor-pointer">
                      👁️ {item.views}
                    </span>
                    <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer">
                      ❤️ {item.likes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Programs */}
        {permissions.program && (
          <div className="bg-[#1C2541] rounded-xl shadow-lg overflow-hidden border border-gray-800">
             <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>🎯</span> Program Akan Datang
              </h3>
              {isAdmin && (
                <button 
                  onClick={() => setShowProgramModal(true)}
                  className="text-xs border border-[#C9B458] text-[#C9B458] px-3 py-1 rounded-full hover:bg-[#C9B458] hover:text-[#0B132B] transition-colors"
                >
                  +
                </button>
              )}
            </div>
            <div className="p-6 space-y-6">
              {programs.slice(0, 3).map((prog, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-gray-700 hover:border-[#C9B458] transition-colors">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0B132B] border-2 border-[#C9B458]"></div>
                  <span className="text-xs text-[#C9B458] font-mono mb-1 block">{prog.date}</span>
                  <h4 className="text-sm font-bold text-white">{prog.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{prog.description}</p>
                  <span className="inline-block mt-2 text-[10px] bg-[#3A506B] px-2 py-0.5 rounded text-gray-200">
                    {prog.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- ADD ANNOUNCEMENT MODAL --- */}
      {showAnnounceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in">
             <div className="bg-[#1C2541] w-full max-w-md p-6 rounded-xl border border-[#C9B458] shadow-2xl">
                 <h3 className="text-lg font-bold text-white mb-4 font-montserrat">Tambah Pengumuman</h3>
                 <form onSubmit={handleAddAnnouncement} className="space-y-4">
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Tajuk</label>
                         <input required type="text" value={announceForm.title} onChange={e => setAnnounceForm({...announceForm, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" />
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Tarikh</label>
                         <input required type="date" value={formatDateForInput(announceForm.date)} onChange={e => handleDateChange(e.target.value, 'announce')} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] focus:border-[#C9B458] outline-none" />
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Ringkasan</label>
                         <textarea required value={announceForm.summary} onChange={e => setAnnounceForm({...announceForm, summary: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white h-24 focus:border-[#C9B458] outline-none" />
                     </div>
                     <div className="flex gap-2 pt-2">
                         <button type="button" onClick={() => setShowAnnounceModal(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">Batal</button>
                         <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] rounded-lg font-bold hover:bg-yellow-400">Simpan</button>
                     </div>
                 </form>
             </div>
          </div>
      )}

      {/* --- ADD PROGRAM MODAL (Quick Add) --- */}
      {showProgramModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in overflow-y-auto">
             <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl my-10">
                 <h3 className="text-lg font-bold text-white mb-4 font-montserrat">Tambah Program</h3>
                 <form onSubmit={handleAddProgram} className="space-y-4">
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Nama Program</label>
                         <input required type="text" value={programForm.title} onChange={e => setProgramForm({...programForm, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: Hari Sukan Negara" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Tarikh</label>
                            <input required type="date" value={formatDateForInput(programForm.date)} onChange={e => handleDateChange(e.target.value, 'program')} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] focus:border-[#C9B458] outline-none" />
                         </div>
                         <div>
                            <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Masa</label>
                            <input type="text" value={programForm.time} onChange={e => setProgramForm({...programForm, time: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: 8.00 Pagi" />
                         </div>
                     </div>
                     <div>
                        <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Tempat</label>
                        <input type="text" value={programForm.location} onChange={e => setProgramForm({...programForm, location: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: Dewan Besar" />
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Kategori</label>
                         <select required value={programForm.category} onChange={e => setProgramForm({...programForm, category: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none">
                             <option value="">Pilih Kategori</option>
                             <option value="Kurikulum">Kurikulum</option>
                             <option value="HEM">HEM</option>
                             <option value="Kokurikulum">Kokurikulum</option>
                             <option value="Sukan">Sukan</option>
                             <option value="Lain-lain">Lain-lain</option>
                         </select>
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Pautan Gambar 1 (URL)</label>
                         <input type="text" value={programForm.image1} onChange={e => setProgramForm({...programForm, image1: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="https://..." />
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Pautan Gambar 2 (URL)</label>
                         <input type="text" value={programForm.image2} onChange={e => setProgramForm({...programForm, image2: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="https://..." />
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Laporan / Penerangan</label>
                         <textarea required value={programForm.description} onChange={e => setProgramForm({...programForm, description: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white h-24 focus:border-[#C9B458] outline-none" placeholder="Masukkan laporan ringkas..." />
                     </div>
                     <div className="flex gap-2 pt-2">
                         <button type="button" onClick={() => setShowProgramModal(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">Batal</button>
                         <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] rounded-lg font-bold hover:bg-yellow-400">Simpan</button>
                     </div>
                 </form>
             </div>
          </div>
      )}
    </div>
  );
};