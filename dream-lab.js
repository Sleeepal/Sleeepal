const STORAGE_KEY = "sleeepal.dreamTrajectory.v1";
const VALID_STATUSES = new Set(["draft", "confirmed", "paused"]);
const ARTIFACTS = {
  auto: {
    label: "一件可在浏览器打开的私人小工具",
    success: "能打开、完成最重要的一次任务，并由你判断是否值得继续修改。",
  },
  tool: {
    label: "一个围绕核心任务设计的私人小工具",
    success: "无需学习复杂设置，就能完成最重要的一次个人任务。",
  },
  site: {
    label: "一个可以打开、演示和继续修改的网站",
    success: "目标用户能在一次体验里看懂价值并完成核心操作。",
  },
  workflow: {
    label: "一条可检查、可暂停的自动化工作流",
    success: "至少稳定完成一次重复流程，并保留人工确认和失败记录。",
  },
  agent: {
    label: "一个有明确权限边界的专属 Agent 助手",
    success: "能基于指定资料完成一次协助任务，所有外部动作先征求同意。",
  },
};

const header = document.querySelector("[data-dream-header]");
const pageProgress = document.querySelector("[data-dream-progress]");
const trajectory = document.querySelector("[data-trajectory]");
const trajectoryProgress = document.querySelector("[data-trajectory-progress]");
const workspace = document.querySelector(".dream-workspace");
const form = document.querySelector("[data-dream-form]");
const formStatus = document.querySelector("[data-dream-form-status]");
const submitButton = document.querySelector("[data-dream-submit]");
const wishInput = document.querySelector("#dream-wish");
const wishMeter = document.querySelector("#dream-wish-meter");
const artifactInput = document.querySelector("#dream-artifact");
const constraintInput = document.querySelector("#dream-constraint");
const localConsent = document.querySelector("#dream-local-consent");
const card = document.querySelector("[data-dream-card]");
const cardTitle = document.querySelector("[data-card-title]");
const cardWish = document.querySelector("[data-card-wish]");
const cardArtifact = document.querySelector("[data-card-artifact]");
const cardSuccess = document.querySelector("[data-card-success]");
const cardBoundary = document.querySelector("[data-card-boundary]");
const cardState = document.querySelector("[data-card-state]");
const cardBriefTitle = document.querySelector("[data-card-brief-title]");
const cardBriefNote = document.querySelector("[data-card-brief-note]");
const cardForgeNote = document.querySelector("[data-card-forge-note]");
const cardStatus = document.querySelector("[data-dream-card-status]");
const confirmButton = document.querySelector("[data-dream-confirm]");
const editButton = document.querySelector("[data-dream-edit]");
const pauseButton = document.querySelector("[data-dream-pause]");
const exportButton = document.querySelector("[data-dream-export]");
const deleteButton = document.querySelector("[data-dream-delete]");

let activeTrajectory = null;
let isGenerating = false;
let deleteResetTimer = null;

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `dream-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function shortTitle(wish) {
  const characters = Array.from(wish);
  const visible = characters.slice(0, 28).join("");
  return characters.length > 28 ? `${visible}…` : visible;
}

function setMessage(node, message, isError = false) {
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("is-error", isError);
}

function updateWishMeter() {
  if (!wishInput || !wishMeter) return;
  wishMeter.textContent = `${wishInput.value.length} / 800`;
  wishInput.removeAttribute("aria-invalid");
}

function isValidTrajectory(value) {
  return Boolean(
    value
      && value.version === 1
      && typeof value.id === "string"
      && typeof value.wish === "string"
      && value.wish.length >= 12
      && typeof value.title === "string"
      && typeof value.artifactType === "string"
      && ARTIFACTS[value.artifactType]
      && VALID_STATUSES.has(value.status),
  );
}

function readStoredTrajectory() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidTrajectory(parsed)) {
      setMessage(formStatus, "发现一份无法识别的旧梦卡。你可以重新生成并覆盖它。", true);
      return null;
    }
    return parsed;
  } catch (error) {
    setMessage(formStatus, "当前浏览器无法读取本地梦卡。你仍可填写，但关闭页面后可能不会保留。", true);
    return null;
  }
}

function persistTrajectory(value) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch (error) {
    setMessage(cardStatus, "浏览器拒绝写入本地存储。梦卡仍可查看和导出，但关闭页面后可能丢失。", true);
    return false;
  }
}

function clearStoredTrajectory() {
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    setMessage(cardStatus, "浏览器未允许删除本地记录。请在浏览器的网站数据设置中手动清除。", true);
    return false;
  }
}

function buildTrajectory() {
  const wish = normalizeText(wishInput?.value);
  const artifactType = ARTIFACTS[artifactInput?.value] ? artifactInput.value : "auto";
  const artifact = ARTIFACTS[artifactType];
  const constraint = normalizeText(constraintInput?.value);
  const now = new Date().toISOString();

  return {
    version: 1,
    id: createId(),
    status: "draft",
    title: shortTitle(wish),
    wish,
    artifactType,
    artifactLabel: artifact.label,
    successCriterion: artifact.success,
    boundary: constraint || "不自动发布、发送、购买或删除；涉及外部系统的操作必须再次确认。",
    createdAt: now,
    updatedAt: now,
    confirmedAt: null,
  };
}

function setCardStages(status) {
  const capture = document.querySelector('[data-card-stage="capture"]');
  const brief = document.querySelector('[data-card-stage="brief"]');
  const forge = document.querySelector('[data-card-stage="forge"]');
  const preview = document.querySelector('[data-card-stage="preview"]');
  [capture, brief, forge, preview].forEach((stage) => stage?.classList.remove("is-complete", "is-active"));

  capture?.classList.add("is-complete");
  if (status === "draft") {
    brief?.classList.add("is-active");
    return;
  }

  brief?.classList.add("is-complete");
  if (status === "confirmed") forge?.classList.add("is-active");
}

function renderTrajectory(value, options = {}) {
  if (!card || !workspace) return;
  activeTrajectory = value;
  card.hidden = false;
  workspace.classList.add("is-card-visible");

  if (cardTitle) cardTitle.textContent = value.title;
  if (cardWish) cardWish.textContent = value.wish;
  if (cardArtifact) cardArtifact.textContent = value.artifactLabel || ARTIFACTS[value.artifactType].label;
  if (cardSuccess) cardSuccess.textContent = value.successCriterion || ARTIFACTS[value.artifactType].success;
  if (cardBoundary) cardBoundary.textContent = value.boundary;

  setCardStages(value.status);

  if (value.status === "draft") {
    if (cardState) cardState.textContent = "本地草稿";
    if (cardBriefTitle) cardBriefTitle.textContent = "梦卡待确认";
    if (cardBriefNote) cardBriefNote.textContent = "确认目标和边界";
    if (cardForgeNote) cardForgeNote.textContent = "当前尚未调用 Agents";
    if (confirmButton) confirmButton.hidden = false;
    if (pauseButton) pauseButton.hidden = true;
    setMessage(cardStatus, "梦卡尚未确认。确认只会更新本地轨迹，不会开始真实施工。");
  } else if (value.status === "confirmed") {
    if (cardState) cardState.textContent = "轨迹已确认";
    if (cardBriefTitle) cardBriefTitle.textContent = "梦卡已确认";
    if (cardBriefNote) cardBriefNote.textContent = "目标和边界保存在本地";
    if (cardForgeNote) cardForgeNote.textContent = "尚未接入，不会自动开工";
    if (confirmButton) confirmButton.hidden = true;
    if (pauseButton) {
      pauseButton.hidden = false;
      pauseButton.textContent = "暂停轨迹";
    }
    setMessage(cardStatus, "轨迹已确认并保存在本地。炼丹炉尚未接入，不会自动开工。");
  } else {
    if (cardState) cardState.textContent = "轨迹已暂停";
    if (cardBriefTitle) cardBriefTitle.textContent = "梦卡已确认";
    if (cardBriefNote) cardBriefNote.textContent = "目标和边界保存在本地";
    if (cardForgeNote) cardForgeNote.textContent = "轨迹暂停，未调用 Agents";
    if (confirmButton) confirmButton.hidden = true;
    if (pauseButton) {
      pauseButton.hidden = false;
      pauseButton.textContent = "继续轨迹";
    }
    setMessage(cardStatus, "轨迹已暂停。梦卡仍保存在本地，不会执行任何后续动作。");
  }

  if (options.scroll) card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function populateForm(value) {
  if (!value) return;
  if (wishInput) wishInput.value = value.wish;
  if (artifactInput) artifactInput.value = ARTIFACTS[value.artifactType] ? value.artifactType : "auto";
  if (constraintInput) constraintInput.value = value.boundary || "";
  if (localConsent) localConsent.checked = true;
  updateWishMeter();
}

function resetDeleteButton() {
  if (!deleteButton) return;
  deleteButton.removeAttribute("data-confirming");
  deleteButton.textContent = "删除本地梦卡";
  if (deleteResetTimer) globalThis.clearTimeout(deleteResetTimer);
  deleteResetTimer = null;
}

function exportMarkdown(value) {
  const createdAt = new Date(value.createdAt).toLocaleString("zh-CN");
  const confirmed = value.confirmedAt ? new Date(value.confirmedAt).toLocaleString("zh-CN") : "尚未确认";
  return [
    "# 美梦成真 · 梦卡",
    "",
    `- 状态：${value.status === "confirmed" ? "轨迹已确认" : value.status === "paused" ? "轨迹已暂停" : "本地草稿"}`,
    `- 创建时间：${createdAt}`,
    `- 确认时间：${confirmed}`,
    `- 本地编号：${value.id}`,
    "",
    "## 真正想改变的事",
    "",
    value.wish,
    "",
    "## 第一件可交付产物",
    "",
    value.artifactLabel,
    "",
    "## 首版成功标准",
    "",
    value.successCriterion,
    "",
    "## 边界",
    "",
    value.boundary,
    "",
    "## 当前轨迹",
    "",
    "1. 愿望已记录",
    `2. 梦卡${value.status === "draft" ? "待确认" : "已确认"}`,
    "3. 炼丹炉尚未接入，未调用 Agents",
    "4. 等待未来验梦台预览",
    "",
    "> 此文件由浏览器本地生成，不代表真实施工已经开始。",
    "",
  ].join("\n");
}

function updateScrollState() {
  const y = globalThis.scrollY || 0;
  const available = Math.max(1, document.documentElement.scrollHeight - globalThis.innerHeight);
  const pageRatio = clamp(y / available);
  const heroRatio = clamp(y / Math.max(1, globalThis.innerHeight * 1.1));

  header?.classList.toggle("is-scrolled", y > 12);
  if (pageProgress) pageProgress.style.transform = `scaleX(${pageRatio})`;
  document.documentElement.style.setProperty("--dream-scroll", String(heroRatio));

  if (trajectory && trajectoryProgress) {
    const rect = trajectory.getBoundingClientRect();
    const start = globalThis.innerHeight * 0.72;
    const distance = Math.max(1, rect.height - globalThis.innerHeight * 0.22);
    const ratio = clamp((start - rect.top) / distance);
    trajectoryProgress.style.transform = `scaleY(${ratio})`;
  }
}

function initializeReveals() {
  const reveals = [...document.querySelectorAll(".dream-reveal")];
  if (!("IntersectionObserver" in globalThis)) {
    reveals.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 },
  );
  reveals.forEach((node) => observer.observe(node));
}

wishInput?.addEventListener("input", updateWishMeter);

document.querySelectorAll("[data-dream-example]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!wishInput) return;
    wishInput.value = button.getAttribute("data-dream-example") || "";
    updateWishMeter();
    wishInput.focus();
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (isGenerating) return;

  const wish = normalizeText(wishInput?.value);
  if (wish.length < 12) {
    wishInput?.setAttribute("aria-invalid", "true");
    wishInput?.focus();
    setMessage(formStatus, "请至少写 12 个字，让梦卡能看懂你真正希望发生的变化。", true);
    return;
  }
  if (!localConsent?.checked) {
    localConsent?.focus();
    setMessage(formStatus, "请先确认当前只是本地梦卡，不会上传或启动 Agents。", true);
    return;
  }

  isGenerating = true;
  if (submitButton) submitButton.disabled = true;
  setMessage(formStatus, "正在当前浏览器里整理梦卡…");

  globalThis.setTimeout(() => {
    const value = buildTrajectory();
    activeTrajectory = value;
    const saved = persistTrajectory(value);
    renderTrajectory(value, { scroll: true });
    setMessage(
      formStatus,
      saved ? "梦卡已经生成并保存到这个浏览器。" : "梦卡已经生成，但浏览器未允许本地保存。",
      !saved,
    );
    if (submitButton) submitButton.disabled = false;
    isGenerating = false;
  }, 180);
});

confirmButton?.addEventListener("click", () => {
  if (!activeTrajectory || activeTrajectory.status !== "draft") return;
  const now = new Date().toISOString();
  activeTrajectory = {
    ...activeTrajectory,
    status: "confirmed",
    confirmedAt: now,
    updatedAt: now,
  };
  persistTrajectory(activeTrajectory);
  renderTrajectory(activeTrajectory);
});

editButton?.addEventListener("click", () => {
  if (!activeTrajectory) return;
  populateForm(activeTrajectory);
  wishInput?.scrollIntoView({ behavior: "smooth", block: "center" });
  wishInput?.focus({ preventScroll: true });
  setMessage(formStatus, "修改后再次生成，会创建一张新的本地梦卡草稿。");
});

pauseButton?.addEventListener("click", () => {
  if (!activeTrajectory || activeTrajectory.status === "draft") return;
  const nextStatus = activeTrajectory.status === "paused" ? "confirmed" : "paused";
  activeTrajectory = {
    ...activeTrajectory,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };
  persistTrajectory(activeTrajectory);
  renderTrajectory(activeTrajectory);
});

exportButton?.addEventListener("click", () => {
  if (!activeTrajectory) return;
  try {
    const blob = new Blob([exportMarkdown(activeTrajectory)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `美梦成真-梦卡-${activeTrajectory.id.slice(0, 8)}.md`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    globalThis.setTimeout(() => URL.revokeObjectURL(url), 0);
    setMessage(cardStatus, "梦卡 Markdown 已导出。原始记录仍保留在这个浏览器里。");
  } catch (error) {
    setMessage(cardStatus, "当前浏览器无法导出文件。请稍后重试或复制页面中的梦卡内容。", true);
  }
});

deleteButton?.addEventListener("click", () => {
  if (!deleteButton.hasAttribute("data-confirming")) {
    deleteButton.setAttribute("data-confirming", "true");
    deleteButton.textContent = "再次点击，永久删除";
    setMessage(cardStatus, "删除只影响这个浏览器里的梦卡，无法撤销。请再次点击确认。");
    deleteResetTimer = globalThis.setTimeout(resetDeleteButton, 6000);
    return;
  }

  if (!clearStoredTrajectory()) return;
  resetDeleteButton();
  activeTrajectory = null;
  if (form) form.reset();
  if (card) card.hidden = true;
  workspace?.classList.remove("is-card-visible");
  updateWishMeter();
  setMessage(formStatus, "本地梦卡已删除。你可以从一个新的愿望重新开始。");
  wishInput?.focus();
});

globalThis.addEventListener("scroll", updateScrollState, { passive: true });
globalThis.addEventListener("resize", updateScrollState);

initializeReveals();
updateWishMeter();
updateScrollState();

const restored = readStoredTrajectory();
if (restored) {
  populateForm(restored);
  renderTrajectory(restored);
  setMessage(formStatus, "已恢复这个浏览器里保存的梦卡。你可以继续、暂停、导出或删除。");
}

globalThis.requestAnimationFrame(() => document.body.classList.add("is-ready"));
