'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, User } from 'lucide-react';
import { appointmentsApi } from '@/services/makeit-api';
import { Consultation } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AppointmentManagementView: React.FC = () => {
  const [appointments, setAppointments] = useState<Consultation[]>([]);

  useEffect(() => {
    appointmentsApi.getAll().then(res => {
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    });
  }, []);

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Technical Consultations Schedule</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Manage intake quick calls and architecture strategy sessions with expert advisors.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-bold">Scheduled Time</th>
              <th className="py-3 px-4 font-bold">Customer</th>
              <th className="py-3 px-4 font-bold">Assigned Expert</th>
              <th className="py-3 px-4 font-bold">Consultation Type & Topic</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold">Meeting Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {appointments.map(apt => (
              <tr key={apt.id} className="hover:bg-[#F8FAFC]">
                <td className="py-3.5 px-4 font-medium text-[#0B1F3A]">
                  <div>{apt.date}</div>
                  <span className="text-[10px] text-[#2563EB] font-bold">{apt.timeSlot}</span>
                </td>
                <td className="py-3.5 px-4 font-medium text-[#334155]">
                  {apt.customerName}
                  <span className="block text-[10px] text-[#94A3B8]">{apt.customerEmail} • {apt.customerPhone}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#0B1F3A]">{apt.expertName}</td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#2563EB]">{apt.consultationType}</span>
                  <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">{apt.topic}</p>
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant={apt.status === 'COMPLETED' ? 'emerald' : 'blue'}>
                    {apt.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4">
                  {apt.meetingUrl ? (
                    <a href={apt.meetingUrl} target="_blank" rel="noreferrer" className="text-[#2563EB] font-bold underline flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> Open Room
                    </a>
                  ) : (
                    <span className="text-[#94A3B8]">Pending Link</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
