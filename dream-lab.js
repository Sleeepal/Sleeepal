const header = document.querySelector("[data-dream-header]");
const progress = document.querySelector("[data-dream-progress]");

function updateScrollState() {
  const y = window.scrollY;
  const available = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const ratio = Math.min(1, Math.max(0, y / available));

  header?.classList.toggle("is-scrolled", y > 12);
  if (progress) progress.style.transform = `scaleX(${ratio})`;
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();
