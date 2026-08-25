'use client';

import React, { useState } from 'react';
import { User, Phone, Mail, Building, PhoneOutgoing, AlertCircle } from 'lucide-react';
import { contactsApi } from '@/services/makeit-api';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

export const CrmQuickAddClientModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (lead: any, startCall?: boolean) => void;
}> = ({ isOpen, onClose, onClientCreated }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [source, setSource] = useState('Phone Call');
  const [requirementText, setRequirementText] = useState('');

  // Duplicate state
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null);

  const handlePhoneBlur = async () => {
    if (phone.length > 5) {
      const res = await contactsApi.checkDuplicate(phone, email);
      if (res.success && res.data?.isDuplicate) {
        setDuplicateWarning(res.data.contact);
      } else {
        setDuplicateWarning(null);
      }
    }
  };

  const handleSubmit = async (startCallNow: boolean) => {
    if (!name || !phone) {
      alert('Please fill in Name and Phone Number.');
      return;
    }

    const res = await contactsApi.quickAdd({
      name,
      phone,
      email,
      companyName,
      source,
      requirementText
    });

    if (res.success && res.data?.lead) {
      onClientCreated(res.data.lead, startCallNow);
      onClose();
      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setCompanyName('');
      setRequirementText('');
      setDuplicateWarning(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Add Client & Start Calling">
      <div className="space-y-4 font-sans text-xs">
        
        {/* Duplicate Warning */}
        {duplicateWarning && (
          <div className="p-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Existing Contact Found!</span>
              <p className="text-[11px] text-[#334155] mt-0.5">
                Contact <strong className="text-[#0B1F3A]">{duplicateWarning.name}</strong> ({duplicateWarning.phone}) already exists in CRM database.
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="font-bold text-[#0B1F3A]">Client Full Name *</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="E.g., Vikramaditya Shah"
            className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-[#0B1F3A]">Primary Phone Number *</label>
            <input 
              type="text" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              onBlur={handlePhoneBlur}
              placeholder="+91 98765 43210"
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
              required 
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="client@company.com"
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-[#0B1F3A]">Company / Startup Name</label>
            <input 
              type="text" 
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)} 
              placeholder="E.g., Nexus SaaS Solutions"
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="font-bold text-[#0B1F3A]">Lead Channel Source</label>
            <select 
              value={source} 
              onChange={e => setSource(e.target.value)}
              className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg bg-white outline-none focus:border-[#2563EB]"
            >
              <option value="Phone Call">Inbound Phone Call</option>
              <option value="Website">Website Form</option>
              <option value="LinkedIn">LinkedIn Outreach</option>
              <option value="Referral">Client Referral</option>
              <option value="WhatsApp">WhatsApp Inquiry</option>
              <option value="Manual Entry">Manual Sales Entry</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-bold text-[#0B1F3A]">Project Requirement / Initial Inquiry Notes</label>
          <textarea 
            rows={3} 
            value={requirementText} 
            onChange={e => setRequirementText(e.target.value)} 
            placeholder="Briefly state what the client wants to build..."
            className="w-full text-xs p-2.5 mt-1 border border-[#CBD5E1] rounded-lg outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          
          <Button variant="secondary" size="sm" type="button" onClick={() => handleSubmit(false)}>
            Save Client Record
          </Button>

          <Button variant="primary" size="sm" type="button" onClick={() => handleSubmit(true)} icon={<PhoneOutgoing className="w-3.5 h-3.5" />}>
            Save & Call Now
          </Button>
        </div>

      </div>
    </Modal>
  );
};
