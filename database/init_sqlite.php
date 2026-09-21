<?php
/**
 * MakeIT - SQLite Fallback Database Initializer
 *
 * Populates database/makeit.sqlite with tables and initial seed data matching
 * makeit.sql so local development and testing work without a running MySQL daemon.
 */

declare(strict_types=1);

function init_sqlite_database(string $sqliteFile): PDO
{
    $isNew = !file_exists($sqliteFile) || filesize($sqliteFile) === 0;
    $pdo = new PDO('sqlite:' . $sqliteFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec("PRAGMA journal_mode = WAL;");
    $pdo->exec("PRAGMA busy_timeout = 5000;");

    if ($isNew) {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'admin',
                is_active INTEGER NOT NULL DEFAULT 1,
                last_login_at TEXT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS login_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_address TEXT NOT NULL,
                username TEXT NOT NULL,
                attempted_at TEXT NOT NULL,
                is_successful INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS hero_content (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                badge_text TEXT NOT NULL,
                headline TEXT NOT NULL,
                subheadline TEXT NOT NULL,
                description TEXT NOT NULL,
                primary_button_text TEXT NOT NULL,
                primary_button_link TEXT NOT NULL,
                secondary_button_text TEXT NOT NULL,
                secondary_button_link TEXT NOT NULL,
                stats_json TEXT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                short_description TEXT NOT NULL,
                long_description TEXT NOT NULL,
                icon TEXT NOT NULL DEFAULT 'code',
                features TEXT NULL,
                display_order INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'published',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                category TEXT NOT NULL,
                client_name TEXT NULL,
                description TEXT NOT NULL,
                image TEXT NULL,
                project_url TEXT NULL,
                tags TEXT NULL,
                display_order INTEGER NOT NULL DEFAULT 0,
                is_featured INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'published',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS process_steps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                step_number TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                display_order INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'published',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS testimonials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_name TEXT NOT NULL,
                company TEXT NOT NULL,
                position TEXT NULL,
                content TEXT NOT NULL,
                rating INTEGER NOT NULL DEFAULT 5,
                image TEXT NULL,
                display_order INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'published',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NULL,
                company TEXT NULL,
                service_interested TEXT NULL,
                budget TEXT NULL,
                message TEXT NOT NULL,
                ip_address TEXT NOT NULL,
                user_agent TEXT NULL,
                status TEXT NOT NULL DEFAULT 'new',
                notes TEXT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS site_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                setting_key TEXT NOT NULL UNIQUE,
                setting_value TEXT NULL,
                setting_group TEXT NOT NULL DEFAULT 'general',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_services_status_order ON services (status, display_order);
            CREATE INDEX IF NOT EXISTS idx_projects_status_featured_order ON projects (status, is_featured, display_order);
            CREATE INDEX IF NOT EXISTS idx_process_status_order ON process_steps (status, display_order);
            CREATE INDEX IF NOT EXISTS idx_testimonials_status_order ON testimonials (status, display_order);
            CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads (status, created_at);
        ");

        // Seed default superadmins (password: Admin@12345)
        $now = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare("INSERT INTO admins (username, email, password_hash, full_name, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['admin', 'admin@makeit.digital', '$2y$12$ht.4P0FXjJ7ev7MsltCeSeQpBGGj/is8I.XzZ/WMTbz2NTau8dX4y', 'MakeIT Administrator', 'superadmin', 1, $now, $now]);
        $stmt->execute(['superadmin', 'superadmin@rithamaya.com', '$2y$12$ht.4P0FXjJ7ev7MsltCeSeQpBGGj/is8I.XzZ/WMTbz2NTau8dX4y', 'Rithamaya Administrator', 'superadmin', 1, $now, $now]);

        // Seed Hero
        $stmt = $pdo->prepare("INSERT INTO hero_content (id, badge_text, headline, subheadline, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, stats_json, updated_at) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            'Digital studio / 2026',
            "WE MAKE\nDIGITAL\nTHINGS WORK.",
            'We turn ideas into websites, software and digital experiences that actually work.',
            'From the first sketch to the final launch, MakeIT designs and builds digital products around the way your business actually works.',
            'Start a Project',
            '#contact',
            'Explore Services',
            '#services',
            json_encode([
                ['label' => 'Client Satisfaction', 'value' => '99.4%'],
                ['label' => 'Projects Shipped', 'value' => '150+'],
                ['label' => 'Avg Performance', 'value' => '98/100'],
                ['label' => 'System Reliability', 'value' => '99.9%']
            ]),
            $now
        ]);

        // Seed Services
        $services = [
            ['Websites', 'websites', 'High-performing websites and landing pages designed to make your business stand out.', 'We construct scalable web platforms with clean, semantic markup, bespoke styling, and resilient server-side architecture. Designed for blistering speed, ironclad security, and peak conversion.', 'code', "Custom PHP & Database Architecture\nHeadless & API Integration\nLighthouse 95+ Performance\nFull Accessibility Compliance", 1, 'published'],
            ['Software', 'software', 'Custom dashboards, SaaS products and business applications built around your workflow.', 'Stop compromising with off-the-shelf software that does not match your business model. We build custom dashboards, ERPs, CRM connectors, and automated data pipelines designed specifically around your operational needs.', 'cpu', "Role-Based Access Control (RBAC)\nAutomated Business Logic\nSecure Data Storage & Export\nSeamless Third-Party API Sync", 2, 'published'],
            ['AI + Automation', 'ai-automation', 'Smarter workflows, AI assistants and automation that save your team time.', 'Eliminate manual data entry and disjointed workflows. We bridge payment gateways, CRMs, marketing platforms, and custom webhooks into a unified and real-time infrastructure.', 'zap', "Payment Gateway Integration (Stripe/PayPal)\nCRM & Email Marketing Webhooks\nScheduled Data Synchronization\nWebhook Queuing & Error Handling", 3, 'published']
        ];
        $svcStmt = $pdo->prepare("INSERT INTO services (title, slug, short_description, long_description, icon, features, display_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($services as $s) {
            $svcStmt->execute([$s[0], $s[1], $s[2], $s[3], $s[4], $s[5], $s[6], $s[7], $now, $now]);
        }

        // Seed Projects
        $projects = [
            ['Apex Logistics Portal', 'apex-logistics-portal', 'Website', 'Apex Global Freight', 'A real-time dispatch and fleet management dashboard handling thousands of daily freight consignments with sub-second response times.', '/assets/images/projects/apex-portal.webp', 'https://example.com/apex', 'PHP 8, MySQL, Custom Dashboard, Vanilla JS', 1, 1, 'published'],
            ['Kroma Design Studio', 'kroma-design-studio', 'Software', 'Kroma Creative', 'An immersive, award-winning agency portfolio showcasing typography excellence, dynamic dark-mode interactions, and smooth transitions.', '/assets/images/projects/kroma-studio.webp', 'https://example.com/kroma', 'Vanilla CSS, Animation, Semantic HTML5', 2, 1, 'published'],
            ['Veloce E-Commerce Engine', 'veloce-ecommerce-engine', 'AI + Automation', 'Veloce Luxury Wear', 'Custom lightweight e-commerce storefront with instantaneous product filtering, zero framework bloat, and frictionless checkout.', '/assets/images/projects/veloce-engine.webp', 'https://example.com/veloce', 'Custom Cart, Payment APIs, SEO Optimized', 3, 1, 'published'],
            ['OmniFlow Workflow Automation', 'omniflow-workflow-automation', 'Digital System', 'OmniFlow Tech', 'Internal operational engine synchronizing CRM data, automated invoicing, and multi-tier employee approval pipelines.', '/assets/images/projects/omniflow.webp', 'https://example.com/omniflow', 'REST APIs, Background Workers, Role Security', 4, 0, 'published']
        ];
        $prjStmt = $pdo->prepare("INSERT INTO projects (title, slug, category, client_name, description, image, project_url, tags, display_order, is_featured, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($projects as $p) {
            $prjStmt->execute([$p[0], $p[1], $p[2], $p[3], $p[4], $p[5], $p[6], $p[7], $p[8], $p[9], $p[10], $now, $now]);
        }

        // Seed Process Steps
        $steps = [
            ['01', 'Tell us.', 'Tell us what you\'re trying to build, fix or improve.', 1, 'published'],
            ['02', 'We plan.', 'We define the experience, technology and scope.', 2, 'published'],
            ['03', 'We build.', 'Design, development and testing happen together.', 3, 'published'],
            ['04', 'You launch.', 'Your product goes live and starts doing its job.', 4, 'published']
        ];
        $stepStmt = $pdo->prepare("INSERT INTO process_steps (step_number, title, description, display_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($steps as $st) {
            $stepStmt->execute([$st[0], $st[1], $st[2], $st[3], $st[4], $now, $now]);
        }

        // Seed Testimonials
        $testimonials = [
            ['Marcus Vance', 'Apex Global Logistics', 'Chief Technology Officer', 'MakeIT transformed our dispatch platform from a sluggish legacy headache into a blisteringly fast powerhouse. The speed and clarity of their engineering is unparalleled.', 5, '/assets/images/testimonials/marcus.webp', 1, 'published'],
            ['Elena Rostova', 'Kroma Creative Agency', 'Founder & Creative Director', 'Working with MakeIT was seamless. They understood both the delicate aesthetic nuances of our brand and the strict architectural requirements under the hood.', 5, '/assets/images/testimonials/elena.webp', 2, 'published'],
            ['Julian Bennett', 'Veloce Luxury Group', 'Managing Director', 'Our online store conversion jumped by 34% within the first month after MakeIT rebuilt our checkout flow. Zero framework bloat, lightning speed, and total reliability.', 5, '/assets/images/testimonials/julian.webp', 3, 'published']
        ];
        $tstStmt = $pdo->prepare("INSERT INTO testimonials (client_name, company, position, content, rating, image, display_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($testimonials as $t) {
            $tstStmt->execute([$t[0], $t[1], $t[2], $t[3], $t[4], $t[5], $t[6], $t[7], $now, $now]);
        }

        // Seed Settings
        $settings = [
            ['company_name', 'MakeIT', 'general'],
            ['tagline', 'We Make Digital Things Work.', 'general'],
            ['email', 'hello@makeit.digital', 'contact'],
            ['phone', '9035344513', 'contact'],
            ['address', 'Bangalore-560010, karnataka. India', 'contact'],
            ['linkedin', 'https://linkedin.com/company/makeit', 'social'],
            ['instagram', 'https://instagram.com/makeit.digital', 'social'],
            ['facebook', 'https://facebook.com/makeitdigital', 'social'],
            ['github', 'https://github.com/makeit', 'social'],
            ['twitter', 'https://x.com/makeitdigital', 'social'],
            ['logo', '/assets/images/logo.svg', 'branding'],
            ['favicon', '/assets/images/favicon.svg', 'branding'],
            ['meta_title', 'MakeIT — We Make Digital Things Work', 'seo'],
            ['meta_description', 'MakeIT designs and builds websites, software, AI automation and digital experiences that actually work.', 'seo'],
            ['primary_color', '#b8ff3d', 'branding'],
            ['announcement_text', 'Now booking client projects for Q3/Q4', 'general']
        ];
        $setStmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value, setting_group, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");
        foreach ($settings as $set) {
            $setStmt->execute([$set[0], $set[1], $set[2], $now, $now]);
        }

        // Seed Sample Leads
        $sampleLeads = [
            ['Sarah Jenkins', 'sarah@aetherdynamics.com', '+1 (555) 234-5678', 'Aether Dynamics', 'Software', '₹2,50,000 - ₹5,00,000', 'We need a custom inventory and dispatch dashboard to connect with our ERP.', '127.0.0.1', 'new', null, date('Y-m-d H:i:s', time() - 3600 * 2)],
            ['David Kim', 'david@nexusretail.co', '+1 (555) 345-6789', 'Nexus Retail', 'Websites', '₹1,00,000 - ₹2,50,000', 'Looking to overhaul our high-traffic e-commerce storefront for better mobile performance.', '127.0.0.1', 'new', null, date('Y-m-d H:i:s', time() - 3600 * 5)],
            ['Amara Okafor', 'amara@solacefin.io', '+1 (555) 456-7890', 'Solace Financial', 'AI + Automation', '₹5,00,000+', 'Automating client onboarding workflows and compliance checks via webhooks.', '127.0.0.1', 'contacted', 'Had initial discovery call on Tuesday.', date('Y-m-d H:i:s', time() - 86400)],
            ['Marcus Vance', 'marcus@apexlogistics.com', '+1 (555) 567-8901', 'Apex Logistics', 'Websites', '₹1,50,000 - ₹3,00,000', 'Interested in expanding our current portal features.', '127.0.0.1', 'qualified', 'Ready for proposal review.', date('Y-m-d H:i:s', time() - 86400 * 2)],
            ['Elena Rostova', 'elena@kromastudio.design', '+1 (555) 678-9012', 'Kroma Studio', 'Software', '₹2,50,000 - ₹5,00,000', 'Annual maintenance and server scaling setup.', '127.0.0.1', 'closed', 'Contract signed.', date('Y-m-d H:i:s', time() - 86400 * 4)]
        ];
        $leadStmt = $pdo->prepare("INSERT INTO leads (name, email, phone, company, service_interested, budget, message, ip_address, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($sampleLeads as $l) {
            $leadStmt->execute([$l[0], $l[1], $l[2], $l[3], $l[4], $l[5], $l[6], $l[7], $l[8], $l[9], $l[10], $l[10]]);
        }
    }

    // Ensure metadata tracking table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS _db_meta (key TEXT PRIMARY KEY, val TEXT)");

    // CRM Schema Assurance (creates tables if not yet existing)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name TEXT NOT NULL,
            company_name TEXT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            alternate_phone TEXT NULL,
            service TEXT NULL,
            source TEXT NULL,
            status TEXT NOT NULL DEFAULT 'New',
            assigned_to TEXT NULL,
            notes TEXT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS calls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contact_name TEXT NOT NULL,
            company TEXT NULL,
            phone TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'discovery',
            status TEXT NOT NULL DEFAULT 'scheduled',
            scheduled_at TEXT NOT NULL,
            duration_minutes INTEGER DEFAULT 0,
            priority TEXT NOT NULL DEFAULT 'normal',
            notes TEXT NULL,
            outcome TEXT NULL,
            created_at TEXT NOT NULL,
            call_datetime TEXT NULL
        );

        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_number TEXT NOT NULL UNIQUE,
            client_id INTEGER NULL,
            client_name TEXT NOT NULL,
            service TEXT NULL,
            amount REAL NOT NULL DEFAULT 0.00,
            status TEXT NOT NULL DEFAULT 'paid',
            due_date TEXT NOT NULL,
            paid_at TEXT NULL,
            notes TEXT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NULL
        );

        CREATE TABLE IF NOT EXISTS revenue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NULL,
            lead_id INTEGER NULL,
            invoice_id INTEGER NULL,
            amount REAL NOT NULL DEFAULT 0.00,
            payment_type TEXT NOT NULL DEFAULT 'Bank Transfer',
            payment_status TEXT NOT NULL DEFAULT 'Paid',
            payment_date TEXT NOT NULL,
            service TEXT NOT NULL,
            notes TEXT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
    ");

    // Phase Migrations: Ensure all required columns exist on invoices
    try {
        $invCols = $pdo->query("PRAGMA table_info(invoices)")->fetchAll();
        $invColNames = array_column($invCols, 'name');
        if (!in_array('client_id', $invColNames, true)) {
            $pdo->exec("ALTER TABLE invoices ADD COLUMN client_id INTEGER NULL");
        }
        if (!in_array('service', $invColNames, true)) {
            $pdo->exec("ALTER TABLE invoices ADD COLUMN service TEXT NULL");
        }
        if (!in_array('notes', $invColNames, true)) {
            $pdo->exec("ALTER TABLE invoices ADD COLUMN notes TEXT NULL");
        }
        if (!in_array('updated_at', $invColNames, true)) {
            $pdo->exec("ALTER TABLE invoices ADD COLUMN updated_at TEXT NULL");
        }
    } catch (\Throwable) {}

    // Phase Migrations: Ensure revenue table has client_name field
    try {
        $revCols = $pdo->query("PRAGMA table_info(revenue)")->fetchAll();
        $revColNames = array_column($revCols, 'name');
        if (!in_array('client_name', $revColNames, true)) {
            $pdo->exec("ALTER TABLE revenue ADD COLUMN client_name TEXT NULL");
        }
    } catch (\Throwable) {}

    // Phase Migrations: Ensure leads table has required fields
    try {
        $leadCols = $pdo->query("PRAGMA table_info(leads)")->fetchAll();
        $existingLeadCols = array_column($leadCols, 'name');
        if (!in_array('client_id', $existingLeadCols, true)) {
            $pdo->exec("ALTER TABLE leads ADD COLUMN client_id INTEGER NULL");
        }
        if (!in_array('service', $existingLeadCols, true)) {
            $pdo->exec("ALTER TABLE leads ADD COLUMN service TEXT NULL");
        }
        if (!in_array('source', $existingLeadCols, true)) {
            $pdo->exec("ALTER TABLE leads ADD COLUMN source TEXT NULL DEFAULT 'Website Form'");
        }
        if (!in_array('call_status', $existingLeadCols, true)) {
            $pdo->exec("ALTER TABLE leads ADD COLUMN call_status TEXT NOT NULL DEFAULT 'Not Called'");
        }
        if (!in_array('last_called_at', $existingLeadCols, true)) {
            $pdo->exec("ALTER TABLE leads ADD COLUMN last_called_at TEXT NULL");
        }
        if (!in_array('next_followup_at', $existingLeadCols, true)) {
            $pdo->exec("ALTER TABLE leads ADD COLUMN next_followup_at TEXT NULL");
        }
    } catch (\Throwable) {}

    // Phase Migrations: Ensure calls table has required fields
    try {
        $callCols = $pdo->query("PRAGMA table_info(calls)")->fetchAll();
        $existingCallCols = array_column($callCols, 'name');
        if (!in_array('lead_id', $existingCallCols, true)) {
            $pdo->exec("ALTER TABLE calls ADD COLUMN lead_id INTEGER NULL");
        }
        if (!in_array('client_id', $existingCallCols, true)) {
            $pdo->exec("ALTER TABLE calls ADD COLUMN client_id INTEGER NULL");
        }
        if (!in_array('call_datetime', $existingCallCols, true)) {
            $pdo->exec("ALTER TABLE calls ADD COLUMN call_datetime TEXT NULL");
        }
        if (!in_array('next_followup_at', $existingCallCols, true)) {
            $pdo->exec("ALTER TABLE calls ADD COLUMN next_followup_at TEXT NULL");
        }
        $pdo->exec("UPDATE calls SET call_datetime = COALESCE(scheduled_at, created_at) WHERE call_datetime IS NULL");
    } catch (\Throwable) {}

    // Check if CRM sample data was already initialized once
    $isCrmSeeded = false;
    try {
        $isCrmSeeded = (bool)$pdo->query("SELECT 1 FROM _db_meta WHERE key = 'crm_seeded'")->fetchColumn();
    } catch (\Throwable) {}

    // If database already contains user data, mark as seeded to never overwrite user actions/deletions
    if (!$isCrmSeeded) {
        $existingCallsCount = (int)$pdo->query("SELECT COUNT(*) FROM calls")->fetchColumn();
        $existingRevCount = (int)$pdo->query("SELECT COUNT(*) FROM revenue")->fetchColumn();
        $existingInvCount = (int)$pdo->query("SELECT COUNT(*) FROM invoices")->fetchColumn();

        // If records already exist from previous work, simply seal the database so nothing is reseeded
        if ($existingCallsCount > 0 || $existingRevCount > 0 || $existingInvCount > 0) {
            $pdo->exec("INSERT OR REPLACE INTO _db_meta (key, val) VALUES ('crm_seeded', '1')");
            return $pdo;
        }

        // Fresh database initialization: seed sample records ONCE
        $now = date('Y-m-d H:i:s');

        // 1. Sample Clients
        $sampleClients = [
            ['Marcus Vance', 'Apex Global Logistics', 'marcus@apexlogistics.com', '+1 (555) 567-8901', '+1 (555) 567-8999', 'Websites', 'Website Inquiry', 'Active', 'MakeIT Administrator', 'Enterprise dispatch and fleet management portal client.', date('Y-m-d H:i:s', time() - 86400 * 120), $now],
            ['Elena Rostova', 'Kroma Creative Agency', 'elena@kromastudio.design', '+1 (555) 678-9012', null, 'Software', 'Referral', 'Active', 'MakeIT Administrator', 'Studio portfolio maintenance and server scaling setup.', date('Y-m-d H:i:s', time() - 86400 * 90), $now],
            ['Julian Bennett', 'Veloce Luxury Group', 'julian@velocewear.com', '+1 (555) 789-0123', '+1 (555) 789-0199', 'AI + Automation', 'LinkedIn', 'Active', 'MakeIT Administrator', 'E-commerce headless checkout engine and automated inventory sync.', date('Y-m-d H:i:s', time() - 86400 * 60), $now],
            ['David Kim', 'Nexus Retail Co', 'david@nexusretail.co', '+1 (555) 345-6789', null, 'Websites', 'Cold Outreach', 'Active', 'MakeIT Administrator', 'Multi-brand e-commerce frontend redesign with Shopify Plus.', date('Y-m-d H:i:s', time() - 86400 * 45), $now]
        ];
        $clientStmt = $pdo->prepare("INSERT INTO clients (client_name, company_name, email, phone, alternate_phone, service, source, status, assigned_to, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($sampleClients as $c) {
            $clientStmt->execute($c);
        }

        // 2. Sample Leads
        $sampleLeads = [
            ['Vikram Malhotra', 'vikram@malhotratech.in', '+91 98201 12345', 'Malhotra Tech', 'Website', '₹1,50,000', 'Need a bespoke headless corporate portal.', '127.0.0.1', 'New', null, date('Y-m-d H:i:s', time() - 3600 * 2)],
            ['Ananya Sen', 'ananya@cloudnative.co', '+91 98302 23456', 'CloudNative Labs', 'Software', '₹2,50,000', 'Looking for a custom multi-tenant SaaS dashboard.', '127.0.0.1', 'New', null, date('Y-m-d H:i:s', time() - 3600 * 6)],
            ['Rohan Mehta', 'rohan@mehtalogistics.com', '+91 98403 34567', 'Mehta Logistics', 'AI + Automation', '₹1,80,000', 'Automate delivery dispatch route workflows.', '127.0.0.1', 'Contacted', 'Initial discovery call conducted.', date('Y-m-d H:i:s', time() - 86400 * 2)],
            ['Pooja Iyer', 'pooja@iyerfashion.com', '+91 98504 45678', 'Iyer Luxury', 'UI/UX', '₹95,000', 'Storefront mobile UI/UX overhaul.', '127.0.0.1', 'Contacted', 'Scheduled UI wireframe review.', date('Y-m-d H:i:s', time() - 86400 * 3)],
            ['Karan Kapoor', 'karan@kapoordigital.io', '+91 98605 56789', 'Kapoor Digital', 'Software', '₹3,00,000', 'Enterprise CRM connector with ERP.', '127.0.0.1', 'Qualified', 'Scope finalized, proposal preparing.', date('Y-m-d H:i:s', time() - 86400 * 5)],
            ['Sneha Roy', 'sneha@finflow.in', '+91 98706 67890', 'FinFlow Payments', 'AI + Automation', '₹2,20,000', 'Automated reconciliation and webhook gateway.', '127.0.0.1', 'Qualified', 'Technical assessment complete.', date('Y-m-d H:i:s', time() - 86400 * 6)],
            ['Arjun Verma', 'arjun@vermasteel.com', '+91 98807 78901', 'Verma Steel', 'Website', '₹1,20,000', 'Corporate manufacturing brand redesign.', '127.0.0.1', 'Proposal Sent', 'Proposal sent via email.', date('Y-m-d H:i:s', time() - 86400 * 8)],
            ['Divya Nair', 'divya@nairretail.in', '+91 98908 89012', 'Nair Retail Group', 'Software', '₹1,75,000', 'Inventory sync & billing POS portal.', '127.0.0.1', 'Proposal Sent', 'Awaiting board sign-off.', date('Y-m-d H:i:s', time() - 86400 * 10)],
            ['Marcus Vance', 'marcus@apexlogistics.com', '+1 (555) 567-8901', 'Apex Global Logistics', 'Website', '₹4,50,000', 'Enterprise logistics portal build.', '127.0.0.1', 'Converted', 'Client converted and signed SLA contract.', date('Y-m-d H:i:s', time() - 86400 * 35)],
            ['Elena Rostova', 'elena@kromastudio.design', '+1 (555) 678-9012', 'Kroma Creative', 'Software', '₹3,20,000', 'Design studio engine and retainers.', '127.0.0.1', 'Converted', 'Signed and active client.', date('Y-m-d H:i:s', time() - 86400 * 50)],
            ['Tarun Khanna', 'tarun@khannatech.com', '+91 99009 90123', 'Khanna Tech', 'Other', '₹60,000', 'Legacy WordPress bug fixes.', '127.0.0.1', 'Lost', 'Budget out of alignment; archived.', date('Y-m-d H:i:s', time() - 86400 * 40)]
        ];
        $leadStmt = $pdo->prepare("INSERT INTO leads (name, email, phone, company, service_interested, budget, message, ip_address, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($sampleLeads as $l) {
            $leadStmt->execute([$l[0], $l[1], $l[2], $l[3], $l[4], $l[5], $l[6], $l[7], $l[8], $l[9], $l[10], $l[10]]);
        }

        // 3. Sample Calls
        $sampleCalls = [
            ['Vikram Malhotra', 'Malhotra Tech', '+91 98201 12345', 'discovery', 'scheduled', date('Y-m-d H:i:s', time() - 3600 * 3), 30, 'high', 'Discovery call on website portal', null, date('Y-m-d H:i:s', time() - 86400 * 1)],
            ['Ananya Sen', 'CloudNative Labs', '+91 98302 23456', 'discovery', 'scheduled', date('Y-m-d H:i:s', time() - 3600 * 1), 30, 'high', 'Review multi-tenant dashboard requirements', null, date('Y-m-d H:i:s', time() - 86400 * 1)],
            ['Rohan Mehta', 'Mehta Logistics', '+91 98403 34567', 'follow_up', 'scheduled', date('Y-m-d H:i:s', time() + 3600 * 4), 25, 'normal', 'Follow-up on route dispatch workflow', null, date('Y-m-d H:i:s', time())],
            ['Pooja Iyer', 'Iyer Luxury', '+91 98504 45678', 'follow_up', 'scheduled', date('Y-m-d H:i:s', time() + 86400), 30, 'normal', 'Review UI/UX prototype wireframes', null, date('Y-m-d H:i:s', time())],
            ['Karan Kapoor', 'Kapoor Digital', '+91 98605 56789', 'check_in', 'completed', date('Y-m-d H:i:s', time() - 86400 * 1), 35, 'normal', 'Technical scoping discussion', 'Connected', date('Y-m-d H:i:s', time() - 86400 * 1)],
            ['Sneha Roy', 'FinFlow Payments', '+91 98706 67890', 'discovery', 'completed', date('Y-m-d H:i:s', time() - 86400 * 2), 20, 'normal', 'Initial webhook architecture discussion', 'Connected', date('Y-m-d H:i:s', time() - 86400 * 2)],
            ['Arjun Verma', 'Verma Steel', '+91 98807 78901', 'proposal_review', 'completed', date('Y-m-d H:i:s', time() - 86400 * 3), 40, 'high', 'Walkthrough of website milestone pricing', 'Call Back', date('Y-m-d H:i:s', time() - 86400 * 3)],
            ['Divya Nair', 'Nair Retail Group', '+91 98908 89012', 'check_in', 'completed', date('Y-m-d H:i:s', time() - 86400 * 4), 15, 'low', 'Left voicemail regarding contract amendment', 'No Answer', date('Y-m-d H:i:s', time() - 86400 * 4)],
            ['Marcus Vance', 'Apex Logistics', '+1 (555) 567-8901', 'check_in', 'completed', date('Y-m-d H:i:s', time() - 86400 * 5), 25, 'normal', 'SLA server health review call', 'Connected', date('Y-m-d H:i:s', time() - 86400 * 5)],
            ['Elena Rostova', 'Kroma Creative', '+1 (555) 678-9012', 'follow_up', 'completed', date('Y-m-d H:i:s', time() - 86400 * 6), 20, 'normal', 'Client requested afternoon call back', 'Call Back', date('Y-m-d H:i:s', time() - 86400 * 6)],
            ['Julian Bennett', 'Veloce Luxury', '+1 (555) 789-0123', 'check_in', 'completed', date('Y-m-d H:i:s', time() - 86400 * 7), 30, 'normal', 'E-commerce campaign sync', 'Connected', date('Y-m-d H:i:s', time() - 86400 * 7)],
            ['David Kim', 'Nexus Retail', '+1 (555) 345-6789', 'check_in', 'completed', date('Y-m-d H:i:s', time() - 86400 * 12), 10, 'low', 'Followed up on quote; phone rang out', 'No Answer', date('Y-m-d H:i:s', time() - 86400 * 12)]
        ];
        $callStmt = $pdo->prepare("INSERT INTO calls (contact_name, company, phone, type, status, scheduled_at, duration_minutes, priority, notes, outcome, created_at, call_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($sampleCalls as $call) {
            $callStmt->execute([$call[0], $call[1], $call[2], $call[3], $call[4], $call[5], $call[6], $call[7], $call[8], $call[9], $call[10], $call[5]]);
        }

        // 4. Sample Invoices
        $sampleInvoices = [
            ['INV-2026-001', 'Apex Global Logistics', 'Website', 85000.00, 'paid', date('Y-m-d', time() - 86400 * 150), date('Y-m-d H:i:s', time() - 86400 * 148), date('Y-m-d H:i:s', time() - 86400 * 150)],
            ['INV-2026-002', 'Kroma Creative Agency', 'Software', 125000.00, 'paid', date('Y-m-d', time() - 86400 * 115), date('Y-m-d H:i:s', time() - 86400 * 114), date('Y-m-d H:i:s', time() - 86400 * 115)],
            ['INV-2026-003', 'Solace Financial', 'AI + Automation', 180000.00, 'paid', date('Y-m-d', time() - 86400 * 85), date('Y-m-d H:i:s', time() - 86400 * 84), date('Y-m-d H:i:s', time() - 86400 * 85)],
            ['INV-2026-004', 'Veloce Luxury Group', 'UI/UX', 95000.00, 'paid', date('Y-m-d', time() - 86400 * 60), date('Y-m-d H:i:s', time() - 86400 * 59), date('Y-m-d H:i:s', time() - 86400 * 60)],
            ['INV-2026-005', 'Nexus Retail Co', 'Website', 110000.00, 'paid', date('Y-m-d', time() - 86400 * 38), date('Y-m-d H:i:s', time() - 86400 * 37), date('Y-m-d H:i:s', time() - 86400 * 38)],
            ['INV-2026-006', 'TechNova Studios', 'Other', 45000.00, 'paid', date('Y-m-d', time() - 86400 * 25), date('Y-m-d H:i:s', time() - 86400 * 24), date('Y-m-d H:i:s', time() - 86400 * 25)],
            ['INV-2026-007', 'Apex Global Logistics', 'Software', 145000.00, 'paid', date('Y-m-d', time() - 86400 * 18), date('Y-m-d H:i:s', time() - 86400 * 17), date('Y-m-d H:i:s', time() - 86400 * 18)],
            ['INV-2026-008', 'Solace Financial', 'AI + Automation', 75000.00, 'paid', date('Y-m-d', time() - 86400 * 6), date('Y-m-d H:i:s', time() - 86400 * 5), date('Y-m-d H:i:s', time() - 86400 * 6)],
            ['INV-2026-009', 'Aether Dynamics', 'Software', 160000.00, 'paid', date('Y-m-d', time() - 86400 * 4), date('Y-m-d H:i:s', time() - 86400 * 3), date('Y-m-d H:i:s', time() - 86400 * 4)],
            ['INV-2026-010', 'Kroma Creative Agency', 'UI/UX', 65000.00, 'paid', date('Y-m-d', time() - 86400 * 1), date('Y-m-d H:i:s', time() - 3600 * 12), date('Y-m-d H:i:s', time() - 86400 * 1)],
            ['INV-2026-011', 'Veloce Luxury Group', 'AI + Automation', 120000.00, 'pending', date('Y-m-d', time() + 86400 * 8), null, date('Y-m-d H:i:s', time() - 86400 * 2)],
            ['INV-2026-012', 'Nexus Retail Co', 'Website', 90000.00, 'pending', date('Y-m-d', time() + 86400 * 14), null, date('Y-m-d H:i:s', time() - 86400 * 1)]
        ];
        $invStmt = $pdo->prepare("INSERT INTO invoices (invoice_number, client_name, service, amount, status, due_date, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($sampleInvoices as $inv) {
            $invStmt->execute($inv);
        }

        // 5. Sample Revenue
        $sampleRevenues = [
            ['Apex Global Logistics', 'Website', 85000.00, 'Bank Transfer', 'Paid', date('Y-m-d H:i:s', time() - 86400 * 148), 'Corporate portal milestone 1'],
            ['Kroma Creative Agency', 'Software', 125000.00, 'Card', 'Paid', date('Y-m-d H:i:s', time() - 86400 * 114), 'Design studio engine deployment'],
            ['Solace Financial', 'AI + Automation', 180000.00, 'UPI', 'Paid', date('Y-m-d H:i:s', time() - 86400 * 84), 'Webhook reconciliation pipeline'],
            ['Veloce Luxury Group', 'UI/UX', 95000.00, 'Bank Transfer', 'Paid', date('Y-m-d H:i:s', time() - 86400 * 59), 'E-commerce UI/UX sprint'],
            ['Nexus Retail Co', 'Website', 110000.00, 'Bank Transfer', 'Paid', date('Y-m-d H:i:s', time() - 86400 * 37), 'Retail portal launch'],
            ['TechNova Studios', 'Other', 45000.00, 'UPI', 'Paid', date('Y-m-d H:i:s', time() - 86400 * 24), 'WordPress migration'],
            ['Apex Global Logistics', 'Software', 145000.00, 'Bank Transfer', 'Paid', date('Y-m-d H:i:s', time() - 86400 * 17), 'Fleet sync connector'],
            ['Solace Financial', 'AI + Automation', 75000.00, 'UPI', 'Paid', date('Y-m-d H:i:s', time() - 86400 * 5), 'Custom AI agent retainers'],
            ['Aether Dynamics', 'Software', 160000.00, 'Bank Transfer', 'Paid', date('Y-m-d H:i:s', time() - 86400 * 3), 'ERP integration contract'],
            ['Kroma Creative Agency', 'UI/UX', 65000.00, 'Card', 'Paid', date('Y-m-d H:i:s', time() - 3600 * 12), 'Brand guidelines sprint'],
            ['Veloce Luxury Group', 'AI + Automation', 120000.00, 'Bank Transfer', 'Pending', date('Y-m-d H:i:s', time() - 86400 * 2), 'Awaiting settlement invoice INV-2026-011'],
            ['Nexus Retail Co', 'Website', 90000.00, 'Bank Transfer', 'Pending', date('Y-m-d H:i:s', time() - 86400 * 1), 'Milestone 2 deliverable invoice INV-2026-012']
        ];
        $revStmt = $pdo->prepare("
            INSERT INTO revenue (client_id, lead_id, invoice_id, amount, payment_type, payment_status, payment_date, service, notes, created_at, updated_at)
            VALUES (
                (SELECT id FROM clients WHERE company_name = ? OR client_name = ? LIMIT 1),
                NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?
            )
        ");
        foreach ($sampleRevenues as $r) {
            $revStmt->execute([$r[0], $r[0], $r[2], $r[3], $r[4], $r[5], $r[1], $r[6], $r[5], $now]);
        }

        // Link sample calls to leads
        try {
            $pdo->exec("
                UPDATE calls 
                SET lead_id = (SELECT id FROM leads WHERE leads.name = calls.contact_name LIMIT 1)
                WHERE lead_id IS NULL;
            ");
        } catch (\Throwable) {}

        // Mark CRM as seeded permanently
        $pdo->exec("INSERT OR REPLACE INTO _db_meta (key, val) VALUES ('crm_seeded', '1')");
    }

    return $pdo;
}
