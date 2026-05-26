/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Eye, EyeOff, AlertCircle, HelpCircle, UserPlus, Mail, ShieldAlert, CheckCircle, ArrowLeft, Send, ShieldCheck, User } from 'lucide-react';
import { UserRole, AdmittedLandlord } from '../types';

interface RoleLoginModalProps {
  role: Exclude<UserRole, 'client'> | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: Exclude<UserRole, 'client'>, user: any) => void;
}

// Interface for persisted credentials in local DB
interface MemberAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'landlord' | 'caretaker';
  estateName?: string;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  role,
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Screens/views inside modal: 'login' | 'register' | 'forgot' | 'change_password'
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

  // Account database system in localStorage representation
  const [accounts, setAccounts] = useState<MemberAccount[]>(() => {
    const saved = localStorage.getItem('house_hunting_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Default bootstrap accounts for the sandbox testing
    return [
      { id: 'acc-admin', name: 'Stephen Admin', email: 'admin@shemann.co.ke', phone: '+254 711 000 000', password: 'admin123', role: 'admin' },
      { id: 'acc-landlord', name: 'Wambua Mwangi', email: 'wambua@shemann.co.ke', phone: '+254 712 345 678', password: 'landlord123', role: 'landlord', estateName: 'Roysambu Executive Heights' },
      { id: 'acc-landlord2', name: 'Stephen Onyango', email: 'stephen@shemann.co.ke', phone: '+254 711 223 344', password: 'landlord123', role: 'landlord', estateName: 'Roysambu Heights' },
      { id: 'acc-caretaker', name: 'John Ochieng', email: 'john@shemann.co.ke', phone: '+254 733 987 654', password: 'caretaker123', role: 'caretaker', estateName: 'Roysambu Heights' }
    ];
  });

  // Dynamic user inputs for Sign In
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorError, setErrorError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [shake, setShake] = useState(false);

  // Dynamic user inputs for Account registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regEstate, setRegEstate] = useState('');
  const [regRole, setRegRole] = useState<'landlord' | 'caretaker'>('landlord');

  // Dynamic user inputs for Password Reset simulation steps
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'verification' | 'new_password'>('email');
  const [simulatedCode, setSimulatedCode] = useState('7744');
  const [userResetCode, setUserResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Persist accounts database updates
  useEffect(() => {
    localStorage.setItem('house_hunting_accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Reset states when the role triggers or modal closes
  useEffect(() => {
    setView('login');
    setPassword('');
    setLoginEmail('');
    setErrorError('');
    setSuccessMsg('');
    setShowPassword(false);
    
    // Clear registration fields
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegEstate('');
    setRegRole(role === 'caretaker' ? 'caretaker' : 'landlord');

    // Clear reset password fields
    setResetEmail('');
    setResetStep('email');
    setUserResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
  }, [role, isOpen]);

  if (!role || !isOpen) return null;

  // Retrieve proper labels and default credentials for active workspace node
  const getRoleLabel = () => {
    if (role === 'admin') return 'Superadmin';
    if (role === 'landlord') return 'Landlord Workspace';
    return 'Building Caretaker';
  };

  const getDefaultPassword = () => {
    if (role === 'admin') return 'admin123';
    if (role === 'landlord') return 'landlord123';
    return 'caretaker123';
  };

  const getDefaultEmail = () => {
    if (role === 'admin') return 'admin@shemann.co.ke';
    if (role === 'landlord') return 'wambua@shemann.co.ke';
    return 'john@shemann.co.ke';
  };

  // Instantly autofill email & password sandbox credentials for the target role
  const handleAutofill = () => {
    setLoginEmail(getDefaultEmail());
    setPassword(getDefaultPassword());
    setErrorError('');
  };

  // Validate credentials and trigger login success
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !password.trim()) {
      setErrorError('Please enter your email address and password.');
      return;
    }

    // Attempt to authenticate against user database
    const matchedAccount = accounts.find(
      (acc) => acc.email.toLowerCase() === loginEmail.toLowerCase().trim() && acc.password === password
    );

    if (matchedAccount) {
      // Must check that they are trying to access their designated role space
      // For sandbox we allow Admin to roam, but restrict landlord/caretaker from trespassing
      if (role !== 'admin' && matchedAccount.role !== role) {
        setErrorError(`Access Denied: This account is registered as a "${matchedAccount.role.toUpperCase()}". It does not have access permissions for the "${role.toUpperCase()}" workspace.`);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      // Save active logged-in user context in localStorage
      localStorage.setItem('house_hunting_active_user', JSON.stringify(matchedAccount));
      
      onSuccess(role, matchedAccount);
    } else {
      // Allow fallback default login directly built-in for testing convenience
      if (loginEmail.toLowerCase().trim() === getDefaultEmail() && password === getDefaultPassword()) {
        const fallbackUser = {
          id: `acc-${role}`,
          name: getRoleLabel() + " Person",
          email: getDefaultEmail(),
          phone: '+254 700 000 000',
          role: role,
          estateName: 'Roysambu Executive Heights'
        };
        localStorage.setItem('house_hunting_active_user', JSON.stringify(fallbackUser));
        onSuccess(role, fallbackUser);
      } else {
        setErrorError('Invalid login credentials. Please audit your email/password inputs or click Autofill.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }
  };

  // Handles custom Landlord / Caretaker Account creation
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorError('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorError('All fields are required for profile activation.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorError('Passwords do not match. Please verify your selected credentials.');
      return;
    }
    if (accounts.some((acc) => acc.email.toLowerCase() === regEmail.toLowerCase().trim())) {
      setErrorError('This email is already associated with an active account.');
      return;
    }

    // Write to localized accounts database node
    const newAccount: MemberAccount = {
      id: `acc-${Date.now()}`,
      name: regName,
      email: regEmail.toLowerCase().trim(),
      phone: regPhone,
      password: regPassword,
      role: regRole,
      estateName: regEstate || undefined,
    };

    setAccounts((prev) => [...prev, newAccount]);

    // If they registered as a Landlord, also automatically list them as a verified partner in admittedLandlords
    // so they are admitted and visible inside Superadmin! Excellent UX integration
    const savedLlds = localStorage.getItem('house_admitted_landlords');
    let admittedList: AdmittedLandlord[] = [];
    if (savedLlds) {
      try {
        admittedList = JSON.parse(savedLlds);
      } catch (err) {}
    }
    
    const isAlreadyAdmitted = admittedList.some(ll => ll.landlordContact === regPhone || ll.landlordName === regName);
    if (!isAlreadyAdmitted && regRole === 'landlord') {
      const newLld: AdmittedLandlord = {
        id: `lld-${Date.now()}`,
        landlordName: regName,
        landlordContact: regPhone,
        caretakerName: 'John Ochieng',
        caretakerContact: '+254 733 987 654',
        estateName: regEstate || 'Roysambu Executive Heights',
        subscriptionPaid: true,
        suspended: false,
        joinDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '/')
      };
      localStorage.setItem('house_admitted_landlords', JSON.stringify([newLld, ...admittedList]));
      // Trigger event listener dispatch if active in DOM
      window.dispatchEvent(new Event('storage'));
    }

    setSuccessMsg(`Account created successfully for ${regName}! You can now login with your new credentials.`);
    setView('login');
    // Pre-populate login email
    setLoginEmail(regEmail);
    setPassword(regPassword);
  };

  // Handle simulated password reset sequence of steps
  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorError('');

    const targetAccount = accounts.find((acc) => acc.email.toLowerCase() === resetEmail.toLowerCase().trim());
    if (!targetAccount) {
      setErrorError('We could not find any active account with that email address.');
      return;
    }

    // Launch email verification simulation step
    setResetStep('verification');
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userResetCode === simulatedCode) {
      setResetStep('new_password');
      setErrorError('');
    } else {
      setErrorError('Incorrect simulated verification pass-key. Please enter "7744".');
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrorError('Chosen passwords do not match.');
      return;
    }
    if (newPassword.length < 5) {
      setErrorError('Password must be at least 5 characters for robust protection.');
      return;
    }

    // Change password inside localized db
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.email.toLowerCase() === resetEmail.toLowerCase().trim()) {
          return { ...acc, password: newPassword };
        }
        return acc;
      })
    );

    setSuccessMsg('Security credentials updated! Log in using your new custom password.');
    setView('login');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            x: shake ? [-6, 6, -6, 6, -3, 3, 0] : 0,
          }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative bg-white w-full max-w-md rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xl z-10"
        >
          {/* Accent Brand Top Header Bar (Engineered by Shem & Annitah) */}
          <div className="bg-slate-950 p-6 text-white relative border-b border-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-md shrink-0">
                <KeyRound className="w-5 h-5 text-slate-950" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  {view === 'login' ? 'Secured Portal Access' : view === 'register' ? 'Partner Account creation' : 'Security Reset Wizard'}
                </h3>
                <p className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest">
                  Target: {getRoleLabel()} Node
                </p>
              </div>
            </div>
          </div>

          {/* Form Content body */}
          <div className="p-6 space-y-4">

            {/* Notification alert banners */}
            {errorError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 text-[11px] bg-rose-50 text-rose-800 border border-rose-150 rounded-xl p-3 leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="font-semibold">{errorError}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl p-3 leading-relaxed"
              >
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="font-semibold">{successMsg}</span>
              </motion.div>
            )}

            {/* VIEW A: SIGN IN FORM */}
            {view === 'login' && (
              <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
                <div className="bg-slate-50 border rounded-2xl p-4.5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Access Gate</span>
                  <p className="text-xs text-slate-705 font-bold">
                    Authenticate to enter your safe <span className="text-blue-600 font-extrabold">{getRoleLabel()}</span> platform database.
                  </p>
                </div>

                {/* Email input field - Strictly guarded with anti-autofill */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Registered Email</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="security-node-login-email"
                      name="node-login-email-prevent-autofill"
                      autoComplete="new-password"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (errorError) setErrorError('');
                      }}
                      placeholder="e.g. wambua@shemann.co.ke"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-800 focus:bg-white pl-9.5 pr-4"
                    />
                    <Mail className="w-4 h-4 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password input field - Guarded strictly against browser cache & autofill */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block">Access Password</label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-[10px] font-black text-amber-500 hover:text-amber-600 cursor-pointer uppercase transition"
                    >
                      Forgot? Reset
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      id="security-node-login-password"
                      name="node-login-password-prevent-autofill"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorError) setErrorError('');
                      }}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-mono tracking-widest focus:outline-none focus:border-slate-800 focus:bg-white pl-9.5 pr-10"
                    />
                    <KeyRound className="w-4 h-4 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sandbox Autofill helper desk */}
                <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-655 uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Real Account Sandbox Autofills</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    Simulate real backend accounts! Click to automatically fill active parameters.
                  </p>
                  <button
                    type="button"
                    onClick={handleAutofill}
                    className="w-fit text-[10px] font-black font-mono bg-amber-500 text-slate-950 px-2.5 py-1.5 rounded-lg hover:bg-amber-600 hover:scale-105 transition cursor-pointer flex items-center gap-1 shadow-xs border border-amber-600/20"
                  >
                    <span>Instant Entry: </span>
                    <span className="underline">{getDefaultPassword()}</span>
                  </button>
                </div>

                {/* Bottom Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-black transition cursor-pointer text-center"
                  >
                    Cancel Access
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-slate-950 hover:bg-slate-850 hover:shadow-lg text-white rounded-xl text-xs font-black transition cursor-pointer text-center uppercase tracking-widest"
                  >
                    Unlock Portal
                  </button>
                </div>

                {/* Create Account invitation */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-blue-500" />
                    <span>Don't have a profile yet? <strong className="font-black text-blue-600 underline">Create landord/caretaker account</strong></span>
                  </button>
                </div>
              </form>
            )}

            {/* VIEW B: SIGN UP / REGISTER ACCOUNT */}
            {view === 'register' && (
              <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3.5">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-slate-400 hover:text-slate-700 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Submit Partner profile</span>
                </div>

                {/* Choose role type */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 border rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRegRole('landlord')}
                    className={`py-2 text-center font-bold text-xs rounded-lg transition overflow-hidden cursor-pointer ${
                      regRole === 'landlord' ? 'bg-white text-blue-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Landlord Partner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('caretaker')}
                    className={`py-2 text-center font-bold text-xs rounded-lg transition overflow-hidden cursor-pointer ${
                      regRole === 'caretaker' ? 'bg-white text-amber-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Caretaker
                  </button>
                </div>

                {/* Form fields */}
                <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      autoComplete="new-password"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Isaac Mwangi"
                      className="w-full bg-slate-50 border border-slate-250/70 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-800 focus:bg-white"
                    />
                  </div>

                  {/* Email block */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Email Address (Reset destination)</label>
                    <input
                      type="email"
                      required
                      autoComplete="new-password"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. isaac@shemann.co.ke"
                      className="w-full bg-slate-50 border border-slate-250/70 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-800 focus:bg-white"
                    />
                  </div>

                  {/* Contact Phone field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Real Phone Number (MPESA pushes)</label>
                    <input
                      type="text"
                      required
                      autoComplete="new-password"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. +254 712 990 882"
                      className="w-full bg-slate-50 border border-slate-255/70 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-800 focus:bg-white"
                    />
                  </div>

                  {/* estate location */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-455 uppercase tracking-wider block">Assigned Estate/Apartment Name</label>
                    <input
                      type="text"
                      autoComplete="new-password"
                      value={regEstate}
                      onChange={(e) => setRegEstate(e.target.value)}
                      placeholder="e.g. Roysambu Elite Court"
                      className="w-full bg-slate-50 border border-slate-255/70 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-800 focus:bg-white"
                    />
                  </div>

                  {/* Passwords choose */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Create Password (No auto-fill)</label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      name="node-regpassword-prevent-autofill"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-255/70 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono tracking-widest focus:outline-none focus:border-slate-800 focus:bg-white"
                    />
                  </div>

                  {/* Password confirmation */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Confirm Password</label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      name="node-regconfirm-prevent-autofill"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-255/70 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono tracking-widest focus:outline-none focus:border-slate-800 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Register button actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="flex-1 py-2.5 rounded-xl border border-slate-250 text-slate-700 font-bold text-xs"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow hover:bg-blue-700 transition"
                  >
                    Register Account
                  </button>
                </div>
              </form>
            )}

            {/* VIEW C: PASSWORD RESET WIZARD */}
            {view === 'forgot' && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password Reset Core</span>
                </div>

                {/* Reset Step 1: Input email to request passcode */}
                {resetStep === 'email' && (
                  <form onSubmit={handleResetRequest} autoComplete="off" className="space-y-4">
                    <div className="bg-slate-50 border rounded-2xl p-4 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Verification email Required</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        Enter your registered account email. The system will simulate a secure reset pin trigger.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider">Account Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          autoComplete="new-password"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="e.g. wambua@shemann.co.ke"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-800 pl-9.5"
                        />
                        <Mail className="w-4 h-4 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-black text-xs rounded-xl tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Simulated Reset Link</span>
                    </button>
                  </form>
                )}

                {/* Reset Step 2: Simulated Code Code verification */}
                {resetStep === 'verification' && (
                  <form onSubmit={handleVerifyCodeSubmit} autoComplete="off" className="space-y-4">
                    <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-2xl space-y-2">
                      <span className="text-[10px] text-blue-800 font-black uppercase tracking-wider block">📨 Simulated Cloud Email Inbox</span>
                      <p className="text-xs text-slate-700 font-semibold leading-normal">
                        A secure code was sent to <strong className="text-slate-900 underline">{resetEmail}</strong>.
                      </p>
                      <div className="text-[10px] font-mono bg-slate-950 text-white rounded-lg p-2.5 border border-slate-850">
                        ⚡ ShemAnn Simulated Server Payload:<br />
                        <span className="text-amber-400 font-bold block mt-1">Reset Key: {simulatedCode}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase block tracking-wider">Enter Reset OTP Code</label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        autoComplete="new-password"
                        value={userResetCode}
                        onChange={(e) => setUserResetCode(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 text-center text-lg font-black tracking-widest text-[#0f172a] focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition tracking-wider uppercase flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Code</span>
                    </button>
                  </form>
                )}

                {/* Reset Step 3: Enter new security password */}
                {resetStep === 'new_password' && (
                  <form onSubmit={handleSaveNewPassword} autoComplete="off" className="space-y-4">
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-center text-[11px] font-bold">
                      ✓ Sim Verification Successful! Please set your new password.
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider font-mono">New custom password</label>
                      <input
                        type="password"
                        required
                        autoComplete="new-password"
                        name="node-resetpwd-prevent-autofill"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono pr-4"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider font-mono">Confirm Password</label>
                      <input
                        type="password"
                        required
                        autoComplete="new-password"
                        name="node-resetpwdconfop-prevent"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono pr-4"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-slate-950 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Activate New Password</span>
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
