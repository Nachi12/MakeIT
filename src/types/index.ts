export type UserRole = 'CUSTOMER' | 'EXPERT' | 'ADMIN' | 'SUPER_ADMIN' | 'SALES';

export type ServiceCategoryId = 
  | 'web-development'
  | 'full-stack-development'
  | 'ui-ux-design'
  | 'frontend-development'
  | 'backend-development'
  | 'php-laravel-development'
  | 'saas-mvp-development'
  | 'api-development'
  | 'website-redesign'
  | 'technical-consulting';

export type ServicePillar = 'PRODUCT_DESIGN' | 'SOFTWARE_ENGINEERING' | 'TECHNOLOGY_CONSULTING';

export interface ServiceCategory {
  id: ServiceCategoryId;
  slug: string;
  name: string;
  pillar: ServicePillar;
  shortDescription: string;
  iconName: string;
  accentColor: string;
  serviceCount: number;
  featured?: boolean;
}

export interface ProjectTeamMember {
  role: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  expertAvatar: string;
}

export interface ProjectTeamRecommendation {
  teamName: string;
  description: string;
  members: ProjectTeamMember[];
  estimatedDeliveryTime: string;
}

export interface BusinessSolution {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  iconName: string;
  targetAudience: string;
  recommendedCategoryId: ServiceCategoryId;
  recommendedServiceId: string;
  exampleTechnologies: string[];
}

export interface Service {
  id: string;
  slug: string;
  categoryId: ServiceCategoryId;
  categoryName: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  startingPriceINR: number;
  startingPriceUSD: number;
  typicalDelivery: string;
  expertCount: number;
  skills: string[];
  features: string[];
  deliverables: string[];
  techStack?: string[];
  processSteps: { title: string; description: string; stepNumber?: number }[];
  packages: any[];
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  tags: string[];
  metrics?: string;
}

export interface ExpertCertification {
  title: string;
  issuer: string;
  year: string | number;
  verificationId?: string;
}

export interface Expert {
  id: string;
  slug: string;
  name: string;
  title: string;
  avatar: string;
  categoryId: ServiceCategoryId;
  categoryName: string;
  primaryExpertise: string;
  yearsOfExperience: number;
  skills: string[];
  servicesOffered: string[];
  hourlyRateINR: number;
  hourlyRateUSD: number;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  location: string;
  languages: string[];
  shortIntro: string;
  fullBio: string;
  availability: 'Available Now' | 'Next Week' | 'In 1 Week' | 'In 2 Weeks' | 'Limited Availability' | 'Fully Booked' | string;
  certifications?: any[];
  portfolio?: any[];
  verified: boolean;
  featured?: boolean;
}

export type ITProjectType = 
  | 'Website'
  | 'Web Application'
  | 'SaaS'
  | 'MVP'
  | 'E-Commerce'
  | 'UI/UX Design'
  | 'Existing Application'
  | 'New Product Development'
  | 'MVP Development'
  | 'UI/UX Redesign'
  | 'Application Modernization'
  | 'API Integration'
  | 'Other Technology Requirement';

export interface Requirement {
  id: string;
  rawInput: string;
  projectType?: ITProjectType;
  detectedCategory?: ServiceCategoryId;
  detectedServiceId?: string;
  detectedSkills: string[];
  budgetRange: 'Under ₹25,000' | '₹25,000–₹50,000' | '₹50,000–₹1 lakh' | '₹1 lakh–₹3 lakh' | '₹3 lakh+' | 'Not sure';
  timeline: 'ASAP' | '2–4 weeks' | '1–2 months' | '2–3 months' | 'Flexible';
  preferredContact: 'WhatsApp' | 'Phone' | 'Email' | 'Video Call';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  details: string;
  createdAt: string;
}

export interface MatchScore {
  expert: Expert;
  matchScore: number;
  breakdown: {
    skillMatch: number;
    serviceMatch: number;
    experienceScore: number;
    availabilityScore: number;
    budgetScore: number;
    locationScore: number;
  };
  matchedSkills: string[];
  matchReason: string;
}

export type LeadStatus = 
  | 'NEW'
  | 'UNCONTACTED'
  | 'CONTACTED'
  | 'FOLLOW_UP'
  | 'QUALIFIED'
  | 'TECHNICAL_REVIEW'
  | 'EXPERT_MATCHED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NOT_INTERESTED'
  | 'DO_NOT_CONTACT'
  | 'LOST';

export interface Lead {
  id: string;
  requirement: Requirement;
  contactId?: string;
  companyId?: string;
  status: LeadStatus;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  source?: string;
  ownerId?: string;
  ownerName?: string;
  matchedExpertIds: string[];
  assignedExpertId?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string[];
  estimatedValueINR?: number;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
}

export type ConsultationType = '15 min Quick Intake' | '30 min Deep Dive' | '60 min Strategy & Specs';

export interface Consultation {
  id: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  consultationType: ConsultationType;
  topic: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  meetingUrl?: string;
  createdAt: string;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'Revision' | 'Completed';

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  amountINR: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Paid';
}

export interface Project {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  expertId: string;
  expertName: string;
  expertAvatar: string;
  serviceId: string;
  serviceTitle: string;
  startDate: string;
  deadline: string;
  budgetINR: number;
  status: ProjectStatus;
  milestones: ProjectMilestone[];
  members?: { role: string; expertId: string; expertName: string; expertTitle: string; expertAvatar: string }[];
  notes?: string;
}

export type ProposalStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface Proposal {
  id: string;
  leadId?: string;
  projectId?: string;
  customerName: string;
  customerEmail: string;
  title: string;
  services: string[];
  scope: string;
  timeline: string;
  priceINR: number;
  terms?: string;
  status: ProposalStatus;
  validUntil: string;
  createdAt?: string;
}

export interface Message {
  id: string;
  projectId?: string;
  leadId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  recipientId: string;
  content: string;
  timestamp: string;
  attachments?: { name: string; url: string; size: string }[];
  read: boolean;
}

export interface Review {
  id: string;
  expertId: string;
  customerName: string;
  customerRoleCompany: string;
  rating: number; // 1-5
  categories: {
    quality: number;
    communication: number;
    professionalism: number;
    delivery: number;
  };
  comment: string;
  date: string;
  serviceTitle: string;
  verified: boolean;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  clientIndustry: string;
  challenge: string;
  solution: string;
  expertId: string;
  expertName: string;
  serviceTitle: string;
  results: { metric: string; label: string }[];
  processSteps: string[];
  testimonial: { quote: string; author: string; title: string };
  image: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  serviceName: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  publishedDate: string;
  readTime: string;
  coverImage: string;
  tags: string[];
}

export interface Contact {
  id: string;
  name: string;
  title?: string;
  companyId?: string;
  companyName?: string;
  email?: string;
  phone: string;
  altPhone?: string;
  whatsapp?: string;
  location?: string;
  source: string;
  ownerId?: string;
  ownerName?: string;
  tags?: string[];
  notes?: string;
  status: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  email?: string;
  phone?: string;
  source?: string;
  ownerId?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface Call {
  id: string;
  leadId?: string;
  contactId?: string;
  agentId: string;
  agentName: string;
  provider: string;
  providerCallId?: string;
  direction: 'OUTBOUND' | 'INBOUND';
  status: 'INITIATING' | 'RINGING' | 'ANSWERED' | 'IN_PROGRESS' | 'ENDED' | 'MISSED' | 'FAILED' | 'BUSY' | 'NO_ANSWER' | 'CANCELLED';
  startedAt: string;
  answeredAt?: string;
  endedAt?: string;
  durationSeconds: number;
  outcome?: string;
  notes?: string;
  recordingUrl?: string;
  createdAt: string;
  contact?: Contact;
  lead?: Lead;
}

export interface FollowUp {
  id: string;
  leadId: string;
  contactId?: string;
  assignedTo: string;
  assignedToName: string;
  scheduledAt: string;
  reason: string;
  priority: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
  completedAt?: string;
  createdAt: string;
  lead?: Lead;
  contact?: Contact;
}

export interface CRMTask {
  id: string;
  title: string;
  leadId?: string;
  contactId?: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  priority: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  completedAt?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  leadId?: string;
  contactId?: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  type: string;
  title: string;
  description: string;
  metadata?: any;
  createdAt: string;
}
