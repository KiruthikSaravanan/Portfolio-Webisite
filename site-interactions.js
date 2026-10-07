(() => {
const routeOrder = [
  "/",
  "/cybersecurity/",
  "/devops/",
  "/game-development/",
  "/full-stack/",
  "/cloud/",
  "/ai/",
  "/projects/",
  "/skills/"
];

const routeLabels = {
  "/cybersecurity/": "Cyber Memory Network / Phase I + Linux Security Audit Toolkit",
  "/devops/": "DevOps / future automation direction — no deployed project is claimed",
  "/game-development/": "Game development / no completed project is documented",
  "/full-stack/": "Cyber Memory Network / interface and API concepts",
  "/cloud/": "Cyber Memory Network / conceptual future cloud architecture",
  "/ai/": "Cyber Memory Network / future AI extension, not implemented",
  "/projects/": "Project archive / documented work",
  "/skills/": "Knowledge map / connected learning"
};

const interactionRoot = document.documentElement;
const pageShell = document.querySelector(".page-shell");
const main = document.querySelector("main");
const currentUrl = new URL(window.location.href);
const currentPath = currentUrl.pathname.endsWith("/")
  ? currentUrl.pathname
  : `${currentUrl.pathname}/`;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 900px)");

function routeIndex(path) {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return routeOrder.indexOf(normalized);
}

function relativeRoute(route) {
  return currentPath === "/" ? `.${route}` : `..${route}`;
}

function addGlobalNavigation() {
  if (!main) return;

  const nav = document.createElement("nav");
  nav.className = "global-archive-nav";
  nav.setAttribute("aria-label", "Work and learning");

  const current = document.createElement("span");
  current.className = "global-current-route editorial-label";
  current.setAttribute("aria-current", "page");
  current.textContent = currentPath === "/"
    ? "Index / directions"
    : (document.title.split(" — ")[0] || "Current section");
  nav.append(current);

  [
    { route: "/projects/", label: "Work archive", marker: "Projects" },
    { route: "/skills/", label: "Learning system", marker: "Skills" }
  ].forEach(({ route, label, marker }) => {
    const link = document.createElement("a");
    link.href = relativeRoute(route);
    link.setAttribute("aria-label", `${label} / ${marker}`);
    const small = document.createElement("span");
    small.className = "editorial-label";
    small.textContent = label;
    const strong = document.createElement("strong");
    strong.textContent = `${marker} ↗`;
    link.append(small, strong);
    if (route === currentPath) link.setAttribute("aria-current", "page");
    nav.append(link);
  });

  main.insertAdjacentElement("afterend", nav);
}

function addDeskIndex() {
  const routeEntries = [
    { route: "/", number: "00", label: "Index" },
    { route: "/cybersecurity/", number: "01", label: "Security trace" },
    { route: "/devops/", number: "02", label: "Delivery line" },
    { route: "/game-development/", number: "03", label: "Play space" },
    { route: "/full-stack/", number: "04", label: "Interface / logic" },
    { route: "/cloud/", number: "05", label: "Infrastructure" },
    { route: "/ai/", number: "06", label: "Model notes" },
    { route: "/projects/", number: "07", label: "Project files" },
    { route: "/skills/", number: "08", label: "Knowledge map" }
  ];
  const details = document.createElement("details");
  details.className = "desk-index";

  const summary = document.createElement("summary");
  summary.className = "desk-index-trigger";
  const triggerMark = document.createElement("span");
  triggerMark.className = "desk-index-trigger-mark";
  triggerMark.setAttribute("aria-hidden", "true");
  triggerMark.textContent = "+";
  const triggerLabel = document.createElement("span");
  triggerLabel.textContent = "Field index";
  const triggerCount = document.createElement("span");
  triggerCount.className = "desk-index-trigger-count";
  triggerCount.textContent = "09";
  summary.append(triggerMark, triggerLabel, triggerCount);

  const nav = document.createElement("nav");
  nav.className = "desk-index-sheet";
  nav.setAttribute("aria-label", "All portfolio sections");

  routeEntries.forEach(({ route, number, label }) => {
    const link = document.createElement("a");
    link.className = "desk-index-link";
    link.href = relativeRoute(route);
    if (route === currentPath) link.setAttribute("aria-current", "page");

    const index = document.createElement("span");
    index.className = "desk-index-number";
    index.textContent = number;
    const name = document.createElement("span");
    name.className = "desk-index-name";
    name.textContent = label;
    const arrow = document.createElement("span");
    arrow.className = "desk-index-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    link.append(index, name, arrow);
    nav.append(link);
  });

  details.append(summary, nav);
  document.body.append(details);
}

function addDirectionConnection() {
  const connectionCopy = routeLabels[currentPath];
  if (!main || !connectionCopy || !currentPath.match(/^\/(cybersecurity|devops|game-development|full-stack|cloud|ai)\/$/)) return;

  const relation = document.createElement("aside");
  relation.className = "global-direction-work";
  const text = document.createElement("p");
  text.className = "editorial-label";
  text.textContent = "Direction / related work";
  const description = document.createElement("span");
  description.textContent = connectionCopy;
  const link = document.createElement("a");
  const projectAnchor = ["/cybersecurity/", "/full-stack/", "/cloud/", "/ai/"].includes(currentPath)
    ? "#cyber-memory"
    : currentPath === "/devops/" || currentPath === "/game-development/"
      ? "#work-future-title"
      : "";
  link.href = `${relativeRoute("/projects/")}${projectAnchor}`;
  link.className = "editorial-label";
  link.textContent = currentPath === "/cybersecurity/"
    ? "Open project archive ↗"
    : "Open related archive ↗";
  relation.append(text, description, link);
  main.insertAdjacentElement("afterend", relation);
}

function markCurrentRoute() {
  document.querySelectorAll('nav a[href], .site-header a[href]').forEach((link) => {
    if (link.target || link.hasAttribute("download")) return;
    try {
      const target = new URL(link.href);
      const targetPath = target.pathname.endsWith("/") ? target.pathname : `${target.pathname}/`;
      if (target.origin === currentUrl.origin && targetPath === currentPath) {
        link.setAttribute("aria-current", "page");
      }
    } catch (error) {
      console.warn("A navigation link could not be checked.", error);
    }
  });
}

function setUpSectionReveals() {
  if (!main || !("IntersectionObserver" in window)) return;
  const sections = [...main.children].filter((element) => element.tagName === "SECTION");
  sections.forEach((section, index) => {
    section.dataset.globalReveal = "";
    if (index === 0 || section.getBoundingClientRect().top < window.innerHeight * 0.85) {
      section.classList.add("is-revealed");
    }
  });
  interactionRoot.classList.add("has-global-motion");

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

  sections.forEach((section) => {
    if (!section.classList.contains("is-revealed")) observer.observe(section);
  });
}

function addProgressAndTopControl() {
  const progress = document.createElement("div");
  progress.className = "global-scroll-progress";
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-label", "Page scroll progress");
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");
  progress.setAttribute("aria-valuenow", "0");
  const progressFill = document.createElement("span");
  progress.append(progressFill);

  const topButton = document.createElement("button");
  topButton.className = "global-back-to-top editorial-label";
  topButton.type = "button";
  topButton.textContent = "↑ Top";
  topButton.setAttribute("aria-label", "Back to top");
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  });

  document.body.append(progress, topButton);
  let scrollFrame = 0;

  function updateScrollUI() {
    scrollFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0
      ? Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100)))
      : 0;
    progress.style.setProperty("--scroll-progress", `${percentage}%`);
    progress.setAttribute("aria-valuenow", String(percentage));
    topButton.classList.toggle("is-visible", window.scrollY > 650);
  }

  function queueScrollUpdate() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollUI);
  }

  window.addEventListener("scroll", queueScrollUpdate, { passive: true });
  window.addEventListener("resize", queueScrollUpdate);
  updateScrollUI();
}

function addCursorAndMagnetics() {
  if (!hasFinePointer.matches || prefersReducedMotion.matches) return;

  const cursor = document.createElement("div");
  cursor.className = "global-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);

  let pointerFrame = 0;
  let pointerX = -30;
  let pointerY = -30;

  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.classList.add("is-visible");
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      cursor.style.setProperty("--cursor-x", `${pointerX}px`);
      cursor.style.setProperty("--cursor-y", `${pointerY}px`);
      pointerFrame = 0;
    });
  }, { passive: true });

  document.addEventListener("pointerover", (event) => {
    const interactive = event.target.closest("a, button, summary, [role='button']");
    const visual = event.target.closest(".work-flow-figure, .skills-map-plate, .project-visual, .hero-image");
    cursor.classList.toggle("is-active", Boolean(interactive || visual));
    cursor.classList.toggle("is-visual", Boolean(visual));
    cursor.textContent = visual
      ? "EXPLORE"
      : interactive
        ? (interactive.dataset.cursorLabel || "OPEN")
        : "";
  });

  document.querySelectorAll(
    ".site-header .menu-link, .global-archive-nav a, .global-direction-work a, .page-footer a, .security-footer a, .devops-footer a, .game-page-nav a, .fullstack-page-nav a, .cloud-page-nav a, .ai-page-nav a, .work-footer a, .skills-page-nav a, .project-link, .work-case-jump"
  ).forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 4;
      element.style.setProperty("--mag-x", `${x.toFixed(1)}px`);
      element.style.setProperty("--mag-y", `${y.toFixed(1)}px`);
    });
    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--mag-x", "0px");
      element.style.setProperty("--mag-y", "0px");
    });
  });

  const heroStage = document.querySelector(".hero-stage");
  if (heroStage) {
    const heroLayers = [...heroStage.querySelectorAll(".hero-ghost-word, .hero-stage-index, .hero-red-block, .hero-image")];
    heroStage.addEventListener("pointermove", (event) => {
      const bounds = heroStage.getBoundingClientRect();
      const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroLayers.forEach((layer) => {
        const depth = layer.classList.contains("hero-ghost-word") || layer.classList.contains("hero-image") ? -3 : 2;
        layer.style.setProperty("--hero-shift-x", `${(pointerX * depth).toFixed(2)}px`);
        layer.style.setProperty("--hero-shift-y", `${(pointerY * depth).toFixed(2)}px`);
      });
    });
    heroStage.addEventListener("pointerleave", () => {
      heroLayers.forEach((layer) => {
        layer.style.setProperty("--hero-shift-x", "0px");
        layer.style.setProperty("--hero-shift-y", "0px");
      });
    });
  }
}

function navigateWithTransition(targetUrl, event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (prefersReducedMotion.matches || targetUrl.origin !== currentUrl.origin) return;
  if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) return;

  event.preventDefault();
  const currentIndex = routeIndex(currentPath);
  const targetIndex = routeIndex(targetUrl.pathname);
  const direction = currentIndex >= 0 && targetIndex >= 0 && targetIndex < currentIndex ? "back" : "forward";

  try {
    sessionStorage.setItem("kiruthik-route-direction", direction);
  } catch (error) {
    console.warn("The route transition preference could not be saved.", error);
  }

  interactionRoot.classList.add(direction === "back" ? "is-route-leaving-back" : "is-route-leaving");
  const delay = prefersReducedMotion.matches ? 0 : 220;
  window.setTimeout(() => window.location.assign(targetUrl.href), delay);
}

function setUpTransitionsAndKeyboard() {
  let enteringDirection = "forward";
  try {
    enteringDirection = sessionStorage.getItem("kiruthik-route-direction") || "forward";
    sessionStorage.removeItem("kiruthik-route-direction");
  } catch (error) {
    console.warn("The route transition direction could not be read.", error);
  }

  if (!prefersReducedMotion.matches) {
    interactionRoot.classList.add(enteringDirection === "back" ? "is-route-entering-back" : "is-route-entering");
    pageShell?.addEventListener("animationend", (event) => {
      if (event.target === pageShell) {
        interactionRoot.classList.remove("is-route-entering", "is-route-entering-back");
      }
    }, { once: true });
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;
    let destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (error) {
      console.warn("A navigation destination could not be read.", error);
      return;
    }
    navigateWithTransition(destination, event);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const expanded = document.querySelector("details[open]");
      if (expanded) {
        expanded.open = false;
        expanded.querySelector("summary")?.focus();
        return;
      }
    }

    if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    if (event.target.closest("input, textarea, select, [contenteditable='true'], a, button, summary")) return;
    const index = routeIndex(currentPath);
    const destinationIndex = event.key === "ArrowRight" ? index + 1 : index - 1;
    if (index < 0 || !routeOrder[destinationIndex]) return;
    event.preventDefault();
    const destination = new URL(relativeRoute(routeOrder[destinationIndex]), window.location.href);
    navigateWithTransition(destination, {
      defaultPrevented: false,
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      preventDefault() {}
    });
  });
}

addGlobalNavigation();
addDeskIndex();
addDirectionConnection();
markCurrentRoute();
setUpSectionReveals();
addProgressAndTopControl();
addCursorAndMagnetics();
setUpTransitionsAndKeyboard();
})();
