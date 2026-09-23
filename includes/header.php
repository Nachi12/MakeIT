<?php
/**
 * MakeIT - Public Header Template
 */

declare(strict_types=1);

if (!defined('MAKEIT_INIT')) {
    die('Direct access not permitted.');
}

$siteSettings = $settings ?? get_all_settings();
$pageTitle = $pageTitle ?? ($siteSettings['meta_title'] ?? 'MakeIT — We Make Digital Things Work');
$pageDescription = $pageDescription ?? ($siteSettings['meta_description'] ?? 'MakeIT designs and builds websites, software, AI automation and digital experiences that actually work.');
$activePage = $activePage ?? 'home';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title><?= e($pageTitle) ?></title>
  <meta name="description" content="<?= e($pageDescription) ?>" />
  <meta name="csrf-token" content="<?= e(csrf_token()) ?>" />

  <!-- Dynamic SEO & Open Graph / Twitter Cards -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="<?= e($siteSettings['company_name'] ?? 'MakeIT') ?>" />
  <meta property="og:title" content="<?= e($pageTitle) ?>" />
  <meta property="og:description" content="<?= e($pageDescription) ?>" />
  <meta property="og:url" content="<?= e(BASE_URL . ($_SERVER['REQUEST_URI'] ?? '')) ?>" />
  <meta property="og:image" content="<?= e(get_image_url($siteSettings['og_image'] ?? null, 'project')) ?>" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= e($pageTitle) ?>" />
  <meta name="twitter:description" content="<?= e($pageDescription) ?>" />
  <meta name="twitter:image" content="<?= e(get_image_url($siteSettings['og_image'] ?? null, 'project')) ?>" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="<?= e(get_image_url($siteSettings['favicon_path'] ?? null, 'favicon')) ?>" />

  <!-- Canonical -->
  <link rel="canonical" href="<?= e(BASE_URL . ($_SERVER['REQUEST_URI'] ?? '')) ?>" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <!-- Main Stylesheet -->
  <link rel="stylesheet" href="<?= e(ASSETS_URL . '/css/style.css') ?>" />
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
      <a href="<?= e(BASE_URL) ?>/#home" class="logo magnetic" aria-label="MakeIT Home">
        MakeIT
        <span class="logo-dot"></span>
      </a>

      <nav class="nav-links" aria-label="Primary Navigation">
        <a href="<?= e(BASE_URL) ?>/#services" class="nav-link magnetic <?= $activePage === 'services' ? 'active' : '' ?>">Services</a>
        <a href="<?= e(BASE_URL) ?>/#work" class="nav-link magnetic <?= $activePage === 'work' ? 'active' : '' ?>">Work</a>
        <a href="<?= e(BASE_URL) ?>/#process" class="nav-link magnetic <?= $activePage === 'process' ? 'active' : '' ?>">Process</a>
        <a href="<?= e(BASE_URL) ?>/#about" class="nav-link magnetic <?= $activePage === 'about' ? 'active' : '' ?>">About</a>
      </nav>

      <a href="<?= e(BASE_URL) ?>/#contact" class="nav-cta magnetic">
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
    <a href="<?= e(BASE_URL) ?>/#services">Services</a>
    <a href="<?= e(BASE_URL) ?>/#work">Work</a>
    <a href="<?= e(BASE_URL) ?>/#process">Process</a>
    <a href="<?= e(BASE_URL) ?>/#about">About</a>
    <a href="<?= e(BASE_URL) ?>/#contact" class="accent">Let's Talk ↗</a>
  </div>
