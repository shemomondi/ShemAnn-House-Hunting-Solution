/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { HouseListing, HouseType, UserPreferences, Booking, WaterReliability, ElectricityType, AdmittedLandlord } from '../types';
import { Search, SlidersHorizontal, MapPin, Grid, List, Sparkles, Phone, Lock, Unlock, BadgeDollarSign, Heart, CheckCircle2, ChevronRight, Waves, Zap, Star, ShieldAlert, LogOut, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientViewProps {
  listings: HouseListing[];
  unlockedListingIds: string[];
  onUnlockListing: (id: string) => void;
  bookings: Booking[];
  onCreateBooking: (listingId: string, listingTitle: string, price: number, method: 'mpesa' | 'airtel' | 'card', phone: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  userPreferences: UserPreferences;
  onOpenListingDetails: (house: HouseListing) => void;
  admittedLandlords: AdmittedLandlord[];
  onUpdateVacancy: (id: string, vacancy: 'vacant' | 'occupied' | 'booked' | 'under_construction') => void;
}

export const ClientView: React.FC<ClientViewProps> = ({
  listings,
  unlockedListingIds,
  onUnlockListing,
  bookings,
  onCreateBooking,
  favorites,
  onToggleFavorite,
  userPreferences,
  onOpenListingDetails,
  admittedLandlords = [],
  onUpdateVacancy
}) => {
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<HouseType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [onlyVacant, setOnlyVacant] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  // Interactive Payment Simulation Modal state
  const [paymentModalData, setPaymentModalData] = useState<{
    type: 'unlock' | 'booking';
    listingId: string;
    listingTitle: string;
    price: number;
  } | null>(null);

  const [mpesaPhone, setMpesaPhone] = useState('0712345678');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'sending' | 'waiting' | 'done'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel' | 'card'>('mpesa');
  const [otpValue, setOtpValue] = useState('4821');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Extract unique locations from data snapshot
  const uniqueLocations = Array.from(new Set(listings.map((h) => h.location.split(',')[0].trim())));

  // Core Search Multi-Filter Matching Logic
  const filteredListings = listings.filter((house) => {
    // 1. Text filter
    const matchesSearch =
      house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Room Type filter
    const matchesType = selectedType === 'all' || house.type === selectedType;

    // 3. Location filter
    const matchesLocation =
      selectedLocation === 'all' || house.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    // 4. Rent budget limit filter
    const matchesPrice = house.price <= maxPrice;

    // 5. Vacancy filter
    const matchesVacancy = !onlyVacant || house.vacancy === 'vacant';

    return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesVacancy;
  });

  // Smart Pre-access match recommendations (items matching user's quiz)
  const smartMatches = listings.filter((h) => {
    if (!userPreferences.hasFilled) return false;
    
    const matchesLoc = userPreferences.location === 'any' || h.location.includes(userPreferences.location);
    const matchesType = userPreferences.houseType === 'any' || h.type === userPreferences.houseType;
    const matchesBudget = h.price <= userPreferences.maxBudget;

    return matchesLoc && matchesType && matchesBudget;
  });

  const triggerPaymentSimulation = (type: 'unlock' | 'booking', listingId: string, title: string, cost: number) => {
    setPaymentModalData({
      type,
      listingId,
      listingTitle: title,
      price: cost
    });
    setPaymentStep('idle');
    setOtpError('');
    setUserEnteredOtp('');
  };

  // Tenant self-vacating states
  const [selectedHouseToVacate, setSelectedHouseToVacate] = useState('');
  const [checkoutTenantContact, setCheckoutTenantContact] = useState('');
  const [checkoutLeavingReason, setCheckoutLeavingReason] = useState('Relocation');

  const occupiedOrBookedListings = listings.filter(h => h.vacancy === 'occupied' || h.vacancy === 'booked');

  const handleTenantCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHouseToVacate) {
      alert('Please select the house you are currently occupying to check out.');
      return;
    }
    const matchedHouse = listings.find(h => h.id === selectedHouseToVacate);
    if (matchedHouse) {
      onUpdateVacancy(selectedHouseToVacate, 'vacant');
      alert(`Success! We have successfully processed your checkout from "${matchedHouse.title}".\r\n\r\nThis apartment has been updated instantly in our Nairobi database and is now listed as "Vacant" (available for new house hunters).\r\n\r\nYou can now browse for your next apartment below under normal or cost-friendly rates!`);
      // Focus filters to assist their query
      setOnlyVacant(true);
      // Clean up inputs
      setSelectedHouseToVacate('');
      setCheckoutTenantContact('');
    }
  };

  /* 
   * FRONTEND HANDLER & BACKEND SIMULATION INTERFACE
   * This handles the simulated STK Push gateway to Safaricom's Daraja API endpoint
   * on behalf of the client for unlocks & bookings.
   */
  const handleStartPayment = () => {
    // Robustly strip any non-digit character (e.g., spaces, plus signs, dashes)
    const cleanDigits = mpesaPhone.replace(/\D/g, '');
    
    // Check that we have a realistic Kenyan number (Safaricom or Airtel, usually 9 or 10 digits)
    if (cleanDigits.length < 9 && paymentMethod !== 'card') {
      alert('Please enter a valid Safaricom/Airtel phone number (e.g. 0712345678 or 254712345678)');
      return;
    }
    
    // TRANSITION FRONTEND TO SENDING STATE: Simulates API handshake with Safaricom M-Pesa API Gwy
    setPaymentStep('sending');

    // SIMULATED BACKEND WEBHOOK TRIGGER: Simulate the network latency to launch STK prompt on target phone
    setTimeout(() => {
      // TRANSITION FRONTEND TO WAITING FOR PIN INPUT
      setPaymentStep('waiting');
    }, 1500);
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === 'mpesa' && userEnteredOtp !== otpValue) {
      setOtpError('Incorrect simulated Safaricom validation code. Use 4821.');
      return;
    }
    setPaymentStep('done');

    setTimeout(() => {
      if (paymentModalData) {
        if (paymentModalData.type === 'unlock') {
          onUnlockListing(paymentModalData.listingId);
        } else if (paymentModalData.type === 'booking') {
          onCreateBooking(
            paymentModalData.listingId,
            paymentModalData.listingTitle,
            paymentModalData.price,
            paymentMethod,
            mpesaPhone
          );
        }
      }
      setPaymentModalData(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Smart Wizard Recommendation Banner (Only if they completed the quiz) */}
      {userPreferences.hasFilled && smartMatches.length > 0 && (
        <motion.div
          id="quiz-recommendations-banner"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 border border-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-1.5 text-blue-450 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Matching System Recommendation Engine</span>
            </div>
            <h2 className="text-lg font-bold">
              We found {smartMatches.length} houses perfectly optimized for your preferences!
            </h2>
            <p className="text-xs text-slate-300">
              Matched for: <span className="font-semibold text-white capitalize">{userPreferences.location}</span> Area,{' '}
              <span className="font-semibold text-white capitalize">{userPreferences.houseType.replace('_', ' ')}</span> layout, and max rent{' '}
              <span className="font-bold text-blue-400 font-mono">KES {userPreferences.maxBudget.toLocaleString()}</span>.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedLocation(userPreferences.location === 'any' ? 'all' : userPreferences.location);
                setSelectedType(userPreferences.houseType === 'any' ? 'all' : userPreferences.houseType);
                setMaxPrice(userPreferences.maxBudget);
              }}
              className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer text-white"
            >
              Apply Match Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* 1.1 Current Tenant Self-Checkout & Vacate Hub (Fully Interactive) */}
      <div 
        id="tenant-checkout-hub"
        className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-250 pb-3">
          <div className="space-y-1">
            <h3 className="font-extrabold text-blue-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <LogOut className="w-4 h-4 text-blue-600" />
              <span>Current Tenant Check-Out Port</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              Are you currently leaving or moving out of an apartment? Select your house below to instantly flag it as vacant so other Nairobi home hunters can find it.
            </p>
          </div>
          <span className="text-[9px] bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold uppercase shrink-0">
            Self-Vacating System Active
          </span>
        </div>

        <form onSubmit={handleTenantCheckout} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Your Occupied Apartment:
            </label>
            <select
              id="select-house-to-vacate"
              value={selectedHouseToVacate}
              onChange={(e) => setSelectedHouseToVacate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-700 h-9"
            >
              <option value="">-- Choose Occupied/Booked House --</option>
              {occupiedOrBookedListings.map((h) => (
                <option key={h.id} value={h.id}>
                  🏨 {h.title} ({h.location.split(',')[0]} - KES {h.price.toLocaleString()}/mo)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Confirm Phone/Contract No:
            </label>
            <input
              id="input-checkout-tenant-contact"
              type="text"
              required
              value={checkoutTenantContact}
              onChange={(e) => setCheckoutTenantContact(e.target.value)}
              placeholder="e.g. +254 755 000 111"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono h-9"
            />
          </div>

          <div className="flex items-end">
            <button
              id="btn-confirm-checkout"
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm h-9"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Checkout (Vacate)</span>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 text-[10px] text-slate-550 font-semibold bg-white border border-slate-200 p-2.5 rounded-2xl">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>
            <strong>Leaving your current house?</strong> Once clicked, the apartment instantly refreshes back to vacant, so it becomes available for others. Meanwhile, you can seamlessly search or apply filters below to find your next housing destination under normal rates!
          </span>
        </div>
      </div>

      {/* 2. Unified Search & Multi-Filters Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        {/* Row 1: Word search + location selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              id="client-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search apartment name, specifications or landmarks..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10.5 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedLocation}
              id="location-filter"
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">🌐 All Locations</option>
              {uniqueLocations.map((loc, i) => (
                <option key={i} value={loc}>
                  📍 {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedType}
              id="house-type-filter"
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">🏠 All House Types</option>
              <option value="single_room">Single Room</option>
              <option value="bedsitter">Bedsitter (Studio)</option>
              <option value="double_room">Double Room</option>
              <option value="one_bedroom">One Bedroom</option>
              <option value="two_bedroom">Two Bedroom</option>
            </select>
          </div>
        </div>

        {/* Row 2: Budget slider + Vacant checkboxes + layout modes */}
        <div className="border-t border-slate-100 pt-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Prices Range slider */}
          <div className="w-full lg:max-w-md space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-650">
              <span>Maximum Rent Limit KES:</span>
              <span className="font-mono text-blue-600 font-bold">KES {maxPrice.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min="5000"
              max="35000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 accent-blue-600 rounded-lg appearance-auto cursor-pointer"
            />
          </div>

          {/* Checks and Toggles */}
          <div className="flex flex-wrap items-center gap-4.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-650 select-none">
              <input
                type="checkbox"
                checked={onlyVacant}
                onChange={(e) => setOnlyVacant(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
              <span>Vacant Rooms Only</span>
            </label>

            <div className="w-px h-5 bg-slate-200" />

            {/* Layout selectors Button icons */}
            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-0.5">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  layoutMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid layout"
              >
                <Grid className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  layoutMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="List layout"
              >
                <List className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Listings Grid / List output */}
      {filteredListings.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center text-slate-500 space-y-3.5">
          <div className="text-4xl text-slate-400">🕵️‍♀️</div>
          <h3 className="font-bold text-slate-800 text-base">No matching properties found</h3>
          <p className="text-xs max-w-sm mx-auto">
            Try resetting your budget slider, using a broader room type, or chatting with NyumbaBot for helpful moving suggestions.
          </p>
        </div>
      ) : (
        <div
          className={
            layoutMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'grid grid-cols-1 gap-4'
          }
        >
          {filteredListings.map((house) => {
            const isUnlocked = unlockedListingIds.includes(house.id);
            const isFav = favorites.includes(house.id);
            const hasPendingBooking = bookings.some(b => b.listingId === house.id && b.status === 'pending');
            const hasConfirmedBooking = bookings.some(b => b.listingId === house.id && b.status === 'confirmed');
            
            const matchedLandlord = admittedLandlords?.find(ll => ll.landlordContact === house.landlordContact);
            const isListingSuspended = !!matchedLandlord?.suspended;

            return (
              <div
                key={house.id}
                id={`listing-card-${house.id}`}
                className={`bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col ${
                  layoutMode === 'list' ? 'md:flex-row h-auto md:h-64' : 'h-full'
                }`}
              >
                {/* Visual Image container */}
                <div className={`relative bg-slate-100 ${layoutMode === 'list' ? 'w-full md:w-80 shrink-0 h-48 md:h-full' : 'h-48'}`}>
                  <img
                    src={house.images[0]}
                    alt={house.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Vacancy Status tag */}
                  <div className="absolute top-3 left-3 flex gap-2.5 flex-wrap items-center">
                    {isListingSuspended && (
                      <span className="px-3 py-1 text-[9px] font-extrabold tracking-wider uppercase rounded-full shadow-md bg-red-600 text-white flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>SUSPENDED</span>
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase rounded-full shadow-md text-white ${
                        house.vacancy === 'vacant'
                          ? 'bg-blue-600'
                          : house.vacancy === 'occupied'
                          ? 'bg-red-500'
                          : house.vacancy === 'booked'
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                    >
                      {house.vacancy}
                    </span>
                  </div>

                  {/* Favorite Toggle button */}
                  <button
                    onClick={() => onToggleFavorite(house.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full border shadow-md transition-colors cursor-pointer ${
                      isFav
                        ? 'bg-pink-50 border-pink-400 text-pink-600'
                        : 'bg-white/80 border-slate-200 text-slate-600 hover:text-pink-600'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-slate-950/80 rounded px-2.5 py-1 backdrop-blur-xs text-[10px] text-blue-300 font-bold font-mono border border-slate-800">
                    KES {house.price.toLocaleString()}/mo
                  </div>
                </div>

                {/* Listing content and buttons */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-extrabold font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{house.location}</span>
                      </span>

                      <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-500 font-semibold font-mono capitalize">
                        {house.type.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 capitalize leading-tight">
                      {house.title}
                    </h4>

                    <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {house.description}
                    </p>

                    {/* Quick amenities icons list */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{house.securityRating} Secure</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Waves className="w-3.5 h-3.5 text-blue-500" />
                        <span>{house.waterReliability === '24/7' ? '24/7 Water' : 'Borehole'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="capitalize">{house.electricity}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-5 pt-3.5 border-t border-slate-150 flex flex-col sm:flex-row gap-2.5">
                    <button
                      onClick={() => onOpenListingDetails(house)}
                      className="px-4 py-2 text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer text-center shrink-0 flex items-center justify-center"
                    >
                      View Details
                    </button>

                    {/* Unlock Or Book Trigger */}
                    {isListingSuspended ? (
                      <div className="flex-1 flex items-center justify-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-2 text-xs font-bold font-mono animate-fadeIn">
                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Landlord services suspended</span>
                      </div>
                    ) : isUnlocked ? (
                      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-200 gap-2.5 animate-fadeIn">
                        <div className="flex items-center gap-2 text-blue-900">
                          <Unlock className="w-4 h-4 shrink-0 text-blue-600" />
                          <div className="text-[11px]">
                            <span className="block font-bold text-blue-950">Landlord Phone Unlocked!</span>
                            <span className="font-mono text-xs text-slate-800 tracking-wide font-extrabold">{house.landlordContact}</span>
                          </div>
                        </div>

                        {house.vacancy === 'vacant' && !hasPendingBooking && !hasConfirmedBooking && (
                          <button
                            onClick={() => triggerPaymentSimulation('booking', house.id, house.title, 500)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition text-center cursor-pointer flex items-center justify-center gap-1 shrink-0 shadow-xs"
                          >
                            <BadgeDollarSign className="w-3.5 h-3.5" />
                            <span>Book Now KES 500</span>
                          </button>
                        )}

                        {hasPendingBooking && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-1 rounded-md">
                            Pending Approval
                          </span>
                        )}

                        {hasConfirmedBooking && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmed Booked</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => triggerPaymentSimulation('unlock', house.id, house.title, 200)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-blue-400" />
                        <span>Unlock Contact & Location (KES 200)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dynamic Developer Credits Portal - Celebrating SHEM & ANNITAH */}
      <div 
        id="developer-showcase-hub"
        className="bg-gradient-to-tr from-slate-900 via-slate-950 to-indigo-950 border border-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 leading-relaxed"
      >
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Developer Handover Platform</span>
          </div>
          <h2 className="text-base font-extrabold tracking-tight">
            ShemAnn House Hunting Solution CORE
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-semibold font-sans">
            Engineered with absolute excellence and high-performance bento layouts by developers <strong className="text-white">SHEM & ANNITAH</strong>. All systems operating, including synchronized state engines, active coordinate trackers, and simulated financial checkout frameworks.
          </p>
          <div className="text-[10px] text-slate-400 font-mono font-bold bg-slate-950/40 border border-slate-800 p-2 rounded-xl text-left inline-block">
            📍 Core Architects: SHEM & ANNITAH
          </div>
        </div>

        <div className="w-full md:w-auto px-5 py-3.5 bg-slate-900 border border-slate-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 text-center shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-mono text-slate-300">Developers Core: SHEM & ANNITAH</span>
        </div>
      </div>

      {/* 4. Kenyan M-Pesa / Airtell Cash simulated payment modal */}
      <AnimatePresence>
        {paymentModalData && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-3xl border border-slate-200 overflow-hidden shadow-2xl"
            >
              <div className="bg-emerald-600 p-5 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight uppercase flex items-center gap-2">
                      <BadgeDollarSign className="w-5 h-5 text-emerald-200" />
                      <span>Safaricom M-Pesa Integration</span>
                    </h3>
                    <p className="text-[11px] text-emerald-100 font-mono mt-0.5">
                      Lipa na M-Pesa Online checkout portal
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentModalData(null)}
                    className="text-emerald-100 hover:text-white text-xs font-bold border border-emerald-400 rounded-lg px-2 py-1 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {paymentStep === 'idle' && (
                  <div className="space-y-4">
                    {/* Bill breakdown */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Item Transaction</span>
                      <span className="font-bold text-sm text-slate-900 block truncate">{paymentModalData.listingTitle}</span>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                        <span className="font-semibold text-slate-550">Cost Type: {paymentModalData.type === 'unlock' ? 'Contact unlock fee' : 'Rental deposit reserve'}</span>
                        <span className="font-mono font-bold text-slate-950">KES {paymentModalData.price}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-705 block mb-1">
                        Safaricom M-Pesa Mobile Number:
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 font-semibold font-mono text-sm text-slate-450">
                          +254
                        </span>
                        <input
                          type="tel"
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value)}
                          placeholder="e.g. 0712345678"
                          className="w-full bg-slate-50 border border-slate-205 rounded-xl pl-16 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:border-emerald-500 font-bold"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        STK Push request will be prompted directly on your phone. Enter PIN on the simulation screen to complete.
                      </span>
                    </div>

                    <button
                      onClick={handleStartPayment}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl transition shadow-md shadow-emerald-600/10 cursor-pointer"
                    >
                      Authenticate Payment (KES {paymentModalData.price})
                    </button>
                  </div>
                )}

                {paymentStep === 'sending' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center mx-auto">
                      <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-850">Sending STK Push prompt...</h4>
                      <p className="text-slate-500 text-xs max-w-xs mx-auto mt-1 leading-relaxed">
                        Establishing secure handshake node with Safaricom Lipa-na-Mpesa API gateways for number +254 {mpesaPhone}.
                      </p>
                    </div>
                  </div>
                )}

                {paymentStep === 'waiting' && (
                  <div className="space-y-4 py-3">
                    <div className="p-4 bg-slate-950 text-white rounded-xl border border-slate-800 space-y-3 font-mono">
                      <div className="flex md:items-center justify-between text-xs text-amber-400 border-b border-slate-800 pb-2">
                        <span>📲 Safaricom API push</span>
                        <span>WAITING FOR PIN...</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium">
                        Pay KES {paymentModalData.price} to House Hunting solution API gateway? Use SAFARICOM simulation PIN <strong className="text-white text-xs font-bold font-mono">4821</strong>.
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <label className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider block">
                          Enter PIN on Phone Interface:
                        </label>
                        <input
                          type="password"
                          id="saf-mpesa-simulation-pin"
                          name="node-saf-pin-prevent-autofill-check"
                          autoComplete="new-password"
                          maxLength={4}
                          value={userEnteredOtp}
                          onChange={(e) => {
                            setUserEnteredOtp(e.target.value);
                            setOtpError('');
                          }}
                          placeholder="••••"
                          className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-2 text-center text-lg tracking-widest text-white font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {otpError && (
                        <span className="text-[10px] text-red-400 font-semibold block pt-1">
                          ⚠️ {otpError}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleConfirmPayment}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl transition cursor-pointer"
                    >
                      Authenticate PIN Confirmation
                    </button>
                  </div>
                )}

                {paymentStep === 'done' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-800">M-Pesa Checkout Verified!</h4>
                      <p className="text-slate-500 text-xs mt-1">
                        Ref: <strong className="font-mono text-slate-850">MPESA-STK-{Math.random().toString(36).substring(3, 10).toUpperCase()}</strong>
                      </p>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-2.5">
                        Listing successfully updated in your unlocked panel!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
