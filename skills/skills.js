const skills = [
  {
    id: "linux", name: "Linux", column: "foundation", category: "engineering", state: "Practiced",
    description: "Systems, permissions, processes and SSH are part of the existing cybersecurity practice and audit-toolkit work.",
    connections: ["security", "bash", "networking"], projects: ["linux-audit"]
  },
  {
    id: "networking", name: "Networking", column: "foundation", category: "security", state: "Foundation",
    description: "TCP/IP, DNS, HTTP, ports and packet analysis underpin defensive investigation.",
    connections: ["security", "soc", "log-analysis", "linux"], projects: ["linux-audit"]
  },
  {
    id: "git", name: "Git / GitHub", column: "foundation", category: "engineering", state: "Practiced",
    description: "Version-control tooling supports the documented software and automation work.",
    connections: ["python", "web"], projects: ["cyber-memory", "linux-audit"]
  },
  {
    id: "fundamentals", name: "Security basics", column: "foundation", category: "security", state: "Foundation",
    description: "Security fundamentals frame the transition from system observations to investigation and response.",
    connections: ["security", "incident-response"], projects: ["cyber-memory", "linux-audit"]
  },
  {
    id: "security", name: "Security", column: "security", category: "security", state: "Building",
    description: "The central direction connects system knowledge with defensive analysis, incident handling and security memory.",
    connections: ["linux", "networking", "fundamentals", "soc", "log-analysis", "incident-response", "mitre", "python", "devops", "ai"], projects: ["cyber-memory", "linux-audit"]
  },
  {
    id: "soc", name: "SOC concepts", column: "security", category: "security", state: "Building",
    description: "Monitoring, alert review and triage are current study themes; this label does not claim professional SOC experience.",
    connections: ["security", "networking", "log-analysis", "incident-response"], projects: ["linux-audit"]
  },
  {
    id: "log-analysis", name: "Log analysis", column: "security", category: "security", state: "Building",
    description: "Reading event and system records helps develop investigation context and defensive reasoning.",
    connections: ["security", "networking", "soc", "incident-response"], projects: ["cyber-memory", "linux-audit"]
  },
  {
    id: "incident-response", name: "Incident response", column: "security", category: "security", state: "Building",
    description: "Incident handling links alert review, investigation context and response knowledge.",
    connections: ["security", "soc", "log-analysis", "mitre", "fundamentals"], projects: ["cyber-memory"]
  },
  {
    id: "mitre", name: "MITRE ATT&CK", column: "security", category: "security", state: "Building",
    description: "Technique mapping is part of the Cyber Memory Network project description and its security context.",
    connections: ["security", "incident-response"], projects: ["cyber-memory"]
  },
  {
    id: "python", name: "Python", column: "engineering", category: "engineering", state: "Building",
    description: "Programming supports automation and application logic in the Cyber Memory Network work.",
    connections: ["git", "automation", "security", "api"], projects: ["cyber-memory"]
  },
  {
    id: "bash", name: "Bash", column: "engineering", category: "engineering", state: "Practiced",
    description: "The Linux Security Audit Toolkit is described as a Bash-based report-collection tool.",
    connections: ["linux", "automation"], projects: ["linux-audit"]
  },
  {
    id: "api", name: "APIs / web", column: "engineering", category: "engineering", state: "Building",
    description: "HTML, CSS, JavaScript and API concepts connect interfaces to application logic and data.",
    connections: ["python", "web", "security"], projects: ["cyber-memory"]
  },
  {
    id: "postgresql", name: "SQL / PostgreSQL", column: "engineering", category: "engineering", state: "Building",
    description: "Structured data concepts support incident and indicator records in the Cyber Memory Network project description.",
    connections: ["security", "api", "python"], projects: ["cyber-memory"]
  },
  {
    id: "web", name: "HTML / CSS / JS", column: "engineering", category: "engineering", state: "Practiced",
    description: "Web fundamentals are used across the existing static portfolio and its interface work.",
    connections: ["api", "git"], projects: ["cyber-memory"]
  },
  {
    id: "cloud", name: "Cloud / AWS", column: "systems", category: "cloud", state: "Exploring",
    description: "AWS concepts including EC2, S3, IAM, VPC and CloudWatch are described as areas of exploration.",
    connections: ["devops", "security", "automation"], projects: []
  },
  {
    id: "devops", name: "DevOps", column: "systems", category: "cloud", state: "Exploring",
    description: "Docker, CI/CD, infrastructure and monitoring form an exploration path, not a production-expertise claim.",
    connections: ["cloud", "automation", "security"], projects: []
  },
  {
    id: "ai", name: "AI concepts", column: "systems", category: "ai", state: "Exploring",
    description: "AI-assisted development is a current tool-assisted direction; agents and retrieval workflows remain conceptual learning topics.",
    connections: ["automation", "security"], projects: ["cyber-memory"]
  },
  {
    id: "automation", name: "Automation", column: "systems", category: "engineering", state: "Next",
    description: "A next step that can connect scripting, cloud operations and defensive security workflows.",
    connections: ["python", "bash", "cloud", "devops", "ai"], projects: ["linux-audit", "cyber-memory"]
  }
];

const skillIds = new Set(skills.map((skill) => skill.id));
const skillConnections = [...new Set(
  skills.flatMap((skill) => skill.connections
    .filter((id) => skillIds.has(id))
    .map((id) => [skill.id, id].sort().join(":")))
)].map((connection) => connection.split(":"));

const projectDetails = {
  "cyber-memory": { label: "Cyber Memory Network", href: "../projects/#cyber-memory" },
  "linux-audit": { label: "Linux Security Audit Toolkit", href: "../projects/#linux-audit" }
};

const stateClass = (state) => state.toLowerCase().replace(/\s+/g, "-");
const skillNodes = new Map();
const connectionPaths = [];
const edgesSvg = document.querySelector("[data-skill-edges]");
const skillName = document.querySelector("[data-skill-name]");
const skillState = document.querySelector("[data-skill-state]");
const skillDescription = document.querySelector("[data-skill-description]");
const skillConnectionsOutput = document.querySelector("[data-skill-connections]");
const skillProjectsOutput = document.querySelector("[data-skill-projects]");
const filterStatus = document.querySelector("[data-skill-filter-status]");
let selectedSkillId = null;
let activeFilter = "all";

function renderSkillNodes() {
  skills.forEach((skill) => {
    const column = document.querySelector(`[data-skill-column="${skill.column}"]`);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `skills-node skills-node--${stateClass(skill.state)}`;
    button.dataset.skillId = skill.id;
    button.dataset.category = skill.category;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `${skill.name}, state: ${skill.state}`);

    const name = document.createElement("span");
    name.className = "skills-node-name";
    name.textContent = skill.name;
    const state = document.createElement("span");
    state.className = "skills-node-state editorial-label";
    state.textContent = skill.state;
    button.append(name, state);
    column.append(button);
    skillNodes.set(skill.id, button);
  });
}

function drawConnections() {
  edgesSvg.replaceChildren();
  const columnX = { foundation: 125, security: 375, engineering: 625, systems: 875 };
  const rowY = { 0: 110, 1: 239, 2: 368, 3: 497, 4: 626 };
  const rows = {};

  skills.forEach((skill) => {
    const row = rows[skill.column] || 0;
    rows[skill.column] = row + 1;
    skill.mapPosition = { x: columnX[skill.column], y: rowY[row] };
  });

  skillConnections.forEach(([fromId, toId]) => {
    const from = skills.find((skill) => skill.id === fromId);
    const to = skills.find((skill) => skill.id === toId);
    if (!from || !to) return;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const start = from.mapPosition;
    const end = to.mapPosition;
    const curve = Math.max(24, Math.abs(end.x - start.x) * 0.34);
    const direction = end.x >= start.x ? 1 : -1;
    path.setAttribute("d", `M ${start.x} ${start.y} C ${start.x + curve * direction} ${start.y}, ${end.x - curve * direction} ${end.y}, ${end.x} ${end.y}`);
    path.dataset.connection = `${fromId}:${toId}`;
    path.setAttribute("class", "skills-map-edge");
    edgesSvg.append(path);
    connectionPaths.push({ fromId, toId, element: path });
  });
}

function renderSkillPanel(skill) {
  skillState.textContent = skill.state;
  skillState.className = `editorial-label skills-panel-state skills-panel-state--${stateClass(skill.state)}`;
  skillName.textContent = skill.name;
  skillDescription.textContent = skill.description;

  const related = skill.connections
    .map((id) => skills.find((item) => item.id === id))
    .filter(Boolean);
  skillConnectionsOutput.replaceChildren();
  if (!related.length) {
    skillConnectionsOutput.textContent = "No mapped links yet.";
  } else {
    related.forEach((item) => {
      const chip = document.createElement("span");
      chip.textContent = item.name;
      skillConnectionsOutput.append(chip);
    });
  }

  skillProjectsOutput.replaceChildren();
  const projects = skill.projects.map((id) => projectDetails[id]).filter(Boolean);
  if (!projects.length) {
    skillProjectsOutput.textContent = "No project link assigned.";
  } else {
    projects.forEach((project) => {
      const link = document.createElement("a");
      link.href = project.href;
      link.textContent = `${project.label} ↗`;
      skillProjectsOutput.append(link);
    });
  }
}

function updateMapEmphasis() {
  const selected = skills.find((skill) => skill.id === selectedSkillId);
  const relatedIds = new Set(selected ? selected.connections : []);
  if (selected) relatedIds.add(selected.id);

  skillNodes.forEach((button, id) => {
    const categoryMatch = activeFilter === "all" || button.dataset.category === activeFilter;
    const related = !selected || relatedIds.has(id);
    button.classList.toggle("is-dimmed", !categoryMatch || (activeFilter === "all" && !related));
    button.classList.toggle("is-selected", id === selectedSkillId);
    button.classList.toggle("is-related", Boolean(selected) && relatedIds.has(id) && id !== selectedSkillId);
    button.setAttribute("aria-pressed", String(id === selectedSkillId));
  });

  connectionPaths.forEach(({ fromId, toId, element }) => {
    const connected = selected && (fromId === selected.id || toId === selected.id);
    const categoryMatches = activeFilter === "all"
      || skillNodes.get(fromId).dataset.category === activeFilter
      || skillNodes.get(toId).dataset.category === activeFilter;
    element.classList.toggle("is-active", Boolean(connected));
    element.classList.toggle("is-dimmed", Boolean(selected && !connected) || !categoryMatches);
  });
}

function selectSkill(id) {
  const skill = skills.find((item) => item.id === id);
  if (!skill) return;
  selectedSkillId = id;
  renderSkillPanel(skill);
  updateMapEmphasis();
}

function applyFilter(filter) {
  activeFilter = filter;
  selectedSkillId = null;
  document.querySelectorAll("[data-skill-filter]").forEach((button) => {
    const active = button.dataset.skillFilter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const matching = skills.filter((skill) => filter === "all" || skill.category === filter);
  filterStatus.textContent = filter === "all"
    ? `Showing all ${skills.length} mapped topics.`
    : `Highlighting ${matching.length} ${filter === "cloud" ? "cloud / DevOps" : filter} topics; the full map remains visible.`;
  skillState.textContent = "SELECT A NODE";
  skillState.className = "editorial-label skills-panel-state";
  skillName.textContent = "Connections, not scores.";
  skillDescription.textContent = "Choose any area to see a short note, its connected topics, and related project work.";
  skillConnectionsOutput.textContent = "—";
  skillProjectsOutput.textContent = "—";
  updateMapEmphasis();
}

renderSkillNodes();
drawConnections();

document.querySelector("[data-skill-map]").addEventListener("focusin", (event) => {
  const button = event.target.closest("[data-skill-id]");
  if (button) selectSkill(button.dataset.skillId);
});

skillNodes.forEach((button, id) => {
  button.addEventListener("click", () => selectSkill(id));
  button.addEventListener("mouseenter", () => selectSkill(id));
});

document.querySelectorAll("[data-skill-filter]").forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.skillFilter));
});

const focusedSkillId = new URLSearchParams(window.location.search).get("focus");
if (focusedSkillId && skillNodes.has(focusedSkillId)) {
  selectSkill(focusedSkillId);
}
