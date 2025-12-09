import React, { useState } from 'react';
import { User } from '../types';

interface UnitSectionProps {
  title: string;
  user: User | null;
}

type SubMenu = 'jawatankuasa' | 'takwim';

const UnitSection: React.FC<UnitSectionProps> = ({ title, user }) => {
  const [activeTab, setActiveTab] = useState<SubMenu>('jawatankuasa');

  const isAdmin = !!user; // Both Admin and System Admin have access

  // Mock data for Jawatankuasa
  const committeeMembers = [
    { id: 1, name: 'Ustaz Ahmad Bin Abdullah', position: 'Pengerusi', grade: 'DG48' },
    { id: 2, name: 'Puan Siti Aminah Binti Rahmat', position: 'Naib Pengerusi', grade: 'DG44' },
    { id: 3, name: 'Encik Razak Bin Sidek', position: 'Setiausaha', grade: 'DG41' },
    { id: 4, name: 'Cik Nurul Huda', position: 'AJK', grade: 'DG41' },
    { id: 5, name: 'Ustaz Farid Bin Kamil', position: 'AJK', grade: 'DG41' },
  ];

  // Mock data for Takwim
  const calendarEvents = [
    { id: 1, date: '15-01-2026', event: 'Mesyuarat Jawatankuasa Bil. 1/2026', location: 'Bilik Gerakan' },
    { id: 2, date: '20-02-2026', event: 'Program Pemantapan Unit', location: 'Dewan Utama' },
    { id: 3, date: '10-04-2026', event: 'Bengkel Pengurusan Fail', location: 'Makmal Komputer' },
    { id: 4, date: '15-06-2026', event: 'Semakan Takwim Pertengahan Tahun', location: 'Bilik Guru' },
  ];

  return (
    <div className="p-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1 uppercase">{title}</h1>
          <p className="text-gold text-sm font-medium tracking-wider">SESI PERSEKOLAHAN 2026</p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2">
            <button className="bg-slate-blue hover:bg-slate-blue/80 text-white px-4 py-2 rounded shadow-lg border border-white/10 transition-all flex items-center gap-2 text-sm">
              <span>📄</span> Muat Turun PDF
            </button>
            <button className="bg-gold hover:bg-yellow-500 text-navy font-bold px-4 py-2 rounded shadow-lg hover:shadow-gold/50 transition-all flex items-center gap-2 text-sm">
              <span>➕</span> Tambah
            </button>
          </div>
        )}
      </div>

      {/* Submenu Tabs */}
      <div className="flex border-b border-slate-blue mb-8">
        <button
          onClick={() => setActiveTab('jawatankuasa')}
          className={`px-6 py-3 font-medium text-sm transition-all relative ${
            activeTab === 'jawatankuasa' 
              ? 'text-gold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          JAWATANKUASA
          {activeTab === 'jawatankuasa' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold shadow-[0_0_10px_rgba(201,180,88,0.5)]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('takwim')}
          className={`px-6 py-3 font-medium text-sm transition-all relative ${
            activeTab === 'takwim' 
              ? 'text-gold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          TAKWIM 2026
          {activeTab === 'takwim' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold shadow-[0_0_10px_rgba(201,180,88,0.5)]"></div>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-blue-grey rounded-lg shadow-xl border border-slate-blue/30 overflow-hidden min-h-[400px]">
        {activeTab === 'jawatankuasa' && (
          <div className="p-0">
            <div className="bg-navy/50 px-6 py-4 border-b border-slate-blue flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Senarai Jawatankuasa Induk</h3>
              <span className="text-xs text-gray-400 bg-navy px-2 py-1 rounded border border-slate-blue">Tahun 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-blue/20 text-gray-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium border-b border-slate-blue">Bil</th>
                    <th className="p-4 font-medium border-b border-slate-blue">Nama Pegawai</th>
                    <th className="p-4 font-medium border-b border-slate-blue">Jawatan</th>
                    <th className="p-4 font-medium border-b border-slate-blue">Gred</th>
                    {isAdmin && <th className="p-4 font-medium border-b border-slate-blue text-center">Tindakan</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-blue/30 text-gray-300">
                  {committeeMembers.map((member, index) => (
                    <tr key={member.id} className="hover:bg-slate-blue/10 transition-colors">
                      <td className="p-4 text-gray-500">{index + 1}</td>
                      <td className="p-4 font-medium text-white">{member.name}</td>
                      <td className="p-4">{member.position}</td>
                      <td className="p-4"><span className="bg-navy border border-slate-blue px-2 py-0.5 rounded text-xs text-gold">{member.grade}</span></td>
                      {isAdmin && (
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button className="p-2 hover:bg-slate-blue rounded text-yellow-400 hover:text-yellow-300 transition-colors" title="Edit">
                              ✏️
                            </button>
                            <button className="p-2 hover:bg-slate-blue rounded text-red-400 hover:text-red-300 transition-colors" title="Hapus">
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'takwim' && (
          <div className="p-0">
            <div className="bg-navy/50 px-6 py-4 border-b border-slate-blue flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Takwim Aktiviti Unit</h3>
              <span className="text-xs text-gray-400 bg-navy px-2 py-1 rounded border border-slate-blue">Sesi 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-blue/20 text-gray-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium border-b border-slate-blue">Tarikh</th>
                    <th className="p-4 font-medium border-b border-slate-blue">Perkara / Aktiviti</th>
                    <th className="p-4 font-medium border-b border-slate-blue">Lokasi</th>
                    {isAdmin && <th className="p-4 font-medium border-b border-slate-blue text-center">Tindakan</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-blue/30 text-gray-300">
                  {calendarEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-blue/10 transition-colors">
                      <td className="p-4 font-mono text-gold">{event.date}</td>
                      <td className="p-4 font-medium text-white">{event.event}</td>
                      <td className="p-4 text-sm">{event.location}</td>
                      {isAdmin && (
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button className="p-2 hover:bg-slate-blue rounded text-yellow-400 hover:text-yellow-300 transition-colors" title="Edit">
                              ✏️
                            </button>
                            <button className="p-2 hover:bg-slate-blue rounded text-red-400 hover:text-red-300 transition-colors" title="Hapus">
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitSection;