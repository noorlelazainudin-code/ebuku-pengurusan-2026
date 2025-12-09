import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Permissions, Announcement, Program, SiteConfig } from '../types';

interface AppContextType {
  user: User | null;
  login: (username: string, role: 'admin' | 'adminsistem') => void;
  logout: () => void;
  permissions: Permissions;
  updatePermissions: (newPermissions: Permissions) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data SDK Simulation
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  programs: Program[];
  addProgram: (program: Program) => void;
  updateProgram: (program: Program) => void;
  deleteProgram: (id: number) => void;
  
  // Element SDK Simulation
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Cloud Sync
  saveToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
  isSyncing: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultPermissions: Permissions = {
  pentadbiran: true,
  kurikulum: true,
  hem: true,
  kokurikulum: true,
  takwim: true,
  program: true,
  pengumuman: true,
  laporan: true,
};

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Mesyuarat Agung PIBG Kali Ke-15",
    date: "25-10-2026",
    summary: "Semua ibu bapa dan guru dijemput hadir ke Dewan Utama bermula jam 8.00 pagi.",
    views: 124,
    likes: 45
  },
  {
    id: 2,
    title: "Cuti Peristiwa Sempena Sukan Tahunan",
    date: "01-11-2026",
    summary: "Sekolah akan bercuti pada hari Isnin sebagai cuti peristiwa.",
    views: 312,
    likes: 89
  }
];

const initialPrograms: Program[] = [
  {
    id: 1,
    title: "Minggu Bahasa & Budaya",
    date: "15-11-2026",
    time: "08:00 Pagi",
    location: "Dewan Terbuka SMAAM",
    category: "Kurikulum",
    description: "Pertandingan pidato, sajak dan penulisan esei yang melibatkan semua pelajar tingkatan 1 hingga 5. Program ini bertujuan memartabatkan bahasa kebangsaan.",
    image1: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=600&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Kem Kepimpinan Pengawas",
    date: "20-11-2026",
    time: "03:00 Petang",
    location: "Kem Bina Negara, Mersing",
    category: "HEM",
    description: "Program jati diri untuk semua pengawas lantikan baharu bagi sesi 2027. Aktiviti lasak dan ceramah kepimpinan akan dijalankan selama 3 hari 2 malam.",
    image1: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Kejohanan Futsal Antara Rumah",
    date: "05-12-2026",
    time: "08:00 Pagi",
    location: "Gelanggang Futsal Komuniti",
    category: "Sukan",
    description: "Saringan akhir di padang sekolah. Semua rumah sukan wajib menghantar wakil.",
    image1: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop"
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permissions>(defaultPermissions);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    systemTitle: "PENGURUSAN DIGITAL SMAAM",
    schoolName: "SMA Al-Khairiah Al-Islamiah Mersing",
    welcomeMessage: "Selamat Datang ke Dashboard Utama",
    googleScriptUrl: ""
  });

  // Load data from localStorage (Simulating Data SDK persistence)
  useEffect(() => {
    const savedPermissions = localStorage.getItem('smaam_permissions');
    if (savedPermissions) setPermissions(JSON.parse(savedPermissions));

    const savedConfig = localStorage.getItem('smaam_config');
    if (savedConfig) setSiteConfig(JSON.parse(savedConfig));
    
    // Check session
    const savedUser = sessionStorage.getItem('smaam_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (username: string, role: 'admin' | 'adminsistem') => {
    const newUser = { username, role, name: role === 'adminsistem' ? 'Admin Sistem' : 'Admin Bertugas' };
    setUser(newUser);
    sessionStorage.setItem('smaam_user', JSON.stringify(newUser));
    showToast(`Selamat datang, ${newUser.name}`);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('smaam_user');
    setActiveTab('Dashboard');
    showToast("Log keluar berjaya");
  };

  const updatePermissions = (newPermissions: Permissions) => {
    setPermissions(newPermissions);
    localStorage.setItem('smaam_permissions', JSON.stringify(newPermissions));
  };

  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    const newConfig = { ...siteConfig, ...config };
    setSiteConfig(newConfig);
    localStorage.setItem('smaam_config', JSON.stringify(newConfig));
  };

  const addAnnouncement = (item: Announcement) => {
    setAnnouncements([item, ...announcements]);
    showToast("Pengumuman ditambah");
  };

  const addProgram = (item: Program) => {
    setPrograms([item, ...programs]);
    showToast("Program ditambah");
  };

  const updateProgram = (updatedItem: Program) => {
    setPrograms(programs.map(p => p.id === updatedItem.id ? updatedItem : p));
    showToast("Program dikemaskini");
  };

  const deleteProgram = (id: number) => {
    setPrograms(programs.filter(p => p.id !== id));
    showToast("Program dipadam");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- GOOGLE SHEETS SYNC LOGIC ---

  const saveToCloud = async () => {
    if (!siteConfig.googleScriptUrl) {
      alert("Sila tetapkan URL Google Apps Script di Tetapan Admin dahulu.");
      return;
    }

    setIsSyncing(true);
    showToast("Sedang menyimpan ke Google Sheet...");

    try {
      // Gather all necessary data
      // Note: We need to stringify complex objects to store them easily in the sheet
      const payload = {
        action: 'save',
        data: {
          permissions,
          siteConfig,
          announcements,
          programs,
          // You would also gather Takwim data here if it was lifted to Context
          // For now, this saves the main config and dashboard data
        }
      };

      // Using no-cors mode because Google Script often has CORS issues with simple fetch
      // However, for data to actually be read/confirmed, we usually need proper CORS headers on script side.
      // We will assume the script is set up correctly.
      const response = await fetch(siteConfig.googleScriptUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.status === 'success') {
         showToast("✅ Berjaya disimpan di Google Sheet!");
      } else {
         showToast("⚠️ Ralat: " + result.message);
      }

    } catch (error) {
      console.error(error);
      showToast("❌ Gagal menyambung ke server.");
    } finally {
      setIsSyncing(false);
    }
  };

  const loadFromCloud = async () => {
    if (!siteConfig.googleScriptUrl) {
      alert("Sila tetapkan URL Google Apps Script di Tetapan Admin dahulu.");
      return;
    }

    setIsSyncing(true);
    showToast("Sedang memuat turun data...");

    try {
       // Append action=read to URL
       const url = `${siteConfig.googleScriptUrl}?action=read`;
       const response = await fetch(url);
       const result = await response.json();

       if (result.status === 'success' && result.data) {
          const d = result.data;
          
          if(d.permissions) {
             setPermissions(d.permissions);
             localStorage.setItem('smaam_permissions', JSON.stringify(d.permissions));
          }
          if(d.siteConfig) {
             // Keep the URL even if cloud config doesn't have it yet
             const mergedConfig = { ...d.siteConfig, googleScriptUrl: siteConfig.googleScriptUrl };
             setSiteConfig(mergedConfig);
             localStorage.setItem('smaam_config', JSON.stringify(mergedConfig));
          }
          if(d.announcements) setAnnouncements(d.announcements);
          if(d.programs) setPrograms(d.programs);

          showToast("✅ Data berjaya dimuat turun!");
       } else {
          showToast("⚠️ Tiada data dijumpai atau ralat server.");
       }

    } catch (error) {
       console.error(error);
       showToast("❌ Gagal memuat turun data.");
    } finally {
       setIsSyncing(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      permissions, updatePermissions,
      activeTab, setActiveTab,
      announcements, addAnnouncement,
      programs, addProgram, updateProgram, deleteProgram,
      siteConfig, updateSiteConfig,
      toastMessage, showToast,
      saveToCloud, loadFromCloud, isSyncing
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};