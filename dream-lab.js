const STORAGE_KEY = "sleeepal.dreamWorkspace.v2";
const LEGACY_STORAGE_KEY = "sleeepal.dreamTrajectory.v1";
const STORE_VERSION = 2;
const VALID_STATUSES = new Set(["draft", "confirmed", "paused", "archived"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

const STAGES = [
  { id: "wish", label: "想法" },
  { id: "clarify", label: "澄清" },
  { id: "plan", label: "计划" },
  { id: "build", label: "制作" },
  { id: "try", label: "试用" },
  { id: "deliver", label: "交付" },
  { id: "grow", label: "持续优化" },
];

const header = document.querySelector("[data-dream-header]");
const pageProgress = document.querySelector("[data-dream-progress]");
const trajectory = document.querySelector("[data-trajectory]");
const trajectoryProgress = document.querySelector("[data-trajectory-progress]");
const workbench = document.querySelector("[data-dream-workbench]");
const mobileWorkspaceNav = document.querySelector("[data-mobile-workspace-nav]");
const mobileWorkspaceTabs = [...document.querySelectorAll("[data-mobile-workspace-tab]")];
const mobileWorkspacePanels = new Map(
  [...document.querySelectorAll("[data-mobile-workspace-panel]")].map((panel) => [
    panel.getAttribute("data-mobile-workspace-panel"),
    panel,
  ]),
);
const dreamList = document.querySelector("[data-dream-list]");
const dreamListEmpty = document.querySelector("[data-dream-list-empty]");
const newDreamButton = document.querySelector("[data-dream-new]");
const exportAllButton = document.querySelector("[data-dream-export-all]");
const accountLabel = document.querySelector("[data-account-label]");
const localUserId = document.querySelector("[data-local-user-id]");
const walletPreviewButton = document.querySelector("[data-wallet-preview]");
const accountStatus = document.querySelector("[data-account-status]");
const accountDialog = document.querySelector("[data-account-dialog]");
const accountCloseButton = document.querySelector("[data-account-close]");
const accountId = document.querySelector("[data-account-id]");
const accountExportButton = document.querySelector("[data-account-export]");
const accountCloudExportButton = document.querySelector("[data-account-cloud-export]");
const accountLogoutButton = document.querySelector("[data-account-logout]");
const accountDeleteOpenButton = document.querySelector("[data-account-delete-open]");
const accountDeleteDialog = document.querySelector("[data-account-delete-dialog]");
const accountDeleteCloseButton = document.querySelector("[data-account-delete-close]");
const accountDeleteCancelButton = document.querySelector("[data-account-delete-cancel]");
const accountDeleteAck = document.querySelector("[data-account-delete-ack]");
const accountDeletePhrase = document.querySelector("[data-account-delete-phrase]");
const accountDeleteConfirmButton = document.querySelector("[data-account-delete-confirm]");
const accountDeleteStatus = document.querySelector("[data-account-delete-status]");
const identityLinkButton = document.querySelector("[data-identity-link]");
const identityList = document.querySelector("[data-identity-list]");
const identityStatus = document.querySelector("[data-identity-status]");
const conflictDialog = document.querySelector("[data-conflict-dialog]");
const conflictCloseButton = document.querySelector("[data-conflict-close]");
const conflictCancelButton = document.querySelector("[data-conflict-cancel]");
const conflictDreamTitle = document.querySelector("[data-conflict-dream-title]");
const conflictRevision = document.querySelector("[data-conflict-revision]");
const conflictFields = document.querySelector("[data-conflict-fields]");
const conflictCopyButton = document.querySelector("[data-conflict-copy]");
const conflictAccountButton = document.querySelector("[data-conflict-account]");
const conflictLocalButton = document.querySelector("[data-conflict-local]");
const conflictStatus = document.querySelector("[data-conflict-status]");
const syncAccountButton = document.querySelector("[data-sync-account]");
const syncSummary = document.querySelector("[data-sync-summary]");
const syncList = document.querySelector("[data-sync-list]");
const syncStatus = document.querySelector("[data-sync-status]");
const chatKicker = document.querySelector("[data-chat-kicker]");
const chatTitle = document.querySelector("[data-chat-title]");
const chatWish = document.querySelector("[data-chat-wish]");
const chatStatus = document.querySelector("[data-chat-status]");
const messageList = document.querySelector("[data-dream-message-list]");
const messageForm = document.querySelector("[data-dream-message-form]");
const messageInput = document.querySelector("[data-dream-message]");
const messageStatus = document.querySelector("[data-dream-message-status]");
const messageSubmit = document.querySelector("[data-dream-message-submit]");
const aiBadge = document.querySelector("[data-ai-badge]");
const aiModeButton = document.querySelector("[data-ai-mode]");
const aiDialog = document.querySelector("[data-ai-dialog]");
const aiCloseButton = document.querySelector("[data-ai-close]");
const aiCancelButton = document.querySelector("[data-ai-cancel]");
const aiEnableButton = document.querySelector("[data-ai-enable]");
const aiConsent = document.querySelector("[data-ai-consent]");
const aiDialogStatus = document.querySelector("[data-ai-dialog-status]");
const form = document.querySelector("[data-dream-form]");
const formStep = document.querySelector("[data-dream-form-step]");
const formStatus = document.querySelector("[data-dream-form-status]");
const submitButton = document.querySelector("[data-dream-submit]");
const submitLabel = document.querySelector("[data-dream-submit-label]");
const wishInput = document.querySelector("#dream-wish");
const wishMeter = document.querySelector("#dream-wish-meter");
const artifactInput = document.querySelector("#dream-artifact");
const constraintInput = document.querySelector("#dream-constraint");
const localConsent = document.querySelector("#dream-local-consent");
const inspectorEmpty = document.querySelector("[data-dream-inspector-empty]");
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
const cardProgressLabel = document.querySelector("[data-card-progress-label]");
const cardProgressBar = document.querySelector("[data-card-progress-bar]");
const cardNextStep = document.querySelector("[data-card-next-step]");
const cardStatus = document.querySelector("[data-dream-card-status]");
const artifactGenerateButton = document.querySelector("[data-artifact-generate]");
const artifactBoardButton = document.querySelector("[data-artifact-board]");
const artifactList = document.querySelector("[data-artifact-list]");
const artifactStatus = document.querySelector("[data-artifact-status]");
const artifactPreviewDialog = document.querySelector("[data-artifact-preview-dialog]");
const artifactPreviewTitle = document.querySelector("[data-artifact-preview-title]");
const artifactPreviewFrame = document.querySelector("[data-artifact-preview-frame]");
const artifactPreviewCloseButton = document.querySelector("[data-artifact-preview-close]");
const artifactPreviewDownloadButton = document.querySelector("[data-artifact-preview-download]");
const artifactPreviewStatus = document.querySelector("[data-artifact-preview-status]");
const confirmButton = document.querySelector("[data-dream-confirm]");
const editButton = document.querySelector("[data-dream-edit]");
const pauseButton = document.querySelector("[data-dream-pause]");
const archiveButton = document.querySelector("[data-dream-archive]");
const exportButton = document.querySelector("[data-dream-export]");
const deleteButton = document.querySelector("[data-dream-delete]");
const exampleButtons = [...document.querySelectorAll("[data-dream-example]")];

let workspaceStore = createEmptyStore();
let activeDream = null;
let editingDreamId = null;
let isCreating = true;
let isGenerating = false;
let deleteResetTimer = null;
let authenticatedAccount = null;
let pendingDreamImports = [];
let dreamApiAvailable = null;
let dreamApiHealth = null;
let accountActionBusy = false;
let pendingConflict = null;
let linkedIdentities = [];
let walletLinkInProgress = false;
let aiActionBusy = false;
let artifactActionBusy = false;
let artifactPreviewPayload = null;
let mobileWorkspaceView = "dreams";
const aiEnabledDreamIds = new Set();
const loadedConversationDreamIds = new Set();
const loadedArtifactDreamIds = new Set();

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function createId(prefix = "dream") {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createSyncId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0"));
    return [
      hex.slice(0, 4).join(""),
      hex.slice(4, 6).join(""),
      hex.slice(6, 8).join(""),
      hex.slice(8, 10).join(""),
      hex.slice(10).join(""),
    ].join("-");
  }
  return null;
}

function createEmptyStore() {
  return {
    version: STORE_VERSION,
    userId: createId("local-user"),
    activeDreamId: null,
    dreams: [],
    updatedAt: new Date().toISOString(),
  };
}

function shortTitle(wish) {
  const characters = Array.from(wish);
  const visible = characters.slice(0, 24).join("");
  return characters.length > 24 ? `${visible}…` : visible;
}

function setMessage(node, message, isError = false) {
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("is-error", isError);
}

function createMilestones(status = "draft") {
  return STAGES.map((stage, index) => {
    let milestoneStatus = "pending";
    if (index === 0) milestoneStatus = "complete";
    if (index === 1) milestoneStatus = status === "draft" ? "active" : "complete";
    if (index === 2 && status !== "draft") milestoneStatus = "active";
    return {
      id: stage.id,
      title: stage.label,
      status: milestoneStatus,
      evidence: index === 0 ? "用户原始愿望已保存在本机" : "",
    };
  });
}

function normalizeMilestones(value, status) {
  if (!Array.isArray(value)) return createMilestones(status);
  return STAGES.map((stage, index) => {
    const stored = value.find((item) => item?.id === stage.id);
    return {
      id: stage.id,
      title: stage.label,
      status: ["pending", "active", "complete", "blocked"].includes(stored?.status)
        ? stored.status
        : createMilestones(status)[index].status,
      evidence: normalizeText(stored?.evidence),
    };
  });
}

function isValidLegacyDream(value) {
  return Boolean(
    value
      && value.version === 1
      && typeof value.id === "string"
      && typeof value.wish === "string"
      && value.wish.length >= 12
      && typeof value.title === "string"
      && ARTIFACTS[value.artifactType]
      && ["draft", "confirmed", "paused"].includes(value.status),
  );
}

function normalizeSuggestion(value) {
  if (!value || typeof value !== "object" || typeof value.id !== "string") return null;
  const suggestion = value.suggestion;
  if (!suggestion || typeof suggestion !== "object") return null;
  const status = ["pending", "applied", "dismissed"].includes(value.status)
    ? value.status
    : "pending";
  return {
    id: value.id,
    runId: typeof value.runId === "string" ? value.runId : null,
    baseRevision: Number.isSafeInteger(value.baseRevision) ? value.baseRevision : null,
    suggestion: {
      title: normalizeText(suggestion.title),
      vision: normalizeText(suggestion.vision),
      successCriteria: normalizeText(suggestion.successCriteria),
      constraints: Array.isArray(suggestion.constraints)
        ? suggestion.constraints.map(normalizeText).filter(Boolean).slice(0, 8)
        : [],
      currentStage: STAGES.some((stage) => stage.id === suggestion.currentStage)
        ? suggestion.currentStage
        : "clarify",
    },
    rationale: normalizeText(value.rationale),
    status,
    createdAt: value.createdAt || new Date().toISOString(),
    decidedAt: value.decidedAt || null,
  };
}

function normalizeActionProposal(value) {
  if (!value || typeof value !== "object" || typeof value.id !== "string") return null;
  return {
    id: value.id,
    runId: typeof value.runId === "string" ? value.runId : null,
    kind: normalizeText(value.kind),
    title: normalizeText(value.title),
    description: normalizeText(value.description),
    scope: normalizeText(value.scope),
    risk: ["low", "medium", "high"].includes(value.risk) ? value.risk : "medium",
    rationale: normalizeText(value.rationale),
    status: ["pending", "approved", "rejected"].includes(value.status)
      ? value.status
      : "pending",
    executed: false,
    createdAt: value.createdAt || new Date().toISOString(),
    decidedAt: value.decidedAt || null,
  };
}

function normalizeArtifact(value) {
  if (!value || typeof value !== "object" || typeof value.id !== "string") return null;
  if (!Number.isSafeInteger(value.version) || value.version <= 0) return null;
  return {
    id: value.id,
    dreamId: typeof value.dreamId === "string" ? value.dreamId : null,
    name: normalizeText(value.name) || "数字产物",
    kind: normalizeText(value.kind),
    version: value.version,
    checksum: typeof value.checksum === "string" ? value.checksum : null,
    mimeType: normalizeText(value.mimeType),
    filename: normalizeText(value.filename) || `artifact-v${value.version}.md`,
    byteSize: Number.isSafeInteger(value.byteSize) ? value.byteSize : 0,
    createdAt: value.createdAt || new Date().toISOString(),
  };
}

function normalizePendingAiTurn(value) {
  if (!value || typeof value !== "object") return null;
  const content = normalizeText(value.content);
  const consent = value.consent;
  if (
    !UUID_PATTERN.test(value.clientRequestId)
    || !content
    || content.length > 1200
    || !Number.isSafeInteger(value.expectedRevision)
    || value.expectedRevision <= 0
    || consent?.accepted !== true
    || consent?.scope !== "openai_dream_assistant_v1"
  ) return null;
  return {
    clientRequestId: value.clientRequestId,
    content,
    expectedRevision: value.expectedRevision,
    consent: {
      accepted: true,
      scope: "openai_dream_assistant_v1",
    },
    runId: UUID_PATTERN.test(value.runId) ? value.runId : null,
    state: ["ready", "retryable", "uncertain", "running"].includes(value.state)
      ? value.state
      : "uncertain",
    attempt: Number.isSafeInteger(value.attempt) && value.attempt > 0 ? value.attempt : null,
    retryAfterSeconds: Number.isSafeInteger(value.retryAfterSeconds)
      && value.retryAfterSeconds > 0
      ? value.retryAfterSeconds
      : null,
    errorCode: normalizeText(value.errorCode) || null,
    createdAt: value.createdAt || new Date().toISOString(),
    updatedAt: value.updatedAt || new Date().toISOString(),
  };
}

function normalizeDream(value) {
  if (!value || typeof value !== "object") return null;
  const wish = normalizeText(value.wish);
  const artifactType = ARTIFACTS[value.artifactType] ? value.artifactType : "auto";
  const status = VALID_STATUSES.has(value.status) ? value.status : "draft";
  if (wish.length < 12 || typeof value.id !== "string") return null;

  const createdAt = value.createdAt || new Date().toISOString();
  const messages = Array.isArray(value.messages)
    ? value.messages
      .filter((message) => ["user", "assistant"].includes(message?.role) && normalizeText(message?.content))
      .map((message) => ({
        id: typeof message.id === "string" ? message.id : createId("message"),
        role: message.role,
        content: normalizeText(message.content),
        createdAt: message.createdAt || createdAt,
        source: ["local-rule", "user", "account-user", "openai"].includes(message.source)
          ? message.source
          : message.role === "assistant"
            ? "local-rule"
            : "user",
        suggestion: normalizeSuggestion(message.suggestion),
        actionProposals: Array.isArray(message.actionProposals)
          ? message.actionProposals.map(normalizeActionProposal).filter(Boolean)
          : [],
      }))
    : [];
  const syncClientId = UUID_PATTERN.test(value.syncClientId)
    ? value.syncClientId
    : UUID_PATTERN.test(value.id)
      ? value.id
      : createSyncId();
  const sync = value.sync
    && UUID_PATTERN.test(value.sync.serverId)
    && Number.isSafeInteger(value.sync.revision)
    && value.sync.revision > 0
    ? {
      serverId: value.sync.serverId,
      revision: value.sync.revision,
      syncedAt: value.sync.syncedAt || null,
      localChanged: Boolean(value.sync.localChanged),
    }
    : null;
  const pendingAiTurn = normalizePendingAiTurn(value.pendingAiTurn);

  return {
    version: STORE_VERSION,
    id: value.id,
    status,
    statusBeforeArchive: value.statusBeforeArchive || null,
    title: normalizeText(value.title) || shortTitle(wish),
    wish,
    artifactType,
    artifactLabel: normalizeText(value.artifactLabel) || ARTIFACTS[artifactType].label,
    successCriterion: normalizeText(value.successCriterion) || ARTIFACTS[artifactType].success,
    boundary: normalizeText(value.boundary)
      || "不自动发布、发送、购买或删除；涉及外部系统的操作必须再次确认。",
    milestones: normalizeMilestones(value.milestones, status),
    messages,
    artifacts: Array.isArray(value.artifacts)
      ? value.artifacts.map(normalizeArtifact).filter(Boolean)
      : [],
    pendingAiTurn: sync
      && pendingAiTurn?.expectedRevision === sync.revision
      ? pendingAiTurn
      : null,
    syncClientId,
    sync,
    createdAt,
    updatedAt: value.updatedAt || createdAt,
    confirmedAt: value.confirmedAt || null,
  };
}

function migrateLegacyDream(value) {
  const migrated = normalizeDream({
    ...value,
    version: STORE_VERSION,
    milestones: createMilestones(value.status),
    messages: [
      {
        id: createId("message"),
        role: "user",
        content: value.wish,
        createdAt: value.createdAt,
        source: "user",
      },
      {
        id: createId("message"),
        role: "assistant",
        content: "这张旧梦卡已安全迁移到新的多梦想工作区。当前仍是本地原型，不会调用模型或执行外部动作。",
        createdAt: value.updatedAt || value.createdAt,
        source: "local-rule",
      },
    ],
  });
  return migrated;
}

function readWorkspaceStore() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.version === STORE_VERSION && Array.isArray(parsed.dreams)) {
        const dreams = parsed.dreams.map(normalizeDream).filter(Boolean);
        return {
          version: STORE_VERSION,
          userId: typeof parsed.userId === "string" ? parsed.userId : createId("local-user"),
          activeDreamId: dreams.some((dream) => dream.id === parsed.activeDreamId)
            ? parsed.activeDreamId
            : dreams[0]?.id || null,
          dreams,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }

    const legacyRaw = globalThis.localStorage?.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (isValidLegacyDream(legacy)) {
        const migrated = migrateLegacyDream(legacy);
        const store = createEmptyStore();
        store.dreams = migrated ? [migrated] : [];
        store.activeDreamId = migrated?.id || null;
        return store;
      }
    }
  } catch (error) {
    setMessage(formStatus, "当前浏览器无法读取本地梦想。你仍可填写，但关闭页面后可能不会保留。", true);
  }
  return createEmptyStore();
}

function persistWorkspace() {
  workspaceStore.updatedAt = new Date().toISOString();
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(workspaceStore));
    return true;
  } catch (error) {
    setMessage(cardStatus || formStatus, "浏览器拒绝写入本地存储。内容仍可查看和导出，但关闭页面后可能丢失。", true);
    return false;
  }
}

function getDreamById(id) {
  return workspaceStore.dreams.find((dream) => dream.id === id) || null;
}

function getProgress(dream) {
  const completed = dream.milestones.filter((milestone) => milestone.status === "complete").length;
  const active = dream.milestones.find((milestone) => milestone.status === "active")
    || dream.milestones.find((milestone) => milestone.status === "blocked")
    || dream.milestones.find((milestone) => milestone.status === "pending");
  return {
    completed,
    total: dream.milestones.length,
    ratio: dream.milestones.length ? completed / dream.milestones.length : 0,
    active,
  };
}

function statusLabel(status) {
  if (status === "confirmed") return "轨迹进行中";
  if (status === "paused") return "已暂停";
  if (status === "archived") return "已归档";
  return "待确认";
}

function timeLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚";
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

function updateWishMeter() {
  if (!wishInput || !wishMeter) return;
  wishMeter.textContent = `${wishInput.value.length} / 800`;
  wishInput.removeAttribute("aria-invalid");
}

function updateExampleSelection() {
  const wish = normalizeText(wishInput?.value);
  const artifactType = artifactInput?.value;
  exampleButtons.forEach((button) => {
    const isSelected = wish === normalizeText(button.getAttribute("data-dream-example"))
      && artifactType === button.getAttribute("data-dream-artifact");
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function isCompactWorkspace() {
  if (typeof globalThis.matchMedia === "function") {
    return globalThis.matchMedia("(max-width: 820px)").matches;
  }
  return globalThis.innerWidth <= 820;
}

function syncMobileWorkspaceMode() {
  if (!workbench || !mobileWorkspaceTabs.length) return;
  const compact = isCompactWorkspace();
  workbench.classList.toggle("is-mobile-compact", compact);
  workbench.dataset.mobileWorkspaceView = mobileWorkspaceView;

  mobileWorkspaceTabs.forEach((tab) => {
    const view = tab.getAttribute("data-mobile-workspace-tab");
    const selected = view === mobileWorkspaceView;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  mobileWorkspacePanels.forEach((panel, view) => {
    const tab = mobileWorkspaceTabs.find(
      (candidate) => candidate.getAttribute("data-mobile-workspace-tab") === view,
    );
    if (compact) {
      panel.setAttribute("role", "tabpanel");
      if (tab?.id) panel.setAttribute("aria-labelledby", tab.id);
      panel.setAttribute("aria-hidden", String(view !== mobileWorkspaceView));
    } else {
      panel.removeAttribute("role");
      panel.removeAttribute("aria-labelledby");
      panel.removeAttribute("aria-hidden");
    }
  });
}

function setMobileWorkspaceView(view, { focusTab = false } = {}) {
  if (!mobileWorkspacePanels.has(view)) return;
  mobileWorkspaceView = view;
  syncMobileWorkspaceMode();
  if (!focusTab || !isCompactWorkspace()) return;
  mobileWorkspaceTabs
    .find((tab) => tab.getAttribute("data-mobile-workspace-tab") === view)
    ?.focus();
}

function labelDreamElement(node, dream, prefix = "梦想") {
  if (!node) return;
  if (!dream) {
    node.removeAttribute("title");
    node.removeAttribute("aria-label");
    return;
  }
  node.title = dream.wish;
  node.setAttribute("aria-label", `${prefix}：${dream.wish}`);
}

function clearNode(node) {
  while (node?.firstChild) node.removeChild(node.firstChild);
}

function appendText(parent, tagName, text, className) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  node.textContent = text;
  parent.append(node);
  return node;
}

function renderSuggestionCard(parent, suggestion) {
  if (!suggestion) return;
  const panel = document.createElement("section");
  panel.className = "dream-ai-suggestion";
  appendText(panel, "span", "建议更新梦卡 · 需你确认");
  appendText(
    panel,
    "strong",
    suggestion.suggestion.title || "一条更清晰的梦卡建议",
  );
  if (suggestion.rationale) appendText(panel, "p", suggestion.rationale);

  const details = document.createElement("dl");
  [
    ["第一件产物", suggestion.suggestion.vision],
    ["成功标准", suggestion.suggestion.successCriteria],
    ["边界", suggestion.suggestion.constraints.join("；") || "沿用当前边界"],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    appendText(row, "dt", label);
    appendText(row, "dd", value || "—");
    details.append(row);
  });
  panel.append(details);

  if (suggestion.status === "pending") {
    const actions = document.createElement("div");
    actions.className = "dream-ai-card-actions";
    const applyButton = appendText(actions, "button", "查看并采用");
    applyButton.type = "button";
    applyButton.addEventListener("click", () => decideAiSuggestion(suggestion, "apply"));
    const dismissButton = appendText(actions, "button", "暂不采用");
    dismissButton.type = "button";
    dismissButton.addEventListener("click", () => decideAiSuggestion(suggestion, "dismiss"));
    panel.append(actions);
  } else {
    appendText(
      panel,
      "p",
      suggestion.status === "applied" ? "你已采用这条建议。" : "你已选择暂不采用。",
      "dream-ai-decision",
    );
  }
  parent.append(panel);
}

function renderActionProposal(parent, proposal) {
  const panel = document.createElement("section");
  panel.className = `dream-action-proposal${proposal.risk === "high" ? " is-high-risk" : ""}`;
  const riskLabels = { low: "低风险", medium: "中等风险", high: "高风险" };
  appendText(panel, "span", `授权卡 · ${riskLabels[proposal.risk] || "待评估"}`);
  appendText(panel, "strong", proposal.title || "待确认动作");
  appendText(panel, "p", proposal.description);
  appendText(panel, "small", `范围：${proposal.scope}`);
  appendText(panel, "small", "当前没有执行器；授权只记录决定，不会发生外部操作。");

  if (proposal.status === "pending") {
    const actions = document.createElement("div");
    actions.className = "dream-ai-card-actions";
    const approveButton = appendText(actions, "button", "同意这个范围");
    approveButton.type = "button";
    approveButton.addEventListener("click", () => decideAiAction(proposal, "approve"));
    const rejectButton = appendText(actions, "button", "不授权");
    rejectButton.type = "button";
    rejectButton.addEventListener("click", () => decideAiAction(proposal, "reject"));
    panel.append(actions);
  } else {
    appendText(
      panel,
      "p",
      proposal.status === "approved"
        ? "你已同意这个范围；当前仍未执行。"
        : "你已拒绝这项授权。",
      "dream-ai-decision",
    );
  }
  parent.append(panel);
}

function renderDreamList() {
  if (!dreamList) return;
  clearNode(dreamList);
  const dreams = [...workspaceStore.dreams].sort((a, b) => {
    if (a.status === "archived" && b.status !== "archived") return 1;
    if (a.status !== "archived" && b.status === "archived") return -1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  dreams.forEach((dream) => {
    const wrapper = document.createElement("div");
    wrapper.className = "dream-list-row";
    wrapper.setAttribute("role", "listitem");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "dream-list-item";
    button.dataset.dreamId = dream.id;
    button.title = dream.wish;
    if (!isCreating && activeDream?.id === dream.id) button.setAttribute("aria-current", "true");
    if (dream.status === "archived") button.classList.add("is-archived");

    const heading = document.createElement("span");
    heading.className = "dream-list-item-heading";
    const wish = appendText(heading, "strong", dream.wish);
    wish.title = dream.wish;
    appendText(heading, "small", timeLabel(dream.updatedAt));

    const progress = getProgress(dream);
    const meta = document.createElement("span");
    meta.className = "dream-list-item-meta";
    appendText(meta, "span", statusLabel(dream.status));
    appendText(meta, "span", `${progress.completed}/${progress.total}`);
    button.setAttribute(
      "aria-label",
      `打开梦想：${dream.wish}。${statusLabel(dream.status)}，进度 ${progress.completed}/${progress.total}`,
    );

    const track = document.createElement("span");
    track.className = "dream-list-progress";
    const fill = document.createElement("i");
    fill.style.transform = `scaleX(${progress.ratio})`;
    track.append(fill);

    button.append(heading, meta, track);
    button.addEventListener("click", () => selectDream(dream.id));
    wrapper.append(button);
    dreamList.append(wrapper);
  });

  if (dreamListEmpty) dreamListEmpty.hidden = dreams.length > 0;
  if (exportAllButton) exportAllButton.disabled = dreams.length === 0;
}

function renderMessages(dream) {
  if (!messageList) return;
  clearNode(messageList);
  const messages = dream?.messages?.length
    ? dream.messages
    : [{
      role: "assistant",
      content: "先说出一件你真正希望发生的事。我会先把原话留住，再整理目标、边界和第一件可以交付的产物。",
      source: "local-rule",
      createdAt: new Date().toISOString(),
    }];

  messages.forEach((message) => {
    const article = document.createElement("article");
    article.className = `dream-message is-${message.role}`;

    const label = message.role === "user"
      ? "你"
      : message.source === "local-rule"
        ? "美梦助手 · 本地整理"
        : "美梦助手 · AI";
    appendText(article, "span", label);
    appendText(article, "p", message.content);
    renderSuggestionCard(article, message.suggestion);
    (message.actionProposals || []).forEach((proposal) => {
      renderActionProposal(article, proposal);
    });
    if (message.createdAt) appendText(article, "time", timeLabel(message.createdAt));
    messageList.append(article);
  });

  messageList.scrollTop = messageList.scrollHeight;
}

function setCardStages(dream) {
  STAGES.forEach((stage) => {
    const node = document.querySelector(`[data-card-stage="${stage.id}"]`);
    const milestone = dream.milestones.find((item) => item.id === stage.id);
    node?.classList.remove("is-complete", "is-active", "is-blocked");
    if (milestone?.status === "complete") node?.classList.add("is-complete");
    if (milestone?.status === "active") node?.classList.add("is-active");
    if (milestone?.status === "blocked") node?.classList.add("is-blocked");
  });
}

function artifactSizeLabel(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "文件";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
}

function renderArtifacts(dream) {
  if (!artifactList || !artifactGenerateButton || !artifactBoardButton) return;
  clearNode(artifactList);
  const artifacts = [...(dream?.artifacts || [])]
    .sort((a, b) => (
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      || b.version - a.version
    ));
  artifacts.forEach((artifact) => {
    const row = document.createElement("article");
    row.className = "dream-artifact-item";
    appendText(row, "strong", `${artifact.name} · v${artifact.version}`);
    appendText(
      row,
      "small",
      `${artifactSizeLabel(artifact.byteSize)} · ${timeLabel(artifact.createdAt)}`,
    );
    const actions = document.createElement("div");
    actions.className = "dream-artifact-item-actions";
    if (artifact.kind === "action_board") {
      const previewButton = appendText(actions, "button", "打开");
      previewButton.type = "button";
      previewButton.addEventListener("click", () => previewAccountArtifact(artifact));
    }
    const downloadButton = appendText(actions, "button", "下载");
    downloadButton.type = "button";
    downloadButton.addEventListener("click", () => downloadAccountArtifact(artifact));
    row.append(actions);
    artifactList.append(row);
  });

  artifactGenerateButton.disabled = artifactActionBusy;
  artifactBoardButton.disabled = artifactActionBusy;
  const briefCount = artifacts.filter((artifact) => artifact.kind === "project_brief").length;
  const boardCount = artifacts.filter((artifact) => artifact.kind === "action_board").length;
  artifactGenerateButton.textContent = artifactActionBusy
    ? "正在生成…"
    : briefCount
      ? "任务书新版本"
      : "生成施工任务书";
  artifactBoardButton.textContent = artifactActionBusy
    ? "正在生成…"
    : boardCount
      ? "行动台新版本"
      : "生成可用行动台";

  if (!dream) return;
  if (!authenticatedAccount) {
    setMessage(artifactStatus, "连接钱包并确认保存梦卡后，可以生成账号产物；本地导出仍可使用。");
  } else if (!dream.sync?.serverId) {
    setMessage(artifactStatus, "先在合并预览中确认把这张梦卡保存到账号。");
  } else if (dream.sync.localChanged) {
    setMessage(artifactStatus, "本机与账号梦卡不同；处理版本差异后再生成，避免使用错误输入。", true);
  } else if (dream.status !== "confirmed") {
    setMessage(artifactStatus, "先确认梦卡并进入轨迹，再生成第一份真实产物。");
  } else if (artifacts.length) {
    setMessage(
      artifactStatus,
      `已保留 ${artifacts.length} 份产物；行动台可直接打开，所有版本都能独立下载。`,
    );
  } else {
    setMessage(artifactStatus, "尚未生成。建议先创建可直接使用的离线梦想行动台。");
  }
}

function renderCard(dream) {
  if (!card || !inspectorEmpty) return;
  if (!dream || isCreating) {
    card.hidden = true;
    inspectorEmpty.hidden = false;
    return;
  }

  card.hidden = false;
  inspectorEmpty.hidden = true;
  if (cardTitle) cardTitle.textContent = dream.title;
  labelDreamElement(cardTitle, dream, "梦想卡");
  if (cardWish) cardWish.textContent = dream.wish;
  if (cardArtifact) cardArtifact.textContent = dream.artifactLabel;
  if (cardSuccess) cardSuccess.textContent = dream.successCriterion;
  if (cardBoundary) cardBoundary.textContent = dream.boundary;

  const progress = getProgress(dream);
  if (cardProgressLabel) cardProgressLabel.textContent = `${progress.completed} / ${progress.total}`;
  if (cardProgressBar) cardProgressBar.style.transform = `scaleX(${progress.ratio})`;
  if (cardNextStep) {
    cardNextStep.textContent = dream.status === "paused"
      ? "当前已暂停。你可以随时继续这条轨迹。"
      : dream.status === "archived"
        ? "这个梦想已归档，所有本地内容仍被保留。"
        : `下一步：${progress.active?.title || "继续优化已有产物"}。`;
  }

  setCardStages(dream);
  renderArtifacts(dream);

  if (dream.status === "draft") {
    if (cardState) cardState.textContent = "本地草稿";
    if (cardBriefTitle) cardBriefTitle.textContent = "澄清";
    if (cardBriefNote) cardBriefNote.textContent = "确认目标和边界";
    if (cardForgeNote) cardForgeNote.textContent = "尚未开始制作";
    if (confirmButton) confirmButton.hidden = false;
    if (pauseButton) pauseButton.hidden = true;
    setMessage(cardStatus, "梦卡尚未确认。确认只会更新本地轨迹，不会开始真实施工。");
  } else if (dream.status === "confirmed") {
    if (cardState) cardState.textContent = "轨迹进行中";
    if (cardBriefTitle) cardBriefTitle.textContent = "澄清完成";
    if (cardBriefNote) cardBriefNote.textContent = "目标和边界保存在本地";
    if (cardForgeNote) cardForgeNote.textContent = "等待接入炼丹炉";
    if (confirmButton) confirmButton.hidden = true;
    if (pauseButton) {
      pauseButton.hidden = false;
      pauseButton.textContent = "暂停轨迹";
    }
    setMessage(cardStatus, "轨迹已确认。当前尚未接入模型与 Agents，不会自动开工。");
  } else if (dream.status === "paused") {
    if (cardState) cardState.textContent = "轨迹已暂停";
    if (confirmButton) confirmButton.hidden = true;
    if (pauseButton) {
      pauseButton.hidden = false;
      pauseButton.textContent = "继续轨迹";
    }
    setMessage(cardStatus, "轨迹已暂停。梦卡和对话仍保存在本地。");
  } else {
    if (cardState) cardState.textContent = "已归档";
    if (confirmButton) confirmButton.hidden = true;
    if (pauseButton) pauseButton.hidden = true;
    setMessage(cardStatus, "这个梦想已归档。你可以移出归档、导出或删除。");
  }

  if (archiveButton) archiveButton.textContent = dream.status === "archived" ? "移出归档" : "归档";
}

function renderChat() {
  if (isCreating || editingDreamId || !activeDream) {
    const editingDream = editingDreamId ? getDreamById(editingDreamId) : null;
    if (chatKicker) chatKicker.textContent = "美梦助手 · 本地原型";
    if (chatTitle) chatTitle.textContent = editingDreamId ? "修改梦想卡" : "先说一个你真正牵挂的愿望";
    labelDreamElement(chatTitle, editingDream, editingDream ? "正在修改梦想" : "美梦助手");
    if (chatWish) {
      chatWish.hidden = !editingDream;
      chatWish.textContent = editingDream?.wish || "";
      if (editingDream) chatWish.title = editingDream.wish;
      else chatWish.removeAttribute("title");
    }
    if (chatStatus) {
      chatStatus.textContent = editingDreamId
        ? "修改后需要重新确认，已有对话会继续保留。"
        : "我会先理解，再整理成一张可以确认的梦卡。";
    }
    renderMessages(editingDream);
    return;
  }

  if (chatKicker) chatKicker.textContent = `美梦助手 · ${statusLabel(activeDream.status)}`;
  if (chatTitle) chatTitle.textContent = activeDream.title;
  labelDreamElement(chatTitle, activeDream, "当前梦想");
  if (chatWish) {
    chatWish.hidden = false;
    chatWish.textContent = activeDream.wish;
    chatWish.title = activeDream.wish;
  }
  if (chatStatus) {
    const progress = getProgress(activeDream);
    chatStatus.textContent = `${progress.completed}/${progress.total} 个阶段完成 · 最近更新 ${timeLabel(activeDream.updatedAt)}`;
  }
  renderMessages(activeDream);
}

function renderIdentity() {
  if (authenticatedAccount) {
    if (accountLabel) accountLabel.textContent = "钱包用户 ID";
    if (localUserId) {
      localUserId.textContent = authenticatedAccount.displayId;
      localUserId.title = authenticatedAccount.accountId;
    }
    if (walletPreviewButton) walletPreviewButton.textContent = "管理账号与同步";
    return;
  }

  if (accountLabel) accountLabel.textContent = "本机访客 ID";
  if (localUserId) {
    localUserId.textContent = `local:${workspaceStore.userId.slice(0, 8)}`;
    localUserId.removeAttribute("title");
  }
  if (walletPreviewButton) walletPreviewButton.textContent = "连接钱包账号";
}

function aiModeEnabled(dream = activeDream) {
  return Boolean(dream && aiEnabledDreamIds.has(dream.id));
}

function pendingAiTurnFor(dream = activeDream) {
  return dream?.pendingAiTurn || null;
}

function savePendingAiTurn(dreamId, pendingAiTurn) {
  return updateDreamFromAccount(dreamId, (dream) => ({
    ...dream,
    pendingAiTurn,
  }));
}

function clearPendingAiTurn(dreamId) {
  const dream = getDreamById(dreamId);
  if (!dream?.pendingAiTurn) return true;
  return savePendingAiTurn(dreamId, null);
}

function pendingAiStatusMessage(pending) {
  if (!pending) return "";
  if (pending.state === "running") {
    const wait = pending.retryAfterSeconds
      ? `服务端建议约 ${pending.retryAfterSeconds} 秒后再查看。`
      : "不会自动轮询。";
    return `同一 AI 回合仍在处理中。${wait}点击“查看同一回合”只查询一次状态。`;
  }
  if (pending.state === "uncertain" && pending.runId) {
    return "上次连接中断，回合状态尚未确认。点击“查看同一回合”只查询一次，不会重复提交。";
  }
  return "上次 AI 回合没有明确完成。内容和请求编号已保存在本机；点击“重试同一回合”会原样重发。";
}

function renderAiControls() {
  const enabled = aiModeEnabled();
  const pending = pendingAiTurnFor();
  if (aiModeButton) {
    aiModeButton.setAttribute("aria-pressed", String(enabled));
    aiModeButton.textContent = enabled ? "关闭 AI，改为本机记录" : "使用 AI 助手";
    aiModeButton.disabled = aiActionBusy;
  }
  if (messageSubmit) {
    messageSubmit.textContent = aiActionBusy
      ? "正在确认…"
      : pending?.runId && ["running", "uncertain"].includes(pending.state)
        ? "查看同一回合"
        : pending
          ? "重试同一回合"
          : enabled
            ? "发送给 AI"
            : "记录";
    messageSubmit.disabled = aiActionBusy;
  }
  if (messageInput) {
    messageInput.disabled = aiActionBusy;
    if (
      pending
      && messageInput.dataset.pendingAiTurnId !== pending.clientRequestId
    ) {
      messageInput.value = pending.content;
      messageInput.dataset.pendingAiTurnId = pending.clientRequestId;
      messageInput.dataset.pendingAiDreamId = activeDream?.id || "";
    } else if (!pending && messageInput.dataset.pendingAiTurnId) {
      messageInput.value = "";
      delete messageInput.dataset.pendingAiTurnId;
      delete messageInput.dataset.pendingAiDreamId;
    }
  }
  if (aiBadge) {
    aiBadge.textContent = pending
      ? "AI 回合待恢复"
      : enabled
      ? "AI 已开启"
      : dreamApiHealth?.aiConfigured
        ? "AI 可选"
        : "本机模式";
  }
  if (!messageStatus || !activeDream || isCreating || editingDreamId) return;
  if (pending) {
    setMessage(messageStatus, pendingAiStatusMessage(pending), pending.state !== "running");
  } else if (enabled) {
    setMessage(
      messageStatus,
      "发送当前账号梦卡、这条消息和最近 8 条账号 AI 对话；本机历史不上传，建议与外部动作仍需确认。",
    );
  } else if (authenticatedAccount && !dreamApiHealth?.aiConfigured) {
    setMessage(messageStatus, "当前只记录到本机。AI 服务尚未配置，不会假装已经调用模型。");
  } else {
    setMessage(messageStatus, "当前只记录到本机，不会调用模型或执行外部动作。");
  }
}

function renderWorkspace() {
  activeDream = getDreamById(workspaceStore.activeDreamId);
  renderIdentity();
  renderDreamList();
  renderChat();
  renderCard(activeDream);

  if (form) form.hidden = !isCreating && !editingDreamId;
  if (messageForm) messageForm.hidden = isCreating || Boolean(editingDreamId) || !activeDream;
  renderAiControls();
  workbench?.classList.toggle(
    "has-active-dream",
    Boolean(activeDream && !isCreating && !editingDreamId),
  );
}

function resetForm() {
  form?.reset();
  if (artifactInput) artifactInput.value = "auto";
  updateWishMeter();
  updateExampleSelection();
}

function populateForm(dream) {
  if (!dream) return;
  if (wishInput) wishInput.value = dream.wish;
  if (artifactInput) artifactInput.value = ARTIFACTS[dream.artifactType] ? dream.artifactType : "auto";
  if (constraintInput) constraintInput.value = dream.boundary || "";
  if (localConsent) localConsent.checked = true;
  updateWishMeter();
  updateExampleSelection();
}

function enterCreateMode() {
  isCreating = true;
  editingDreamId = null;
  resetForm();
  if (formStep) formStep.textContent = "01 / 说出愿望";
  if (submitLabel) submitLabel.textContent = "生成我的梦卡";
  setMessage(formStatus, "尚未生成。你的文字不会离开当前浏览器。");
  renderWorkspace();
  form?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  globalThis.setTimeout(() => wishInput?.focus(), 180);
}

function selectDream(id) {
  const dream = getDreamById(id);
  if (!dream) return;
  workspaceStore.activeDreamId = id;
  activeDream = dream;
  isCreating = false;
  editingDreamId = null;
  persistWorkspace();
  renderWorkspace();
  setMobileWorkspaceView("chat");
  if (isCompactWorkspace()) {
    globalThis.requestAnimationFrame(() => messageInput?.focus({ preventScroll: true }));
  }
  void loadAccountConversation(dream);
  void loadAccountArtifacts(dream);
}

function enterEditMode() {
  if (!activeDream) return;
  isCreating = false;
  editingDreamId = activeDream.id;
  populateForm(activeDream);
  if (formStep) formStep.textContent = "修改梦想卡";
  if (submitLabel) submitLabel.textContent = "保存并重新确认";
  setMessage(formStatus, "修改会保留原有对话，并让梦卡重新进入待确认状态。");
  renderWorkspace();
  setMobileWorkspaceView("chat");
  form?.scrollIntoView({ behavior: "smooth", block: "center" });
  globalThis.setTimeout(() => wishInput?.focus({ preventScroll: true }), 200);
}

function buildDream(existing = null) {
  const wish = normalizeText(wishInput?.value);
  const artifactType = ARTIFACTS[artifactInput?.value] ? artifactInput.value : "auto";
  const artifact = ARTIFACTS[artifactType];
  const constraint = normalizeText(constraintInput?.value);
  const now = new Date().toISOString();
  const title = shortTitle(wish);
  const dreamId = existing?.id || createId();

  const messages = existing?.messages ? [...existing.messages] : [];
  messages.push({
    id: createId("message"),
    role: "user",
    content: existing ? `我更新了梦想卡：${wish}` : wish,
    createdAt: now,
    source: "user",
  });
  messages.push({
    id: createId("message"),
    role: "assistant",
    content: existing
      ? "修改已经保存在本地，梦卡重新进入待确认状态。请检查目标、第一件产物与边界。"
      : `我先把它记录为“${title}”。第一件产物和成功标准已经用本地规则整理好，请检查右侧梦卡；确认后再进入计划。`,
    createdAt: now,
    source: "local-rule",
  });

  return {
    version: STORE_VERSION,
    id: dreamId,
    status: "draft",
    statusBeforeArchive: null,
    title,
    wish,
    artifactType,
    artifactLabel: artifact.label,
    successCriterion: artifact.success,
    boundary: constraint || "不自动发布、发送、购买或删除；涉及外部系统的操作必须再次确认。",
    milestones: createMilestones("draft"),
    messages,
    artifacts: existing?.artifacts ? [...existing.artifacts] : [],
    pendingAiTurn: null,
    syncClientId: existing?.syncClientId
      || (UUID_PATTERN.test(dreamId) ? dreamId : createSyncId()),
    sync: existing?.sync
      ? { ...existing.sync, localChanged: true }
      : null,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    confirmedAt: null,
  };
}

function upsertDream(dream) {
  const index = workspaceStore.dreams.findIndex((item) => item.id === dream.id);
  if (index >= 0) workspaceStore.dreams.splice(index, 1, dream);
  else workspaceStore.dreams.push(dream);
  workspaceStore.activeDreamId = dream.id;
  activeDream = dream;
  return persistWorkspace();
}

function updateActiveDream(updater) {
  if (!activeDream) return false;
  const candidate = updater(activeDream);
  if (activeDream.sync) {
    candidate.sync = { ...activeDream.sync, localChanged: true };
  }
  const next = normalizeDream(candidate);
  if (!next) return false;
  return upsertDream(next);
}

function addLocalAssistantMessage(dream, content) {
  const now = new Date().toISOString();
  return {
    ...dream,
    messages: [
      ...dream.messages,
      {
        id: createId("message"),
        role: "assistant",
        content,
        createdAt: now,
        source: "local-rule",
      },
    ],
    updatedAt: now,
  };
}

function resetDeleteButton() {
  if (!deleteButton) return;
  deleteButton.removeAttribute("data-confirming");
  deleteButton.textContent = "删除本地梦卡";
  if (deleteResetTimer) globalThis.clearTimeout(deleteResetTimer);
  deleteResetTimer = null;
}

function dreamMarkdown(dream) {
  const progress = getProgress(dream);
  const messages = dream.messages.flatMap((message) => [
    `### ${message.role === "user" ? "你" : "美梦助手"}`,
    "",
    message.content,
    "",
  ]);
  return [
    `# 美梦成真 · ${dream.title}`,
    "",
    `- 状态：${statusLabel(dream.status)}`,
    `- 创建时间：${new Date(dream.createdAt).toLocaleString("zh-CN")}`,
    `- 本地编号：${dream.id}`,
    `- 进度：${progress.completed} / ${progress.total}`,
    "",
    "## 真正想改变的事",
    "",
    dream.wish,
    "",
    "## 第一件可交付产物",
    "",
    dream.artifactLabel,
    "",
    "## 首版成功标准",
    "",
    dream.successCriterion,
    "",
    "## 边界",
    "",
    dream.boundary,
    "",
    "## 里程碑",
    "",
    ...dream.milestones.map((milestone) => `- [${milestone.status === "complete" ? "x" : " "}] ${milestone.title} · ${milestone.status}`),
    "",
    "## 本地对话",
    "",
    ...messages,
    "> 此文件由浏览器本地生成；本地整理消息不代表大模型已经执行或理解任务。",
    "",
  ].join("\n");
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadJson(filename, value) {
  const blob = new Blob(
    [`${JSON.stringify(value, null, 2)}\n`],
    { type: "application/json;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

async function dreamApiRequest(path, options = {}) {
  const response = await globalThis.fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const contentType = response.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    const error = new Error("身份服务尚未部署到当前网站。");
    error.code = "service_unavailable";
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data?.error?.message || "身份服务暂时无法完成请求。");
    error.code = data?.error?.code || "api_error";
    error.status = response.status;
    error.details = data?.error?.details || null;
    throw error;
  }
  return data;
}

function dreamApiOriginEligible(location = globalThis.location) {
  const hostname = String(location?.hostname || "").toLowerCase();
  const port = String(location?.port || "");
  if (hostname === "dream.sleeepal.com") return true;
  return port === "8787" && new Set([
    "dream.localhost",
    "localhost",
    "127.0.0.1",
  ]).has(hostname);
}

async function ensureDreamApi(force = false) {
  if (!dreamApiOriginEligible()) {
    dreamApiAvailable = false;
    dreamApiHealth = null;
    return false;
  }
  if (dreamApiAvailable === true) return true;
  if (dreamApiAvailable === false && !force) return false;
  try {
    const health = await dreamApiRequest("/health");
    dreamApiHealth = health;
    dreamApiAvailable = health?.ok === true
      && health?.service === "sleeepal-dream-api"
      && health?.databaseConfigured === true;
  } catch (error) {
    dreamApiAvailable = false;
    dreamApiHealth = null;
  }
  return dreamApiAvailable;
}

function walletErrorMessage(error) {
  if (error?.code === 4001) return "你已取消钱包操作，没有任何内容被上传。";
  if (error?.code === "unsupported_chain") return error.message;
  if (error?.code === "service_unavailable") return "身份服务尚未部署到当前网站；梦想继续安全保存在本机。";
  if (error?.code === "not_authenticated" || error?.status === 401) return "钱包会话已失效，请重新连接。";
  if (
    error instanceof TypeError
    || /failed to fetch|networkerror|load failed/iu.test(error?.message || "")
  ) {
    return "身份服务暂时无法连接；没有内容被覆盖，可以稍后安全重试。";
  }
  return error?.message || "钱包连接暂时没有完成，请稍后重试。";
}

function walletProvider() {
  const provider = globalThis.ethereum;
  return provider && typeof provider.request === "function" ? provider : null;
}

function openAccountDialog() {
  if (!accountDialog) return;
  if (typeof accountDialog.showModal === "function") {
    if (!accountDialog.open) accountDialog.showModal();
  } else {
    accountDialog.setAttribute("open", "");
  }
}

function closeAccountDialog() {
  if (!accountDialog) return;
  if (typeof accountDialog.close === "function") accountDialog.close();
  else accountDialog.removeAttribute("open");
}

function conflictStageLabel(stageId) {
  return STAGES.find((stage) => stage.id === stageId)?.label || normalizeText(stageId) || "未填写";
}

function conflictValue(value) {
  if (Array.isArray(value)) return value.map(normalizeText).filter(Boolean).join("；") || "未填写";
  return normalizeText(value) || "未填写";
}

function renderConflictFields(localDream, remoteDream) {
  clearNode(conflictFields);
  if (!conflictFields) return;
  const rows = [
    ["梦想标题", localDream.title, remoteDream.title],
    ["原始愿望", localDream.wish, remoteDream.originalWish],
    ["首件产物", localDream.artifactLabel, remoteDream.vision],
    ["成功标准", localDream.successCriterion, remoteDream.successCriteria],
    ["边界", localDream.boundary, remoteDream.constraints],
    ["状态", statusLabel(localDream.status), statusLabel(remoteDream.status)],
    ["当前阶段", conflictStageLabel(currentStageForDream(localDream)), conflictStageLabel(remoteDream.currentStage)],
  ].filter(([, localValue, accountValue]) => (
    conflictValue(localValue) !== conflictValue(accountValue)
  ));

  rows.forEach(([label, localValue, accountValue]) => {
    const row = document.createElement("article");
    row.className = "dream-conflict-field";
    appendText(row, "span", label);
    const local = document.createElement("div");
    local.className = "dream-conflict-value";
    appendText(local, "small", "本机版本");
    appendText(local, "p", conflictValue(localValue));
    const account = document.createElement("div");
    account.className = "dream-conflict-value";
    appendText(account, "small", "账号版本");
    appendText(account, "p", conflictValue(accountValue));
    row.append(local, account);
    conflictFields.append(row);
  });
}

function setConflictBusy(busy) {
  [conflictCopyButton, conflictAccountButton, conflictLocalButton, conflictCancelButton]
    .filter(Boolean)
    .forEach((button) => {
      button.disabled = busy;
    });
}

function openConflictDialog(localDream, remoteDream) {
  if (!conflictDialog || !localDream || !remoteDream) return;
  pendingConflict = {
    localDreamId: localDream.id,
    remoteDream,
  };
  closeAccountDialog();
  if (conflictDreamTitle) conflictDreamTitle.textContent = localDream.title;
  if (conflictRevision) {
    conflictRevision.textContent = `本机修改与账号修订 v${remoteDream.revision} 不同；打开此窗口没有改动任何数据。`;
  }
  renderConflictFields(localDream, remoteDream);
  setConflictBusy(false);
  setMessage(conflictStatus, "推荐“保留两份”：先消除覆盖风险，再决定是否合并。");
  if (typeof conflictDialog.showModal === "function") {
    if (!conflictDialog.open) conflictDialog.showModal();
  } else {
    conflictDialog.setAttribute("open", "");
  }
}

function closeConflictDialog(reopenAccount = true) {
  if (!conflictDialog || accountActionBusy) return;
  if (typeof conflictDialog.close === "function") conflictDialog.close();
  else conflictDialog.removeAttribute("open");
  pendingConflict = null;
  clearNode(conflictFields);
  setMessage(conflictStatus, "");
  if (reopenAccount && authenticatedAccount) {
    showAccountAndSyncPreview();
  }
}

function normalizeLinkedIdentity(value) {
  if (!value || typeof value !== "object" || !UUID_PATTERN.test(value.id)) return null;
  if (typeof value.accountId !== "string" || typeof value.displayId !== "string") return null;
  return {
    id: value.id,
    accountId: value.accountId,
    displayId: value.displayId,
    chainId: normalizeText(value.chainId),
    isPrimary: value.isPrimary === true,
    currentSession: value.currentSession === true,
    verifiedAt: value.verifiedAt || null,
  };
}

function renderLinkedIdentities(result = {}) {
  linkedIdentities = Array.isArray(result.identities)
    ? result.identities.map(normalizeLinkedIdentity).filter(Boolean)
    : [];
  clearNode(identityList);
  linkedIdentities.forEach((identity) => {
    const row = document.createElement("li");
    appendText(row, "strong", identity.accountId);
    const chips = document.createElement("small");
    appendText(chips, "span", identity.displayId);
    if (identity.isPrimary) {
      const primary = appendText(chips, "span", "主钱包");
      primary.className = "dream-identity-chip is-primary";
    }
    if (identity.currentSession) {
      const current = appendText(chips, "span", "当前会话");
      current.className = "dream-identity-chip is-current";
    }
    row.append(chips);
    if (!identity.isPrimary && identity.currentSession) {
      const promoteButton = appendText(row, "button", "设为主钱包");
      promoteButton.type = "button";
      promoteButton.className = "is-promote";
      promoteButton.disabled = accountActionBusy;
      promoteButton.addEventListener("click", () => {
        promoteLinkedIdentity(identity, promoteButton);
      });
    } else if (!identity.isPrimary && !identity.currentSession) {
      const removeButton = appendText(row, "button", "移除");
      removeButton.type = "button";
      removeButton.disabled = accountActionBusy;
      removeButton.addEventListener("click", () => {
        removeLinkedIdentity(identity, removeButton);
      });
    }
    identityList?.append(row);
  });

  const maximum = Number.isSafeInteger(result.maximumWallets)
    ? result.maximumWallets
    : 5;
  if (identityLinkButton) {
    identityLinkButton.disabled = accountActionBusy || linkedIdentities.length >= maximum;
    identityLinkButton.textContent = linkedIdentities.length >= maximum
      ? `已达到 ${maximum} 个钱包上限`
      : linkedIdentities.length > 1
        ? "继续绑定钱包"
        : "绑定第二个钱包";
  }
}

async function loadLinkedIdentities() {
  if (!authenticatedAccount) return;
  setMessage(identityStatus, "正在读取已绑定钱包…");
  try {
    const result = await dreamApiRequest("/v1/account/identities");
    renderLinkedIdentities(result);
    setMessage(
      identityStatus,
      result.identities.length > 1
        ? `已绑定 ${result.identities.length} 个钱包；任一钱包验证后都会进入同一个睡眠宝账号。`
        : "当前只有主钱包。建议增加一个恢复钱包，避免单一登录入口。",
    );
  } catch (error) {
    linkedIdentities = [];
    clearNode(identityList);
    setMessage(identityStatus, walletErrorMessage(error), true);
  }
}

async function promoteLinkedIdentity(identity, button) {
  if (!authenticatedAccount || accountActionBusy) return;
  const provider = walletProvider();
  if (!provider) {
    setMessage(identityStatus, "没有发现可用的 EVM 钱包扩展。", true);
    return;
  }

  accountActionBusy = true;
  renderLinkedIdentities({ identities: linkedIdentities, maximumWallets: 5 });
  button.disabled = true;
  button.textContent = "等待签名…";
  setMessage(
    identityStatus,
    `请用 ${identity.displayId} 重新签名。成功后它会成为主钱包，旧主钱包才可以移除。`,
  );
  try {
    const expectedAddress = identity.accountId.split(":").at(-1)?.toLowerCase();
    const expectedChainId = Number(identity.chainId);
    const [accounts, chainHex] = await Promise.all([
      provider.request({ method: "eth_requestAccounts" }),
      provider.request({ method: "eth_chainId" }),
    ]);
    const activeChainId = typeof chainHex === "string"
      ? Number.parseInt(chainHex, 16)
      : NaN;
    const address = Array.isArray(accounts)
      ? accounts.find((candidate) => (
        typeof candidate === "string"
        && candidate.toLowerCase() === expectedAddress
      ))
      : null;
    if (
      typeof address !== "string"
      || !Number.isSafeInteger(expectedChainId)
      || activeChainId !== expectedChainId
    ) {
      throw new Error(`请先在钱包中切换到 ${identity.displayId} 及对应网络。`);
    }

    const challenge = await dreamApiRequest(
      `/v1/account/identities/${identity.id}/primary/nonce`,
      {
        method: "POST",
        body: JSON.stringify({
          accountId: identity.accountId,
          confirmation: "将这个钱包设为主钱包",
          uri: globalThis.location.href.split("#", 1)[0],
        }),
      },
    );
    const signature = await provider.request({
      method: "personal_sign",
      params: [challenge.message, address],
    });
    if (typeof signature !== "string") {
      throw new Error("钱包没有返回有效签名。");
    }
    const result = await dreamApiRequest(
      `/v1/account/identities/${identity.id}/primary/verify`,
      {
        method: "POST",
        body: JSON.stringify({
          challengeId: challenge.challengeId,
          message: challenge.message,
          signature,
        }),
      },
    );
    renderLinkedIdentities(result);
    setMessage(
      identityStatus,
      `${identity.displayId} 已成为主钱包。确认旧钱包失联后，你现在可以单独移除它。`,
    );
  } catch (error) {
    setMessage(identityStatus, walletErrorMessage(error), true);
  } finally {
    accountActionBusy = false;
    renderLinkedIdentities({ identities: linkedIdentities, maximumWallets: 5 });
  }
}

async function linkRecoveryWallet() {
  if (!authenticatedAccount || accountActionBusy) return;
  const provider = walletProvider();
  if (!provider) {
    setMessage(identityStatus, "没有发现可用的 EVM 钱包扩展。", true);
    return;
  }

  accountActionBusy = true;
  walletLinkInProgress = true;
  renderLinkedIdentities({ identities: linkedIdentities, maximumWallets: 5 });
  if (identityLinkButton) identityLinkButton.textContent = "正在选择恢复钱包…";
  setMessage(identityStatus, "请在钱包中选择一个尚未绑定的地址；不会发起交易。");
  try {
    let accounts;
    try {
      await provider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      accounts = await provider.request({ method: "eth_accounts" });
    } catch (error) {
      if (Number(error?.code) === 4001) throw error;
      accounts = await provider.request({ method: "eth_requestAccounts" });
    }
    const chainHex = await provider.request({ method: "eth_chainId" });
    const chainId = typeof chainHex === "string" ? Number.parseInt(chainHex, 16) : NaN;
    const knownAccounts = new Set(
      linkedIdentities.map((identity) => identity.accountId.toLowerCase()),
    );
    const address = Array.isArray(accounts)
      ? accounts.find((candidate) => (
        typeof candidate === "string"
        && !knownAccounts.has(`eip155:${chainId}:${candidate}`.toLowerCase())
      ))
      : null;
    if (typeof address !== "string" || !Number.isSafeInteger(chainId)) {
      throw new Error("请选择一个尚未绑定的新钱包地址后重试。");
    }

    const challenge = await dreamApiRequest("/v1/account/identities/link/nonce", {
      method: "POST",
      body: JSON.stringify({
        address,
        chainId,
        uri: globalThis.location.href.split("#", 1)[0],
      }),
    });
    setMessage(identityStatus, "请确认“绑定恢复钱包”签名；这不是交易，不产生 Gas。");
    const signature = await provider.request({
      method: "personal_sign",
      params: [challenge.message, address],
    });
    if (typeof signature !== "string") {
      throw new Error("钱包没有返回有效签名。");
    }
    const result = await dreamApiRequest("/v1/account/identities/link/verify", {
      method: "POST",
      body: JSON.stringify({
        challengeId: challenge.challengeId,
        message: challenge.message,
        signature,
      }),
    });
    renderLinkedIdentities(result);
    setMessage(
      identityStatus,
      "恢复钱包已绑定。你可以退出后用它重新登录，梦想仍属于同一个睡眠宝账号。",
    );
  } catch (error) {
    setMessage(identityStatus, walletErrorMessage(error), true);
  } finally {
    accountActionBusy = false;
    walletLinkInProgress = false;
    renderLinkedIdentities({ identities: linkedIdentities, maximumWallets: 5 });
  }
}

async function removeLinkedIdentity(identity, button) {
  if (!authenticatedAccount || accountActionBusy) return;
  if (button.dataset.confirming !== "true") {
    button.dataset.confirming = "true";
    button.textContent = "再次点击移除";
    setMessage(
      identityStatus,
      `只移除 ${identity.displayId} 的登录能力，不会删除梦想或影响主钱包。`,
    );
    globalThis.setTimeout(() => {
      if (!button.isConnected || button.dataset.confirming !== "true") return;
      delete button.dataset.confirming;
      button.textContent = "移除";
    }, 6_000);
    return;
  }

  accountActionBusy = true;
  button.disabled = true;
  button.textContent = "正在移除…";
  try {
    const result = await dreamApiRequest(`/v1/account/identities/${identity.id}`, {
      method: "DELETE",
      body: JSON.stringify({
        accountId: identity.accountId,
        confirmation: "移除这个恢复钱包",
      }),
    });
    renderLinkedIdentities(result);
    setMessage(identityStatus, `${identity.displayId} 已移除；梦想和主钱包保持不变。`);
  } catch (error) {
    accountActionBusy = false;
    button.disabled = false;
    delete button.dataset.confirming;
    button.textContent = "移除";
    setMessage(identityStatus, walletErrorMessage(error), true);
    return;
  }
  accountActionBusy = false;
  renderLinkedIdentities({ identities: linkedIdentities, maximumWallets: 5 });
}

async function adoptAccountConflictVersion() {
  if (!pendingConflict || accountActionBusy) return;
  const { localDreamId, remoteDream } = pendingConflict;
  const current = getDreamById(localDreamId);
  if (!current) return;
  accountActionBusy = true;
  setConflictBusy(true);
  setMessage(conflictStatus, "正在把账号梦卡应用到本机；服务器不会被修改。");
  const saved = updateDreamFromAccount(localDreamId, (dream) => (
    applyRemoteDreamCard(dream, remoteDream)
  ));
  accountActionBusy = false;
  if (!saved) {
    setConflictBusy(false);
    setMessage(conflictStatus, "浏览器没有允许保存，本机版本仍未改变。", true);
    return;
  }
  closeConflictDialog(false);
  renderWorkspace();
  await showAccountAndSyncPreview();
  setMessage(syncStatus, "已采用账号梦卡；本机对话仍保留，服务器没有发生写入。");
}

async function keepBothConflictVersions() {
  if (!pendingConflict || accountActionBusy) return;
  const { localDreamId, remoteDream } = pendingConflict;
  const current = getDreamById(localDreamId);
  const copyClientId = createSyncId();
  if (!current || !copyClientId) {
    setMessage(conflictStatus, "当前浏览器无法建立安全副本编号，尚未改动任何版本。", true);
    return;
  }

  accountActionBusy = true;
  setConflictBusy(true);
  setMessage(conflictStatus, "正在复制本机版，并让原梦想采用账号版…");
  const now = new Date().toISOString();
  const localCopy = normalizeDream({
    ...current,
    id: createId("dream"),
    title: `${current.title} · 本机副本`,
    syncClientId: copyClientId,
    sync: null,
    artifacts: [],
    createdAt: now,
    updatedAt: now,
  });
  if (!localCopy) {
    accountActionBusy = false;
    setConflictBusy(false);
    setMessage(conflictStatus, "本机副本没有通过数据校验，尚未改动任何版本。", true);
    return;
  }

  const accountSideMessages = current.messages.filter((message) => (
    ["account-user", "openai"].includes(message.source)
  ));
  const adoptedAccountVersion = normalizeDream(applyRemoteDreamCard({
    ...current,
    messages: accountSideMessages,
    artifacts: [],
  }, remoteDream));
  const originalIndex = workspaceStore.dreams.findIndex((dream) => dream.id === localDreamId);
  if (!adoptedAccountVersion || originalIndex < 0) {
    accountActionBusy = false;
    setConflictBusy(false);
    setMessage(conflictStatus, "版本状态已经变化，尚未改动任何版本。", true);
    return;
  }
  workspaceStore.dreams.splice(originalIndex, 1, adoptedAccountVersion);
  workspaceStore.dreams.unshift(localCopy);
  workspaceStore.activeDreamId = localCopy.id;
  const saved = persistWorkspace();
  accountActionBusy = false;
  if (!saved) {
    workspaceStore.dreams = workspaceStore.dreams.filter((dream) => dream.id !== localCopy.id);
    workspaceStore.dreams.splice(originalIndex, 1, current);
    workspaceStore.activeDreamId = current.id;
    setConflictBusy(false);
    setMessage(conflictStatus, "浏览器没有允许保存，两个原版本都没有被覆盖。", true);
    return;
  }
  closeConflictDialog(false);
  renderWorkspace();
  await showAccountAndSyncPreview();
  setMessage(syncStatus, "已保留两份：本机版成为新梦想，原梦想采用账号版；服务器没有被覆盖。");
}

async function updateAccountFromLocalConflict() {
  if (!pendingConflict || accountActionBusy) return;
  const { localDreamId, remoteDream } = pendingConflict;
  const current = getDreamById(localDreamId);
  if (!current) return;
  accountActionBusy = true;
  setConflictBusy(true);
  setMessage(conflictStatus, `正在以账号修订 v${remoteDream.revision} 为前提写入；若版本已变化会安全拒绝。`);
  try {
    const { clientId, ...payload } = accountDreamPayload(current);
    const result = await dreamApiRequest(`/v1/dreams/${remoteDream.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...payload,
        expectedRevision: remoteDream.revision,
      }),
    });
    updateDreamFromAccount(localDreamId, (dream) => (
      applyRemoteDreamCard(dream, result.dream)
    ));
    accountActionBusy = false;
    closeConflictDialog(false);
    renderWorkspace();
    await showAccountAndSyncPreview();
    setMessage(syncStatus, `账号已生成修订 v${result.dream.revision}；没有覆盖更晚的服务器版本。`);
  } catch (error) {
    accountActionBusy = false;
    setConflictBusy(false);
    setMessage(conflictStatus, walletErrorMessage(error), true);
  }
}

function updateAccountDeleteConfirmation() {
  if (!accountDeleteConfirmButton) return;
  accountDeleteConfirmButton.disabled = accountActionBusy
    || !authenticatedAccount
    || !accountDeleteAck?.checked
    || accountDeletePhrase?.value.trim() !== "彻底删除我的账号";
}

function resetAccountDeleteDialog() {
  if (accountDeleteAck) accountDeleteAck.checked = false;
  if (accountDeletePhrase) accountDeletePhrase.value = "";
  if (accountDeleteConfirmButton) {
    accountDeleteConfirmButton.disabled = true;
    accountDeleteConfirmButton.textContent = "永久删除服务器账号";
  }
  setMessage(accountDeleteStatus, "");
}

function openAccountDeleteDialog() {
  if (!accountDeleteDialog || !authenticatedAccount) return;
  closeAccountDialog();
  resetAccountDeleteDialog();
  if (typeof accountDeleteDialog.showModal === "function") {
    if (!accountDeleteDialog.open) accountDeleteDialog.showModal();
  } else {
    accountDeleteDialog.setAttribute("open", "");
  }
}

function closeAccountDeleteDialog() {
  if (!accountDeleteDialog || accountActionBusy) return;
  if (typeof accountDeleteDialog.close === "function") accountDeleteDialog.close();
  else accountDeleteDialog.removeAttribute("open");
  resetAccountDeleteDialog();
}

function openAiDialog() {
  if (!aiDialog) return;
  if (aiConsent) aiConsent.checked = false;
  if (aiEnableButton) aiEnableButton.disabled = true;
  setMessage(aiDialogStatus, "");
  if (typeof aiDialog.showModal === "function") {
    if (!aiDialog.open) aiDialog.showModal();
  } else {
    aiDialog.setAttribute("open", "");
  }
}

function closeAiDialog() {
  if (!aiDialog) return;
  if (typeof aiDialog.close === "function") aiDialog.close();
  else aiDialog.removeAttribute("open");
}

function milestonesForRemoteStage(dream, currentStage) {
  const activeIndex = Math.max(0, STAGES.findIndex((stage) => stage.id === currentStage));
  return STAGES.map((stage, index) => ({
    id: stage.id,
    title: stage.label,
    status: index < activeIndex
      ? "complete"
      : index === activeIndex
        ? "active"
        : "pending",
    evidence: dream.milestones.find((item) => item.id === stage.id)?.evidence || "",
  }));
}

function updateDreamFromAccount(dreamId, updater) {
  const current = getDreamById(dreamId);
  if (!current) return false;
  const next = normalizeDream(updater(current));
  if (!next) return false;
  const index = workspaceStore.dreams.findIndex((dream) => dream.id === dreamId);
  if (index < 0) return false;
  workspaceStore.dreams.splice(index, 1, next);
  if (workspaceStore.activeDreamId === dreamId) activeDream = next;
  return persistWorkspace();
}

function updateActiveDreamFromAccount(updater) {
  return activeDream ? updateDreamFromAccount(activeDream.id, updater) : false;
}

function applyRemoteDreamCard(localDream, remoteDream) {
  if (!remoteDream || typeof remoteDream !== "object") return localDream;
  const constraints = Array.isArray(remoteDream.constraints)
    ? remoteDream.constraints.map(normalizeText).filter(Boolean)
    : [];
  return {
    ...localDream,
    title: normalizeText(remoteDream.title) || localDream.title,
    wish: normalizeText(remoteDream.originalWish) || localDream.wish,
    artifactLabel: normalizeText(remoteDream.vision) || localDream.artifactLabel,
    successCriterion: normalizeText(remoteDream.successCriteria) || localDream.successCriterion,
    boundary: constraints.join("；") || localDream.boundary,
    status: VALID_STATUSES.has(remoteDream.status) ? remoteDream.status : localDream.status,
    milestones: milestonesForRemoteStage(localDream, remoteDream.currentStage),
    sync: {
      serverId: remoteDream.id || localDream.sync?.serverId,
      revision: Number.isSafeInteger(remoteDream.revision)
        ? remoteDream.revision
        : localDream.sync?.revision || 1,
      syncedAt: remoteDream.updatedAt || new Date().toISOString(),
      localChanged: false,
    },
    updatedAt: remoteDream.updatedAt || new Date().toISOString(),
  };
}

function accountMessagesWithAttachments(result) {
  const suggestions = new Map(
    (Array.isArray(result.suggestions) ? result.suggestions : [])
      .filter((item) => typeof item?.runId === "string")
      .map((item) => [item.runId, item]),
  );
  const proposals = new Map();
  (Array.isArray(result.actionProposals) ? result.actionProposals : []).forEach((item) => {
    if (typeof item?.runId !== "string") return;
    const list = proposals.get(item.runId) || [];
    list.push(item);
    proposals.set(item.runId, list);
  });
  return (Array.isArray(result.messages) ? result.messages : [])
    .filter((message) => ["user", "assistant"].includes(message?.role))
    .map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      source: message.source === "openai" ? "openai" : "account-user",
      createdAt: message.createdAt,
      suggestion: message.role === "assistant"
        ? suggestions.get(message.runId) || null
        : null,
      actionProposals: message.role === "assistant"
        ? proposals.get(message.runId) || []
        : [],
    }));
}

async function loadAccountConversation(dream = activeDream, force = false) {
  if (!authenticatedAccount || !dream?.sync?.serverId) return;
  const key = `${authenticatedAccount.userId}:${dream.sync.serverId}`;
  if (!force && loadedConversationDreamIds.has(key)) return;
  try {
    const result = await dreamApiRequest(
      `/v1/dreams/${encodeURIComponent(dream.sync.serverId)}/conversation`,
    );
    loadedConversationDreamIds.add(key);
    const accountMessages = accountMessagesWithAttachments(result);
    const current = getDreamById(dream.id);
    if (!current) return;
    const existingIds = new Set(current.messages.map((message) => message.id));
    const mergedMessages = [
      ...current.messages,
      ...accountMessages.filter((message) => !existingIds.has(message.id)),
    ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    let next = { ...current, messages: mergedMessages };
    if (!current.sync?.localChanged) {
      next = applyRemoteDreamCard(next, result.dream);
    }
    updateDreamFromAccount(dream.id, () => next);
    renderWorkspace();
  } catch (error) {
    if (error?.status === 401) {
      aiEnabledDreamIds.delete(dream.id);
      authenticatedAccount = null;
      linkedIdentities = [];
      renderWorkspace();
    }
  }
}

async function loadAccountArtifacts(dream = activeDream, force = false) {
  if (!authenticatedAccount || !dream?.sync?.serverId) return;
  const key = `${authenticatedAccount.userId}:${dream.sync.serverId}`;
  if (!force && loadedArtifactDreamIds.has(key)) return;
  try {
    const result = await dreamApiRequest(
      `/v1/dreams/${encodeURIComponent(dream.sync.serverId)}/artifacts`,
    );
    loadedArtifactDreamIds.add(key);
    updateDreamFromAccount(dream.id, (current) => ({
      ...current,
      artifacts: Array.isArray(result.artifacts) ? result.artifacts : [],
    }));
    renderWorkspace();
  } catch (error) {
    if (error?.status === 401) {
      authenticatedAccount = null;
      linkedIdentities = [];
      loadedArtifactDreamIds.clear();
      renderWorkspace();
    }
  }
}

async function generateAccountArtifact(kind) {
  if (!activeDream || artifactActionBusy) return;
  const actionBoard = kind === "action_board";
  const artifactLabel = actionBoard ? "梦想行动台" : "施工任务书";
  const endpoint = actionBoard ? "action-board" : "brief";
  if (!authenticatedAccount) {
    setMessage(artifactStatus, "先连接钱包账号；连接本身不会上传梦卡。", true);
    walletPreviewButton?.focus();
    return;
  }
  if (!activeDream.sync?.serverId || activeDream.sync.localChanged) {
    setMessage(
      artifactStatus,
      activeDream.sync?.localChanged
        ? "本机与账号梦卡不同，当前不会用不确定的版本生成产物。"
        : "先在合并预览中确认保存这张梦卡。",
      true,
    );
    await showAccountAndSyncPreview();
    return;
  }
  if (activeDream.status !== "confirmed") {
    setMessage(artifactStatus, "请先确认梦卡并进入轨迹。", true);
    return;
  }
  const clientRequestId = createSyncId();
  if (!clientRequestId) {
    setMessage(artifactStatus, "当前浏览器无法建立安全请求编号，产物没有生成。", true);
    return;
  }

  const dreamId = activeDream.id;
  const serverId = activeDream.sync.serverId;
  let completionMessage = "";
  let completionIsError = false;
  artifactActionBusy = true;
  renderArtifacts(activeDream);
  setMessage(
    artifactStatus,
    actionBoard
      ? "正在生成不联网、可离线使用的单文件梦想行动台…"
      : "正在从当前修订生成可校验的 Markdown 施工包…",
  );
  try {
    const result = await dreamApiRequest(
      `/v1/dreams/${serverId}/artifacts/${endpoint}`,
      {
        method: "POST",
        body: JSON.stringify({
          clientRequestId,
          expectedRevision: activeDream.sync.revision,
          confirmed: true,
        }),
      },
    );
    updateDreamFromAccount(dreamId, (dream) => ({
      ...dream,
      artifacts: [
        result.artifact,
        ...(dream.artifacts || []).filter((item) => item.id !== result.artifact.id),
      ],
    }));
    loadedArtifactDreamIds.delete(`${authenticatedAccount.userId}:${serverId}`);
    completionMessage = `${artifactLabel} v${result.artifact.version} 已生成。${
        actionBoard
          ? "现在可以安全预览或下载为离线 HTML。"
          : "它可以下载并交给后续 Agents。"
      } 没有执行任何外部动作。`;
  } catch (error) {
    completionMessage = walletErrorMessage(error);
    completionIsError = true;
  } finally {
    artifactActionBusy = false;
    renderWorkspace();
    setMessage(artifactStatus, completionMessage, completionIsError);
  }
}

async function generateProjectBrief() {
  return generateAccountArtifact("project_brief");
}

async function generateDreamActionBoard() {
  return generateAccountArtifact("action_board");
}

function artifactDownloadPayload(result, fallbackVersion = 1) {
  const content = typeof result.content === "string" ? result.content : "";
  if (!content) throw new Error("产物内容为空，暂时无法使用。");
  const mimeType = normalizeText(result.artifact?.mimeType)
    || "text/plain;charset=utf-8";
  const safeFilename = (
    normalizeText(result.artifact?.filename)
    || `artifact-v${fallbackVersion}.txt`
  )
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .slice(0, 120);
  return { content, mimeType, safeFilename };
}

function downloadArtifactPayload(payload) {
  const url = URL.createObjectURL(new Blob([payload.content], {
    type: payload.mimeType,
  }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = payload.safeFilename;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

async function downloadAccountArtifact(artifact) {
  if (!activeDream?.sync?.serverId || artifactActionBusy) return;
  let completionMessage = "";
  let completionIsError = false;
  artifactActionBusy = true;
  renderArtifacts(activeDream);
  setMessage(artifactStatus, `正在准备 ${artifact.name} v${artifact.version}…`);
  try {
    const result = await dreamApiRequest(
      `/v1/dreams/${activeDream.sync.serverId}/artifacts/${artifact.id}`,
    );
    const payload = artifactDownloadPayload(result, artifact.version);
    downloadArtifactPayload(payload);
    completionMessage = `${payload.safeFilename} 已交给浏览器下载。`;
  } catch (error) {
    completionMessage = walletErrorMessage(error);
    completionIsError = true;
  } finally {
    artifactActionBusy = false;
    renderArtifacts(activeDream);
    setMessage(artifactStatus, completionMessage, completionIsError);
  }
}

function resetArtifactPreviewContent() {
  artifactPreviewFrame?.removeAttribute("src");
  artifactPreviewPayload = null;
}

function closeArtifactPreview() {
  if (!artifactPreviewDialog) return;
  if (typeof artifactPreviewDialog.close === "function") {
    artifactPreviewDialog.close();
  } else {
    artifactPreviewDialog.removeAttribute("open");
  }
  resetArtifactPreviewContent();
}

async function previewAccountArtifact(artifact) {
  if (
    !activeDream?.sync?.serverId
    || artifact.kind !== "action_board"
    || artifactActionBusy
  ) return;
  let completionMessage = "";
  let completionIsError = false;
  artifactActionBusy = true;
  renderArtifacts(activeDream);
  setMessage(artifactStatus, `正在准备 ${artifact.name} v${artifact.version} 安全预览…`);
  try {
    const result = await dreamApiRequest(
      `/v1/dreams/${activeDream.sync.serverId}/artifacts/${artifact.id}`,
    );
    const payload = artifactDownloadPayload(result, artifact.version);
    if (!payload.mimeType.toLowerCase().startsWith("text/html")) {
      throw new Error("这份产物不是可预览的 HTML 文件。");
    }
    artifactPreviewPayload = payload;
    if (artifactPreviewTitle) {
      artifactPreviewTitle.textContent = `${artifact.name} · v${artifact.version}`;
    }
    if (artifactPreviewFrame) {
      artifactPreviewFrame.src = [
        "/v1/dreams",
        encodeURIComponent(activeDream.sync.serverId),
        "artifacts",
        encodeURIComponent(artifact.id),
        "preview",
      ].join("/");
    }
    setMessage(
      artifactPreviewStatus,
      "当前是隔离预览；预览页不会联网。下载后打开可获得完整的离线使用与进度导出体验。",
    );
    if (typeof artifactPreviewDialog?.showModal === "function") {
      if (!artifactPreviewDialog.open) artifactPreviewDialog.showModal();
    } else {
      artifactPreviewDialog?.setAttribute("open", "");
    }
    completionMessage = `${artifact.name} v${artifact.version} 已在隔离预览中打开。`;
  } catch (error) {
    completionMessage = walletErrorMessage(error);
    completionIsError = true;
  } finally {
    artifactActionBusy = false;
    renderArtifacts(activeDream);
    setMessage(artifactStatus, completionMessage, completionIsError);
  }
}

async function requestAiMode() {
  if (!activeDream || aiActionBusy) return;
  if (aiModeEnabled()) {
    aiEnabledDreamIds.delete(activeDream.id);
    renderAiControls();
    return;
  }
  if (!authenticatedAccount) {
    setMessage(
      messageStatus,
      "AI 对话需要先验证钱包账号；这不会上传本机梦想。连接后仍会先让你预览和确认。",
      true,
    );
    walletPreviewButton?.focus();
    return;
  }
  if (!activeDream.sync?.serverId || activeDream.sync.localChanged) {
    setMessage(
      messageStatus,
      activeDream.sync?.localChanged
        ? "本机梦卡与账号版本不同。为避免把错误上下文交给 AI，请先处理同步差异。"
        : "先在账号合并预览中确认保存这张梦卡，再开启 AI 对话。",
      true,
    );
    await showAccountAndSyncPreview();
    return;
  }
  await ensureDreamApi(true);
  renderAiControls();
  if (!dreamApiHealth?.aiConfigured) {
    setMessage(
      messageStatus,
      "AI 服务尚未配置；你的内容没有发送给模型，本机记录仍可继续使用。",
      true,
    );
    return;
  }
  openAiDialog();
}

function applyAiTurnResult(dreamId, serverId, pending, result) {
  const now = new Date().toISOString();
  const nextUserMessage = result.userMessage || {
    id: `account:${pending.clientRequestId}`,
    role: "user",
    content: pending.content,
    createdAt: now,
    source: "account-user",
  };
  nextUserMessage.source = "account-user";
  const nextAssistantMessage = result.message?.id
    ? {
      ...result.message,
      source: "openai",
      suggestion: result.suggestion || null,
      actionProposals: result.actionProposals || [],
    }
    : null;
  const current = getDreamById(dreamId);
  if (current) {
    const knownIds = new Set(current.messages.map((message) => message.id));
    updateDreamFromAccount(dreamId, (dream) => ({
      ...dream,
      pendingAiTurn: null,
      messages: [
        ...dream.messages,
        ...(!knownIds.has(nextUserMessage.id) ? [nextUserMessage] : []),
        ...(
          nextAssistantMessage?.id && !knownIds.has(nextAssistantMessage.id)
            ? [nextAssistantMessage]
            : []
        ),
      ],
      updatedAt: result.message?.createdAt || now,
    }));
  }
  if (messageInput?.dataset.pendingAiTurnId === pending.clientRequestId) {
    messageInput.value = "";
    delete messageInput.dataset.pendingAiTurnId;
    delete messageInput.dataset.pendingAiDreamId;
  }
  loadedConversationDreamIds.delete(`${authenticatedAccount.userId}:${serverId}`);
  return result.suggestion || result.actionProposals?.length
    ? "AI 已回应。梦卡建议和授权卡都在对话中，只有你确认后才会改变状态。"
    : result.run?.status === "refused"
      ? "AI 已明确拒绝这次请求；同一回合已经结束，没有执行任何外部动作。"
      : "AI 已回应；同一回合已经结束，没有修改梦卡或执行外部动作。";
}

function updatePendingAiTurnAfterError(dreamId, pending, error) {
  const runId = UUID_PATTERN.test(error?.details?.runId)
    ? error.details.runId
    : pending.runId;
  const running = error?.code === "ai_run_in_progress";
  const uncertain = Boolean(runId) && [
    "ai_run_finalize_uncertain",
    "ai_run_superseded",
    "ai_run_unavailable",
  ].includes(error?.code);
  const retryable = error?.details?.retryable === true
    || error?.code === "ai_run_retryable";
  const next = {
    ...pending,
    runId,
    state: running ? "running" : uncertain ? "uncertain" : retryable ? "retryable" : "uncertain",
    attempt: Number.isSafeInteger(error?.details?.attempt)
      ? error.details.attempt
      : pending.attempt,
    retryAfterSeconds: Number.isSafeInteger(error?.details?.retryAfterSeconds)
      ? error.details.retryAfterSeconds
      : null,
    errorCode: error?.code || "request_uncertain",
    updatedAt: new Date().toISOString(),
  };
  savePendingAiTurn(dreamId, next);
  return next;
}

async function inspectPendingAiTurn(dreamId, serverId, pending) {
  if (!pending.runId || aiActionBusy) return;
  aiActionBusy = true;
  renderAiControls();
  let finalMessage = "";
  let finalError = false;
  try {
    const result = await dreamApiRequest(
      `/v1/dreams/${serverId}/runs/${encodeURIComponent(pending.runId)}`,
    );
    const status = result.run?.status;
    if (["completed", "refused", "succeeded"].includes(status)) {
      finalMessage = applyAiTurnResult(dreamId, serverId, pending, result);
    } else if (status === "failed") {
      savePendingAiTurn(dreamId, {
        ...pending,
        state: "retryable",
        attempt: result.run?.attempt || pending.attempt,
        retryAfterSeconds: null,
        errorCode: result.run?.errorCode || "ai_run_failed",
        updatedAt: new Date().toISOString(),
      });
      finalMessage = "已确认同一 AI 回合失败。点击“重试同一回合”会复用原内容和请求编号。";
      finalError = true;
    } else if (status === "running") {
      const state = result.run?.retryable ? "retryable" : "running";
      savePendingAiTurn(dreamId, {
        ...pending,
        state,
        attempt: result.run?.attempt || pending.attempt,
        retryAfterSeconds: result.run?.retryAfterSeconds || null,
        errorCode: null,
        updatedAt: new Date().toISOString(),
      });
      finalMessage = state === "retryable"
        ? "同一 AI 回合已超过正常处理窗口。点击“重试同一回合”可安全认领下一次 attempt。"
        : pendingAiStatusMessage(getDreamById(dreamId)?.pendingAiTurn);
      finalError = state === "retryable";
    } else {
      savePendingAiTurn(dreamId, {
        ...pending,
        state: "retryable",
        errorCode: "ai_run_status_unknown",
        updatedAt: new Date().toISOString(),
      });
      finalMessage = "服务端返回了未知状态。已保留原请求；可以重试同一回合。";
      finalError = true;
    }
  } catch (error) {
    if (error?.status === 401) {
      aiEnabledDreamIds.delete(dreamId);
      authenticatedAccount = null;
      linkedIdentities = [];
    }
    savePendingAiTurn(dreamId, {
      ...pending,
      state: "retryable",
      errorCode: error?.code || "run_lookup_failed",
      updatedAt: new Date().toISOString(),
    });
    finalMessage = `${walletErrorMessage(error)} 原请求仍保留；可以重试同一回合。`;
    finalError = true;
  } finally {
    aiActionBusy = false;
    renderWorkspace();
    setMessage(messageStatus, finalMessage, finalError);
  }
}

async function sendAiMessage(content) {
  if (
    !activeDream
    || !authenticatedAccount
    || !activeDream.sync?.serverId
    || activeDream.sync.localChanged
    || aiActionBusy
  ) {
    setMessage(messageStatus, "当前梦想还没有准备好安全使用 AI，请先检查账号与同步状态。", true);
    return;
  }

  const dreamId = activeDream.id;
  const serverId = activeDream.sync.serverId;
  const expectedRevision = activeDream.sync.revision;
  let pending = pendingAiTurnFor();
  if (
    pending
    && (pending.content !== content || pending.expectedRevision !== expectedRevision)
  ) {
    clearPendingAiTurn(dreamId);
    pending = null;
  }
  if (!pending) {
    const clientRequestId = createSyncId();
    if (!clientRequestId) {
      setMessage(messageStatus, "当前浏览器无法建立安全请求编号；内容没有发送。", true);
      return;
    }
    const now = new Date().toISOString();
    pending = {
      clientRequestId,
      content,
      expectedRevision,
      consent: {
        accepted: true,
        scope: "openai_dream_assistant_v1",
      },
      runId: null,
      state: "ready",
      attempt: null,
      retryAfterSeconds: null,
      errorCode: null,
      createdAt: now,
      updatedAt: now,
    };
    if (!savePendingAiTurn(dreamId, pending)) {
      setMessage(messageStatus, "浏览器无法保存安全重试信息；内容没有发送。", true);
      return;
    }
  }

  if (pending.runId && ["running", "uncertain"].includes(pending.state)) {
    await inspectPendingAiTurn(dreamId, serverId, pending);
    return;
  }

  aiActionBusy = true;
  renderAiControls();
  let finalMessage = "";
  let finalError = false;
  setMessage(
    messageStatus,
    pending.state === "ready"
      ? "AI 正在理解这条消息；请求编号已保存在本机。"
      : "正在重试同一回合；内容、梦卡修订、同意范围与请求编号保持不变。",
  );
  try {
    const result = await dreamApiRequest(`/v1/dreams/${serverId}/turns`, {
      method: "POST",
      body: JSON.stringify({
        content: pending.content,
        clientRequestId: pending.clientRequestId,
        expectedRevision: pending.expectedRevision,
        consent: pending.consent,
      }),
    });
    finalMessage = applyAiTurnResult(dreamId, serverId, pending, result);
  } catch (error) {
    if (["revision_conflict", "ai_idempotency_conflict"].includes(error?.code)) {
      clearPendingAiTurn(dreamId);
      delete messageInput?.dataset.pendingAiTurnId;
      delete messageInput?.dataset.pendingAiDreamId;
      finalMessage = `${walletErrorMessage(error)} 旧回合已清理，请确认最新梦卡后重新发送。`;
    } else {
      const next = updatePendingAiTurnAfterError(dreamId, pending, error);
      finalMessage = next.state === "running"
        ? pendingAiStatusMessage(next)
        : `${walletErrorMessage(error)} ${pendingAiStatusMessage(next)}`;
    }
    finalError = true;
    if (error?.status === 401) {
      aiEnabledDreamIds.delete(dreamId);
      authenticatedAccount = null;
      linkedIdentities = [];
    }
  } finally {
    aiActionBusy = false;
    renderWorkspace();
    setMessage(messageStatus, finalMessage, finalError);
  }
}

async function decideAiSuggestion(suggestion, decision) {
  if (!activeDream?.sync?.serverId || aiActionBusy) return;
  aiActionBusy = true;
  renderAiControls();
  try {
    const result = await dreamApiRequest(
      `/v1/dreams/${activeDream.sync.serverId}/suggestions/${suggestion.id}/decision`,
      {
        method: "POST",
        body: JSON.stringify({
          decision,
          ...(decision === "apply"
            ? { expectedRevision: activeDream.sync.revision }
            : {}),
        }),
      },
    );
    updateActiveDreamFromAccount((dream) => {
      let next = dream;
      if (result.dream) next = applyRemoteDreamCard(next, result.dream);
      return {
        ...next,
        messages: next.messages.map((message) => ({
          ...message,
          suggestion: message.suggestion?.id === suggestion.id
            ? { ...message.suggestion, status: result.suggestion.status }
            : message.suggestion,
        })),
      };
    });
    renderWorkspace();
    setMessage(
      messageStatus,
      decision === "apply"
        ? "梦卡已更新；这次只采用了建议，没有执行外部动作。"
        : "已保留原梦卡，这条建议标记为暂不采用。",
    );
  } catch (error) {
    setMessage(messageStatus, walletErrorMessage(error), true);
  } finally {
    aiActionBusy = false;
    renderAiControls();
  }
}

async function decideAiAction(proposal, decision) {
  if (!activeDream?.sync?.serverId || aiActionBusy) return;
  aiActionBusy = true;
  renderAiControls();
  try {
    const result = await dreamApiRequest(
      `/v1/dreams/${activeDream.sync.serverId}/actions/${proposal.id}/decision`,
      {
        method: "POST",
        body: JSON.stringify({ decision }),
      },
    );
    updateActiveDreamFromAccount((dream) => ({
      ...dream,
      messages: dream.messages.map((message) => ({
        ...message,
        actionProposals: (message.actionProposals || []).map((item) => (
          item.id === proposal.id ? result.actionProposal : item
        )),
      })),
    }));
    renderWorkspace();
    setMessage(messageStatus, result.note || "授权决定已记录，当前没有执行外部动作。");
  } catch (error) {
    setMessage(messageStatus, walletErrorMessage(error), true);
  } finally {
    aiActionBusy = false;
    renderAiControls();
  }
}

function currentStageForDream(dream) {
  const progress = getProgress(dream);
  return progress.active?.id
    || [...dream.milestones].reverse().find((item) => item.status === "complete")?.id
    || "wish";
}

function accountDreamPayload(dream) {
  return {
    clientId: dream.syncClientId,
    title: dream.title,
    originalWish: dream.wish,
    vision: dream.artifactLabel,
    successCriteria: dream.successCriterion,
    constraints: dream.boundary ? [dream.boundary] : [],
    status: dream.status,
    currentStage: currentStageForDream(dream),
  };
}

function sameDreamCard(localDream, remoteDream) {
  const payload = accountDreamPayload(localDream);
  return payload.title === remoteDream.title
    && payload.originalWish === remoteDream.originalWish
    && payload.vision === remoteDream.vision
    && payload.successCriteria === remoteDream.successCriteria
    && JSON.stringify(payload.constraints) === JSON.stringify(remoteDream.constraints || [])
    && payload.status === remoteDream.status
    && payload.currentStage === remoteDream.currentStage;
}

function renderSyncPreview(remoteDreams) {
  clearNode(syncList);
  pendingDreamImports = [];
  const remoteByClientId = new Map(
    remoteDreams
      .filter((dream) => typeof dream.clientId === "string")
      .map((dream) => [dream.clientId, dream]),
  );
  let mappingChanged = false;

  workspaceStore.dreams.forEach((dream) => {
    const row = document.createElement("li");
    appendText(row, "strong", dream.title);
    const remote = dream.syncClientId
      ? remoteByClientId.get(dream.syncClientId)
      : null;

    if (!dream.syncClientId) {
      row.classList.add("is-conflict");
      appendText(row, "span", "需要先导出备份");
      appendText(row, "small", "当前浏览器无法建立安全同步编号，因此不会上传。");
    } else if (!remote) {
      pendingDreamImports.push(dream);
      appendText(row, "span", "等待你确认保存");
      appendText(row, "small", "账号中没有同一梦想；确认后只新增，不覆盖其他内容。");
    } else {
      const matches = sameDreamCard(dream, remote);
      row.classList.add(matches ? "is-existing" : "is-conflict");
      appendText(row, "span", matches ? "账号中已有相同版本" : "发现版本差异");
      appendText(
        row,
        "small",
        matches
          ? `服务器修订号 ${remote.revision} · 不需要重复上传`
          : "本机与账号版本不同；不会自动覆盖，请比较后明确选择。",
      );
      if (!matches) {
        const compareButton = appendText(row, "button", "比较并选择");
        compareButton.type = "button";
        compareButton.className = "dream-sync-conflict-open";
        compareButton.addEventListener("click", () => openConflictDialog(dream, remote));
      }
      if (
        !dream.sync
        || dream.sync.serverId !== remote.id
        || dream.sync.revision !== remote.revision
        || dream.sync.localChanged === matches
      ) {
        dream.sync = {
          serverId: remote.id,
          revision: remote.revision,
          syncedAt: remote.updatedAt,
          localChanged: !matches,
        };
        mappingChanged = true;
      }
    }
    syncList?.append(row);
  });

  const cloudOnly = remoteDreams.filter(
    (remote) => !workspaceStore.dreams.some(
      (dream) => dream.syncClientId && dream.syncClientId === remote.clientId,
    ),
  ).length;
  if (syncSummary) {
    syncSummary.textContent = workspaceStore.dreams.length
      ? `${pendingDreamImports.length} 个本机梦想可以新增到账号；${cloudOnly} 个账号梦想只保留在云端，不会自动下载或覆盖本机。`
      : `本机没有梦想。账号中已有 ${remoteDreams.length} 个梦想，当前不会自动下载。`;
  }
  if (syncAccountButton) {
    syncAccountButton.disabled = pendingDreamImports.length === 0;
    syncAccountButton.textContent = pendingDreamImports.length
      ? `确认保存 ${pendingDreamImports.length} 个梦想`
      : "没有需要新增的梦想";
  }
  if (mappingChanged) persistWorkspace();
}

async function showAccountAndSyncPreview() {
  if (!authenticatedAccount) return;
  if (accountId) accountId.textContent = authenticatedAccount.accountId;
  openAccountDialog();
  loadLinkedIdentities();
  setMessage(syncStatus, "正在比较本机与账号中的梦想…");
  try {
    const result = await dreamApiRequest("/v1/dreams");
    renderSyncPreview(Array.isArray(result.dreams) ? result.dreams : []);
    setMessage(
      syncStatus,
      pendingDreamImports.length
        ? "只会新增上面标记的梦想；请确认后再保存。"
        : "比较完成，没有内容被自动上传或覆盖。",
    );
  } catch (error) {
    pendingDreamImports = [];
    if (syncAccountButton) syncAccountButton.disabled = true;
    setMessage(syncStatus, walletErrorMessage(error), true);
  }
}

async function connectWalletAccount() {
  if (accountActionBusy) return;
  accountActionBusy = true;
  if (walletPreviewButton) walletPreviewButton.disabled = true;
  setMessage(accountStatus, "正在确认身份服务与钱包…");

  try {
    if (!await ensureDreamApi(true)) {
      throw Object.assign(new Error("身份服务尚未部署到当前网站。"), {
        code: "service_unavailable",
      });
    }
    const provider = walletProvider();
    if (!provider) {
      throw new Error("没有发现可用的 EVM 钱包。请先安装或打开可信的钱包扩展。");
    }

    const accounts = await provider.request({ method: "eth_requestAccounts" });
    const address = Array.isArray(accounts) ? accounts[0] : null;
    const chainHex = await provider.request({ method: "eth_chainId" });
    const chainId = typeof chainHex === "string" ? Number.parseInt(chainHex, 16) : NaN;
    if (typeof address !== "string" || !Number.isSafeInteger(chainId)) {
      throw new Error("钱包没有返回有效的地址或链信息。");
    }

    setMessage(accountStatus, "请在钱包中确认登录签名；这不是交易，不产生 Gas。");
    const challenge = await dreamApiRequest("/v1/auth/nonce", {
      method: "POST",
      body: JSON.stringify({
        address,
        chainId,
        uri: globalThis.location.href.split("#", 1)[0],
      }),
    });
    const signature = await provider.request({
      method: "personal_sign",
      params: [challenge.message, address],
    });
    if (typeof signature !== "string") {
      throw new Error("钱包没有返回有效签名。");
    }

    authenticatedAccount = await dreamApiRequest("/v1/auth/verify", {
      method: "POST",
      body: JSON.stringify({
        challengeId: challenge.challengeId,
        message: challenge.message,
        signature,
      }),
    });
    renderIdentity();
    setMessage(accountStatus, "钱包控制权已验证；本机梦想尚未自动上传。");
    await showAccountAndSyncPreview();
  } catch (error) {
    setMessage(accountStatus, walletErrorMessage(error), true);
  } finally {
    accountActionBusy = false;
    if (walletPreviewButton) walletPreviewButton.disabled = false;
  }
}

async function syncPendingDreams() {
  if (!authenticatedAccount || !pendingDreamImports.length || accountActionBusy) return;
  accountActionBusy = true;
  if (syncAccountButton) syncAccountButton.disabled = true;
  let saved = 0;
  let failed = 0;

  for (const dream of [...pendingDreamImports]) {
    setMessage(syncStatus, `正在保存 ${saved + 1} / ${pendingDreamImports.length}：${dream.title}`);
    try {
      const result = await dreamApiRequest("/v1/dreams", {
        method: "POST",
        body: JSON.stringify(accountDreamPayload(dream)),
      });
      dream.sync = {
        serverId: result.dream.id,
        revision: result.dream.revision,
        syncedAt: result.dream.updatedAt,
        localChanged: false,
      };
      saved += 1;
      persistWorkspace();
    } catch (error) {
      failed += 1;
    }
  }

  accountActionBusy = false;
  await showAccountAndSyncPreview();
  if (activeDream?.sync?.serverId) {
    await loadAccountConversation(activeDream, true);
    await loadAccountArtifacts(activeDream, true);
  }
  setMessage(
    syncStatus,
    failed
      ? `已保存 ${saved} 个，${failed} 个没有完成；已完成的内容会保留，可安全重试。`
      : `已保存 ${saved} 个梦想卡。对话仍只在本机，没有上传。`,
    failed > 0,
  );
}

async function logoutWalletAccount() {
  if (!authenticatedAccount || accountActionBusy) return;
  accountActionBusy = true;
  if (accountLogoutButton) accountLogoutButton.disabled = true;
  setMessage(syncStatus, "正在撤销当前会话…");
  try {
    await dreamApiRequest("/v1/auth/logout", { method: "POST" });
    authenticatedAccount = null;
    pendingDreamImports = [];
    pendingConflict = null;
    linkedIdentities = [];
    aiEnabledDreamIds.clear();
    loadedConversationDreamIds.clear();
    loadedArtifactDreamIds.clear();
    closeAccountDialog();
    renderWorkspace();
    setMessage(accountStatus, "已退出钱包账号；本机梦想仍保留在这个浏览器。");
  } catch (error) {
    setMessage(syncStatus, `退出没有完成：${walletErrorMessage(error)}`, true);
  } finally {
    accountActionBusy = false;
    if (accountLogoutButton) accountLogoutButton.disabled = false;
  }
}

async function exportCloudAccount() {
  if (!authenticatedAccount || accountActionBusy) return;
  accountActionBusy = true;
  if (accountCloudExportButton) {
    accountCloudExportButton.disabled = true;
    accountCloudExportButton.textContent = "正在整理账号备份…";
  }
  setMessage(syncStatus, "正在读取账号梦想、对话、任务证据与产物正文…");
  try {
    const result = await dreamApiRequest("/v1/account/export");
    const filename = `sleeepal-account-${new Date().toISOString().slice(0, 10)}.json`;
    downloadJson(filename, result);
    setMessage(syncStatus, `${filename} 已交给浏览器下载；文件包含账号中的完整数据。`);
  } catch (error) {
    setMessage(syncStatus, walletErrorMessage(error), true);
  } finally {
    accountActionBusy = false;
    if (accountCloudExportButton) {
      accountCloudExportButton.disabled = false;
      accountCloudExportButton.textContent = "下载账号完整备份";
    }
  }
}

async function deleteCloudAccount() {
  if (
    !authenticatedAccount
    || accountActionBusy
    || !accountDeleteAck?.checked
    || accountDeletePhrase?.value.trim() !== "彻底删除我的账号"
  ) {
    updateAccountDeleteConfirmation();
    return;
  }

  const deletingAccountId = authenticatedAccount.accountId;
  accountActionBusy = true;
  updateAccountDeleteConfirmation();
  if (accountDeleteConfirmButton) {
    accountDeleteConfirmButton.textContent = "正在永久删除…";
  }
  setMessage(accountDeleteStatus, "正在删除服务器账号；请不要关闭此窗口。");

  try {
    const result = await dreamApiRequest("/v1/account/delete", {
      method: "POST",
      body: JSON.stringify({
        acknowledgeNoRecovery: true,
        confirmation: "彻底删除我的账号",
        accountId: deletingAccountId,
      }),
    });
    if (result?.deleted !== true) {
      throw new Error("服务器没有确认账号已经删除。");
    }

    authenticatedAccount = null;
    pendingDreamImports = [];
    pendingConflict = null;
    linkedIdentities = [];
    aiEnabledDreamIds.clear();
    loadedConversationDreamIds.clear();
    loadedArtifactDreamIds.clear();
    workspaceStore.dreams = workspaceStore.dreams.map((dream) => ({
      ...dream,
      sync: null,
      artifacts: [],
      pendingAiTurn: null,
    }));
    persistWorkspace();
    accountActionBusy = false;
    closeAccountDeleteDialog();
    renderWorkspace();
    setMessage(
      accountStatus,
      "服务器账号已彻底删除。本机梦想仍保留；需要时可逐个删除或清理浏览器数据。",
    );
  } catch (error) {
    accountActionBusy = false;
    if (accountDeleteConfirmButton) {
      accountDeleteConfirmButton.textContent = "永久删除服务器账号";
    }
    updateAccountDeleteConfirmation();
    setMessage(accountDeleteStatus, walletErrorMessage(error), true);
  }
}

async function restoreWalletSession() {
  if (!await ensureDreamApi()) return;
  try {
    const session = await dreamApiRequest("/v1/auth/session");
    if (session?.authenticated !== true) return;
    authenticatedAccount = session;
    renderWorkspace();
    setMessage(accountStatus, "已恢复钱包会话；本机梦想尚未自动上传。");
    if (activeDream?.sync?.serverId) {
      await loadAccountConversation(activeDream);
      await loadAccountArtifacts(activeDream);
    }
  } catch (error) {
    if (error?.status !== 401) {
      setMessage(accountStatus, "身份服务暂时无法恢复会话；本机梦想不受影响。", true);
    }
  }
}

async function invalidateWalletSession(message) {
  if (!authenticatedAccount) return;
  try {
    await dreamApiRequest("/v1/auth/logout", { method: "POST" });
  } catch (error) {
    // The UI still drops the stale identity; the server session expires independently.
  }
  authenticatedAccount = null;
  pendingConflict = null;
  linkedIdentities = [];
  aiEnabledDreamIds.clear();
  loadedConversationDreamIds.clear();
  loadedArtifactDreamIds.clear();
  closeAccountDialog();
  renderWorkspace();
  setMessage(accountStatus, message, true);
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

wishInput?.addEventListener("input", () => {
  updateWishMeter();
  updateExampleSelection();
});

messageInput?.addEventListener("input", () => {
  const pending = pendingAiTurnFor();
  if (!activeDream || !pending) return;
  if (normalizeText(messageInput.value) === pending.content) return;
  clearPendingAiTurn(activeDream.id);
  delete messageInput.dataset.pendingAiTurnId;
  delete messageInput.dataset.pendingAiDreamId;
  renderAiControls();
  setMessage(messageStatus, "内容已修改。旧请求编号已丢弃；再次发送会创建一个新的 AI 回合。");
});

artifactInput?.addEventListener("change", updateExampleSelection);

exampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!wishInput) return;
    wishInput.value = button.getAttribute("data-dream-example") || "";
    const artifactType = button.getAttribute("data-dream-artifact");
    if (artifactInput && ARTIFACTS[artifactType]) artifactInput.value = artifactType;
    updateWishMeter();
    updateExampleSelection();
    setMessage(formStatus, "示例已填入。你可以继续改成真正属于自己的愿望。");
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
    const existing = editingDreamId ? getDreamById(editingDreamId) : null;
    const dream = buildDream(existing);
    const saved = upsertDream(dream);
    editingDreamId = null;
    isCreating = false;
    activeDream = dream;
    if (submitButton) submitButton.disabled = false;
    isGenerating = false;
    renderWorkspace();
    setMobileWorkspaceView("progress", { focusTab: true });
    setMessage(
      cardStatus,
      saved ? "梦卡已经生成并保存到这个浏览器。" : "梦卡已经生成，但浏览器未允许本地保存。",
      !saved,
    );
  }, 180);
});

messageForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const content = normalizeText(messageInput?.value);
  if (!activeDream || !content) {
    messageInput?.focus();
    setMessage(messageStatus, "先写下一条你想补充的内容。", true);
    return;
  }

  if (aiModeEnabled()) {
    await sendAiMessage(content);
    return;
  }

  const pending = pendingAiTurnFor();
  if (pending && content === pending.content) {
    setMessage(
      messageStatus,
      "这是一个待恢复的 AI 回合。请先点击“使用 AI 助手”，再重试同一回合；不会记录成本机对话。",
      true,
    );
    aiModeButton?.focus();
    return;
  }

  const now = new Date().toISOString();
  updateActiveDream((dream) => addLocalAssistantMessage({
    ...dream,
    messages: [
      ...dream.messages,
      {
        id: createId("message"),
        role: "user",
        content,
        createdAt: now,
        source: "user",
      },
    ],
    updatedAt: now,
  }, "这条补充已经记录到当前梦想。这里尚未接入大模型，所以我不会假装已经理解或执行；接入后，它会参与梦卡与计划的下一次更新。"));
  if (messageInput) messageInput.value = "";
  renderWorkspace();
  setMessage(messageStatus, "已保存到当前梦想的本地对话。");
});

newDreamButton?.addEventListener("click", () => {
  enterCreateMode();
  setMobileWorkspaceView("chat");
});

mobileWorkspaceTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    setMobileWorkspaceView(tab.getAttribute("data-mobile-workspace-tab"), { focusTab: true });
  });
  tab.addEventListener("keydown", (event) => {
    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % mobileWorkspaceTabs.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + mobileWorkspaceTabs.length) % mobileWorkspaceTabs.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = mobileWorkspaceTabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextTab = mobileWorkspaceTabs[nextIndex];
    setMobileWorkspaceView(nextTab.getAttribute("data-mobile-workspace-tab"), { focusTab: true });
  });
});

walletPreviewButton?.addEventListener("click", () => {
  if (authenticatedAccount) {
    showAccountAndSyncPreview();
    return;
  }
  connectWalletAccount();
});

aiModeButton?.addEventListener("click", requestAiMode);
aiConsent?.addEventListener("change", () => {
  if (aiEnableButton) aiEnableButton.disabled = !aiConsent.checked;
});
aiEnableButton?.addEventListener("click", () => {
  if (!activeDream || !aiConsent?.checked) return;
  aiEnabledDreamIds.add(activeDream.id);
  closeAiDialog();
  renderAiControls();
  setMessage(
    messageStatus,
    "AI 对话已开启。每次发送仍使用同一明确范围；建议和授权卡不会自动执行。",
  );
  messageInput?.focus();
});
aiCloseButton?.addEventListener("click", closeAiDialog);
aiCancelButton?.addEventListener("click", closeAiDialog);
aiDialog?.addEventListener("click", (event) => {
  if (event.target === aiDialog) closeAiDialog();
});
artifactGenerateButton?.addEventListener("click", generateProjectBrief);
artifactBoardButton?.addEventListener("click", generateDreamActionBoard);
artifactPreviewCloseButton?.addEventListener("click", closeArtifactPreview);
artifactPreviewDownloadButton?.addEventListener("click", () => {
  if (!artifactPreviewPayload) return;
  downloadArtifactPayload(artifactPreviewPayload);
  setMessage(
    artifactPreviewStatus,
    `${artifactPreviewPayload.safeFilename} 已交给浏览器下载。`,
  );
});
artifactPreviewDialog?.addEventListener("click", (event) => {
  if (event.target === artifactPreviewDialog) closeArtifactPreview();
});
artifactPreviewDialog?.addEventListener("close", resetArtifactPreviewContent);

accountCloseButton?.addEventListener("click", closeAccountDialog);
accountDialog?.addEventListener("click", (event) => {
  if (event.target === accountDialog) closeAccountDialog();
});
syncAccountButton?.addEventListener("click", syncPendingDreams);
accountCloudExportButton?.addEventListener("click", exportCloudAccount);
accountExportButton?.addEventListener("click", () => {
  exportAllButton?.click();
  setMessage(syncStatus, "已触发本地 Markdown 备份下载。");
});
accountLogoutButton?.addEventListener("click", logoutWalletAccount);
identityLinkButton?.addEventListener("click", linkRecoveryWallet);
accountDeleteOpenButton?.addEventListener("click", openAccountDeleteDialog);
accountDeleteCloseButton?.addEventListener("click", closeAccountDeleteDialog);
accountDeleteCancelButton?.addEventListener("click", closeAccountDeleteDialog);
accountDeleteAck?.addEventListener("change", updateAccountDeleteConfirmation);
accountDeletePhrase?.addEventListener("input", updateAccountDeleteConfirmation);
accountDeleteConfirmButton?.addEventListener("click", deleteCloudAccount);
accountDeleteDialog?.addEventListener("click", (event) => {
  if (event.target === accountDeleteDialog) closeAccountDeleteDialog();
});
conflictCloseButton?.addEventListener("click", () => closeConflictDialog());
conflictCancelButton?.addEventListener("click", () => closeConflictDialog());
conflictCopyButton?.addEventListener("click", keepBothConflictVersions);
conflictAccountButton?.addEventListener("click", adoptAccountConflictVersion);
conflictLocalButton?.addEventListener("click", updateAccountFromLocalConflict);
conflictDialog?.addEventListener("click", (event) => {
  if (event.target === conflictDialog) closeConflictDialog();
});

const injectedWallet = walletProvider();
injectedWallet?.on?.("accountsChanged", (accounts) => {
  if (!authenticatedAccount || walletLinkInProgress) return;
  const activeAddress = Array.isArray(accounts) ? accounts[0] : null;
  const isLinkedAddress = typeof activeAddress === "string"
    && linkedIdentities.some((identity) => (
      identity.accountId.split(":").at(-1)?.toLowerCase() === activeAddress.toLowerCase()
    ));
  if (isLinkedAddress) {
    setMessage(
      accountStatus,
      "钱包已切换到同一账号的已绑定身份；服务器会话和梦想归属保持不变。",
    );
    return;
  }
  if (
    typeof activeAddress !== "string"
    || activeAddress.toLowerCase() !== authenticatedAccount.walletAddress.toLowerCase()
  ) {
    invalidateWalletSession("钱包账户已经切换。为避免身份混淆，请重新连接并签名。");
  }
});
injectedWallet?.on?.("chainChanged", () => {
  if (authenticatedAccount && !walletLinkInProgress) {
    invalidateWalletSession("钱包网络已经切换。请重新连接，让登录消息绑定当前链。");
  }
});

confirmButton?.addEventListener("click", () => {
  if (!activeDream || activeDream.status !== "draft") return;
  const now = new Date().toISOString();
  updateActiveDream((dream) => addLocalAssistantMessage({
    ...dream,
    status: "confirmed",
    confirmedAt: now,
    updatedAt: now,
    milestones: dream.milestones.map((milestone, index) => ({
      ...milestone,
      status: index < 2 ? "complete" : index === 2 ? "active" : "pending",
      evidence: index === 1 ? "用户已确认梦想卡" : milestone.evidence,
    })),
  }, "梦卡已经确认。下一步是把目标拆成可检查的计划；当前本地原型不会自动调用模型或 Agents。"));
  renderWorkspace();
});

editButton?.addEventListener("click", enterEditMode);

pauseButton?.addEventListener("click", () => {
  if (!activeDream || !["confirmed", "paused"].includes(activeDream.status)) return;
  const nextStatus = activeDream.status === "paused" ? "confirmed" : "paused";
  updateActiveDream((dream) => ({
    ...dream,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  }));
  renderWorkspace();
});

archiveButton?.addEventListener("click", () => {
  if (!activeDream) return;
  updateActiveDream((dream) => {
    const restoring = dream.status === "archived";
    return {
      ...dream,
      status: restoring && VALID_STATUSES.has(dream.statusBeforeArchive)
        ? dream.statusBeforeArchive
        : restoring
          ? "draft"
          : "archived",
      statusBeforeArchive: restoring ? null : dream.status,
      updatedAt: new Date().toISOString(),
    };
  });
  renderWorkspace();
});

exportButton?.addEventListener("click", () => {
  if (!activeDream) return;
  try {
    downloadText(`美梦成真-${activeDream.id.slice(0, 8)}.md`, dreamMarkdown(activeDream));
    setMessage(cardStatus, "当前梦想已导出为 Markdown。");
  } catch (error) {
    setMessage(cardStatus, "当前浏览器无法导出文件。请稍后重试。", true);
  }
});

exportAllButton?.addEventListener("click", () => {
  if (!workspaceStore.dreams.length) return;
  try {
    const text = [
      "# 美梦成真 · 全部梦想",
      "",
      `- 本机访客 ID：local:${workspaceStore.userId}`,
      `- 导出时间：${new Date().toLocaleString("zh-CN")}`,
      "",
      ...workspaceStore.dreams.flatMap((dream) => [dreamMarkdown(dream), "\n---\n"]),
    ].join("\n");
    downloadText(`美梦成真-全部梦想-${new Date().toISOString().slice(0, 10)}.md`, text);
    setMessage(accountStatus, `已导出 ${workspaceStore.dreams.length} 个梦想。`);
  } catch (error) {
    setMessage(accountStatus, "当前浏览器无法导出全部梦想。", true);
  }
});

deleteButton?.addEventListener("click", () => {
  if (!activeDream || !deleteButton) return;
  if (!deleteButton.hasAttribute("data-confirming")) {
    deleteButton.setAttribute("data-confirming", "true");
    deleteButton.textContent = "再次点击，永久删除";
    setMessage(cardStatus, "只删除当前梦想，无法撤销。请再次点击确认。");
    deleteResetTimer = globalThis.setTimeout(resetDeleteButton, 6000);
    return;
  }

  const deletedId = activeDream.id;
  workspaceStore.dreams = workspaceStore.dreams.filter((dream) => dream.id !== deletedId);
  workspaceStore.activeDreamId = workspaceStore.dreams[0]?.id || null;
  persistWorkspace();
  resetDeleteButton();
  activeDream = getDreamById(workspaceStore.activeDreamId);
  if (activeDream) {
    isCreating = false;
    editingDreamId = null;
  } else {
    isCreating = true;
    editingDreamId = null;
    resetForm();
  }
  renderWorkspace();
  setMobileWorkspaceView(activeDream ? "chat" : "dreams", { focusTab: true });
  setMessage(accountStatus, "当前梦想已从这个浏览器永久删除。");
});

globalThis.addEventListener("scroll", updateScrollState, { passive: true });
globalThis.addEventListener("resize", updateScrollState);
globalThis.addEventListener("resize", syncMobileWorkspaceMode);

workspaceStore = readWorkspaceStore();
if (workspaceStore.dreams.length) {
  activeDream = getDreamById(workspaceStore.activeDreamId) || workspaceStore.dreams[0];
  workspaceStore.activeDreamId = activeDream.id;
  isCreating = false;
  mobileWorkspaceView = "chat";
  persistWorkspace();
} else {
  isCreating = true;
  mobileWorkspaceView = "dreams";
}

workbench?.classList.add("is-mobile-enhanced");
if (mobileWorkspaceNav) mobileWorkspaceNav.hidden = false;
syncMobileWorkspaceMode();
initializeReveals();
updateWishMeter();
updateScrollState();
renderWorkspace();
restoreWalletSession();
globalThis.requestAnimationFrame(() => document.body.classList.add("is-ready"));
