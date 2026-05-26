/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole, UserPreferences } from '../types';
import { Home, Shield, Landmark, Sparkles, RefreshCw, UserCheck, Clock, Layers } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  preferences: UserPreferences;
  onRetakeQuiz: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onChangeRole,
  preferences,
  onRetakeQuiz
}) => {
  const roles: { id: UserRole; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    {
      id: 'client',
      label: 'Tenant (Client)',
      icon: <Home className="w-4 h-4" />,
      desc: 'Browse, book, unlock contacts & chat with robot advisor',
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
    },
    {
      id: 'landlord',
      label: 'Landlord',
      icon: <Landmark className="w-4 h-4" />,
      desc: 'Register rooms, manage statuses & review payouts',
      color: 'bg-blue-500/10 text-blue-700 border-blue-500/20'
    },
    {
      id: 'caretaker',
      label: 'Caretaker',
      icon: <Layers className="w-4 h-4" />,
      desc: 'Track direct vacancies & upload onsite maintenance notes',
      color: 'bg-amber-500/10 text-amber-700 border-amber-500/20'
    },
    {
      id: 'admin',
      label: 'Super Admin',
      icon: <Shield className="w-4 h-4" />,
      desc: 'Platform audit analytics, subscriber plans & fraud check',
      color: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  ShemAnn House Hunting <span className="text-blue-600 font-semibold">Solution</span>
                </h1>
                <p className="text-xs font-mono text-slate-500">Bento Grid Rental Platform • Engineered by Shem & Annitah</p>
              </div>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="flex flex-wrap items-center gap-3 text-slate-600 self-center md:self-auto text-xs sm:text-sm">
            {preferences.hasFilled && (
              <button
                onClick={onRetakeQuiz}
                id="btn-retake-quiz"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-all cursor-pointer shadow-2xs text-xs"
                title="Redo onboarding questionnaire"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Preference Quiz</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50/80 border border-green-200 text-green-700 font-medium text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Availability</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-xs">Nairobi (UTC+3)</span>
            </div>
          </div>
        </div>

        {/* Role Workspace Selector Switch bar */}
        <div className="border-t border-slate-100 py-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <UserCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Workspace Portal Selector</span>
            </div>
            
            <div className="grid grid-cols-2 md:flex flex-wrap items-center gap-2">
              {roles.map((r) => {
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    id={`role-switch-${r.id}`}
                    onClick={() => onChangeRole(r.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-250 text-left cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
