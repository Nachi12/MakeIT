'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Users, 
  Layers, 
  Code2, 
  Send, 
  Calendar, 
  UserCheck, 
  Clock, 
  PhoneCall,
  Flame,
  PhoneOutgoing,
  Settings,
  BarChart3,
  ListTodo,
  ChevronRight,
  Sparkles
} from 'lucide-react';

import { DashboardOverview } from './DashboardOverview';
import { LeadManagementView } from './LeadManagementView';
import { ProjectManagementView } from './ProjectManagementView';
import { ExpertManagementView } from './ExpertManagementView';
import { ServiceManagementView } from './ServiceManagementView';
import { TechnologyManagementView } from './TechnologyManagementView';
import { ProposalManagementView } from './ProposalManagementView';
import { AppointmentManagementView } from './AppointmentManagementView';
import { CustomerManagementView } from './CustomerManagementView';
import { AuditLogView } from './AuditLogView';

// CRM Module Views
import { CrmDashboardView } from './crm/CrmDashboardView';
import { CrmLeadDetailView } from './crm/CrmLeadDetailView';
import { CrmLeadsListView } from './crm/CrmLeadsListView';
import { CrmPipelineView } from './crm/CrmPipelineView';
import { CrmContactsView } from './crm/CrmContactsView';
import { CrmCallsView } from './crm/CrmCallsView';
import { CrmFollowUpsView } from './crm/CrmFollowUpsView';
import { CrmReportsView } from './crm/CrmReportsView';
import { CrmSettingsView } from './crm/CrmSettingsView';
import { CrmQuickAddClientModal } from './crm/CrmQuickAddClientModal';

export const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('crm-dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState<boolean>(false);

  const navItems = [
    // CRM SECTION
    { category: 'Sales & Telephony CRM', items: [
      { id: 'crm-dashboard', label: 'CRM Command Dashboard', icon: Flame },
      { id: 'crm-pipeline', label: 'Sales Pipeline', icon: Layers },
      { id: 'crm-leads', label: 'Leads Queue', icon: FileText },
      { id: 'crm-contacts', label: 'Contacts & Accounts', icon: Users },
      { id: 'crm-calls', label: 'Call Log & History', icon: PhoneOutgoing },
      { id: 'crm-followups', label: 'Follow-ups & Tasks', icon: ListTodo },
      { id: 'crm-reports', label: 'CRM Reports', icon: BarChart3 },
      { id: 'crm-settings', label: 'Telephony Settings', icon: Settings }
    ]},
    // PLATFORM OPERATIONS
    { category: 'Platform Operations', items: [
      { id: 'dashboard', label: 'Platform Overview', icon: LayoutDashboard },
      { id: 'leads', label: 'Requirements Roster', icon: FileText },
      { id: 'projects', label: 'Projects & Teams', icon: Briefcase },
      { id: 'experts', label: 'Experts Directory', icon: Users },
      { id: 'services', label: 'Services Catalog', icon: Layers },
      { id: 'technologies', label: 'Technologies Catalog', icon: Code2 },
      { id: 'proposals', label: 'Proposals', icon: Send },
      { id: 'appointments', label: 'Consultations', icon: Calendar },
      { id: 'customers', label: 'Customer Directory', icon: UserCheck },
      { id: 'audit', label: 'Enterprise Audit Logs', icon: Clock }
    ]}
  ];

  const handleSelectLead = (lead: any) => {
    setSelectedLeadId(lead.id);
    setActiveTab('crm-lead-detail');
  };

  const handleClientCreated = (lead: any, startCall?: boolean) => {
    setSelectedLeadId(lead.id);
    setActiveTab('crm-lead-detail');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col md:flex-row text-[#0B1F3A]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0B1F3A] text-white p-5 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center font-extrabold text-lg text-white shadow-xs">
                M
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-white leading-tight">MakeIT CRM</h1>
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Enterprise Calling System</p>
              </div>
            </div>
          </div>

          {/* Navigation Links Grouped by Category */}
          <nav className="space-y-6">
            {navItems.map(group => (
              <div key={group.category} className="space-y-1">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-3 block mb-1">
                  {group.category}
                </span>
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id || (item.id === 'crm-leads' && activeTab === 'crm-lead-detail');
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.id !== 'crm-lead-detail') setSelectedLeadId(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive 
                          ? 'bg-[#2563EB] text-white shadow-xs font-extrabold' 
                          : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User Role Indicator Footer */}
        <div className="pt-6 border-t border-[#1E293B] px-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-xs font-extrabold text-[#60A5FA]">
              SA
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">Sales / Platform Admin</span>
              <span className="text-[10px] text-[#059669] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span> Telephony Active
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* CRM Views */}
          {activeTab === 'crm-dashboard' && (
            <CrmDashboardView 
              onSelectLead={handleSelectLead} 
              onOpenQuickAdd={() => setQuickAddModalOpen(true)} 
            />
          )}

          {activeTab === 'crm-lead-detail' && selectedLeadId && (
            <CrmLeadDetailView 
              leadId={selectedLeadId} 
              onBack={() => setActiveTab('crm-dashboard')} 
            />
          )}

          {activeTab === 'crm-leads' && (
            <CrmLeadsListView 
              onSelectLead={handleSelectLead} 
              onOpenQuickAdd={() => setQuickAddModalOpen(true)} 
            />
          )}

          {activeTab === 'crm-pipeline' && (
            <CrmPipelineView onSelectLead={handleSelectLead} />
          )}

          {activeTab === 'crm-contacts' && <CrmContactsView />}

          {activeTab === 'crm-calls' && <CrmCallsView />}

          {activeTab === 'crm-followups' && (
            <CrmFollowUpsView onSelectLead={handleSelectLead} />
          )}

          {activeTab === 'crm-reports' && <CrmReportsView />}

          {activeTab === 'crm-settings' && <CrmSettingsView />}

          {/* Operational Admin Legacy Views */}
          {activeTab === 'dashboard' && <DashboardOverview onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'leads' && <LeadManagementView />}
          {activeTab === 'projects' && <ProjectManagementView />}
          {activeTab === 'experts' && <ExpertManagementView />}
          {activeTab === 'services' && <ServiceManagementView />}
          {activeTab === 'technologies' && <TechnologyManagementView />}
          {activeTab === 'proposals' && <ProposalManagementView />}
          {activeTab === 'appointments' && <AppointmentManagementView />}
          {activeTab === 'customers' && <CustomerManagementView />}
          {activeTab === 'audit' && <AuditLogView />}

        </div>
      </main>

      {/* Quick Add Client Modal */}
      <CrmQuickAddClientModal 
        isOpen={quickAddModalOpen}
        onClose={() => setQuickAddModalOpen(false)}
        onClientCreated={handleClientCreated}
      />

    </div>
  );
};
