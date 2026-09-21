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
            No unnecessary complexity. Just thoughtful design, clean technology and digital systems engineered around your operational goals.
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
        <div class="eyebrow">Our approach</div>

        <div class="statement-title">
          <div>
            <span>YOUR IDEA</span>
          </div>
          <div>
            <span>SHOULDN'T</span>
          </div>
          <div>
            <span>STAY AN <strong class="lime">IDEA.</strong></span>
          </div>
        </div>

        <p class="statement-copy">
          We take ideas from rough thought to real product. Strategy, UX, architecture, engineering, and deployment — handled as one connected, frictionless process.
        </p>
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

        <!-- Contact Form Card -->
        <div class="contact-form-card reveal">
          <h3 class="contact-form-title">Start a Project</h3>
          <p class="contact-form-desc">Fill out the form below to receive a response within 24 hours.</p>

          <div id="formFeedback">
            <?php if ($contactSuccess): ?>
              <div class="form-alert form-alert-success">
                <strong>Success!</strong> <?= e($contactSuccess) ?>
              </div>
            <?php endif; ?>
            <?php if ($contactError): ?>
              <div class="form-alert form-alert-error">
                <strong>Notice:</strong> <?= e($contactError) ?>
              </div>
            <?php endif; ?>
          </div>

          <form id="contactForm" method="POST" action="index.php#contact" novalidate>
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="contact">

            <!-- Anti-Bot Spam Honeypot Field -->
            <div class="hp-field" aria-hidden="true">
              <label for="website_url">Leave this field blank</label>
              <input type="text" id="website_url" name="website_url" autocomplete="off" tabindex="-1">
            </div>

            <div class="form-grid">
              <!-- Name -->
              <div class="form-group">
                <label for="name" class="form-label">Name *</label>
                <input type="text" id="name" name="name" class="form-control" placeholder="Rahul Sharma" required minlength="2" maxlength="100" value="<?= e($_POST['name'] ?? '') ?>">
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email" class="form-label">Email Address *</label>
                <input type="email" id="email" name="email" class="form-control" placeholder="rahul@company.com" required maxlength="150" value="<?= e($_POST['email'] ?? '') ?>">
              </div>

              <!-- Phone -->
              <div class="form-group">
                <label for="phone" class="form-label">Phone</label>
                <input type="tel" id="phone" name="phone" class="form-control" placeholder="9035344513" maxlength="50" value="<?= e($_POST['phone'] ?? '') ?>">
              </div>

              <!-- Company -->
              <div class="form-group">
                <label for="company" class="form-label">Company</label>
                <input type="text" id="company" name="company" class="form-control" placeholder="ABC Technologies" maxlength="100" value="<?= e($_POST['company'] ?? '') ?>">
              </div>

              <!-- Service -->
              <div class="form-group">
                <label for="service" class="form-label">Service</label>
                <select id="service" name="service" class="form-control">
                  <?php if (!empty($services)): ?>
                    <?php foreach ($services as $srv): ?>
                      <option value="<?= e($srv['title']) ?>" <?= (($_POST['service'] ?? '') === $srv['title']) ? 'selected' : '' ?>><?= e($srv['title']) ?></option>
                    <?php endforeach; ?>
                    <option value="Consulting / Other" <?= (($_POST['service'] ?? '') === 'Consulting / Other') ? 'selected' : '' ?>>Consulting / Other</option>
                  <?php else: ?>
                    <option value="Websites">Websites</option>
                    <option value="Software">Software</option>
                    <option value="AI + Automation">AI + Automation</option>
                    <option value="Consulting / Other">Consulting / Other</option>
                  <?php endif; ?>
                </select>
              </div>

              <!-- Budget -->
              <div class="form-group">
                <label for="budget" class="form-label">Estimated Budget</label>
                <select id="budget" name="budget" class="form-control">
                  <option value="< ₹1,00,000" <?= (($_POST['budget'] ?? '') === '< ₹1,00,000') ? 'selected' : '' ?>>&lt; ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹3,00,000" <?= (($_POST['budget'] ?? '') === '₹1,00,000 - ₹3,00,000' || empty($_POST['budget'])) ? 'selected' : '' ?>>₹1,00,000 – ₹3,00,000</option>
                  <option value="₹3,00,000 - ₹5,00,000" <?= (($_POST['budget'] ?? '') === '₹3,00,000 - ₹5,00,000') ? 'selected' : '' ?>>₹3,00,000 – ₹5,00,000</option>
                  <option value="₹5,00,000+" <?= (($_POST['budget'] ?? '') === '₹5,00,000+') ? 'selected' : '' ?>>₹5,00,000+</option>
                </select>
              </div>

              <!-- Message -->
              <div class="form-group full">
                <label for="message" class="form-label">Project Details *</label>
                <textarea id="message" name="message" class="form-control" rows="4" placeholder="Briefly describe what you're looking to build or solve..." required minlength="5" maxlength="5000"><?= e($_POST['message'] ?? '') ?></textarea>
              </div>
            </div>

            <button type="submit" class="btn-form-submit magnetic">
              <span>Send Message</span>
              <span aria-hidden="true">↗</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
