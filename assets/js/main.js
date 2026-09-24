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

    // 5. UPDATE PROJECT STACKING (Desktop + Mobile Responsive Touch & Mouse Stacking)
    if (projectCards.length > 0) {
      const isMobile = window.innerWidth <= 767;
      const baseTop = isMobile ? 75 : 90;
      const step = isMobile ? 12 : 16;
      const range = isMobile ? 320 : 420;
      const maxScaleDrop = isMobile ? 0.025 : 0.03;
      const maxTranslateY = isMobile ? 6 : 10;

      const projectsContainer = document.querySelector(".projects");
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const containerDocTop = projectsContainer
        ? projectsContainer.getBoundingClientRect().top + scrollY
        : 0;

      const len = projectCards.length;
      for (let i = 0; i < len; i++) {
        const card = projectCards[i];
        const topThreshold = baseTop + i * step;
        const cardDocTop = projectsContainer
          ? containerDocTop + card.offsetTop
          : (card.getBoundingClientRect().top + scrollY);

        // Distance scrolled past the point where the card reaches its sticky position
        const distance = Math.max(0, (scrollY + topThreshold) - cardDocTop);

        if (distance > 0) {
          const progress = Math.min(1, distance / range);
          const scale = 1 - (progress * maxScaleDrop);
          const translateY = -(progress * maxTranslateY);
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
    const syncMenuState = () => {
      if (window.innerWidth > 900) {
        mobileMenu.classList.remove("active");
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    };

    // Clean initial state on desktop load
    syncMenuState();

    menuButton.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        const isOpen = mobileMenu.classList.toggle("active");
        menuButton.textContent = isOpen ? "✕" : "☰";
        menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.style.overflow = isOpen ? "hidden" : "";
      } else {
        syncMenuState();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    window.addEventListener("resize", syncMenuState);
  }

  /* =========================================================
     8. SMOOTH ANCHOR LINK NAVIGATION & CTA TRIGGER WIRING
  ========================================================= */
  const modal = document.getElementById("questionnaireModal");
  const modalClose = document.getElementById("qnModalClose");
  const modalBackdrop = document.getElementById("qnModalBackdrop");
  const modalContainer = document.getElementById("qnModalContainer");
  const mainQuestionnaire = document.getElementById("projectQuestionnaire");

  function openQuestionnaireModal() {
    if (!modal) return;
    if (mainQuestionnaire && modalContainer && !modalContainer.contains(mainQuestionnaire)) {
      modalContainer.appendChild(mainQuestionnaire);
    }
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeQuestionnaireModal() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  if (modalClose) modalClose.addEventListener("click", closeQuestionnaireModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeQuestionnaireModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeQuestionnaireModal();
    }
  });

  // Intercept all CTAs ("Let's Talk", "Start a Project", "Get in Touch")
  document.querySelectorAll('a[href="#contact"], .nav-cta, .hero-buttons a[href="#contact"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openQuestionnaireModal();
    });
  });

  /* =========================================================
     9. INTERACTIVE PROJECT QUESTIONNAIRE CONTROLLER
  ========================================================= */
  const qnWrapper = document.getElementById("projectQuestionnaire");
  if (qnWrapper) {
    let currentStep = 1;
    const totalSteps = 5;

    const stepBadge = document.getElementById("qnStepBadge");
    const backBtn = document.getElementById("qnBackBtn");
    const progressBar = document.getElementById("qnProgressBar");
    const form = document.getElementById("contactForm") || document.getElementById("questionnaireForm");
    const feedbackMsg = document.getElementById("qnFeedback");
    const successScreen = document.getElementById("qnSuccessScreen");
    const resetBtn = document.getElementById("qnResetBtn");

    const inputService = document.getElementById("qnInputService");
    const inputCompany = document.getElementById("qnInputCompany");
    const inputGoal = document.getElementById("qnInputGoal");
    const inputBudget = document.getElementById("qnInputBudget");
    const businessInput = document.getElementById("qnBusinessInput");

    // Single Questionnaire State Object
    const qnState = {
      service: inputService ? inputService.value.trim() : "",
      company: inputCompany ? inputCompany.value.trim() : "",
      goal: inputGoal ? inputGoal.value.trim() : "",
      budget: inputBudget ? inputBudget.value.trim() : "",
      name: "",
      phone: "",
      email: "",
      projectDetails: ""
    };

    // Inline Step Validation Message Helpers
    function showStepError(stepEl, message) {
      if (!stepEl) return;
      let errEl = stepEl.querySelector(".qn-step-error");
      if (!errEl) {
        errEl = document.createElement("div");
        errEl.className = "qn-step-error";
        errEl.style.color = "#ff6b6b";
        errEl.style.fontSize = "13px";
        errEl.style.marginTop = "12px";
        errEl.style.marginBottom = "8px";
        errEl.style.fontFamily = "var(--font-heading, sans-serif)";
        errEl.style.letterSpacing = "0.02em";
        const actions = stepEl.querySelector(".qn-actions");
        if (actions) {
          stepEl.insertBefore(errEl, actions);
        } else {
          stepEl.appendChild(errEl);
        }
      }
      errEl.textContent = message;
      errEl.style.display = "block";
    }

    function clearStepError(stepEl) {
      if (!stepEl) return;
      const errEl = stepEl.querySelector(".qn-step-error");
      if (errEl) {
        errEl.style.display = "none";
        errEl.textContent = "";
      }
    }

    // Guarantee clean initial step state (only Step 1 active)
    qnWrapper.querySelectorAll(".qn-step").forEach((el) => {
      el.classList.toggle("active", el.getAttribute("data-step") === "1");
    });

    function goToStep(targetStep) {
      if (targetStep < 1 || targetStep > totalSteps) return;

      const currentStepEl = qnWrapper.querySelector(`.qn-step[data-step="${currentStep}"]`);
      const nextStepEl = qnWrapper.querySelector(`.qn-step[data-step="${targetStep}"]`);

      if (currentStepEl && nextStepEl && currentStep !== targetStep) {
        currentStepEl.classList.remove("active");
        nextStepEl.classList.add("active");
        currentStep = targetStep;

        if (stepBadge) stepBadge.textContent = `STEP ${currentStep} OF ${totalSteps}`;
        if (progressBar) progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
        if (backBtn) backBtn.style.display = currentStep > 1 ? "inline-block" : "none";

        const firstInput = nextStepEl.querySelector("input, textarea, button.qn-option-card");
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 150);
        }
      }
    }

    // Validate specific step choice/input
    function validateStep(stepNumber) {
      const stepEl = qnWrapper.querySelector(`.qn-step[data-step="${stepNumber}"]`);
      clearStepError(stepEl);

      if (stepNumber === 1) {
        const val = inputService ? inputService.value.trim() : qnState.service;
        if (!val) {
          showStepError(stepEl, "Please select an option to continue.");
          return false;
        }
      } else if (stepNumber === 2) {
        const val = businessInput ? businessInput.value.trim() : qnState.company;
        if (!val) {
          showStepError(stepEl, "Please enter your business or brand name.");
          if (businessInput) {
            businessInput.focus();
            businessInput.style.borderColor = "#ff6b6b";
            businessInput.style.boxShadow = "0 0 0 3px rgba(255, 107, 107, 0.25)";
          }
          return false;
        }
        qnState.company = val;
        if (inputCompany) inputCompany.value = val;
      } else if (stepNumber === 3) {
        const val = inputGoal ? inputGoal.value.trim() : qnState.goal;
        if (!val) {
          showStepError(stepEl, "Please select an option to continue.");
          return false;
        }
      } else if (stepNumber === 4) {
        const val = inputBudget ? inputBudget.value.trim() : qnState.budget;
        if (!val) {
          showStepError(stepEl, "Please select an option to continue.");
          return false;
        }
      }
      return true;
    }

    // Option Cards (Step 1, 3, 4)
    qnWrapper.querySelectorAll(".qn-option-card").forEach((card) => {
      card.addEventListener("click", () => {
        const stepEl = card.closest(".qn-step");
        const stepNum = parseInt(stepEl.getAttribute("data-step"), 10);
        const val = card.getAttribute("data-value");

        clearStepError(stepEl);

        stepEl.querySelectorAll(".qn-option-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");

        if (stepNum === 1) {
          qnState.service = val;
          if (inputService) inputService.value = val;
        } else if (stepNum === 3) {
          qnState.goal = val;
          if (inputGoal) inputGoal.value = val;
        } else if (stepNum === 4) {
          qnState.budget = val;
          if (inputBudget) inputBudget.value = val;
        }

        setTimeout(() => {
          if (currentStep < totalSteps) {
            goToStep(currentStep + 1);
          }
        }, 220);
      });
    });

    // Next Buttons
    qnWrapper.querySelectorAll(".qn-next-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextNum = parseInt(btn.getAttribute("data-next"), 10);
        if (!validateStep(currentStep)) return;
        goToStep(nextNum);
      });
    });

    // Back Button
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (currentStep > 1) {
          goToStep(currentStep - 1);
        }
      });
    }

    // Enter Key & Input handling on Business Input
    if (businessInput) {
      businessInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (!validateStep(2)) return;
          goToStep(3);
        }
      });

      businessInput.addEventListener("input", () => {
        businessInput.style.borderColor = "";
        businessInput.style.boxShadow = "";
        const stepEl = businessInput.closest(".qn-step");
        if (stepEl) clearStepError(stepEl);
      });
    }

    // Form Submission
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (feedbackMsg) {
          feedbackMsg.style.display = "none";
          feedbackMsg.className = "qn-feedback-msg";
        }

        // Validate all steps prior to submission
        if (!validateStep(1)) { goToStep(1); return; }
        if (!validateStep(2)) { goToStep(2); return; }
        if (!validateStep(3)) { goToStep(3); return; }
        if (!validateStep(4)) { goToStep(4); return; }

        // Sync inputs from DOM
        const nameVal = document.getElementById("qnNameInput")?.value.trim() || "";
        const phoneVal = document.getElementById("qnPhoneInput")?.value.trim() || "";
        const emailVal = document.getElementById("qnEmailInput")?.value.trim() || "";

        if (!nameVal || nameVal.length < 2) {
          if (feedbackMsg) {
            feedbackMsg.textContent = "Please enter your name (minimum 2 characters).";
            feedbackMsg.classList.add("error");
            feedbackMsg.style.display = "block";
          }
          document.getElementById("qnNameInput")?.focus();
          return;
        }

        if (!phoneVal) {
          if (feedbackMsg) {
            feedbackMsg.textContent = "Please enter your phone or WhatsApp number.";
            feedbackMsg.classList.add("error");
            feedbackMsg.style.display = "block";
          }
          document.getElementById("qnPhoneInput")?.focus();
          return;
        }

        if (!emailVal || !emailVal.includes("@") || !emailVal.includes(".")) {
          if (feedbackMsg) {
            feedbackMsg.textContent = "Please enter a valid email address.";
            feedbackMsg.classList.add("error");
            feedbackMsg.style.display = "block";
          }
          document.getElementById("qnEmailInput")?.focus();
          return;
        }

        if (inputService) inputService.value = qnState.service;
        if (inputCompany) inputCompany.value = qnState.company;
        if (inputGoal) inputGoal.value = qnState.goal;
        if (inputBudget) inputBudget.value = qnState.budget;

        const submitBtn = document.getElementById("qnSubmitBtn");
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = "<span>SENDING... ↗</span>";
        }

        const formData = new FormData(form);

        try {
          const response = await fetch("api/contact.php", {
            method: "POST",
            headers: {
              "X-Requested-With": "XMLHttpRequest"
            },
            body: formData
          });

          const data = await response.json();

          if (data.success) {
            if (form) form.style.display = "none";
            if (successScreen) successScreen.style.display = "block";
          } else {
            if (feedbackMsg) {
              feedbackMsg.textContent = data.error || "We couldn't send your enquiry. Please try again.";
              feedbackMsg.classList.add("error");
              feedbackMsg.style.display = "block";
            }
          }
        } catch (err) {
          if (feedbackMsg) {
            feedbackMsg.textContent = "We couldn't send your enquiry. Please check your connection and try again.";
            feedbackMsg.classList.add("error");
            feedbackMsg.style.display = "block";
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "<span>START THE CONVERSATION ↗</span>";
          }
        }
      });
    }

    // Reset Button
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (form) {
          form.reset();
          form.style.display = "block";
        }
        qnState.service = "";
        qnState.company = "";
        qnState.goal = "";
        qnState.budget = "";
        qnState.name = "";
        qnState.phone = "";
        qnState.email = "";
        qnState.projectDetails = "";

        if (inputService) inputService.value = "";
        if (inputCompany) inputCompany.value = "";
        if (inputGoal) inputGoal.value = "";
        if (inputBudget) inputBudget.value = "";
        if (businessInput) businessInput.value = "";

        qnWrapper.querySelectorAll(".qn-option-card").forEach((card) => card.classList.remove("selected"));
        qnWrapper.querySelectorAll(".qn-step").forEach((stepEl) => clearStepError(stepEl));

        if (feedbackMsg) {
          feedbackMsg.style.display = "none";
          feedbackMsg.textContent = "";
          feedbackMsg.className = "qn-feedback-msg";
        }

        if (successScreen) successScreen.style.display = "none";
        goToStep(1);

        if (modal && modal.classList.contains("active")) {
          closeQuestionnaireModal();
        }
      });
    }
  }
});
