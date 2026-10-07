const cloudNodeDetails = {
  edge: {
    title: "Internet / edge",
    copy: "A request enters the system at an exposed boundary."
  },
  router: {
    title: "Traffic router",
    copy: "Routing directs a request toward an available service path."
  },
  "service-a": {
    title: "Region 01 / service",
    copy: "A conceptual application node in the first region."
  },
  "service-b": {
    title: "Region 02 / service",
    copy: "A second conceptual service path provides another destination."
  },
  data: {
    title: "Database / state",
    copy: "Persistent application records live behind the service boundary."
  },
  storage: {
    title: "Object storage",
    copy: "Files and build artifacts can be stored separately from records."
  }
};

const cloudNodes = document.querySelectorAll("[data-cloud-node]");
const cloudMap = document.querySelector(".cloud-map-plate");
const cloudNodeTitle = document.querySelector("[data-cloud-node-title]");
const cloudNodeCopy = document.querySelector("[data-cloud-node-copy]");
const cloudFlowButton = document.querySelector("[data-cloud-flow]");
const cloudFlowLabel = document.querySelector("[data-cloud-flow-label]");
const cloudFlowStatus = document.querySelector("[data-cloud-flow-status]");
const failoverPlate = document.querySelector(".cloud-failover-plate");
const failoverToggle = document.querySelector("[data-failover-toggle]");
const failoverCopy = document.querySelector("[data-failover-copy]");
const failoverStateLabel = document.querySelector("[data-failover-state-label]");

function selectCloudNode(nodeId) {
  const detail = cloudNodeDetails[nodeId];

  if (!detail) {
    return;
  }

  cloudNodes.forEach((node) => {
    const connectedLayers = node.dataset.links.split(" ");
    const selectedLinks = document.querySelector(`[data-cloud-node="${nodeId}"]`).dataset.links.split(" ");
    const isSelected = node.dataset.cloudNode === nodeId;
    const isRelated = connectedLayers.some((link) => selectedLinks.includes(link));

    node.classList.toggle("is-selected", isSelected);
    node.classList.toggle("is-related", isRelated && !isSelected);
    node.classList.toggle("is-dimmed", !isRelated);
    node.setAttribute("aria-pressed", String(isSelected));
  });

  document.querySelectorAll(".cloud-route").forEach((route) => {
    const connectedLayers = route.dataset.cloudRoute.split(" ");
    const selectedLinks = document.querySelector(`[data-cloud-node="${nodeId}"]`).dataset.links.split(" ");
    route.classList.toggle(
      "is-highlighted",
      connectedLayers.some((link) => selectedLinks.includes(link))
    );
  });

  cloudNodeTitle.textContent = detail.title;
  cloudNodeCopy.textContent = detail.copy;
}

cloudNodes.forEach((node) => {
  node.addEventListener("mouseenter", () => {
    selectCloudNode(node.dataset.cloudNode);
  });

  node.addEventListener("focus", () => {
    selectCloudNode(node.dataset.cloudNode);
  });

  node.addEventListener("click", () => {
    selectCloudNode(node.dataset.cloudNode);
  });

  if (node instanceof SVGGElement) {
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCloudNode(node.dataset.cloudNode);
      }
    });
  }
});

let flowTimeout;

cloudFlowButton.addEventListener("click", () => {
  window.clearTimeout(flowTimeout);
  cloudFlowButton.disabled = true;
  cloudFlowButton.setAttribute("aria-busy", "true");
  cloudFlowLabel.textContent = "Request in transit";
  cloudFlowStatus.textContent = "Request → regions → response";
  cloudMap.dataset.flowing = "true";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  flowTimeout = window.setTimeout(() => {
    cloudMap.dataset.flowing = "false";
    cloudFlowButton.disabled = false;
    cloudFlowButton.removeAttribute("aria-busy");
    cloudFlowLabel.textContent = "Simulate request";
    cloudFlowStatus.textContent = "Simulation complete / no live request";
  }, reducedMotion ? 900 : 3200);
});

failoverToggle.addEventListener("click", () => {
  const failed = failoverPlate.dataset.failoverState !== "failed";
  failoverPlate.dataset.failoverState = failed ? "failed" : "normal";
  failoverToggle.setAttribute("aria-pressed", String(failed));
  failoverToggle.textContent = failed ? "Restore node A" : "Simulate node A failure";
  failoverStateLabel.textContent = failed
    ? "Node A unavailable / route shifts to B"
    : "Normal / both nodes available";
  failoverCopy.textContent = failed
    ? "In this conceptual model, traffic moves to node B while node A is unavailable."
    : "Both paths are available in this conceptual model.";
});
