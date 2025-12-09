import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface UnitContentProps {
  unit: string;
  type: string;
}

interface Committee {
  id: string;
  name: string;
}

export const UnitContent: React.FC<UnitContentProps> = ({ unit, type }) => {
  const { user, showToast } = useApp();
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  // --- State Management ---
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Committee Management State
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [activeCommitteeId, setActiveCommitteeId] = useState<string>('default');
  const [isAddCommitteeModalOpen, setIsAddCommitteeModalOpen] = useState(false);
  const [newCommitteeName, setNewCommitteeName] = useState('');

  // Description State for Jawatankuasa (Right Column)
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState('');

  // Takwim View State
  const [takwimView, setTakwimView] = useState<'list' | 'annual'>('list');

  // Form State
  const [formData, setFormData] = useState({
    // Jawatankuasa fields
    role: '',
    position: '',
    teacherName: '',
    // Takwim fields
    event: '',
    date: '',
    status: ''
  });

  // --- CONSTANTS FOR ANNUAL VIEW ---
  const months = ['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGO', 'SEP', 'OKT', 'NOV', 'DIS'];
  const daysLetters = ['I', 'S', 'R', 'K', 'J', 'S', 'A']; // Isnin...Ahad
  const year = 2026; // Fixed year for this session

  // --- Data Initialization & Persistence ---
  
  // 1. Load Committees (Only for Jawatankuasa type)
  useEffect(() => {
    if (type === 'Jawatankuasa') {
      const committeesKey = `smaam_committees_list_${unit}`;
      const savedCommittees = localStorage.getItem(committeesKey);
      
      if (savedCommittees) {
        const parsed = JSON.parse(savedCommittees);
        setCommittees(parsed);
        // Set active to first if available and current active is default/invalid
        if (parsed.length > 0 && activeCommitteeId === 'default') {
             setActiveCommitteeId(parsed[0].id);
        }
      } else {
        // Initialize Default Committee
        const defaultCommittees = [{ id: 'jk_induk', name: 'Jawatankuasa Induk' }];
        setCommittees(defaultCommittees);
        setActiveCommitteeId('jk_induk');
        localStorage.setItem(committeesKey, JSON.stringify(defaultCommittees));
      }
    }
  }, [unit, type]);

  // 2. Load Items & Descriptions when Active Committee Changes
  useEffect(() => {
    // Load Items
    const storageKey = `smaam_data_${unit}_${type}`;
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
      setItems(JSON.parse(storedData));
    } else {
      const initialData = getMockData();
      // Migration: Assign mock data to first committee if Jawatankuasa
      if (type === 'Jawatankuasa') {
          const mappedData = initialData.map((d: any) => ({ ...d, committeeId: 'jk_induk' }));
          setItems(mappedData);
          localStorage.setItem(storageKey, JSON.stringify(mappedData));
      } else {
          setItems(initialData);
          localStorage.setItem(storageKey, JSON.stringify(initialData));
      }
    }

    // Load Description (Specific to Committee)
    if (type === 'Jawatankuasa') {
      const descKey = `smaam_desc_${unit}_${activeCommitteeId}`;
      const storedDesc = localStorage.getItem(descKey);
      
      if (storedDesc) {
        setDescription(storedDesc);
      } else {
        // Default text generator based on Unit AND Committee
        if (activeCommitteeId === 'jk_induk') {
            let defaultDesc = '';
            if (unit === 'Pentadbiran') defaultDesc = 'Bertanggungjawab merancang, mengurus dan memantau perjalanan pentadbiran sekolah secara efisien dan efektif selaras dengan visi dan misi sekolah.';
            else if (unit === 'Kurikulum') defaultDesc = 'Merancang dan melaksanakan program kecemerlangan akademik serta memastikan P&P berjalan lancar mengikut sukatan pelajaran kebangsaan.';
            else if (unit === 'Hal Ehwal Murid') defaultDesc = 'Menguruskan disiplin, kebajikan, dan sahsiah pelajar bagi melahirkan modal insan yang seimbang dari segi jasmani, emosi, rohani dan intelek.';
            else if (unit === 'Kokurikulum') defaultDesc = 'Menyelaras aktiviti kelab, persatuan, dan sukan bagi memupuk semangat kerjasama, kepimpinan dan kesihatan fizikal murid.';
            setDescription(defaultDesc);
        } else {
            setDescription('');
        }
      }
    }
  }, [unit, type, activeCommitteeId]);

  const saveToStorage = (newItems: any[]) => {
    const storageKey = `smaam_data_${unit}_${type}`;
    localStorage.setItem(storageKey, JSON.stringify(newItems));
    setItems(newItems);
  };

  const saveDescription = () => {
    const descKey = `smaam_desc_${unit}_${activeCommitteeId}`;
    setDescription(tempDesc);
    localStorage.setItem(descKey, tempDesc);
    setIsEditingDesc(false);
    showToast("Maklumat fungsi dikemaskini.");
  };

  const saveCommitteesList = (newList: Committee[]) => {
    const committeesKey = `smaam_committees_list_${unit}`;
    localStorage.setItem(committeesKey, JSON.stringify(newList));
    setCommittees(newList);
  };

  // --- Committee Management Handlers ---
  const handleAddCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitteeName.trim()) return;

    const newId = `jk_${Date.now()}`;
    const newCommittee = { id: newId, name: newCommitteeName };
    const updatedList = [...committees, newCommittee];
    
    saveCommitteesList(updatedList);
    setActiveCommitteeId(newId);
    setNewCommitteeName('');
    setIsAddCommitteeModalOpen(false);
    showToast(`Jawatankuasa "${newCommitteeName}" berjaya ditambah.`);
  };

  const handleDeleteCommittee = (id: string, name: string) => {
      if (committees.length <= 1) {
          alert("Anda tidak boleh memadam jawatankuasa terakhir.");
          return;
      }
      if (window.confirm(`Adakah anda pasti ingin memadam "${name}"? Semua data ahli berkaitan akan turut dipadam.`)) {
          const updatedList = committees.filter(c => c.id !== id);
          saveCommitteesList(updatedList);

          const updatedItems = items.filter(item => item.committeeId !== id);
          saveToStorage(updatedItems);

          localStorage.removeItem(`smaam_desc_${unit}_${id}`);

          setActiveCommitteeId(updatedList[0].id);
          showToast(`Jawatankuasa "${name}" telah dipadam.`);
      }
  }

  const getMockData = () => {
    if (type === 'Jawatankuasa') {
      return [
        { id: 1, role: 'Pengerusi', position: 'Pengetua', teacherName: 'TN HJ MOHD NAZRI BIN SADALI' },
        { id: 2, role: 'Timbalan Pengerusi', position: 'GPK Pentadbiran', teacherName: 'EN AHMAD BIN ABDULLAH' },
        { id: 3, role: 'Naib Pengerusi 1', position: 'GPK HEM', teacherName: 'PN SITI AMINAH BINTI ALI' },
        { id: 4, role: 'Naib Pengerusi 2', position: 'GPK Kokurikulum', teacherName: 'EN RAZALI BIN OTHMAN' },
        { id: 5, role: 'Setiausaha', position: 'Guru Kanan', teacherName: 'PN NURUL HUDA BINTI ISMAIL' },
      ];
    } else {
      return [
        { id: 1, event: `Mesyuarat ${unit} Bil 1/2026`, date: '15-01-2026', status: 'Selesai' },
        { id: 2, event: 'Bengkel Pemantapan', date: '22-02-2026', status: 'Dalam Perancangan' },
        { id: 3, event: 'Semakan Fail', date: '10-03-2026', status: 'Akan Datang' },
      ];
    }
  };

  // --- Date Helpers ---
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value; // YYYY-MM-DD
    if (rawValue) {
        const parts = rawValue.split('-');
        const formatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
        setFormData({ ...formData, date: formatted });
    } else {
        setFormData({ ...formData, date: '' });
    }
  };

  const getDayLetter = (monthIdx: number, day: number) => {
      const d = new Date(year, monthIdx, day);
      if (d.getMonth() !== monthIdx) return null; // Invalid date (e.g. Feb 30)
      
      const dayIndex = d.getDay(); // 0 (Sun) to 6 (Sat)
      // Map to 0 (Mon) to 6 (Sun) for array index
      const mappedIndex = (dayIndex + 6) % 7;
      return daysLetters[mappedIndex];
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Selesai': return 'bg-green-600 text-white';
          case 'Dalam Perancangan': return 'bg-blue-600 text-white';
          case 'Akan Datang': return 'bg-[#C9B458] text-[#0B132B]';
          default: return 'bg-gray-600 text-gray-200';
      }
  };

  // --- Handlers ---
  const handleOpenModal = (item?: any) => {
    if (item && item.id) {
      // Edit existing
      setEditingId(item.id);
      setFormData({
        role: item.role || '',
        position: item.position || '',
        teacherName: item.teacherName || '',
        event: item.event || '',
        date: item.date || '',
        status: item.status || 'Akan Datang'
      });
    } else {
      // Add new (potentially with defaults like date)
      setEditingId(null);
      setFormData({
        role: '', position: '', teacherName: '',
        event: '', 
        status: 'Akan Datang',
        date: item?.date || '' // Allow pre-filling date
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Adakah anda pasti ingin memadam rekod ini?")) {
      const newItems = items.filter(item => item.id !== id);
      saveToStorage(newItems);
      showToast("Rekod berjaya dipadam.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newItem: any;
    if (type === 'Jawatankuasa') {
      newItem = {
        role: formData.role,
        position: formData.position,
        teacherName: formData.teacherName,
        committeeId: activeCommitteeId 
      };
    } else {
      newItem = {
        event: formData.event,
        date: formData.date,
        status: formData.status
      };
    }

    if (editingId) {
      const updatedItems = items.map(item => 
        item.id === editingId ? { ...item, ...newItem } : item
      );
      saveToStorage(updatedItems);
      showToast("Rekod berjaya dikemaskini.");
    } else {
      newItem.id = Date.now();
      saveToStorage([...items, newItem]);
      showToast("Rekod baru berjaya ditambah.");
    }
    
    setIsModalOpen(false);
  };

  const handleDownloadPDF = () => {
    showToast("Memuat turun PDF...");
  };

  // Filter items based on active view
  const filteredItems = type === 'Jawatankuasa' 
    ? items.filter(item => item.committeeId === activeCommitteeId || (!item.committeeId && activeCommitteeId === 'jk_induk'))
    : items;

  return (
    <div className="p-4 md:p-8 space-y-6 fade-in pb-20 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-700 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#C9B458] font-mono mb-1">
             <span>{unit.toUpperCase()}</span>
             <span>/</span>
             <span>{type.toUpperCase()}</span>
          </div>
          <h2 className="text-3xl font-bold text-white font-montserrat">
            Pengurusan {type}
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            {type === 'Jawatankuasa' 
              ? `Senarai ahli jawatankuasa bagi unit ${unit}.`
              : `Kalendar dan jadual aktiviti bagi unit ${unit}.`
            }
          </p>
        </div>

        {/* Global Actions */}
        {isAdmin && (
          <div className="flex gap-3">
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-[#1C2541] border border-[#C9B458] text-[#C9B458] px-4 py-2 rounded-lg font-semibold hover:bg-[#253252] transition-colors shadow-lg"
            >
              📥 <span className="hidden sm:inline">Muat Turun PDF</span>
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-900/20"
            >
              ➕ <span className="hidden sm:inline">
                  {type === 'Jawatankuasa' ? 'Tambah Ahli' : 'Tambah Aktiviti'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* --- Committee Tabs (Only for Jawatankuasa) --- */}
      {type === 'Jawatankuasa' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {committees.map(committee => (
                <div key={committee.id} className="relative group">
                    <button
                        onClick={() => setActiveCommitteeId(committee.id)}
                        className={`px-5 py-2 rounded-t-lg font-medium text-sm transition-all whitespace-nowrap border-b-2
                            ${activeCommitteeId === committee.id 
                                ? 'bg-[#1C2541] text-[#C9B458] border-[#C9B458]' 
                                : 'bg-[#0B132B] text-gray-400 border-transparent hover:text-gray-200 hover:bg-[#1C2541]'
                            }`}
                    >
                        {committee.name}
                    </button>
                    {isAdmin && committees.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteCommittee(committee.id, committee.name); }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Hapus Jawatankuasa"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
            
            {isAdmin && (
                <button
                    onClick={() => setIsAddCommitteeModalOpen(true)}
                    className="px-3 py-2 rounded-lg bg-[#3A506B]/50 text-[#C9B458] hover:bg-[#3A506B] transition-colors text-sm font-bold flex items-center gap-1"
                    title="Tambah Jawatankuasa Baru"
                >
                    <span>+</span> Baru
                </button>
            )}
        </div>
      )}

      {/* --- Takwim View Toggles --- */}
      {type === 'Takwim' && (
        <div className="flex gap-2">
            <button
                onClick={() => setTakwimView('list')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${takwimView === 'list' 
                    ? 'bg-[#3A506B] text-white shadow-md' 
                    : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}
            >
                📋 Senarai
            </button>
             <button
                onClick={() => setTakwimView('annual')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${takwimView === 'annual' 
                    ? 'bg-[#3A506B] text-white shadow-md' 
                    : 'bg-[#1C2541] text-gray-400 hover:text-white'}`}
            >
                🗓️ Paparan Tahunan
            </button>
        </div>
      )}

      {/* Content Layout - Grid for Jawatankuasa, Full Width for Takwim */}
      <div className={`grid grid-cols-1 ${type === 'Jawatankuasa' ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        
        {/* LEFT COLUMN: Data Table (Or Annual View for Takwim) */}
        <div className={`${type === 'Jawatankuasa' ? 'lg:col-span-2' : ''}`}>
          
          {/* View Logic for Takwim */}
          {type === 'Takwim' && takwimView === 'annual' ? (
              <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col">
                  <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex items-center justify-between">
                     <h3 className="text-lg font-bold text-[#C9B458] font-montserrat uppercase">
                       PERANCANGAN TAHUNAN: {unit} ({year})
                     </h3>
                  </div>
                  
                  {/* Scroll Container for Mobile Responsiveness */}
                  <div className="overflow-x-auto w-full custom-scrollbar">
                      <table className="w-full min-w-[1000px] border-collapse text-xs border border-gray-800">
                          {/* Header Row: HB + Months */}
                          <thead>
                              <tr>
                                  <th className="bg-[#C9B458] text-[#0B132B] p-2 font-bold w-12 border border-[#0B132B] sticky left-0 z-20">HB</th>
                                  {months.map(m => (
                                      <th key={m} className="bg-[#C9B458] text-[#0B132B] p-2 font-bold border border-[#0B132B] min-w-[80px]">
                                          {m}
                                      </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                                  <tr key={date}>
                                      {/* Date Number Column */}
                                      <td className="bg-[#0B132B] text-[#C9B458] font-bold text-center border border-gray-700 sticky left-0 z-10 p-1">
                                          {date}
                                      </td>

                                      {/* Month Cells */}
                                      {months.map((_, monthIdx) => {
                                          const dayLetter = getDayLetter(monthIdx, date);
                                          
                                          // Invalid Date (e.g. Feb 30)
                                          if (!dayLetter) {
                                              return <td key={monthIdx} className="bg-black/40 border border-gray-800"></td>;
                                          }

                                          const dateStr = `${(date).toString().padStart(2, '0')}-${(monthIdx + 1).toString().padStart(2, '0')}-${year}`;
                                          // Look for event matching this date
                                          const event = items.find(item => item.date === dateStr);

                                          return (
                                              <td 
                                                key={monthIdx} 
                                                className={`bg-[#1C2541] border border-gray-700 relative h-12 p-1 align-middle hover:bg-[#253252] transition-colors ${isAdmin ? 'cursor-pointer' : ''}`}
                                                onClick={() => {
                                                   if (isAdmin) {
                                                      if (event) handleOpenModal(event);
                                                      else handleOpenModal({ date: dateStr });
                                                   }
                                                }}
                                              >
                                                  {/* Day Letter */}
                                                  <span className="absolute top-0.5 right-1 text-[8px] text-gray-500 font-mono">
                                                      {dayLetter}
                                                  </span>

                                                  {/* Event Bar */}
                                                  {event ? (
                                                      <div className={`w-full h-full rounded flex items-center justify-center text-[9px] font-bold text-center leading-tight px-1 shadow-sm ${getStatusColor(event.status)}`} title={event.event}>
                                                          {event.event.length > 15 ? event.event.substring(0, 15) + '...' : event.event}
                                                      </div>
                                                  ) : null}
                                              </td>
                                          );
                                      })}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <div className="p-3 bg-[#0B132B] text-xs text-gray-500 italic border-t border-gray-700">
                     * Klik pada petak tarikh untuk tambah atau edit aktiviti (Admin sahaja).
                  </div>
              </div>
          ) : (
            // LIST VIEW (Default Table)
            <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#0B132B] text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                      {type === 'Jawatankuasa' ? (
                        <>
                          <th className="px-6 py-4 font-semibold text-[#C9B458]">PERANAN</th>
                          <th className="px-6 py-4 font-semibold text-[#C9B458]">JAWATAN</th>
                          <th className="px-6 py-4 font-semibold text-[#C9B458]">NAMA GURU</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-4 font-semibold">Nama Program / Aktiviti</th>
                          <th className="px-6 py-4 font-semibold">Tarikh Pelaksanaan</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                        </>
                      )}
                      {isAdmin && <th className="px-6 py-4 font-semibold text-right">Tindakan</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 text-sm">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item: any) => (
                        <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                          {type === 'Jawatankuasa' ? (
                            <>
                              <td className="px-6 py-4 font-medium text-white">{item.role}</td>
                              <td className="px-6 py-4 text-gray-300">{item.position}</td>
                              <td className="px-6 py-4 font-semibold text-[#C9B458] uppercase">{item.teacherName}</td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 font-medium text-white">{item.event}</td>
                              <td className="px-6 py-4 text-gray-300">{item.date}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold
                                  ${item.status === 'Selesai' ? 'bg-green-900/50 text-green-400' : 
                                    item.status === 'Dalam Perancangan' ? 'bg-blue-900/50 text-blue-400' :
                                    'bg-yellow-900/30 text-yellow-500'}
                                `}>
                                  {item.status}
                                </span>
                              </td>
                            </>
                          )}

                          {isAdmin && (
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleOpenModal(item)}
                                  className="p-2 bg-[#3A506B] hover:bg-blue-600 text-white rounded transition-colors"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button 
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 bg-red-900/50 hover:bg-red-600 border border-red-900 text-red-200 rounded transition-colors"
                                  title="Hapus"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={isAdmin ? 4 : 3} className="px-6 py-8 text-center text-gray-500">
                          Tiada rekod dijumpai. Klik "Tambah" untuk mulakan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Footer Info */}
              <div className="p-4 bg-[#0B132B] border-t border-gray-700 text-xs text-gray-500 flex justify-between">
                <span>Menunjukkan {filteredItems.length} rekod</span>
                <span>Data disimpan secara automatik</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Functions & Info (Only for Jawatankuasa) */}
        {type === 'Jawatankuasa' && (
           <div className="lg:col-span-1">
              <div className="bg-[#1C2541] rounded-xl shadow-xl border border-gray-800 p-6 sticky top-24">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
                     <div>
                        <h3 className="font-bold text-white text-lg font-montserrat">Fungsi & Tanggungjawab</h3>
                        <p className="text-xs text-[#C9B458] mt-1 italic">
                            {committees.find(c => c.id === activeCommitteeId)?.name || 'Jawatankuasa'}
                        </p>
                     </div>
                     {isAdmin && (
                        <button 
                          onClick={() => { 
                            if (!isEditingDesc) setTempDesc(description); 
                            setIsEditingDesc(!isEditingDesc); 
                          }} 
                          className="text-xs text-[#C9B458] hover:text-white transition-colors"
                        >
                           {isEditingDesc ? 'Batal' : 'Edit'}
                        </button>
                     )}
                  </div>
                  
                  <div className="min-h-[200px]">
                    {isEditingDesc ? (
                       <div className="space-y-4 fade-in">
                          <textarea 
                             value={tempDesc}
                             onChange={(e) => setTempDesc(e.target.value)}
                             className="w-full bg-[#0B132B] border border-[#C9B458] rounded-lg p-3 text-sm text-white h-48 focus:outline-none focus:ring-1 focus:ring-[#C9B458]"
                             placeholder={`Masukkan fungsi untuk ${committees.find(c => c.id === activeCommitteeId)?.name}...`}
                          />
                          <button 
                            onClick={saveDescription} 
                            className="w-full bg-[#C9B458] text-[#0B132B] py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors"
                          >
                             Simpan Maklumat
                          </button>
                       </div>
                    ) : (
                       <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line text-justify font-light">
                          {description || "Tiada maklumat fungsi ditetapkan untuk jawatankuasa ini."}
                       </p>
                    )}
                  </div>

                  {/* Dashboard Stats / Looker Studio Style Elements */}
                  <div className="mt-8 pt-6 border-t border-gray-700 grid grid-cols-2 gap-4">
                     <div className="text-center p-3 bg-[#0B132B] rounded-xl border border-gray-700">
                        <span className="block text-2xl font-bold text-[#C9B458]">{filteredItems.length}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Jumlah Ahli</span>
                     </div>
                      <div className="text-center p-3 bg-[#0B132B] rounded-xl border border-gray-700">
                        <span className="block text-2xl font-bold text-[#3A506B]">Aktif</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Status Unit</span>
                     </div>
                  </div>
              </div>
           </div>
        )}

      </div>

      {/* --- ADD / EDIT MEMBER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
          <div className="bg-[#1C2541] w-full max-w-lg p-8 rounded-xl shadow-2xl border border-[#C9B458]">
            <h3 className="text-xl font-bold text-white mb-6 font-montserrat border-b border-gray-700 pb-4">
              {editingId ? 'Kemaskini Rekod' : 'Tambah Rekod Baru'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-5">
              
              {type === 'Jawatankuasa' ? (
                <>
                  <div className="bg-[#0B132B] p-3 rounded border border-gray-700 mb-4 text-sm text-gray-400">
                    Menambah ahli ke: <span className="text-[#C9B458] font-bold">{committees.find(c => c.id === activeCommitteeId)?.name}</span>
                  </div>

                  {/* Jawatankuasa Form */}
                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Peranan</label>
                    <input 
                      required
                      type="text" 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all placeholder-gray-600"
                      placeholder="Contoh: Pengerusi, Setiausaha"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Jawatan Hakiki</label>
                    <input 
                      required
                      type="text" 
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all placeholder-gray-600"
                      placeholder="Contoh: Pengetua, GPK HEM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Guru</label>
                    <input 
                      required
                      type="text" 
                      value={formData.teacherName}
                      onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                      className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all placeholder-gray-600"
                      placeholder="Nama penuh guru"
                    />
                  </div>
                </>
              ) : (
                <>
                   {/* Takwim Form */}
                   <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Program / Aktiviti</label>
                    <input 
                      required
                      type="text" 
                      value={formData.event}
                      onChange={(e) => setFormData({...formData, event: e.target.value})}
                      className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all placeholder-gray-600"
                      placeholder="Masukkan nama program"
                    />
                  </div>
                  
                  {/* Date Input with Calendar Icon */}
                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Tarikh</label>
                    <div className="relative group">
                      <input 
                        required
                        type="date" 
                        value={formatDateForInput(formData.date)}
                        onChange={handleDateChange}
                        className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all shadow-sm
                        [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Status</label>
                    <div className="relative">
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] focus:ring-1 focus:ring-[#C9B458] outline-none transition-all appearance-none"
                      >
                        <option value="Akan Datang">Akan Datang</option>
                        <option value="Dalam Perancangan">Dalam Perancangan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#C9B458] text-[#0B132B] px-4 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-900/20 transform hover:-translate-y-0.5"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Rekod'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD COMMITTEE MODAL --- */}
      {isAddCommitteeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
          <div className="bg-[#1C2541] w-full max-w-sm p-6 rounded-xl shadow-2xl border border-[#C9B458]">
            <h3 className="text-lg font-bold text-white mb-4">Tambah Jawatankuasa</h3>
            <form onSubmit={handleAddCommittee}>
                <label className="block text-xs text-[#C9B458] mb-2 uppercase tracking-wider font-semibold">Nama Jawatankuasa</label>
                <input 
                    autoFocus
                    required
                    type="text" 
                    value={newCommitteeName}
                    onChange={(e) => setNewCommitteeName(e.target.value)}
                    className="w-full bg-[#0B132B] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[#C9B458] mb-4"
                    placeholder="Contoh: JK Kewangan"
                />
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsAddCommitteeModalOpen(false)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-[#C9B458] text-[#0B132B] px-3 py-2 rounded-lg font-bold hover:bg-yellow-500"
                    >
                        Tambah
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};