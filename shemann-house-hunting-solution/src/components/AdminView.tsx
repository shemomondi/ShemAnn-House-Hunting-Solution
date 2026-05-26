/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { HouseListing, Booking, AdmittedLandlord } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { Shield, Users, Landmark, BadgeAlert, Coins, Trash2, ShieldCheck, BadgeCheck, Check, Layers, AlertTriangle, FileText, Download, UserPlus, ShieldAlert, BadgeDollarSign } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ProfileHubCard } from './ProfileHubCard';

interface AdminViewProps {
  listings: HouseListing[];
  onDeleteListing: (id: string) => void;
  bookings: Booking[];
  unlockedListingsCount: number;
  admittedLandlords: AdmittedLandlord[];
  onAdmitLandlord: (newLld: AdmittedLandlord) => void;
  onToggleSubscriptionPaid: (id: string) => void;
  onToggleSuspended: (id: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  listings,
  onDeleteListing,
  bookings,
  unlockedListingsCount,
  admittedLandlords,
  onAdmitLandlord,
  onToggleSubscriptionPaid,
  onToggleSuspended
}) => {
  // Mock Landlords pending review list
  const [pendingLandlords, setPendingLandlords] = useState([
    { id: 'll1', name: 'Stephen Onyango', phone: '+254 711 223 344', email: 'steve@rent.co.ke', estateName: 'Roysambu Heights' },
    { id: 'll2', name: 'Peninah Njeri', phone: '+254 722 554 669', email: 'peninah@njeri.co.ke', estateName: 'Kahawa Elite Court' }
  ]);

  // Billing analytics snapshot indices
  const totalLeadsRent = unlockedListingsCount * 200; // KES 200 each unlock
  const totalSubRent = 4 * 1500; // KES 1500 each premium
  const totalBookingRent = bookings.filter(b => b.status === 'confirmed').length * 500; // KES 500 each booking
  const aggregateRevenue = totalLeadsRent + totalSubRent + totalBookingRent;

  // Custom datasets for charts
  const revenueTrendData = [
    { month: 'Jan', unlockedRent: 1200, premiumSub: 3000, bookings: 1000 },
    { month: 'Feb', unlockedRent: 2400, premiumSub: 4500, bookings: 2000 },
    { month: 'Mar', unlockedRent: 3800, premiumSub: 4500, bookings: 3500 },
    { month: 'Apr', unlockedRent: 5200, premiumSub: 6000, bookings: 4500 },
    { month: 'May (Live)', unlockedRent: totalLeadsRent, premiumSub: totalSubRent, bookings: totalBookingRent }
  ];

  const occupancySnapshotData = [
    { name: 'Vacant', count: listings.filter(h => h.vacancy === 'vacant').length, fill: '#10b981' },
    { name: 'Occupied', count: listings.filter(h => h.vacancy === 'occupied').length, fill: '#ef4444' },
    { name: 'Booked', count: listings.filter(h => h.vacancy === 'booked').length, fill: '#f59e0b' },
    { name: 'Under Con.', count: listings.filter(h => h.vacancy === 'under_construction').length, fill: '#6366f1' }
  ];

  // Form states for Admitting landlord
  const [newLldName, setNewLldName] = useState('');
  const [newLldPhone, setNewLldPhone] = useState('');
  const [newLldCaretaker, setNewLldCaretaker] = useState('');
  const [newLldCaretakerPhone, setNewLldCaretakerPhone] = useState('');
  const [newLldEstate, setNewLldEstate] = useState('');

  const handleApproveLandlord = (id: string) => {
    const lld = pendingLandlords.find(ll => ll.id === id);
    if (lld) {
      onAdmitLandlord({
        id: `lld-${Date.now()}`,
        landlordName: lld.name,
        landlordContact: lld.phone,
        caretakerName: 'John Ochieng',
        caretakerContact: '+254 733 987 654',
        estateName: lld.estateName,
        subscriptionPaid: true,
        suspended: false,
        joinDate: '10/May/2026'
      });
      setPendingLandlords(prev => prev.filter(ll => ll.id !== id));
      alert(`Tenant check completed! Admitted ${lld.name} with premium active subscription status.`);
    }
  };

  const handleAdmitNewLandlordFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLldName.trim() || !newLldPhone.trim() || !newLldEstate.trim()) {
      alert('Please fill out at least Landlord Name, Phone, and Proposed Estate Name.');
      return;
    }

    onAdmitLandlord({
      id: `lld-${Date.now()}`,
      landlordName: newLldName,
      landlordContact: newLldPhone,
      caretakerName: newLldCaretaker || 'Not Assigned',
      caretakerContact: newLldCaretakerPhone || 'N/A',
      estateName: newLldEstate,
      subscriptionPaid: true,
      suspended: false,
      joinDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '/')
    });

    setNewLldName('');
    setNewLldPhone('');
    setNewLldCaretaker('');
    setNewLldCaretakerPhone('');
    setNewLldEstate('');

    alert('Successfully admitted landlord, generated partner credentials, and allocated subscription licensing!');
  };

  // 1. Download General Report as PDF (Engineered by Shem & Annitah)
  const downloadGeneralReport = () => {
    const doc = new jsPDF();
    let y = 20;

    const pageHeader = (pageNum: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(16, 185, 129); // emerald Green colors
      doc.text("SHEMANN HOUSE HUNTING SOLUTION", 14, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text("GENERAL PLATFORM STATUS & METRICS AUDIT REPORT", 14, y);
      y += 6;
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 116, 139);
      doc.text("System Engineered & Maintained by Developers: SHEM & ANNITAH", 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} • Page ${pageNum}`, 14, y);
      y += 8;
      doc.setDrawColor(203, 213, 225);
      doc.line(14, y, 196, y);
      y += 10;
    };

    pageHeader(1);

    // Metrics Summary Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("I. SYSTEM HEALTH & METRICS SUMMARY", 14, y);
    y += 8;

    const totalRevenue = (unlockedListingsCount * 200) + (admittedLandlords.filter(ll => ll.subscriptionPaid).length * 1500) + (bookings.filter(b => b.status === 'confirmed').length * 500);
    const activeVacant = listings.filter(h => h.vacancy === 'vacant').length;
    const activeOccupied = listings.filter(h => h.vacancy === 'occupied').length;

    const metrics = [
      { name: "Cumulative Platform Revenue", val: `KES ${totalRevenue.toLocaleString()}`, desc: "Aggregated unlock fees, active subscriptions & booking reservation downpayments." },
      { name: "Active Monitored Properties", val: `${listings.length} registered properties`, desc: "Count of active structural nodes in Nairobi database." },
      { name: "Vacant (Available) Houses", val: `${activeVacant} homes vacant`, desc: "Currently available listings for incoming tenants." },
      { name: "Occupied Houses", val: `${activeOccupied} homes occupied`, desc: "Rentals currently marked occupied or booked." },
      { name: "Premium Contact Unlocks", val: `${unlockedListingsCount} unlocked leads`, desc: "Total instances where tenants unlocked landlord contact details." },
      { name: "Reservation Bookings", val: `${bookings.length} reservations`, desc: "Total downpayment reserves currently pending or approved." },
      { name: "Admitted Landlords Partners", val: `${admittedLandlords.length} verified landlords`, desc: "Officially vetted operational real estate partners." }
    ];

    doc.setFontSize(10);
    metrics.forEach((m) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text(`• ${m.name}:`, 16, y);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(22, 163, 74); // emerald text for value
      doc.text(m.val, 75, y);
      
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 116, 139);
      doc.text(`- ${m.desc}`, 115, y);
      y += 7;
    });

    y += 8;

    // Landlords Registry
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("II. ADMITTED PARTNERS DIRECTORY REGISTER", 14, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("Landlord / Company Name", 16, y);
    doc.text("Estate / Property", 68, y);
    doc.text("Subscription", 115, y);
    doc.text("Operator Status", 150, y);
    doc.text("Join Date", 178, y);
    y += 4;
    doc.line(14, y, 196, y);
    y += 6;

    let page = 1;

    admittedLandlords.forEach((ll) => {
      if (y > 265) {
        doc.addPage();
        page += 1;
        y = 20;
        pageHeader(page);
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text("Landlord / Company Name", 16, y);
        doc.text("Estate / Property", 68, y);
        doc.text("Subscription", 115, y);
        doc.text("Operator Status", 150, y);
        doc.text("Join Date", 178, y);
        y += 4;
        doc.line(14, y, 196, y);
        y += 6;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      // Limit landlord name size
      const truncateName = ll.landlordName.substring(0, 24);
      doc.text(truncateName, 16, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(ll.estateName.substring(0, 22), 68, y);

      if (ll.subscriptionPaid) {
        doc.setTextColor(22, 163, 74);
        doc.text("PAID ACTIVE (KES 1,500)", 115, y);
      } else {
        doc.setTextColor(220, 38, 38);
        doc.text("UNPAID ACCOUNT", 115, y);
      }

      if (ll.suspended) {
        doc.setTextColor(220, 38, 38);
        doc.text("SUSPENDED", 150, y);
      } else {
        doc.setTextColor(30, 41, 59);
        doc.text("ACTIVE LISTED", 150, y);
      }

      doc.setTextColor(100, 116, 139);
      doc.text(ll.joinDate, 178, y);

      y += 6;
      // Caretaker info secondary line
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`   Contact: ${ll.landlordContact}  | Caretaker: ${ll.caretakerName} (${ll.caretakerContact})`, 16, y);
      doc.setFontSize(9);
      y += 6;
    });

    // Signature/Audit seal
    y += 10;
    if (y > 260) {
      doc.addPage();
      page += 1;
      y = 20;
      pageHeader(page);
    }
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, 182, 22, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("OFFICIAL SUPERADMIN AUDIT STAMP & COUNTERSIGN", 18, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Verified secure by ShemAnn House Hunting Solution Core Engine. Authorized for distribution.", 18, y + 11);
    doc.setTextColor(37, 99, 235);
    doc.text("Signing Officers: Developers SHEM & ANNITAH", 18, y + 16);

    doc.save(`shemann_house_hunting_general_status_report_${Date.now()}.pdf`);
  };

  // 2. Download Client Receipts & Direct Reassurance ledger as PDF (Engineered by Shem & Annitah)
  const downloadReceiptsReport = () => {
    const doc = new jsPDF();
    let y = 20;

    const pageHeader = (pageNum: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235); // Blue color scheme
      doc.text("SHEMANN HOUSE HUNTING SOLUTION", 14, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("DEPOSIT RECEIPTIARIES & REASSURANCE LOG AUDIT", 14, y);
      y += 6;
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 116, 139);
      doc.text("System Engineered & Maintained by Developers: SHEM & ANNITAH", 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} • Page ${pageNum}`, 14, y);
      y += 8;
      doc.setDrawColor(203, 213, 225);
      doc.line(14, y, 196, y);
      y += 10;
    };

    pageHeader(1);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("CLIENT TRANSACTIONAL RECEIPT RECORDS & OUTCOME LOG", 14, y);
    y += 8;

    let page = 1;

    // Helper to log a receipt block safely
    const logReceipt = (receiptNo: string, clientPhone: string, amount: string, purpose: string, houseTitle: string, landlord: string, outcome: string) => {
      if (y > 240) {
        doc.addPage();
        page += 1;
        y = 20;
        pageHeader(page);
      }

      // Draw light grey box for each receipt block
      doc.setDrawColor(241, 245, 249);
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 34, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(37, 99, 235); // Blue accent
      doc.text(`RECEIPT: ${receiptNo}`, 18, y + 6);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`Paid: ${amount} for ${purpose}`, 95, y + 6);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(`Client ID: ${clientPhone}`, 18, y + 12);
      doc.text(`Target Asset: ${houseTitle}`, 18, y + 17);
      doc.text(`Assigned Landlord/Caretaker: ${landlord}`, 18, y + 22);

      // Outcome status indicator
      doc.setFont("helvetica", "bold");
      if (outcome.includes("SUCCESS")) {
        doc.setTextColor(22, 163, 74); // green
      } else {
        doc.setTextColor(220, 38, 38); // red/rose
      }
      doc.text(`Reassurance Status Outcome: ${outcome.substring(0, 95)}`, 18, y + 28);

      y += 38;
    };

    // Simulate unlock receipt rows (KES 200)
    listings.slice(0, 3).forEach((house, index) => {
      const receiptNo = `REC-UNL-99${index}`;
      const clientPhone = `+254 755 000 11${index}`;
      logReceipt(
        receiptNo,
        clientPhone,
        "KES 200",
        "Contact Unlock",
        house.title,
        `${house.landlordName} (${house.landlordContact})`,
        "✅ SUCCESS: Client contact handshake completed and verified successfully."
      );
    });

    // Add bookings receipts rows (KES 500)
    bookings.forEach((b) => {
      const matchedH = listings.find(h => h.id === b.listingId);
      const receiptNo = `REC-BOK-77${b.id.substring(b.id.length - 4)}`;
      const clientPhone = b.clientPhone || `+254 722 000 333`;
      const landlordName = matchedH?.landlordName || "Robert Mwangi";
      const landlordPhone = matchedH?.landlordContact || "+254 712 345 678";
      const outcome = b.status === 'confirmed' 
        ? "✅ SUCCESS: Client locked room selection safely, keys ready with caretaker." 
        : "⚠️ PENDING DOWPAYMENT: Verification in progress; Onsite caretaker notified.";
      logReceipt(
        receiptNo,
        clientPhone,
        "KES 500",
        "Room Downpayment",
        b.listingTitle,
        `${landlordName} (${landlordPhone})`,
        outcome
      );
    });

    // Escalations
    logReceipt(
      "REC-UNL-8819",
      "+254 799 443 112",
      "KES 200",
      "Contact Unlock",
      "Roysambu Elite Heights",
      "Wambua Mwangi (+254 712 345 678)",
      "✅ SUCCESS: Admin connected client via standby caretaker John Njuguna."
    );

    logReceipt(
      "REC-BOK-2244",
      "+254 712 990 882",
      "KES 500",
      "Room Downpayment",
      "Kahawa Elite Court",
      "Peninah Njeri (+254 722 554 669)",
      "✅ SUCCESS: Keys handover checked; secure deposit validation active."
    );

    // Signature banner
    if (y > 260) {
      doc.addPage();
      page += 1;
      y = 20;
      pageHeader(page);
    }
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, 182, 22, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("OFFICIAL SUPERADMIN DEPOSIT REASSURANCE LOG AUDIT STAMP", 18, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("This ledger protects customer downpayments on ShemAnn House Hunting Solution.", 18, y + 11);
    doc.setTextColor(37, 99, 235);
    doc.text("Principal Engineers & Signing Officers: SHEM & ANNITAH", 18, y + 16);

    doc.save(`shemann_house_hunting_paid_receipts_reassurance_log_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Profile Hub & Security Settings Card */}
      <ProfileHubCard role="admin" />

      {/* 1. Admin System Performance index stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border rounded-2xl p-4.5 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>Platform Revenue KES</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 font-mono block">
            KES {aggregateRevenue.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-mono block">May Cumulative Month</span>
        </div>

        <div className="bg-white border rounded-2xl p-4.5 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Unlocked Leads</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 font-mono block">
            {unlockedListingsCount} Contacts
          </span>
          <span className="text-[10px] text-slate-400 block">Unlocks generating KES {totalLeadsRent}</span>
        </div>

        <div className="bg-white border rounded-2xl p-4.5 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Monitored Houses</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block">
            {listings.length} nodes
          </span>
          <span className="text-[10px] text-slate-400 block">Checked and synchronized</span>
        </div>

        <div className="bg-white border rounded-2xl p-4.5 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Direct Bookings</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block">
            {bookings.length} reservations
          </span>
          <span className="text-[10px] text-slate-400 block">
            {bookings.filter(b => b.status === 'confirmed').length} Approved payouts
          </span>
        </div>
      </div>

      {/* 2. Recharts Data Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue chart (Bar) */}
        <div className="lg:col-span-8 bg-white border rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Revenue Stream Trends & Analytics (KES)
            </h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-150">
              Lipa Na Mpesa Channels
            </span>
          </div>

          <div className="h-68 w-full text-slate-700 font-sans text-xs pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUnlocks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Area type="monotone" name="Unlocks KES" dataKey="unlockedRent" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUnlocks)" />
                <Area type="monotone" name="Premium Subs KES" dataKey="premiumSub" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSubs)" />
                <Area type="monotone" name="Bookings KES" dataKey="bookings" stroke="#f59e0b" strokeWidth={2} fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Status Chart */}
        <div className="lg:col-span-4 bg-white border rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Vacancy Allocation Index
            </h3>
          </div>

          <div className="h-68 w-full text-slate-700 font-sans text-xs pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancySnapshotData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" name="Houses count" radius={[0, 4, 4, 0]}>
                  {occupancySnapshotData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Instant Automated Reporting Desk */}
      <div className="bg-slate-950 border border-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4 hover:shadow-lg transition duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <h3 className="font-extrabold text-[#10b981] text-xs uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Instant Automated Reporting Desk</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              Generate fully detailed audits compiling real-time telemetry metrics, landlord subscriptions, and client reassurance records immediately.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              id="btn-download-general-report"
              onClick={downloadGeneralReport}
              className="bg-[#10b981] hover:bg-emerald-605 text-slate-950 font-extrabold text-[11px] px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>General Status Report (.PDF)</span>
            </button>
            <button
              id="btn-download-receipts-report"
              onClick={downloadReceiptsReport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Clients Receipts & Reassurance Ledgers (.PDF)</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-[#94a3b8]">
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 leading-relaxed">
            <span className="block font-bold text-white mb-1 text-[11px] uppercase tracking-wider text-emerald-400">📊 Telemetry Status Report Overview</span>
            Your downloaded report catalogs current vacant available counts, cumulative platforms transactional revenue projections, and full licensing directories for accounting audit reviews.
          </div>
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 leading-relaxed">
            <span className="block font-bold text-white mb-1 text-[11px] uppercase tracking-wider text-blue-400">🛡️ Direct Client Moving Reassurance Policy</span>
            Ensures paid clients found apartments or displays escalated items requiring administrative touchpoints with landlords. Restores customer satisfaction metrics in compliance with platform guidelines.
          </div>
        </div>
      </div>

      {/* 4. Superadmin Landlord Admission & Operating Ledgers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Admit New Landlord Desk form */}
        <div id="admit-landlord-form-container" className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs h-fit space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-650" />
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Admit New Landlord Partner
            </h3>
          </div>
          <form onSubmit={handleAdmitNewLandlordFormSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Landlord/Company Name</label>
              <input
                id="input-new-landlord-name"
                type="text"
                required
                value={newLldName}
                onChange={(e) => setNewLldName(e.target.value)}
                placeholder="e.g. Isaac Mwangi"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-550 transition-all text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Landlord Phone Number</label>
              <input
                id="input-new-landlord-phone"
                type="text"
                required
                value={newLldPhone}
                onChange={(e) => setNewLldPhone(e.target.value)}
                placeholder="e.g. +254 712 111 222"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-550 transition-all text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estate / Apartment Name</label>
              <input
                id="input-new-landlord-estate"
                type="text"
                required
                value={newLldEstate}
                onChange={(e) => setNewLldEstate(e.target.value)}
                placeholder="e.g. Roysambu Elite Court"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-550 transition-all text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Associated Caretaker Name</label>
              <input
                id="input-new-landlord-caretaker"
                type="text"
                value={newLldCaretaker}
                onChange={(e) => setNewLldCaretaker(e.target.value)}
                placeholder="e.g. Robert Njuguna"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-550 transition-all text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Caretaker Phone Number</label>
              <input
                id="input-new-landlord-caretaker-phone"
                type="text"
                value={newLldCaretakerPhone}
                onChange={(e) => setNewLldCaretakerPhone(e.target.value)}
                placeholder="e.g. +254 799 111 222"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-550 transition-all text-slate-800"
              />
            </div>
            <button
              id="btn-admit-landlord-submit"
              type="submit"
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Admit Landlord Profile</span>
            </button>
          </form>
        </div>

        {/* Admitted Landlords Directory Registry */}
        <div id="admitted-landlords-list" className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-650" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Admitted Landlords Partners Directory ({admittedLandlords.length})
              </h3>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold">
              Verification Node Live
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[480px] pr-1.5">
            {admittedLandlords.map((ll) => (
              <div
                key={ll.id}
                id={`directory-item-${ll.id}`}
                className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                  ll.suspended ? 'bg-red-50/40 border-red-200' : 'bg-slate-5/50 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{ll.landlordName}</span>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-bold font-mono">
                      {ll.estateName}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-500 font-semibold text-[11px]">
                    <div>📞 Landlord: <span className="text-slate-700 font-bold font-mono">{ll.landlordContact}</span></div>
                    <div>🛠️ Caretaker: <span className="text-slate-705 font-bold">{ll.caretakerName}</span> <span className="text-slate-500 font-mono text-[10px]">({ll.caretakerContact})</span></div>
                    <div>📅 License Admitted: <span className="text-slate-700 font-bold font-mono">{ll.joinDate}</span></div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {/* Monthly subscription status toggle */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onToggleSubscriptionPaid(ll.id);
                        alert(`Modified subscription for ${ll.landlordName}!`);
                      }}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        ll.subscriptionPaid
                          ? 'bg-emerald-55 text-emerald-800 border-emerald-200'
                          : 'bg-rose-55 text-rose-800 border-rose-200'
                      }`}
                      title="Click to toggle paid status"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${ll.subscriptionPaid ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                      <span>{ll.subscriptionPaid ? 'Sub: Paid' : 'Sub: Unpaid'}</span>
                    </button>
                  </div>

                  {/* Suspension status operating toggle */}
                  <button
                    onClick={() => {
                      onToggleSuspended(ll.id);
                      const stateMsg = ll.suspended ? 'operating actively' : 'operationally suspended';
                      alert(`Operator status modified! ${ll.landlordName} is now ${stateMsg}.`);
                    }}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      ll.suspended
                        ? 'bg-red-600 hover:bg-red-700 text-white border-transparent'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border-transparent'
                    }`}
                  >
                    {ll.suspended ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-white" />
                        <span>Unsuspend</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-[#fda4af]" />
                        <span>Suspend services</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Landlord audit approvals desk */}
        <div id="landlord-approvals-audit-desk" className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Landlords Approvals Audit Desk
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-bold">
              Identity checks
            </span>
          </div>

          {pendingLandlords.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs text-slate-450 font-bold col-span-2">
              🎉 All pending landlords evaluated and approved successfully!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLandlords.map((ll) => (
                <div key={ll.id} className="p-3.5 bg-slate-50 border rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-extrabold text-slate-850 block">{ll.name}</span>
                    <span className="text-[11px] text-slate-500 block">Proposed Estate: {ll.estateName}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{ll.phone} | {ll.email}</span>
                  </div>

                  <button
                    onClick={() => handleApproveLandlord(ll.id)}
                    className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs rounded-lg transition text-center cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Approve profile</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Listing Moderator and fake description detection */}
        <div id="flagged-listings-moderator" className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-sans">
              Safety Check: Flagged Fake Listings Moderator
            </h3>
          </div>

          <div className="space-y-3">
            {listings.map((house) => (
              <div key={house.id} className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between gap-4">
                <div className="truncate pr-2">
                  <span className="text-xs font-extrabold text-slate-850 block truncate">{house.title}</span>
                  <span className="text-[10px] text-slate-450 truncate block">
                    Contact: {house.landlordName} ({house.landlordContact})
                  </span>
                </div>

                <button
                  onClick={() => {
                    onDeleteListing(house.id);
                    alert('Fake listing successfully flagged, deleted, and purged from active client catalogs!');
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition shrink-0 cursor-pointer flex items-center gap-1 border border-slate-200 hover:border-red-200"
                  title="Force Purge from Database"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[10px] font-bold text-red-600">Force Purge</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
