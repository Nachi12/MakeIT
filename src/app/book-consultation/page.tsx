'use client';

import React, { Suspense } from 'react';
import { ConsultationBookingModal } from '@/components/forms/ConsultationBookingModal';

export default function BookConsultationPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 font-sans">
      <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0B1F3A]">Book Strategy Consultation</h1>
          <p className="text-xs text-[#475569] font-normal">Select a specialist, target date, and time slot for a 1-on-1 strategy call.</p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-[#64748B]">Loading Booking Form...</div>}>
          <ConsultationBookingModal />
        </Suspense>
      </div>
    </div>
  );
}

