/**
 * ULTRA-PREMIUM PORTFOLIO INTERACTIVITY
 * Modular, performant vanilla JavaScript.
 */

/* Mobile Disclaimer Logic */
document.addEventListener("DOMContentLoaded", () => {
  const closeDisclaimer = document.getElementById("closeDisclaimer");
  if (closeDisclaimer) {
    closeDisclaimer.addEventListener("click", () => {
      document.getElementById("mobileDisclaimer").classList.add("hidden");
    });
  }
});

/* ==========================================================================
   TERMINAL PRELOADER SEQUENCE
   ========================================================================== */
const preloader = document.getElementById("preloader");
if (preloader) {
  document.body.style.overflow = "hidden";

  const progressWrapper = document.getElementById("term-progress-wrapper");
  const progressBar = document.getElementById("term-progress-bar");
  const progressText = document.getElementById("term-progress-text");

  setTimeout(() => {
    progressWrapper.classList.remove("hidden");

    let i = 0;
    const totalSteps = 20;
    const intervalTime = 20; // ~0.4 seconds total

    const loader = setInterval(() => {
      i++;
      const pct = Math.floor((i / totalSteps) * 100);

      // Build ASCII bar
      progressBar.innerText = "█".repeat(i) + "░".repeat(totalSteps - i);
      progressText.innerText = pct + "%";

      if (i >= totalSteps) {
        clearInterval(loader);
        setTimeout(() => {
          preloader.classList.add("hidden");
          document.body.style.overflow = "";
          setTimeout(() => preloader.remove(), 800);
        }, 150); // Wait 150ms after hitting 100%
      }
    }, intervalTime);
  }, 50);
}

document.addEventListener("DOMContentLoaded", () => {
  // Utilities
  const isTouchDevice = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
  ).matches;
  const lerp = (start, end, factor) => start + (end - start) * factor;

  /* ==========================================================================
       Global Toast Notifications System
       ========================================================================== */
  const toastContainer = document.getElementById("toastContainer");

  window.showToast = (message, icon = "fa-solid fa-bell") => {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  };

  /* ==========================================================================
       1. Custom Cursor & Interactive Background
       ========================================================================== */
  const initCursorAndBg = () => {
    if (isTouchDevice) return;

    const cursorDot = document.getElementById("cursorDot");
    const cursorGlow = document.getElementById("cursorGlow");
    const bgOrb = document.getElementById("bgOrb");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let glowX = mouseX;
    let glowY = mouseY;

    let orbX = mouseX;
    let orbY = mouseY;

    // Interactive elements that trigger hover states
    const interactiveSelectors = "a, button, .magnetic, .bento-card";

    let mouseTicking = false;
    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!mouseTicking) {
          window.requestAnimationFrame(() => {
            // Dot follows instantly
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
            mouseTicking = false;
          });
          mouseTicking = true;
        }
      },
      { passive: true },
    );

    // Glow and Orb follow with lerp (delay)
    const renderCursor = () => {
      glowX = lerp(glowX, mouseX, 0.15);
      glowY = lerp(glowY, mouseY, 0.15);

      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate3d(-50%, -50%, 0)`;

      if (bgOrb) {
        orbX = lerp(orbX, mouseX, 0.04);
        orbY = lerp(orbY, mouseY, 0.04);
        bgOrb.style.transform = `translate3d(${orbX}px, ${orbY}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hover states
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      if (el.id === "profileBtn") return; // Exclude profile button from cursor glow
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("cursor-hover"),
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("cursor-hover"),
      );
    });
  };

  /* ==========================================================================
       2. Scroll Progress & Sticky Nav
       ========================================================================== */
  const initScrollFeatures = () => {
    const progressBar = document.getElementById("scrollProgress");
    const navbar = document.getElementById("navbar");

    let ticking = false;

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      // Progress Bar
      if (docHeight > 0) {
        const progress = (scrollY / docHeight) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;

        const sideFill = document.getElementById("sideFill");
        if (sideFill) {
          sideFill.style.height = `${progress}%`;
        }
      }

      // Nav styling
      if (navbar) {
        if (scrollY > 50) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
      }
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateScroll);
          ticking = true;
        }
      },
      { passive: true },
    );
    updateScroll(); // init
  };

  /* ==========================================================================
       3. Intersection Observer (Scroll Reveals & Counters)
       ========================================================================== */
  const initReveals = () => {
    // Standard Reveal
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(".reveal")
      .forEach((el) => revealObserver.observe(el));

    // Section Notification Observer
    const sectionNotified = new Set();
    const sectionIcons = {
      about: "fa-solid fa-address-card",
      skills: "fa-solid fa-code",
      projects: "fa-solid fa-laptop-code",
      experience: "fa-solid fa-briefcase",
      education: "fa-solid fa-graduation-cap",
      contact: "fa-solid fa-envelope",
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && id !== "hero") {
            // Only notify once per visit to avoid spam
            if (!sectionNotified.has(id)) {
              sectionNotified.add(id);
              const title =
                "Viewing " + id.charAt(0).toUpperCase() + id.slice(1);
              const icon = sectionIcons[id] || "fa-solid fa-eye";
              // if (window.showToast) window.showToast(title, icon); // DISABLED TO PREVENT CONFUSION
            }
          }
        });
      },
      { threshold: 0.15 },
    );

    document
      .querySelectorAll("section[id]")
      .forEach((sec) => sectionObserver.observe(sec));

    // Staggered Reveal
    const staggerContainers = document.querySelectorAll(
      "section, .bento-grid, .timeline",
    );

    staggerContainers.forEach((container) => {
      const staggerItems = container.querySelectorAll(".reveal-stagger");

      const staggerObserver = new IntersectionObserver(
        (entries) => {
          let delay = 0;
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Apply incremental delay to items in the same container
              entry.target.style.setProperty("--delay", delay);
              entry.target.classList.add("is-visible");
              staggerObserver.unobserve(entry.target);
              delay++;
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
      );

      staggerItems.forEach((el) => staggerObserver.observe(el));
    });

    // Number Counters
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-target"), 10);
            let current = 0;
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const animateCounter = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Ease out quart
              const easeProgress = 1 - Math.pow(1 - progress, 4);

              current = Math.floor(easeProgress * target);
              el.textContent = current;

              if (progress < 1) {
                requestAnimationFrame(animateCounter);
              } else {
                el.textContent = target; // Ensure exact final value
              }
            };

            requestAnimationFrame(animateCounter);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );

    document
      .querySelectorAll(".counter")
      .forEach((el) => counterObserver.observe(el));
  };

  /* ==========================================================================
       4. Physics Interactions (Magnetic & 3D Tilt)
       ========================================================================== */
  const initPhysics = () => {
    if (isTouchDevice) {
      // Disable VanillaTilt on touch devices for better scroll performance
      document.querySelectorAll("[data-tilt]").forEach((el) => {
        if (el.vanillaTilt) {
          el.vanillaTilt.destroy();
        }
      });
      return;
    }

    // Magnetic Buttons
    const magnets = document.querySelectorAll(".magnetic, .magnetic-sm");
    magnets.forEach((magnet) => {
      let rect;
      let ticking = false;
      magnet.addEventListener("mouseenter", () => {
        rect = magnet.getBoundingClientRect();
      });

      magnet.addEventListener("mousemove", (e) => {
        if (!ticking && rect) {
          window.requestAnimationFrame(() => {
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const strength = magnet.classList.contains("magnetic-sm")
              ? 0.15
              : 0.3;
            magnet.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
            ticking = false;
          });
          ticking = true;
        }
      });

      magnet.addEventListener("mouseleave", () => {
        window.requestAnimationFrame(() => {
          magnet.style.transform = "translate3d(0px, 0px, 0)";
          rect = null;
        });
      });
    });

    // 3D Tilt Cards
    const tiltCards = document.querySelectorAll(".tilt-card");
    tiltCards.forEach((card) => {
      let rect;
      let ticking = false;
      card.addEventListener("mouseenter", () => {
        rect = card.getBoundingClientRect();
      });

      card.addEventListener("mousemove", (e) => {
        if (!ticking && rect) {
          window.requestAnimationFrame(() => {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 15 degrees)
            const rotateX = -1 * (y / rect.height - 0.5) * 15;
            const rotateY = (x / rect.width - 0.5) * 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update glow position
            card.style.setProperty("--x", `${x}px`);
            card.style.setProperty("--y", `${y}px`);
            ticking = false;
          });
          ticking = true;
        }
      });

      card.addEventListener("mouseleave", () => {
        window.requestAnimationFrame(() => {
          card.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
          rect = null;
        });
      });
    });
  };

  /* ==========================================================================
       5. Mobile Navigation Toggle
       ========================================================================== */
  const initMobileNav = () => {
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");

    if (!mobileToggle || !navLinks) return;

    const toggleMenu = () => {
      const isExpanded = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("open");
      document.body.style.overflow = isExpanded ? "" : "hidden"; // Prevent scrolling
    };

    mobileToggle.addEventListener("click", toggleMenu);

    // Close on link click
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("open")) {
          toggleMenu();
        }
      });
    });
  };

  /* ==========================================================================
       6. Theme Switcher
       ========================================================================== */
  const initThemeSwitcher = () => {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeCycleBtn = document.getElementById("themeCycleBtn");
    const themeDropdownMenu = document.getElementById("themeDropdownMenu");
    const themeOptions = document.querySelectorAll(".theme-option");
    const logo = document.getElementById("logo");

    if (!themeToggleBtn || !themeDropdownMenu) return;

    const themes = [
      "dark",
      "light",
      "ocean",
      "cyberpunk",
      "gold",
      "monochrome",
    ];
    let currentIdx = 0;

    const applyTheme = (themeName) => {
      if (themeName === "dark") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", themeName);
      }

      // Update active state in dropdown
      themeOptions.forEach((opt) => {
        opt.classList.remove("active");
        if (opt.getAttribute("data-theme-value") === themeName) {
          opt.classList.add("active");
        }
      });

      // Sync cycle index
      const idx = themes.indexOf(themeName);
      if (idx !== -1) currentIdx = idx;

      // Notify if enabled
      if (window.showToast) {
        const displayTheme =
          themeName.charAt(0).toUpperCase() + themeName.slice(1);
        window.showToast(
          `Theme changed to ${displayTheme}`,
          "fa-solid fa-palette",
        );
      }
    };

    // Cycle button
    if (themeCycleBtn) {
      themeCycleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        currentIdx = (currentIdx + 1) % themes.length;
        applyTheme(themes[currentIdx]);
      });
    }

    // Logo cycle theme
    if (logo) {
      logo.addEventListener("click", (e) => {
        e.preventDefault();
        currentIdx = (currentIdx + 1) % themes.length;
        applyTheme(themes[currentIdx]);
      });
    }

    // Toggle dropdown on click
    themeToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      themeDropdownMenu.classList.toggle("active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !themeToggleBtn.contains(e.target) &&
        !themeDropdownMenu.contains(e.target)
      ) {
        themeDropdownMenu.classList.remove("active");
      }
    });

    // Handle theme selection from dropdown
    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const newTheme = option.getAttribute("data-theme-value");
        applyTheme(newTheme);
        themeDropdownMenu.classList.remove("active");
      });
    });
  };

  /* ==========================================================================
       7. Glitch Text Effect
       ========================================================================== */
  const initGlitchText = () => {
    const glitchEl = document.querySelector(".glitch-text");
    if (!glitchEl) return;

    const chars = "!<>-_\\/[]{}—=+*^?#_";
    const originalText = glitchEl.getAttribute("data-text");

    const glitch = () => {
      let iterations = 0;
      const maxIterations = 10;

      const interval = setInterval(() => {
        glitchEl.innerText = originalText
          .split("")
          .map((char, index) => {
            if (index < iterations) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        if (iterations >= originalText.length) {
          clearInterval(interval);
          glitchEl.innerText = originalText;
        }

        iterations += 1 / 2; // Speed of reveal
      }, 30);
    };

    // Run on load after a slight delay
    setTimeout(glitch, 1000);

    // Run on hover
    glitchEl.addEventListener("mouseenter", glitch);
  };

  /* ==========================================================================
       8. Profile Modal
       ========================================================================== */
  const initProfileModal = () => {
    const modal = document.getElementById("profileModal");
    const openBtn = document.getElementById("profileBtn");
    const closeBtn = document.getElementById("closeProfileBtn");

    if (!modal || !openBtn || !closeBtn) return;

    const openModal = () => {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (window.showToast)
        window.showToast("Profile Details Opened", "fa-solid fa-user");
    };

    const closeModal = () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    };

    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });
  };

  /* ==========================================================================
       10. Skill Category Filters
       ========================================================================== */
  const initSkillFilters = () => {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const skillCards = document.querySelectorAll(".skills-grid .bento-card");

    if (!filterBtns.length || !skillCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");
        let firstMatch = null;

        skillCards.forEach((card) => {
          if (filterValue === "all") {
            card.classList.remove("dimmed");
          } else {
            const categories = card.getAttribute("data-category");
            if (categories && categories.includes(filterValue)) {
              card.classList.remove("dimmed");
              if (!firstMatch) firstMatch = card;
            } else {
              card.classList.add("dimmed");
            }
          }
        });

        if (firstMatch && filterValue !== "all") {
          setTimeout(() => {
            const rect = firstMatch.getBoundingClientRect();
            const headerOffset = window.innerHeight * 0.15; // 15% of screen height from top
            const targetY = window.scrollY + rect.top - headerOffset;

            window.scrollTo({
              top: targetY,
              behavior: "smooth",
            });
          }, 50);
        }
      });
    });
  };

  /* ==========================================================================
       9. Scramble Role Text Effect
       ========================================================================== */
  const initScrambleText = () => {
    const roles = [
      "Frontend Developer",
      "Web Developer",
      "UI/UX Enthusiast",
      "AI Explorer",
    ];
    // Use a mix of uppercase, lowercase, numbers, and techy symbols
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#________";
    const el = document.querySelector(".scramble-word");

    if (!el) return;

    let roleIndex = 0;
    let activeInterval = null;

    function scramble(text) {
      let iteration = 0;
      if (activeInterval) clearInterval(activeInterval);

      activeInterval = setInterval(() => {
        el.textContent = text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            if (text[index] === " ") return " "; // Preserve spaces for stability
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        iteration += 1 / 2.5; // Slightly faster transition per character

        if (iteration >= text.length) {
          clearInterval(activeInterval);
          el.textContent = text;
        }
      }, 30);
    }

    function nextRole() {
      scramble(roles[roleIndex]);
      roleIndex = (roleIndex + 1) % roles.length;
    }

    nextRole();
    setInterval(nextRole, 3500);
  };

  /* ==========================================================================
       11. Stats Counter Animation
       ========================================================================== */
  const initStatsCounter = () => {
    const counters = document.querySelectorAll(".counter");
    const speed = 100;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const updateCount = () => {
              const target = +counter.getAttribute("data-target");
              const count = +counter.innerText;
              const inc = target / speed;

              if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
              } else {
                counter.innerText = target;
              }
            };
            updateCount();
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => observer.observe(counter));
  };
  /* ==========================================================================
       12. Lenis Smooth Scroll
       ========================================================================== */
  const initLenis = () => {
    if (typeof Lenis !== "undefined") {
      window.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Automatically pause Lenis when modals (popups) open to prevent scroll breaking
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "style") {
            if (document.body.style.overflow === "hidden") {
              window.lenis.stop();
            } else {
              window.lenis.start();
            }
          }
        });
      });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  };

  /* ==========================================================================
       13. Contact Button Animation
       ========================================================================== */
  const initContactAnimation = () => {
    const contactBtn = document.querySelector(".cta-box .btn-primary");
    if (contactBtn) {
      contactBtn.addEventListener("click", (e) => {
        contactBtn.classList.add("fly-away");
        setTimeout(() => {
          contactBtn.classList.remove("fly-away");
        }, 1500);
      });
    }
  };

  /* ==========================================================================
       14. Timeline Scroll Animation (Purple Line Grows)
       ========================================================================== */
  const initTimelineScroll = () => {
    const timeline = document.querySelector(".timeline");
    if (!timeline) return;

    // Create the glowing progress line
    const lineProgress = document.createElement("div");
    lineProgress.className = "timeline-line-progress";
    timeline.insertBefore(lineProgress, timeline.firstChild);

    const items = timeline.querySelectorAll(".timeline-item-scroll");
    const dots = timeline.querySelectorAll(".timeline-dot");

    const updateTimeline = () => {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start the animation when the timeline is 75% down the screen
      const startOffset = windowHeight * 0.75;
      let progress = 0;

      // Check if user has scrolled to the very bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;

      if (rect.top <= startOffset) {
        const totalScroll = startOffset - rect.top;
        // Calculate percentage based on the timeline's height
        progress = Math.min(
          100,
          Math.max(0, (totalScroll / rect.height) * 100),
        );
      }

      if (isAtBottom) {
        progress = 100;
      }

      // Grow the purple line
      lineProgress.style.height = `${progress}%`;

      // Check each item to see if the line has passed its dot
      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const dot = dots[index];

        // If the item's top is past the scroll offset (line reached it) or we are at the bottom
        if (itemRect.top <= startOffset || isAtBottom) {
          item.classList.add("active");
          if (dot) dot.classList.add("active");
        } else {
          item.classList.remove("active");
          if (dot) dot.classList.remove("active");
        }
      });
    };

    let timelineTicking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!timelineTicking) {
          window.requestAnimationFrame(() => {
            updateTimeline();
            timelineTicking = false;
          });
          timelineTicking = true;
        }
      },
      { passive: true },
    );
    // Initial call
    updateTimeline();
  };

  // Initialize everything
  initLenis();
  initCursorAndBg();
  initScrollFeatures();
  initReveals();
  initPhysics();
  initMobileNav();
  initThemeSwitcher();
  initGlitchText();
  initProfileModal();
  initScrambleText();
  initSkillFilters();
  initStatsCounter();
  initContactAnimation();
  initTimelineScroll();

  // Project Details Modal Toggle
  const projectModal = document.getElementById("projectModal");
  const closeProjectModal = document.getElementById("closeProjectModal");
  const projectModalTitle = document.getElementById("projectModalTitle");
  const projectModalBody = document.getElementById("projectModalBody");

  if (projectModal && closeProjectModal) {
    document.querySelectorAll(".details-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".project-content");
        const title = card.querySelector(".card-title").innerText;
        const hiddenDetails = card.querySelector(
          ".project-hidden-details",
        ).innerHTML;

        projectModalTitle.innerText = title;
        projectModalBody.innerHTML = hiddenDetails;

        projectModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      });
    });

    closeProjectModal.addEventListener("click", () => {
      projectModal.classList.remove("active");
      document.body.style.overflow = "";
    });

    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // More Projects Modal Logic
  const moreProjectsBtn = document.getElementById("openMoreProjectsBtn");
  const moreProjectsModal = document.getElementById("moreProjectsModal");
  const closeMoreProjectsBtn = document.getElementById("closeMoreProjectsBtn");

  if (moreProjectsBtn && moreProjectsModal && closeMoreProjectsBtn) {
    moreProjectsBtn.addEventListener("click", () => {
      moreProjectsModal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (window.showToast)
        window.showToast("More Projects Opened", "fa-solid fa-rocket");
    });

    const closeMoreModal = () => {
      moreProjectsModal.classList.remove("active");
      document.body.style.overflow = "";
    };

    closeMoreProjectsBtn.addEventListener("click", closeMoreModal);

    moreProjectsModal.addEventListener("click", (e) => {
      if (e.target === moreProjectsModal) {
        closeMoreModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        moreProjectsModal.classList.contains("active")
      ) {
        closeMoreModal();
      }
    });
  }

  // Initialize Project Carousels
  const initCarousels = () => {
    document.querySelectorAll(".project-preview").forEach((container) => {
      const track = container.querySelector(".carousel-track");
      const dots = container.querySelectorAll(".dot");
      if (!track || dots.length === 0) return;

      let currentIndex = 0;
      const totalSlides = dots.length;

      const updateSlide = () => {
        dots.forEach((d) => d.classList.remove("active"));
        dots[currentIndex].classList.add("active");
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      };

      // Desynchronize carousels: Random start delay (0 to 2 seconds)
      // and slightly random interval duration (3.5 to 4.5 seconds)
      const startDelay = Math.random() * 2000;
      const intervalDuration = 3500 + Math.random() * 1000;

      // Auto slide with offset
      setTimeout(() => {
        setInterval(() => {
          // Pick a random slide different from the current one
          let nextIndex;
          do {
            nextIndex = Math.floor(Math.random() * totalSlides);
          } while (nextIndex === currentIndex && totalSlides > 1);

          currentIndex = nextIndex;
          updateSlide();
        }, intervalDuration);
      }, startDelay);

      // Clickable dots
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          currentIndex = index;
          updateSlide();
        });
      });
    });
  };
  initCarousels();
});

// Scroll Up Button Logic
const scrollUpBtn = document.getElementById("scrollUpBtn");
if (scrollUpBtn) {
  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            scrollUpBtn.classList.add("visible");
          } else {
            scrollUpBtn.classList.remove("visible");
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true },
  );

  scrollUpBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ScrollSpy Navigation Logic
const initScrollSpy = () => {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "-50% 0px -50% 0px",
    threshold: 0,
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => scrollSpyObserver.observe(sec));
};

document.addEventListener("DOMContentLoaded", initScrollSpy);

document.addEventListener("DOMContentLoaded", () => {
  // 14. Impact Dropdown Toggle Logic
  const impactBtns = document.querySelectorAll(".impact-toggle-btn");

  impactBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Toggle expanded class on button for icon rotation
      this.classList.toggle("expanded");

      // Find the next sibling which is the dropdown
      const dropdown = this.nextElementSibling;
      if (dropdown && dropdown.classList.contains("impact-dropdown")) {
        dropdown.classList.toggle("expanded");
      }
    });
  });

  /* ==========================================================================
       Stealthy Copy to Clipboard
       ========================================================================== */
  const copyTexts = document.querySelectorAll(".copy-text");
  copyTexts.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const textToCopy = link.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);

        // Visual feedback for contact bento grid
        link.classList.add("copied");

        let iconEl = link.querySelector(".fa-envelope");
        let textEl = link.querySelector(".social-value");

        if (iconEl && textEl) {
          iconEl.className = "fa-solid fa-check";
          textEl.innerText = "Copied!";
        } else {
          // Fallback for other copy links if they exist
          if (!link.dataset.origHtml) {
            link.dataset.origHtml = link.innerHTML;
          }
          link.innerHTML =
            '<i class="fa-solid fa-check"></i> Copied to clipboard!';
        }

        // Toast Notification
        if (window.showToast) {
          window.showToast("Email copied!", "fa-solid fa-circle-check");
        }

        // Reset after 2 seconds
        setTimeout(() => {
          link.classList.remove("copied");
          if (iconEl && textEl) {
            iconEl.className = "fa-regular fa-envelope";
            textEl.innerText = textToCopy;
          } else if (link.dataset.origHtml) {
            link.innerHTML = link.dataset.origHtml;
            delete link.dataset.origHtml;
          }
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    });
  });

  // Contact Flip Logic
  const ctaFlipInner = document.getElementById("ctaFlipInner");
  const sayHelloBtns = document.querySelectorAll(".say-hello-btn");
  const closeFlipBtn = document.getElementById("closeFlipBtn");

  if (ctaFlipInner) {
    sayHelloBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        ctaFlipInner.classList.add("flipped");

        // If they click a Say Hello button outside the footer, scroll them to the footer
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    if (closeFlipBtn) {
      closeFlipBtn.addEventListener("click", (e) => {
        e.preventDefault();
        ctaFlipInner.classList.remove("flipped");
      });
    }

    // Form submission
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("contactSubmitBtn");

    if (contactForm && submitBtn) {
      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Show sending state
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML =
          '<span>Sending...</span><i class="fa-solid fa-circle-notch fa-spin" style="margin-left: 8px;"></i>';
        submitBtn.style.opacity = "0.7";
        submitBtn.disabled = true;

        try {
          const formData = new FormData(contactForm);

          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (response.ok) {
            if (window.showToast) {
              window.showToast(
                "Message sent successfully!",
                "fa-solid fa-circle-check",
              );
            }
            contactForm.reset();
            ctaFlipInner.classList.remove("flipped");
          } else {
            if (window.showToast) {
              window.showToast(
                data.message || "Error sending message",
                "fa-solid fa-circle-xmark",
              );
            }
          }
        } catch (error) {
          if (window.showToast) {
            window.showToast(
              "Network error, please try again.",
              "fa-solid fa-triangle-exclamation",
            );
          }
        } finally {
          // Restore button state after flip animation or error
          setTimeout(() => {
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.style.opacity = "1";
            submitBtn.disabled = false;
          }, 800);
        }
      });
    }
  }

  // Live Time Logic
  const liveTimeEl = document.getElementById("liveTime");
  if (liveTimeEl) {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      liveTimeEl.innerText = timeString;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
});
/* ==========================================================================
       HERO PARTICLES BACKGROUND
       ========================================================================== */
const initParticles = () => {
  if (
    typeof particlesJS !== "undefined" &&
    document.getElementById("particles-js")
  ) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 60,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#8b5cf6", // accent-primary color
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#06b6d4", // accent-secondary color
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 200,
            line_linked: {
              opacity: 0.8,
            },
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
    });
  }
};
initParticles();
