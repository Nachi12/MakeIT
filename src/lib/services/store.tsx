'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Expert, 
  Service, 
  ServiceCategory, 
  Lead, 
  Project, 
  Consultation, 
  Requirement,
  UserRole,
  BusinessSolution
} from '@/types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_SERVICES, 
  INITIAL_EXPERTS, 
  MOCK_INITIAL_LEADS, 
  MOCK_INITIAL_PROJECTS, 
  MOCK_INITIAL_CONSULTATIONS,
  INITIAL_SOLUTIONS
} from '../data/mockData';
import { MatchingWeights, DEFAULT_WEIGHTS, parseRequirementText, rankExpertsForRequirement } from './matchingEngine';
import { servicesApi, expertsApi, requirementsApi, leadsApi, projectsApi, appointmentsApi, matchesApi } from '@/services/makeit-api';

interface AppStateContextType {
  // Current Active Role for standard demo navigation
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Data collections
  categories: ServiceCategory[];
  solutions: BusinessSolution[];
  services: Service[];
  experts: Expert[];
  leads: Lead[];
  projects: Project[];
  consultations: Consultation[];
  matchingWeights: MatchingWeights;
  refreshData: () => void;

  // Actions
  submitRequirement: (req: Partial<Requirement>) => { lead: Lead; rankedExperts: ReturnType<typeof rankExpertsForRequirement> };
  bookConsultation: (consultation: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => Consultation;
  updateLeadStatus: (leadId: string, status: Lead['status'], assignedExpertId?: string) => void;
  updateProjectStatus: (projectId: string, status: Project['status']) => void;
  updateMatchingWeights: (weights: Partial<MatchingWeights>) => void;
  
  // Admin CMS actions
  addService: (service: Service) => void;
  updateService: (serviceId: string, updated: Partial<Service>) => void;
  addExpert: (expert: Expert) => void;
  updateExpert: (expertId: string, updated: Partial<Expert>) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [categories, setCategories] = useState<ServiceCategory[]>(INITIAL_CATEGORIES);
  const [solutions, setSolutions] = useState<BusinessSolution[]>(INITIAL_SOLUTIONS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [experts, setExperts] = useState<Expert[]>(INITIAL_EXPERTS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_INITIAL_LEADS);
  const [projects, setProjects] = useState<Project[]>(MOCK_INITIAL_PROJECTS);
  const [consultations, setConsultations] = useState<Consultation[]>(MOCK_INITIAL_CONSULTATIONS);
  const [matchingWeights, setMatchingWeights] = useState<MatchingWeights>(DEFAULT_WEIGHTS);

  // Sync data with backend API asynchronously
  const fetchBackendData = async () => {
    try {
      const [srvRes, expRes, leadsRes, projRes, apptRes] = await Promise.all([
        servicesApi.getAll(),
        expertsApi.getAll(),
        leadsApi.getAll(),
        projectsApi.getAll(),
        appointmentsApi.getAll()
      ]);

      if (srvRes.success && srvRes.data) {
        if (srvRes.data.categories?.length) setCategories(srvRes.data.categories);
        if (srvRes.data.services?.length) setServices(srvRes.data.services);
      }
      if (expRes.success && expRes.data?.length) {
        setExperts(expRes.data);
      }
      if (leadsRes.success && leadsRes.data?.length) {
        setLeads(leadsRes.data);
      }
      if (projRes.success && projRes.data?.length) {
        setProjects(projRes.data);
      }
      if (apptRes.success && apptRes.data?.length) {
        setConsultations(apptRes.data);
      }
    } catch (e) {
      console.warn('Backend API connection falling back to client cache:', e);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const submitRequirement = (reqInput: Partial<Requirement>) => {
    const rawInput = reqInput.rawInput || '';
    const parsed = parseRequirementText(rawInput);
    
    const newReq: Requirement = {
      id: `req-${Date.now()}`,
      rawInput,
      projectType: reqInput.projectType || 'Web Application',
      detectedCategory: reqInput.detectedCategory || parsed.detectedCategoryId,
      detectedServiceId: reqInput.detectedServiceId || parsed.detectedServiceId,
      detectedSkills: reqInput.detectedSkills && reqInput.detectedSkills.length > 0 ? reqInput.detectedSkills : parsed.detectedSkills,
      budgetRange: reqInput.budgetRange || 'Not sure',
      timeline: reqInput.timeline || '2–4 weeks',
      preferredContact: reqInput.preferredContact || 'WhatsApp',
      customerName: reqInput.customerName || 'Valued Client',
      customerEmail: reqInput.customerEmail || 'client@example.com',
      customerPhone: reqInput.customerPhone || '',
      companyName: reqInput.companyName || '',
      details: reqInput.details || rawInput,
      createdAt: new Date().toISOString()
    };

    const rankedExperts = rankExpertsForRequirement(parsed, experts, matchingWeights, newReq.budgetRange);
    const topExpertIds = rankedExperts.slice(0, 3).map(m => m.expert.id);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      requirement: newReq,
      status: 'EXPERT_MATCHED',
      matchedExpertIds: topExpertIds,
      assignedExpertId: topExpertIds[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [`Matched with ${rankedExperts[0]?.expert.name || 'top candidate'} (${rankedExperts[0]?.matchScore || 95}% score)`],
      estimatedValueINR: 55000
    };

    setLeads(prev => [newLead, ...prev]);

    // Send requirement to backend asynchronously
    requirementsApi.submit(reqInput).catch(err => console.warn('Backend requirement submit error:', err));

    return { lead: newLead, rankedExperts };
  };

  const bookConsultation = (bookingInput: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Consultation = {
      ...bookingInput,
      id: `cons-${Date.now()}`,
      status: 'SCHEDULED',
      meetingUrl: `https://meet.jit.si/MakeIT-Cons-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString()
    };

    setConsultations(prev => [newBooking, ...prev]);
    
    // Sync with backend API
    appointmentsApi.book(bookingInput).catch(err => console.warn('Backend appointment book error:', err));

    return newBooking;
  };

  const updateLeadStatus = (leadId: string, status: Lead['status'], assignedExpertId?: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status,
          assignedExpertId: assignedExpertId || lead.assignedExpertId,
          updatedAt: new Date().toISOString()
        };
      }
      return lead;
    }));

    leadsApi.updateStatus(leadId, status, assignedExpertId).catch(err => console.warn('Backend lead status error:', err));
  };

  const updateProjectStatus = (projectId: string, status: Project['status']) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
    projectsApi.updateStatus(projectId, status).catch(err => console.warn('Backend project status error:', err));
  };

  const updateMatchingWeights = (newWeights: Partial<MatchingWeights>) => {
    setMatchingWeights(prev => ({ ...prev, ...newWeights }));
    matchesApi.postMatch('', undefined, newWeights).catch(err => console.warn('Backend weights error:', err));
  };

  const addService = (newService: Service) => {
    setServices(prev => [newService, ...prev]);
    servicesApi.create(newService).catch(err => console.warn('Backend service create error:', err));
  };

  const updateService = (serviceId: string, updated: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, ...updated } : s));
    servicesApi.update(serviceId, updated).catch(err => console.warn('Backend service update error:', err));
  };

  const addExpert = (newExpert: Expert) => {
    setExperts(prev => [newExpert, ...prev]);
    expertsApi.create(newExpert).catch(err => console.warn('Backend expert create error:', err));
  };

  const updateExpert = (expertId: string, updated: Partial<Expert>) => {
    setExperts(prev => prev.map(e => e.id === expertId ? { ...e, ...updated } : e));
    expertsApi.update(expertId, updated).catch(err => console.warn('Backend expert update error:', err));
  };

  return (
    <AppStateContext.Provider value={{
      currentRole,
      setCurrentRole,
      categories,
      solutions,
      services,
      experts,
      leads,
      projects,
      consultations,
      matchingWeights,
      refreshData: fetchBackendData,
      submitRequirement,
      bookConsultation,
      updateLeadStatus,
      updateProjectStatus,
      updateMatchingWeights,
      addService,
      updateService,
      addExpert,
      updateExpert
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
