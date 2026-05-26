/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { HouseListing, HouseType, VacancyStatus, Booking, WaterReliability, ElectricityType, AdmittedLandlord } from '../types';
import { Landmark, Plus, Trash2, Calendar, FileText, BadgeCheck, Check, Sparkles, AlertCircle, RefreshCw, Upload, X, Image } from 'lucide-react';
import { ProfileHubCard } from './ProfileHubCard';

interface LandlordViewProps {
  listings: HouseListing[];
  onAddListing: (listing: Omit<HouseListing, 'reviews'>) => void;
  onUpdateVacancy: (id: string, vacancy: VacancyStatus) => void;
  onDeleteListing: (id: string) => void;
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, status: 'confirmed' | 'rejected') => void;
  admittedLandlords: AdmittedLandlord[];
}

export const LandlordView: React.FC<LandlordViewProps> = ({
  listings,
  onAddListing,
  onUpdateVacancy,
  onDeleteListing,
  bookings,
  onUpdateBookingStatus,
  admittedLandlords
}) => {
  // Add listings state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Roysambu, Nairobi');
  const [price, setPrice] = useState<number>(10000);
  const [type, setType] = useState<HouseType>('bedsitter');
  const [description, setDescription] = useState('');
  const [parking, setParking] = useState(false);
  const [waterReliability, setWaterReliability] = useState<WaterReliability>('24/7');
  const [electricity, setElectricity] = useState<ElectricityType>('prepaid');
  const [caretakerName, setCaretakerName] = useState('Alex Mwita');
  const [caretakerContact, setCaretakerContact] = useState('+254 711 999 000');
  
  // Simulated subscription payment state
  const [isPayingSub, setIsPayingSub] = useState(false);

  // Dynamic Image Upload States
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const BEAUTIFUL_TEMPLATES = [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setUploadedImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file as any);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setUploadedImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file as any);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Resolve active landlord session name dynamically
  const [LandlordName, setSessionLandlordName] = useState(() => {
    const raw = localStorage.getItem('house_hunting_active_user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.role === 'landlord') return parsed.name;
      } catch (e) {}
    }
    return 'Wambua Mwangi';
  });

  // Keep synced in case they change name inside ProfileHubCard
  useEffect(() => {
    const checkSession = () => {
      const raw = localStorage.getItem('house_hunting_active_user');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.role === 'landlord') {
            setSessionLandlordName(parsed.name);
          }
        } catch (e) {}
      }
    };
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  const activeLandlordInfo = admittedLandlords.find(
    (ll) => ll.landlordName === LandlordName || ll.landlordContact === '+254 712 345 678'
  ) || {
    id: 'placeholder',
    landlordName: LandlordName,
    landlordContact: '+254 712 345 678',
    caretakerName: 'Robert Njuguna',
    caretakerContact: '+254 799 111 222',
    estateName: 'Roysambu Executive Heights',
    subscriptionPaid: true,
    suspended: false,
    joinDate: '10/Mar/2026',
  };

  const isSuspended = activeLandlordInfo.suspended;
  const subscriptionPaid = activeLandlordInfo.subscriptionPaid;

  // Form submit handler
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSuspended) {
      alert('Your account is currently suspended due to an outstanding subscription. Please settle your dues with the administrator.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      alert('Please fill out all house specifications fields.');
      return;
    }

    const finalImages = uploadedImages.length > 0 ? uploadedImages : [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
    ];

    const newListing: Omit<HouseListing, 'reviews'> = {
      id: `h-landlord-${Date.now()}`,
      title,
      location,
      price,
      type,
      vacancy: 'vacant',
      description,
      images: finalImages,
      parking,
      waterReliability,
      electricity,
      securityRating: 4.5,
      cleanlinessRating: 4.4,
      landlordBehaviorRating: 4.8,
      distanceFromCBD: 12.0,
      landlordName: 'Wambua Mwangi (Self)',
      landlordContact: '+254 712 345 678',
      caretakerName: activeLandlordInfo.caretakerName || caretakerName,
      caretakerContact: activeLandlordInfo.caretakerContact || caretakerContact,
      isFeatured: false,
      amenities: ['Tiled Floors', 'Instant Shower', 'Safe Compound'],
      lat: 40 + Math.random() * 20,
      lng: 40 + Math.random() * 20
    };

    onAddListing(newListing);
    setTitle('');
    setDescription('');
    setPrice(10000);
    setUploadedImages([]);
    alert('Rental listing uploaded successfully and catalogued in our active Nairobi database!');
  };

  // Landlord specific filters in database context (Landlord owns some mock listings)
  const landlordListings = listings.filter(h => h.landlordName.includes('Wambua Mwangi') || h.id.startsWith('h-landlord'));
  const landlordBookings = bookings.filter(b => landlordListings.some(l => l.id === b.listingId));

  const buyPremiumSubscription = () => {
    alert('Subscription status is verified and managed by the Superadmin portal. Settle the monthly KES 1,500 via admin.');
  };

  return (
    <div className="space-y-8">
      {/* Landlord Profile & Security Management Panel */}
      <ProfileHubCard role="landlord" />

      {isSuspended && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-5 flex gap-4 items-start text-red-900 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-red-955 text-sm">Workspace Account Suspended!</h4>
            <p className="text-xs text-red-700 leading-relaxed font-semibold">
              Your Landlord portal has been suspended by the Superadmin due to outstanding monthly subscription invoices. Your vacant properties are temporarily locked for customer unlock requests and reservation bookings. Settle the subscription with administration to reactivate immediately.
            </p>
          </div>
        </div>
      )}

      {/* Upper Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Logged profile:</span>
            <span className="text-base font-extrabold text-slate-850 block">{LandlordName}</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-100">Verified Partner</span>
          </div>
          <div className="p-3 bg-slate-50 border rounded-xl text-slate-600">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Partner Subscription:</span>
            <span className="text-base font-extrabold text-slate-850 block">
              {subscriptionPaid ? 'Elite Premium Tier' : 'Basic Free Tier'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Renews Monthly</span>
          </div>
          <div>
            {subscriptionPaid ? (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 flex items-center gap-1">
                Active Promo
              </span>
            ) : (
              <button
                onClick={buyPremiumSubscription}
                disabled={isPayingSub}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-105 transition-all text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
              >
                {isPayingSub ? 'Processing...' : 'Go Premium KES 1,500'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Total Owned Units:</span>
            <span className="text-base font-extrabold text-slate-850 block">{landlordListings.length} Houses Registered</span>
            <span className="text-[10px] font-mono text-slate-400">
              {landlordListings.filter(h => h.vacancy === 'vacant').length} vacant available
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Add New Listing Form */}
        <div className="lg:col-span-4 bg-white border rounded-2xl p-5 shadow-2xs h-fit space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-slate-800">
            <Plus className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Register Vacant Apartment</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-650 block mb-1">House/Estate Title name:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lavender Ridge Bedsitters"
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-650 block mb-1">Rent Cost (KES/mo):</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                  min="3000"
                  max="60000"
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-650 block mb-1">House Design Layout:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-2.5 py-2 text-xs focus:outline-none font-semibold"
                >
                  <option value="single_room">Single Room</option>
                  <option value="bedsitter">Bedsitter</option>
                  <option value="double_room">Double Room</option>
                  <option value="one_bedroom">One Bedroom</option>
                  <option value="two_bedroom">Two Bedroom</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-650 block mb-1">Nairobi District Zone:</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-2.5 py-2 text-xs focus:outline-none font-semibold"
              >
                <option value="Roysambu, Nairobi">Roysambu</option>
                <option value="Kahawa Wendani, Nairobi">Kahawa Wendani</option>
                <option value="Kasarani, Nairobi">Kasarani</option>
                <option value="Westlands, Nairobi">Westlands</option>
                <option value="Kilimani, Nairobi">Kilimani</option>
                <option value="Madaraka, Nairobi">Madaraka</option>
                <option value="Juja, Kiambu">Juja</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-650 block mb-1">Internal Room Specifications Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Detail high security checkpoints, tiled finishes, prepaid tokens meter, and transport accessibility..."
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-100">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-650">
                <input
                  type="checkbox"
                  checked={parking}
                  onChange={(e) => setParking(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span>Vehicle Parking</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Water Source:</label>
                <select
                  value={waterReliability}
                  onChange={(e) => setWaterReliability(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                >
                  <option value="24/7">Constant 24/7</option>
                  <option value="borehole">Borehole Backup</option>
                  <option value="scheduled_supply">Scheduled supply</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Electricity Plan:</label>
                <select
                  value={electricity}
                  onChange={(e) => setElectricity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                >
                  <option value="prepaid">Prepaid Tokens</option>
                  <option value="postpaid">Postpaid Meter</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Caretaker Name:</label>
                <input
                  type="text"
                  value={caretakerName}
                  onChange={(e) => setCaretakerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Caretaker Contact:</label>
                <input
                  type="text"
                  value={caretakerContact}
                  onChange={(e) => setCaretakerContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Dynamic Drag-and-Drop Image Uploader */}
            <div className="space-y-2 pt-2.5 border-t border-slate-100">
              <label className="text-[10px] uppercase font-extrabold text-blue-600 tracking-wider block">
                House Gallery Photos:
              </label>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-3.5 text-center cursor-pointer bg-slate-50 transition duration-200 group relative"
              >
                <input
                  id="house-photo-file"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-xs font-bold text-slate-700">Drag & Drop House Images Here</span>
                <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">or click to browse local files</span>
              </div>

              {/* Preselected Pro housing template collection */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-500 block">Or Select Premium Templates with 1-Click:</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {BEAUTIFUL_TEMPLATES.map((imgUrl, i) => {
                    const isSelected = uploadedImages.includes(imgUrl);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setUploadedImages(prev => prev.filter(url => url !== imgUrl));
                          } else {
                            setUploadedImages(prev => [...prev, imgUrl]);
                          }
                        }}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          isSelected ? 'border-blue-600 scale-95 ring-2 ring-blue-100' : 'border-slate-200 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt="House template" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white font-extrabold stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Render Selected Image thumbnails */}
              {uploadedImages.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 block">Selected Gallery ({uploadedImages.length}):</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {uploadedImages.map((src, idx) => (
                      <div key={idx} className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={src} alt="Uploaded preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 bg-red-650 hover:bg-red-750 text-white p-0.5 rounded-full shadow-xs cursor-pointer group-hover:scale-105 transition"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-xs cursor-pointer"
            >
              Upload Active Listing Node
            </button>
          </form>
        </div>

        {/* Right column: Room vacancies list & direct bookings review */}
        <div className="lg:col-span-8 space-y-6">
          {/* Vacant Rooms Manager */}
          <div className="bg-white border rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                My Listed Rooms & Synchronized Vacancy Controls
              </h3>
              <span className="text-[10px] font-mono bg-slate-150 text-slate-550 px-2 py-0.5 rounded uppercase font-bold">
                Updates in Real-time
              </span>
            </div>

            {landlordListings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No rooms listed under your provider name. Fill out the form on the left to add a vacancy.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-450">
                      <th className="py-2.5 px-2">Apartment Title</th>
                      <th className="py-2.5 px-2">Location / Rent</th>
                      <th className="py-2.5 px-2">Caretaker Node</th>
                      <th className="py-2.5 px-2">Active Live Status</th>
                      <th className="py-2.5 px-2 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landlordListings.map((hCode) => (
                      <tr key={hCode.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                        <td className="py-3 px-2">
                          <span className="font-bold text-slate-850 block">{hCode.title}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{hCode.type.replace('_', ' ')} layout</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="block text-slate-600 font-semibold">{hCode.location}</span>
                          <span className="font-bold text-emerald-600 font-mono">KES {hCode.price.toLocaleString()}/mo</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="block text-slate-600 font-semibold">{hCode.caretakerName}</span>
                          <span className="font-mono text-[10px] text-slate-450">{hCode.caretakerContact}</span>
                        </td>
                        <td className="py-3 px-2">
                          <select
                            value={hCode.vacancy}
                            onChange={(e) => onUpdateVacancy(hCode.id, e.target.value as VacancyStatus)}
                            className={`p-1 text-[11px] font-bold rounded-md border cursor-pointer focus:outline-none text-white ${
                              hCode.vacancy === 'vacant'
                                ? 'bg-emerald-600 border-emerald-500'
                                : hCode.vacancy === 'occupied'
                                ? 'bg-red-600 border-red-500'
                                : hCode.vacancy === 'booked'
                                ? 'bg-amber-600 border-amber-500'
                                : 'bg-indigo-600 border-indigo-500'
                            }`}
                          >
                            <option value="vacant" className="bg-white text-slate-900 font-semibold">Vacant</option>
                            <option value="occupied" className="bg-white text-slate-900 font-semibold">Occupied</option>
                            <option value="booked" className="bg-white text-slate-900 font-semibold">Booked</option>
                            <option value="under_construction" className="bg-white text-slate-900 font-semibold">Under Construction</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            id={`del-listing-${hCode.id}`}
                            onClick={() => onDeleteListing(hCode.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Remove fake or stale list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bookings Approval Desk */}
          <div className="bg-white border rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Calendar className="w-5 h-5 text-emerald-650" />
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                Direct Booking Applications Desk
              </h3>
            </div>

            {landlordBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No tenant booking requests submitted for your rooms yet. Once clients pay and book online, requests populate here.
              </div>
            ) : (
              <div className="space-y-3">
                {landlordBookings.map((bk) => (
                  <div key={bk.id} className="p-4 rounded-xl border border-slate-150 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 block truncate max-w-xs">{bk.listingTitle}</span>
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-150 uppercase tracking-wide">
                          Paid KES {bk.amountPaid}
                        </span>
                      </div>
                      <p className="text-xs text-slate-550">
                        Applicant: <strong className="text-slate-800">{bk.tenantName}</strong> ({bk.tenantPhone})
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Booking Date: {bk.bookingDate} | Ref: {bk.transactionId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      {bk.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => onUpdateBookingStatus(bk.id, 'confirmed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Confirm Tenant</span>
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(bk.id, 'rejected')}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-650 hover:bg-slate-100 text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                            bk.status === 'confirmed'
                              ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                              : 'text-red-800 bg-red-50 border-red-300'
                          }`}
                        >
                          {bk.status === 'confirmed' ? 'Approved & Occupied' : 'Declined Reservation'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
