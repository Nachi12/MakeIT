<?php
/**
 * MakeIT - Public Footer Template
 */

declare(strict_types=1);

if (!defined('MAKEIT_INIT')) {
    die('Direct access not permitted.');
}

$siteSettings = $settings ?? get_all_settings();
?>
  <!-- =======================================================
       FOOTER
  ======================================================== -->
  <footer>
    <div class="container">
      <div class="footer-top">
        <div class="footer-logo">
          <?= e($siteSettings['company_name'] ?? 'Make') ?><span>IT</span>
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <div class="footer-col-title">Navigate</div>
            <a href="<?= e(BASE_URL) ?>/#home">Home</a>
            <a href="<?= e(BASE_URL) ?>/#services">Services</a>
            <a href="<?= e(BASE_URL) ?>/#work">Work</a>
            <a href="<?= e(BASE_URL) ?>/#process">Process</a>
            <a href="<?= e(BASE_URL) ?>/#about">About</a>
            <a href="<?= e(BASE_URL) ?>/#contact">Contact</a>
          </div>

          <div class="footer-col">
            <div class="footer-col-title">Connect</div>
            <?php if (!empty($siteSettings['email'])): ?>
              <a href="mailto:<?= e($siteSettings['email']) ?>"><?= e($siteSettings['email']) ?></a>
            <?php endif; ?>
            <?php if (!empty($siteSettings['phone'])): ?>
              <a href="tel:<?= e(preg_replace('/[^0-9+]/', '', $siteSettings['phone'])) ?>"><?= e($siteSettings['phone']) ?></a>
            <?php endif; ?>
            <?php if (!empty($siteSettings['linkedin'])): ?>
              <a href="<?= e($siteSettings['linkedin']) ?>" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <?php endif; ?>
            <?php if (!empty($siteSettings['github'])): ?>
              <a href="<?= e($siteSettings['github']) ?>" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <?php endif; ?>
            <?php if (!empty($siteSettings['twitter'])): ?>
              <a href="<?= e($siteSettings['twitter']) ?>" target="_blank" rel="noopener noreferrer">Twitter / X ↗</a>
            <?php endif; ?>
            <?php if (!empty($siteSettings['instagram'])): ?>
              <a href="<?= e($siteSettings['instagram']) ?>" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <?php endif; ?>
            <?php if (!empty($siteSettings['facebook'])): ?>
              <a href="<?= e($siteSettings['facebook']) ?>" target="_blank" rel="noopener noreferrer">Facebook ↗</a>
            <?php endif; ?>
            <?php if (!empty($siteSettings['youtube'])): ?>
              <a href="<?= e($siteSettings['youtube']) ?>" target="_blank" rel="noopener noreferrer">YouTube ↗</a>
            <?php endif; ?>
          </div>

          <?php if (!empty($siteSettings['address']) || !empty($siteSettings['business_hours'])): ?>
            <div class="footer-col">
              <div class="footer-col-title">Office</div>
              <?php if (!empty($siteSettings['address'])): ?>
                <p style="font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 12px;">
                  <?= nl2br(e($siteSettings['address'])) ?>
                </p>
              <?php endif; ?>
              <?php if (!empty($siteSettings['business_hours'])): ?>
                <p style="font-size: 13px; font-family: 'DM Mono', monospace; color: var(--muted);">
                  <?= e($siteSettings['business_hours']) ?>
                </p>
              <?php endif; ?>
            </div>
          <?php endif; ?>
        </div>
      </div>

      <div class="footer-bottom">
        <span>
          &copy; <?= date('Y') ?> <?= e(strtoupper($siteSettings['company_name'] ?? 'MAKEIT')) ?>
        </span>
        <span>
          <?= e(strtoupper($siteSettings['tagline'] ?? 'WE MAKE DIGITAL THINGS WORK.')) ?>
        </span>
      </div>
    </div>
  </footer>

  <!-- Vanilla JavaScript -->
  <script src="<?= e(ASSETS_URL . '/js/main.js') ?>" defer></script>
</body>
</html>
