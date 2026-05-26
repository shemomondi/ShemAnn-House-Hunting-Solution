/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, CheckCircle2, ShieldCheck, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface ProfileHubCardProps {
  role: 'admin' | 'landlord' | 'caretaker';
}

interface MemberAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'landlord' | 'caretaker';
  estateName?: string;
}

export const ProfileHubCard: React.FC<ProfileHubCardProps> = ({ role }) => {
  const [activeAccount, setActiveAccount] = useState<MemberAccount | null>(null);

  // Profile forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [estateName, setEstateName] = useState('');
  
  // Password forms
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // UI status
  const [msgCode, setMsgCode] = useState<'success' | 'error' | ''>('');
  const [msgText, setMsgText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Load user data on mount / role changes
  useEffect(() => {
    // 1. Load active account from local active session key
    const activeRaw = localStorage.getItem('house_hunting_active_user');
    let foundAcc: MemberAccount | null = null;
    
    if (activeRaw) {
      try {
        foundAcc = JSON.parse(activeRaw);
      } catch (e) {}
    }

    // 2. Fallbacks if no active user session, search accounts list
    if (!foundAcc || foundAcc.role !== role) {
      const savedAccountsRaw = localStorage.getItem('house_hunting_accounts');
      if (savedAccountsRaw) {
        try {
          const arr: MemberAccount[] = JSON.parse(savedAccountsRaw);
          const matched = arr.find(a => a.role === role);
          if (matched) foundAcc = matched;
        } catch (e) {}
      }
    }

    // 3. Ultimate mock default state if db is blank
    if (!foundAcc) {
      const defaultPasswords: Record<string, string> = { admin: 'admin123', landlord: 'landlord123', caretaker: 'caretaker123' };
      const defaultNames: Record<string, string> = { admin: 'Super Admin', landlord: 'Wambua Mwangi', caretaker: 'John Ochieng' };
      const defaultEmails: Record<string, string> = { admin: 'admin@shemann.co.ke', landlord: 'wambua@shemann.co.ke', caretaker: 'john@shemann.co.ke' };
      const defaultPhones: Record<string, string> = { admin: '+254 711 000 000', landlord: '+254 712 345 678', caretaker: '+254 733 987 654' };
      
      foundAcc = {
        id: `acc-${role}`,
        name: defaultNames[role],
        email: defaultEmails[role],
        phone: defaultPhones[role],
        password: defaultPasswords[role],
        role: role,
        estateName: role === 'admin' ? undefined : 'Roysambu Executive Heights'
      };
    }

    setActiveAccount(foundAcc);
    setName(foundAcc.name);
    setEmail(foundAcc.email);
    setPhone(foundAcc.phone);
    setEstateName(foundAcc.estateName || '');
  }, [role]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMsgCode('');
    setMsgText('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setMsgCode('error');
      setMsgText('Legal Name, Email and Contact Number fields cannot be left blank.');
      return;
    }

    let updatedPassword = activeAccount?.password || 'landlord123';
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setMsgCode('error');
        setMsgText('New Chosen Passwords do not match. Please verify.');
        return;
      }
      if (newPassword.length < 5) {
        setMsgCode('error');
        setMsgText('Password must be at least 5 characters for protection.');
        return;
      }
      updatedPassword = newPassword;
    }

    const updatedAccount: MemberAccount = {
      id: activeAccount?.id || `acc-${role}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: updatedPassword,
      role: role,
      estateName: estateName ? estateName.trim() : undefined
    };

    // Save active user back to session
    localStorage.setItem('house_hunting_active_user', JSON.stringify(updatedAccount));
    setActiveAccount(updatedAccount);

    // Save into centralized account collection list
    const savedAccountsRaw = localStorage.getItem('house_hunting_accounts');
    let accountsArr: MemberAccount[] = [];
    if (savedAccountsRaw) {
      try {
        accountsArr = JSON.parse(savedAccountsRaw);
      } catch (e) {}
    }

    // Filter old instance and insert new
    accountsArr = accountsArr.filter(a => a.id !== updatedAccount.id && a.email !== updatedAccount.email);
    accountsArr.push(updatedAccount);
    localStorage.setItem('house_hunting_accounts', JSON.stringify(accountsArr));

    // Also update landlord name inside any admitted Landlord register row to avoid stale statistics
    if (role === 'landlord') {
      const savedLldsRaw = localStorage.getItem('house_admitted_landlords');
      if (savedLldsRaw) {
        try {
          const lldArr = JSON.parse(savedLldsRaw);
          const updatedLldArr = lldArr.map((ll: any) => {
            if (ll.landlordContact === phone || ll.landlordName === activeAccount?.name) {
              return { ...ll, landlordName: name, landlordContact: phone, estateName: estateName || ll.estateName };
            }
            return ll;
          });
          localStorage.setItem('house_admitted_landlords', JSON.stringify(updatedLldArr));
        } catch (e) {}
      }
    }

    setMsgCode('success');
    setMsgText('Profile details & security credentials updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
    
    // Auto collapse after successful save delay
    setTimeout(() => {
      setMsgCode('');
      setMsgText('');
    }, 4500);

    // Dispatch global storage event to automatically trigger UI state changes
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="bg-gradient-to-tr from-slate-50 via-white to-slate-50 border border-slate-200 rounded-3xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-750 font-mono text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Profile & Security Panel</span>
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase">
            Logged In: <span className="text-emerald-700">{activeAccount?.name || 'Loading Account info...'}</span>
          </h3>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Workspace Account Identity: <span className="font-mono font-bold text-slate-700">{activeAccount?.email}</span>
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 text-xs font-black bg-slate-900 text-white rounded-xl hover:bg-slate-800 hover:scale-[1.02] transition cursor-pointer self-start sm:self-center"
        >
          {isExpanded ? 'Collapse Profile Settings' : 'Edit Profile & Change Password'}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleUpdateProfile} className="mt-5 border-t border-slate-200/80 pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LEGAL NAME */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Legal Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoComplete="new-password"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:bg-white focus:border-indigo-600 pl-9"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* EMAIL ADDRESS */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Email Address (Login ID)</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="new-password"
                  value={email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-bold focus:outline-none pl-9 cursor-not-allowed"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* PHONE NUMBER */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Contact Phone</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoComplete="new-password"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:bg-white focus:border-indigo-600 pl-9"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* PROPERTY / ESTATE NAME */}
            {role !== 'admin' && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Apartment Estate Node</label>
                <input
                  type="text"
                  autoComplete="new-password"
                  value={estateName}
                  onChange={(e) => setEstateName(e.target.value)}
                  placeholder="e.g. Roysambu Elite Court"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>
            )}
          </div>

          {/* PASSWORD RESET MODULES */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-slate-450 tracking-wider">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>Security Access Password credentials Manager</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Leave password blank if you do not want to change your current safe code.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Choose New Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="new-password"
                    name="profile-hub-prevent-autofill-p1"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono tracking-widest block focus:outline-none focus:bg-white pl-9 pr-10"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="new-password"
                    name="profile-hub-prevent-autofill-p2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono tracking-widest block focus:outline-none focus:bg-white pl-9"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {msgText && (
            <div className={`p-3 rounded-xl border text-xs font-semibold leading-relaxed flex items-center gap-2 ${
              msgCode === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-150' : 'bg-rose-50 text-rose-800 border-rose-150'
            }`}>
              {msgCode === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{msgText}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setNewPassword('');
                setConfirmPassword('');
                setMsgCode('');
                setMsgText('');
              }}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-indigo-500/10 uppercase tracking-wider"
            >
              Save Security & Account Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
