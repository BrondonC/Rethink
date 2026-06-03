(function () {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");

  if (!toggle || !menu) return;

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

  document.querySelector(".join__form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.querySelector("#email")?.value;
    if (email) {
      alert("Thank you for joining Plant the Future! We'll be in touch at " + email);
      e.target.reset();
    }
  });
})();
