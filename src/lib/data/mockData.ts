import { 
  ServiceCategory, 
  Service, 
  Expert, 
  CaseStudy, 
  Testimonial, 
  FAQItem, 
  Lead, 
  Project, 
  Consultation,
  BusinessSolution
} from '@/types';

// ==========================================
// 1. CORE IT SERVICE CATEGORIES (EXCLUSIVELY IT)
// ==========================================
export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'web-development',
    slug: 'web-development',
    name: 'Web Development',
    pillar: 'SOFTWARE_ENGINEERING',
    shortDescription: 'Modern, fast, and responsive web applications built with Next.js, React, and robust backend tech.',
    iconName: 'Globe',
    accentColor: '#2563EB',
    serviceCount: 14,
    featured: true
  },
  {
    id: 'full-stack-development',
    slug: 'full-stack-development',
    name: 'Full Stack Development',
    pillar: 'SOFTWARE_ENGINEERING',
    shortDescription: 'End-to-end web product engineering combining modern frontend frameworks and scalable databases.',
    iconName: 'Layers',
    accentColor: '#2563EB',
    serviceCount: 18,
    featured: true
  },
  {
    id: 'ui-ux-design',
    slug: 'ui-ux-design',
    name: 'UI/UX & Product Design',
    pillar: 'PRODUCT_DESIGN',
    shortDescription: 'User research, wireframing, high-fidelity Figma visual design, and clickable interactive prototypes.',
    iconName: 'Layout',
    accentColor: '#2563EB',
    serviceCount: 12,
    featured: true
  },
  {
    id: 'frontend-development',
    slug: 'frontend-development',
    name: 'Frontend Development',
    pillar: 'SOFTWARE_ENGINEERING',
    shortDescription: 'Pixel-perfect, ultra-fast single page & SSR web interfaces built with React, Next.js, and TypeScript.',
    iconName: 'Code2',
    accentColor: '#2563EB',
    serviceCount: 16
  },
  {
    id: 'backend-development',
    slug: 'backend-development',
    name: 'Backend Development',
    pillar: 'SOFTWARE_ENGINEERING',
    shortDescription: 'Scalable server architecture, microservices, REST APIs, and database engineering.',
    iconName: 'Server',
    accentColor: '#2563EB',
    serviceCount: 15
  },
  {
    id: 'php-laravel-development',
    slug: 'php-laravel-development',
    name: 'PHP & Laravel Development',
    pillar: 'SOFTWARE_ENGINEERING',
    shortDescription: 'Custom Laravel web apps, REST APIs, enterprise admin panels, and legacy PHP modernization.',
    iconName: 'Terminal',
    accentColor: '#2563EB',
    serviceCount: 10,
    featured: true
  },
  {
    id: 'saas-mvp-development',
    slug: 'saas-mvp-development',
    name: 'SaaS & MVP Development',
    pillar: 'SOFTWARE_ENGINEERING',
    shortDescription: 'Turn product ideas into production-ready software with auth, payments, database, and admin tools.',
    iconName: 'Rocket',
    accentColor: '#2563EB',
    serviceCount: 11,
    featured: true
  },
  {
    id: 'api-development',
    slug: 'api-development',
    name: 'API & Backend Integration',
    pillar: 'SOFTWARE_ENGINEERING',
    shortDescription: 'Custom RESTful API development, third-party integrations (Stripe, Twilio, CRMs), and webhook systems.',
    iconName: 'Cpu',
    accentColor: '#2563EB',
    serviceCount: 9
  },
  {
    id: 'website-redesign',
    slug: 'website-redesign',
    name: 'Website Development & Redesign',
    pillar: 'SOFTWARE_ENGINEERING',
    shortDescription: 'Transform outdated websites into fast, conversion-optimized, responsive web experiences.',
    iconName: 'RefreshCw',
    accentColor: '#2563EB',
    serviceCount: 13
  },
  {
    id: 'technical-consulting',
    slug: 'technical-consulting',
    name: 'Technical Consulting',
    pillar: 'TECHNOLOGY_CONSULTING',
    shortDescription: 'Architecture reviews, tech stack selection, code audits, and strategic technical roadmaps.',
    iconName: 'Compass',
    accentColor: '#2563EB',
    serviceCount: 8
  }
];

// ==========================================
// 2. BUSINESS GOAL SOLUTIONS
// ==========================================
export const INITIAL_SOLUTIONS: BusinessSolution[] = [
  {
    id: 'build-website',
    slug: 'build-a-new-website',
    title: 'Build a New Website',
    shortDescription: 'Create a modern, responsive, and SEO-ready web presence for your company or brand.',
    iconName: 'Globe',
    targetAudience: 'Small Businesses & Startups',
    recommendedCategoryId: 'web-development',
    recommendedServiceId: 'website-development',
    exampleTechnologies: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript']
  },
  {
    id: 'build-mvp',
    slug: 'build-an-mvp',
    title: 'Build an MVP',
    shortDescription: 'Validate your software idea quickly with a fully functional minimum viable product.',
    iconName: 'Rocket',
    targetAudience: 'Founders & Early-Stage Startups',
    recommendedCategoryId: 'saas-mvp-development',
    recommendedServiceId: 'saas-mvp-development',
    exampleTechnologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
  },
  {
    id: 'launch-saas',
    slug: 'launch-a-saas-product',
    title: 'Launch a SaaS Product',
    shortDescription: 'Build scalable multi-tenant software with user authentication, billing, and admin dashboards.',
    iconName: 'Layers',
    targetAudience: 'SaaS Founders & Growing Companies',
    recommendedCategoryId: 'saas-mvp-development',
    recommendedServiceId: 'saas-mvp-development',
    exampleTechnologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS']
  },
  {
    id: 'redesign-website',
    slug: 'redesign-an-existing-website',
    title: 'Redesign an Existing Website',
    shortDescription: 'Upgrade your outdated website with modern UI/UX, faster load speeds, and higher conversions.',
    iconName: 'RefreshCw',
    targetAudience: 'Growing Businesses & Agencies',
    recommendedCategoryId: 'website-redesign',
    recommendedServiceId: 'website-redesign',
    exampleTechnologies: ['Figma', 'React', 'Next.js', 'CSS/Tailwind']
  },
  {
    id: 'custom-web-app',
    slug: 'build-a-custom-web-application',
    title: 'Build a Custom Web Application',
    shortDescription: 'Develop tailored web software to automate business operations or serve your customers.',
    iconName: 'Code2',
    targetAudience: 'Businesses & Enterprises',
    recommendedCategoryId: 'full-stack-development',
    recommendedServiceId: 'full-stack-development',
    exampleTechnologies: ['React', 'Node.js', 'Express', 'PostgreSQL']
  },
  {
    id: 'add-features',
    slug: 'add-new-features',
    title: 'Add New Features',
    shortDescription: 'Extend your existing codebase with new modules, UI components, or backend logic.',
    iconName: 'PlusCircle',
    targetAudience: 'Companies with Existing Web Products',
    recommendedCategoryId: 'frontend-development',
    recommendedServiceId: 'frontend-development',
    exampleTechnologies: ['React', 'TypeScript', 'Node.js', 'PHP/Laravel']
  },
  {
    id: 'integrate-apis',
    slug: 'integrate-apis',
    title: 'Integrate APIs & Services',
    shortDescription: 'Connect payment gateways, CRMs, messaging providers, or custom third-party REST APIs.',
    iconName: 'Cpu',
    targetAudience: 'E-commerce & Web Platforms',
    recommendedCategoryId: 'api-development',
    recommendedServiceId: 'api-development',
    exampleTechnologies: ['Node.js', 'Express', 'REST APIs', 'Webhooks']
  },
  {
    id: 'modernize-software',
    slug: 'fix-or-modernize-existing-software',
    title: 'Fix or Modernize Legacy Code',
    shortDescription: 'Refactor slow PHP code, fix database bugs, update frameworks, and improve application security.',
    iconName: 'Wrench',
    targetAudience: 'Established Businesses with Legacy Apps',
    recommendedCategoryId: 'php-laravel-development',
    recommendedServiceId: 'php-laravel-development',
    exampleTechnologies: ['PHP', 'Laravel', 'MySQL', 'Node.js']
  }
];

// ==========================================
// 3. CORE IT SERVICES CATALOG
// ==========================================
export const INITIAL_SERVICES: Service[] = [
  {
    id: 'full-stack-development',
    slug: 'full-stack-development',
    categoryId: 'full-stack-development',
    categoryName: 'Full Stack Development',
    title: 'Full Stack Web Application Development',
    shortDescription: 'Build scalable web applications with modern React/Next.js frontends, Node.js backends, and robust databases.',
    fullDescription: 'End-to-end software engineering for modern businesses. We design data schemas, build responsive user interfaces, craft RESTful APIs, and configure cloud database persistence.',
    iconName: 'Layers',
    startingPriceINR: 35000,
    startingPriceUSD: 480,
    typicalDelivery: '2–4 Weeks',
    expertCount: 18,
    skills: ['React', 'Node.js', 'Next.js', 'TypeScript', 'Express.js', 'MongoDB', 'PostgreSQL'],
    features: ['Responsive Frontend UI', 'RESTful API Architecture', 'Database Schema Optimization', 'Auth & Security Controls'],
    deliverables: ['Production-ready Source Code', 'Database Migration Scripts', 'API Documentation', 'Deployment Setup'],
    techStack: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL'],
    processSteps: [
      { title: 'Architecture Planning', description: 'Defining data models, system boundaries, and tech stack options.' },
      { title: 'API & DB Build', description: 'Setting up Node/Express backend and database schemas.' },
      { title: 'Frontend Integration', description: 'Connecting typed React/Next.js components to backend endpoints.' },
      { title: 'Testing & Launch', description: 'Conducting end-to-end testing, security checks, and server deployment.' }
    ],
    packages: [
      { name: 'Core Application MVP', priceINR: 35000, priceUSD: 480, deliveryTime: '2 Weeks', features: ['Up to 5 Key Screens', 'Node.js Backend & Auth', 'Database Setup', 'Deployment Setup'] },
      { name: 'Full Enterprise Portal', priceINR: 95000, priceUSD: 1250, deliveryTime: '4 Weeks', features: ['Complete Multi-Role System', 'Custom Dashboard & Admin', 'Payment Gateway Integration', '30-Day Warranty'], isPopular: true }
    ],
    featured: true
  },
  {
    id: 'ui-ux-design',
    slug: 'ui-ux-design',
    categoryId: 'ui-ux-design',
    categoryName: 'UI/UX & Product Design',
    title: 'UI/UX Product Design & Systems',
    shortDescription: 'User research, wireframing, high-fidelity Figma visual designs, and scalable component design systems.',
    fullDescription: 'Craft intuitive, user-centric product interfaces that elevate your brand and drive product conversion. From detailed user flow maps to reusable component tokens.',
    iconName: 'Layout',
    startingPriceINR: 20000,
    startingPriceUSD: 270,
    typicalDelivery: '1–3 Weeks',
    expertCount: 12,
    skills: ['Figma', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Mobile App UX', 'Usability Testing'],
    features: ['High-Fidelity Interactive Prototypes', 'Design System & Component Library', 'UX Friction Audit', 'Developer Handoff Specs'],
    deliverables: ['Organized Figma Source File', 'Clickable Prototype Link', 'Design Tokens & Style Guide', 'Component Specs'],
    techStack: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems'],
    processSteps: [
      { title: 'User Research & Flow', description: 'Deconstructing user goals, target workflows, and layout specs.' },
      { title: 'Wireframes & Layout', description: 'Iterating structural layout before visual styling.' },
      { title: 'Visual UI Systems', description: 'Applying typography, colors, dark modes, and component states.' },
      { title: 'Interactive Prototype', description: 'Creating clickable prototypes ready for developer handoff.' }
    ],
    packages: [
      { name: 'Essential UI Kit', priceINR: 20000, priceUSD: 270, deliveryTime: '1 Week', features: ['Key Screens (Up to 6)', 'Figma Design File', 'Clickable Prototype'] },
      { name: 'Complete Product UX', priceINR: 55000, priceUSD: 720, deliveryTime: '3 Weeks', features: ['Full Web & Mobile Flow (18+ screens)', 'Design System Tokens', 'UX Audit Report', 'Developer Ready Handoff'], isPopular: true }
    ],
    featured: true
  },
  {
    id: 'saas-mvp-development',
    slug: 'saas-mvp-development',
    categoryId: 'saas-mvp-development',
    categoryName: 'SaaS & MVP Development',
    title: 'SaaS & MVP Product Engineering',
    shortDescription: 'Turn your product idea into a live SaaS web application with user authentication, billing, and admin tools.',
    fullDescription: 'Accelerate time-to-market for software founders. We build complete SaaS MVPs incorporating user signups, multi-tenant databases, Stripe/PayPal payment billing, and management dashboards.',
    iconName: 'Rocket',
    startingPriceINR: 45000,
    startingPriceUSD: 600,
    typicalDelivery: '3–5 Weeks',
    expertCount: 11,
    skills: ['React', 'Next.js', 'Node.js', 'MongoDB', 'PostgreSQL', 'Stripe Integration', 'SaaS Architecture'],
    features: ['Multi-Tenant User Auth', 'Stripe Billing & Subscriptions', 'Admin Management Panel', 'Responsive Dashboard UI'],
    deliverables: ['Complete SaaS Source Code', 'Stripe Webhook Integration', 'Admin Control Panel', 'Deployment Guide'],
    techStack: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'MongoDB', 'Stripe'],
    processSteps: [
      { title: 'Scope & Architecture', description: 'Defining MVP core feature list and database schemas.' },
      { title: 'Frontend & Dashboard', description: 'Building responsive user dashboards and landing pages.' },
      { title: 'Auth & Billing Backend', description: 'Integrating authentication and subscription checkout.' },
      { title: 'Production Launch', description: 'Deploying to cloud servers with domain configuration.' }
    ],
    packages: [
      { name: 'Startup MVP Suite', priceINR: 45000, priceUSD: 600, deliveryTime: '3 Weeks', features: ['Landing Page + User Dashboard', 'Auth & Database', 'Payment Billing Integration', '30-Day Support'] },
      { name: 'Production SaaS Platform', priceINR: 110000, priceUSD: 1450, deliveryTime: '5 Weeks', features: ['Full Feature Product Architecture', 'Multi-Plan Subscription Billing', 'Admin CMS Panel', 'Automated Email Notifications'], isPopular: true }
    ],
    featured: true
  },
  {
    id: 'php-laravel-development',
    slug: 'php-laravel-development',
    categoryId: 'php-laravel-development',
    categoryName: 'PHP & Laravel Development',
    title: 'PHP & Laravel Application Engineering',
    shortDescription: 'Custom Laravel web applications, REST APIs, enterprise admin portals, and legacy PHP code modernization.',
    fullDescription: 'Robust backend engineering using PHP 8+ and Laravel framework. Whether building a custom portal from scratch or updating a legacy PHP codebase, our specialists deliver secure, maintainable software.',
    iconName: 'Terminal',
    startingPriceINR: 25000,
    startingPriceUSD: 340,
    typicalDelivery: '2–3 Weeks',
    expertCount: 10,
    skills: ['PHP', 'Laravel', 'MySQL', 'REST APIs', 'Blade Templates', 'Eloquent ORM', 'Redis'],
    features: ['Laravel MVC Architecture', 'MySQL Database Optimization', 'RESTful API Services', 'Role & Permission Controls'],
    deliverables: ['Laravel Source Code Repository', 'Database Migrations & Seeders', 'API Endpoint Specs', 'Server Configuration Guide'],
    techStack: ['PHP', 'Laravel', 'MySQL', 'REST APIs', 'Git'],
    processSteps: [
      { title: 'Codebase Audit', description: 'Analyzing existing PHP application or new specification requirements.' },
      { title: 'Laravel Architecture', description: 'Building models, controllers, migrations, and middleware.' },
      { title: 'Security & Optimization', description: 'Configuring CSRF, SQL injection prevention, and database indexing.' },
      { title: 'Server Deployment', description: 'Setting up Nginx, Apache, or cloud server environment.' }
    ],
    packages: [
      { name: 'Laravel App Core', priceINR: 25000, priceUSD: 340, deliveryTime: '2 Weeks', features: ['Custom CRUD Backend', 'MySQL Database Migrations', 'User Auth & Roles'] },
      { name: 'Enterprise Laravel System', priceINR: 65000, priceUSD: 850, deliveryTime: '3 Weeks', features: ['Complex Business Logic', 'Payment Gateway Integration', 'Rest API Suite', 'Performance Tuning'], isPopular: true }
    ],
    featured: true
  },
  {
    id: 'frontend-development',
    slug: 'frontend-development',
    categoryId: 'frontend-development',
    categoryName: 'Frontend Development',
    title: 'React & Frontend Architecture',
    shortDescription: 'Pixel-perfect, ultra-fast single page & SSR web interfaces built with React, Next.js, and Tailwind CSS.',
    fullDescription: 'Delightful user experiences built with modern React 18/19, TypeScript, state management (Zustand/Redux), and custom design tokens.',
    iconName: 'Code2',
    startingPriceINR: 18000,
    startingPriceUSD: 240,
    typicalDelivery: '1–2 Weeks',
    expertCount: 16,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'HTML/CSS', 'Bootstrap'],
    features: ['Component Design Systems', 'High Performance SSR/SPA', 'Responsive Layout Engine', 'API Integration'],
    deliverables: ['Modular React Component Library', 'Clean TypeScript Codebase', 'Speed Audit Pass Report'],
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS'],
    processSteps: [
      { title: 'UI Audit & Specs', description: 'Reviewing Figma design screens and component specs.' },
      { title: 'Component Build', description: 'Writing modular, reusable React/Next.js component primitives.' },
      { title: 'State & API Integration', description: 'Connecting UI components to backend REST endpoints.' }
    ],
    packages: [
      { name: 'Frontend Refactoring', priceINR: 18000, priceUSD: 240, deliveryTime: '1 Week', features: ['Convert Figma to React', 'Responsive Optimization', 'Speed Audit Fixes'] }
    ]
  },
  {
    id: 'backend-development',
    slug: 'backend-development',
    categoryId: 'backend-development',
    categoryName: 'Backend Development',
    title: 'Node.js & Backend Server Systems',
    shortDescription: 'Scalable backend API servers, database persistence layers, background jobs, and cloud deployment.',
    fullDescription: 'High-throughput backend development built with Node.js, Express, and modern SQL/NoSQL databases. Designed for security, low-latency API response times, and concurrency.',
    iconName: 'Server',
    startingPriceINR: 22000,
    startingPriceUSD: 290,
    typicalDelivery: '2 Weeks',
    expertCount: 15,
    skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'REST APIs', 'JWT Auth'],
    features: ['Secure Authentication Systems', 'Database Query Optimization', 'Scalable Middleware Architecture'],
    deliverables: ['Backend API Source Code', 'Postman API Specs', 'Database Schema Dumps'],
    techStack: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL'],
    processSteps: [
      { title: 'API Specification', description: 'Documenting request/response models and auth flows.' },
      { title: 'Database Design', description: 'Structuring relational or document database tables.' },
      { title: 'Server Logic', description: 'Coding Express routes, controllers, and validation rules.' }
    ],
    packages: [
      { name: 'Backend API Foundation', priceINR: 22000, priceUSD: 290, deliveryTime: '2 Weeks', features: ['Express API Server', 'Database Schemas', 'JWT Auth & Middleware'] }
    ]
  },
  {
    id: 'website-development',
    slug: 'website-development',
    categoryId: 'web-development',
    categoryName: 'Web Development',
    title: 'Business Website & Landing Page Development',
    shortDescription: 'Modern, responsive, and SEO-optimized business websites built to showcase products and drive leads.',
    fullDescription: 'Elevate your online presence with custom web development built on modern frameworks like Next.js and React. Engineered for lighting-fast page loads, mobile responsiveness, and search engine visibility.',
    iconName: 'Globe',
    startingPriceINR: 15000,
    startingPriceUSD: 200,
    typicalDelivery: '1–2 Weeks',
    expertCount: 14,
    skills: ['Next.js', 'React', 'Tailwind CSS', 'HTML', 'CSS', 'SEO Optimization', 'JavaScript'],
    features: ['Responsive Mobile Layouts', 'SEO-Ready Meta Architecture', 'Interactive Contact Forms', 'Fast Page Performance'],
    deliverables: ['Production Web Source Code', 'Content Integration', 'Domain & Hosting Setup'],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'HTML'],
    processSteps: [
      { title: 'Structure & Sitemap', description: 'Mapping page architecture, content sections, and CTAs.' },
      { title: 'Visual Coding', description: 'Developing responsive UI components with clean CSS/Tailwind.' },
      { title: 'SEO & Launch', description: 'Adding meta tags, structured data, and deploying to live domain.' }
    ],
    packages: [
      { name: 'Standard Business Website', priceINR: 15000, priceUSD: 200, deliveryTime: '1 Week', features: ['Up to 5 Pages', 'Responsive Design', 'Contact Form', 'SEO Basics'] },
      { name: 'Custom Corporate Portal', priceINR: 38000, priceUSD: 500, deliveryTime: '2 Weeks', features: ['Up to 12 Pages', 'Custom Animations', 'CMS Integration', 'Speed Pass (90+ Google Lighthouse)'], isPopular: true }
    ]
  },
  {
    id: 'api-development',
    slug: 'api-development',
    categoryId: 'api-development',
    categoryName: 'API & Backend Integration',
    title: 'Custom API & Third-Party Integrations',
    shortDescription: 'Connect payment processors, CRMs, communication gateways, or custom external RESTful services.',
    fullDescription: 'Bridge your web application with external services cleanly. We build robust API wrappers, handle webhook events, and automate cross-platform data flows.',
    iconName: 'Cpu',
    startingPriceINR: 12000,
    startingPriceUSD: 160,
    typicalDelivery: '3–7 Days',
    expertCount: 9,
    skills: ['REST APIs', 'Node.js', 'Express.js', 'Stripe', 'Twilio', 'Postman', 'Webhooks'],
    features: ['Third-Party Webhook Handlers', 'Secure Authentication Wrappers', 'Error Resilient Request Queues'],
    deliverables: ['Tested API Integration Code', 'Environment Config Guide', 'Postman Test Collections'],
    techStack: ['Node.js', 'Express.js', 'REST APIs', 'Postman'],
    processSteps: [
      { title: 'Endpoint Mapping', description: 'Auditing third-party API documentation and authentication schemas.' },
      { title: 'Integration Coding', description: 'Writing backend connector service with error handling.' },
      { title: 'Testing & Verification', description: 'Validating payload formats and webhook callbacks.' }
    ],
    packages: [
      { name: 'Single Gateway Integration', priceINR: 12000, priceUSD: 160, deliveryTime: '3 Days', features: ['Stripe/Razorpay or CRM Integration', 'Webhook Listener', 'Testing & Documentation'] }
    ]
  },
  {
    id: 'website-redesign',
    slug: 'website-redesign',
    categoryId: 'website-redesign',
    categoryName: 'Website Development & Redesign',
    title: 'Website Redesign & Conversion Optimization',
    shortDescription: 'Turn an outdated, slow website into a modern, fast, and conversion-focused digital experience.',
    fullDescription: 'Breathe new life into your digital presence. We audit existing site friction points, modernize outdated visual layouts, rebuild the code on Next.js/React, and improve core web vitals.',
    iconName: 'RefreshCw',
    startingPriceINR: 22000,
    startingPriceUSD: 300,
    typicalDelivery: '1–2 Weeks',
    expertCount: 13,
    skills: ['Website Redesign', 'UI/UX Audit', 'Next.js', 'React', 'Speed Optimization', 'SEO Improvement'],
    features: ['Modern UI Redesign', 'Mobile UX Optimization', 'Performance Speed Tuning', 'Content Migration'],
    deliverables: ['Redesigned Web Application', 'Core Web Vitals Pass Report', 'Redirect & SEO Safeguard Map'],
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'Figma'],
    processSteps: [
      { title: 'UI & Friction Audit', description: 'Identifying outdated visuals, drop-offs, and speed bottlenecks.' },
      { title: 'Visual Redesign', description: 'Creating clean modern visual layouts in Figma.' },
      { title: 'Code Reconstruction', description: 'Rebuilding pages on fast Next.js/React infrastructure.' }
    ],
    packages: [
      { name: 'Complete Website Redesign', priceINR: 22000, priceUSD: 300, deliveryTime: '2 Weeks', features: ['Full UI Makeover', 'Mobile Optimization', 'Content Transfer', 'Speed Tuning'] }
    ]
  },
  {
    id: 'technical-consulting',
    slug: 'technical-consulting',
    categoryId: 'technical-consulting',
    categoryName: 'Technical Consulting',
    title: 'Software Architecture & Tech Consulting',
    shortDescription: 'Expert guidance on technology selection, codebase architecture, feasibility, and development roadmaps.',
    fullDescription: 'Make informed technology decisions before spending capital. Our senior software architects evaluate technical requirements, audit existing codebases, and create practical engineering blueprints.',
    iconName: 'Compass',
    startingPriceINR: 15000,
    startingPriceUSD: 200,
    typicalDelivery: '3–5 Days',
    expertCount: 8,
    skills: ['Architecture Review', 'Tech Stack Selection', 'Code Audit', 'Technical Roadmapping', 'System Design'],
    features: ['System Feasibility Analysis', 'Security & Code Audit Report', 'Tech Stack Recommendation'],
    deliverables: ['Detailed Architecture Document', 'Code Review Audit Report', '1-on-1 Strategy Session'],
    techStack: ['System Design', 'Git', 'Node.js', 'React', 'PHP/Laravel', 'Database Schemas'],
    processSteps: [
      { title: 'Requirement Deep-Dive', description: 'Reviewing business goals, expected scale, and current technical assets.' },
      { title: 'Technical Evaluation', description: 'Auditing code quality, system bottlenecks, and security gaps.' },
      { title: 'Strategy Blueprint', description: 'Delivering detailed technical recommendations and architecture specs.' }
    ],
    packages: [
      { name: 'Technical Architecture Audit', priceINR: 15000, priceUSD: 200, deliveryTime: '4 Days', features: ['Codebase Audit', 'Database Schema Evaluation', 'Written Architecture Report', '60-min Strategy Call'] }
    ]
  }
];

// ==========================================
// 4. VERIFIED TECHNOLOGY EXPERTS ROSTER
// ==========================================
export const INITIAL_EXPERTS: Expert[] = [
  {
    id: 'exp-1',
    slug: 'aravind-swaminathan',
    name: 'Aravind Swaminathan',
    title: 'Senior Full Stack & Cloud Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    categoryId: 'full-stack-development',
    categoryName: 'Full Stack Development',
    primaryExpertise: 'React, Node.js & Scalable Cloud Systems',
    yearsOfExperience: 9,
    skills: ['React', 'Node.js', 'Next.js', 'TypeScript', 'Express.js', 'MongoDB', 'PostgreSQL', 'Docker'],
    servicesOffered: ['full-stack-development', 'saas-mvp-development', 'backend-development'],
    hourlyRateINR: 2200,
    hourlyRateUSD: 30,
    rating: 4.9,
    reviewCount: 48,
    completedProjects: 62,
    location: 'Bangalore, India (Remote Available)',
    languages: ['English', 'Hindi', 'Tamil'],
    shortIntro: 'Full stack architect specializing in React, Node.js, Next.js, and high-concurrency SaaS applications.',
    fullBio: 'Aravind has 9 years of experience engineering robust web software. He has led backend re-architectures for scaling fintech startups and built custom full-stack SaaS platforms from initial wireframes to production deployment.',
    availability: 'Available Now',
    verified: true,
    featured: true,
    certifications: [
      { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2022' }
    ]
  },
  {
    id: 'exp-2',
    slug: 'meera-kapoor',
    name: 'Meera Kapoor',
    title: 'Principal UI/UX & Product Design Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    categoryId: 'ui-ux-design',
    categoryName: 'UI/UX & Product Design',
    primaryExpertise: 'Figma Design Systems & SaaS Product UX',
    yearsOfExperience: 7,
    skills: ['Figma', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Mobile App UX', 'Usability Testing'],
    servicesOffered: ['ui-ux-design', 'website-redesign'],
    hourlyRateINR: 1800,
    hourlyRateUSD: 25,
    rating: 4.95,
    reviewCount: 36,
    completedProjects: 45,
    location: 'Mumbai, India (Global Remote)',
    languages: ['English', 'Hindi'],
    shortIntro: 'Product designer crafting clean, conversion-focused web interfaces and comprehensive Figma design systems.',
    fullBio: 'Meera helps startups and enterprises turn complex business logic into intuitive user interfaces. Her work includes redesigning multi-step customer booking funnels and creating scalable component libraries.',
    availability: 'Available Now',
    verified: true,
    featured: true
  },
  {
    id: 'exp-3',
    slug: 'devansh-mehta',
    name: 'Devansh Mehta',
    title: 'Senior Backend & API Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    categoryId: 'backend-development',
    categoryName: 'Backend Development',
    primaryExpertise: 'Node.js, Express & Microservice Architecture',
    yearsOfExperience: 8,
    skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'REST APIs', 'JWT Auth', 'Docker', 'Postman'],
    servicesOffered: ['backend-development', 'api-development'],
    hourlyRateINR: 2000,
    hourlyRateUSD: 28,
    rating: 4.88,
    reviewCount: 31,
    completedProjects: 39,
    location: 'Pune, India (Remote Available)',
    languages: ['English', 'Hindi', 'Gujarati'],
    shortIntro: 'Backend developer focused on low-latency REST APIs, database schemas, and secure authentication pipelines.',
    fullBio: 'Devansh specializes in building resilient server infrastructures. He has built payment gateway integrations, real-time messaging servers, and database query optimizations for high-traffic web applications.',
    availability: 'Next Week',
    verified: true,
    featured: true
  },
  {
    id: 'exp-4',
    slug: 'rohan-verma',
    name: 'Rohan Verma',
    title: 'Senior PHP & Laravel Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    categoryId: 'php-laravel-development',
    categoryName: 'PHP & Laravel Development',
    primaryExpertise: 'Custom Laravel Systems & Legacy PHP Modernization',
    yearsOfExperience: 10,
    skills: ['PHP', 'Laravel', 'MySQL', 'REST APIs', 'Redis', 'Blade', 'Git', 'Bootstrap'],
    servicesOffered: ['php-laravel-development', 'web-development'],
    hourlyRateINR: 1900,
    hourlyRateUSD: 26,
    rating: 4.92,
    reviewCount: 42,
    completedProjects: 54,
    location: 'Gurgaon, India (Remote Available)',
    languages: ['English', 'Hindi'],
    shortIntro: 'Laravel specialist with 10 years of experience building web portals and modernizing legacy PHP applications.',
    fullBio: 'Rohan is a veteran PHP and Laravel engineer. He has built custom enterprise CRMs, automated inventory control portals, and migrated monolithic legacy PHP apps to clean Laravel architecture.',
    availability: 'Available Now',
    verified: true,
    featured: true
  },
  {
    id: 'exp-5',
    slug: 'priya-sharma',
    name: 'Priya Sharma',
    title: 'Senior Frontend & React Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    categoryId: 'frontend-development',
    categoryName: 'Frontend Development',
    primaryExpertise: 'React, Next.js & Responsive CSS Architecture',
    yearsOfExperience: 6,
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS', 'Redux'],
    servicesOffered: ['frontend-development', 'website-development', 'website-redesign'],
    hourlyRateINR: 1700,
    hourlyRateUSD: 24,
    rating: 4.91,
    reviewCount: 29,
    completedProjects: 38,
    location: 'Hyderabad, India (Remote Available)',
    languages: ['English', 'Hindi', 'Telugu'],
    shortIntro: 'Frontend engineer creating pixel-perfect, highly responsive React and Next.js interfaces.',
    fullBio: 'Priya builds modern web frontends with clean TypeScript architecture and fluid CSS layouts. She focuses on web performance, mobile responsiveness, and seamless API integration.',
    availability: 'Available Now',
    verified: true,
    featured: true
  },
  {
    id: 'exp-6',
    slug: 'karan-malhotra',
    name: 'Karan Malhotra',
    title: 'SaaS Product Architect & Full Stack Lead',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    categoryId: 'saas-mvp-development',
    categoryName: 'SaaS & MVP Development',
    primaryExpertise: 'SaaS Architecture, Auth & Stripe Subscriptions',
    yearsOfExperience: 8,
    skills: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS', 'TypeScript'],
    servicesOffered: ['saas-mvp-development', 'full-stack-development'],
    hourlyRateINR: 2400,
    hourlyRateUSD: 32,
    rating: 4.96,
    reviewCount: 38,
    completedProjects: 41,
    location: 'Delhi NCR, India (Global Remote)',
    languages: ['English', 'Hindi'],
    shortIntro: 'SaaS technical architect helping founders plan, build, and deploy production MVPs.',
    fullBio: 'Karan has built over 15 commercial SaaS products from concept to launch. He specializes in setting up authentication, subscription billing, multi-tenant databases, and admin management portals.',
    availability: 'In 2 Weeks',
    verified: true,
    featured: true
  },
  {
    id: 'exp-7',
    slug: 'ananya-rao',
    name: 'Ananya Rao',
    title: 'Senior Software Consultant & Advisor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    categoryId: 'technical-consulting',
    categoryName: 'Technical Consulting',
    primaryExpertise: 'Software Architecture, Code Audits & System Feasibility',
    yearsOfExperience: 11,
    skills: ['Architecture Review', 'Tech Stack Selection', 'Code Audit', 'System Design', 'Git', 'Node.js', 'React'],
    servicesOffered: ['technical-consulting'],
    hourlyRateINR: 2600,
    hourlyRateUSD: 35,
    rating: 4.98,
    reviewCount: 24,
    completedProjects: 33,
    location: 'Bangalore, India (Remote Available)',
    languages: ['English', 'Hindi', 'Kannada'],
    shortIntro: 'Technical advisor guiding non-technical founders and growing companies on software architecture and stack selection.',
    fullBio: 'Ananya provides strategic technical consulting for businesses launching digital products. She conducts codebase security audits, reviews system design proposals, and helps companies hire engineering talent.',
    availability: 'Limited Availability',
    verified: true,
    featured: true
  }
];

// ==========================================
// 5. PURE IT CASE STUDIES
// ==========================================
export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    slug: 'fintech-saas-rearchitecture',
    title: 'Scaling a B2B SaaS Analytics Platform from 5k to 100k Active Users',
    clientName: 'PayPulse Solutions',
    clientIndustry: 'SaaS & Fintech',
    challenge: 'PayPulse suffered from server timeouts and database deadlocks during peak analytics hours, leading to user churn and negative reviews.',
    solution: 'Aravind Swaminathan refactored the backend into modular Express micro-services on Next.js, added Redis caching, and optimized PostgreSQL indexes.',
    expertId: 'exp-1',
    expertName: 'Aravind Swaminathan',
    serviceTitle: 'Full Stack Development',
    results: [
      { metric: '75%', label: 'Reduction in API Latency' },
      { metric: '99.95%', label: 'System Uptime' },
      { metric: '4.2x', label: 'Throughput Increase' }
    ],
    processSteps: [
      'Conducted database query profiling and identified unindexed joins causing server spikes.',
      'Implemented Redis cache layer for high-frequency dashboard analytics requests.',
      'Migrated frontend components to Next.js App Router with Server-Side Rendering.'
    ],
    testimonial: {
      quote: 'Aravind completely transformed our backend stability. We went from constant crash fire-fighting to smooth, rapid scaling within 4 weeks.',
      author: 'Rohan Deshpande',
      title: 'CTO, PayPulse'
    },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cs-2',
    slug: 'telehealth-ux-redesign',
    title: 'Increasing Patient Appointment Conversions by 40% via Intuitive UX',
    clientName: 'CareDirect Health',
    clientIndustry: 'Telemedicine & Web Portal',
    challenge: 'CareDirect had a 68% drop-off rate on their doctor booking funnel due to a cluttered multi-screen interface.',
    solution: 'Meera Kapoor conducted UX friction analysis and redesigned the complete booking journey into a seamless 3-step modern web interface.',
    expertId: 'exp-2',
    expertName: 'Meera Kapoor',
    serviceTitle: 'UI/UX Product Design & Systems',
    results: [
      { metric: '+40%', label: 'Booking Conversions' },
      { metric: '-55%', label: 'User Drop-off Rate' },
      { metric: '4.9/5', label: 'User Satisfaction' }
    ],
    processSteps: [
      'Mapped customer pain points through 12 user test recordings.',
      'Simplified date/time slot selection into an intuitive visual calendar card.',
      'Created a unified Figma design system for responsive mobile and web views.'
    ],
    testimonial: {
      quote: 'Meera turned our clumsy booking flow into a beautiful, effortless experience our users love.',
      author: 'Dr. Sunita Rao',
      title: 'Head of Product, CareDirect'
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cs-3',
    slug: 'legacy-php-modernization',
    title: 'Modernizing a Legacy Monolithic PHP Application to Laravel 10',
    clientName: 'TransitLogistics Portal',
    clientIndustry: 'Logistics & Web Software',
    challenge: 'TransitLogistics relied on an outdated custom PHP application that was difficult to maintain, lacked security controls, and crashed regularly.',
    solution: 'Rohan Verma refactored the legacy PHP codebase into clean Laravel architecture with database migrations and secure REST API endpoints.',
    expertId: 'exp-4',
    expertName: 'Rohan Verma',
    serviceTitle: 'PHP & Laravel Development',
    results: [
      { metric: '100%', label: 'Security Compliance' },
      { metric: '3.5x', label: 'Faster Page Loads' },
      { metric: '0', label: 'Unplanned Outages' }
    ],
    processSteps: [
      'Audited legacy PHP script files and structured normalized database schemas.',
      'Rebuilt admin controllers and routes using Laravel Eloquent ORM.',
      'Configured role-based permission access and CSRF protection.'
    ],
    testimonial: {
      quote: 'Rohan modernized our core business application without losing a single line of customer data.',
      author: 'Karthik Raja',
      title: 'Operations Director, TransitLogistics'
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  }
];

// ==========================================
// 6. IT TESTIMONIALS
// ==========================================
export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    quote: 'MakeIT connected us with a top-tier React & Node developer within 24 hours. The milestone delivery approach gave our startup complete confidence.',
    author: 'Vikramaditya Shah',
    role: 'Co-Founder & CEO',
    company: 'Nexus SaaS Solutions',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    serviceName: 'Full Stack Development',
    verified: true
  },
  {
    id: 't-2',
    quote: 'Our website redesign was handled with extreme care and professionalism. The Figma prototype matched the final Next.js code perfectly.',
    author: 'Elena Rostova',
    role: 'VP of Marketing',
    company: 'CloudScale Global',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    serviceName: 'UI/UX & Product Design',
    verified: true
  },
  {
    id: 't-3',
    quote: 'Refactoring our legacy PHP codebase to Laravel seemed daunting, but Rohan executed it cleanly with zero downtime. Exceptional technical partner.',
    author: 'Siddharth Nair',
    role: 'Head of Engineering',
    company: 'OmniTrade Systems',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    serviceName: 'PHP & Laravel Development',
    verified: true
  }
];

// ==========================================
// 7. IT FAQS
// ==========================================
export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Matching',
    question: 'How do you match my business requirement with the right technology expert?',
    answer: 'Our intelligent matching engine analyzes your project requirements—such as application type, target features, and preferred budget—and compares them against our vetted roster of software developers, product designers, and architects. We recommend candidates based on proven tech stack experience.'
  },
  {
    id: 'faq-2',
    category: 'Process',
    question: 'What if I don\'t know which programming language or framework to use?',
    answer: 'That is completely normal. You don\'t need technical knowledge to start. Simply tell us what business solution you want to build (e.g., "I need a SaaS product" or "I want to redesign my website"). Our team and technical consultants will recommend the appropriate technical architecture.'
  },
  {
    id: 'faq-3',
    category: 'IP & Code',
    question: 'Who owns the source code and intellectual property produced during the project?',
    answer: 'You own 100% of the source code, design files, database schemas, and intellectual property. All deliverables and Git repositories are transferred to your company upon milestone completion.'
  },
  {
    id: 'faq-4',
    category: 'Billing',
    question: 'How do milestone payments work?',
    answer: 'Projects are divided into structured milestones (e.g. Scope & Architecture, UI Design, Core Backend, Final Launch). Funds are held securely in escrow and only released to the developer once you review and approve each completed stage.'
  },
  {
    id: 'faq-5',
    category: 'Support',
    question: 'Do you provide post-launch support and application maintenance?',
    answer: 'Yes. All completed projects include a standard 30-day post-launch bug warranty. We also offer monthly retainer plans for ongoing feature additions, security updates, and performance tuning.'
  }
];

// ==========================================
// 8. MOCK INITIAL LEADS & PROJECTS
// ==========================================
export const MOCK_INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    requirement: {
      id: 'req-101',
      rawInput: 'I want to build a SaaS application for automated customer invoicing with Stripe billing.',
      projectType: 'SaaS',
      detectedCategory: 'saas-mvp-development',
      detectedServiceId: 'saas-mvp-development',
      detectedSkills: ['Next.js', 'Node.js', 'Stripe', 'PostgreSQL'],
      budgetRange: '₹50,000–₹1 lakh',
      timeline: '2–4 weeks',
      preferredContact: 'Video Call',
      customerName: 'Aman Agarwal',
      customerEmail: 'aman@invoiceflow.io',
      companyName: 'InvoiceFlow Technologies',
      details: 'Need a production-ready SaaS MVP with Google Auth, dashboard analytics, and Stripe subscription checkout.',
      createdAt: '2026-08-20T10:30:00.000Z'
    },
    status: 'EXPERT_MATCHED',
    matchedExpertIds: ['exp-6', 'exp-1'],
    assignedExpertId: 'exp-6',
    createdAt: '2026-08-20T10:30:00.000Z',
    updatedAt: '2026-08-21T14:15:00.000Z',
    notes: ['Requirement parsed: SaaS MVP. Top match: Karan Malhotra (SaaS Architect, 98% score)'],
    estimatedValueINR: 85000
  },
  {
    id: 'lead-102',
    requirement: {
      id: 'req-102',
      rawInput: 'We need to redesign our old business website and rebuild it on React/Next.js.',
      projectType: 'Website',
      detectedCategory: 'website-redesign',
      detectedServiceId: 'website-redesign',
      detectedSkills: ['React', 'Next.js', 'Tailwind CSS', 'Figma'],
      budgetRange: '₹25,000–₹50,000',
      timeline: '2–4 weeks',
      preferredContact: 'Email',
      customerName: 'Sarita Roy',
      customerEmail: 'sarita@cloudscale.com',
      companyName: 'CloudScale Global',
      details: 'Current site is slow and outdated. Want clean modern light theme UI in Figma and responsive Next.js frontend.',
      createdAt: '2026-08-21T11:00:00.000Z'
    },
    status: 'QUALIFIED',
    matchedExpertIds: ['exp-2', 'exp-5'],
    assignedExpertId: 'exp-2',
    createdAt: '2026-08-21T11:00:00.000Z',
    updatedAt: '2026-08-21T16:00:00.000Z',
    notes: ['Matched with Meera Kapoor for Figma redesign & Priya Sharma for Next.js coding.'],
    estimatedValueINR: 45000
  }
];

export const MOCK_INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'InvoiceFlow SaaS MVP Development',
    customerName: 'Aman Agarwal',
    customerEmail: 'aman@invoiceflow.io',
    expertId: 'exp-6',
    expertName: 'Karan Malhotra',
    expertAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    serviceId: 'saas-mvp-development',
    serviceTitle: 'SaaS & MVP Product Engineering',
    startDate: '2026-08-22',
    deadline: '2026-09-15',
    budgetINR: 85000,
    status: 'In Progress',
    milestones: [
      { id: 'm1', title: 'Architecture & DB Schemas', description: 'Next.js project setup, auth, PostgreSQL models', dueDate: '2026-08-28', amountINR: 25000, status: 'Completed' },
      { id: 'm2', title: 'Dashboard UI & Components', description: 'Responsive analytics screens and invoice builder', dueDate: '2026-09-05', amountINR: 30000, status: 'In Progress' },
      { id: 'm3', title: 'Stripe Billing & Deployment', description: 'Stripe webhook integration and cloud server deployment', dueDate: '2026-09-15', amountINR: 30000, status: 'Pending' }
    ],
    notes: 'Development progressing on schedule. Milestone 1 approved.'
  }
];

export const MOCK_INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'cons-1',
    expertId: 'exp-1',
    expertName: 'Aravind Swaminathan',
    expertTitle: 'Senior Full Stack & Cloud Architect',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul@techventures.co',
    customerPhone: '+91 98765 43210',
    date: '2026-08-25',
    timeSlot: '11:00 AM - 11:30 AM',
    consultationType: '30 min Deep Dive',
    topic: 'Evaluating Next.js vs React Single Page App architecture for web portal',
    status: 'SCHEDULED',
    meetingUrl: 'https://meet.jit.si/MakeIT-Cons-9842',
    createdAt: '2026-08-21T09:00:00.000Z'
  }
];

export const INITIAL_BLOG_ARTICLES = [
  {
    id: 'blog-1',
    slug: 'nextjs-vs-react-spa-architecture',
    title: 'Next.js App Router vs React SPA: Choosing the Right Architecture in 2026',
    excerpt: 'An engineering comparison of server-side rendering, static site generation, and client-side single page applications for modern web products.',
    content: 'When planning a new web product, founders and technical teams must decide between Next.js SSR and traditional React SPA...',
    authorName: 'Aravind Swaminathan',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    category: 'Architecture',
    publishedDate: '2026-08-15',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'Next.js', 'Architecture', 'Web Performance']
  },
  {
    id: 'blog-2',
    slug: 'saas-mvp-tech-stack-guide',
    title: 'The Production SaaS MVP Stack: Auth, Database, Payments & Cloud Setup',
    excerpt: 'A practical blueprint for launching a functional SaaS product without over-engineering your initial codebase.',
    content: 'Building an MVP requires balancing execution speed with maintainable code standards...',
    authorName: 'Karan Malhotra',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    category: 'SaaS & MVP',
    publishedDate: '2026-08-18',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    tags: ['SaaS', 'Node.js', 'Stripe', 'PostgreSQL']
  }
];

