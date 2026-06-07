(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile nav */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      });
    });
  }

  /* Join form demo */
  document.querySelector(".join__form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.querySelector("#email")?.value;
    if (email) {
      alert("Thank you for joining Plant the Future! We'll be in touch at " + email);
      e.target.reset();
    }
  });

  /* Header on scroll */
  const header = document.querySelector(".site-header");
  let headerTicking = false;

  function updateHeader() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    headerTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!headerTicking) {
        headerTicking = true;
        requestAnimationFrame(updateHeader);
      }
    },
    { passive: true }
  );
  updateHeader();

  /* Hero entrance (panel hero on hero.html) */
  const hero = document.querySelector(".hero:not(.hero--fullscreen)");
  if (hero) {
    requestAnimationFrame(() => {
      hero.classList.add("is-ready");
    });
  }

  /* Subtle hero parallax (hero.html campaign page) */
  const heroImg = document.querySelector(".hero__visual img");
  let parallaxTicking = false;

  function updateParallax() {
    if (heroImg && !prefersReducedMotion) {
      const offset = Math.min(window.scrollY * 0.28, 120);
      heroImg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.05)`;
    }
    parallaxTicking = false;
  }

  if (heroImg && !prefersReducedMotion) {
    window.addEventListener(
      "scroll",
      () => {
        if (!parallaxTicking) {
          parallaxTicking = true;
          requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );
    updateParallax();
  }

  /* Hero video — show enter button when finished */
  const heroVideo = document.querySelector(".hero__video-full");
  const heroEnter = document.querySelector(".hero__enter");

  function showHeroEnter() {
    if (!heroEnter) return;
    heroEnter.classList.add("is-visible");
    heroEnter.setAttribute("aria-hidden", "false");
    heroEnter.removeAttribute("tabindex");
  }

  if (heroVideo && heroEnter) {
    heroVideo.addEventListener("ended", showHeroEnter);

    if (heroVideo.readyState >= 1 && heroVideo.duration > 0 && heroVideo.currentTime >= heroVideo.duration) {
      showHeroEnter();
    }

    /* Fallback: show button after 7.5 seconds if video event didn't trigger */
    setTimeout(() => {
      if (heroEnter && !heroEnter.classList.contains("is-visible")) {
        showHeroEnter();
      }
    }, 7500);
  }

  /* Page transition: index.html → hero.html */
  const pageOverlay = document.getElementById("page-transition-overlay");
  const transitionMs = prefersReducedMotion ? 150 : 700;

  function fadeInCampaignPage() {
    if (!pageOverlay) return;
    sessionStorage.removeItem("pageTransition");
    requestAnimationFrame(() => {
      pageOverlay.classList.remove("is-active");
      pageOverlay.setAttribute("aria-hidden", "true");
    });
  }

  function navigateWithTransition(href) {
    if (!pageOverlay) {
      window.location.href = href;
      return;
    }
    pageOverlay.classList.add("is-active");
    pageOverlay.setAttribute("aria-hidden", "false");
    sessionStorage.setItem("pageTransition", "intro-to-site");
    window.setTimeout(() => {
      window.location.href = href;
    }, transitionMs);
  }

  if (pageOverlay && sessionStorage.getItem("pageTransition") === "intro-to-site" && heroEnter === null) {
    pageOverlay.setAttribute("aria-hidden", "false");
    window.addEventListener("load", () => {
      window.setTimeout(fadeInCampaignPage, prefersReducedMotion ? 0 : 80);
    });
  }

  heroEnter?.addEventListener("click", (e) => {
    e.preventDefault();
    navigateWithTransition(e.currentTarget.href);
  });

  /* Scroll reveal */
  const revealConfig = [
    { selector: ".issue__copy", class: "reveal reveal--left" },
    { selector: ".issue__visual", class: "reveal reveal--right" },
    { selector: ".concept__header", class: "reveal" },
    { selector: ".pillars", class: "reveal-group" },
    { selector: ".pillar", class: "reveal" },
    { selector: ".actions__header", class: "reveal" },
    { selector: ".actions__grid", class: "reveal-group" },
    { selector: ".action-card", class: "reveal reveal--scale" },
    { selector: ".actions__cta-text", class: "reveal" },
    { selector: ".highlights__main", class: "reveal reveal--left" },
    { selector: ".event-spotlight", class: "reveal reveal--left" },
    { selector: ".event-details", class: "reveal reveal--right" },
    { selector: ".event-reserve", class: "reveal reveal--right" },
    { selector: ".together__overlay", class: "reveal" },
    { selector: ".together__pillars > div", class: "reveal" },
    { selector: ".team__header", class: "reveal" },
    { selector: ".team__grid", class: "reveal-group" },
    { selector: ".team__member", class: "reveal reveal--scale" },
    { selector: ".join__inner", class: "reveal" },
  ];

  const revealElements = [];

  revealConfig.forEach(({ selector, class: className }) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add(...className.split(" "));
      revealElements.push(el);
    });
  });

  document.querySelectorAll(".reveal-group").forEach((group) => {
    const items = group.querySelectorAll(":scope > .reveal");
    items.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    document.querySelectorAll(".reveal-group").forEach((g) => g.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          const visible = entry.isIntersecting;

          target.classList.toggle("is-visible", visible);

          if (target.classList.contains("reveal-group")) {
            target.querySelectorAll(".reveal").forEach((child) => {
              child.classList.toggle("is-visible", visible);
            });
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    const observed = new Set();
    revealElements.forEach((el) => {
      const target = el.classList.contains("reveal") && el.parentElement?.classList.contains("reveal-group")
        ? el.parentElement
        : el;
      if (!observed.has(target)) {
        observed.add(target);
        observer.observe(target);
      }
    });
  }

  /* Image lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector(".lightbox__img");
  const lightboxCaption = lightbox?.querySelector(".lightbox__caption");
  const lightboxCloseButtons = lightbox?.querySelectorAll("[data-lightbox-close]");
  let lastFocused = null;

  function getCaption(figure) {
    const title = figure?.querySelector("figcaption strong")?.textContent?.trim();
    const text = figure?.querySelector("figcaption span")?.textContent?.trim();
    if (title && text) return `<strong>${title}</strong>${text}`;
    if (title) return `<strong>${title}</strong>`;
    return "";
  }

  function openLightbox(img) {
    if (!lightbox || !lightboxImg) return;

    lastFocused = document.activeElement;
    const figure = img.closest("figure");
    const member = img.closest(".team__member");
    const caption = getCaption(figure);
    const name = member?.querySelector(".team__info h3")?.textContent?.trim();
    const role = member?.querySelector(".team__info p")?.textContent?.trim();

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";

    if (lightboxCaption) {
      if (caption) {
        lightboxCaption.innerHTML = caption;
      } else if (name) {
        lightboxCaption.innerHTML = `<strong>${name}</strong>${role || ""}`;
      } else {
        lightboxCaption.textContent = img.alt || "";
      }
      lightboxCaption.hidden = !lightboxCaption.textContent;
    }

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    lightbox.querySelector(".lightbox__close")?.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    window.setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) {
        lightbox.hidden = true;
        lightboxImg.removeAttribute("src");
      }
    }, 300);

    lastFocused?.focus();
    lastFocused = null;
  }

  document.querySelectorAll(".highlight img, .team__photo img").forEach((img) => {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `View larger image: ${img.alt || "campaign photo"}`);

    img.addEventListener("click", () => openLightbox(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  lightboxCloseButtons?.forEach((btn) => {
    btn.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* Active nav link */
  const navLinks = [...document.querySelectorAll(".nav__menu a[href^='#']")];
  const navSections = navLinks
    .map((link) => document.getElementById(link.getAttribute("href")?.slice(1) || ""))
    .filter(Boolean);

  function updateActiveNav() {
    const scrollPos = window.scrollY + (header?.offsetHeight || 72) + 80;
    let current = "";

    navSections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("is-active", href === current);
    });
  }

  if (navSections.length && navLinks.length) {
    window.addEventListener("scroll", () => requestAnimationFrame(updateActiveNav), { passive: true });
    updateActiveNav();
  }
})();
