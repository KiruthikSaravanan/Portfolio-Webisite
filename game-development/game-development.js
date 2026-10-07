const mapStops = {
  entry: {
    index: "01 / ENTRY",
    copy: "The player enters the space. A route begins to emerge.",
    state: "Start point selected",
    position: "112 335"
  },
  switch: {
    index: "02 / SWITCH",
    copy: "A mechanic gives the route a reason to change.",
    state: "Mechanic selected",
    position: "374 335"
  },
  object: {
    index: "03 / OBJECT",
    copy: "A point of focus draws the player deeper into the level.",
    state: "Target selected",
    position: "635 335"
  },
  exit: {
    index: "04 / EXIT",
    copy: "The path resolves at a transition to somewhere new.",
    state: "Exit selected",
    position: "730 125"
  }
};

const mapControls = document.querySelectorAll("[data-map-stop]");
const mapNodes = document.querySelectorAll("[data-map-node]");
const mapPlayer = document.querySelector("[data-map-player]");
const mapRoute = document.querySelector("[data-map-route]");
const mapIndex = document.querySelector("[data-map-index]");
const mapCopy = document.querySelector("[data-map-copy]");
const mapState = document.querySelector("[data-map-state]");

function selectMapStop(stopName) {
  const selected = mapStops[stopName];

  if (!selected) {
    return;
  }

  mapControls.forEach((control) => {
    const isCurrent = control.dataset.mapStop === stopName;
    control.classList.toggle("is-current", isCurrent);
    control.setAttribute("aria-pressed", String(isCurrent));
  });

  mapNodes.forEach((node) => {
    node.classList.toggle("is-current", node.dataset.mapNode === stopName);
  });

  mapPlayer.setAttribute("transform", `translate(${selected.position})`);
  mapIndex.textContent = selected.index;
  mapCopy.textContent = selected.copy;
  mapState.textContent = selected.state;
  mapRoute.dataset.currentStop = stopName;
}

mapControls.forEach((control) => {
  control.addEventListener("focus", () => {
    selectMapStop(control.dataset.mapStop);
  });

  control.addEventListener("click", () => {
    selectMapStop(control.dataset.mapStop);
  });
});
