const stackLayers = [
  {
    id: "client",
    index: "00 / CLIENT",
    request: "Input starts at the client. The interface gives it a place to begin.",
    response: "The client receives a result and presents it back to the person."
  },
  {
    id: "frontend",
    index: "01 / FRONTEND",
    request: "The interface collects input and shapes a request.",
    response: "The interface updates to reflect the returned result."
  },
  {
    id: "api",
    index: "02 / API",
    request: "A defined boundary carries a request into the application.",
    response: "A response crosses the same boundary back to the client."
  },
  {
    id: "logic",
    index: "03 / APPLICATION",
    request: "Application logic checks the request and coordinates work.",
    response: "The application shapes the result for its response."
  },
  {
    id: "database",
    index: "04 / DATABASE",
    request: "The application reads or updates stored state.",
    response: "Relevant data returns to the application layer."
  },
  {
    id: "infrastructure",
    index: "05 / INFRASTRUCTURE",
    request: "The running environment hosts the parts of the system.",
    response: "The simulated cycle resolves back through the stack."
  }
];

const stackPlate = document.querySelector(".fullstack-stack-plate");
const layerControls = document.querySelectorAll("[data-stack-layer]");
const stackIndex = document.querySelector("[data-stack-index]");
const stackCopy = document.querySelector("[data-stack-copy]");
const stackState = document.querySelector("[data-stack-state]");
const runButton = document.querySelector("[data-run-request]");
const runLabel = document.querySelector("[data-run-label]");
const interfaceAction = document.querySelector("[data-interface-action]");
const interfaceStatus = document.querySelector("#interface-status");

function setActiveLayer(layerId, phase = "idle") {
  const index = stackLayers.findIndex((layer) => layer.id === layerId);

  if (index < 0) {
    return;
  }

  const selected = stackLayers[index];
  layerControls.forEach((control) => {
    const isActive = control.dataset.stackLayer === layerId;
    control.classList.toggle("is-active", isActive);
    control.classList.toggle("is-travelling", isActive && phase !== "idle");
    control.setAttribute("aria-pressed", String(isActive));
  });

  stackPlate.dataset.phase = phase;
  stackIndex.textContent = selected.index;
  stackCopy.textContent = phase === "response" ? selected.response : selected.request;
  stackState.textContent = phase === "request"
    ? "Request moving through stack"
    : phase === "response"
      ? "Response returning to client"
      : "Layer selected";
}

layerControls.forEach((control) => {
  control.addEventListener("click", () => {
    if (!runButton.disabled) {
      setActiveLayer(control.dataset.stackLayer);
    }
  });
});

function waitForStep() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 80 : 260));
}

async function runRequestSimulation() {
  runButton.disabled = true;
  runButton.setAttribute("aria-busy", "true");
  runLabel.textContent = "Request in motion";
  stackPlate.dataset.running = "true";

  for (const layer of stackLayers) {
    setActiveLayer(layer.id, "request");
    await waitForStep();
  }

  for (const layer of [...stackLayers].reverse()) {
    setActiveLayer(layer.id, "response");
    await waitForStep();
  }

  setActiveLayer("client");
  stackState.textContent = "Demo cycle complete";
  runLabel.textContent = "Run request simulation";
  runButton.disabled = false;
  runButton.removeAttribute("aria-busy");
  delete stackPlate.dataset.running;
}

runButton.addEventListener("click", runRequestSimulation);

interfaceAction.addEventListener("click", () => {
  interfaceStatus.textContent = "State / acknowledged locally";
  interfaceAction.classList.add("is-acknowledged");
  interfaceAction.setAttribute("aria-pressed", "true");
});
