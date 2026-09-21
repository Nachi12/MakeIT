<?php
/**
 * MakeIT — Netlify Static HTML Generator
 * 
 * Extracts current database CMS content and compiles the static public
 * HTML output for the `/netlify/index.html` deployment entrypoint.
 */

declare(strict_types=1);

define('MAKEIT_INIT', true);
require_once dirname(__DIR__) . '/includes/init.php';

$settings     = get_all_settings();
$hero         = get_hero_content();
$services     = get_services();
$projects     = get_projects();
$processSteps = get_process_steps();
$principles   = get_principles();
$testimonials = get_testimonials();

$pageTitle = ($settings['company_name'] ?? 'MakeIT') . ' — ' . ($settings['tagline'] ?? 'We Make Digital Things Work.');
$pageDescription = $settings['meta_description'] ?? 'MakeIT designs and builds websites, software, AI automation and digital experiences that actually work.';

ob_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
  <meta name="description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8') ?>" />

  <!-- Dynamic SEO & Open Graph / Twitter Cards -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="<?= htmlspecialchars($settings['company_name'] ?? 'MakeIT', ENT_QUOTES, 'UTF-8') ?>" />
  <meta property="og:title" content="<?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?>" />
  <meta property="og:description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8') ?>" />
  <meta property="og:url" content="./" />
  <meta property="og:image" content="<?= htmlspecialchars(get_image_url($settings['og_image'] ?? null, 'project'), ENT_QUOTES, 'UTF-8') ?>" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?>" />
  <meta name="twitter:description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8') ?>" />
  <meta name="twitter:image" content="<?= htmlspecialchars(get_image_url($settings['og_image'] ?? null, 'project'), ENT_QUOTES, 'UTF-8') ?>" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg" />

  <!-- Canonical -->
  <link rel="canonical" href="./" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <!-- Main Stylesheet -->
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>

  <!-- Accessible Skip Link -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- =======================================================
       PRELOADER
  ======================================================== -->
  <div class="loader" id="loader" aria-hidden="true">
    <div class="loader-inner">
      <div class="loader-logo">
        <span>M</span><span>a</span><span>k</span><span>e</span><span>IT</span>
      </div>
      <div class="loader-line">
        <span></span>
      </div>
    </div>
  </div>

  <!-- =======================================================
       CUSTOM CURSOR
  ======================================================== -->
  <div class="cursor" aria-hidden="true"></div>
  <div class="cursor-ring" aria-hidden="true"></div>

  <!-- =======================================================
       STICKY NAVIGATION
  ======================================================== -->
  <header class="nav" id="navbar">
    <div class="nav-inner">
      <a href="#home" class="logo magnetic" aria-label="MakeIT Home">
        MakeIT
        <span class="logo-dot"></span>
      </a>

      <nav class="nav-links" aria-label="Primary Navigation">
        <a href="#services" class="nav-link magnetic">Services</a>
        <a href="#work" class="nav-link magnetic">Work</a>
        <a href="#process" class="nav-link magnetic">Process</a>
        <a href="#about" class="nav-link magnetic">About</a>
      </nav>

      <a href="#contact" class="nav-cta magnetic">
        Let's Talk
        <span>↗</span>
      </a>

      <button class="menu" id="menuButton" aria-label="Toggle navigation menu" aria-expanded="false">
        ☰
      </button>
    </div>
  </header>

  <!-- =======================================================
       ANIMATED FULL-SCREEN MOBILE MENU
  ======================================================== -->
  <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
    <a href="#services">Services</a>
    <a href="#work">Work</a>
    <a href="#process">Process</a>
    <a href="#about">About</a>
    <a href="#contact" class="accent">Let's Talk ↗</a>
  </div>

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
                <?= htmlspecialchars($hero['badge_text'] ?? 'Digital studio / 2026', ENT_QUOTES, 'UTF-8') ?>
              </div>
            </div>

            <h1 class="hero-heading">
              <?php 
                $rawHeadline = $hero['headline'] ?? "WE MAKE\nDIGITAL\nTHINGS WORK.";
                $headlineLines = explode("\n", trim($rawHeadline));
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
                          echo htmlspecialchars(implode(' ', $words), ENT_QUOTES, 'UTF-8') . ' <span class="hero-accent-word">' . htmlspecialchars($lastWord, ENT_QUOTES, 'UTF-8') . '</span>';
                        else:
                          echo '<span class="hero-accent-word">' . htmlspecialchars($trimmed, ENT_QUOTES, 'UTF-8') . '</span>';
                        endif;
                      ?>
                    <?php else: ?>
                      <?= htmlspecialchars($trimmed, ENT_QUOTES, 'UTF-8') ?>
                    <?php endif; ?>
                  </span>
                </div>
              <?php endforeach; ?>
            </h1>

            <div class="hero-bottom">
              <p class="hero-description">
                <?= htmlspecialchars($hero['description'] ?? 'From the first sketch to the final launch, MakeIT designs and builds digital products around the way your business actually works.', ENT_QUOTES, 'UTF-8') ?>
              </p>

              <div class="hero-buttons">
                <a href="#contact" class="button button-primary magnetic">
                  <?= htmlspecialchars($hero['primary_button_text'] ?? 'Start a Project', ENT_QUOTES, 'UTF-8') ?>
                  <span class="button-arrow" aria-hidden="true">↗</span>
                </a>

                <a href="#services" class="button button-secondary magnetic">
                  <?= htmlspecialchars($hero['secondary_button_text'] ?? 'Explore Services', ENT_QUOTES, 'UTF-8') ?>
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

        <div class="services-list">
          <?php foreach ($services as $index => $service): ?>
            <?php $serviceNum = str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT); ?>
            <a href="#contact" class="service reveal" aria-label="<?= htmlspecialchars($service['title'], ENT_QUOTES, 'UTF-8') ?>">
              <div class="service-number">
                <?= htmlspecialchars($serviceNum, ENT_QUOTES, 'UTF-8') ?>
              </div>

              <div class="service-content">
                <h3 class="service-title">
                  <?= htmlspecialchars($service['title'], ENT_QUOTES, 'UTF-8') ?>
                </h3>

                <p class="service-text">
                  <?= htmlspecialchars($service['short_description'], ENT_QUOTES, 'UTF-8') ?>
                </p>
              </div>

              <div class="service-arrow" aria-hidden="true">
                ↗
              </div>
            </a>
          <?php endforeach; ?>
        </div>
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

        <div class="projects">
          <?php foreach ($projects as $index => $project): ?>
            <?php 
              $projNum = str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT); 
              $totalCount = str_pad((string)count($projects), 2, '0', STR_PAD_LEFT);
            ?>
            <article class="project" style="z-index: <?= (int)($index + 5) ?>;">
              <div class="project-top">
                <div class="project-number">
                  <?= htmlspecialchars($projNum, ENT_QUOTES, 'UTF-8') ?> / <?= htmlspecialchars($totalCount, ENT_QUOTES, 'UTF-8') ?>
                </div>

                <div class="project-type">
                  <?= htmlspecialchars($project['category'], ENT_QUOTES, 'UTF-8') ?>
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
                  <div class="browser-content">
                    <div class="mock-label"><?= htmlspecialchars(strtoupper($project['category']), ENT_QUOTES, 'UTF-8') ?> / SYSTEM</div>
                    <div class="mock-heading"><?= htmlspecialchars($project['title'], ENT_QUOTES, 'UTF-8') ?></div>
                    <div class="mock-bar"></div>
                    <div class="mock-button"></div>
                  </div>
                </div>
              </div>

              <div class="project-bottom">
                <div>
                  <h3 class="project-title">
                    <?= htmlspecialchars($project['title'], ENT_QUOTES, 'UTF-8') ?>
                  </h3>
                  <p style="color: var(--muted); font-size: 14px; margin-top: 8px; max-width: 540px;">
                    <?= htmlspecialchars($project['description'], ENT_QUOTES, 'UTF-8') ?>
                  </p>
                </div>

                <a href="<?= !empty($project['project_url']) ? htmlspecialchars($project['project_url'], ENT_QUOTES, 'UTF-8') : '#contact' ?>" class="project-link magnetic" aria-label="Explore <?= htmlspecialchars($project['title'], ENT_QUOTES, 'UTF-8') ?>" <?= !empty($project['project_url']) ? 'target="_blank" rel="noopener noreferrer"' : '' ?>>
                  ↗
                </a>
              </div>
            </article>
          <?php endforeach; ?>
        </div>
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
                <?= htmlspecialchars($principle['number'], ENT_QUOTES, 'UTF-8') ?>
              </div>
              <h3>
                <?= htmlspecialchars($principle['title'], ENT_QUOTES, 'UTF-8') ?>
              </h3>
              <p>
                <?= htmlspecialchars($principle['description'], ENT_QUOTES, 'UTF-8') ?>
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

        <div class="process-track">
          <div class="process-line" aria-hidden="true"></div>
          <div class="process-progress" id="processProgress" aria-hidden="true"></div>

          <?php foreach ($processSteps as $step): ?>
            <div class="process-step">
              <div class="process-dot">
                <?= htmlspecialchars($step['step_number'], ENT_QUOTES, 'UTF-8') ?>
              </div>
              <h3>
                <?= htmlspecialchars($step['title'], ENT_QUOTES, 'UTF-8') ?>
              </h3>
              <p>
                <?= htmlspecialchars($step['description'], ENT_QUOTES, 'UTF-8') ?>
              </p>
            </div>
          <?php endforeach; ?>
        </div>
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

        <div class="testimonials-grid">
          <?php foreach ($testimonials as $t): ?>
            <div class="testimonial-card reveal">
              <div>
                <div class="testimonial-rating" aria-label="Rating: <?= (int)($t['rating'] ?? 5) ?> of 5 stars">
                  <?= str_repeat('★', max(1, min(5, (int)($t['rating'] ?? 5)))) ?>
                </div>
                <p class="testimonial-quote">
                  <?= htmlspecialchars($t['content'], ENT_QUOTES, 'UTF-8') ?>
                </p>
              </div>

              <div class="testimonial-meta">
                <img src="<?= htmlspecialchars(get_image_url($t['image'] ?? null, 'avatar'), ENT_QUOTES, 'UTF-8') ?>" alt="<?= htmlspecialchars($t['client_name'], ENT_QUOTES, 'UTF-8') ?>" class="testimonial-avatar" loading="lazy" />
                <div>
                  <div class="testimonial-author-name"><?= htmlspecialchars($t['client_name'], ENT_QUOTES, 'UTF-8') ?></div>
                  <div class="testimonial-author-sub">
                    <?= htmlspecialchars($t['position'] ?? '', ENT_QUOTES, 'UTF-8') ?><?= (!empty($t['position']) && !empty($t['company'])) ? ', ' : '' ?><?= htmlspecialchars($t['company'] ?? '', ENT_QUOTES, 'UTF-8') ?>
                  </div>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
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
              <a href="mailto:<?= htmlspecialchars($settings['email'], ENT_QUOTES, 'UTF-8') ?>">
                <span>Email:</span> <?= htmlspecialchars($settings['email'], ENT_QUOTES, 'UTF-8') ?> ↗
              </a>
            <?php endif; ?>
            <?php if (!empty($settings['phone'])): ?>
              <a href="tel:<?= htmlspecialchars(preg_replace('/[^0-9+]/', '', $settings['phone']), ENT_QUOTES, 'UTF-8') ?>">
                <span>Call:</span> <?= htmlspecialchars($settings['phone'], ENT_QUOTES, 'UTF-8') ?> ↗
              </a>
            <?php else: ?>
              <a href="tel:9035344513">
                <span>Call:</span> 9035344513 ↗
              </a>
            <?php endif; ?>
            <span>Location: <?= htmlspecialchars($settings['address'] ?? 'Bangalore-560010, karnataka. India', ENT_QUOTES, 'UTF-8') ?></span>
          </div>
        </div>

        <!-- Contact Form Card -->
        <div class="contact-form-card reveal">
          <h3 class="contact-form-title">Start a Project</h3>
          <p class="contact-form-desc">Fill out the form below to receive a response within 24 hours.</p>

          <div id="formFeedback"></div>

          <form id="contactForm" method="POST" action="#contact" novalidate>
            <!-- Anti-Bot Spam Honeypot Field -->
            <div class="hp-field" aria-hidden="true">
              <label for="website_url">Leave this field blank</label>
              <input type="text" id="website_url" name="website_url" autocomplete="off" tabindex="-1">
            </div>

            <div class="form-grid">
              <!-- Name -->
              <div class="form-group">
                <label for="name" class="form-label">Name *</label>
                <input type="text" id="name" name="name" class="form-control" placeholder="Rahul Sharma" required minlength="2" maxlength="100">
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email" class="form-label">Email Address *</label>
                <input type="email" id="email" name="email" class="form-control" placeholder="rahul@company.com" required maxlength="150">
              </div>

              <!-- Phone -->
              <div class="form-group">
                <label for="phone" class="form-label">Phone</label>
                <input type="tel" id="phone" name="phone" class="form-control" placeholder="9035344513" maxlength="50">
              </div>

              <!-- Company -->
              <div class="form-group">
                <label for="company" class="form-label">Company</label>
                <input type="text" id="company" name="company" class="form-control" placeholder="ABC Technologies" maxlength="100">
              </div>

              <!-- Service -->
              <div class="form-group">
                <label for="service" class="form-label">Service</label>
                <select id="service" name="service" class="form-control">
                  <?php if (!empty($services)): ?>
                    <?php 
                      $uniqueServices = [];
                      foreach ($services as $srv) {
                        $sTitle = trim($srv['title']);
                        if (!in_array($sTitle, $uniqueServices, true)) {
                          $uniqueServices[] = $sTitle;
                        }
                      }
                    ?>
                    <?php foreach ($uniqueServices as $srvTitle): ?>
                      <option value="<?= htmlspecialchars($srvTitle, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($srvTitle, ENT_QUOTES, 'UTF-8') ?></option>
                    <?php endforeach; ?>
                    <option value="Consulting / Other">Consulting / Other</option>
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
                  <option value="< ₹1,00,000">&lt; ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹3,00,000" selected>₹1,00,000 – ₹3,00,000</option>
                  <option value="₹3,00,000 - ₹5,00,000">₹3,00,000 – ₹5,00,000</option>
                  <option value="₹5,00,000+">₹5,00,000+</option>
                </select>
              </div>

              <!-- Message -->
              <div class="form-group full">
                <label for="message" class="form-label">Project Details *</label>
                <textarea id="message" name="message" class="form-control" rows="4" placeholder="Briefly describe what you're looking to build or solve..." required minlength="5" maxlength="5000"></textarea>
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

  <!-- =======================================================
       FOOTER
  ======================================================== -->
  <footer>
    <div class="container">
      <div class="footer-top">
        <div class="footer-logo">
          <?= htmlspecialchars($settings['company_name'] ?? 'MakeIT', ENT_QUOTES, 'UTF-8') ?>
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <div class="footer-col-title">Navigate</div>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <div class="footer-col">
            <div class="footer-col-title">Connect</div>
            <?php if (!empty($settings['email'])): ?>
              <a href="mailto:<?= htmlspecialchars($settings['email'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($settings['email'], ENT_QUOTES, 'UTF-8') ?></a>
            <?php endif; ?>
            <?php if (!empty($settings['phone'])): ?>
              <a href="tel:<?= htmlspecialchars(preg_replace('/[^0-9+]/', '', $settings['phone']), ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($settings['phone'], ENT_QUOTES, 'UTF-8') ?></a>
            <?php endif; ?>
            <?php if (!empty($settings['linkedin'])): ?>
              <a href="<?= htmlspecialchars($settings['linkedin'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <?php endif; ?>
            <?php if (!empty($settings['github'])): ?>
              <a href="<?= htmlspecialchars($settings['github'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <?php endif; ?>
            <?php if (!empty($settings['twitter'])): ?>
              <a href="<?= htmlspecialchars($settings['twitter'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener noreferrer">Twitter / X ↗</a>
            <?php endif; ?>
            <?php if (!empty($settings['instagram'])): ?>
              <a href="<?= htmlspecialchars($settings['instagram'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <?php endif; ?>
            <?php if (!empty($settings['facebook'])): ?>
              <a href="<?= htmlspecialchars($settings['facebook'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener noreferrer">Facebook ↗</a>
            <?php endif; ?>
            <?php if (!empty($settings['youtube'])): ?>
              <a href="<?= htmlspecialchars($settings['youtube'], ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener noreferrer">YouTube ↗</a>
            <?php endif; ?>
          </div>

          <?php if (!empty($settings['address']) || !empty($settings['business_hours'])): ?>
            <div class="footer-col">
              <div class="footer-col-title">Office</div>
              <?php if (!empty($settings['address'])): ?>
                <p style="font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 12px;">
                  <?= nl2br(htmlspecialchars($settings['address'], ENT_QUOTES, 'UTF-8')) ?>
                </p>
              <?php endif; ?>
              <?php if (!empty($settings['business_hours'])): ?>
                <p style="font-size: 13px; font-family: 'DM Mono', monospace; color: var(--muted);">
                  <?= htmlspecialchars($settings['business_hours'], ENT_QUOTES, 'UTF-8') ?>
                </p>
              <?php endif; ?>
            </div>
          <?php endif; ?>
        </div>
      </div>

      <div class="footer-bottom">
        <span>
          &copy; <?= date('Y') ?> <?= htmlspecialchars(strtoupper($settings['company_name'] ?? 'MAKEIT'), ENT_QUOTES, 'UTF-8') ?>
        </span>
        <span>
          <?= htmlspecialchars(strtoupper($settings['tagline'] ?? 'WE MAKE DIGITAL THINGS WORK.'), ENT_QUOTES, 'UTF-8') ?>
        </span>
      </div>
    </div>
  </footer>

  <!-- Frontend Configuration & Vanilla Motion Engine -->
  <script src="assets/js/config.js"></script>
  <script src="assets/js/main.js" defer></script>
</body>
</html>
<?php
$htmlContent = ob_get_clean();
$outputFile = dirname(__DIR__) . '/netlify/index.html';
file_put_contents($outputFile, $htmlContent);
echo "SUCCESS: Wrote " . strlen($htmlContent) . " bytes to " . $outputFile . "\n";
