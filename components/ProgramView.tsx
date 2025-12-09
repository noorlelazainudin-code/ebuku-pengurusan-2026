import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Program } from '../types';

export const ProgramView: React.FC = () => {
  const { programs, user, addProgram, updateProgram, deleteProgram, showToast } = useApp();
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';
  
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Program>>({});

  // --- Handlers ---

  const openReadMore = (prog: Program) => {
    setSelectedProgram(prog);
  };

  const closeReadMore = () => {
    setSelectedProgram(null);
  };

  const handleDownloadPDF = () => {
    showToast("Sedang memuat turun laporan PDF...");
    // Simulation of PDF generation logic
    setTimeout(() => {
      showToast("Laporan berjaya dimuat turun!");
    }, 1500);
  };

  const handleOpenEdit = (prog?: Program) => {
    if (prog) {
        setFormData(prog);
    } else {
        setFormData({
            title: '', date: '', time: '', location: '', category: 'Lain-lain', description: '', image1: '', image2: ''
        });
    }
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
      if(window.confirm("Adakah anda pasti ingin memadam program ini?")) {
          deleteProgram(id);
      }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format date if needed
    let dateToSave = formData.date || '';
    if (dateToSave.includes('-') && dateToSave.split('-')[0].length === 4) {
        // Convert YYYY-MM-DD to DD-MM-YYYY
        const p = dateToSave.split('-');
        dateToSave = `${p[2]}-${p[1]}-${p[0]}`;
    }

    const payload: Program = {
        id: formData.id || Date.now(),
        title: formData.title || 'Tanpa Tajuk',
        date: dateToSave,
        time: formData.time,
        location: formData.location,
        category: formData.category || 'Lain-lain',
        description: formData.description || '',
        image1: formData.image1,
        image2: formData.image2
    };

    if (formData.id) {
        updateProgram(payload);
    } else {
        addProgram(payload);
    }
    setIsEditModalOpen(false);
  };

  // Helper for date input
  const formatDateForInput = (dateStr: string | undefined) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY to YYYY-MM-DD
      return dateStr;
  };

  return (
    <div className="p-8 space-y-8 fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-700 pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white font-montserrat flex items-center gap-3">
            <span>🎯</span> Program & Berita Sekolah
          </h2>
          <p className="text-gray-400 mt-1">Laporan aktiviti terkini dan program akan datang.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => handleOpenEdit()}
            className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg"
          >
            + Tambah Program
          </button>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-[#1C2541] rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-[#C9B458] transition-all group flex flex-col h-full">
            {/* Image Thumbnail */}
            <div className="h-48 bg-[#0B132B] relative overflow-hidden">
              {prog.image1 ? (
                <img src={prog.image1} alt={prog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 text-4xl">
                   📷
                </div>
              )}
              <div className="absolute top-2 right-2 bg-[#0B132B]/80 text-[#C9B458] px-3 py-1 rounded-full text-xs font-bold border border-[#C9B458] backdrop-blur-sm">
                {prog.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                 <span>📅 {prog.date}</span>
                 {prog.time && <span>• ⏰ {prog.time}</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{prog.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                {prog.description}
              </p>
              
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                  <button 
                    onClick={() => openReadMore(prog)}
                    className="text-[#C9B458] text-sm font-semibold hover:text-white transition-colors flex items-center gap-1"
                  >
                    Baca Laporan <span>→</span>
                  </button>
                  
                  {isAdmin && (
                      <div className="flex gap-2">
                          <button onClick={() => handleOpenEdit(prog)} className="text-blue-400 hover:text-blue-300" title="Edit">✏️</button>
                          <button onClick={() => handleDelete(prog.id)} className="text-red-400 hover:text-red-300" title="Hapus">🗑️</button>
                      </div>
                  )}
              </div>
            </div>
          </div>
        ))}

        {programs.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500 bg-[#1C2541]/50 rounded-xl border border-dashed border-gray-700">
                <p>Tiada program untuk dipaparkan.</p>
            </div>
        )}
      </div>

      {/* --- READ MORE / REPORT MODAL --- */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md fade-in overflow-y-auto p-4">
          <div className="bg-[#1C2541] w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-700 overflow-hidden relative my-auto">
            
            {/* Close Button */}
            <button 
              onClick={closeReadMore}
              className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center z-10"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
               {/* Left: Images (Scrollable if needed) */}
               <div className="md:w-2/5 bg-[#0B132B] overflow-y-auto max-h-[40vh] md:max-h-full custom-scrollbar border-r border-gray-700">
                  {selectedProgram.image1 && (
                      <img src={selectedProgram.image1} alt="Gambar 1" className="w-full object-cover hover:opacity-90 transition-opacity" />
                  )}
                  {selectedProgram.image2 && (
                      <img src={selectedProgram.image2} alt="Gambar 2" className="w-full object-cover hover:opacity-90 transition-opacity border-t border-gray-800" />
                  )}
                  {!selectedProgram.image1 && !selectedProgram.image2 && (
                      <div className="h-full flex items-center justify-center text-gray-600">Tiada Gambar</div>
                  )}
               </div>

               {/* Right: Content */}
               <div className="md:w-3/5 p-8 overflow-y-auto max-h-[60vh] md:max-h-full custom-scrollbar bg-[#1C2541]">
                  <span className="inline-block bg-[#3A506B] text-white px-3 py-1 rounded text-xs font-bold mb-4">
                      {selectedProgram.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-4 font-montserrat leading-tight">
                      {selectedProgram.title}
                  </h2>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-[#C9B458] mb-6 font-mono border-b border-gray-700 pb-4">
                      <div className="flex items-center gap-2">
                          <span>🗓️</span> {selectedProgram.date}
                      </div>
                      {selectedProgram.time && (
                          <div className="flex items-center gap-2">
                              <span>⏰</span> {selectedProgram.time}
                          </div>
                      )}
                      {selectedProgram.location && (
                          <div className="flex items-center gap-2">
                              <span>📍</span> {selectedProgram.location}
                          </div>
                      )}
                  </div>

                  <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed mb-8 text-justify whitespace-pre-wrap">
                      {selectedProgram.description}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700 mt-auto">
                      <p className="text-xs text-gray-500">Disediakan oleh: Admin Sekolah</p>
                      <button 
                        onClick={handleDownloadPDF}
                        className="bg-[#C9B458] text-[#0B132B] px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg flex items-center gap-2"
                      >
                         <span>📄</span> Muat Turun PDF
                      </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT / ADD MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in overflow-y-auto">
             <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl my-10">
                 <h3 className="text-lg font-bold text-white mb-4 font-montserrat">{formData.id ? 'Kemaskini Program' : 'Tambah Program'}</h3>
                 <form onSubmit={handleSave} className="space-y-4">
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Nama Program</label>
                         <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="Tajuk Program" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Tarikh</label>
                            <input required type="date" value={formatDateForInput(formData.date)} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] focus:border-[#C9B458] outline-none" />
                         </div>
                         <div>
                            <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Masa</label>
                            <input type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: 8.00 Pagi" />
                         </div>
                     </div>
                     <div>
                        <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Tempat</label>
                        <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="Cth: Dewan Besar" />
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Kategori</label>
                         <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none">
                             <option value="Kurikulum">Kurikulum</option>
                             <option value="HEM">HEM</option>
                             <option value="Kokurikulum">Kokurikulum</option>
                             <option value="Sukan">Sukan</option>
                             <option value="Lain-lain">Lain-lain</option>
                         </select>
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Pautan Gambar 1 (URL)</label>
                         <input type="text" value={formData.image1} onChange={e => setFormData({...formData, image1: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="https://..." />
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Pautan Gambar 2 (URL)</label>
                         <input type="text" value={formData.image2} onChange={e => setFormData({...formData, image2: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#C9B458] outline-none" placeholder="https://..." />
                     </div>
                     <div>
                         <label className="text-xs text-[#C9B458] block mb-1 uppercase font-semibold">Laporan / Penerangan Lengkap</label>
                         <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded-lg px-3 py-2 text-white h-32 focus:border-[#C9B458] outline-none" placeholder="Masukkan laporan penuh..." />
                     </div>
                     <div className="flex gap-2 pt-2">
                         <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">Batal</button>
                         <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] rounded-lg font-bold hover:bg-yellow-400">Simpan</button>
                     </div>
                 </form>
             </div>
          </div>
      )}
    </div>
  );
};