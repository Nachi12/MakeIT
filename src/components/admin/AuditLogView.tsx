'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, FileText, User } from 'lucide-react';
import { auditLogsApi } from '@/services/makeit-api';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    auditLogsApi.getAll().then(res => {
      if (res.success && res.data) {
        setLogs(res.data);
      }
    });
  }, []);

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Enterprise Operational Audit Log</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Immutable activity history of admin actions, expert assignments, lead updates, and platform changes.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-bold">Timestamp</th>
              <th className="py-3 px-4 font-bold">Administrator / Actor</th>
              <th className="py-3 px-4 font-bold">Action Performed</th>
              <th className="py-3 px-4 font-bold">Target Entity</th>
              <th className="py-3 px-4 font-bold">Action Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-[#F8FAFC]">
                <td className="py-3.5 px-4 font-mono text-[#64748B] whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#0B1F3A]">
                  {log.userName}
                  <span className="block text-[10px] text-[#2563EB] font-mono">{log.userRole}</span>
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#2563EB]">{log.action}</td>
                <td className="py-3.5 px-4 font-semibold text-[#334155]">
                  {log.entity} <span className="text-[10px] text-[#94A3B8]">({log.entityId})</span>
                </td>
                <td className="py-3.5 px-4 text-[#475569] font-medium">{log.details || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
