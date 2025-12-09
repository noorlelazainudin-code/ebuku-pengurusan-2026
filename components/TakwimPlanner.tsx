import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

type ViewMode = 'harian' | 'mingguan' | 'bulanan' | 'tahunan';

interface TakwimPlannerProps {
  type: string;
}

// --- INTERFACES FOR EDITABLE TABLES ---
interface SchoolWeekRow {
  id: number;
  week: string;
  date: string;
  notes: string;
  totalDays: string;
  totalWeeks: string;
  rowSpan?: number;
  isHoliday?: boolean;
}

interface ExamWeekRow {
  id: number;
  week: string;
  date: string;
  dalaman: string;
  jaj: string;
  awam: string;
  isHoliday?: boolean;
}

// --- DATA STRUCTURE FOR PDF CALENDAR 2026 ---
interface CalendarEvent {
  day: number;
  label: string;
  isHoliday?: boolean;
  isSchoolHoliday?: boolean;
  color?: string; // custom bg color
  icon?: string;
  islamicDate?: string;
}

interface MonthData {
  id: number;
  name: string;
  islamicMonth: string;
  headerColor1: string; // Left header color
  headerColor2: string; // Right header color (Islamic)
  startDay: number; // 0 = Sunday, 1 = Monday, etc.
  daysInMonth: number;
  catatan: React.ReactNode;
  events: CalendarEvent[];
}

// --- REAL DATA FOR 2026 BASED ON PDF ---
const calendar2026Data: MonthData[] = [
  {
    id: 0,
    name: 'JANUARI 2026',
    islamicMonth: "REJAB - SYA'BAN 1447",
    headerColor1: 'bg-[#1a237e]', // Deep Blue
    headerColor2: 'bg-[#2e7d32]', // Green
    startDay: 4, // Thursday
    daysInMonth: 31,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PENGGAL 2<br/>Sesi Persekolahan 2025/2026</h4>
          <div className="mt-2 text-xs">
            <p className="font-bold text-blue-800">Kump. A</p>
            <p>19.12.2025 hingga 10.1.2026</p>
            <p className="font-bold text-blue-800 mt-1">Kump. B</p>
            <p>20.12.2025 hingga 11.1.2026</p>
            <p className="mt-1 font-bold">(23 hari)</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-[#1a237e]">Mula Persekolahan<br/>Sesi Akademik 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A: 11.01.2026 (Ahad)</p>
             <p className="font-bold">Kump. B: 12.01.2026 (Isnin)</p>
          </div>
        </div>
      </div>
    ),
    events: [
      { day: 1, label: 'Tahun Baru', islamicDate: '11 Rejab', isHoliday: true },
      { day: 2, label: 'Cuti Sekolah', islamicDate: '12 Rejab', isSchoolHoliday: true },
      { day: 3, label: 'Cuti Sekolah', islamicDate: '13 Rejab', isSchoolHoliday: true },
      { day: 4, label: 'Cuti Sekolah', islamicDate: '14 Rejab', isSchoolHoliday: true },
      { day: 5, label: 'Cuti Sekolah', islamicDate: '15 Rejab', isSchoolHoliday: true },
      { day: 6, label: 'Cuti Sekolah', islamicDate: '16 Rejab', isSchoolHoliday: true },
      { day: 7, label: 'Cuti Sekolah', islamicDate: '17 Rejab', isSchoolHoliday: true },
      { day: 8, label: 'Cuti Sekolah', islamicDate: '18 Rejab', isSchoolHoliday: true },
      { day: 9, label: 'Cuti Sekolah', islamicDate: '19 Rejab', isSchoolHoliday: true },
      { day: 10, label: 'Cuti Sekolah', islamicDate: '20 Rejab', isSchoolHoliday: true },
      { day: 11, label: 'Sesi Persekolahan 2026 Bermula', islamicDate: '21 Rejab', icon: '🎒' },
      { day: 12, label: 'Sesi Persekolahan 2026 Bermula', islamicDate: '22 Rejab', icon: '🎒' },
      { day: 14, label: 'Hari Keputeraan YDP Besar N.Sembilan', islamicDate: '24 Rejab', color: 'bg-yellow-400' },
      { day: 17, label: 'Israk & Mikraj', islamicDate: '27 Rejab', color: 'bg-purple-600 text-white', icon: '🕌' },
      { day: 22, label: 'Bayaran Gaji Penjawat Awam', islamicDate: '3 Sya\'ban', icon: '💵', color: 'bg-green-200' },
      { day: 25, label: '', islamicDate: '6 Sya\'ban' },
      { day: 31, label: '', islamicDate: '12 Sya\'ban' },
    ]
  },
  {
    id: 1,
    name: 'FEBRUARI 2026',
    islamicMonth: "SYAABAN - RAMADAN 1447",
    headerColor1: 'bg-[#1a237e]',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 0, // Sunday
    daysInMonth: 28,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800">
         <div>
          <h4 className="font-bold text-red-600">Cuti Perayaan<br/>(TAHUN BARU CINA)</h4>
          <div className="mt-2 text-xs">
            <p><span className="font-bold">Kump. A:</span> 15, 16, 19 Feb</p>
            <p><span className="font-bold">Kump. B:</span> 16, 19, 20 Feb</p>
            <p className="mt-2 italic text-gray-600">Tiga (3) Hari Cuti Tambahan KPM</p>
          </div>
        </div>
      </div>
    ),
    events: [
        { day: 1, label: 'Thaipusam / Hari Wilayah', islamicDate: '13 Sya\'ban', isHoliday: true, icon: '🕯️' },
        { day: 12, label: 'Bayaran Gaji Penjawat Awam', islamicDate: '24 Sya\'ban', icon: '💵', color: 'bg-green-200' },
        { day: 15, label: 'Cuti Sekolah', islamicDate: '27 Sya\'ban', isSchoolHoliday: true },
        { day: 16, label: 'Cuti Sekolah', islamicDate: '28 Sya\'ban', isSchoolHoliday: true },
        { day: 17, label: 'Tahun Baru Cina', islamicDate: '29 Sya\'ban', isHoliday: true, color: 'bg-red-500 text-white', icon: '🏮' },
        { day: 18, label: 'Tahun Baru Cina', islamicDate: '30 Sya\'ban', isHoliday: true, color: 'bg-red-500 text-white', icon: '🏮' },
        { day: 19, label: '1 Ramadan', islamicDate: '1 Ramadan', color: 'bg-purple-500 text-white', icon: '🌙' },
        { day: 20, label: 'Cuti Sekolah', islamicDate: '2 Ramadan', isSchoolHoliday: true },
    ]
  },
  {
    id: 2,
    name: 'MAC 2026',
    islamicMonth: "RAMADAN - SYAWAL 1447",
    headerColor1: 'bg-[#1a237e]',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 0, // Sunday
    daysInMonth: 31,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PENGGAL 1<br/>Sesi Persekolahan 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A: 20 - 28 Mac 2026</p>
             <p className="font-bold">Kump. B: 21 - 29 Mac 2026</p>
             <p className="font-bold">(9 hari)</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-green-700">Cuti Perayaan<br/>(HARI RAYA AIDILFITRI)</h4>
          <div className="mt-2 text-xs">
             <p>Cuti Tambahan KPM: 19 & 20 Mac</p>
          </div>
        </div>
      </div>
    ),
    events: [
       { day: 4, label: 'Ulang Tahun Pertabalan Sultan Terengganu', islamicDate: '14 Ramadan', isHoliday: true },
       { day: 7, label: 'Nuzul Al-Quran', islamicDate: '17 Ramadan', isHoliday: true, icon: '📖' },
       { day: 8, label: 'Selamat Hari Wanita', islamicDate: '18 Ramadan', color: 'bg-pink-200' },
       { day: 19, label: 'Cuti Sekolah', islamicDate: '29 Ramadan', isSchoolHoliday: true },
       { day: 20, label: 'Cuti Sekolah', islamicDate: '30 Ramadan', isSchoolHoliday: true },
       { day: 21, label: 'Hari Raya Aidilfitri', islamicDate: '1 Syawal', isHoliday: true, color: 'bg-green-600 text-white', icon: '🕌' },
       { day: 22, label: 'Hari Raya Aidilfitri', islamicDate: '2 Syawal', isHoliday: true, color: 'bg-green-600 text-white', icon: '🕌' },
       { day: 23, label: 'Hari Keputeraan Sultan Johor', islamicDate: '3 Syawal', isHoliday: true, color: 'bg-blue-800 text-white' },
       { day: 24, label: 'Cuti Sekolah', islamicDate: '4 Syawal', isSchoolHoliday: true },
       { day: 25, label: 'Cuti Sekolah', islamicDate: '5 Syawal', isSchoolHoliday: true },
       { day: 26, label: 'Cuti Sekolah', islamicDate: '6 Syawal', isSchoolHoliday: true },
       { day: 27, label: 'Cuti Sekolah', islamicDate: '7 Syawal', isSchoolHoliday: true },
       { day: 28, label: 'Cuti Sekolah', islamicDate: '8 Syawal', isSchoolHoliday: true },
       { day: 29, label: 'Cuti Sekolah', islamicDate: '9 Syawal', isSchoolHoliday: true },
    ]
  },
  {
    id: 3,
    name: 'APRIL 2026',
    islamicMonth: "SYAWAL - ZULKAEDAH 1447",
    headerColor1: 'bg-red-600',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 3, // Wednesday
    daysInMonth: 30,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800">
         <p>Tiada cuti sekolah panjang pada bulan ini.</p>
      </div>
    ),
    events: [
       { day: 26, label: 'Hari Keputeraan Sultan Terengganu', islamicDate: '8 Zulkaedah', isHoliday: true },
    ]
  },
  {
    id: 4,
    name: 'MEI 2026',
    islamicMonth: "ZULKAEDAH - ZULHIJJAH 1447",
    headerColor1: 'bg-[#1a237e]',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 5, // Friday
    daysInMonth: 31,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800">
         <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PERTENGAHAN TAHUN<br/>Sesi Persekolahan 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A: 22.05 - 06.06</p>
             <p className="font-bold">Kump. B: 23.05 - 07.06</p>
             <p className="font-bold">(16 hari)</p>
          </div>
        </div>
      </div>
    ),
    events: [
        { day: 1, label: 'Hari Pekerja', islamicDate: '14 Zulkaedah', isHoliday: true },
        { day: 4, label: 'Hari Wesak', islamicDate: '17 Zulkaedah', isHoliday: true, icon: '🪷' },
        { day: 17, label: 'Hari Keputeraan Raja Perlis', islamicDate: '1 Zulhijjah', isHoliday: true },
        { day: 22, label: 'Hari Hol Pahang / Cuti Sekolah', islamicDate: '6 Zulhijjah', isSchoolHoliday: true },
        { day: 23, label: 'Cuti Sekolah', islamicDate: '7 Zulhijjah', isSchoolHoliday: true },
        { day: 24, label: 'Cuti Sekolah', islamicDate: '8 Zulhijjah', isSchoolHoliday: true },
        { day: 25, label: 'Cuti Sekolah', islamicDate: '9 Zulhijjah', isSchoolHoliday: true },
        { day: 26, label: 'Cuti Sekolah / Hari Arafah', islamicDate: '10 Zulhijjah', isSchoolHoliday: true },
        { day: 27, label: 'Hari Raya Aidiladha', islamicDate: '11 Zulhijjah', isHoliday: true, color: 'bg-green-600 text-white', icon: '🕌' },
        { day: 28, label: 'Cuti Sekolah', islamicDate: '12 Zulhijjah', isSchoolHoliday: true },
        { day: 29, label: 'Cuti Sekolah', islamicDate: '13 Zulhijjah', isSchoolHoliday: true },
        { day: 30, label: 'Pesta Kaamatan', islamicDate: '14 Zulhijjah', isHoliday: true },
        { day: 31, label: 'Pesta Kaamatan', islamicDate: '15 Zulhijjah', isHoliday: true },
    ]
  },
  {
    id: 5,
    name: 'JUN 2026',
    islamicMonth: "ZULHIJJAH 1447 - MUHARAM 1448",
    headerColor1: 'bg-[#1a237e]',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 1, // Monday
    daysInMonth: 30,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800">
         <p>Sambungan Cuti Pertengahan Tahun sehingga 6/7 Jun.</p>
      </div>
    ),
    events: [
        { day: 1, label: 'Hari Gawai / Keputeraan YDP Agong', islamicDate: '15 Zulhijjah', isHoliday: true },
        { day: 2, label: 'Hari Gawai', islamicDate: '16 Zulhijjah', isHoliday: true },
        { day: 3, label: 'Cuti Sekolah', islamicDate: '17 Zulhijjah', isSchoolHoliday: true },
        { day: 4, label: 'Cuti Sekolah', islamicDate: '18 Zulhijjah', isSchoolHoliday: true },
        { day: 5, label: 'Cuti Sekolah', islamicDate: '19 Zulhijjah', isSchoolHoliday: true },
        { day: 6, label: 'Cuti Sekolah', islamicDate: '20 Zulhijjah', isSchoolHoliday: true },
        { day: 7, label: 'Cuti Sekolah', islamicDate: '21 Zulhijjah', isSchoolHoliday: true },
        { day: 17, label: 'Awal Muharram', islamicDate: '1 Muharam', isHoliday: true, color: 'bg-purple-600 text-white', icon: '🕌' },
        { day: 21, label: 'Hari Keputeraan Sultan Kedah', islamicDate: '5 Muharam', isHoliday: true },
    ]
  },
  {
    id: 6,
    name: 'JULAI 2026',
    islamicMonth: "MUHARAM - SAFAR 1448",
    headerColor1: 'bg-red-600',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 3, // Wednesday
    daysInMonth: 31,
    catatan: (
       <div className="space-y-4 text-sm text-gray-800">
         <p>Tiada cuti sekolah panjang.</p>
      </div>
    ),
    events: [
        { day: 7, label: 'Hari Warisan Dunia Georgetown', islamicDate: '21 Muharam', color: 'bg-yellow-200' },
        { day: 11, label: 'Hari Kelahiran TYT P.Pinang', islamicDate: '25 Muharam', isHoliday: true },
        { day: 21, label: 'Hari Hol Johor', islamicDate: '6 Safar', isHoliday: true },
        { day: 30, label: 'Hari Keputeraan Sultan Pahang', islamicDate: '15 Safar', isHoliday: true },
    ]
  },
  {
    id: 7,
    name: 'OGOS 2026',
    islamicMonth: "SAFAR - RABIULAWAL 1448",
    headerColor1: 'bg-[#1a237e]',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 6, // Saturday
    daysInMonth: 31,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI PENGGAL 2<br/>Sesi Persekolahan 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A: 28.08 - 05.09</p>
             <p className="font-bold">Kump. B: 29.08 - 06.09</p>
             <p className="font-bold">(9 hari)</p>
          </div>
        </div>
      </div>
    ),
    events: [
        { day: 24, label: 'Hari Kelahiran TYT Melaka', islamicDate: '11 Rabiulawal', isHoliday: true },
        { day: 25, label: 'Maulidur Rasul', islamicDate: '12 Rabiulawal', isHoliday: true, color: 'bg-green-600 text-white', icon: '🕌' },
        { day: 28, label: 'Cuti Sekolah', islamicDate: '15 Rabiulawal', isSchoolHoliday: true },
        { day: 29, label: 'Cuti Sekolah', islamicDate: '16 Rabiulawal', isSchoolHoliday: true },
        { day: 30, label: 'Cuti Sekolah', islamicDate: '17 Rabiulawal', isSchoolHoliday: true },
        { day: 31, label: 'Hari Kebangsaan / Cuti Sekolah', islamicDate: '18 Rabiulawal', isHoliday: true, icon: '🇲🇾', color: 'bg-blue-800 text-white' },
    ]
  },
  {
    id: 8,
    name: 'SEPTEMBER 2026',
    islamicMonth: "RABIULAWAL - RABIULAKHIR 1448",
    headerColor1: 'bg-[#1a237e]',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 2, // Tuesday
    daysInMonth: 30,
    catatan: (
       <div className="space-y-4 text-sm text-gray-800">
         <p>Sambungan Cuti Penggal 2 sehingga 5/6 Sep.</p>
      </div>
    ),
    events: [
        { day: 1, label: 'Cuti Sekolah', islamicDate: '19 Rabiulawal', isSchoolHoliday: true },
        { day: 2, label: 'Cuti Sekolah', islamicDate: '20 Rabiulawal', isSchoolHoliday: true },
        { day: 3, label: 'Cuti Sekolah', islamicDate: '21 Rabiulawal', isSchoolHoliday: true },
        { day: 4, label: 'Cuti Sekolah', islamicDate: '22 Rabiulawal', isSchoolHoliday: true },
        { day: 5, label: 'Cuti Sekolah', islamicDate: '23 Rabiulawal', isSchoolHoliday: true },
        { day: 6, label: 'Cuti Sekolah', islamicDate: '24 Rabiulawal', isSchoolHoliday: true },
        { day: 16, label: 'Hari Malaysia', islamicDate: '4 Rabiulakhir', isHoliday: true, icon: '🇲🇾' },
        { day: 29, label: 'Hari Keputeraan Sultan Kelantan', islamicDate: '17 Rabiulakhir', isHoliday: true },
        { day: 30, label: 'Hari Keputeraan Sultan Kelantan', islamicDate: '18 Rabiulakhir', isHoliday: true },
    ]
  },
  {
    id: 9,
    name: 'OKTOBER 2026',
    islamicMonth: "RABIULAKHIR - JAMADILAWAL 1448",
    headerColor1: 'bg-red-600',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 4, // Thursday
    daysInMonth: 31,
    catatan: (
       <div className="space-y-4 text-sm text-gray-800">
         <p>Tiada cuti sekolah panjang.</p>
      </div>
    ),
    events: [
        { day: 10, label: 'Hari Kelahiran TYT Sarawak', islamicDate: '28 Rabiulakhir', isHoliday: true },
    ]
  },
  {
    id: 10,
    name: 'NOVEMBER 2026',
    islamicMonth: "JAMADILAWAL - JAMADILAKHIR 1448",
    headerColor1: 'bg-red-600',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 0, // Sunday
    daysInMonth: 30,
    catatan: (
      <div className="space-y-4 text-sm text-gray-800">
         <div>
          <h4 className="font-bold text-[#1a237e]">Cuti Perayaan<br/>(DEEPAVALI)</h4>
          <div className="mt-2 text-xs">
            <p>08.11.2026 (Ahad)</p>
            <p className="italic">Cuti Tambahan KPM: 9 & 10 Nov</p>
          </div>
        </div>
      </div>
    ),
    events: [
        { day: 6, label: 'Hari Keputeraan Sultan Perak', islamicDate: '26 Jamadilawal', isHoliday: true },
        { day: 8, label: 'Deepavali', islamicDate: '28 Jamadilawal', isHoliday: true, icon: '🪔', color: 'bg-purple-800 text-white' },
        { day: 9, label: 'Cuti Deepavali', islamicDate: '29 Jamadilawal', isHoliday: true, color: 'bg-purple-800 text-white' },
        { day: 10, label: 'Cuti Deepavali', islamicDate: '30 Jamadilawal', isHoliday: true, color: 'bg-purple-800 text-white' },
    ]
  },
  {
    id: 11,
    name: 'DISEMBER 2026',
    islamicMonth: "JAMADILAKHIR - REJAB 1448",
    headerColor1: 'bg-[#1a237e]',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 2, // Tuesday
    daysInMonth: 31,
    catatan: (
       <div className="space-y-4 text-sm text-gray-800">
        <div className="border-b-2 border-dashed border-gray-400 pb-2">
          <h4 className="font-bold text-[#1a237e]">CUTI AKHIR PERSEKOLAHAN<br/>Sesi 2026</h4>
          <div className="mt-2 text-xs">
             <p className="font-bold">Kump. A: 04.12 - 31.12</p>
             <p className="font-bold">Kump. B: 05.12 - 31.12</p>
             <p className="font-bold">(28/27 hari)</p>
          </div>
        </div>
      </div>
    ),
    events: [
        { day: 4, label: 'Cuti Sekolah', islamicDate: '24 Jamadilakhir', isSchoolHoliday: true },
        { day: 5, label: 'Cuti Sekolah', islamicDate: '25 Jamadilakhir', isSchoolHoliday: true },
        { day: 6, label: 'Cuti Sekolah', islamicDate: '26 Jamadilakhir', isSchoolHoliday: true },
        { day: 11, label: 'Hari Keputeraan Sultan Selangor', islamicDate: '1 Rejab', isHoliday: true },
        { day: 25, label: 'Hari Krismas', islamicDate: '15 Rejab', isHoliday: true, icon: '🎄', color: 'bg-red-600 text-white' },
        // Fill the rest with Cuti Sekolah loops visually if needed, but for simplicity we rely on the side note
        { day: 26, label: 'Cuti Sekolah', islamicDate: '16 Rejab', isSchoolHoliday: true },
        { day: 27, label: 'Cuti Sekolah', islamicDate: '17 Rejab', isSchoolHoliday: true },
        { day: 28, label: 'Cuti Sekolah', islamicDate: '18 Rejab', isSchoolHoliday: true },
        { day: 29, label: 'Cuti Sekolah', islamicDate: '19 Rejab', isSchoolHoliday: true },
        { day: 30, label: 'Cuti Sekolah', islamicDate: '20 Rejab', isSchoolHoliday: true },
        { day: 31, label: 'Cuti Sekolah', islamicDate: '21 Rejab', isSchoolHoliday: true },
    ]
  },
];

// --- INITIAL DATA (SCHOOL WEEKS) ---
const initialSchoolWeeks: SchoolWeekRow[] = [
  // Block 1 (Weeks 1-10)
  { id: 1, week: '1', date: '12 – 16 Jan 2026', notes: '', totalDays: '43', totalWeeks: '10', rowSpan: 10 },
  { id: 2, week: '2', date: '19 – 23 Jan 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 3, week: '3', date: '26 – 30 Jan 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 4, week: '4', date: '2 – 6 Feb 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 5, week: '5', date: '9 – 13 Feb 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 6, week: '6', date: '16 – 20 Feb 2026', notes: '17 Feb (Tahun Baru Cina)\n18 Feb (CNY Hari Kedua)\n19 Feb (Awal Ramadan)', totalDays: '', totalWeeks: '' },
  { id: 7, week: '7', date: '23 – 27 Feb 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 8, week: '8', date: '2 – 6 Mac 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 9, week: '9', date: '9 – 13 Mac 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 10, week: '10', date: '16 – 20 Mac 2026', notes: '', totalDays: '', totalWeeks: '' },

  // Holiday 1
  { id: 101, week: '', date: '21 – 29 Mac 2026', notes: 'CUTI PENGGAL 1, TAHUN 2026', totalDays: '9', totalWeeks: '1', isHoliday: true },

  // Block 2 (Weeks 11-18)
  { id: 11, week: '11', date: '30 Mac – 3 Apr 2026', notes: '', totalDays: '39', totalWeeks: '8', rowSpan: 8 },
  { id: 12, week: '12', date: '6 – 10 Apr 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 13, week: '13', date: '13 – 17 Apr 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 14, week: '14', date: '20 – 24 Apr 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 15, week: '15', date: '27 Apr – 1 Mei 2026', notes: '1 Mei (Hari Pekerja)', totalDays: '', totalWeeks: '' },
  { id: 16, week: '16', date: '4 – 8 Mei 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 17, week: '17', date: '11 – 15 Mei 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 18, week: '18', date: '18 – 22 Mei 2026', notes: '', totalDays: '', totalWeeks: '' },

  // Holiday 2
  { id: 102, week: '', date: '23.05.2026 – 07.06.2026', notes: 'CUTI PERTENGAHAN TAHUN 2026', totalDays: '16', totalWeeks: '2', isHoliday: true },

  // Block 3 (Weeks 19-30)
  { id: 19, week: '19', date: '8 – 12 Jun 2026', notes: '', totalDays: '58', totalWeeks: '12', rowSpan: 12 },
  { id: 20, week: '20', date: '15 – 19 Jun 2026', notes: '17 Jun (Awal Muharram)', totalDays: '', totalWeeks: '' },
  { id: 21, week: '21', date: '22 – 26 Jun 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 22, week: '22', date: '29 Jun – 3 Jul 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 23, week: '23', date: '6 – 10 Jul 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 24, week: '24', date: '13 – 17 Jul 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 25, week: '25', date: '20 – 24 Jul 2026', notes: '21 Jul (Hari Hol — Johor)', totalDays: '', totalWeeks: '' },
  { id: 26, week: '26', date: '27 – 31 Jul 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 27, week: '27', date: '3 – 7 Ogos 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 28, week: '28', date: '10 – 14 Ogos 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 29, week: '29', date: '17 – 21 Ogos 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 30, week: '30', date: '24 – 28 Ogos 2026', notes: '', totalDays: '', totalWeeks: '' },

  // Holiday 3
  { id: 103, week: '', date: '29.08.2026 – 06.09.2026', notes: 'CUTI PENGGAL 2, TAHUN 2026', totalDays: '9', totalWeeks: '1', isHoliday: true },

  // Block 4 (Weeks 31-43)
  { id: 31, week: '31', date: '7 – 11 Sep 2026', notes: '-', totalDays: '62', totalWeeks: '13', rowSpan: 13 },
  { id: 32, week: '32', date: '14 – 18 Sep 2026', notes: '16 Sept (Hari Malaysia)', totalDays: '', totalWeeks: '' },
  { id: 33, week: '33', date: '21 – 25 Sep 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 34, week: '34', date: '28 Sep – 2 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 35, week: '35', date: '5 – 9 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 36, week: '36', date: '12 – 16 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 37, week: '37', date: '19 – 23 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 38, week: '38', date: '26 – 30 Okt 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 39, week: '39', date: '2 – 6 Nov 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 40, week: '40', date: '9 – 13 Nov 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 41, week: '41', date: '16 – 20 Nov 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 42, week: '42', date: '23 – 27 Nov 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 43, week: '43', date: '30 Nov – 4 Dis 2026', notes: '', totalDays: '', totalWeeks: '' },

  // Final Holiday
  { id: 104, week: '', date: '05.12.2026 – 31.12.2026', notes: 'CUTI AKHIR PERSEKOLAHAN TAHUN 2026', totalDays: '27', totalWeeks: '4', isHoliday: true },
];

// --- INITIAL DATA (EXAM WEEKS) ---
const initialExamWeeks: ExamWeekRow[] = [
    { id: 1, week: '1', date: '12 – 16 Jan 2026', dalaman: '', jaj: '', awam: '' },
    { id: 2, week: '2', date: '19 – 23 Jan 2026', dalaman: '', jaj: '', awam: '' },
    { id: 3, week: '3', date: '26 – 30 Jan 2026', dalaman: '', jaj: '', awam: '' },
    { id: 4, week: '4', date: '2 – 6 Feb 2026', dalaman: '', jaj: '', awam: '' },
    { id: 5, week: '5', date: '9 – 13 Feb 2026', dalaman: '', jaj: '', awam: '' },
    { id: 6, week: '6', date: '16 – 20 Feb 2026', dalaman: '17 Feb (Tahun Baru Cina)\n18 Feb (CNY Hari Kedua)\n19 Feb (Awal Ramadan)', jaj: '17 Feb (Tahun Baru Cina)\n18 Feb (CNY Hari Kedua)\n19 Feb (Awal Ramadan)', awam: '17 Feb (Tahun Baru Cina)\n18 Feb (CNY Hari Kedua)\n19 Feb (Awal Ramadan)' },
    { id: 7, week: '7', date: '23 – 27 Feb 2026', dalaman: '', jaj: '', awam: '' },
    { id: 8, week: '8', date: '2 – 6 Mac 2026', dalaman: '', jaj: '', awam: '' },
    { id: 9, week: '9', date: '9 – 13 Mac 2026', dalaman: '', jaj: '', awam: '' },
    { id: 10, week: '10', date: '16 – 20 Mac 2026', dalaman: '', jaj: '', awam: '' },
    { id: 1001, week: '', date: '21 – 29 Mac 2026', dalaman: 'CUTI PENGGAL 1, TAHUN 2026', jaj: '', awam: '', isHoliday: true },
    { id: 11, week: '11', date: '30 Mac – 3 Apr 2026', dalaman: '', jaj: '', awam: '' },
    { id: 12, week: '12', date: '6 – 10 Apr 2026', dalaman: '', jaj: '', awam: '' },
    { id: 13, week: '13', date: '13 – 17 Apr 2026', dalaman: '', jaj: '', awam: '' },
    { id: 14, week: '14', date: '20 – 24 Apr 2026', dalaman: '', jaj: '', awam: '' },
    { id: 15, week: '15', date: '27 Apr – 1 Mei 2026', dalaman: '1 Mei (Hari Pekerja)', jaj: '1 Mei (Hari Pekerja)', awam: '1 Mei (Hari Pekerja)' },
    { id: 16, week: '16', date: '4 – 8 Mei 2026', dalaman: '', jaj: '', awam: '' },
    { id: 17, week: '17', date: '11 – 15 Mei 2026', dalaman: '', jaj: '', awam: '' },
    { id: 18, week: '18', date: '18 – 22 Mei 2026', dalaman: '', jaj: '', awam: '' },
    { id: 1002, week: '', date: '23.05.2026 – 07.06.2026', dalaman: 'CUTI PERTENGAHAN TAHUN 2026', jaj: '', awam: '', isHoliday: true },
    { id: 19, week: '19', date: '8 – 12 Jun 2026', dalaman: '', jaj: '', awam: '' },
    { id: 20, week: '20', date: '15 – 19 Jun 2026', dalaman: '17 Jun (Awal Muharram)', jaj: '17 Jun (Awal Muharram)', awam: '17 Jun (Awal Muharram)' },
    { id: 21, week: '21', date: '22 – 26 Jun 2026', dalaman: '', jaj: '', awam: '' },
    { id: 22, week: '22', date: '29 Jun – 3 Jul 2026', dalaman: '', jaj: '', awam: '' },
    { id: 23, week: '23', date: '6 – 10 Jul 2026', dalaman: '', jaj: '', awam: '' },
    { id: 24, week: '24', date: '13 – 17 Jul 2026', dalaman: '', jaj: '', awam: '' },
    { id: 25, week: '25', date: '20 – 24 Jul 2026', dalaman: '21 Jul (Hari Hol — Johor)', jaj: '21 Jul (Hari Hol — Johor)', awam: '21 Jul (Hari Hol — Johor)' },
    { id: 26, week: '26', date: '27 – 31 Jul 2026', dalaman: '', jaj: '', awam: '' },
    { id: 27, week: '27', date: '3 – 7 Ogos 2026', dalaman: '', jaj: '', awam: '' },
    { id: 28, week: '28', date: '10 – 14 Ogos 2026', dalaman: '', jaj: '', awam: '' },
    { id: 29, week: '29', date: '17 – 21 Ogos 2026', dalaman: '', jaj: '', awam: '' },
    { id: 30, week: '30', date: '24 – 28 Ogos 2026', dalaman: '', jaj: '', awam: '' },
    { id: 1003, week: '', date: '29.08.2026 – 06.09.2026', dalaman: 'CUTI PENGGAL 2, TAHUN 2026', jaj: '', awam: '', isHoliday: true },
    { id: 31, week: '31', date: '7 – 11 Sep 2026', dalaman: '-', jaj: '', awam: '' },
    { id: 32, week: '32', date: '14 – 18 Sep 2026', dalaman: '16 Sept (Hari Malaysia)', jaj: '16 Sept (Hari Malaysia)', awam: '16 Sept (Hari Malaysia)' },
    { id: 33, week: '33', date: '21 – 25 Sep 2026', dalaman: '', jaj: '', awam: '' },
    { id: 34, week: '34', date: '28 Sep – 2 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 35, week: '35', date: '5 – 9 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 36, week: '36', date: '12 – 16 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 37, week: '37', date: '19 – 23 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 38, week: '38', date: '26 – 30 Okt 2026', dalaman: '', jaj: '', awam: '' },
    { id: 39, week: '39', date: '2 – 6 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 40, week: '40', date: '9 – 13 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 41, week: '41', date: '16 – 20 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 42, week: '42', date: '23 – 27 Nov 2026', dalaman: '', jaj: '', awam: '' },
    { id: 43, week: '43', date: '30 Nov – 4 Dis 2026', dalaman: '', jaj: '', awam: '' },
    { id: 1004, week: '', date: '05.12.2026 – 31.12.2026', dalaman: 'CUTI AKHIR PERSEKOLAHAN TAHUN 2026', jaj: '', awam: '', isHoliday: true },
];

const johorHolidays = [
  { date: '1 Feb', day: 'Ahad', name: 'Hari Thaipusam' },
  { date: '2 Feb', day: 'Isnin', name: 'Cuti Hari Thaipusam' },
  { date: '17 Feb', day: 'Selasa', name: 'Tahun Baru Cina' },
  { date: '18 Feb', day: 'Rabu', name: 'Tahun Baru Cina Hari Kedua' },
  { date: '19 Feb', day: 'Khamis', name: 'Awal Ramadan' },
  { date: '21 Mac', day: 'Sabtu', name: 'Hari Raya Aidilfitri' },
  { date: '22 Mac', day: 'Ahad', name: 'Hari Raya Aidilfitri Hari Kedua' },
  { date: '23 Mac', day: 'Isnin', name: 'Hari Keputeraan Sultan Johor' },
  { date: '23 Mac', day: 'Isnin', name: 'Cuti Hari Raya Aidilfitri' },
  { date: '1 Mei', day: 'Jumaat', name: 'Hari Pekerja' },
  { date: '27 Mei', day: 'Rabu', name: 'Hari Raya Haji' },
  { date: '31 Mei', day: 'Ahad', name: 'Hari Wesak' },
  { date: '1 Jun', day: 'Isnin', name: 'Hari Keputeraan YDP Agong' },
  { date: '1 Jun', day: 'Isnin', name: 'Cuti Hari Wesak' },
  { date: '17 Jun', day: 'Rabu', name: 'Awal Muharram' },
  { date: '21 Jul', day: 'Selasa', name: 'Hari Hol Almarhum Sultan Iskandar' },
  { date: '25 Ogos', day: 'Selasa', name: 'Maulidur Rasul' },
  { date: '31 Ogos', day: 'Isnin', name: 'Hari Kebangsaan' },
  { date: '16 Sep', day: 'Rabu', name: 'Hari Malaysia' },
  { date: '8 Nov', day: 'Ahad', name: 'Hari Deepavali' },
  { date: '9 Nov', day: 'Isnin', name: 'Cuti Hari Deepavali' },
  { date: '25 Dis', day: 'Jumaat', name: 'Hari Krismas' },
];

export const TakwimPlanner: React.FC<TakwimPlannerProps> = ({ type }) => {
  const { user, showToast } = useApp();
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';
  
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());

  // --- STATE FOR EDITABLE TABLES ---
  const [schoolWeeks, setSchoolWeeks] = useState<SchoolWeekRow[]>(initialSchoolWeeks);
  const [examWeeks, setExamWeeks] = useState<ExamWeekRow[]>(initialExamWeeks);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editType, setEditType] = useState<'school' | 'exam'>('school');
  const [editingRow, setEditingRow] = useState<any>(null);

  // --- HANDLERS ---
  const handleOpenEdit = (type: 'school' | 'exam', row: any) => {
      setEditType(type);
      setEditingRow(row);
      setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editType === 'school') {
          setSchoolWeeks(schoolWeeks.map(row => row.id === editingRow.id ? editingRow : row));
      } else {
          setExamWeeks(examWeeks.map(row => row.id === editingRow.id ? editingRow : row));
      }
      setIsEditModalOpen(false);
      showToast("Data berjaya dikemaskini.");
  };

  // --- KALENDAR INTERAKTIF 2026 (PDF REPLICA) ---
  const renderCalendarView = () => {
    const month = calendar2026Data[currentMonthIndex];
    const prevMonth = () => setCurrentMonthIndex(prev => prev > 0 ? prev - 1 : 11);
    const nextMonth = () => setCurrentMonthIndex(prev => prev < 11 ? prev + 1 : 0);

    // Days Columns Configuration (Matches PDF Colors)
    const dayHeaders = [
       { short: 'SUN', long: 'AHAD', bg: 'bg-[#fff59d]', text: 'text-red-600', border: 'border-gray-400' },
       { short: 'MON', long: 'ISNIN', bg: 'bg-[#c5e1a5]', text: 'text-[#1a237e]', border: 'border-gray-400' },
       { short: 'TUE', long: 'SELASA', bg: 'bg-[#90caf9]', text: 'text-[#1a237e]', border: 'border-gray-400' },
       { short: 'WED', long: 'RABU', bg: 'bg-[#ce93d8]', text: 'text-[#1a237e]', border: 'border-gray-400' },
       { short: 'THU', long: 'KHAMIS', bg: 'bg-[#f48fb1]', text: 'text-[#1a237e]', border: 'border-gray-400' },
       { short: 'FRI', long: 'JUMAAT', bg: 'bg-[#ffe082]', text: 'text-[#1a237e]', border: 'border-gray-400' },
       { short: 'SAT', long: 'SABTU', bg: 'bg-[#9fa8da]', text: 'text-[#1a237e]', border: 'border-gray-400' },
    ];

    // Generate Days Grid
    const blanks = Array.from({ length: month.startDay }, (_, i) => i);
    const days = Array.from({ length: month.daysInMonth }, (_, i) => i + 1);

    return (
       <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-300 fade-in text-[#1a237e] max-w-7xl mx-auto">
          {/* NAVIGATION */}
          <div className="bg-[#0B132B] p-2 flex justify-between items-center text-white">
             <button onClick={prevMonth} className="px-4 py-2 hover:bg-[#3A506B] rounded">❮ Bulan Lepas</button>
             <span className="font-bold tracking-widest">KALENDAR 2026</span>
             <button onClick={nextMonth} className="px-4 py-2 hover:bg-[#3A506B] rounded">Bulan Depan ❯</button>
          </div>

          <div className="flex flex-col lg:flex-row">
              {/* LEFT SIDEBAR - CATATAN */}
              <div className="w-full lg:w-1/4 p-6 border-r border-gray-300 bg-white relative">
                  <div className="border-2 border-black rounded-xl p-4 h-full relative">
                      <h3 className="text-xl font-bold text-black font-serif text-center mb-6 uppercase tracking-widest border-b-2 border-black pb-2 mx-auto w-3/4">
                          CATATAN
                      </h3>
                      {month.catatan}
                      
                      {/* Rujukan Footer in Sidebar */}
                      <div className="absolute bottom-4 left-4 right-4 text-[10px] text-gray-500 leading-tight">
                         <p className="font-bold mb-1">Rujukan:</p>
                         <ul className="list-disc list-outside ml-3 space-y-1">
                            <li>Surat Siaran KPM Bil. 3: Kalendar Akademik Tahun 2026 Bagi Sekolah Kerajaan Dan Sekolah Bantuan Kerajaan KPM</li>
                            <li>Surat Pekeliling Akauntan Negara Malaysia (SPANM) Bil. 5 Tahun 2025</li>
                         </ul>
                      </div>
                  </div>
              </div>

              {/* RIGHT SIDE - CALENDAR GRID */}
              <div className="w-full lg:w-3/4 flex flex-col">
                  {/* HEADER */}
                  <div className="flex text-white text-center h-24">
                      <div className={`${month.headerColor1} w-1/4 flex items-center justify-center text-6xl font-serif font-bold`}>
                         {currentMonthIndex + 1}
                      </div>
                      <div className={`${month.headerColor1} w-1/2 flex items-center justify-center text-4xl font-serif font-bold uppercase tracking-widest`}>
                         {month.name.split(' ')[0]} <span className="text-3xl ml-2">{month.name.split(' ')[1]}</span>
                      </div>
                      <div className={`${month.headerColor2} w-1/4 flex flex-col items-center justify-center font-bold px-2`}>
                         <span className="text-lg leading-tight uppercase">{month.islamicMonth.split(' 1')[0]}</span>
                         <span className="text-2xl">{month.islamicMonth.split(' ').pop()}</span>
                      </div>
                  </div>

                  {/* GRID */}
                  <div className="flex-1 p-4">
                      <div className="grid grid-cols-7 gap-3 h-full">
                          {/* HEADERS */}
                          {dayHeaders.map((h, i) => (
                             <div key={i} className={`${h.bg} ${h.border} border-2 rounded-2xl p-2 flex flex-col items-center justify-center h-20 shadow-sm`}>
                                 <span className={`text-3xl font-bold font-serif ${h.text}`}>{h.short}</span>
                                 <span className={`text-[10px] font-bold tracking-widest ${h.text}`}>{h.long}</span>
                             </div>
                          ))}

                          {/* BLANKS */}
                          {blanks.map(b => (
                             <div key={`blank-${b}`} className="min-h-[100px]"></div>
                          ))}

                          {/* DAYS */}
                          {days.map(d => {
                             const event = month.events.find(e => e.day === d);
                             return (
                                <div key={d} className="relative border-2 border-gray-400 rounded-2xl min-h-[100px] bg-white flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Islamic Date */}
                                    {event?.islamicDate && (
                                       <div className="absolute top-1 right-2 text-[10px] font-bold text-gray-600">
                                          {event.islamicDate}
                                       </div>
                                    )}

                                    {/* Gregorian Date */}
                                    <div className={`text-5xl font-serif font-bold p-2 z-10 ${event?.isHoliday ? 'text-red-600' : 'text-[#1a237e]'}`}>
                                        {d}
                                    </div>

                                    {/* Content/Event */}
                                    <div className="flex-1 flex flex-col justify-end items-center pb-1">
                                       {event?.isSchoolHoliday && (
                                           <div className="w-full bg-yellow-300 text-[10px] font-bold text-center py-0.5 uppercase text-black mx-1 rounded">
                                               Cuti Sekolah
                                           </div>
                                       )}
                                       {event?.label && !event.isSchoolHoliday && (
                                           <div className={`w-full text-[9px] font-bold text-center leading-tight px-1 py-1 mx-1 rounded flex flex-col items-center justify-center h-full
                                             ${event.color ? event.color : 'text-black'}
                                           `}>
                                               {event.icon && <span className="text-lg mb-1">{event.icon}</span>}
                                               {event.label}
                                           </div>
                                       )}
                                    </div>
                                </div>
                             )
                          })}
                      </div>
                  </div>
              </div>
          </div>
       </div>
    );
  };

  // --- ACADEMIC CALENDAR TABLE (Refactored to match Lampiran B) ---
  const AcademicCalendarView = () => {
     return (
        <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in text-white">
             {/* HEADER TITLE */}
             <div className="p-6 bg-[#0B132B] border-b border-gray-700 text-center">
                <h3 className="text-xl font-bold text-[#C9B458] font-montserrat uppercase tracking-wider">KALENDAR AKADEMIK SESI 2026</h3>
                <p className="text-sm text-gray-400 mt-2 font-semibold">KUMPULAN B</p>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl mx-auto leading-relaxed">
                  Sekolah-sekolah di negeri: Johor, Melaka, Negeri Sembilan, Pahang, Perak, Perlis, Pulau Pinang, Sabah, Sarawak, Selangor, Wilayah Persekutuan Kuala Lumpur, Wilayah Persekutuan Labuan & Wilayah Persekutuan Putrajaya
                </p>
             </div>

             <div className="overflow-x-auto p-4 md:p-8 flex justify-center bg-white/5">
                 <table className="w-full max-w-5xl text-center border-collapse border border-gray-800 bg-[#1C2541] text-sm shadow-2xl">
                     <thead>
                         <tr className="bg-[#C9B458] text-[#0B132B] font-bold uppercase tracking-tight">
                             <th className="p-3 border border-gray-800 w-24">PENGGAL</th>
                             <th className="p-3 border border-gray-800">MULA<br/>PERSEKOLAHAN</th>
                             <th className="p-3 border border-gray-800">AKHIR<br/>PERSEKOLAHAN</th>
                             <th className="p-3 border border-gray-800 w-24">JUMLAH<br/>HARI</th>
                             <th className="p-3 border border-gray-800 w-24">JUMLAH<br/>MINGGU</th>
                         </tr>
                     </thead>
                     <tbody className="text-gray-300">
                         {/* PENGGAL 1 - BLOCK 1 */}
                         <tr>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-white bg-[#0B132B]">1</td>
                             <td className="border border-gray-700 p-2">12.01.2026</td>
                             <td className="border border-gray-700 p-2">31.01.2026</td>
                             <td className="border border-gray-700 p-2">15</td>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-[#C9B458] bg-[#0B132B]">10</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.02.2026</td>
                             <td className="border border-gray-700 p-2">28.02.2026</td>
                             <td className="border border-gray-700 p-2">15</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.03.2026</td>
                             <td className="border border-gray-700 p-2">20.03.2026</td>
                             <td className="border border-gray-700 p-2">13</td>
                         </tr>
                         <tr className="bg-[#3A506B]/20 font-bold text-[#C9B458]">
                             <td colSpan={2} className="border border-gray-700 p-2 text-right pr-4">JUMLAH HARI</td>
                             <td className="border border-gray-700 p-2">43</td>
                         </tr>

                         {/* CUTI PENGGAL 1 */}
                         <tr className="bg-[#C9B458] text-[#0B132B] font-bold">
                             <td colSpan={5} className="border border-gray-800 p-2 uppercase">CUTI PENGGAL 1, TAHUN 2026</td>
                         </tr>
                         <tr className="bg-[#C9B458]/10 text-white">
                             <td className="border border-gray-700 p-2 bg-[#0B132B]"></td>
                             <td className="border border-gray-700 p-2">21.03.2026</td>
                             <td className="border border-gray-700 p-2">29.03.2026</td>
                             <td className="border border-gray-700 p-2">9</td>
                             <td className="border border-gray-700 p-2 font-bold text-[#C9B458]">1</td>
                         </tr>

                         {/* PENGGAL 1 - BLOCK 2 */}
                         <tr>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-white bg-[#0B132B]">1</td>
                             <td className="border border-gray-700 p-2">30.03.2026</td>
                             <td className="border border-gray-700 p-2">31.03.2026</td>
                             <td className="border border-gray-700 p-2">2</td>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-[#C9B458] bg-[#0B132B]">8</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.04.2026</td>
                             <td className="border border-gray-700 p-2">30.04.2026</td>
                             <td className="border border-gray-700 p-2">22</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.05.2026</td>
                             <td className="border border-gray-700 p-2">22.05.2026</td>
                             <td className="border border-gray-700 p-2">15</td>
                         </tr>
                         <tr className="bg-[#3A506B]/20 font-bold text-[#C9B458]">
                             <td colSpan={2} className="border border-gray-700 p-2 text-right pr-4">JUMLAH HARI</td>
                             <td className="border border-gray-700 p-2">39</td>
                         </tr>

                         {/* CUTI PERTENGAHAN TAHUN */}
                         <tr className="bg-[#C9B458] text-[#0B132B] font-bold">
                             <td colSpan={5} className="border border-gray-800 p-2 uppercase">CUTI PERTENGAHAN TAHUN 2026</td>
                         </tr>
                         <tr className="bg-[#C9B458]/10 text-white">
                             <td className="border border-gray-700 p-2 bg-[#0B132B]"></td>
                             <td className="border border-gray-700 p-2">23.05.2026</td>
                             <td className="border border-gray-700 p-2">07.06.2026</td>
                             <td className="border border-gray-700 p-2">16</td>
                             <td className="border border-gray-700 p-2 font-bold text-[#C9B458]">2</td>
                         </tr>

                         {/* PENGGAL 2 - BLOCK 1 */}
                         <tr>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-white bg-[#0B132B]">2</td>
                             <td className="border border-gray-700 p-2">08.06.2026</td>
                             <td className="border border-gray-700 p-2">30.06.2026</td>
                             <td className="border border-gray-700 p-2">16</td>
                             <td rowSpan={4} className="border border-gray-700 font-bold text-lg text-[#C9B458] bg-[#0B132B]">12</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.07.2026</td>
                             <td className="border border-gray-700 p-2">31.07.2026</td>
                             <td className="border border-gray-700 p-2">23</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.08.2026</td>
                             <td className="border border-gray-700 p-2">28.08.2026</td>
                             <td className="border border-gray-700 p-2">19</td>
                         </tr>
                         <tr className="bg-[#3A506B]/20 font-bold text-[#C9B458]">
                             <td colSpan={2} className="border border-gray-700 p-2 text-right pr-4">JUMLAH HARI</td>
                             <td className="border border-gray-700 p-2">58</td>
                         </tr>

                         {/* CUTI PENGGAL 2 */}
                         <tr className="bg-[#C9B458] text-[#0B132B] font-bold">
                             <td colSpan={5} className="border border-gray-800 p-2 uppercase">CUTI PENGGAL 2, TAHUN 2026</td>
                         </tr>
                         <tr className="bg-[#C9B458]/10 text-white">
                             <td className="border border-gray-700 p-2 bg-[#0B132B]"></td>
                             <td className="border border-gray-700 p-2">29.08.2026</td>
                             <td className="border border-gray-700 p-2">06.09.2026</td>
                             <td className="border border-gray-700 p-2">9</td>
                             <td className="border border-gray-700 p-2 font-bold text-[#C9B458]">1</td>
                         </tr>

                         {/* PENGGAL 2 - BLOCK 2 */}
                         <tr>
                             <td rowSpan={5} className="border border-gray-700 font-bold text-lg text-white bg-[#0B132B]">2</td>
                             <td className="border border-gray-700 p-2">07.09.2026</td>
                             <td className="border border-gray-700 p-2">30.09.2026</td>
                             <td className="border border-gray-700 p-2">17</td>
                             <td rowSpan={5} className="border border-gray-700 font-bold text-lg text-[#C9B458] bg-[#0B132B]">13</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.10.2026</td>
                             <td className="border border-gray-700 p-2">31.10.2026</td>
                             <td className="border border-gray-700 p-2">22</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.11.2026</td>
                             <td className="border border-gray-700 p-2">30.11.2026</td>
                             <td className="border border-gray-700 p-2">19</td>
                         </tr>
                         <tr>
                             <td className="border border-gray-700 p-2">01.12.2026</td>
                             <td className="border border-gray-700 p-2">04.12.2026</td>
                             <td className="border border-gray-700 p-2">4</td>
                         </tr>
                         <tr className="bg-[#3A506B]/20 font-bold text-[#C9B458]">
                             <td colSpan={2} className="border border-gray-700 p-2 text-right pr-4">JUMLAH HARI</td>
                             <td className="border border-gray-700 p-2">62</td>
                         </tr>

                         {/* CUTI AKHIR PERSEKOLAHAN */}
                         <tr className="bg-[#C9B458] text-[#0B132B] font-bold">
                             <td colSpan={5} className="border border-gray-800 p-2 uppercase">CUTI AKHIR PERSEKOLAHAN TAHUN 2026</td>
                         </tr>
                         <tr className="bg-[#C9B458]/10 text-white">
                             <td className="border border-gray-700 p-2 bg-[#0B132B]"></td>
                             <td className="border border-gray-700 p-2">05.12.2026</td>
                             <td className="border border-gray-700 p-2">31.12.2026</td>
                             <td className="border border-gray-700 p-2">27</td>
                             <td className="border border-gray-700 p-2 font-bold text-[#C9B458]">4</td>
                         </tr>

                     </tbody>
                 </table>
             </div>
        </div>
     );
  };

  // --- SCHOOL WEEKS VIEW (Jadual Mingguan 2026) ---
  const SchoolWeeksView = () => {
    return (
        <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse border border-gray-600 min-w-[800px]">
                    <thead>
                        <tr className="bg-[#C9B458] text-[#0B132B] font-bold text-sm uppercase">
                            <th className="border border-gray-600 px-4 py-3">MINGGU</th>
                            <th className="border border-gray-600 px-4 py-3">TARIKH</th>
                            <th className="border border-gray-600 px-4 py-3">PERKARA (cuti jika ada)</th>
                            <th className="border border-gray-600 px-4 py-3">JUM.<br/>HARI</th>
                            <th className="border border-gray-600 px-4 py-3">JUM.<br/>MINGGU</th>
                            {isAdmin && <th className="border border-gray-600 px-4 py-3">EDIT</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {schoolWeeks.map((item) => (
                            <tr key={item.id} className={`${item.isHoliday ? 'bg-[#C9B458] text-[#0B132B] font-bold' : 'hover:bg-[#253252] text-gray-300'}`}>
                                <td className={`border border-gray-600 py-2 ${!item.week && !item.isHoliday ? 'bg-transparent' : ''}`}>
                                    {item.week}
                                </td>
                                <td className="border border-gray-600 py-2 px-2 whitespace-nowrap">{item.date}</td>
                                <td className={`border border-gray-600 py-2 px-2 whitespace-pre-line ${item.isHoliday ? 'uppercase' : ''}`}>
                                    {item.notes}
                                </td>
                                {item.totalDays && (
                                    <td rowSpan={item.rowSpan || 1} className={`border border-gray-600 py-2 align-middle font-semibold ${item.isHoliday ? 'bg-[#C9B458] text-[#0B132B]' : 'bg-[#1C2541] text-white'}`}>
                                        {item.totalDays}
                                    </td>
                                )}
                                {item.totalWeeks && (
                                    <td rowSpan={item.rowSpan || 1} className={`border border-gray-600 py-2 align-middle font-semibold ${item.isHoliday ? 'bg-[#C9B458] text-[#0B132B]' : 'bg-[#1C2541] text-white'}`}>
                                        {item.totalWeeks}
                                    </td>
                                )}
                                {isAdmin && (
                                    <td className="border border-gray-600 py-2 px-2">
                                        <button onClick={() => handleOpenEdit('school', item)} className="text-blue-400 hover:text-white text-xs">✏️</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  // --- TAKWIM PEPERIKSAAN VIEW ---
  const TakwimPeperiksaanView = () => {
    return (
        <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col">
            <div className="p-6 bg-[#0B132B] border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white font-montserrat uppercase flex items-center gap-2">
                    <span className="text-[#C9B458]">📅</span> TAKWIM PEPERIKSAAN 2026
                </h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse border border-gray-600 min-w-[900px]">
                    <thead>
                        <tr className="bg-[#C9B458] text-[#0B132B] text-sm uppercase font-bold">
                            <th className="border border-gray-600 px-2 py-3 w-16">M</th>
                            <th className="border border-gray-600 px-4 py-3 w-40">TARIKH</th>
                            <th className="border border-gray-600 px-4 py-3 w-1/4">PEPERIKSAAN DALAMAN</th>
                            <th className="border border-gray-600 px-4 py-3 w-1/4">PEPERIKSAAN JAJ</th>
                            <th className="border border-gray-600 px-4 py-3 w-1/4">PEPERIKSAAN AWAM</th>
                            {isAdmin && <th className="border border-gray-600 px-2 py-3 w-16">EDIT</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {examWeeks.map((item) => {
                             if (item.isHoliday) {
                                 return (
                                     <tr key={item.id} className="bg-[#C9B458] text-[#0B132B] font-bold uppercase border-b border-gray-600">
                                         <td colSpan={2} className="border border-gray-600 py-3 px-2 text-center">{item.date}</td>
                                         <td colSpan={3} className="border border-gray-600 py-3 px-2 text-center tracking-wide">{item.dalaman}</td>
                                         {isAdmin && (
                                             <td className="border border-gray-600 py-2 px-2 bg-[#0B132B]">
                                                 <button onClick={() => handleOpenEdit('exam', item)} className="text-[#C9B458] hover:text-white font-bold">✏️</button>
                                             </td>
                                         )}
                                     </tr>
                                 );
                             }
                             return (
                                <tr key={item.id} className="hover:bg-[#253252] text-gray-300 transition-colors group">
                                    <td className="border border-gray-600 py-3 font-mono text-[#C9B458] font-bold">{item.week}</td>
                                    <td className="border border-gray-600 py-3 px-2 whitespace-nowrap text-white">{item.date}</td>
                                    <td className="border border-gray-600 py-3 px-2 whitespace-pre-line text-left align-top">{item.dalaman}</td>
                                    <td className="border border-gray-600 py-3 px-2 whitespace-pre-line text-left align-top">{item.jaj}</td>
                                    <td className="border border-gray-600 py-3 px-2 whitespace-pre-line text-left align-top">{item.awam}</td>
                                    {isAdmin && (
                                        <td className="border border-gray-600 py-2 px-2 text-center">
                                             <button onClick={() => handleOpenEdit('exam', item)} className="text-gray-500 hover:text-[#C9B458] transition-colors">✏️</button>
                                        </td>
                                    )}
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Footer hint */}
            <div className="p-3 bg-[#0B132B] border-t border-gray-700 text-xs text-gray-500 text-center italic">
                * Tertakluk kepada pindaan KPM
            </div>
        </div>
    );
  };

  // --- CUTI PERAYAAN VIEW (UPDATED TO LAMPIRAN C DESIGN) ---
  const CutiPerayaanView = () => {
      return (
          <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
             <div className="p-6 bg-[#0B132B] border-b border-gray-700">
                <h3 className="text-xl font-bold text-white font-montserrat uppercase">CUTI PERAYAAN TAHUN 2026</h3>
                <p className="text-sm text-gray-400">Tambahan Cuti Perayaan yang diperuntukkan oleh KPM</p>
             </div>
             
             <div className="overflow-x-auto p-4">
                 <table className="w-full text-center border-collapse border border-gray-600 min-w-[900px]">
                     <thead>
                         <tr>
                             <th rowSpan={2} className="bg-[#C9B458] text-[#0B132B] font-bold p-3 border border-gray-600 w-1/4">CUTI PERAYAAN</th>
                             <th colSpan={2} className="bg-[#C9B458] text-[#0B132B] font-bold p-3 border border-gray-600">TAMBAHAN CUTI PERAYAAN YANG DIPERUNTUKKAN OLEH KEMENTERIAN PENDIDIKAN MALAYSIA (KPM)</th>
                             <th rowSpan={2} className="bg-[#C9B458] text-[#0B132B] font-bold p-3 border border-gray-600 w-1/5">CATATAN</th>
                         </tr>
                         <tr>
                             <th className="bg-[#3A506B] text-white font-bold p-3 border border-gray-600 w-1/4">KUMPULAN A</th>
                             <th className="bg-[#3A506B] text-white font-bold p-3 border border-gray-600 w-1/4">KUMPULAN B</th>
                         </tr>
                     </thead>
                     <tbody className="text-sm text-gray-300">
                         {/* TAHUN BARU CINA */}
                         <tr className="hover:bg-[#253252] transition-colors">
                             <td rowSpan={3} className="p-4 border border-gray-600 align-top font-bold text-white bg-[#1C2541]">
                                 <div className="mb-2 uppercase text-[#C9B458]">Tahun Baru Cina</div>
                                 <div className="text-xs font-normal">17.02.2026 (Selasa)<br/>dan<br/>18.02.2026 (Rabu)</div>
                             </td>
                             <td className="p-3 border border-gray-600">15.02.2026 (Ahad)</td>
                             <td className="p-3 border border-gray-600">16.02.2026 (Isnin)</td>
                             <td rowSpan={3} className="p-3 border border-gray-600 align-middle">
                                 Tiga (3) Hari Cuti Tambahan KPM untuk Kumpulan A dan Kumpulan B
                             </td>
                         </tr>
                         <tr className="hover:bg-[#253252] transition-colors">
                             <td className="p-3 border border-gray-600">16.02.2026 (Isnin)</td>
                             <td className="p-3 border border-gray-600">19.02.2026 (Khamis)</td>
                         </tr>
                         <tr className="hover:bg-[#253252] transition-colors">
                             <td className="p-3 border border-gray-600">19.02.2026 (Khamis)</td>
                             <td className="p-3 border border-gray-600">20.02.2026 (Jumaat)</td>
                         </tr>

                         {/* HARI RAYA AIDILFITRI */}
                         <tr className="hover:bg-[#253252] transition-colors">
                             <td rowSpan={2} className="p-4 border border-gray-600 align-top font-bold text-white bg-[#1C2541]">
                                 <div className="mb-2 uppercase text-[#C9B458]">Hari Raya Aidilfitri</div>
                                 <div className="text-xs font-normal">21.03.2026 (Sabtu)<br/>dan<br/>22.03.2026 (Ahad)</div>
                             </td>
                             <td className="p-3 border border-gray-600">19.03.2026 (Khamis)</td>
                             <td className="p-3 border border-gray-600">19.03.2026 (Khamis)</td>
                             <td rowSpan={2} className="p-3 border border-gray-600 align-middle">
                                 Satu (1) Hari Cuti Tambahan KPM untuk Kumpulan A dan <br/>Dua (2) Hari Cuti Tambahan KPM untuk Kumpulan B
                             </td>
                         </tr>
                         <tr className="hover:bg-[#253252] transition-colors">
                             <td className="p-3 border border-gray-600 bg-gray-700"></td>
                             <td className="p-3 border border-gray-600">20.03.2026 (Jumaat)</td>
                         </tr>

                         {/* HARI DEEPAVALI */}
                         <tr className="hover:bg-[#253252] transition-colors">
                             <td rowSpan={2} className="p-4 border border-gray-600 align-top font-bold text-white bg-[#1C2541]">
                                 <div className="mb-2 uppercase text-[#C9B458]">Hari Deepavali</div>
                                 <div className="text-xs font-normal">08.11.2026 (Ahad)<br/>(kecuali Negeri Sarawak)</div>
                             </td>
                             <td className="p-3 border border-gray-600 align-middle">09.11.2026 (Isnin)</td>
                             <td className="p-3 border border-gray-600">
                                 10.11.2026 (Selasa)<br/>
                                 <span className="text-[10px] italic">Semua Negeri Kumpulan B kecuali Negeri Sarawak</span>
                             </td>
                             <td className="p-3 border border-gray-600 align-middle">
                                 Satu (1) Hari Cuti Tambahan KPM untuk Kumpulan A dan Kumpulan B
                             </td>
                         </tr>
                         <tr className="hover:bg-[#253252] transition-colors">
                             <td className="p-3 border border-gray-600 bg-gray-700"></td>
                             <td className="p-3 border border-gray-600">
                                 09.11.2026 (Isnin)<br/>
                                 <span className="text-[10px] italic">Negeri Sarawak sahaja</span>
                             </td>
                             <td className="p-3 border border-gray-600 align-middle">
                                 Satu (1) Hari Cuti Peruntukan KPM
                             </td>
                         </tr>
                     </tbody>
                 </table>
             </div>

             {/* Footer Information */}
             <div className="p-6 bg-[#0B132B] border-t border-gray-700 text-sm space-y-4">
                 <div>
                     <span className="text-[#C9B458] font-bold block mb-1">KUMPULAN A:</span>
                     <p className="text-gray-400">Sekolah-sekolah di negeri Kedah, Kelantan dan Terengganu.</p>
                 </div>
                 <div>
                     <span className="text-[#C9B458] font-bold block mb-1">KUMPULAN B:</span>
                     <p className="text-gray-400">Sekolah-sekolah di negeri Johor, Melaka, Negeri Sembilan, Pahang, Perak, Perlis, Pulau Pinang, Sabah, Sarawak, Selangor, Wilayah Persekutuan Kuala Lumpur, Wilayah Persekutuan Labuan & Wilayah Persekutuan Putrajaya.</p>
                 </div>
                 <div>
                     <span className="text-[#C9B458] font-bold block mb-1">CATATAN:</span>
                     <ul className="list-disc list-outside ml-5 text-gray-400 space-y-1">
                         <li>
                             <span className="text-white font-semibold">Perayaan Hari Raya Aidilfitri:</span> 21 & 22 Mac 2026 (Dalam Cuti Penggal 1, Tahun 2026)
                         </li>
                         <li>
                             <span className="text-white font-semibold">Pesta Kaamatan:</span> 30 & 31 Mei 2026 (Dalam Cuti Pertengahan Tahun 2026) (Sabah dan Wilayah Persekutuan Labuan sahaja)
                         </li>
                         <li>
                             <span className="text-white font-semibold">Perayaan Hari Gawai Dayak:</span> 01 & 02 Jun 2026 (Dalam Cuti Pertengahan Tahun 2026) (Sarawak sahaja)
                         </li>
                         <li>
                             <span className="text-white font-semibold">Perayaan Hari Krismas:</span> 25 Disember 2026 (Dalam Cuti Akhir Persekolahan Tahun 2026)
                         </li>
                     </ul>
                 </div>
             </div>
          </div>
      )
  };

  // --- CUTI UMUM JOHOR VIEW ---
  const CutiJohorView = () => {
     return (
        <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-[#0B132B] text-white text-xs uppercase tracking-wider">
                             <th className="px-6 py-4 font-bold border border-gray-700 text-[#C9B458]">Tarikh</th>
                             <th className="px-6 py-4 font-bold border border-gray-700">Hari</th>
                             <th className="px-6 py-4 font-bold border border-gray-700">Cuti</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 text-sm">
                        {johorHolidays.map((item, idx) => (
                            <tr key={idx} className="hover:bg-[#253252] transition-colors">
                                <td className="px-6 py-4 border border-gray-700 font-mono text-[#C9B458] font-bold">{item.date}</td>
                                <td className="px-6 py-4 border border-gray-700 text-gray-300">{item.day}</td>
                                <td className="px-6 py-4 border border-gray-700 font-medium text-white">{item.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
     );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#C9B458] font-mono mb-2">
         <span>TAKWIM</span>
         <span>/</span>
         <span className="capitalize">{type}</span>
      </div>

      <h2 className="text-3xl font-bold text-white font-montserrat mb-6">
         {type}
      </h2>

      {type === 'Kalendar' && renderCalendarView()}

      {type === 'Kalendar Akademik' && <AcademicCalendarView />}

      {type === 'Cuti Perayaan' && <CutiPerayaanView />}

      {type === 'Cuti Umum Johor' && <CutiJohorView />}

      {type === 'Minggu Persekolahan' && <SchoolWeeksView />}

      {type === 'Takwim Peperiksaan' && <TakwimPeperiksaanView />}

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && editingRow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
              <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                      Edit {editType === 'school' ? 'Minggu Persekolahan' : 'Takwim Peperiksaan'}
                  </h3>
                  <form onSubmit={handleSaveEdit} className="space-y-4">
                      {editType === 'school' ? (
                          <>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="text-xs text-[#C9B458] uppercase font-bold">Minggu</label>
                                      <input type="text" value={editingRow.week} onChange={e => setEditingRow({...editingRow, week: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                                  </div>
                                  <div>
                                      <label className="text-xs text-[#C9B458] uppercase font-bold">Tarikh</label>
                                      <input type="text" value={editingRow.date} onChange={e => setEditingRow({...editingRow, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                                  </div>
                              </div>
                              <div>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold">Perkara / Catatan</label>
                                  <textarea value={editingRow.notes} onChange={e => setEditingRow({...editingRow, notes: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white h-24" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="text-xs text-[#C9B458] uppercase font-bold">Jum. Hari</label>
                                      <input type="text" value={editingRow.totalDays} onChange={e => setEditingRow({...editingRow, totalDays: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                                  </div>
                                  <div>
                                      <label className="text-xs text-[#C9B458] uppercase font-bold">Jum. Minggu</label>
                                      <input type="text" value={editingRow.totalWeeks} onChange={e => setEditingRow({...editingRow, totalWeeks: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                                  </div>
                              </div>
                          </>
                      ) : (
                          <>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="text-xs text-[#C9B458] uppercase font-bold">Minggu (M)</label>
                                      <input type="text" value={editingRow.week} onChange={e => setEditingRow({...editingRow, week: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" disabled={editingRow.isHoliday} />
                                  </div>
                                  <div>
                                      <label className="text-xs text-[#C9B458] uppercase font-bold">Tarikh</label>
                                      <input type="text" value={editingRow.date} onChange={e => setEditingRow({...editingRow, date: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                                  </div>
                              </div>
                              {editingRow.isHoliday ? (
                                   <div>
                                      <label className="text-xs text-[#C9B458] uppercase font-bold">Keterangan Cuti</label>
                                      <input type="text" value={editingRow.dalaman} onChange={e => setEditingRow({...editingRow, dalaman: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white" />
                                   </div>
                              ) : (
                                  <>
                                    <div>
                                        <label className="text-xs text-[#C9B458] uppercase font-bold">Peperiksaan Dalaman</label>
                                        <textarea value={editingRow.dalaman} onChange={e => setEditingRow({...editingRow, dalaman: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white h-20" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#C9B458] uppercase font-bold">Peperiksaan JAJ</label>
                                        <textarea value={editingRow.jaj} onChange={e => setEditingRow({...editingRow, jaj: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white h-20" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#C9B458] uppercase font-bold">Peperiksaan Awam</label>
                                        <textarea value={editingRow.awam} onChange={e => setEditingRow({...editingRow, awam: e.target.value})} className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white h-20" />
                                    </div>
                                  </>
                              )}
                          </>
                      )}
                      
                      <div className="flex gap-2 pt-4">
                          <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Batal</button>
                          <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400">Simpan</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};