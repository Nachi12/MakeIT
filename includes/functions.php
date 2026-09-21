<?php
/**
 * MakeIT - General Utility & Helper Functions
 * 
 * Provides flash messaging, redirection, JSON responses,
 * site settings helpers, slug generation, and formatting.
 */

declare(strict_types=1);

if (!defined('MAKEIT_INIT')) {
    die('Direct access not permitted.');
}

/**
 * Redirect safely to another URL
 *
 * @param string $url
 * @param int $statusCode
 */
function redirect(string $url, int $statusCode = 302): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_write_close();
    }
    header('Location: ' . $url, true, $statusCode);
    exit;
}

/**
 * Set a session flash message
 *
 * @param string $type 'success' | 'error' | 'warning' | 'info'
 * @param string $message
 */
function set_flash(string $type, string $message): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        return;
    }
    $_SESSION['flash_messages'][$type][] = $message;
}

/**
 * Get and flush flash messages
 *
 * @param string|null $type
 * @return array<int, string>
 */
function get_flash(?string $type = null): array
{
    if (session_status() !== PHP_SESSION_ACTIVE || empty($_SESSION['flash_messages'])) {
        return [];
    }

    if ($type !== null) {
        $messages = $_SESSION['flash_messages'][$type] ?? [];
        unset($_SESSION['flash_messages'][$type]);
        return $messages;
    }

    $all = $_SESSION['flash_messages'];
    $_SESSION['flash_messages'] = [];
    return $all;
}

/**
 * Check if flash messages exist
 *
 * @param string|null $type
 * @return bool
 */
function has_flash(?string $type = null): bool
{
    if (session_status() !== PHP_SESSION_ACTIVE || empty($_SESSION['flash_messages'])) {
        return false;
    }
    return $type !== null ? !empty($_SESSION['flash_messages'][$type]) : true;
}

/**
 * Send a standardized JSON response
 *
 * @param array<string, mixed> $data
 * @param int $statusCode
 */
function json_response(array $data, int $statusCode = 200): void
{
    if (!headers_sent()) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-cache, no-store, must-revalidate');
    }
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Fetch a single site setting from cache or DB
 *
 * @param string $key
 * @param mixed $default
 * @return mixed
 */
function get_setting(string $key, mixed $default = null): mixed
{
    $settings = get_all_settings();
    return $settings[$key] ?? $default;
}

/**
 * Fetch all site settings as a key => value array
 *
 * @return array<string, string|null>
 */
/**
 * Fetch all site settings as a key => value array with fallback defaults
 *
 * @return array<string, string|null>
 */
/**
 * Fetch all site settings as a key => value array with request-level memoization
 *
 * @return array<string, string|null>
 */
function get_all_settings(bool $refresh = false): array
{
    static $cachedSettings = null;
    if ($refresh) {
        $cachedSettings = null;
    }
    if ($cachedSettings !== null) {
        return $cachedSettings;
    }

    $defaults = [
        'company_name'       => 'MakeIT',
        'tagline'            => 'We Make Digital Things Work.',
        'email'              => 'hello@makeit.digital',
        'phone'              => '9035344513',
        'address'            => 'Bangalore-560010, karnataka. India',
        'linkedin'           => 'https://linkedin.com/company/makeit',
        'instagram'          => 'https://instagram.com/makeit.digital',
        'facebook'           => 'https://facebook.com/makeitdigital',
        'github'             => 'https://github.com/makeit',
        'twitter'            => 'https://x.com/makeitdigital',
        'logo'               => '/assets/images/logo.svg',
        'favicon'            => '/assets/images/favicon.svg',
        'meta_title'         => 'MakeIT — We Make Digital Things Work',
        'meta_description'   => 'MakeIT designs and builds websites, software, AI automation and digital experiences that actually work.',
        'primary_color'      => '#b8ff3d',
        'announcement_text'  => 'Now booking client projects for Q3/Q4'
    ];

    try {
        $db = Database::getInstance();
        if ($db->isConnected()) {
            $rows = $db->fetchAll("SELECT setting_key, setting_value FROM site_settings");
            if (!empty($rows)) {
                $settings = [];
                foreach ($rows as $row) {
                    $settings[$row['setting_key']] = $row['setting_value'];
                }
                $cachedSettings = array_merge($defaults, $settings);
                return $cachedSettings;
            }
        }
    } catch (\Throwable $e) {
        error_log("get_all_settings notice: " . $e->getMessage());
    }

    $cachedSettings = $defaults;
    return $cachedSettings;
}

/**
 * Update or insert a site setting
 *
 * @param string $key
 * @param string $value
 * @param string $group
 * @return bool
 */
function update_setting(string $key, string $value, string $group = 'general'): bool
{
    try {
        $db = Database::getInstance();
        if (!$db->isConnected()) {
            return false;
        }
        $now = date('Y-m-d H:i:s');
        $existing = $db->fetch("SELECT id FROM site_settings WHERE setting_key = :k", [':k' => $key]);
        if ($existing) {
            $db->update('site_settings', [
                'setting_value' => $value,
                'updated_at'    => $now
            ], 'setting_key = :k', [':k' => $key]);
        } else {
            $db->insert('site_settings', [
                'setting_key'   => $key,
                'setting_value' => $value,
                'setting_group' => $group,
                'created_at'    => $now,
                'updated_at'    => $now
            ]);
        }
        get_all_settings(true);
        return true;
    } catch (\Throwable $e) {
        error_log("update_setting error: " . $e->getMessage());
        return false;
    }
}

/**
 * Fetch Hero content row with request-level memoization
 *
 * @return array<string, mixed>
 */
function get_hero_content(): array
{
    static $cachedHero = null;
    if ($cachedHero !== null) {
        return $cachedHero;
    }

    $defaults = [
        'badge_text'            => 'Digital studio / 2026',
        'headline'              => "WE MAKE\nDIGITAL\nTHINGS WORK.",
        'subheadline'           => 'We turn ideas into websites, software and digital experiences that actually work.',
        'description'           => 'From the first sketch to the final launch, MakeIT designs and builds digital products around the way your business actually works.',
        'primary_button_text'   => 'Start a Project',
        'primary_button_link'   => '#contact',
        'secondary_button_text' => 'Explore Services',
        'secondary_button_link' => '#services',
        'stats_json'            => '[{"label":"Client Satisfaction","value":"99.4%"},{"label":"Projects Shipped","value":"150+"},{"label":"Avg Performance","value":"98/100"},{"label":"System Reliability","value":"99.9%"}]'
    ];

    try {
        $db = Database::getInstance();
        if ($db->isConnected()) {
            $hero = $db->fetch("SELECT * FROM hero_content ORDER BY id ASC LIMIT 1");
            if (!empty($hero)) {
                $cachedHero = array_merge($defaults, $hero);
                return $cachedHero;
            }
        }
    } catch (\Throwable $e) {
        error_log("get_hero_content notice: " . $e->getMessage());
    }

    $cachedHero = $defaults;
    return $cachedHero;
}

/**
 * Fetch published services with request-level memoization
 *
 * Returns live DB array if DB is connected (even if empty, for graceful empty state),
 * or defaults if DB is completely offline.
 *
 * @return array<int, array<string, mixed>>
 */
function get_services(): array
{
    static $cachedServices = null;
    if ($cachedServices !== null) {
        return $cachedServices;
    }

    $defaults = [
        [
            'id' => 1,
            'title' => 'Websites',
            'slug' => 'websites',
            'short_description' => 'High-performing websites and landing pages designed to make your business stand out.',
            'long_description' => 'We construct scalable web platforms with clean, semantic markup, bespoke styling, and resilient server-side architecture.',
            'icon' => 'code',
            'display_order' => 1,
            'status' => 'published'
        ],
        [
            'id' => 2,
            'title' => 'Software',
            'slug' => 'software',
            'short_description' => 'Custom dashboards, SaaS products and business applications built around your workflow.',
            'long_description' => 'Custom dashboards, ERPs, CRM connectors, and automated data pipelines designed specifically around your operational needs.',
            'icon' => 'cpu',
            'display_order' => 2,
            'status' => 'published'
        ],
        [
            'id' => 3,
            'title' => 'AI + Automation',
            'slug' => 'ai-automation',
            'short_description' => 'Smarter workflows, AI assistants and automation that save your team time.',
            'long_description' => 'Eliminate manual data entry and disjointed workflows with real-time AI and webhook integrations.',
            'icon' => 'zap',
            'display_order' => 3,
            'status' => 'published'
        ]
    ];

    try {
        $db = Database::getInstance();
        if ($db->isConnected()) {
            $rows = $db->fetchAll("SELECT * FROM services WHERE status = 'published' ORDER BY display_order ASC, id ASC");
            $cachedServices = $rows;
            return $cachedServices;
        }
    } catch (\Throwable $e) {
        error_log("get_services notice: " . $e->getMessage());
    }

    $cachedServices = $defaults;
    return $cachedServices;
}

/**
 * Fetch published projects with optional category filter and request-level memoization
 *
 * @param string|null $category
 * @param int|null $limit
 * @return array<int, array<string, mixed>>
 */
function get_projects(?string $category = null, ?int $limit = null): array
{
    static $cachedProjects = [];
    $cacheKey = ($category ?? 'all') . '_' . ($limit ?? 'all');
    if (isset($cachedProjects[$cacheKey])) {
        return $cachedProjects[$cacheKey];
    }

    $defaults = [
        [
            'id' => 1,
            'title' => 'Apex Logistics Portal',
            'slug' => 'apex-logistics-portal',
            'category' => 'Website',
            'client_name' => 'Apex Global Freight',
            'description' => 'A real-time dispatch and fleet management dashboard handling thousands of daily freight consignments with sub-second response times.',
            'image' => '/assets/images/projects/apex-portal.webp',
            'project_url' => 'https://example.com/apex',
            'tags' => 'PHP 8, MySQL, Custom Dashboard, Vanilla JS',
            'display_order' => 1,
            'is_featured' => 1,
            'status' => 'published'
        ],
        [
            'id' => 2,
            'title' => 'Kroma Design Studio',
            'slug' => 'kroma-design-studio',
            'category' => 'Software',
            'client_name' => 'Kroma Creative',
            'description' => 'An immersive, award-winning agency portfolio showcasing typography excellence, dynamic dark-mode interactions, and smooth transitions.',
            'image' => '/assets/images/projects/kroma-studio.webp',
            'project_url' => 'https://example.com/kroma',
            'tags' => 'Vanilla CSS, Animation, Semantic HTML5',
            'display_order' => 2,
            'is_featured' => 1,
            'status' => 'published'
        ],
        [
            'id' => 3,
            'title' => 'Veloce E-Commerce Engine',
            'slug' => 'veloce-ecommerce-engine',
            'category' => 'AI + Automation',
            'client_name' => 'Veloce Luxury Wear',
            'description' => 'Custom lightweight e-commerce storefront with instantaneous product filtering, zero framework bloat, and frictionless checkout.',
            'image' => '/assets/images/projects/veloce-engine.webp',
            'project_url' => 'https://example.com/veloce',
            'tags' => 'Custom Cart, Payment APIs, SEO Optimized',
            'display_order' => 3,
            'is_featured' => 1,
            'status' => 'published'
        ],
        [
            'id' => 4,
            'title' => 'OmniFlow Workflow Automation',
            'slug' => 'omniflow-workflow-automation',
            'category' => 'Digital System',
            'client_name' => 'OmniFlow Tech',
            'description' => 'Internal operational engine synchronizing CRM data, automated invoicing, and multi-tier employee approval pipelines.',
            'image' => '/assets/images/projects/omniflow.webp',
            'project_url' => 'https://example.com/omniflow',
            'tags' => 'REST APIs, Background Workers, Role Security',
            'display_order' => 4,
            'is_featured' => 0,
            'status' => 'published'
        ]
    ];

    try {
        $db = Database::getInstance();
        if ($db->isConnected()) {
            $sql = "SELECT * FROM projects WHERE status = 'published'";
            $params = [];
            if (!empty($category)) {
                $sql .= " AND category = :cat";
                $params[':cat'] = $category;
            }
            $sql .= " ORDER BY display_order ASC, id DESC";
            if ($limit !== null && $limit > 0) {
                $sql .= " LIMIT " . (int)$limit;
            }

            $rows = $db->fetchAll($sql, $params);
            $cachedProjects[$cacheKey] = $rows;
            return $cachedProjects[$cacheKey];
        }
    } catch (\Throwable $e) {
        error_log("get_projects notice: " . $e->getMessage());
    }

    $cachedProjects[$cacheKey] = $defaults;
    return $cachedProjects[$cacheKey];
}

/**
 * Fetch published process steps with request-level memoization
 *
 * @return array<int, array<string, mixed>>
 */
function get_process_steps(): array
{
    static $cachedSteps = null;
    if ($cachedSteps !== null) {
        return $cachedSteps;
    }

    $defaults = [
        [
            'id' => 1,
            'step_number' => '01',
            'title' => 'Tell us.',
            'description' => "Tell us what you're trying to build, fix or improve.",
            'display_order' => 1,
            'status' => 'published'
        ],
        [
            'id' => 2,
            'step_number' => '02',
            'title' => 'We plan.',
            'description' => 'We define the experience, technology and scope.',
            'display_order' => 2,
            'status' => 'published'
        ],
        [
            'id' => 3,
            'step_number' => '03',
            'title' => 'We build.',
            'description' => 'Design, development and testing happen together.',
            'display_order' => 3,
            'status' => 'published'
        ],
        [
            'id' => 4,
            'step_number' => '04',
            'title' => 'You launch.',
            'description' => 'Your product goes live and starts doing its job.',
            'display_order' => 4,
            'status' => 'published'
        ]
    ];

    try {
        $db = Database::getInstance();
        if ($db->isConnected()) {
            $rows = $db->fetchAll("SELECT * FROM process_steps WHERE status = 'published' ORDER BY display_order ASC, id ASC");
            $cachedSteps = $rows;
            return $cachedSteps;
        }
    } catch (\Throwable $e) {
        error_log("get_process_steps notice: " . $e->getMessage());
    }

    $cachedSteps = $defaults;
    return $cachedSteps;
}

/**
 * Fetch published testimonials with request-level memoization
 *
 * @param int|null $limit
 * @return array<int, array<string, mixed>>
 */
function get_testimonials(?int $limit = null): array
{
    static $cachedTestimonials = [];
    $cacheKey = $limit ?? 'all';
    if (isset($cachedTestimonials[$cacheKey])) {
        return $cachedTestimonials[$cacheKey];
    }

    $defaults = [
        [
            'id' => 1,
            'client_name' => 'Marcus Vance',
            'company' => 'Apex Global Logistics',
            'position' => 'Chief Technology Officer',
            'content' => 'MakeIT transformed our dispatch platform from a sluggish legacy headache into a blisteringly fast powerhouse. The speed and clarity of their engineering is unparalleled.',
            'rating' => 5,
            'image' => '/assets/images/testimonials/marcus.webp',
            'display_order' => 1,
            'status' => 'published'
        ],
        [
            'id' => 2,
            'client_name' => 'Elena Rostova',
            'company' => 'Kroma Creative Agency',
            'position' => 'Founder & Creative Director',
            'content' => 'Working with MakeIT was seamless. They understood both the delicate aesthetic nuances of our brand and the strict architectural requirements under the hood.',
            'rating' => 5,
            'image' => '/assets/images/testimonials/elena.webp',
            'display_order' => 2,
            'status' => 'published'
        ],
        [
            'id' => 3,
            'client_name' => 'Julian Bennett',
            'company' => 'Veloce Luxury Group',
            'position' => 'Managing Director',
            'content' => 'Our online store conversion jumped by 34% within the first month after MakeIT rebuilt our checkout flow. Zero framework bloat, lightning speed, and total reliability.',
            'rating' => 5,
            'image' => '/assets/images/testimonials/julian.webp',
            'display_order' => 3,
            'status' => 'published'
        ]
    ];

    try {
        $db = Database::getInstance();
        if ($db->isConnected()) {
            $sql = "SELECT * FROM testimonials WHERE status = 'published' ORDER BY display_order ASC, id DESC";
            if ($limit !== null && $limit > 0) {
                $sql .= " LIMIT " . (int)$limit;
            }
            $rows = $db->fetchAll($sql);
            $cachedTestimonials[$cacheKey] = $rows;
            return $cachedTestimonials[$cacheKey];
        }
    } catch (\Throwable $e) {
        error_log("get_testimonials notice: " . $e->getMessage());
    }

    $cachedTestimonials[$cacheKey] = $defaults;
    return $cachedTestimonials[$cacheKey];
}

/**
 * Reusable CamelCase Aliases (for clean API conformity)
 */
function getHero(): array { return get_hero_content(); }
function getServices(): array { return get_services(); }
function getProjects(?string $category = null, ?int $limit = null): array { return get_projects($category, $limit); }
function getProcessSteps(): array { return get_process_steps(); }
function getTestimonials(?int $limit = null): array { return get_testimonials($limit); }
function getSiteSettings(): array { return get_all_settings(); }

/**
 * Image Fallback Helper
 *
 * Verifies if an image exists on the filesystem. If missing or null, returns a safe,
 * visually designed SVG placeholder or fallback URL so broken images never render.
 *
 * @param string|null $path Relative path e.g. '/uploads/projects/xyz.webp'
 * @param string $type 'project' | 'avatar' | 'logo' | 'favicon'
 * @return string
 */
function get_image_url(?string $path, string $type = 'project'): string
{
    if (!empty($path)) {
        $clean = ltrim($path, '/\\');
        $fullPath = ROOT_PATH . '/' . $clean;
        if (file_exists($fullPath) && is_file($fullPath)) {
            return BASE_URL . '/' . $clean;
        }
        // If it starts with http, return as-is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
    }

    // High quality visual SVG placeholders (inline Data URIs) to ensure zero broken image icons
    if ($type === 'avatar') {
        return 'data:image/svg+xml;utf8,' . rawurlencode('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#181922"/><circle cx="50" cy="40" r="20" fill="#9699A8"/><path d="M20,85 C20,68 35,65 50,65 C65,65 80,68 80,85 Z" fill="#9699A8"/></svg>');
    }

    if ($type === 'logo') {
        return ASSETS_URL . '/images/logo.svg';
    }

    if ($type === 'favicon') {
        return ASSETS_URL . '/images/favicon.svg';
    }

    // Default Project visual placeholder
    return 'data:image/svg+xml;utf8,' . rawurlencode('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="#12131A"/><rect x="40" y="40" width="720" height="420" rx="12" fill="#1A1B24" stroke="#2B2D3C" stroke-width="2"/><circle cx="80" cy="75" r="7" fill="#FF5F56"/><circle cx="105" cy="75" r="7" fill="#FFBD2E"/><circle cx="130" cy="75" r="7" fill="#27C93F"/><rect x="80" y="130" width="140" height="24" rx="4" fill="#B8FF3D" opacity="0.9"/><rect x="80" y="175" width="480" height="40" rx="6" fill="#FFFFFF" opacity="0.9"/><rect x="80" y="240" width="640" height="12" rx="4" fill="#525668"/><rect x="80" y="265" width="540" height="12" rx="4" fill="#525668"/><rect x="80" y="320" width="180" height="44" rx="8" fill="#B8FF3D"/></svg>');
}

/**
 * Get core company principles
 *
 * @return array<int, array{number: string, title: string, description: string}>
 */
function get_principles(): array
{
    return [
        [
            'number'      => '01 / COMMUNICATION',
            'title'       => 'Clear communication.',
            'description' => "No disappearing acts. You always know what's happening, what's next and why."
        ],
        [
            'number'      => '02 / DESIGN',
            'title'       => 'Design first.',
            'description' => 'We solve the experience before jumping into the code.'
        ],
        [
            'number'      => '03 / TECHNOLOGY',
            'title'       => 'Built to scale.',
            'description' => 'Clean architecture and practical technology that can grow with your business.'
        ],
        [
            'number'      => '04 / AI',
            'title'       => 'AI where it helps.',
            'description' => "We use AI when it creates real value — not just because it's trending."
        ]
    ];
}

/**
 * Process and save incoming lead inquiry with validation, CSRF, and honeypot checks
 *
 * @param array<string, mixed> $input
 * @return array{success: bool, error: ?string, message: string}
 */
function process_lead_inquiry(array $input): array
{
    // 1. Prevent unexpected file uploads on contact endpoint
    if (!empty($_FILES)) {
        // Discard any unexpected file uploads
        foreach ($_FILES as $fileKey => $fileArr) {
            if (isset($fileArr['tmp_name']) && is_uploaded_file($fileArr['tmp_name'])) {
                @unlink($fileArr['tmp_name']);
            }
        }
    }

    // 2. Honeypot anti-spam verification: website_url field must be blank
    if (!empty($input['website_url'])) {
        // Silently accept bots without saving to database or notifying
        return [
            'success' => true,
            'error'   => null,
            'message' => "Thanks! Your enquiry has been received. We'll get back to you shortly."
        ];
    }

    // 3. CSRF Token verification
    $csrfToken = $input['csrf_token'] ?? null;
    if (!verify_csrf($csrfToken)) {
        return [
            'success' => false,
            'error'   => 'Security session token expired. Please refresh the page and try again.',
            'message' => ''
        ];
    }

    // 4. Sanitize and trim inputs
    $name     = sanitize_text($input['name'] ?? '');
    $email    = sanitize_email($input['email'] ?? '');
    $phone    = sanitize_text($input['phone'] ?? '');
    $company  = sanitize_text($input['company'] ?? '');
    $service  = sanitize_text($input['service'] ?? 'General Inquiry');
    $budget   = sanitize_text($input['budget'] ?? '');
    $message  = sanitize_text($input['message'] ?? '');

    // 5. Duplicate Protection & Rapid Flood Prevention:
    // Do not blindly reject repeat enquiries from the same email (returning customer may submit multiple enquiries).
    // Only intercept clear duplicate submissions (same email & message) within a rapid 60-second window.
    $nowTime = time();
    $ipAddress = get_client_ip();
    $db = Database::getInstance();

    if (!empty($email) && $db->isConnected()) {
        try {
            $cutoffRapid = date('Y-m-d H:i:s', $nowTime - 60);
            $duplicateCount = (int)$db->fetchColumn(
                "SELECT COUNT(*) FROM leads WHERE LOWER(email) = :email AND message = :msg AND created_at >= :cutoff",
                [':email' => strtolower((string)$email), ':msg' => $message, ':cutoff' => $cutoffRapid]
            );
            if ($duplicateCount > 0) {
                // Return success to visitor without creating duplicate DB entry
                return [
                    'success' => true,
                    'error'   => null,
                    'message' => "Thanks! Your enquiry has been received. We'll get back to you shortly."
                ];
            }
        } catch (\Throwable $e) {
            error_log("Duplicate protection check notice: " . $e->getMessage());
        }
    }

    // 6. Strict Server-Side Validation & Input Length Limits
    // Name: required, 2 - 100 characters
    if (empty($name) || mb_strlen($name) < 2) {
        return ['success' => false, 'error' => 'Please provide your full name (minimum 2 characters).', 'message' => ''];
    }
    if (mb_strlen($name) > 100) {
        return ['success' => false, 'error' => 'Name cannot exceed 100 characters.', 'message' => ''];
    }

    // Email: required, RFC compliant, prevent header injection (no newlines)
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'error' => 'Please provide a valid email address.', 'message' => ''];
    }
    if (str_contains($email, "\r") || str_contains($email, "\n")) {
        return ['success' => false, 'error' => 'Invalid email format.', 'message' => ''];
    }
    if (mb_strlen($email) > 150) {
        return ['success' => false, 'error' => 'Email address cannot exceed 150 characters.', 'message' => ''];
    }

    // Phone: optional, max 50 characters, numeric/formatting symbols only
    if (!empty($phone)) {
        if (mb_strlen($phone) > 50) {
            return ['success' => false, 'error' => 'Phone number cannot exceed 50 characters.', 'message' => ''];
        }
        if (!preg_match('/^[0-9+\-\s().]{0,50}$/', $phone)) {
            return ['success' => false, 'error' => 'Please provide a valid phone number format.', 'message' => ''];
        }
    }

    // Company: optional, max 100 characters
    if (!empty($company) && mb_strlen($company) > 100) {
        return ['success' => false, 'error' => 'Company name cannot exceed 100 characters.', 'message' => ''];
    }

    // Service: max 100 characters
    if (mb_strlen($service) > 100) {
        $service = mb_substr($service, 0, 100);
    }

    // Budget: max 50 characters
    if (!empty($budget) && mb_strlen($budget) > 50) {
        $budget = mb_substr($budget, 0, 50);
    }

    // Message: required, min 5 characters, max 5000 characters
    if (empty($message) || mb_strlen($message) < 5) {
        return ['success' => false, 'error' => 'Please describe your project or inquiry (minimum 5 characters).', 'message' => ''];
    }
    if (mb_strlen($message) > 5000) {
        return ['success' => false, 'error' => 'Project details message cannot exceed 5,000 characters.', 'message' => ''];
    }

    // 7. Store inside `leads` table using PDO prepared statements
    $currentDateTime = date('Y-m-d H:i:s');
    $leadRecord = [
        'name'               => $name,
        'email'              => $email,
        'phone'              => !empty($phone) ? $phone : null,
        'company'            => !empty($company) ? $company : null,
        'service'            => $service,
        'service_interested' => $service,
        'budget'             => !empty($budget) ? $budget : null,
        'message'            => $message,
        'source'             => 'Website',
        'status'             => 'New',
        'call_status'        => 'Not Called',
        'last_called_at'     => null,
        'next_followup_at'   => null,
        'ip_address'         => $ipAddress,
        'user_agent'         => mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
        'created_at'         => $currentDateTime,
        'updated_at'         => $currentDateTime
    ];

    try {
        if ($db->isConnected()) {
            $newLeadId = $db->insert('leads', $leadRecord);
            $leadRecord['id'] = $newLeadId;
        } else {
            // If DB is temporarily offline, safely record to error log so inquiry is not lost
            error_log(sprintf(
                "[MakeIT Lead (Offline DB)] Name: %s | Email: %s | Company: %s | Service: %s | Msg: %s",
                $name, $email, $company, $service, $message
            ));
        }

        // 8. Dispatch Email Notification safely
        if (function_exists('send_lead_notification')) {
            try {
                send_lead_notification($leadRecord);
            } catch (\Throwable $mailEx) {
                error_log("Lead email notification notice: " . $mailEx->getMessage());
            }
        }

        // Set last submission timestamp to prevent rapid double-clicks
        $_SESSION['last_lead_submit_time'] = $nowTime;

        return [
            'success' => true,
            'error'   => null,
            'message' => "Thanks! Your enquiry has been received. We'll get back to you shortly."
        ];
    } catch (\Throwable $e) {
        error_log("process_lead_inquiry error: " . $e->getMessage());
        return [
            'success' => false,
            'error'   => 'A temporary server error occurred. Please try again or reach out to us directly via email.',
            'message' => ''
        ];
    }
}

/**
 * Generate a clean URL-friendly slug
 *
 * @param string $text
 * @return string
 */
function slugify(string $text): string
{
    // Replace non letter or digits by hyphen
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    // Transliterate
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text) ?: $text;
    // Remove unwanted characters
    $text = preg_replace('~[^-\w]+~', '', $text);
    // Trim
    $text = trim($text, '-');
    // Remove duplicate hyphens
    $text = preg_replace('~-+~', '-', $text);
    // Lowercase
    $text = strtolower($text);

    return empty($text) ? 'item-' . time() : $text;
}

/**
 * Safely format timestamps
 *
 * @param string|null $date
 * @param string $format
 * @return string
 */
function format_date(?string $date, string $format = 'M j, Y'): string
{
    if (empty($date)) {
        return '—';
    }
    try {
        $dt = new DateTime($date);
        return $dt->format($format);
    } catch (\Exception) {
        return $date;
    }
}
