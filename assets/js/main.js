/**
 * MakeIT — Centralized 60fps Motion Engine
 * Pure Vanilla JavaScript (No Frameworks, No Libraries)
 */

console.log("[MakeIT Motion] main.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     0. MOTION PREFERENCES & SETUP
  ========================================================= */
  document.documentElement.classList.add("force-motion");

  /* =========================================================
     1. PRELOADER & HERO ENTRANCE COORDINATION (PHASE 2)
  ========================================================= */
  const loader = document.getElementById("loader");
  let isPageReady = false;

  function triggerPageReady() {
    if (isPageReady) return;
    isPageReady = true;
    document.body.classList.add("page-ready");
    document.body.classList.add("js-loaded");

    // Once hero entrance sequence finishes settling (~1400ms),
    // mark settled so mouse parallax on floating cards runs without CSS transition delay
    setTimeout(() => {
      document.body.classList.add("hero-settled");
    }, 1400);
  }

  if (loader) {
    // Elegant entrance: dismiss preloader after 280ms so hero sequence reveals smoothly
    setTimeout(() => {
      loader.classList.add("hide");
      setTimeout(triggerPageReady, 100);
    }, 280);
  } else {
    triggerPageReady();
  }

  /* =========================================================
     2. GLOBAL MOTION STATE VARIABLES (CENTRALIZED ARCHITECTURE)
  ========================================================= */
  const isFinePointer = window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches;
  const isDesktop = window.innerWidth > 900 && isFinePointer;

  let targetMouseX = -100, targetMouseY = -100;
  let currentMouseX = -100, currentMouseY = -100;
  let ringX = -100, ringY = -100;
  let isMouseActive = false;

  let targetScroll = window.scrollY;
  let currentScroll = window.scrollY;

  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;

  let targetProgress = 0;
  let currentProgress = 0;

  /* =========================================================
     3. DOM ELEMENTS
  ========================================================= */
  const cursor = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  const navbar = document.getElementById("navbar");
  const floatingSystem = document.getElementById("floatingSystem");
  const projectCards = document.querySelectorAll(".projects .project");
  const processSection = document.querySelector(".process");
  const processProgress = document.getElementById("processProgress");
  const processSteps = document.querySelectorAll(".process-step");
  const magneticElements = document.querySelectorAll(".magnetic");

  /* =========================================================
     4. EVENT LISTENERS FOR STATE
  ========================================================= */
  if (isDesktop) {
    window.addEventListener("mousemove", (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;

      if (!isMouseActive) {
        isMouseActive = true;
        currentMouseX = targetMouseX;
        currentMouseY = targetMouseY;
        ringX = targetMouseX;
        ringY = targetMouseY;
        if (cursor) cursor.style.opacity = "1";
        if (ring) ring.style.opacity = "1";
      }

      // Hero subtle micro-tilt targets (Section 8: max movement very small, physical depth)
      if (floatingSystem && e.clientY < window.innerHeight * 1.05) {
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;
        targetTiltX = normX * 8.0;
        targetTiltY = normY * 6.0;
      }
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      if (cursor) cursor.style.opacity = "0";
      if (ring) ring.style.opacity = "0";
      isMouseActive = false;
    });

    document.addEventListener("mouseenter", () => {
      isMouseActive = true;
      if (cursor) cursor.style.opacity = "1";
      if (ring) ring.style.opacity = "1";
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.add("cursor-active");
    });
    document.addEventListener("mouseup", () => {
      document.body.classList.remove("cursor-active");
    });

    const hoverSelectors = "a, button, input, textarea, select, .service, .principle, .project, .testimonial-card, .menu, .magnetic, [role='button']";
    document.querySelectorAll(hoverSelectors).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      }, { passive: true });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
      }, { passive: true });
    });

    // Magnetic buttons setup (Phase 13: 4-8px max pull, smooth interpolation)
    magneticElements.forEach((element) => {
      let rect = null;
      let btnTargetX = 0, btnTargetY = 0;
      let btnCurrentX = 0, btnCurrentY = 0;
      let isHovered = false;

      element.addEventListener("mouseenter", () => {
        rect = element.getBoundingClientRect();
        isHovered = true;
        element.style.transition = "none";
      });

      element.addEventListener("mousemove", (e) => {
        if (!rect) rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const maxDist = 7;
        btnTargetX = Math.max(-maxDist, Math.min(maxDist, x * 0.16));
        btnTargetY = Math.max(-maxDist, Math.min(maxDist, y * 0.16));
      }, { passive: true });

      element.addEventListener("mouseleave", () => {
        isHovered = false;
        btnTargetX = 0;
        btnTargetY = 0;
        element.style.transition = "transform 0.45s var(--ease-main)";
        element.style.transform = "translate3d(0, 0, 0)";
        rect = null;
      });

      function updateMagnetic() {
        if (isHovered) {
          btnCurrentX += (btnTargetX - btnCurrentX) * 0.18;
          btnCurrentY += (btnTargetY - btnCurrentY) * 0.18;
          element.style.transform = `translate3d(${btnCurrentX.toFixed(2)}px, ${btnCurrentY.toFixed(2)}px, 0)`;
        }
      }
      element._updateMagnetic = updateMagnetic;
    });
  } else {
    if (cursor) cursor.style.display = "none";
    if (ring) ring.style.display = "none";
  }

  // Scroll listener updates targetScroll
  window.addEventListener("scroll", () => {
    targetScroll = window.scrollY;
  }, { passive: true });

  /* =========================================================
     5. CENTRALIZED REQUESTANIMATIONFRAME LOOP (PHASE 22)
  ========================================================= */
  let isNavScrolled = false;

  function animationLoop() {
    // 1. UPDATE CURSOR (Phase 12: dot: 0.25, ring: 0.12)
    if (isDesktop && cursor && ring && isMouseActive) {
      currentMouseX += (targetMouseX - currentMouseX) * 0.25;
      currentMouseY += (targetMouseY - currentMouseY) * 0.25;
      ringX += (targetMouseX - ringX) * 0.12;
      ringY += (targetMouseY - ringY) * 0.12;

      cursor.style.transform = `translate3d(${currentMouseX.toFixed(2)}px, ${currentMouseY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
    }

    // 2. UPDATE HERO PARALLAX & SCROLL INTERACTION (Sections 8 & 9)
    if (isDesktop && floatingSystem) {
      currentTiltX += (targetTiltX - currentTiltX) * 0.06;
      currentTiltY += (targetTiltY - currentTiltY) * 0.06;

      floatingSystem.style.setProperty("--tilt-x", `${currentTiltX.toFixed(2)}px`);
      floatingSystem.style.setProperty("--tilt-y", `${currentTiltY.toFixed(2)}px`);
    }

    // Scroll interaction for hero: subtle fade & translate without layout shift
    const heroContent = document.querySelector(".hero-content");
    if (heroContent && currentScroll < window.innerHeight * 1.2) {
      const scrollProgress = Math.min(1, Math.max(0, currentScroll / (window.innerHeight * 0.85)));
      const heroFade = (1 - (scrollProgress * 0.32)).toFixed(3);
      const heroTranslateY = (currentScroll * 0.09).toFixed(2);
      heroContent.style.setProperty("--hero-fade", heroFade);
      heroContent.style.setProperty("--hero-scroll-y", `-${heroTranslateY}px`);
    }

    // 3. INTERPOLATE SCROLL
    currentScroll += (targetScroll - currentScroll) * 0.12;

    // 4. UPDATE NAVBAR (Phase 14)
    if (navbar) {
      const shouldBeScrolled = targetScroll > 40;
      if (shouldBeScrolled !== isNavScrolled) {
        isNavScrolled = shouldBeScrolled;
        if (shouldBeScrolled) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }
    }

    // 5. UPDATE PROJECT STACKING (Step 15: smooth, visible stacking)
    if (projectCards.length > 0 && window.innerWidth > 900) {
      const len = projectCards.length;
      for (let i = 0; i < len; i++) {
        const card = projectCards[i];
        const rect = card.getBoundingClientRect();
        const topThreshold = 90 + i * 16;
        const distance = Math.max(0, topThreshold - rect.top);
        if (distance > 0) {
          const progress = Math.min(1, distance / 420);
          const scale = 1 - (progress * 0.03); // 1.0 -> 0.97
          const translateY = -(progress * 10);
          card.style.transform = `scale(${scale.toFixed(4)}) translateY(${translateY.toFixed(1)}px)`;
        } else {
          card.style.transform = "scale(1) translateY(0px)";
        }
      }
    }

    // 6. UPDATE PROCESS PROGRESS (Phase 10: currentProgress += (targetProgress - currentProgress) * 0.12)
    if (processSection && processProgress) {
      const rect = processSection.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top <= vh && rect.bottom >= 0) {
        const totalDistance = rect.height + vh * 0.2;
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / totalDistance));
        targetProgress = progress;
      }

      currentProgress += (targetProgress - currentProgress) * 0.12;
      processProgress.style.transform = `scaleX(${currentProgress.toFixed(4)})`;

      if (processSteps.length > 0) {
        processSteps.forEach((step, index) => {
          const stepThreshold = index / processSteps.length;
          if (currentProgress >= stepThreshold) {
            step.classList.add("active");
          } else {
            step.classList.remove("active");
          }
        });
      }
    }

    // 7. UPDATE MAGNETIC BUTTONS
    if (isDesktop) {
      magneticElements.forEach((el) => {
        if (el._updateMagnetic) el._updateMagnetic();
      });
    }

    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);
  console.log("[MakeIT Motion] initialized");

  /* =========================================================
     6. SCROLL REVEAL (INTERSECTION OBSERVER - PHASE 5 & 6)
  ========================================================= */
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-stagger, .statement, .cta, footer"
  );

  if ("IntersectionObserver" in window && revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  /* =========================================================
     7. MOBILE MENU
  ========================================================= */
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("active");
      menuButton.textContent = isOpen ? "✕" : "☰";
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* =========================================================
     8. SMOOTH ANCHOR LINK NAVIGATION
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* =========================================================
     9. AJAX CONTACT FORM
  ========================================================= */
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Send Message";

      const nameInput = contactForm.querySelector('[name="name"]');
      const emailInput = contactForm.querySelector('[name="email"]');
      const messageInput = contactForm.querySelector('[name="message"]');

      if (!nameInput || !nameInput.value.trim() || !emailInput || !emailInput.value.trim() || !messageInput || !messageInput.value.trim()) {
        formFeedback.innerHTML = '<div class="form-alert form-alert-error">Please fill in all required fields.</div>';
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <span style="display:inline-block; animation: spin 1s linear infinite;">↻</span>';
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch("api/contact.php", {
          method: "POST",
          body: formData,
          headers: { "X-Requested-With": "XMLHttpRequest" }
        });
        const result = await response.json();
        if (result.success) {
          formFeedback.innerHTML = `<div class="form-alert form-alert-success"><strong>Success!</strong> ${result.message || "Thanks! Your enquiry has been received. We'll get back to you shortly."}</div>`;
          contactForm.reset();
        } else {
          formFeedback.innerHTML = `<div class="form-alert form-alert-error"><strong>Notice:</strong> ${result.error || "An error occurred."}</div>`;
        }
      } catch (err) {
        contactForm.submit();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
});
