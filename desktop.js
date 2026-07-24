const platformTabs = Array.from(document.querySelectorAll("[data-platform-tab]"));
const platformPanels = Array.from(document.querySelectorAll("[data-platform-panel]"));
const openNotes = Array.from(document.querySelectorAll("[data-open-note]"));

function inferredPlatform() {
  const requested = new URLSearchParams(window.location.search).get("platform");
  if (requested === "mac" || requested === "windows") return requested;
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("windows") ? "windows" : "mac";
}

function selectPlatform(platform) {
  platformTabs.forEach((tab) => {
    const selected = tab.dataset.platformTab === platform;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  platformPanels.forEach((panel) => {
    panel.hidden = panel.dataset.platformPanel !== platform;
  });
}

platformTabs.forEach((tab) => {
  tab.addEventListener("click", () => selectPlatform(tab.dataset.platformTab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = platformTabs.indexOf(tab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = platformTabs[(currentIndex + direction + platformTabs.length) % platformTabs.length];
    selectPlatform(next.dataset.platformTab);
    next.focus();
  });
});

document.querySelectorAll("[data-open-app]").forEach((link) => {
  link.addEventListener("click", () => {
    window.setTimeout(() => {
      openNotes.forEach((note) => {
        note.hidden = false;
      });
    }, 1000);
  });
});

selectPlatform(inferredPlatform());
