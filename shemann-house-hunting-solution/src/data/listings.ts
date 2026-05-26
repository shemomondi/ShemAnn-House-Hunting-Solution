/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HouseListing } from '../types';

export const INITIAL_LISTINGS: HouseListing[] = [
  {
    id: 'h1',
    title: 'Modern Executive Bedsitter',
    location: 'Roysambu, Nairobi',
    price: 9500,
    type: 'bedsitter',
    vacancy: 'vacant',
    description: 'A spacious bedsitter featuring modern tiles, an elegant kitchen cabinet, and high-speed fiber internet availability. Conveniently situated just 3 minutes from the Thika Superhighway bypass.',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
    ],
    parking: true,
    waterReliability: '24/7',
    electricity: 'prepaid',
    securityRating: 4.8,
    cleanlinessRating: 4.5,
    landlordBehaviorRating: 4.7,
    distanceFromCBD: 12.5,
    landlordName: 'Wambua Mwangi',
    landlordContact: '+254 712 345 678',
    caretakerName: 'Robert Njuguna',
    caretakerContact: '+254 799 111 222',
    isFeatured: true,
    amenities: ['Tiled Floor', 'Kitchen Cabinets', 'Tokens Box', 'WiFi Zone', 'CCTV System', 'Hot Shower'],
    reviews: [
      {
        id: 'r1_1',
        tenantName: 'Andrew Kimani',
        rating: 5,
        comment: 'Excellent security and water is always running. Highly recommended!',
        category: 'water',
        date: '2026-04-12'
      },
      {
        id: 'r1_2',
        tenantName: 'Mercy Atieno',
        rating: 4,
        comment: 'Caretaker is very responsive when tokens have issues.',
        category: 'general',
        date: '2026-05-01'
      }
    ],
    lat: 38,
    lng: 42
  },
  {
    id: 'h2',
    title: 'Starlight Cozy Single Room',
    location: 'Kahawa Wendani, Nairobi',
    price: 5500,
    type: 'single_room',
    vacancy: 'vacant',
    description: 'Affordable and neat single room ideal for college students or young professionals. Shared amenities are kept spotlessly clean by the resident caretaker. Secure perimeter wall with Razor wire.',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
    ],
    parking: false,
    waterReliability: 'borehole',
    electricity: 'prepaid',
    securityRating: 4.2,
    cleanlinessRating: 4.0,
    landlordBehaviorRating: 4.5,
    distanceFromCBD: 16.0,
    landlordName: 'Mama Beatrice Ngengi',
    landlordContact: '+254 722 987 654',
    caretakerName: 'John Ochuodho',
    caretakerContact: '+254 788 333 444',
    isFeatured: false,
    amenities: ['Token Meter', 'Borehole Water', 'Razor Wire Gated', 'High Speed WiFi Area'],
    reviews: [
      {
        id: 'r2_1',
        tenantName: 'Brian Kiprotich',
        rating: 4,
        comment: 'Perfect place for a student. Affordable and reliable water.',
        category: 'general',
        date: '2026-03-15'
      }
    ],
    lat: 25,
    lng: 58
  },
  {
    id: 'h3',
    title: 'Elite Vista 1 Bedroom Apartment',
    location: 'Westlands, Nairobi',
    price: 25000,
    type: 'one_bedroom',
    vacancy: 'vacant',
    description: 'Luxurious 1-bedroom apartment featuring a private balcony, fully fitted kitchen with granite countertops, instant shower system, and elevator access. Gated with 24-hour armed guards.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
    ],
    parking: true,
    waterReliability: '24/7',
    electricity: 'postpaid',
    securityRating: 5.0,
    cleanlinessRating: 4.9,
    landlordBehaviorRating: 4.8,
    distanceFromCBD: 4.2,
    landlordName: 'Hassan Al-Amin',
    landlordContact: '+254 733 444 555',
    caretakerName: 'Peter Kamau',
    caretakerContact: '+254 711 555 666',
    isFeatured: true,
    amenities: ['Secure Parking', 'Elevator', 'In-house WiFi', 'Hot Shower Instant', 'Private Balcony', 'Armed Guards'],
    reviews: [
      {
        id: 'r3_1',
        tenantName: 'Faith Mwende',
        rating: 5,
        comment: 'Beautiful apartment. Extremely secure, close to malls, outstanding views.',
        category: 'security',
        date: '2026-05-10'
      }
    ],
    lat: 65,
    lng: 25
  },
  {
    id: 'h4',
    title: 'Spacious Family 2 Bedroom Haven',
    location: 'Kasarani, Nairobi',
    price: 18000,
    type: 'two_bedroom',
    vacancy: 'vacant',
    description: 'Perfect family house setup located in a serene, quiet secure court. Master en-suite, spacious laundry backyard, and designated kids playground area inside the property gated compound.',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
    ],
    parking: true,
    waterReliability: '24/7',
    electricity: 'prepaid',
    securityRating: 4.7,
    cleanlinessRating: 4.6,
    landlordBehaviorRating: 4.4,
    distanceFromCBD: 14.2,
    landlordName: 'Justice Patrick Omoth',
    landlordContact: '+254 721 000 999',
    caretakerName: 'Silas Korir',
    caretakerContact: '+254 701 222 333',
    isFeatured: true,
    amenities: ['Kids Playground', 'Laundry Patio', 'Secure Court', 'Master Ensuite', 'Tiled Bath', 'Borehole Backup'],
    reviews: [
      {
        id: 'r4_1',
        tenantName: 'Daniel Kuria',
        rating: 4.5,
        comment: 'A very peaceful and family friendly environment. Water is indeed 24/7.',
        category: 'water',
        date: '2026-04-20'
      }
    ],
    lat: 45,
    lng: 78
  },
  {
    id: 'h5',
    title: 'Kilimani Premium Double Room',
    location: 'Kilimani, Nairobi',
    price: 15000,
    type: 'double_room',
    vacancy: 'occupied',
    description: 'Luxurious double room (two linked rooms with separate kitchenette) in upscale Kilimani. Close to Adlife Plaza and Yaya Centre. Perfect for co-living or small families.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
    ],
    parking: true,
    waterReliability: '24/7',
    electricity: 'prepaid',
    securityRating: 4.9,
    cleanlinessRating: 4.8,
    landlordBehaviorRating: 5.0,
    distanceFromCBD: 5.0,
    landlordName: 'Grace Kendi',
    landlordContact: '+254 705 678 123',
    caretakerName: 'James Otieno',
    caretakerContact: '+254 724 888 999',
    isFeatured: false,
    amenities: ['Kitchenette', 'Gravel Compound', 'Electric Fence', 'Instant Water Heater'],
    reviews: [
      {
        id: 'r5_1',
        tenantName: 'Sarah Wanja',
        rating: 5,
        comment: 'Grace is the best landlord! Very friendly and returns deposit promptly.',
        category: 'landlord_behavior',
        date: '2026-05-05'
      }
    ],
    lat: 70,
    lng: 48
  },
  {
    id: 'h6',
    title: 'Sunset Ridge One Bedroom',
    location: 'Madaraka, Nairobi',
    price: 13500,
    type: 'one_bedroom',
    vacancy: 'booked',
    description: 'Executive one-bedroom unit located right behind Strathmore University. Features constant supply of municipal water, clean wooden floor tiling, high security, and easy access to Nairobi CBD.',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
    ],
    parking: true,
    waterReliability: 'scheduled_supply',
    electricity: 'prepaid',
    securityRating: 4.4,
    cleanlinessRating: 4.5,
    landlordBehaviorRating: 4.2,
    distanceFromCBD: 3.5,
    landlordName: 'Eng. David Gicheru',
    landlordContact: '+254 715 222 555',
    caretakerName: 'Moses Ndolo',
    caretakerContact: '+254 734 666 777',
    isFeatured: false,
    amenities: ['Strathmore Walking Distance', 'CCTV Outside', 'Prepaid Tokens', 'Instant Hot Water', 'Tiled Pantry Area'],
    reviews: [
      {
        id: 'r6_1',
        tenantName: 'Esther Korir',
        rating: 4,
        comment: 'Great water pressure in the shower, but supply is cut off briefly on Tuesdays for maintenance.',
        category: 'water',
        date: '2026-02-18'
      }
    ],
    lat: 80,
    lng: 55
  },
  {
    id: 'h7',
    title: 'University Gate Double Room',
    location: 'Juja, Kiambu',
    price: 11000,
    type: 'double_room',
    vacancy: 'vacant',
    description: 'Two spacious rooms with a shared kitchen and washroom. Perfect for students from JKUAT university co-sharing to cut down rent. High secure, token power meter, and robust security patrol.',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
    ],
    parking: false,
    waterReliability: 'borehole',
    electricity: 'prepaid',
    securityRating: 4.1,
    cleanlinessRating: 4.2,
    landlordBehaviorRating: 4.3,
    distanceFromCBD: 32.0,
    landlordName: 'Nesta Mbugua',
    landlordContact: '+254 725 333 444',
    caretakerName: 'Francis Kimanzi',
    caretakerContact: '+254 702 444 888',
    isFeatured: false,
    amenities: ['JKUAT Gate A Area', 'Token Meters Separate', 'Borehole Backup Pump', 'High Wall Security'],
    reviews: [
      {
        id: 'r7_1',
        tenantName: 'Timothy Kioko',
        rating: 4,
        comment: 'We share this as JKUAT comrades and it is very economical. Water is borehole but clean!',
        category: 'general',
        date: '2026-05-18'
      }
    ],
    lat: 15,
    lng: 85
  },
  {
    id: 'h8',
    title: 'Prestige Royal 2 Bedroom Condo',
    location: 'Nairobi CBD, Nairobi',
    price: 35000,
    type: 'two_bedroom',
    vacancy: 'under_construction',
    description: 'Ultra-modern 2-bedroom condominium located strictly in the heart of town. Gated rooftop garden, secure card elevator access, customized ambient LED light installations, and state of art finishes.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=80'
    ],
    parking: true,
    waterReliability: '24/7',
    electricity: 'postpaid',
    securityRating: 5.0,
    cleanlinessRating: 4.9,
    landlordBehaviorRating: 4.6,
    distanceFromCBD: 0.1,
    landlordName: 'Amara Developers Ltd',
    landlordContact: '+254 700 800 900',
    caretakerName: 'Eng. Evans Kipsang',
    caretakerContact: '+254 722 000 111',
    isFeatured: true,
    amenities: ['Rooftop Deck', 'Card Access Security', 'Backup Generator', 'Elevator', 'LED Accent Lights', 'Secure Underground Parking'],
    reviews: [],
    lat: 50,
    lng: 50
  }
];
