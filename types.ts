export interface User {
  username: string;
  role: 'admin' | 'adminsistem' | null;
  name: string;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  summary: string;
  views: number;
  likes: number;
}

export interface Program {
  id: number;
  title: string;
  date: string;
  time?: string;
  location?: string;
  category: string;
  description: string;
  image1?: string;
  image2?: string;
}

export interface Permissions {
  pentadbiran: boolean;
  kurikulum: boolean;
  hem: boolean;
  kokurikulum: boolean;
  takwim: boolean;
  program: boolean;
  pengumuman: boolean;
  laporan: boolean;
}

export interface SiteConfig {
  systemTitle: string;
  schoolName: string;
  welcomeMessage: string;
  googleScriptUrl?: string;
}