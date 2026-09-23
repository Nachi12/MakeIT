<?php
/**
 * MakeIT — Homepage & Public Experience
 * 
 * "We Make Digital Things Work."
 */

declare(strict_types=1);

define('MAKEIT_INIT', true);
require_once __DIR__ . '/includes/init.php';

// Retrieve dynamic CMS content
$settings     = get_all_settings();
$hero         = get_hero_content();
$services     = get_services();
$projects     = get_projects();
$processSteps = get_process_steps();
$principles   = get_principles();
$testimonials = get_testimonials();

// Handle direct non-AJAX fallback submission if JavaScript is disabled
$contactSuccess = get_flash('contact_success')[0] ?? null;
$contactError   = get_flash('contact_error')[0] ?? null;

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && isset($_POST['action']) && $_POST['action'] === 'contact') {
    $result = process_lead_inquiry($_POST);
    if ($result['success']) {
        $contactSuccess = $result['message'];
    } else {
        $contactError = $result['error'];
    }
}

$pageTitle = ($settings['company_name'] ?? 'MakeIT') . ' — ' . ($settings['tagline'] ?? 'We Make Digital Things Work.');
$activePage = 'home';

require_once __DIR__ . '/includes/header.php';
?>

  <main id="main-content">
    <!-- =======================================================
         HERO SECTION
    ======================================================== -->
    <section class="hero" id="home">
      <div class="hero-grid" aria-hidden="true"></div>

      <div class="container hero-content">
        <div class="hero-layout">
          <!-- LEFT ZONE: Editorial Anchor -->
          <div class="hero-left">
            <div class="hero-top">
              <div class="eyebrow">
                <?= e($hero['badge_text'] ?? 'Digital studio / 2026') ?>
              </div>
            </div>

            <h1 class="hero-heading">
              <?php 
                $rawHeadline = $hero['headline'] ?? "WE BUILD\nDIGITAL\nPRODUCTS\nTHAT SCALE.";
                if (strpos($rawHeadline, "\n") === false) {
                    if (trim($rawHeadline) === 'WE BUILD DIGITAL PRODUCTS THAT SCALE.') {
                        $headlineLines = [
                            'WE BUILD',
                            'DIGITAL',
                            'PRODUCTS',
                            'THAT SCALE.'
                        ];
                    } else {
                        $words = explode(' ', trim($rawHeadline));
                        if (count($words) >= 6) {
                            $headlineLines = [
                                implode(' ', array_slice($words, 0, 2)),
                                $words[2],
                                $words[3],
                                implode(' ', array_slice($words, 4))
                            ];
                        } elseif (count($words) >= 3) {
                            $chunk = (int)ceil(count($words) / 3);
                            $headlineLines = array_filter([
                                implode(' ', array_slice($words, 0, $chunk)),
                                implode(' ', array_slice($words, $chunk, $chunk)),
                                implode(' ', array_slice($words, $chunk * 2))
                            ]);
                        } else {
                            $headlineLines = [$rawHeadline];
                        }
                    }
                } else {
                    $headlineLines = explode("\n", trim($rawHeadline));
                }
                $totalLines = count($headlineLines);
                foreach ($headlineLines as $idx => $line):
                  $trimmed = trim($line);
                  if (empty($trimmed)) continue;
                  $isLast = ($idx === $totalLines - 1);
              ?>
                <div class="hero-line">
                  <span>
                    <?php if ($isLast): ?>
                      <?php 
                        $words = explode(' ', $trimmed);
                        if (count($words) > 1):
                          $lastWord = array_pop($words);
                          echo e(implode(' ', $words)) . ' <span class="hero-accent-word">' . e($lastWord) . '</span>';
                        else:
                          echo '<span class="hero-accent-word">' . e($trimmed) . '</span>';
                        endif;
                      ?>
                    <?php else: ?>
                      <?= e($trimmed) ?>
                    <?php endif; ?>
                  </span>
                </div>
              <?php endforeach; ?>
            </h1>

            <div class="hero-bottom">
              <p class="hero-description">
                <?= e($hero['description'] ?? 'From the first sketch to the final launch, MakeIT designs and builds digital products around the way your business actually works.') ?>
              </p>

              <div class="hero-buttons">
                <a href="<?= e($hero['primary_button_link'] ?? '#contact') ?>" class="button button-primary magnetic">
                  <?= e($hero['primary_button_text'] ?? 'Start a Project') ?>
                  <span class="button-arrow" aria-hidden="true">↗</span>
                </a>

                <a href="<?= e($hero['secondary_button_link'] ?? '#services') ?>" class="button button-secondary magnetic">
                  <?= e($hero['secondary_button_text'] ?? 'Explore Services') ?>
                  <span class="button-arrow" aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          </div>

          <!-- RIGHT ZONE: Floating Visual Counterweight -->
          <div class="hero-right">
            <div class="floating-system" id="floatingSystem" aria-hidden="true">
              <div class="float-card one">
                <div class="float-label">MAKEIT / WEBSITE</div>
                <div class="float-title">Design</div>
                <div class="float-progress">
                  <span></span>
                </div>
              </div>

              <div class="float-card two">
                <div class="float-label">AI / 02</div>
                <div class="float-title">Automate</div>
              </div>

              <div class="float-card three">
                <div class="float-label">PRODUCT / 03</div>
                <div class="float-title">Build ↗</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =======================================================
         MARQUEE TICKER
    ======================================================== -->
    <section class="marquee-section" aria-hidden="true">
      <div class="marquee">
        <div class="marquee-item">WEB DESIGN <span class="marquee-dot"></span></div>
        <div class="marquee-item">DEVELOPMENT <span class="marquee-dot"></span></div>
        <div class="marquee-item">AI AUTOMATION <span class="marquee-dot"></span></div>
        <div class="marquee-item">CUSTOM SOFTWARE <span class="marquee-dot"></span></div>
        <div class="marquee-item">UI / UX <span class="marquee-dot"></span></div>
        <div class="marquee-item">PERFORMANCE <span class="marquee-dot"></span></div>
        <!-- Loop duplication for seamless scroll -->
        <div class="marquee-item">WEB DESIGN <span class="marquee-dot"></span></div>
        <div class="marquee-item">DEVELOPMENT <span class="marquee-dot"></span></div>
        <div class="marquee-item">AI AUTOMATION <span class="marquee-dot"></span></div>
        <div class="marquee-item">CUSTOM SOFTWARE <span class="marquee-dot"></span></div>
        <div class="marquee-item">UI / UX <span class="marquee-dot"></span></div>
        <div class="marquee-item">PERFORMANCE <span class="marquee-dot"></span></div>
      </div>
    </section>

    <!-- =======================================================
         SERVICES SECTION
    ======================================================== -->
    <section class="services" id="services">
      <div class="container">
        <div class="services-heading reveal">
          <div>
            <div class="eyebrow">What we make</div>
            <h2 class="section-title" style="margin-top: 35px;">
              DIGITAL<br>
              <span class="outline">SOLUTIONS.</span>
            </h2>
          </div>

          <p class="services-description">
            Websites, website refinements and WhatsApp automation built around how your business actually works.
          </p>
        </div>

        <?php if (empty($services)): ?>
          <div class="empty-state-public">
            <div class="empty-state-icon">✦</div>
            <h3>Services Updating</h3>
            <p>We are currently updating our bespoke service capabilities. Please reach out directly to discuss your specific technical needs.</p>
            <a href="#contact" class="button button-primary magnetic">Inquire Directly ↗</a>
          </div>
        <?php else: ?>
          <div class="services-list">
            <?php foreach ($services as $index => $service): ?>
              <?php $serviceNum = str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT); ?>
              <a href="#contact" class="service reveal" aria-label="<?= e($service['title']) ?>">
                <div class="service-number">
                  <?= e($serviceNum) ?>
                </div>

                <div class="service-content">
                  <h3 class="service-title">
                    <?= e($service['title']) ?>
                  </h3>

                  <p class="service-text">
                    <?= e($service['short_description']) ?>
                  </p>
                </div>

                <div class="service-arrow" aria-hidden="true">
                  ↗
                </div>
              </a>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </section>

    <!-- =======================================================
         STATEMENT (DARK SECTION)
    ======================================================== -->
    <section class="statement" id="about">
      <div class="container">
        <div class="statement-top reveal">
          <div class="eyebrow statement-eyebrow">
            <span class="pulse-dot" aria-hidden="true"></span> OUR APPROACH
          </div>
        </div>

        <div class="statement-grid">
          <h2 class="statement-title">
            <div><span>YOUR BUSINESS</span></div>
            <div><span>SHOULDN'T</span></div>
            <div><span>STAY IN <strong class="lime">IDLE.</strong></span></div>
          </h2>

          <div class="statement-side">
            <p class="statement-copy">
              We take ideas from rough thought to real product. Strategy, UX, architecture, engineering, and deployment — handled as one connected, frictionless process.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =======================================================
         WORK (STICKY STACKED CARDS)
    ======================================================== -->
    <section class="work" id="work">
      <div class="container">
        <div class="work-header reveal">
          <div>
            <div class="eyebrow">Selected work</div>
            <h2 class="section-title" style="margin-top: 35px;">
              BUILT<br>
              <span class="outline">WITH MAKEIT.</span>
            </h2>
          </div>

          <p class="work-note">
            A selection of production-grade websites, custom software engines, and automated business platforms.
          </p>
        </div>

        <?php if (empty($projects)): ?>
          <div class="empty-state-public">
            <div class="empty-state-icon">✦</div>
            <h3>Portfolio Case Studies Updating</h3>
            <p>Our recent product launches and case studies are being prepared. Contact us to request private project briefs and architectural references.</p>
            <a href="#contact" class="button button-primary magnetic">Request Portfolio Deck ↗</a>
          </div>
        <?php else: ?>
          <div class="projects">
            <?php foreach ($projects as $index => $project): ?>
              <?php 
                $projNum = str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT); 
                $totalCount = str_pad((string)count($projects), 2, '0', STR_PAD_LEFT);
                $projectImg = get_image_url($project['image'] ?? $project['image_path'] ?? null, 'project');
                $hasCustomImage = !empty($project['image']) && file_exists(ROOT_PATH . '/' . ltrim($project['image'], '/\\'));
              ?>
              <article class="project" style="z-index: <?= (int)($index + 5) ?>;">
                <div class="project-top">
                  <div class="project-number">
                    <?= e($projNum) ?> / <?= e($totalCount) ?>
                  </div>

                  <div class="project-type">
                    <?= e($project['category']) ?>
                  </div>
                </div>

                <!-- Interactive Visual Showcase -->
                <div class="project-visual" aria-hidden="true">
                  <div class="browser">
                    <div class="browser-top">
                      <div class="browser-dot"></div>
                      <div class="browser-dot"></div>
                      <div class="browser-dot"></div>
                    </div>
                    <?php if ($hasCustomImage): ?>
                      <div class="browser-img-wrap">
                        <img src="<?= e($projectImg) ?>" alt="<?= e($project['title']) ?>" class="browser-project-img" loading="lazy">
                      </div>
                    <?php else: ?>
                      <div class="browser-content">
                        <div class="mock-label"><?= e(strtoupper($project['category'])) ?> / SYSTEM</div>
                        <div class="mock-heading"><?= e($project['title']) ?></div>
                        <div class="mock-bar"></div>
                        <div class="mock-button"></div>
                      </div>
                    <?php endif; ?>
                  </div>
                </div>

                <div class="project-bottom">
                  <div>
                    <h3 class="project-title">
                      <?= e($project['title']) ?>
                    </h3>
                    <p style="color: var(--muted); font-size: 14px; margin-top: 8px; max-width: 540px;">
                      <?= e($project['description']) ?>
                    </p>
                  </div>

                  <a href="<?= !empty($project['project_url']) ? e($project['project_url']) : '#contact' ?>" class="project-link magnetic" aria-label="Explore <?= e($project['title']) ?>" <?= !empty($project['project_url']) ? 'target="_blank" rel="noopener noreferrer"' : '' ?>>
                    ↗
                  </a>
                </div>
              </article>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </section>

    <!-- =======================================================
         WHY MAKEIT (PRINCIPLES)
    ======================================================== -->
    <section class="principles">
      <div class="container">
        <div class="principles-heading reveal">
          <div class="eyebrow">Why MakeIT</div>
          <h2 class="section-title" style="margin-top: 35px;">
            NO BIG WORDS.<br>
            <span class="outline">JUST GOOD WORK.</span>
          </h2>
        </div>

        <div class="principles-grid">
          <?php foreach ($principles as $principle): ?>
            <div class="principle reveal">
              <div class="principle-number">
                <?= e($principle['number']) ?>
              </div>
              <h3>
                <?= e($principle['title']) ?>
              </h3>
              <p>
                <?= e($principle['description']) ?>
              </p>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

    <!-- =======================================================
         PROCESS (WITH SCROLL PROGRESS LINE)
    ======================================================== -->
    <section class="process" id="process">
      <div class="container">
        <div class="process-header reveal">
          <div>
            <div class="eyebrow">How it works</div>
            <h2 class="section-title" style="margin-top: 35px;">
              FROM IDEA<br>
              <span class="outline">TO LIVE.</span>
            </h2>
          </div>

          <p class="process-copy">
            A transparent, agile workflow designed for speed, accountability, and zero fluff.
          </p>
        </div>

        <?php if (empty($processSteps)): ?>
          <div class="empty-state-public">
            <div class="empty-state-icon">✦</div>
            <h3>Custom Tailored Process</h3>
            <p>Every digital engagement is architected around your specific engineering milestones and delivery requirements.</p>
            <a href="#contact" class="button button-primary magnetic">Discuss Engagement ↗</a>
          </div>
        <?php else: ?>
          <div class="process-track">
            <div class="process-line" aria-hidden="true"></div>
            <div class="process-progress" id="processProgress" aria-hidden="true"></div>

            <?php foreach ($processSteps as $step): ?>
              <div class="process-step">
                <div class="process-dot">
                  <?= e($step['step_number']) ?>
                </div>
                <h3>
                  <?= e($step['title']) ?>
                </h3>
                <p>
                  <?= e($step['description']) ?>
                </p>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </section>

    <!-- =======================================================
         TESTIMONIALS SECTION (DATABASE-DRIVEN CMS)
    ======================================================== -->
    <section class="testimonials" id="testimonials">
      <div class="container">
        <div class="testimonials-header reveal">
          <div>
            <div class="eyebrow">Client Feedback</div>
            <h2 class="section-title" style="margin-top: 35px;">
              WHAT FOUNDERS<br>
              <span class="outline">SAY ABOUT US.</span>
            </h2>
          </div>

          <p style="color: var(--muted); max-width: 440px; font-size: 15px; line-height: 1.6;">
            Direct testimonials from founders, CTOs, and product leaders who rely on MakeIT systems.
          </p>
        </div>

        <?php if (empty($testimonials)): ?>
          <div class="empty-state-public">
            <div class="empty-state-icon">✦</div>
            <h3>Testimonials Being Verified</h3>
            <p>We are collecting our latest client reviews and case outcome reports. Reach out to speak directly with our references.</p>
            <a href="#contact" class="button button-primary magnetic">Request References ↗</a>
          </div>
        <?php else: ?>
          <div class="testimonials-grid">
            <?php foreach ($testimonials as $t): ?>
              <div class="testimonial-card reveal">
                <div>
                  <div class="testimonial-rating" aria-label="Rating: <?= (int)($t['rating'] ?? 5) ?> of 5 stars">
                    <?= str_repeat('★', max(1, min(5, (int)($t['rating'] ?? 5)))) ?>
                  </div>
                  <p class="testimonial-quote">
                    <?= e($t['content']) ?>
                  </p>
                </div>

                <div class="testimonial-meta">
                  <img src="<?= e(get_image_url($t['image'] ?? null, 'avatar')) ?>" alt="<?= e($t['client_name']) ?>" class="testimonial-avatar" loading="lazy" />
                  <div>
                    <div class="testimonial-author-name"><?= e($t['client_name']) ?></div>
                    <div class="testimonial-author-sub">
                      <?= e($t['position'] ?? '') ?><?= (!empty($t['position']) && !empty($t['company'])) ? ', ' : '' ?><?= e($t['company'] ?? '') ?>
                    </div>
                  </div>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </section>

    <!-- =======================================================
         AUDIENCE
    ======================================================== -->
    <section class="audience">
      <div class="container reveal">
        <div class="eyebrow">Built for</div>
        <div class="audience-text">
          <span>Startups</span>
          <span>Founders</span>
          <span>Small Businesses</span>
          <span>Product Teams</span>
          <span>Creators</span>
          <span>Growing Companies</span>
        </div>
      </div>
    </section>

    <!-- =======================================================
         CTA & COMPLETE CONTACT FORM
    ======================================================== -->
    <section class="cta" id="contact">
      <div class="container cta-grid">
        <div class="cta-inner reveal">
          <div class="cta-eyebrow">GOT AN IDEA?</div>
          <h2 class="cta-title">
            LET'S<br>
            MAKE IT.
          </h2>

          <p class="cta-subtitle">
            Tell us about your next project, challenge, or digital vision. We'll examine the technical architecture and provide actionable recommendations.
          </p>

          <div class="cta-contact-info">
            <?php if (!empty($settings['email'])): ?>
              <a href="mailto:<?= e($settings['email']) ?>">
                <span>Email:</span> <?= e($settings['email']) ?> ↗
              </a>
            <?php endif; ?>
            <?php if (!empty($settings['phone'])): ?>
              <a href="tel:<?= e(preg_replace('/[^0-9+]/', '', $settings['phone'])) ?>">
                <span>Call:</span> <?= e($settings['phone']) ?> ↗
              </a>
            <?php else: ?>
              <a href="tel:9035344513">
                <span>Call:</span> 9035344513 ↗
              </a>
            <?php endif; ?>
            <span>Location: <?= e($settings['address'] ?? 'Bangalore-560010, karnataka. India') ?></span>
          </div>
        </div>

        <!-- Interactive 5-Step Project Questionnaire Container -->
        <div class="questionnaire-card reveal">
          <div class="questionnaire-wrapper" id="projectQuestionnaire">
            <!-- Progress Header -->
            <div class="qn-header">
              <div class="qn-header-top">
                <div class="qn-step-badge" id="qnStepBadge">STEP 1 OF 5</div>
                <button type="button" class="qn-back-btn" id="qnBackBtn" aria-label="Go to previous question" style="display: none;">
                  ← BACK
                </button>
              </div>
              <div class="qn-progress-bar-wrap" aria-hidden="true">
                <div class="qn-progress-bar" id="qnProgressBar" style="width: 20%;"></div>
              </div>
            </div>

            <form id="contactForm" method="POST" action="api/contact.php" novalidate>
              <?= csrf_field() ?>
              <input type="hidden" name="action" value="contact">
              <input type="hidden" name="source" value="Website Questionnaire">

              <!-- Anti-Bot Spam Honeypot Field -->
              <div class="hp-field" aria-hidden="true">
                <label for="website_url">Leave this field blank</label>
                <input type="text" id="website_url" name="website_url" autocomplete="off" tabindex="-1">
              </div>

              <!-- Hidden Storage Inputs for Questionnaire Selections -->
              <input type="hidden" name="service" id="qnInputService" value="Website Development">
              <input type="hidden" name="company" id="qnInputCompany" value="">
              <input type="hidden" name="goal" id="qnInputGoal" value="">
              <input type="hidden" name="budget" id="qnInputBudget" value="Not sure yet">

              <div class="qn-steps-container">
                <!-- STEP 1: SERVICE SELECTION -->
                <div class="qn-step active" data-step="1">
                  <h3 class="qn-question-title">WHAT ARE YOU<br><span class="lime-text">LOOKING TO BUILD?</span></h3>
                  <p class="qn-question-sub">Tell us what you need and we'll help shape the right solution.</p>

                  <div class="qn-options-grid">
                    <button type="button" class="qn-option-card selected" data-value="Website Development">
                      <span class="qn-option-num">01</span>
                      <span class="qn-option-text">Website Development</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card" data-value="Website Refinement">
                      <span class="qn-option-num">02</span>
                      <span class="qn-option-text">Website Refinement</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card" data-value="WhatsApp Automation">
                      <span class="qn-option-num">03</span>
                      <span class="qn-option-text">WhatsApp Automation</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card" data-value="Website + WhatsApp Automation">
                      <span class="qn-option-num">04</span>
                      <span class="qn-option-text">Website + WhatsApp Automation</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card" data-value="Not Sure Yet">
                      <span class="qn-option-num">05</span>
                      <span class="qn-option-text">Not Sure Yet</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                  </div>

                  <div class="qn-actions">
                    <button type="button" class="qn-next-btn magnetic" data-next="2">
                      <span>NEXT ↗</span>
                    </button>
                  </div>
                </div>

                <!-- STEP 2: BUSINESS / BRAND -->
                <div class="qn-step" data-step="2">
                  <h3 class="qn-question-title">TELL US A LITTLE<br><span class="lime-text">ABOUT YOUR BUSINESS.</span></h3>
                  <p class="qn-question-sub">What does your business or brand do?</p>

                  <div class="qn-input-group">
                    <label for="qnBusinessInput" class="qn-field-label">Business / Brand Name</label>
                    <input type="text" id="qnBusinessInput" class="qn-text-input" placeholder="e.g. ABC Technologies" maxlength="100" autocomplete="organization">
                  </div>

                  <div class="qn-actions">
                    <button type="button" class="qn-next-btn magnetic" data-next="3">
                      <span>NEXT ↗</span>
                    </button>
                  </div>
                </div>

                <!-- STEP 3: GOAL -->
                <div class="qn-step" data-step="3">
                  <h3 class="qn-question-title">WHAT DO YOU<br><span class="lime-text">WANT TO ACHIEVE?</span></h3>
                  <p class="qn-question-sub">What's the primary goal for this project?</p>

                  <div class="qn-options-grid">
                    <button type="button" class="qn-option-card goal-card" data-value="Get more customers">
                      <span class="qn-option-text">Get more customers</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card goal-card" data-value="Build a professional online presence">
                      <span class="qn-option-text">Build a professional online presence</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card goal-card" data-value="Automate repetitive work">
                      <span class="qn-option-text">Automate repetitive work</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card goal-card" data-value="Improve my existing website">
                      <span class="qn-option-text">Improve my existing website</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card goal-card" data-value="Generate more leads">
                      <span class="qn-option-text">Generate more leads</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card goal-card" data-value="Something else">
                      <span class="qn-option-text">Something else</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                  </div>

                  <div class="qn-actions">
                    <button type="button" class="qn-next-btn magnetic" data-next="4">
                      <span>NEXT ↗</span>
                    </button>
                  </div>
                </div>

                <!-- STEP 4: BUDGET -->
                <div class="qn-step" data-step="4">
                  <h3 class="qn-question-title">WHAT'S YOUR<br><span class="lime-text">APPROXIMATE BUDGET?</span></h3>
                  <p class="qn-question-sub">Select an estimated budget range for this engagement.</p>

                  <div class="qn-options-grid">
                    <button type="button" class="qn-option-card budget-card" data-value="₹10,000 – ₹25,000">
                      <span class="qn-option-text">₹10,000 – ₹25,000</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card budget-card" data-value="₹25,000 – ₹50,000">
                      <span class="qn-option-text">₹25,000 – ₹50,000</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card budget-card" data-value="₹50,000 – ₹1,00,000">
                      <span class="qn-option-text">₹50,000 – ₹1,00,000</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card budget-card" data-value="₹1,00,000+">
                      <span class="qn-option-text">₹1,00,000+</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                    <button type="button" class="qn-option-card budget-card selected" data-value="Not sure yet">
                      <span class="qn-option-text">Not sure yet</span>
                      <span class="qn-option-arrow">↗</span>
                    </button>
                  </div>

                  <div class="qn-actions">
                    <button type="button" class="qn-next-btn magnetic" data-next="5">
                      <span>NEXT ↗</span>
                    </button>
                  </div>
                </div>

                <!-- STEP 5: CONTACT DETAILS & FINAL SUBMISSION -->
                <div class="qn-step" data-step="5">
                  <h3 class="qn-question-title">HOW SHOULD WE<br><span class="lime-text">CONTACT YOU?</span></h3>
                  <p class="qn-question-sub">Enter your details so our team can respond within 24 hours.</p>

                  <div class="qn-contact-form-grid">
                    <div class="qn-input-group">
                      <label for="qnNameInput" class="qn-field-label">Name *</label>
                      <input type="text" id="qnNameInput" name="name" class="qn-text-input" placeholder="Rahul Sharma" required minlength="2" maxlength="100" autocomplete="name">
                    </div>

                    <div class="qn-input-group">
                      <label for="qnPhoneInput" class="qn-field-label">Phone / WhatsApp *</label>
                      <input type="tel" id="qnPhoneInput" name="phone" class="qn-text-input" placeholder="9035344513" required maxlength="50" autocomplete="tel">
                    </div>

                    <div class="qn-input-group full">
                      <label for="qnEmailInput" class="qn-field-label">Email Address *</label>
                      <input type="email" id="qnEmailInput" name="email" class="qn-text-input" placeholder="rahul@company.com" required maxlength="150" autocomplete="email">
                    </div>

                    <div class="qn-input-group full">
                      <label for="qnDetailsInput" class="qn-field-label">Project Details (Optional)</label>
                      <textarea id="qnDetailsInput" name="project_details" class="qn-textarea" rows="3" placeholder="Any specific requirements or timeline preferences..." maxlength="5000"></textarea>
                    </div>
                  </div>

                  <div id="qnFeedback" class="qn-feedback-msg" style="display: none;"></div>

                  <div class="qn-actions">
                    <button type="submit" class="qn-submit-btn magnetic" id="qnSubmitBtn">
                      <span>START THE CONVERSATION ↗</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <!-- SUCCESS SCREEN (DYNAMICALLY REVEALED AFTER SUBMISSION) -->
            <div class="qn-success-screen" id="qnSuccessScreen" style="display: none;">
              <div class="qn-success-badge">✓ ENQUIRY RECEIVED</div>
              <h2 class="qn-success-title">THANK YOU.<br><span class="lime-text">WE'VE GOT YOUR DETAILS.</span></h2>
              <p class="qn-success-desc">Our engineering team will review your project requirements and get back to you shortly within 24 hours.</p>
              <button type="button" class="button button-primary magnetic qn-reset-btn" id="qnResetBtn">
                Back to Website ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Wrapper for Interactive Project Questionnaire -->
    <div class="questionnaire-modal" id="questionnaireModal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="MakeIT Project Questionnaire">
      <div class="qn-modal-backdrop" id="qnModalBackdrop"></div>
      <div class="qn-modal-content">
        <button type="button" class="qn-modal-close" id="qnModalClose" aria-label="Close Questionnaire">✕</button>
        <div id="qnModalContainer"></div>
      </div>
    </div>
  </main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
