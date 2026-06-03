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

  /* Hero entrance */
  const hero = document.querySelector(".hero");
  if (hero) {
    requestAnimationFrame(() => {
      hero.classList.add("is-ready");
    });
  }

  /* Subtle hero parallax */
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
    return;
  }

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
