/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HouseType = 'single_room' | 'bedsitter' | 'double_room' | 'one_bedroom' | 'two_bedroom';
export type VacancyStatus = 'vacant' | 'occupied' | 'booked' | 'under_construction';
export type WaterReliability = '24/7' | 'borehole' | 'scheduled_supply';
export type ElectricityType = 'prepaid' | 'postpaid';

export interface Review {
  id: string;
  tenantName: string;
  rating: number;
  comment: string;
  category: 'security' | 'water' | 'cleanliness' | 'landlord_behavior' | 'general';
  date: string;
}

export interface HouseListing {
  id: string;
  title: string;
  location: string;
  price: number; // in KES
  type: HouseType;
  vacancy: VacancyStatus;
  description: string;
  images: string[]; // images array
  parking: boolean;
  waterReliability: WaterReliability;
  electricity: ElectricityType;
  securityRating: number; // 1-5 stars
  cleanlinessRating: number; // 1-5 stars
  landlordBehaviorRating: number; // 1-5 stars
  distanceFromCBD: number; // in km
  landlordName: string;
  landlordContact: string;
  caretakerName: string;
  caretakerContact: string;
  isFeatured: boolean;
  amenities: string[];
  reviews: Review[];
  lat: number; // visual coordinate
  lng: number; // visual coordinate
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  tenantName: string;
  tenantPhone: string;
  amountPaid: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'rejected';
  paymentMethod: 'mpesa' | 'airtel' | 'card';
  transactionId: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'landlord' | 'caretaker';
  text: string;
  timestamp: string;
  metadata?: {
    suggestedListingIds?: string[];
  };
}

export interface UserPreferences {
  location: string;
  houseType: HouseType | 'any';
  minBudget: number;
  maxBudget: number;
  familyMembers: number;
  parkingNeeded: boolean;
  waterPreference: 'any' | '24_7';
  hasFilled: boolean;
}

export type UserRole = 'client' | 'landlord' | 'caretaker' | 'admin';

export interface AdmittedLandlord {
  id: string;
  landlordName: string;
  landlordContact: string;
  caretakerName: string;
  caretakerContact: string;
  estateName: string;
  subscriptionPaid: boolean;
  suspended: boolean;
  joinDate: string;
}
