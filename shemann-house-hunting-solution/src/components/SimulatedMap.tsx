/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HouseListing } from '../types';
import { Navigation, MapPin, Search, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface SimulatedMapProps {
  listings: HouseListing[];
  selectedListing: HouseListing | null;
  onSelectListing: (listing: HouseListing) => void;
  userGpsEnabled: boolean;
  onToggleGps: () => void;
  gpsRadius: number; // in km
  onGpsRadiusChange: (val: number) => void;
}

export const SimulatedMap: React.FC<SimulatedMapProps> = ({
  listings,
  selectedListing,
  onSelectListing,
  userGpsEnabled,
  onToggleGps,
  gpsRadius,
  onGpsRadiusChange
}) => {
  const [zoom, setZoom] = useState(1);
  const userLat = 50; // visual coordinate
  const userLng = 50; // visual coordinate

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-950 shadow-inner overflow-hidden flex flex-col h-full min-h-[500px] text-white">
      {/* Map Control Top Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-350">
            Nairobi GPS Cartography
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* GPS Switch */}
          <button
            onClick={onToggleGps}
            id="map-gps-toggle"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
              userGpsEnabled
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-755'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${userGpsEnabled ? 'animate-bounce' : ''}`} />
            <span>{userGpsEnabled ? 'GPS: Enabled' : 'Simulate GPS Location'}</span>
          </button>

          {/* Map utilities */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.7, z - 0.1))}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* GPS Radius Slider Panel (Visible when GPS active) */}
      {userGpsEnabled && (
        <div className="px-4 py-2.5 bg-emerald-950/70 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-emerald-100 text-xs">
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="text-emerald-400">📍 User Station:</span>
            <span>Nairobi CBD (Simulated GPS Base)</span>
          </div>
          
          <div className="flex items-center gap-3 flex-1 sm:max-w-xs">
            <span className="font-mono text-[11px] shrink-0 text-emerald-300">
              Radius: {gpsRadius} km
            </span>
            <input
              type="range"
              min="2"
              max="35"
              step="1"
              value={gpsRadius}
              onChange={(e) => onGpsRadiusChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-700 accent-emerald-500 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Core Map Canvas (SVG design layout of Nairobi neighborhoods) */}
      <div className="flex-1 relative overflow-hidden bg-slate-900/90 select-none">
        {/* Visual Map Grid Canvas */}
        <div
          className="absolute inset-0 transition-transform duration-300 flex items-center justify-center origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Nairobi simulated SVG backdrop */}
          <svg className="w-full h-full min-h-[460px] opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Thika Superhighway Bypass */}
            <path d="M 50,0 Q 40,30 38,42 T 25,58 T 15,85" fill="none" stroke="#64748b" strokeWidth="2.5" />
            {/* Waiyaki Way */}
            <path d="M 0,20 Q 30,22 50,50 T 80,75" fill="none" stroke="#475569" strokeWidth="1.8" />
            {/* Langata / Ngong Road */}
            <path d="M 50,54 Q 65,48 80,55" fill="none" stroke="#475569" strokeWidth="1.2" />
            
            {/* Karura Forest Forest box */}
            <rect x="18" y="15" width="22" height="15" fill="#065f46" rx="4" opacity="0.4" />
            {/* JKUAT Campus zone */}
            <circle cx="15" cy="85" r="7" fill="#1e3a8a" opacity="0.3" />

            {/* Region indicators */}
            <text x="50" y="52" fill="#fff" fontSize="2" fontWeight="bold" opacity="0.5" textAnchor="middle">Nairobi CBD</text>
            <text x="65" y="23" fill="#fff" fontSize="2" opacity="0.4" textAnchor="middle">Westlands</text>
            <text x="36" y="38" fill="#fff" fontSize="2" opacity="0.4" textAnchor="middle">Roysambu</text>
            <text x="73" y="46" fill="#fff" fontSize="2" opacity="0.4" textAnchor="middle">Kilimani</text>
            <text x="14" y="80" fill="#fff" fontSize="2" opacity="0.4" textAnchor="middle">Juja (JKUAT)</text>
          </svg>

          {/* GPS search area pulse ring */}
          {userGpsEnabled && (
            <div
              className="absolute pointer-events-none rounded-full border-2 border-emerald-500/55 bg-emerald-500/5 animate-pulse flex items-center justify-center"
              style={{
                left: `${userLng}%`,
                top: `${userLat}%`,
                width: `${gpsRadius * 6}px`,
                height: `${gpsRadius * 6}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Center user dot */}
              <div className="w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-lg relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>
          )}

          {/* Dynamic Pin listings */}
          {listings.map((house) => {
            const isSelected = selectedListing?.id === house.id;
            const distance = house.distanceFromCBD;
            
            // If GPS is enabled, check if the house is within the defined radius limit
            const isOutOfGpsRadius = userGpsEnabled && distance > gpsRadius;

            return (
              <button
                key={house.id}
                id={`map-pin-${house.id}`}
                onClick={() => onSelectListing(house)}
                className={`absolute group transition-all duration-300 ${
                  isOutOfGpsRadius
                    ? 'opacity-20 scale-75 pointer-events-none'
                    : 'opacity-100 hover:scale-120 cursor-pointer z-10'
                }`}
                style={{
                  left: `${house.lng}%`,
                  top: `${house.lat}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative">
                  {/* Pin Layout wrapper */}
                  <div
                    className={`p-1.5 rounded-full flex items-center justify-center transition shadow-md border ${
                      isSelected
                        ? 'bg-emerald-500 border-white text-white z-20 scale-110'
                        : isOutOfGpsRadius
                        ? 'bg-slate-700 border-slate-800 text-slate-500'
                        : 'bg-slate-950 border-emerald-500 text-emerald-400 hover:border-white'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>

                  {/* Micro Rent Bubble */}
                  <div
                    className={`absolute -top-7 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-950 text-emerald-300 border-slate-800'
                    }`}
                  >
                    KES {Math.round(house.price / 1000)}k
                  </div>

                  {/* Hover detail tooltip card */}
                  {!isOutOfGpsRadius && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-8 hidden group-hover:flex w-44 bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-xl flex-col text-left gap-1 pointer-events-none z-30 transition">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                        {house.location.split(',')[0]}
                      </span>
                      <span className="text-xs font-bold truncate text-white">{house.title}</span>
                      <span className="text-xs font-bold font-mono text-emerald-400">
                        KES {house.price.toLocaleString()}/mo
                      </span>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
                        <span className="capitalize">{house.type.replace('_', ' ')}</span>
                        <span>{house.distanceFromCBD} km to CBD</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Footer status */}
      <div className="px-4 py-2 bg-slate-950 text-[11px] text-slate-400 flex justify-between items-center font-mono border-t border-slate-800">
        <span>Click pin to inspect full house listing</span>
        <span>Index count: {listings.length} nodes available</span>
      </div>
    </div>
  );
};
