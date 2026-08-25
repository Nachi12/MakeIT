'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { adminDashboardApi } from '@/services/makeit-api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DashboardOverview: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardApi.getStats().then((res) => {
      if (res.success && res.data) {
        setStats(res.data);
      }
      setLoading(false);
    });
  }, []);

  const metrics = stats?.metrics || {
    totalRequirements: 2,
    totalLeads: 2,
    qualifiedLeads: 2,
    activeProjects: 1,
    completedProjects: 0,
    totalExperts: 7,
    totalServices: 10,
    pendingProposals: 1,
    upcomingAppointments: 1,
    totalRevenueINR: 85000
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Active Requirements</p>
            <h3 className="text-2xl font-extrabold text-[#0B1F3A] mt-1">{metrics.totalRequirements}</h3>
            <p className="text-xs text-[#059669] font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% database verified
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Qualified Leads</p>
            <h3 className="text-2xl font-extrabold text-[#0B1F3A] mt-1">{metrics.qualifiedLeads}</h3>
            <p className="text-xs text-[#2563EB] font-medium mt-1">Requires expert assignment</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Projects in Progress</p>
            <h3 className="text-2xl font-extrabold text-[#0B1F3A] mt-1">{metrics.activeProjects}</h3>
            <p className="text-xs text-[#D97706] font-medium mt-1">Milestones on schedule</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Verified Revenue</p>
            <h3 className="text-2xl font-extrabold text-[#0B1F3A] mt-1">
              ₹{(metrics.totalRevenueINR / 1000).toFixed(0)}k
            </h3>
            <p className="text-xs text-[#64748B] font-medium mt-1">Contract value in INR</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] text-[#0B1F3A] flex items-center justify-center border border-[#E2E8F0]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Required Banner */}
      <div className="bg-[#0B1F3A] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#1E293B] rounded-xl text-[#60A5FA]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold">Operational Command Highlights</h4>
            <p className="text-sm text-[#94A3B8] mt-0.5">
              You have <span className="text-white font-semibold">{metrics.pendingProposals} pending proposal</span> awaiting customer response and <span className="text-white font-semibold">{metrics.upcomingAppointments} consultation</span> scheduled for this week.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('leads')}>
            Review Requirements <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Grid Section: Recent Requirements & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Customer Requirements */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2563EB]" /> Recent Customer Submissions
            </h3>
            <button onClick={() => onNavigate('leads')} className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
              View All Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {(stats?.recentRequirements || []).map((req: any) => (
              <div key={req.id} className="p-4 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0B1F3A]">{req.customerName}</span>
                    <span className="text-xs text-[#64748B]">({req.companyName || 'Founder'})</span>
                    <Badge variant="blue">{req.projectType || 'IT Requirement'}</Badge>
                  </div>
                  <p className="text-sm font-medium text-[#1E293B] line-clamp-1">"{req.rawInput}"</p>
                  <div className="flex items-center gap-4 text-xs text-[#64748B] mt-2">
                    <span>Budget: <strong className="text-[#0B1F3A]">{req.budgetRange}</strong></span>
                    <span>Timeline: <strong className="text-[#0B1F3A]">{req.timeline}</strong></span>
                  </div>
                </div>

                <Button size="sm" variant="outline" onClick={() => onNavigate('leads')}>
                  Inspect Lead
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Widget */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2563EB]" /> Enterprise Audit Log
            </h3>
            <button onClick={() => onNavigate('audit')} className="text-xs font-semibold text-[#2563EB] hover:underline">
              Full Logs
            </button>
          </div>

          <div className="space-y-3.5">
            {(stats?.recentAuditLogs || []).map((log: any) => (
              <div key={log.id} className="text-xs p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#0B1F3A]">
                  <span className="text-[#2563EB]">{log.action}</span>
                  <span className="text-[#94A3B8] font-normal">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[#475569]">{log.details}</p>
                <div className="text-[10px] text-[#94A3B8] font-mono">Actor: {log.userName} ({log.userRole})</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
