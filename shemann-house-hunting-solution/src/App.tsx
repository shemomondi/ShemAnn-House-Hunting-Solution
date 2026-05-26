/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserPreferences, HouseListing, Booking, UserRole, VacancyStatus, AdmittedLandlord } from './types';
import { INITIAL_LISTINGS } from './data/listings';
import { Navbar } from './components/Navbar';
import { Questionnaire } from './components/Questionnaire';
import { ClientView } from './components/ClientView';
import { LandlordView } from './components/LandlordView';
import { CaretakerView } from './components/CaretakerView';
import { AdminView } from './components/AdminView';
import { SimulatedMap } from './components/SimulatedMap';
import { Chatbot } from './components/Chatbot';
import { ListingDetailsModal } from './components/ListingDetailsModal';
import { RoleLoginModal } from './components/RoleLoginModal';
import { MessageSquare, MapPin, BadgePercent, CheckCircle } from 'lucide-react';

export default function App() {
  // Global States
  const [currentRole, setCurrentRole] = useState<UserRole>('client');
  const [pendingRoleToUnlock, setPendingRoleToUnlock] = useState<Exclude<UserRole, 'client'> | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [admittedLandlords, setAdmittedLandlords] = useState<AdmittedLandlord[]>(() => {
    const saved = localStorage.getItem('house_admitted_landlords');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'll-1',
        landlordName: 'Wambua Mwangi',
        landlordContact: '+254 712 345 678',
        caretakerName: 'Robert Njuguna',
        caretakerContact: '+254 799 111 222',
        estateName: 'Roysambu Executive Heights',
        subscriptionPaid: true,
        suspended: false,
        joinDate: '10/Mar/2026',
      },
      {
        id: 'll-2',
        landlordName: 'Stephen Onyango',
        landlordContact: '+254 711 223 344',
        caretakerName: 'John Ochieng',
        caretakerContact: '+254 733 987 654',
        estateName: 'Roysambu Heights',
        subscriptionPaid: true,
        suspended: false,
        joinDate: '15/Apr/2026',
      },
      {
        id: 'll-3',
        landlordName: 'Peninah Njeri',
        landlordContact: '+254 722 554 669',
        caretakerName: 'David Mwangi',
        caretakerContact: '+254 715 332 110',
        estateName: 'Kahawa Elite Court',
        subscriptionPaid: false,
        suspended: false,
        joinDate: '01/May/2026',
      }
    ];
  });
  const [listings, setListings] = useState<HouseListing[]>(() => {
    // Attempt local storage load
    const saved = localStorage.getItem('house_hunting_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [unlockedListingIds, setUnlockedListingIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('house_unlocked_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('house_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('house_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('house_user_preferences');
    return saved
      ? JSON.parse(saved)
      : {
          location: 'any',
          houseType: 'any',
          minBudget: 3000,
          maxBudget: 15000,
          familyMembers: 1,
          parkingNeeded: false,
          waterPreference: 'any',
          hasFilled: false,
        };
  });

  // Selected listings for visual focus and details modals
  const [selectedListing, setSelectedListing] = useState<HouseListing | null>(null);
  const [detailedListing, setDetailedListing] = useState<HouseListing | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // GPS filters state
  const [userGpsEnabled, setUserGpsEnabled] = useState(false);
  const [gpsRadius, setGpsRadius] = useState<number>(25);

  // Sync to localStorage on state edits (prevent data loss during portal role hot-swapping)
  useEffect(() => {
    localStorage.setItem('house_hunting_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('house_unlocked_ids', JSON.stringify(unlockedListingIds));
  }, [unlockedListingIds]);

  useEffect(() => {
    localStorage.setItem('house_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('house_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('house_user_preferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  useEffect(() => {
    localStorage.setItem('house_admitted_landlords', JSON.stringify(admittedLandlords));
  }, [admittedLandlords]);

  // Actions Callbacks
  const handleAdmitLandlord = (newLld: AdmittedLandlord) => {
    setAdmittedLandlords((prev) => [newLld, ...prev]);
  };

  const handleToggleSubscriptionPaid = (id: string) => {
    setAdmittedLandlords((prev) =>
      prev.map((ll) => (ll.id === id ? { ...ll, subscriptionPaid: !ll.subscriptionPaid } : ll))
    );
  };

  const handleToggleSuspended = (id: string) => {
    setAdmittedLandlords((prev) =>
      prev.map((ll) => (ll.id === id ? { ...ll, suspended: !ll.suspended } : ll))
    );
  };

  const handleCompleteQuestionnaire = (pref: UserPreferences) => {
    setUserPreferences(pref);
    // Automatically open chatbot to welcome them with matched results
    setIsChatbotOpen(true);
  };

  const handleRetakeQuiz = () => {
    setUserPreferences({
      location: 'any',
      houseType: 'any',
      minBudget: 3000,
      maxBudget: 15000,
      familyMembers: 1,
      parkingNeeded: false,
      waterPreference: 'any',
      hasFilled: false,
    });
    setSelectedListing(null);
    setDetailedListing(null);
  };

  const handleRoleChangeAttempt = (role: UserRole) => {
    if (role === 'client') {
      setCurrentRole('client');
    } else {
      setPendingRoleToUnlock(role);
      setIsLoginModalOpen(true);
    }
  };

  const handleAddListing = (newListingSnapshot: Omit<HouseListing, 'reviews'>) => {
    const newObj: HouseListing = {
      ...newListingSnapshot,
      reviews: [],
    };
    setListings((prev) => [newObj, ...prev]);
  };

  const handleUpdateVacancy = (id: string, nextStatus: VacancyStatus) => {
    setListings((prev) =>
      prev.map((house) => {
        if (house.id === id) {
          return { ...house, vacancy: nextStatus };
        }
        return house;
      })
    );
    // Sync active select if opened
    if (selectedListing?.id === id) {
      setSelectedListing((prev) => (prev ? { ...prev, vacancy: nextStatus } : null));
    }
  };

  const handleDeleteListing = (id: string) => {
    setListings((prev) => prev.filter((h) => h.id !== id));
    if (selectedListing?.id === id) setSelectedListing(null);
    if (detailedListing?.id === id) setDetailedListing(null);
  };

  const handleUnlockListing = (id: string) => {
    setUnlockedListingIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const handleCreateBooking = (
    listingId: string,
    listingTitle: string,
    price: number,
    paymentMethod: 'mpesa' | 'airtel' | 'card',
    phone: string
  ) => {
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      listingId,
      listingTitle,
      tenantName: userPreferences.hasFilled ? `Tenant (Family: ${userPreferences.familyMembers})` : 'Anonymous Tenant',
      tenantPhone: phone,
      amountPaid: price,
      bookingDate: new Date().toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'pending',
      paymentMethod,
      transactionId: `TXN${Math.random().toString(36).substring(3, 11).toUpperCase()}`,
    };

    setBookings((prev) => [newBooking, ...prev]);
    // Automatically toggle vacancy tag of that house to booked
    setListings((prev) =>
      prev.map((h) => (h.id === listingId ? { ...h, vacancy: 'booked' } : h))
    );
  };

  const handleUpdateBookingStatus = (bookingId: string, nextStatus: 'confirmed' | 'rejected') => {
    setBookings((prev) =>
      prev.map((bk) => {
        if (bk.id === bookingId) {
          // If approved, update underlying apartment vacancy to occupied/booked
          if (nextStatus === 'confirmed') {
            setListings((houses) =>
              houses.map((h) => (h.id === bk.listingId ? { ...h, vacancy: 'occupied' } : h))
            );
          }
          return { ...bk, status: nextStatus };
        }
        return bk;
      })
    );
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleAddReview = (
    houseId: string,
    rating: number,
    comment: string,
    category: 'security' | 'water' | 'cleanliness' | 'landlord_behavior' | 'general'
  ) => {
    const newRevObj = {
      id: `r-${Date.now()}`,
      tenantName: 'Anonymous Tenant',
      rating,
      comment,
      category,
      date: new Date().toLocaleDateString(),
    };

    setListings((prev) =>
      prev.map((h) => {
        if (h.id === houseId) {
          const updatedReviews = [...h.reviews, newRevObj];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const avRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

          return {
            ...h,
            reviews: updatedReviews,
            // Simple recalculated averages
            securityRating: category === 'security' ? avRating : h.securityRating,
            cleanlinessRating: category === 'cleanliness' ? avRating : h.cleanlinessRating,
            landlordBehaviorRating: category === 'landlord_behavior' ? avRating : h.landlordBehaviorRating,
          };
        }
        return h;
      })
    );

    // Sync active selection
    setDetailedListing((prev) => {
      if (!prev || prev.id !== houseId) return prev;
      return {
        ...prev,
        reviews: [...prev.reviews, newRevObj],
      };
    });
  };

  // Switch Listing details via map focus or visual shortcuts
  const selectFocusListing = (house: HouseListing) => {
    setSelectedListing(house);
    setDetailedListing(house);
  };

  // Force onboarding questionnaire view if not filled
  if (!userPreferences.hasFilled) {
    return <Questionnaire onComplete={handleCompleteQuestionnaire} />;
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Brand Navigation */}
      <Navbar
        currentRole={currentRole}
        onChangeRole={handleRoleChangeAttempt}
        preferences={userPreferences}
        onRetakeQuiz={handleRetakeQuiz}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Core Multi-Role Portal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel (7 columns on desktop) - active dashboard view based on selected user portal role */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Display banner notifying of active portal limits */}
            <div className="bg-blue-50 border border-blue-200/80 text-blue-900 rounded-3xl p-5 flex gap-3 text-xs md:items-center shadow-2xs hover:shadow-xs transition-all duration-300">
              <span className="text-lg">📢</span>
              <div className="font-semibold text-slate-700 leading-relaxed">
                You are playing as the <span className="font-bold text-blue-700 capitalize">{currentRole}</span> workspace role. Modern housing data updates sync and mirror instantly across all portals.
              </div>
            </div>

            {currentRole === 'client' && (
              <ClientView
                listings={listings}
                unlockedListingIds={unlockedListingIds}
                onUnlockListing={handleUnlockListing}
                bookings={bookings}
                onCreateBooking={handleCreateBooking}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                userPreferences={userPreferences}
                onOpenListingDetails={selectFocusListing}
                admittedLandlords={admittedLandlords}
                onUpdateVacancy={handleUpdateVacancy}
              />
            )}

            {currentRole === 'landlord' && (
              <LandlordView
                listings={listings}
                onAddListing={handleAddListing}
                onUpdateVacancy={handleUpdateVacancy}
                onDeleteListing={handleDeleteListing}
                bookings={bookings}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                admittedLandlords={admittedLandlords}
              />
            )}

            {currentRole === 'caretaker' && (
              <CaretakerView
                listings={listings}
                onUpdateVacancy={handleUpdateVacancy}
              />
            )}

            {currentRole === 'admin' && (
              <AdminView
                listings={listings}
                onDeleteListing={handleDeleteListing}
                bookings={bookings}
                unlockedListingsCount={unlockedListingIds.length}
                admittedLandlords={admittedLandlords}
                onAdmitLandlord={handleAdmitLandlord}
                onToggleSubscriptionPaid={handleToggleSubscriptionPaid}
                onToggleSuspended={handleToggleSuspended}
              />
            )}
          </section>

          {/* Right panel (5 columns on desktop) - Interactive GIS simulated map coordinates locator */}
          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-3 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-100 text-slate-800">
                <MapPin className="w-4.5 h-4.5 text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">
                  GIS Coordinates
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Simulate walking-distance GPS searches directly on coordinates. Use slider radius limits overlaying the main Nairobi highway paths.
              </p>
            </div>

            <SimulatedMap
              listings={listings}
              selectedListing={selectedListing}
              onSelectListing={selectFocusListing}
              userGpsEnabled={userGpsEnabled}
              onToggleGps={() => setUserGpsEnabled(!userGpsEnabled)}
              gpsRadius={gpsRadius}
              onGpsRadiusChange={setGpsRadius}
            />
          </aside>

        </div>
      </main>

      {/* Embedded Conversational NyumbaBot Chat client */}
      <Chatbot
        listings={listings}
        onSelectListing={selectFocusListing}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      {/* Dedicated full info modal panels */}
      {detailedListing && (
        <ListingDetailsModal
          house={detailedListing}
          onClose={() => setDetailedListing(null)}
          onAddReview={handleAddReview}
        />
      )}

      {/* Role workspace login modal lock */}
      <RoleLoginModal
        role={pendingRoleToUnlock}
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingRoleToUnlock(null);
        }}
        onSuccess={(unlockedRole) => {
          setCurrentRole(unlockedRole);
          setIsLoginModalOpen(false);
          setPendingRoleToUnlock(null);
        }}
      />

      {/* Pure human labels credit line */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500 font-mono">
        <span>House Hunting Solution © 2026. Real-time vacancy synchronizer. All rights reserved.</span>
      </footer>
    </div>
  );
}
