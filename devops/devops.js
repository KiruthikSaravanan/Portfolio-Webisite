const pipelineCopy = {
  code: {
    index: "01 / SOURCE",
    copy: "Changes are versioned before they enter the delivery flow."
  },
  build: {
    index: "02 / BUILD",
    copy: "A defined recipe turns source into a repeatable artifact."
  },
  test: {
    index: "03 / TEST",
    copy: "Checks provide a pause for problems before release."
  },
  deploy: {
    index: "04 / DEPLOY",
    copy: "A verified artifact moves toward its target environment."
  },
  monitor: {
    index: "05 / MONITOR",
    copy: "Signals from a running service help guide the next change."
  }
};

const pipelineControls = document.querySelectorAll("[data-pipeline-step]");
const pipelineIndex = document.querySelector("[data-pipeline-index]");
const pipelineDescription = document.querySelector("[data-pipeline-copy]");

function selectPipelineStep(stepName) {
  const selected = pipelineCopy[stepName];

  if (!selected) {
    return;
  }

  pipelineControls.forEach((control) => {
    const isActive = control.dataset.pipelineStep === stepName;
    control.classList.toggle("is-active", isActive);
    control.setAttribute("aria-pressed", String(isActive));
  });

  pipelineIndex.textContent = selected.index;
  pipelineDescription.textContent = selected.copy;
}

pipelineControls.forEach((control) => {
  control.addEventListener("focus", () => {
    selectPipelineStep(control.dataset.pipelineStep);
  });

  control.addEventListener("mouseenter", () => {
    selectPipelineStep(control.dataset.pipelineStep);
  });

  control.addEventListener("click", () => {
    selectPipelineStep(control.dataset.pipelineStep);
  });

  if (control instanceof SVGGElement) {
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPipelineStep(control.dataset.pipelineStep);
      }
    });
  }
});
