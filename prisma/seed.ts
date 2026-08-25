import { PrismaClient } from '@prisma/client';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_SERVICES, 
  INITIAL_EXPERTS, 
  MOCK_INITIAL_LEADS, 
  MOCK_INITIAL_PROJECTS, 
  MOCK_INITIAL_CONSULTATIONS,
  INITIAL_SOLUTIONS,
  INITIAL_CASE_STUDIES,
  INITIAL_TESTIMONIALS
} from '../src/lib/data/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MakeIT Database Seeding...');

  // 1. Users
  console.log('Seeding Users...');
  await prisma.user.upsert({
    where: { email: 'admin@makeit.com' },
    update: {},
    create: {
      id: 'usr-admin-1',
      email: 'admin@makeit.com',
      name: 'Platform Operations Admin',
      role: 'SUPER_ADMIN',
      company: 'MakeIT Platform',
      phone: '+91 98765 43210'
    }
  });

  await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      id: 'usr-customer-1',
      email: 'client@example.com',
      name: 'Valued Client',
      role: 'CUSTOMER',
      company: 'InnovateTech',
      phone: '+91 99887 76655'
    }
  });

  // 2. Service Categories
  console.log('Seeding Service Categories...');
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.serviceCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        pillar: cat.pillar as any,
        shortDescription: cat.shortDescription,
        iconName: cat.iconName,
        accentColor: cat.accentColor,
        serviceCount: cat.serviceCount,
        featured: cat.featured || false
      }
    });
  }

  // 3. Technologies Catalog
  console.log('Seeding Technologies Catalog...');
  const techList = [
    { name: 'React', slug: 'react', category: 'Frontend Framework', popular: true, iconName: 'Code2' },
    { name: 'Next.js', slug: 'nextjs', category: 'Full Stack Framework', popular: true, iconName: 'Globe' },
    { name: 'TypeScript', slug: 'typescript', category: 'Language', popular: true, iconName: 'FileCode' },
    { name: 'Node.js', slug: 'nodejs', category: 'Backend Runtime', popular: true, iconName: 'Server' },
    { name: 'Express', slug: 'express', category: 'Backend Framework', popular: false, iconName: 'Cpu' },
    { name: 'PHP', slug: 'php', category: 'Language', popular: true, iconName: 'FileCode' },
    { name: 'Laravel', slug: 'laravel', category: 'Backend Framework', popular: true, iconName: 'Layers' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Database', popular: true, iconName: 'Database' },
    { name: 'MongoDB', slug: 'mongodb', category: 'Database', popular: true, iconName: 'Database' },
    { name: 'MySQL', slug: 'mysql', category: 'Database', popular: false, iconName: 'Database' },
    { name: 'Figma', slug: 'figma', category: 'UI/UX Design', popular: true, iconName: 'Figma' },
    { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'Frontend Styling', popular: true, iconName: 'Palette' },
    { name: 'REST API', slug: 'rest-api', category: 'Architecture', popular: true, iconName: 'Link' },
    { name: 'GraphQL', slug: 'graphql', category: 'API Query Language', popular: false, iconName: 'Share2' }
  ];

  for (const t of techList) {
    await prisma.technology.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        name: t.name,
        slug: t.slug,
        category: t.category,
        popular: t.popular,
        iconName: t.iconName
      }
    });
  }

  // 4. Services
  console.log('Seeding Services...');
  for (const srv of INITIAL_SERVICES) {
    await prisma.service.upsert({
      where: { id: srv.id },
      update: {},
      create: {
        id: srv.id,
        slug: srv.slug,
        categoryId: srv.categoryId,
        categoryName: srv.categoryName,
        title: srv.title,
        shortDescription: srv.shortDescription,
        fullDescription: srv.fullDescription,
        iconName: srv.iconName,
        startingPriceINR: srv.startingPriceINR,
        startingPriceUSD: srv.startingPriceUSD,
        typicalDelivery: srv.typicalDelivery,
        expertCount: srv.expertCount,
        skills: JSON.stringify(srv.skills),
        features: JSON.stringify(srv.features),
        deliverables: JSON.stringify(srv.deliverables),
        processSteps: JSON.stringify(srv.processSteps),
        packages: JSON.stringify(srv.packages),
        featured: srv.featured || false,
        seoTitle: srv.seoTitle || srv.title,
        seoDescription: srv.seoDescription || srv.shortDescription
      }
    });
  }

  // 5. Business Solutions
  console.log('Seeding Business Solutions...');
  for (const sol of INITIAL_SOLUTIONS) {
    await prisma.businessSolution.upsert({
      where: { id: sol.id },
      update: {},
      create: {
        id: sol.id,
        slug: sol.slug,
        title: sol.title,
        shortDescription: sol.shortDescription,
        iconName: sol.iconName,
        targetAudience: sol.targetAudience,
        recommendedCategoryId: sol.recommendedCategoryId,
        recommendedServiceId: sol.recommendedServiceId,
        exampleTechnologies: JSON.stringify(sol.exampleTechnologies)
      }
    });
  }

  // 6. Experts
  console.log('Seeding Experts...');
  for (const exp of INITIAL_EXPERTS) {
    await prisma.expert.upsert({
      where: { id: exp.id },
      update: {},
      create: {
        id: exp.id,
        slug: exp.slug,
        name: exp.name,
        title: exp.title,
        avatar: exp.avatar,
        categoryId: exp.categoryId,
        categoryName: exp.categoryName,
        primaryExpertise: exp.primaryExpertise,
        yearsOfExperience: exp.yearsOfExperience,
        skills: JSON.stringify(exp.skills),
        servicesOffered: JSON.stringify(exp.servicesOffered),
        hourlyRateINR: exp.hourlyRateINR,
        hourlyRateUSD: exp.hourlyRateUSD,
        rating: exp.rating,
        reviewCount: exp.reviewCount,
        completedProjects: exp.completedProjects,
        location: exp.location,
        languages: JSON.stringify(exp.languages),
        shortIntro: exp.shortIntro,
        fullBio: exp.fullBio,
        availability: exp.availability,
        certifications: JSON.stringify(exp.certifications || []),
        portfolio: JSON.stringify(exp.portfolio || []),
        verified: exp.verified,
        featured: exp.featured || false
      }
    });
  }

  // 7. Requirements & Leads
  console.log('Seeding Requirements & Leads...');
  for (const lead of MOCK_INITIAL_LEADS) {
    const req = lead.requirement;
    await prisma.requirement.upsert({
      where: { id: req.id },
      update: {},
      create: {
        id: req.id,
        rawInput: req.rawInput,
        projectType: req.projectType,
        detectedCategory: req.detectedCategory,
        detectedServiceId: req.detectedServiceId,
        detectedSkills: JSON.stringify(req.detectedSkills),
        budgetRange: req.budgetRange,
        timeline: req.timeline,
        preferredContact: req.preferredContact,
        customerName: req.customerName,
        customerEmail: req.customerEmail,
        customerPhone: req.customerPhone || '',
        companyName: req.companyName || '',
        details: req.details
      }
    });

    // Create or Link Contact & Company
    let comp = await prisma.company.findFirst({ where: { name: req.companyName || 'Default Company' } });
    if (!comp && req.companyName) {
      comp = await prisma.company.create({
        data: {
          name: req.companyName,
          email: req.customerEmail,
          phone: req.customerPhone || '+91 98765 00000',
          source: 'Website'
        }
      });
    }

    let contact = await prisma.contact.findFirst({ where: { phone: req.customerPhone || '+91 98765 00000' } });
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          name: req.customerName,
          email: req.customerEmail,
          phone: req.customerPhone || '+91 98765 00000',
          companyId: comp?.id || null,
          companyName: req.companyName || null,
          source: 'Website',
          status: 'ACTIVE'
        }
      });
    }

    await prisma.lead.upsert({
      where: { id: lead.id },
      update: {
        contactId: contact.id,
        companyId: comp?.id || null,
        priority: 'HIGH',
        source: 'Website'
      },
      create: {
        id: lead.id,
        requirementId: req.id,
        contactId: contact.id,
        companyId: comp?.id || null,
        status: lead.status as any,
        priority: 'HIGH',
        source: 'Website',
        matchedExpertIds: JSON.stringify(lead.matchedExpertIds),
        assignedExpertId: lead.assignedExpertId,
        estimatedValueINR: lead.estimatedValueINR || 50000,
        notes: JSON.stringify(lead.notes || []),
        nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    // Initial follow-up for lead
    await prisma.followUp.create({
      data: {
        leadId: lead.id,
        contactId: contact.id,
        assignedTo: 'usr-admin-1',
        assignedToName: 'Platform Operations Admin',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // Follow up today in 2 hours
        reason: 'Initial Requirement Discussion & Scope Alignment',
        priority: 'HIGH',
        status: 'PENDING'
      }
    });

    // Sample call record
    await prisma.call.create({
      data: {
        leadId: lead.id,
        contactId: contact.id,
        agentId: 'usr-admin-1',
        agentName: 'Platform Operations Admin',
        provider: 'mock',
        direction: 'OUTBOUND',
        status: 'ENDED',
        durationSeconds: 245,
        outcome: 'Follow-up Required',
        notes: 'Spoke with client regarding SaaS application scope. Requested architecture proposal.'
      }
    });

    // Initial activity log
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        contactId: contact.id,
        actorId: 'usr-admin-1',
        actorName: 'Platform Operations Admin',
        actorRole: 'SUPER_ADMIN',
        type: 'Lead Created',
        title: `Requirement received from ${req.customerName}`,
        description: req.rawInput
      }
    });
  }

  // 8. Projects & Milestones
  console.log('Seeding Projects & Milestones...');
  for (const p of MOCK_INITIAL_PROJECTS) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        title: p.title,
        customerName: p.customerName,
        customerEmail: p.customerEmail,
        expertId: p.expertId,
        expertName: p.expertName,
        expertAvatar: p.expertAvatar,
        serviceId: p.serviceId,
        serviceTitle: p.serviceTitle,
        startDate: p.startDate,
        deadline: p.deadline,
        budgetINR: p.budgetINR,
        status: p.status === 'In Progress' ? 'In_Progress' : (p.status as any),
        notes: p.notes
      }
    });

    for (const m of p.milestones) {
      await prisma.projectMilestone.upsert({
        where: { id: m.id },
        update: {},
        create: {
          id: m.id,
          projectId: p.id,
          title: m.title,
          description: m.description,
          dueDate: m.dueDate,
          amountINR: m.amountINR,
          status: m.status
        }
      });
    }

    // Default primary member
    await prisma.projectMember.create({
      data: {
        projectId: p.id,
        role: 'Lead Architect',
        expertId: p.expertId,
        expertName: p.expertName,
        expertTitle: 'Lead Technology Expert',
        expertAvatar: p.expertAvatar
      }
    });
  }

  // 9. Consultations
  console.log('Seeding Appointments...');
  for (const c of MOCK_INITIAL_CONSULTATIONS) {
    await prisma.appointment.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        expertId: c.expertId,
        expertName: c.expertName,
        expertTitle: c.expertTitle,
        customerName: c.customerName,
        customerEmail: c.customerEmail,
        customerPhone: c.customerPhone,
        date: c.date,
        timeSlot: c.timeSlot,
        consultationType: c.consultationType,
        topic: c.topic,
        status: c.status as any,
        meetingUrl: c.meetingUrl
      }
    });
  }

  // 10. Case Studies
  console.log('Seeding Case Studies...');
  for (const cs of INITIAL_CASE_STUDIES) {
    await prisma.caseStudy.upsert({
      where: { id: cs.id },
      update: {},
      create: {
        id: cs.id,
        slug: cs.slug,
        title: cs.title,
        clientName: cs.clientName,
        clientIndustry: cs.clientIndustry,
        challenge: cs.challenge,
        solution: cs.solution,
        expertId: cs.expertId,
        expertName: cs.expertName,
        serviceTitle: cs.serviceTitle,
        results: JSON.stringify(cs.results),
        processSteps: JSON.stringify(cs.processSteps),
        testimonialQuote: cs.testimonial.quote,
        testimonialAuthor: cs.testimonial.author,
        testimonialTitle: cs.testimonial.title,
        image: cs.image,
        published: true
      }
    });
  }

  // 11. Reviews
  console.log('Seeding Reviews...');
  const initialReviews = [
    {
      id: 'rev-1',
      expertId: 'exp-1',
      customerName: 'Rohit Sharma',
      customerRoleCompany: 'VP of Tech, FinTech Global',
      rating: 5.0,
      qualityRating: 5.0,
      communicationRating: 5.0,
      professionalismRating: 5.0,
      deliveryRating: 5.0,
      comment: 'Aravind delivered exceptional full-stack architecture for our payments portal.',
      date: '2026-08-15',
      serviceTitle: 'Full Stack Development',
      verified: true
    }
  ];
  for (const r of initialReviews) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        expertId: r.expertId,
        customerName: r.customerName,
        customerRoleCompany: r.customerRoleCompany,
        rating: r.rating,
        qualityRating: r.qualityRating,
        communicationRating: r.communicationRating,
        professionalismRating: r.professionalismRating,
        deliveryRating: r.deliveryRating,
        comment: r.comment,
        date: r.date,
        serviceTitle: r.serviceTitle,
        verified: r.verified,
        status: 'APPROVED',
        featured: true
      }
    });
  }

  // 12. Testimonials
  console.log('Seeding Testimonials...');
  for (const t of INITIAL_TESTIMONIALS) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        quote: t.quote,
        author: t.author,
        role: t.role,
        company: t.company,
        avatar: t.avatar,
        rating: t.rating,
        serviceName: t.serviceName,
        verified: t.verified
      }
    });
  }

  // 13. Audit Log initial entry
  console.log('Seeding Initial Audit Log...');
  await prisma.auditLog.create({
    data: {
      userId: 'usr-admin-1',
      userName: 'System Administrator',
      userRole: 'SUPER_ADMIN',
      action: 'SYSTEM_INITIALIZATION',
      entity: 'Platform',
      entityId: 'sys-init',
      details: 'MakeIT Backend & Database Architecture Initialized'
    }
  });

  console.log('✅ MakeIT Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
