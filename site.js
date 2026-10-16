// The nav bar: the menu on narrow screens, the section you're reading, and a firmer bar once the page scrolls.
const header = document.querySelector(".site-nav");

if (header) {
  const toggle = header.querySelector(".nav-toggle");
  const setOpen = open => {
    header.toggleAttribute("data-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(!header.hasAttribute("data-open")));
  header.querySelector(".nav-menu").addEventListener("click", event => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && header.hasAttribute("data-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  matchMedia("(min-width: 820px)").addEventListener("change", event => {
    if (event.matches) setOpen(false);
  });

  // Section links light up as you scroll through the home page.
  const links = [...header.querySelectorAll(".nav-links a, .nav-menu a")].filter(link => link.hash);
  const sections = [...new Set(links.map(link => link.hash))]
    .map(hash => document.getElementById(hash.slice(1)))
    .filter(Boolean);
  let queued = false;
  const update = () => {
    queued = false;
    header.toggleAttribute("data-scrolled", scrollY > 8);
    if (!sections.length) return;
    let current = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top < innerHeight * 0.4) current = section;
    }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = sections.at(-1);
    for (const link of links) {
      if (current && link.hash === `#${current.id}`) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  };
  addEventListener("scroll", () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}
