/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { HouseListing, Review } from '../types';
import { Star, X, Check, Waves, Zap, Car, ShieldCheck, Heart, CircleAlert, Send } from 'lucide-react';

interface ListingDetailsModalProps {
  house: HouseListing;
  onClose: () => void;
  onAddReview: (houseId: string, rating: number, comment: string, category: 'security' | 'water' | 'cleanliness' | 'landlord_behavior' | 'general') => void;
}

export const ListingDetailsModal: React.FC<ListingDetailsModalProps> = ({
  house,
  onClose,
  onAddReview
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<'security' | 'water' | 'cleanliness' | 'landlord_behavior' | 'general'>('general');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please fill out descriptions before submitting review.');
      return;
    }
    onAddReview(house.id, rating, comment, category);
    setComment('');
    alert('Thank you! Your ratings and review have been registered on this flat listing.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left column: Visual Images Gallery Carousel (40%) */}
        <div className="md:w-1/2 bg-slate-100 flex flex-col justify-between p-4 border-b md:border-b-0 md:border-r border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono bg-slate-950 text-emerald-400 px-2.5 py-1 rounded font-bold border border-slate-800 uppercase tracking-widest block">
              Gallery Selects
            </span>
            <button
              onClick={onClose}
              className="md:hidden text-slate-500 hover:text-slate-950 p-1 bg-white border rounded-full shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Big image */}
          <div className="flex-1 min-h-[220px] max-h-[350px] rounded-xl overflow-hidden relative border bg-slate-900 border-slate-200 shadow-inner">
            <img
              src={house.images[activeImageIdx]}
              alt={house.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mini selectors carousel list */}
          <div className="grid grid-cols-4 gap-2.5 mt-4 shrink-0">
            {house.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`h-16 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                  activeImageIdx === i ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200'
                }`}
              >
                <img src={img} alt={`Gallery ${i}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Specs, Amenities, and Review logging forms (60%) */}
        <div className="md:w-1/2 flex flex-col justify-between max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex justify-between items-start shrink-0">
            <div>
              <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-emerald-600 block mb-0.5">
                📍 {house.location}
              </span>
              <h3 className="text-lg font-extrabold leading-tight text-slate-950">{house.title}</h3>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 border px-2 py-0.5 rounded-md mt-1.5 inline-block capitalize">
                {house.type.replace('_', ' ')} layout
              </span>
            </div>

            <button
              onClick={onClose}
              className="hidden md:block text-slate-400 hover:text-slate-950 p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details & Specs Body (Scrollable container) */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1">
            {/* Rent tag and proximity info */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-450 font-semibold block">Monthly lease value:</span>
                <span className="text-lg font-black text-emerald-600 font-mono">KES {house.price.toLocaleString()}/mo</span>
              </div>
              <div className="text-right sm:text-left text-xs text-slate-650 font-semibold">
                <span className="block">🏡 Proximity to CBD:</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{house.distanceFromCBD} km away</span>
              </div>
            </div>

            {/* Internal descriptors */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wide">House Description:</span>
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">{house.description}</p>
            </div>

            {/* Core Utilities checks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-3 bg-slate-50 border rounded-xl flex gap-2.5 items-center">
                <Waves className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold block text-slate-900">Water Source</span>
                  <span className="text-slate-550 capitalize">{house.waterReliability.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border rounded-xl flex gap-2.5 items-center">
                <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold block text-slate-900">Electricity</span>
                  <span className="text-slate-550 capitalize">{house.electricity} system</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border rounded-xl flex gap-2.5 items-center">
                <Car className="w-5 h-5 text-slate-700 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold block text-slate-900">Tenant Parking</span>
                  <span className="text-slate-550">{house.parking ? 'Allocated slot' : 'Not available'}</span>
                </div>
              </div>
            </div>

            {/* Quality Ratings stars checklist */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wide">Verified Tenant Quality Scores:</span>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Security</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span className="font-mono font-bold text-xs text-slate-850">{house.securityRating}/5</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Cleanliness</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span className="font-mono font-bold text-xs text-slate-850">{house.cleanlinessRating}/5</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Landlord</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span className="font-mono font-bold text-xs text-slate-850">{house.landlordBehaviorRating}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Grid checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wide">Included Amenities list:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-650">
                {house.amenities.map((am, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* List of tenant reviews */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wide block">Tenant Reviews Board ({house.reviews.length}):</span>
              {house.reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews written for this apartment yet. Be the first occupant to leave a ratings audit!</p>
              ) : (
                <div className="space-y-2.5">
                  {house.reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-slate-850">{rev.tenantName}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="font-mono font-bold">{rev.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs font-medium italic">"{rev.comment}"</p>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                        <span className="capitalize">Topic: {rev.category.replace('_', ' ')}</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review write builder footer Form */}
          <div className="p-5 bg-slate-50 border-t border-slate-100 shrink-0">
            <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-tighter block mb-2">Leave your verified review check:</span>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-slate-700"
                  >
                    <option value="general">💼 General review</option>
                    <option value="security">🛡️ Security review</option>
                    <option value="water">💧 Water reliability</option>
                    <option value="cleanliness">🧹 Cleanliness check</option>
                    <option value="landlord_behavior">🙋‍♂️ Landlord behavior</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 select-none">
                  <span className="text-xs font-bold text-slate-650 shrink-0">Score:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star className={`w-4 class h-4 ${rating >= s ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Review landlord behavior, water consistency, water pressure, safety Wall..."
                  className="flex-1 bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-slate-950 text-white hover:bg-slate-850 px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
