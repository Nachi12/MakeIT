'use client';

import React, { useState } from 'react';
import { CheckCircle2, Video } from 'lucide-react';
import { useAppState } from '@/lib/services/store';
import { Expert, ConsultationType } from '@/types';
import { Button } from '../ui/Button';
import { RatingStars } from '../ui/RatingStars';

interface ConsultationBookingModalProps {
  expert?: Expert;
  onSuccess?: () => void;
}

export const ConsultationBookingModal: React.FC<ConsultationBookingModalProps> = ({
  expert,
  onSuccess
}) => {
  const { experts, bookConsultation } = useAppState();
  const [selectedExpertId, setSelectedExpertId] = useState<string>(expert?.id || experts[0]?.id || '');
  const [consultationType, setConsultationType] = useState<ConsultationType>('30 min Deep Dive');
  const [date, setDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM - 11:30 AM IST');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookedMeetingUrl, setBookedMeetingUrl] = useState('');

  const activeExpert = experts.find(e => e.id === selectedExpertId) || expert || experts[0];

  const availableSlots = [
    '10:00 AM - 10:30 AM IST',
    '11:00 AM - 11:30 AM IST',
    '02:00 PM - 02:30 PM IST',
    '04:30 PM - 05:00 PM IST',
    '06:00 PM - 06:30 PM IST'
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExpert) return;

    const newCons = bookConsultation({
      expertId: activeExpert.id,
      expertName: activeExpert.name,
      expertTitle: activeExpert.title,
      customerName: customerName || 'Valued Client',
      customerEmail: customerEmail || 'client@example.com',
      customerPhone,
      date,
      timeSlot,
      consultationType,
      topic: topic || `Strategy session regarding ${activeExpert.categoryName}`
    });

    setBookedMeetingUrl(newCons.meetingUrl || '');
    setIsBooked(true);
    if (onSuccess) onSuccess();
  };

  if (isBooked) {
    return (
      <div className="p-6 text-center space-y-6 animate-in fade-in duration-150 font-sans">
        <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-[#0B1F3A]">Consultation Confirmed</h3>
          <p className="text-sm text-[#475569] mt-1 font-normal">
            Your {consultationType} with <span className="font-semibold text-[#0B1F3A]">{activeExpert.name}</span> is scheduled for {date} at {timeSlot}.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left text-xs space-y-2 font-normal">
          <div className="flex items-center justify-between text-[#64748B]">
            <span>SPECIALIST:</span>
            <span className="text-[#0B1F3A] font-semibold">{activeExpert.name} ({activeExpert.title})</span>
          </div>
          <div className="flex items-center justify-between text-[#64748B]">
            <span>MEETING LINK:</span>
            <a href={bookedMeetingUrl} target="_blank" rel="noreferrer" className="text-[#2563EB] font-semibold hover:underline truncate max-w-[200px]">
              {bookedMeetingUrl}
            </a>
          </div>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsBooked(false)}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleBooking} className="space-y-5 font-sans">
      
      {/* Select Expert if not locked */}
      {!expert && (
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5">Select Specialist</label>
          <select
            value={selectedExpertId}
            onChange={(e) => setSelectedExpertId(e.target.value)}
            className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
          >
            {experts.map((exp) => (
              <option key={exp.id} value={exp.id} className="text-[#0F172A]">
                {exp.name} — {exp.title} ({exp.categoryName})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Expert Summary Card */}
      {activeExpert && (
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3.5">
          <img src={activeExpert.avatar} alt={activeExpert.name} className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0] shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-[#0B1F3A]">{activeExpert.name}</h4>
            <p className="text-xs text-[#2563EB] font-semibold">{activeExpert.title}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#64748B]">
              <RatingStars rating={activeExpert.rating} size="sm" />
              <span>• {activeExpert.location}</span>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-2">Duration & Session Type</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            '15 min Quick Intake',
            '30 min Deep Dive',
            '60 min Strategy & Specs'
          ].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setConsultationType(type as ConsultationType)}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                consultationType === type
                  ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]'
                  : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Date & Time Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5">Select Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5">Select Time Slot</label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
          >
            {availableSlots.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact info & Topic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5">Your Name *</label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5">Email Address *</label>
          <input
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="rahul@company.com"
            className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5">Discussion Topic / Agenda</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Briefly state key requirements or objectives"
          className="w-full p-3 rounded-xl mnc-input text-sm text-[#0F172A]"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" icon={<Video className="w-5 h-5" />}>
        Confirm Consultation Booking
      </Button>

    </form>
  );
};

