/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { HouseListing, VacancyStatus } from '../types';
import { Layers, UploadCloud, CheckCircle2, AlertCircle, Camera, Check, RefreshCw, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { ProfileHubCard } from './ProfileHubCard';

interface CaretakerViewProps {
  listings: HouseListing[];
  onUpdateVacancy: (id: string, vacancy: VacancyStatus) => void;
}

export const CaretakerView: React.FC<CaretakerViewProps> = ({ listings, onUpdateVacancy }) => {
  const [selectedHouseId, setSelectedHouseId] = useState(listings[0]?.id || '');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Resolve active caretaker session name dynamically
  const [caretakerName, setCaretakerName] = useState(() => {
    const raw = localStorage.getItem('house_hunting_active_user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.role === 'caretaker') return parsed.name;
      } catch (e) {}
    }
    return 'Robert Njuguna';
  });

  // Keep synced in case they change name inside ProfileHubCard
  useEffect(() => {
    const checkSession = () => {
      const raw = localStorage.getItem('house_hunting_active_user');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.role === 'caretaker') {
            setCaretakerName(parsed.name);
          }
        } catch (e) {}
      }
    };
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);
  
  // Caretaker mock rooms checklist
  const [rooms, setRooms] = useState([
    { number: '101', status: 'clean', occupant: 'Alice Mwende' },
    { number: '102', status: 'dirty', occupant: 'Vacant - Requires Soap & Wash' },
    { number: '103', status: 'clean', occupant: 'John Ngige' },
    { number: '104', status: 'maintenance', occupant: 'Leakage repair - Plumber booked' }
  ]);

  // Caretaker communication boards state
  const [notices, setNotices] = useState([
    { id: 1, title: 'Borehole Maintenance Scheduled', body: 'Borehole pump will be offline on Tuesday from 10:00 AM to 1:00 PM for scheduled lubrication.', date: 'Today', resolved: false },
    { id: 2, title: 'Token Meters Replacement', body: 'Safaricom IoT meters will be installed for Rooms 101 to 104 starting next month.', date: '3 days ago', resolved: false }
  ]);

  const activeHouse = listings.find((h) => h.id === selectedHouseId);

  const simulateMediaUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p === null) return 0;
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(null);
            alert('Latest room photograph uploaded successfully and updated on tenant portal details!');
          }, 600);
          return 100;
        }
        return p + 20;
      });
    }, 250);
  };

  const toggleRoomStatus = (roomNumber: string) => {
    setRooms(prev =>
      prev.map((r) => {
        if (r.number === roomNumber) {
          const nextStatus = r.status === 'clean' ? 'dirty' : r.status === 'dirty' ? 'maintenance' : 'clean';
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const resolveNotice = (id: number) => {
    setNotices(prev => prev.map(n => (n.id === id ? { ...n, resolved: !n.resolved } : n)));
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Profile Hub & Security Settings Card */}
      <ProfileHubCard role="caretaker" />

      {/* Upper selector banner */}
      <div className="bg-white border rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest text-slate-455">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Assigned Operations Area:</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-850">
            Caretaker: {caretakerName} (Roysambu & Kasarani Nodes)
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 shrink-0">Working At:</label>
          <select
            value={selectedHouseId}
            onChange={(e) => setSelectedHouseId(e.target.value)}
            className="bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
          >
            {listings.map((hObj) => (
              <option key={hObj.id} value={hObj.id}>
                📍 {hObj.title} ({hObj.location.split(',')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left section: Flat rooms checklist & occupancy updates */}
        <div className="bg-white border rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Room Occupants & Cleaning Checklist
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-450 px-2 py-0.5 rounded font-mono font-bold">
              Unit specific checks
            </span>
          </div>

          <div className="space-y-3">
            {rooms.map((rm) => (
              <div
                key={rm.number}
                className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between gap-3 hover:bg-slate-100/40 transition"
              >
                <div>
                  <span className="text-xs font-extrabold text-slate-850 block">Room {rm.number} Indicator</span>
                  <span className="text-[11px] text-slate-500 truncate max-w-[200px] block">
                    Occupant: {rm.occupant}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRoomStatus(rm.number)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition cursor-pointer capitalize ${
                      rm.status === 'clean'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : rm.status === 'dirty'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    Status: {rm.status}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 font-mono leading-tight bg-slate-50 p-2.5 rounded border border-slate-150">
            💡 Quick Tip: Clicking on the clean/dirty status toggle loops through Status: clean (ready for inspection), dirty (housekeeper flagged), and maintenance (technicians needed).
          </p>
        </div>

        {/* Right Section: Image upload simulator & notices */}
        <div className="space-y-6">
          {/* Photograph snap upload */}
          <div className="bg-white border rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Publish Latest Room Photograph (Tenant Decider)
              </h3>
            </div>

            <div
              onClick={simulateMediaUpload}
              className="border-2 border-dashed border-slate-205 rounded-xl p-6 text-center cursor-pointer hover:bg-emerald-50/20 hover:border-emerald-500 transition-colors flex flex-col items-center justify-center gap-2.5 select-none"
            >
              {isUploading ? (
                <div className="w-full max-w-[200px] space-y-2">
                  <span className="text-xs text-slate-500 block">Uploading room JPG: {uploadProgress}%</span>
                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Drag & drop bathroom/bedroom photos</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">JPEG, PNG fits (Max 5MB)</span>
                  </div>
                  <div className="px-3 py-1 bg-slate-950 text-white rounded text-[10px] font-bold mt-1 shadow-sm flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Trigger Active Upload Simulator</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notices board */}
          <div className="bg-white border rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="pb-2.5 border-b border-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Tenant Bulletins board & Notices
              </h3>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className={`p-3.5 rounded-xl border transition ${n.resolved ? 'bg-slate-100/50 border-slate-200 opacity-60' : 'bg-amber-500/10 border-amber-500/20 text-slate-800'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-xs font-extrabold ${n.resolved ? 'line-through text-slate-500' : 'text-slate-900'}`}>{n.title}</span>
                    <button
                      onClick={() => resolveNotice(n.id)}
                      className={`p-1 rounded-md transition border cursor-pointer ${n.resolved ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-amber-300 text-amber-900 hover:bg-slate-100'}`}
                      title={n.resolved ? "Reactvate alert" : "Mark resolving done"}
                    >
                      {n.resolved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className={`text-[11px] mt-1 leading-relaxed ${n.resolved ? 'text-slate-400' : 'text-slate-650'}`}>{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
