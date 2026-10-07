const aiStages = [
  {
    id: "input",
    index: "01 / INPUT",
    copy: "Raw information enters the system before it has useful context."
  },
  {
    id: "context",
    index: "02 / CONTEXT",
    copy: "Relevant information frames what the model is asked to consider."
  },
  {
    id: "model",
    index: "03 / MODEL",
    copy: "A model processes supplied information; its output still needs review."
  },
  {
    id: "output",
    index: "04 / OUTPUT",
    copy: "A response or suggested action returns to a person or application."
  }
];

const aiTools = {
  search: {
    title: "Search / retrieve",
    copy: "A conceptual tool could find relevant documents or reference material."
  },
  logs: {
    title: "Logs / inspect",
    copy: "A workflow could gather records for a person to review."
  },
  database: {
    title: "Database / look up",
    copy: "A tool could request related records from an available data source."
  },
  api: {
    title: "API / connect",
    copy: "An API could pass a structured request between systems."
  }
};

const flowPlate = document.querySelector(".ai-flow-plate");
const stageButtons = document.querySelectorAll("[data-ai-stage]");
const stageIndex = document.querySelector("[data-ai-stage-index]");
const stageCopy = document.querySelector("[data-ai-stage-copy]");
const flowStatus = document.querySelector("[data-ai-flow-status]");
const runButton = document.querySelector("[data-ai-run]");
const runLabel = document.querySelector("[data-ai-run-label]");
const toolButtons = document.querySelectorAll("[data-ai-tool]");
const toolTitle = document.querySelector("[data-ai-tool-title]");
const toolCopy = document.querySelector("[data-ai-tool-copy]");

function selectStage(stageId, isRunning = false) {
  const stage = aiStages.find((item) => item.id === stageId);

  if (!stage) {
    return;
  }

  stageButtons.forEach((button) => {
    const active = button.dataset.aiStage === stageId;
    button.classList.toggle("is-active", active);
    button.classList.toggle("is-travelling", active && isRunning);
    button.setAttribute("aria-pressed", String(active));
  });

  flowPlate.dataset.activeStage = stageId;
  stageIndex.textContent = stage.index;
  stageCopy.textContent = stage.copy;
  flowStatus.textContent = isRunning ? "Information moving through pipeline" : "Stage selected";
}

stageButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    if (!runButton.disabled) {
      selectStage(button.dataset.aiStage);
    }
  });

  button.addEventListener("focus", () => {
    if (!runButton.disabled) {
      selectStage(button.dataset.aiStage);
    }
  });

  button.addEventListener("click", () => {
    if (!runButton.disabled) {
      selectStage(button.dataset.aiStage);
    }
  });
});

function waitForStage() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 100 : 500));
}

async function traceInformation() {
  runButton.disabled = true;
  runButton.setAttribute("aria-busy", "true");
  runLabel.textContent = "Information in motion";
  flowPlate.dataset.flowing = "true";

  for (const stage of aiStages) {
    selectStage(stage.id, true);
    await waitForStage();
  }

  flowPlate.dataset.flowing = "false";
  selectStage("output");
  flowStatus.textContent = "Conceptual trace complete";
  runLabel.textContent = "Trace the information";
  runButton.disabled = false;
  runButton.removeAttribute("aria-busy");
}

runButton.addEventListener("click", traceInformation);

function selectTool(toolId) {
  const tool = aiTools[toolId];

  if (!tool) {
    return;
  }

  toolButtons.forEach((button) => {
    const active = button.dataset.aiTool === toolId;
    button.classList.toggle("is-selected", active);
    button.setAttribute("aria-pressed", String(active));
  });

  toolTitle.textContent = tool.title;
  toolCopy.textContent = tool.copy;
}

toolButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => selectTool(button.dataset.aiTool));
  button.addEventListener("focus", () => selectTool(button.dataset.aiTool));
  button.addEventListener("click", () => selectTool(button.dataset.aiTool));
});
