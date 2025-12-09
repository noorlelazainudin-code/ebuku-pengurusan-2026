import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface JadualModuleProps {
  type: string;
}

// --- CONSTANTS ---

const TEACHER_LIST = [
  "Zulkeffle bin Muhammad",
  "Noratikah binti Abd. Kadir",
  "Shaharer bin Hj Husain",
  "Zulkifli bin Md Aspan",
  "Saemah binti Supandi",
  "Rosmawati @ Rohayati binti Hussin",
  "Nooraind binti Ali",
  "Zahrah Khairiah Nasution binti Saleh",
  "Mazuin binti Mat",
  "Ahmad Fikruddin bin Ahmad Raza'i",
  "Annur Ayuni binti Mohamed",
  "Liyana binti Iskandar",
  "Masyitah binti Razali",
  "Mohamad Nasreen Hakim bin Che Mohamed",
  "Mohamad Sukri bin Ali",
  "Mohammad Firros bin Rosool Gani",
  "Mohd Nor bin Salikin",
  "Mohd Nur bin Ahmad",
  "Muhammad Hafiz bin Jalil",
  "Nik Noorizati binti Ab Kahar",
  "Noorlela binti Zainudin",
  "Nor Ain binti Mohamed Jori",
  "Nor Azean binti Ismail",
  "Nor Hidayah binti Mahadun",
  "Norashidah binti A Wahab",
  "Norliyana binti Mhd. Amin",
  "Nurul Izzati binti Roslin",
  "Nurul Syafiqah binti Husin",
  "Nuurul Amira binti Razak",
  "Salman bin A Rahman",
  "Siti Aminah binti Mohamed",
  "Siti Nurul Liza binti Sidin",
  "Syahidatun Najihah binti Aziz",
  "Zarith Najiha binti Jamal"
];

const SUBJECTS_LOWER = [
  "BM", "BI", "SEJ", "MAT", "SCN", "GEO", "PSV", "RBT", "USL", "SYA", "LAM", "PJPK", "UN", "1M1S", "KELAB"
];

const SUBJECTS_UPPER = [
  "BM", "BI", "SEJ", "MAT", "SCN", "PNG", "USL", "SYA", "LAM", "MAA", "ADB", "PJPK", "UN", "1M1S", "KELAB"
];

const CLASS_CODES = [
  "1H", "1S", "1M",
  "2H", "2S", "2M",
  "3H", "3S", "3M",
  "4H", "4S",
  "5H", "5S"
];

const ALL_SUBJECTS = Array.from(new Set([...SUBJECTS_LOWER, ...SUBJECTS_UPPER])).sort();

// --- MOCK DATA INITIALIZERS ---

const initialGuruGanti = [
  { id: 1, date: '26-10-2026', time: '08:00 AM - 09:00 AM', class: '5 Al-Hanafi', subject: 'MAT', absent: 'Zulkeffle bin Muhammad', relief: 'Zulkifli bin Md Aspan', status: 'Ganti' },
  { id: 2, date: '26-10-2026', time: '10:30 AM - 11:30 AM', class: '3 Al-Syafie', subject: 'SEJ', absent: 'Siti Aminah binti Mohamed', relief: 'Noratikah binti Abd. Kadir', status: 'Ganti' },
  { id: 3, date: '26-10-2026', time: '12:00 PM - 01:00 PM', class: '4 Al-Hanafi', subject: 'PNG', absent: 'Mohd Nor bin Salikin', relief: 'Annur Ayuni binti Mohamed', status: 'Ganti' },
  { id: 4, date: '27-10-2026', time: '07:30 AM - 08:30 AM', class: '1 Al-Maliki', subject: 'SCN', absent: 'Masyitah binti Razali', relief: 'Mohamad Nasreen Hakim bin Che Mohamed', status: 'Relief' },
];

const initialFormCoordinators = [
  { id: 1, form: 'Penyelaras Tahfiz', name: 'Zulkeffle bin Muhammad' },
  { id: 2, form: 'Penyelaras Tingkatan 1', name: 'Saemah binti Supandi' },
  { id: 3, form: 'Penyelaras Tingkatan 2', name: 'Rosmawati @ Rohayati binti Hussin' },
  { id: 4, form: 'Penyelaras Tingkatan 3', name: 'Norliyana binti Mhd. Amin' },
  { id: 5, form: 'Penyelaras Tingkatan 4', name: 'Salman bin A Rahman' },
  { id: 6, form: 'Penyelaras Tingkatan 5', name: 'Shaharer bin Hj Husain' },
];

const initialClassTeachers = [
  // Tingkatan 1
  { id: 1, form: '1', class: '1 Al-Hanafi', teacher: 'Noratikah binti Abd. Kadir' },
  { id: 2, form: '1', class: '1 Al-Syafie', teacher: 'Liyana binti Iskandar' },
  { id: 3, form: '1', class: '1 Al-Maliki', teacher: 'Masyitah binti Razali' },
  // Tingkatan 2
  { id: 4, form: '2', class: '2 Al-Hanafi', teacher: 'Nooraind binti Ali' },
  { id: 5, form: '2', class: '2 Al-Syafie', teacher: 'Nik Noorizati binti Ab Kahar' },
  { id: 6, form: '2', class: '2 Al-Maliki', teacher: 'Nor Ain binti Mohamed Jori' },
  // Tingkatan 3
  { id: 7, form: '3', class: '3 Al-Hanafi', teacher: 'Zarith Najiha binti Jamal' },
  { id: 8, form: '3', class: '3 Al-Syafie', teacher: 'Nor Hidayah binti Mahadun' },
  { id: 9, form: '3', class: '3 Al-Maliki', teacher: 'Nurul Syafiqah binti Husin' },
  // Tingkatan 4
  { id: 10, form: '4', class: '4 Al-Hanafi', teacher: 'Mohd Nur bin Ahmad' },
  { id: 11, form: '4', class: '4 Al-Syafie', teacher: 'Siti Nurul Liza binti Sidin' },
  // Tingkatan 5
  { id: 12, form: '5', class: '5 Al-Hanafi', teacher: 'Mohamad Sukri bin Ali' },
  { id: 13, form: '5', class: '5 Al-Syafie', teacher: 'Siti Aminah binti Mohamed' },
];

const initialSpeechSchedule = [
  { id: 1, date: '26-10-2026', activity: 'Perhimpunan Rasmi', teacher: 'TN HJ MOHD NAZRI BIN SADALI', topic: 'Amanat Pengetua' },
  { id: 2, date: '30-10-2026', activity: 'Tazkirah Jumaat', teacher: 'Shaharer bin Hj Husain', topic: 'Adab Menuntut Ilmu' },
  { id: 3, date: '02-11-2026', activity: 'Perhimpunan Rasmi', teacher: 'EN AHMAD BIN ABDULLAH', topic: 'Disiplin & Sahsiah' },
];

// Generate Time Slots 7:30 to 16:00 (30 mins) in 12h format
const generateTimeSlots = () => {
  const slots = [];
  let current = 7.5; // 7:30
  const end = 16.0; // 16:00
  
  while (current < end) {
    const hour = Math.floor(current);
    const min = (current - hour) * 60;
    
    // Format to 12h
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    const timeLabel = `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
    
    slots.push(timeLabel);
    current += 0.5;
  }
  return slots;
};

const timeSlots = generateTimeSlots();
// Start with Isnin as requested
const days = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'];

export const JadualModule: React.FC<JadualModuleProps> = ({ type }) => {
  const { user, showToast } = useApp();
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  // --- STATE MANAGEMENT ---
  const [reliefList, setReliefList] = useState(initialGuruGanti);
  const [coordinators, setCoordinators] = useState(initialFormCoordinators);
  const [classTeachers, setClassTeachers] = useState(initialClassTeachers);
  const [speechList, setSpeechList] = useState(initialSpeechSchedule);
  
  // Schedule Overrides (Key: "Context-Day-Time", Value: { subject, code, color, teacher })
  // Context is either Teacher Name or Class Name
  const [scheduleData, setScheduleData] = useState<Record<string, any>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'relief' | 'coordinator' | 'classTeacher' | 'scheduleSlot' | 'addClass' | 'speech'>('relief');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form Data State
  const [formData, setFormData] = useState<any>({});

  // Context Selectors for Schedules
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHER_LIST[0]);
  const [selectedClass, setSelectedClass] = useState('5 Al-Hanafi');

  // --- HELPER: Detect Form Level ---
  const getFormLevel = (className: string) => {
    const firstChar = className.trim().charAt(0);
    const level = parseInt(firstChar);
    return isNaN(level) ? 1 : level;
  };

  // --- HELPER: Get Short Name (Before bin/binti) ---
  const getShortName = (fullName: string) => {
    if (!fullName) return '';
    // Split by case-insensitive ' bin ' or ' binti '
    const split = fullName.split(/ bin | binti /i);
    return split[0];
  };

  // --- HELPER: Format Date for Input ---
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  };

  // --- MOCK GENERATORS (Fallback if no state override) ---
  const getPersonalSlotData = (day: string, time: string) => {
    const key = `${selectedTeacher}-${day}-${time}`;
    if (scheduleData[key]) return scheduleData[key]; // Return override if exists

    // Default Mock (Just for demo visualization)
    const hash = (day.length + time.length + selectedTeacher.length) % 7;
    if (hash === 0) return { subject: 'Rehat', code: 'REHAT', color: 'bg-gray-700 text-gray-300' };
    if (hash === 1 || hash === 4) return { subject: 'MAT', code: '4H', color: 'bg-blue-900/60 text-blue-200 border-blue-700' };
    if (hash === 2) return { subject: 'KOKO', code: 'KOKO', color: 'bg-orange-900/60 text-orange-200 border-orange-700' };
    return null;
  };

  const getClassSlotData = (day: string, time: string) => {
    const key = `${selectedClass}-${day}-${time}`;
    if (scheduleData[key]) return scheduleData[key]; // Return override if exists

    // Default Mock
    const hash = (day.length + time.length + selectedClass.length) % 5;
    if (time.includes('10:00') || time.includes('10:30')) return { subject: 'REHAT', teacher: '', color: 'bg-gray-700 text-gray-300' };
    if (hash === 0) return { subject: 'BM', teacher: 'Siti Aminah binti Mohamed', color: 'bg-emerald-900/60 text-emerald-200 border-emerald-700' };
    if (hash === 1) return { subject: 'SEJ', teacher: 'Saemah binti Supandi', color: 'bg-yellow-900/40 text-yellow-200 border-yellow-700' };
    if (hash === 2) return { subject: 'MAT', teacher: 'Zulkeffle bin Muhammad', color: 'bg-blue-900/60 text-blue-200 border-blue-700' };
    return null; 
  };

  // --- HANDLERS ---

  const openEditModal = (type: 'relief' | 'coordinator' | 'classTeacher' | 'scheduleSlot' | 'addClass' | 'speech', item: any, extraData?: any) => {
    setModalType(type);
    setEditingItem(item); // item might be null for new slots
    setIsModalOpen(true);

    if (type === 'relief') {
        setFormData(item || { date: '', time: '', class: '', subject: '', absent: '', relief: '', status: 'Ganti' });
    } else if (type === 'coordinator') {
        setFormData(item);
    } else if (type === 'classTeacher') {
        setFormData(item);
    } else if (type === 'addClass') {
        setFormData({ className: '', teacherName: '' });
    } else if (type === 'speech') {
        setFormData(item || { date: '', activity: '', teacher: '', topic: '' });
    } else if (type === 'scheduleSlot') {
        // extraData contains { day, time, context }
        const existingData = item;
        setFormData({
            ...extraData,
            subject: existingData?.subject || '',
            code: existingData?.code || '',
            teacher: existingData?.teacher || '',
            color: existingData?.color || 'bg-blue-900/60 text-blue-200 border-blue-700'
        });
    }
  };

  const handleDeleteSpeech = (id: number) => {
      if(window.confirm("Padam rekod jadual berucap ini?")) {
          setSpeechList(speechList.filter(s => s.id !== id));
          showToast("Rekod dipadam.");
      }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalType === 'relief') {
        if (editingItem) {
            setReliefList(reliefList.map(r => r.id === editingItem.id ? { ...formData, id: r.id } : r));
            showToast("Jadual guru ganti dikemaskini");
        }
    } else if (modalType === 'coordinator') {
        setCoordinators(coordinators.map(c => c.id === editingItem.id ? { ...c, name: formData.name } : c));
        showToast("Penyelaras dikemaskini");
    } else if (modalType === 'classTeacher') {
        setClassTeachers(classTeachers.map(c => c.id === editingItem.id ? { ...c, teacher: formData.teacher } : c));
        showToast("Guru kelas dikemaskini");
    } else if (modalType === 'addClass') {
        const newClass = {
            id: Date.now(),
            form: getFormLevel(formData.className).toString(),
            class: formData.className,
            teacher: formData.teacherName
        };
        setClassTeachers([...classTeachers, newClass]);
        setSelectedClass(formData.className); // Auto select new class
        showToast(`Kelas ${formData.className} berjaya ditambah.`);
    } else if (modalType === 'speech') {
        // Handle date formatting
        let dateToSave = formData.date;
        if (dateToSave.includes('-') && dateToSave.split('-')[0].length === 4) {
             const p = dateToSave.split('-');
             dateToSave = `${p[2]}-${p[1]}-${p[0]}`;
        }
        
        const payload = {
            id: editingItem ? editingItem.id : Date.now(),
            date: dateToSave,
            activity: formData.activity,
            teacher: formData.teacher,
            topic: formData.topic
        };

        if (editingItem) {
            setSpeechList(speechList.map(s => s.id === editingItem.id ? payload : s));
            showToast("Jadual berucap dikemaskini");
        } else {
            setSpeechList([...speechList, payload]);
            showToast("Jadual berucap ditambah");
        }

    } else if (modalType === 'scheduleSlot') {
        // Save to Schedule Override Dictionary
        const key = `${formData.context}-${formData.day}-${formData.time}`;
        
        const newSlotData = {
            subject: formData.subject,
            code: formData.code, // used in personal schedule
            teacher: formData.teacher, // used in class schedule
            color: formData.color
        };

        setScheduleData(prev => ({
            ...prev,
            [key]: newSlotData
        }));
        showToast("Slot jadual dikemaskini");
    }

    setIsModalOpen(false);
  };

  const colorOptions = [
      { label: 'Biru (Math/Sains)', value: 'bg-blue-900/60 text-blue-200 border-blue-700' },
      { label: 'Hijau (Bahasa)', value: 'bg-emerald-900/60 text-emerald-200 border-emerald-700' },
      { label: 'Kuning (Sejarah/Geo)', value: 'bg-yellow-900/40 text-yellow-200 border-yellow-700' },
      { label: 'Oren (Sukan/Koko)', value: 'bg-orange-900/60 text-orange-200 border-orange-700' },
      { label: 'Kelabu (Rehat)', value: 'bg-gray-700 text-gray-300' },
      { label: 'Ungu (Agama)', value: 'bg-purple-900/60 text-purple-200 border-purple-700' },
  ];

  // --- SUB-COMPONENTS (With Edit Wrappers) ---

  // 1. GURU GANTI VIEW
  const GuruGantiView = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
      <div className="p-6 border-b border-gray-700 bg-[#0B132B]">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Jadual Guru Ganti (Harian)</h3>
            <span className="bg-[#3A506B] text-[#C9B458] px-3 py-1 rounded text-sm font-mono">{new Date().toLocaleDateString('ms-MY')}</span>
         </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-[#3A506B]/20 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Masa</th>
              <th className="px-6 py-4 font-semibold">Kelas & Subjek</th>
              <th className="px-6 py-4 font-semibold">Guru Tidak Hadir</th>
              <th className="px-6 py-4 font-semibold text-[#C9B458]">Guru Ganti</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              {isAdmin && <th className="px-6 py-4 font-semibold text-right">Tindakan</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-sm">
            {reliefList.map((item) => (
              <tr key={item.id} className="hover:bg-[#253252] transition-colors">
                <td className="px-6 py-4 font-mono text-gray-300 whitespace-nowrap">{item.time}</td>
                <td className="px-6 py-4">
                   <div className="font-bold text-white">{item.class}</div>
                   <div className="text-xs text-gray-500">{item.subject}</div>
                </td>
                <td className="px-6 py-4 text-gray-400">{item.absent}</td>
                <td className="px-6 py-4 font-medium text-[#C9B458]">{item.relief}</td>
                <td className="px-6 py-4 text-center">
                   <span className="bg-green-900/40 text-green-400 px-2 py-1 rounded text-xs border border-green-800">
                     {item.status}
                   </span>
                </td>
                {isAdmin && (
                    <td className="px-6 py-4 text-right">
                        <button 
                            onClick={() => openEditModal('relief', item)}
                            className="text-blue-400 hover:text-white bg-[#3A506B]/50 hover:bg-[#3A506B] p-2 rounded transition-colors"
                        >
                            ✏️ Edit
                        </button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 2. GURU KELAS VIEW
  const GuruKelasView = () => (
    <div className="space-y-8 fade-in">
      {/* Coordinators */}
      <div className="bg-[#1C2541] rounded-xl border-l-4 border-[#C9B458] p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Penyelaras Tingkatan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coordinators.map((coord) => (
            <div key={coord.id} className="flex items-center justify-between gap-3 bg-[#0B132B] p-4 rounded-lg border border-gray-700 group">
               <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#3A506B] flex items-center justify-center font-bold text-[#C9B458]">
                      {coord.id}
                   </div>
                   <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{coord.form}</p>
                      <p className="font-semibold text-white">{coord.name}</p>
                   </div>
               </div>
               {isAdmin && (
                   <button 
                    onClick={() => openEditModal('coordinator', coord)}
                    className="text-gray-500 hover:text-[#C9B458] opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                       ✏️
                   </button>
               )}
            </div>
          ))}
        </div>
      </div>

      {/* Class Teachers List */}
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700 bg-[#0B132B]">
           <h3 className="text-xl font-bold text-white">Senarai Guru Kelas</h3>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
           {[1, 2, 3, 4, 5].map(formLevel => (
              <div key={formLevel} className="space-y-3">
                 <h4 className="text-[#C9B458] font-bold border-b border-gray-700 pb-2">Tingkatan {formLevel}</h4>
                 <div className="space-y-2">
                    {classTeachers.filter(t => t.form === formLevel.toString()).map((ct) => (
                       <div key={ct.id} className="flex justify-between items-center bg-[#0B132B]/50 p-3 rounded hover:bg-[#253252] transition-colors group">
                          <span className="font-mono text-white font-medium">{ct.class}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300 text-sm">{ct.teacher}</span>
                            {isAdmin && (
                                <button 
                                    onClick={() => openEditModal('classTeacher', ct)}
                                    className="text-gray-600 hover:text-[#C9B458] text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✏️
                                </button>
                            )}
                          </div>
                       </div>
                    ))}
                    {classTeachers.filter(t => t.form === formLevel.toString()).length === 0 && (
                      <p className="text-gray-600 italic text-sm">Tiada data kelas.</p>
                    )}
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );

  // 3. JADUAL BERUCAP VIEW
  const JadualBerucapView = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
        <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center">
             <h3 className="text-xl font-bold text-white">Jadual Guru Bertugas / Berucap</h3>
             {isAdmin && (
                <button 
                  onClick={() => openEditModal('speech', null)}
                  className="bg-[#C9B458] text-[#0B132B] px-3 py-1 rounded text-sm font-bold hover:bg-yellow-400"
                >
                    + Tambah
                </button>
             )}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                    <tr className="bg-[#3A506B]/20 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold text-[#C9B458]">Tarikh</th>
                        <th className="px-6 py-4 font-semibold">Aktiviti / Majlis</th>
                        <th className="px-6 py-4 font-semibold">Guru Bertugas</th>
                        <th className="px-6 py-4 font-semibold">Tajuk / Catatan</th>
                        {isAdmin && <th className="px-6 py-4 font-semibold text-right">Tindakan</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-sm">
                    {speechList.map((item) => (
                        <tr key={item.id} className="hover:bg-[#253252] transition-colors group">
                            <td className="px-6 py-4 font-mono text-gray-300 whitespace-nowrap">{item.date}</td>
                            <td className="px-6 py-4 font-bold text-white">{item.activity}</td>
                            <td className="px-6 py-4 text-gray-300">{item.teacher}</td>
                            <td className="px-6 py-4 text-[#C9B458] italic">{item.topic}</td>
                            {isAdmin && (
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal('speech', item)} className="text-blue-400 hover:text-white" title="Edit">✏️</button>
                                        <button onClick={() => handleDeleteSpeech(item.id)} className="text-red-400 hover:text-white" title="Padam">🗑️</button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {speechList.length === 0 && (
                        <tr>
                            <td colSpan={isAdmin ? 5 : 4} className="px-6 py-8 text-center text-gray-500 italic">
                                Tiada rekod jadual berucap.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );

  // 4. JADUAL PERSENDIRIAN (TIMETABLE GRID)
  const JadualPersendirianView = () => {
     return (
       <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col h-full">
          <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex flex-col sm:flex-row justify-between items-center gap-4">
             <h3 className="text-xl font-bold text-white">Jadual Waktu Persendirian</h3>
             <select 
                className="bg-[#1C2541] border border-gray-600 text-white rounded px-4 py-2 focus:border-[#C9B458] outline-none min-w-[250px]"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
             >
                {TEACHER_LIST.map((teacher) => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
             </select>
          </div>
          
          <div className="overflow-x-auto p-4 custom-scrollbar">
             <table className="w-full border-collapse min-w-[1200px]">
                <thead>
                   <tr>
                      <th className="p-3 border border-gray-700 bg-[#0B132B] text-[#C9B458] w-24 sticky left-0 z-10">HARI / MASA</th>
                      {timeSlots.map(slot => (
                         <th key={slot} className="p-2 border border-gray-700 bg-[#0B132B] text-gray-400 text-xs font-mono w-20 whitespace-nowrap">
                            {slot}
                         </th>
                      ))}
                   </tr>
                </thead>
                <tbody>
                   {days.map(day => (
                      <tr key={day}>
                         <td className="p-3 border border-gray-700 bg-[#1C2541] font-bold text-white sticky left-0 z-10 text-sm">
                            {day}
                         </td>
                         {timeSlots.map(slot => {
                            const data = getPersonalSlotData(day, slot);
                            return (
                               <td 
                                key={slot} 
                                className={`border border-gray-700 p-1 h-16 relative transition-colors ${isAdmin ? 'hover:bg-[#253252] cursor-pointer' : ''}`}
                                onClick={() => isAdmin && openEditModal('scheduleSlot', data, { day, time: slot, context: selectedTeacher })}
                               >
                                  {data && (
                                     <div className={`w-full h-full rounded flex flex-col items-center justify-center text-[10px] p-1 border ${data.color} shadow-sm`}>
                                        <span className="font-bold truncate w-full text-center">{data.code}</span>
                                        <span className="truncate w-full text-center opacity-80">{data.subject}</span>
                                     </div>
                                  )}
                                  {isAdmin && !data && <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 text-xs text-gray-600">+</div>}
                               </td>
                            );
                         })}
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          {isAdmin && <div className="px-6 py-2 text-xs text-gray-500 italic">* Klik pada kotak masa untuk mengedit (Admin Sahaja).</div>}
       </div>
     );
  };

  // 5. JADUAL KELAS (TIMETABLE GRID)
  const JadualKelasView = () => {
    // Filter unique class names from classTeachers for dropdown
    const availableClasses = Array.from(new Set(classTeachers.map(ct => ct.class))).sort();

    return (
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col h-full">
         <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-white">Jadual Waktu Kelas</h3>
            <div className="flex gap-2">
                <select 
                   className="bg-[#1C2541] border border-gray-600 text-white rounded-l px-4 py-2 focus:border-[#C9B458] outline-none min-w-[200px]"
                   value={selectedClass}
                   onChange={(e) => setSelectedClass(e.target.value)}
                >
                   {availableClasses.map(cls => (
                       <option key={cls} value={cls}>{cls}</option>
                   ))}
                </select>
                {isAdmin && (
                    <button 
                        onClick={() => openEditModal('addClass', null)}
                        className="bg-[#C9B458] text-[#0B132B] px-3 py-2 rounded-r font-bold text-sm hover:bg-yellow-400 transition-colors flex items-center gap-1"
                        title="Tambah Kelas Baru"
                    >
                        <span>+</span> Kelas
                    </button>
                )}
            </div>
         </div>
         
         <div className="overflow-x-auto p-4 custom-scrollbar">
            <table className="w-full border-collapse min-w-[1200px]">
               <thead>
                  <tr>
                     <th className="p-3 border border-gray-700 bg-[#0B132B] text-[#C9B458] w-24 sticky left-0 z-10">HARI / MASA</th>
                     {timeSlots.map(slot => (
                        <th key={slot} className="p-2 border border-gray-700 bg-[#0B132B] text-gray-400 text-xs font-mono w-20 whitespace-nowrap">
                           {slot}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {days.map(day => (
                     <tr key={day}>
                        <td className="p-3 border border-gray-700 bg-[#1C2541] font-bold text-white sticky left-0 z-10 text-sm">
                           {day}
                        </td>
                        {timeSlots.map(slot => {
                           const data = getClassSlotData(day, slot);
                           return (
                              <td 
                                key={slot} 
                                className={`border border-gray-700 p-1 h-20 relative transition-colors ${isAdmin ? 'hover:bg-[#253252] cursor-pointer' : ''}`}
                                onClick={() => isAdmin && openEditModal('scheduleSlot', data, { day, time: slot, context: selectedClass })}
                              >
                                 {data && (
                                    <div className={`w-full h-full rounded flex flex-col items-center justify-center text-[10px] p-1 border ${data.color} shadow-sm group`}>
                                       <span className="font-bold truncate w-full text-center">{data.subject}</span>
                                       {data.teacher && (
                                           <span className="truncate w-full text-center opacity-80 mt-1">
                                               {getShortName(data.teacher)}
                                           </span>
                                       )}
                                    </div>
                                 )}
                                 {isAdmin && !data && <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 text-xs text-gray-600">+</div>}
                              </td>
                           );
                        })}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {isAdmin && <div className="px-6 py-2 text-xs text-gray-500 italic">* Klik pada kotak masa untuk mengedit (Admin Sahaja).</div>}
      </div>
    );
 };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in">
       {/* Breadcrumb Header */}
       <div className="flex items-center gap-2 text-sm text-[#C9B458] font-mono mb-2">
           <span>JADUAL</span>
           <span>/</span>
           <span className="uppercase">{type}</span>
       </div>
       
       <h2 className="text-3xl font-bold text-white font-montserrat mb-6">
         {type}
       </h2>

       {type === 'Guru Ganti' && <GuruGantiView />}
       {type === 'Guru Kelas' && <GuruKelasView />}
       {type === 'Jadual Persendirian' && <JadualPersendirianView />}
       {type === 'Jadual Kelas' && <JadualKelasView />}
       {type === 'Jadual Berucap' && <JadualBerucapView />}

       {/* --- UNIVERSAL EDIT MODAL --- */}
       {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
             <div className="bg-[#1C2541] w-full max-w-md p-6 rounded-xl border border-[#C9B458] shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                    {modalType === 'scheduleSlot' ? `Edit Slot (${formData.day} ${formData.time})` : 
                     modalType === 'addClass' ? 'Tambah Kelas Baru' : 
                     modalType === 'speech' ? 'Jadual Berucap' : 'Kemaskini Maklumat'}
                </h3>
                
                <form onSubmit={handleSave} className="space-y-4">
                    {modalType === 'relief' && (
                        <>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Masa</label>
                              <input type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Kelas</label>
                              <input type="text" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Subjek</label>
                              <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Guru Tidak Hadir</label>
                              <select 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.absent}
                                onChange={e => setFormData({...formData, absent: e.target.value})}
                              >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Guru Ganti</label>
                              <select 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.relief}
                                onChange={e => setFormData({...formData, relief: e.target.value})}
                              >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                           </div>
                        </>
                    )}

                    {modalType === 'coordinator' && (
                        <div>
                             <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Penyelaras ({formData.form})</label>
                             <select 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                             >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                        </div>
                    )}

                    {modalType === 'classTeacher' && (
                         <div>
                             <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Guru Kelas ({formData.class})</label>
                             <select 
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.teacher}
                                onChange={e => setFormData({...formData, teacher: e.target.value})}
                             >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                        </div>
                    )}

                    {modalType === 'speech' && (
                        <>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Tarikh</label>
                              <input required type="date" value={formatDateForInput(formData.date)} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Aktiviti / Majlis</label>
                              <input required type="text" value={formData.activity} onChange={e => setFormData({...formData, activity: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" placeholder="Contoh: Perhimpunan Rasmi" />
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Guru Bertugas</label>
                              <select 
                                required
                                className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                value={formData.teacher}
                                onChange={e => setFormData({...formData, teacher: e.target.value})}
                              >
                                <option value="">-- Pilih Guru --</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Tajuk / Catatan</label>
                              <input type="text" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" placeholder="Contoh: Amanat Pengetua" />
                           </div>
                        </>
                    )}

                    {modalType === 'addClass' && (
                         <>
                            <div>
                                <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Kelas (Cth: 4 Al-Hanafi)</label>
                                <input required type="text" value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" placeholder="Nama Kelas" />
                            </div>
                            <div>
                                <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Guru Kelas</label>
                                <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.teacherName}
                                    onChange={e => setFormData({...formData, teacherName: e.target.value})}
                                >
                                    <option value="">-- Pilih Guru --</option>
                                    {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                         </>
                    )}

                    {modalType === 'scheduleSlot' && (
                        <>
                           <div>
                              <label className="text-xs text-[#C9B458] uppercase font-bold">Subjek</label>
                              
                              {/* Logic for Dropdown in Jadual Kelas OR Jadual Persendirian */}
                              {type === 'Jadual Kelas' ? (
                                  <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                  >
                                      <option value="">-- Pilih Subjek --</option>
                                      <option value="REHAT">REHAT</option>
                                      {(getFormLevel(selectedClass) >= 4 ? SUBJECTS_UPPER : SUBJECTS_LOWER).map(sub => (
                                          <option key={sub} value={sub}>{sub}</option>
                                      ))}
                                      {/* Fallback to custom value if it exists but isn't in list */}
                                      {!SUBJECTS_LOWER.includes(formData.subject) && !SUBJECTS_UPPER.includes(formData.subject) && formData.subject !== 'REHAT' && formData.subject !== '' && (
                                          <option value={formData.subject}>{formData.subject}</option>
                                      )}
                                  </select>
                              ) : (
                                  // For Personal Schedule, show all subjects in dropdown for convenience
                                  <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                  >
                                      <option value="">-- Pilih Subjek / Aktiviti --</option>
                                      <option value="REHAT">REHAT</option>
                                      {ALL_SUBJECTS.map(sub => (
                                          <option key={sub} value={sub}>{sub}</option>
                                      ))}
                                      {/* Allow keeping custom value if user manually entered it before */}
                                      {!ALL_SUBJECTS.includes(formData.subject) && formData.subject !== 'REHAT' && formData.subject !== '' && (
                                          <option value={formData.subject}>{formData.subject}</option>
                                      )}
                                  </select>
                              )}
                           </div>

                           {/* If editing personal schedule, ask for Class Code. If Class schedule, ask for Teacher */}
                           {type === 'Jadual Persendirian' ? (
                               <div>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold">Kod Kelas / Catatan</label>
                                  <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.code} 
                                    onChange={e => setFormData({...formData, code: e.target.value})}
                                  >
                                      <option value="">-- Pilih Kod --</option>
                                      {CLASS_CODES.map(code => (
                                          <option key={code} value={code}>{code}</option>
                                      ))}
                                  </select>
                                </div>
                           ) : (
                               <div>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold">Nama Guru</label>
                                  <select 
                                    className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white"
                                    value={formData.teacher}
                                    onChange={e => setFormData({...formData, teacher: e.target.value})}
                                  >
                                    <option value="">-- Pilih Guru --</option>
                                    {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                               </div>
                           )}
                           
                           <div>
                               <label className="text-xs text-[#C9B458] uppercase font-bold">Warna Label</label>
                               <div className="grid grid-cols-1 gap-2 mt-1">
                                   {colorOptions.map(opt => (
                                       <label key={opt.label} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#0B132B]">
                                           <input 
                                             type="radio" 
                                             name="color" 
                                             value={opt.value} 
                                             checked={formData.color === opt.value}
                                             onChange={() => setFormData({...formData, color: opt.value})}
                                             className="accent-[#C9B458]"
                                           />
                                           <span className={`w-4 h-4 rounded-full border ${opt.value.split(' ')[0]} ${opt.value.split(' ')[2]}`}></span>
                                           <span className="text-sm text-gray-300">{opt.label}</span>
                                       </label>
                                   ))}
                               </div>
                           </div>
                        </>
                    )}

                    <div className="flex gap-2 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Batal</button>
                        <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400">Simpan</button>
                    </div>
                </form>
             </div>
           </div>
       )}
    </div>
  );
};