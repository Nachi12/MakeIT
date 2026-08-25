'use client';

import React, { useEffect, useState } from 'react';
import { Users, Building, Phone, Mail, MapPin } from 'lucide-react';
import { contactsApi, companiesApi } from '@/services/makeit-api';
import { Contact, Company } from '@/types';
import { Badge } from '../../ui/Badge';

export const CrmContactsView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState<'contacts' | 'companies'>('contacts');

  useEffect(() => {
    contactsApi.getAll().then(res => res.success && res.data && setContacts(res.data));
    companiesApi.getAll().then(res => res.success && res.data && setCompanies(res.data));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">Contacts & Corporate Accounts</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Unified CRM customer profiles and organization directory.</p>
        </div>

        <div className="flex bg-[#F1F5F9] p-1 rounded-xl gap-1">
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${activeTab === 'contacts' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-[#64748B]'}`}
          >
            Contacts ({contacts.length})
          </button>
          <button 
            onClick={() => setActiveTab('companies')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${activeTab === 'companies' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-[#64748B]'}`}
          >
            Companies ({companies.length})
          </button>
        </div>
      </div>

      {activeTab === 'contacts' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-[#0B1F3A]">{c.name}</h4>
                <Badge variant="blue">{c.source}</Badge>
              </div>
              <p className="text-xs text-[#475569] font-medium">{c.companyName || 'Individual Founder'}</p>
              <div className="text-xs text-[#64748B] space-y-1 pt-2 border-t border-[#F1F5F9]">
                <p><Phone className="w-3.5 h-3.5 inline mr-1 text-[#2563EB]" /> {c.phone}</p>
                {c.email && <p><Mail className="w-3.5 h-3.5 inline mr-1 text-[#2563EB]" /> {c.email}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map(comp => (
            <div key={comp.id} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-[#0B1F3A]">{comp.name}</h4>
                <Badge variant="emerald">Corporate</Badge>
              </div>
              <p className="text-xs text-[#475569]">{comp.website || 'No website provided'}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
