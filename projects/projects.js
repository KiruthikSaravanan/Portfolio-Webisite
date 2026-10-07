const workFilters = document.querySelectorAll("[data-work-filter]");
const workItems = document.querySelectorAll("[data-project]");
const filterStatus = document.querySelector("[data-work-filter-status]");
const workNodes = document.querySelectorAll("[data-work-node]");
const workNodeCopy = document.querySelector("[data-work-node-copy]");

const filterNames = {
  all: "all disciplines",
  security: "security",
  cloud: "cloud",
  devops: "DevOps",
  "full-stack": "full stack",
  ai: "AI",
  "game-development": "game development"
};

const workNodeNotes = {
  logs: "Events and records serve as investigation inputs; no live feed is connected.",
  detection: "A signal is reviewed to determine whether it should become an incident record.",
  alert: "An analyst reviews and triages an alert before recording or escalating it.",
  incident: "A case brings relevant events and indicators into an investigation context.",
  ioc: "Indicators are tracked as records linked to an incident.",
  attack: "MITRE ATT&CK techniques provide a shared reference for mapping incident context.",
  memory: "The conceptual model connects security records so context can be revisited.",
  investigation: "An investigator reviews related context; automated recommendations are not claimed."
};

function selectWorkNode(node) {
  const note = workNodeNotes[node.dataset.workNode];

  if (!note) {
    return;
  }

  workNodes.forEach((button) => {
    const selected = button === node;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  workNodeCopy.textContent = note;
}

workNodes.forEach((node) => {
  node.addEventListener("focus", () => selectWorkNode(node));
  node.addEventListener("click", () => selectWorkNode(node));
});

function applyWorkFilter(filter) {
  let matchingProjects = 0;

  workFilters.forEach((button) => {
    const selected = button.dataset.workFilter === filter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  workItems.forEach((item) => {
    const categories = item.dataset.categories.split(/\s+/).filter(Boolean);
    const matches = filter === "all" || categories.includes(filter);
    item.classList.toggle("is-muted", !matches);

    if (matches && !item.dataset.project.startsWith("slot-")) {
      matchingProjects += 1;
    }
  });

  filterStatus.textContent = filter === "all"
    ? `Showing ${matchingProjects} documented builds. Unfiled disciplines remain open.`
    : matchingProjects
      ? `Showing ${matchingProjects} documented build${matchingProjects === 1 ? "" : "s"} filed under ${filterNames[filter]}.`
      : `No documented build is filed under ${filterNames[filter]} yet.`;
}

workFilters.forEach((button) => {
  button.addEventListener("click", () => applyWorkFilter(button.dataset.workFilter));
});

function selectProjectFromHash() {
  if (window.location.hash === "#cyber-memory") {
    const cyberMemory = document.querySelector("#cyber-memory");
    const caseFile = cyberMemory?.querySelector(".work-case-file");
    if (cyberMemory && caseFile) {
      cyberMemory.classList.add("is-selected");
      caseFile.open = true;
    }
  } else if (window.location.hash === "#linux-audit") {
    document.querySelector("#linux-audit")?.classList.add("is-selected");
  }
}

window.addEventListener("load", selectProjectFromHash, { once: true });
window.addEventListener("hashchange", selectProjectFromHash);
