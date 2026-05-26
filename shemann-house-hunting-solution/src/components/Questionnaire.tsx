/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPreferences, HouseType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Home, CircleDollarSign, Users, Car, Waves, ArrowRight, Sparkles, Check } from 'lucide-react';

interface QuestionnaireProps {
  onComplete: (preferences: UserPreferences) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [pref, setPref] = useState<UserPreferences>({
    location: 'any',
    houseType: 'any',
    minBudget: 3000,
    maxBudget: 15000,
    familyMembers: 1,
    parkingNeeded: false,
    waterPreference: 'any',
    hasFilled: false
  });

  const locations = [
    { value: 'any', label: 'Any Area in Nairobi / Kiambu' },
    { value: 'Roysambu', label: 'Roysambu (Bypasses, Thika Road)' },
    { value: 'Kahawa Wendani', label: 'Kahawa Wendani (Comrades, Budget)' },
    { value: 'Westlands', label: 'Westlands (High-end, Serene)' },
    { value: 'Kasarani', label: 'Kasarani (Quiet courts, Standard)' },
    { value: 'Kilimani', label: 'Kilimani (Premium lifestyle, Secure)' },
    { value: 'Madaraka', label: 'Madaraka (Strathmore, Easy Access)' },
    { value: 'Juja', label: 'Juja (JKUAT student hub)' },
    { value: 'Nairobi CBD', label: 'Nairobi CBD (Urban Core)' }
  ];

  const types: { value: HouseType | 'any'; label: string; desc: string }[] = [
    { value: 'any', label: 'Any House Type', desc: 'No specific layout filters' },
    { value: 'single_room', label: 'Single Room', desc: 'Shared washers/baths, highly affordable' },
    { value: 'bedsitter', label: 'Bedsitter (Studio)', desc: 'Self-contained kitchenette + toilet' },
    { value: 'double_room', label: 'Double Room', desc: 'Spacious flat division suitable for co-living' },
    { value: 'one_bedroom', label: 'One Bedroom', desc: 'Private spacious living room + bedroom' },
    { value: 'two_bedroom', label: 'Two Bedroom', desc: 'Ideal for families or larger setups' }
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      const completedPref = { ...pref, hasFilled: true };
      onComplete(completedPref);
    }
  };

  const stepProgress = (step / 5) * 100;

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-transparent px-4 py-8">
      <div id="pref-quiz-card" className="w-full max-w-xl bg-white rounded-3xl border border-slate-205 shadow-xl overflow-hidden">
        {/* Upper Accent Header */}
        <div className="bg-slate-905 bg-gradient-to-br from-slate-950 to-slate-900 p-6 sm:p-8 text-white relative">
          <div className="absolute top-4 right-4 bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full border border-blue-500/20 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Smart Recommendations</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Rental Preference Wizard</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Specify your apartment requirements. Our system filters and recommends fitting rooms immediately to save you money and walking.
          </p>

          {/* Graphical Progress indicator */}
          <div className="mt-6 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono tracking-wider mt-1.5 text-slate-400 uppercase">
            <span>Step {step} of 5</span>
            <span>{Math.round(stepProgress)}% Complete</span>
          </div>
        </div>

        {/* Dynamic Wizard Body */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3>Where would you like to live?</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {locations.map((loc) => (
                    <button
                      key={loc.value}
                      id={`quiz-loc-${loc.value.replace(/\s+/g, '-')}`}
                      onClick={() => setPref({ ...pref, location: loc.value })}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition text-left cursor-pointer ${
                        pref.location === loc.value
                          ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{loc.label}</span>
                      {pref.location === loc.value && (
                        <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center animate-scaleUp">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                  <Home className="w-5 h-5 text-blue-600" />
                  <h3>What is your preferred house type?</h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {types.map((typeObj) => (
                    <button
                      key={typeObj.value}
                      id={`quiz-type-${typeObj.value}`}
                      onClick={() => setPref({ ...pref, houseType: typeObj.value })}
                      className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer ${
                        pref.houseType === typeObj.value
                          ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${pref.houseType === typeObj.value ? 'text-blue-900' : 'text-slate-850'}`}>
                          {typeObj.label}
                        </span>
                        {pref.houseType === typeObj.value && (
                          <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center animate-scaleUp">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">{typeObj.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <CircleDollarSign className="w-5 h-5 text-blue-600" />
                  <h3>What is your monthly budget range?</h3>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-202">
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-2">
                    <span>Rent Budget Maximum:</span>
                    <span className="text-blue-600 font-mono font-bold text-lg">
                      KES {pref.maxBudget.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5000"
                    max="40000"
                    step="500"
                    value={pref.maxBudget}
                    onChange={(e) => setPref({ ...pref, maxBudget: parseInt(e.target.value) })}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-auto cursor-pointer"
                  />

                  <div className="flex justify-between text-xs text-slate-400 font-mono mt-1">
                    <span>KES 5,000/mo</span>
                    <span>KES 20,000/mo</span>
                    <span>KES 40,000/mo</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-lg p-3 flex gap-2.5">
                  <span className="text-base font-bold">💡</span>
                  <span>
                    Our Nairobi and Kiambu database indexes amazing bedsitters from KES 5,500 and premium gated family complexes up to KES 35,000 KES. Adjusting the limit unlocks more opportunities!
                  </span>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3>How many family members/roommates?</h3>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Total Occupants</span>
                    <span className="text-slate-500 text-xs">Used to filter space suitability</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPref({ ...pref, familyMembers: Math.max(1, pref.familyMembers - 1) })}
                      className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-755 bg-white hover:bg-slate-100 transition text-lg select-none"
                    >
                      -
                    </button>
                    <span className="w-8 font-mono font-bold text-center text-base text-slate-900">
                      {pref.familyMembers}
                    </span>
                    <button
                      onClick={() => setPref({ ...pref, familyMembers: Math.min(8, pref.familyMembers + 1) })}
                      className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-755 bg-white hover:bg-slate-100 transition text-lg select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-600">
                  <span className="font-semibold text-slate-850 block mb-0.5">Note on occupants compatibility:</span>
                  {pref.familyMembers === 1 ? (
                    <span>Single rooms or Bedsitters are ideal and budget-friendly.</span>
                  ) : pref.familyMembers <= 3 ? (
                    <span>Double rooms or One-bedroom suites provide proper separation of living space.</span>
                  ) : (
                    <span>Two-bedroom family domains are heavily recommended for adequate comfort.</span>
                  )}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                  <Car className="w-5 h-5 text-blue-600" />
                  <h3>Are there specific amenities you must have?</h3>
                </div>

                {/* Parking needed toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-150 transition-all duration-200">
                  <div className="flex gap-3">
                    <div className="p-2 bg-slate-200/50 rounded-lg text-slate-700">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800 block">Vehicle Parking Bay</span>
                      <span className="text-slate-500 text-xs">Requires gated secure compound space</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setPref({ ...pref, parkingNeeded: !pref.parkingNeeded })}
                    className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                      pref.parkingNeeded ? 'bg-blue-600' : 'bg-slate-350'
                    }`}
                  >
                    <div
                      className={`w-5.5 h-5.5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
                        pref.parkingNeeded ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Water reliability preferences */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-150 transition-all duration-200">
                  <div className="flex gap-3">
                    <div className="p-2 bg-slate-200/50 rounded-lg text-slate-700">
                      <Waves className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800 block">Constant Water Guarantee</span>
                      <span className="text-slate-550 text-xs">Excludes scheduled supply cycles</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setPref({ ...pref, waterPreference: pref.waterPreference === 'any' ? '24_7' : 'any' })}
                    className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                      pref.waterPreference === '24_7' ? 'bg-blue-600' : 'bg-slate-350'
                    }`}
                  >
                    <div
                      className={`w-5.5 h-5.5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
                        pref.waterPreference === '24_7' ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 text-sm font-semibold transition cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              id="quiz-btn-next"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/10 cursor-pointer animate-pulse-slow"
            >
              <span>{step === 5 ? 'Show Match Listings' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
