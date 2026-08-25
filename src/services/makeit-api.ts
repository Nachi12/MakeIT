import { ApiClient } from './api-client';
import { Service, ServiceCategory, Expert, Requirement, Lead, Project, Proposal, Consultation, Contact, Company, Call, FollowUp, Activity } from '@/types';

export const servicesApi = {
  getAll: async () => ApiClient.get<{ categories: ServiceCategory[]; services: Service[] }>('/api/v1/services'),
  create: async (data: Partial<Service>) => ApiClient.post<Service>('/api/v1/services', data),
  update: async (id: string, data: Partial<Service>) => ApiClient.put<Service>(`/api/v1/services/${id}`, data)
};

export const expertsApi = {
  getAll: async () => ApiClient.get<Expert[]>('/api/v1/experts'),
  getById: async (id: string) => ApiClient.get<Expert>(`/api/v1/experts/${id}`),
  create: async (data: Partial<Expert>) => ApiClient.post<Expert>('/api/v1/experts', data),
  update: async (id: string, data: Partial<Expert>) => ApiClient.put<Expert>(`/api/v1/experts/${id}`, data)
};

export const requirementsApi = {
  submit: async (data: Partial<Requirement>) => ApiClient.post<{ requirement: Requirement; lead: Lead; rankedExperts: any[] }>('/api/v1/requirements', data)
};

export const leadsApi = {
  getAll: async () => ApiClient.get<Lead[]>('/api/v1/leads'),
  updateStatus: async (id: string, status: string, assignedExpertId?: string, note?: string) => 
    ApiClient.put<Lead>(`/api/v1/leads/${id}`, { status, assignedExpertId, note })
};

export const matchesApi = {
  getWeights: async () => ApiClient.get('/api/v1/matches'),
  postMatch: async (rawText: string, budgetRange?: string, weights?: any) => ApiClient.post('/api/v1/matches', { rawText, budgetRange, weights })
};

export const projectsApi = {
  getAll: async () => ApiClient.get<Project[]>('/api/v1/projects'),
  create: async (data: Partial<Project>) => ApiClient.post<Project>('/api/v1/projects', data),
  updateStatus: async (id: string, status: string, notes?: string, milestone?: any, member?: any) => 
    ApiClient.put<Project>(`/api/v1/projects/${id}`, { status, notes, milestone, member })
};

export const proposalsApi = {
  getAll: async () => ApiClient.get<Proposal[]>('/api/v1/proposals'),
  create: async (data: Partial<Proposal>) => ApiClient.post<Proposal>('/api/v1/proposals', data)
};

export const appointmentsApi = {
  getAll: async () => ApiClient.get<Consultation[]>('/api/v1/appointments'),
  book: async (data: Partial<Consultation>) => ApiClient.post<Consultation>('/api/v1/appointments', data)
};

export const technologiesApi = {
  getAll: async () => ApiClient.get<any[]>('/api/v1/technologies'),
  create: async (data: any) => ApiClient.post<any>('/api/v1/technologies', data)
};

export const adminDashboardApi = {
  getStats: async () => ApiClient.get<any>('/api/v1/admin/dashboard')
};

export const auditLogsApi = {
  getAll: async () => ApiClient.get<any[]>('/api/v1/audit-logs')
};

// ==========================================
// CRM API MODULES
// ==========================================

export const crmDashboardApi = {
  getMetrics: async () => ApiClient.get<any>('/api/v1/crm/dashboard')
};

export const contactsApi = {
  getAll: async () => ApiClient.get<Contact[]>('/api/v1/crm/contacts'),
  quickAdd: async (data: any) => ApiClient.post<{ isDuplicate: boolean; contact: Contact; lead?: Lead }>('/api/v1/crm/contacts', data),
  checkDuplicate: async (phone: string, email?: string) => ApiClient.post<{ isDuplicate: boolean; contact?: Contact }>('/api/v1/crm/contacts/check-duplicate', { phone, email })
};

export const companiesApi = {
  getAll: async () => ApiClient.get<Company[]>('/api/v1/crm/companies')
};

export const callsApi = {
  getAll: async (params?: { leadId?: string; contactId?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return ApiClient.get<Call[]>(`/api/v1/crm/calls${q ? `?${q}` : ''}`);
  },
  initiate: async (data: { leadId?: string; contactId?: string; phone: string }) => 
    ApiClient.post<Call>('/api/v1/crm/calls', data),
  updateState: async (id: string, data: { status: string; durationSeconds?: number; outcome?: string; notes?: string }) => 
    ApiClient.put<Call>(`/api/v1/crm/calls/${id}`, data)
};

export const followupsApi = {
  getPending: async () => ApiClient.get<FollowUp[]>('/api/v1/crm/followups'),
  schedule: async (data: { leadId: string; contactId?: string; scheduledAt: string; reason: string; priority?: string }) => 
    ApiClient.post<FollowUp>('/api/v1/crm/followups', data),
  complete: async (id: string) => ApiClient.put<FollowUp>('/api/v1/crm/followups', { id })
};

export const activitiesApi = {
  getByLead: async (leadId: string) => ApiClient.get<Activity[]>(`/api/v1/crm/activities?leadId=${leadId}`),
  log: async (data: { leadId?: string; contactId?: string; type?: string; title: string; description: string }) => 
    ApiClient.post<Activity>('/api/v1/crm/activities', data)
};

export const crmSettingsApi = {
  getProviderStatus: async () => ApiClient.get<{ activeProvider: string; providers: any[] }>('/api/v1/crm/settings')
};
