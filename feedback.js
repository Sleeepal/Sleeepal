const feedbackCopy = {
  zh: {
    title: "SleeePal 问题反馈 — 本地优先反馈包",
    "nav.download": "下载",
    "nav.report": "打开夜报",
    "nav.features": "功能",
    "nav.pro": "Pro",
    "nav.feedback": "问题反馈",
    "nav.open": "打开导航",
    "nav.close": "关闭导航",
    "hero.kicker": "本地优先反馈包",
    "hero.title": "把问题说清楚，<br/><em>不用来回补充上下文</em>",
    "hero.body": "在另一台电脑上测试时，把系统、平台、版本、模块和现象一次整理成反馈包。音频、截图和夜报默认不包含，除非你主动附加。",
    "privacy.label": "默认隐私边界",
    "privacy.title": "只收问题上下文，不收敏感音频",
    "privacy.item1": "不自动上传麦克风音频",
    "privacy.item2": "不自动上传截图、夜报或完整日志",
    "privacy.item3": "复制/下载后由你决定发送给谁",
    "form.kicker": "反馈内容",
    "form.title": "生成可复制的问题包",
    "form.reset": "清空",
    "field.platform": "测试平台",
    "field.version": "App / 官网版本",
    "field.type": "问题类型",
    "field.severity": "严重度",
    "field.route": "输入/输出链路",
    "field.email": "联系方式（可选）",
    "field.message": "发生了什么？",
    "field.messagePlaceholder": "请写：在哪台机器上，点了什么，预期什么，实际发生了什么。",
    "type.bug": "Bug / 异常",
    "type.ui": "UI / 体验不适",
    "type.route": "音频链路 / 设备",
    "type.antiphase": "反相输出效果",
    "type.soundscape": "助眠声景排除",
    "type.report": "夜报 / 回放",
    "type.install": "安装 / 打包",
    "type.suggestion": "建议",
    "severity.blocks": "影响测试",
    "severity.workaround": "可绕过",
    "severity.minor": "轻微",
    "severity.idea": "建议",
    "check.screenshot": "我会另附截图",
    "check.report": "我会另附夜报/反馈 JSON",
    "check.audio": "我明确选择另附音频片段",
    "public.title": "GitHub Issue 会公开",
    "public.body": "不要提交专利、未公开工程资料、健康身份信息、音频、报告标识或联系方式。需要保密时，请不要使用本页的公开分享入口。",
    "public.confirm": "我确认公开内容不含上述敏感信息",
    "action.copy": "复制反馈包",
    "action.download": "下载 JSON",
    "action.github": "打开 GitHub Issue",
    "action.mail": "邮件发送",
    "status.ready": "填写后点击复制，反馈包会出现在右侧预览。",
    "status.copied": "已复制反馈内容，可以直接发送给睡眠宝。",
    "status.downloaded": "已生成 JSON 下载文件。",
    "status.reset": "已清空表单。",
    "status.githubApproval": "请先确认公开内容不含敏感或保密信息。",
    "preview.kicker": "实时预览",
  },
  en: {
    title: "SleeePal Feedback — Local-first feedback package",
    "nav.download": "Download",
    "nav.report": "Open report",
    "nav.features": "Features",
    "nav.pro": "Pro",
    "nav.feedback": "Feedback",
    "nav.open": "Open navigation",
    "nav.close": "Close navigation",
    "hero.kicker": "Local-first feedback package",
    "hero.title": "Report the problem clearly,<br/><em>without repeating context</em>",
    "hero.body": "When testing on another machine, package the platform, version, module, route, and observed issue in one pass. Audio, screenshots, and night reports are not included unless you choose to attach them.",
    "privacy.label": "Default privacy boundary",
    "privacy.title": "Context only, no sensitive audio",
    "privacy.item1": "Microphone audio is not uploaded automatically",
    "privacy.item2": "Screenshots, reports, and full logs are not uploaded automatically",
    "privacy.item3": "After copy/download, you decide where to send it",
    "form.kicker": "Feedback content",
    "form.title": "Generate a copyable issue package",
    "form.reset": "Reset",
    "field.platform": "Test platform",
    "field.version": "App / site version",
    "field.type": "Issue type",
    "field.severity": "Severity",
    "field.route": "Input/output route",
    "field.email": "Contact (optional)",
    "field.message": "What happened?",
    "field.messagePlaceholder": "Write: machine, what you clicked, what you expected, and what actually happened.",
    "type.bug": "Bug",
    "type.ui": "UI / UX discomfort",
    "type.route": "Audio route / devices",
    "type.antiphase": "Antiphase output",
    "type.soundscape": "Soundscape exclusion",
    "type.report": "Reports / replay",
    "type.install": "Install / package",
    "type.suggestion": "Suggestion",
    "severity.blocks": "Blocks testing",
    "severity.workaround": "Workaround exists",
    "severity.minor": "Minor",
    "severity.idea": "Idea",
    "check.screenshot": "I will attach a screenshot",
    "check.report": "I will attach a report / feedback JSON",
    "check.audio": "I explicitly choose to attach an audio clip",
    "public.title": "GitHub Issues are public",
    "public.body": "Do not submit patents, undisclosed engineering details, health identifiers, audio, report identifiers, or contact details. Do not use the public-share action for confidential material.",
    "public.confirm": "I confirm the public content contains none of the sensitive information above",
    "action.copy": "Copy package",
    "action.download": "Download JSON",
    "action.github": "Open GitHub Issue",
    "action.mail": "Send email",
    "status.ready": "Fill the form and copy. The package preview appears on the right.",
    "status.copied": "Feedback copied. Paste it into your message to SleeePal.",
    "status.downloaded": "JSON download generated.",
    "status.reset": "Form reset.",
    "status.githubApproval": "Confirm that the public content contains no sensitive or confidential information first.",
    "preview.kicker": "Live preview",
  },
};

const form = document.querySelector("[data-feedback-form]");
const preview = document.querySelector("[data-feedback-preview]");
const feedbackIdNode = document.querySelector("[data-feedback-id]");
const statusNode = document.querySelector("[data-feedback-status]");
const langToggle = document.querySelector("[data-feedback-lang-toggle]");
const mobileNavToggle = document.querySelector("[data-feedback-nav-toggle]");
const mobileNav = document.querySelector("#feedback-navigation");
const githubButton = document.querySelector("[data-feedback-github]");

function currentLang() {
  return localStorage.getItem("sleeepal-lang") || "zh";
}

function makeFeedbackId() {
  const stamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const rand = Math.random().toString(16).slice(2, 10);
  return `fb_web_${stamp}_${rand}`;
}

let feedbackId = makeFeedbackId();

function replaceWithSafeInlineMarkup(node, markup) {
  const allowedTags = new Set(["BR", "EM", "STRONG"]);
  const parsed = new DOMParser().parseFromString(`<body>${markup}</body>`, "text/html");
  const fragment = document.createDocumentFragment();
  const appendChildren = (source, destination) => {
    source.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        destination.append(document.createTextNode(child.textContent || ""));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const nextDestination = allowedTags.has(child.tagName)
          ? destination.appendChild(document.createElement(child.tagName.toLowerCase()))
          : destination;
        appendChildren(child, nextDestination);
      }
    });
  };
  appendChildren(parsed.body, fragment);
  node.replaceChildren(fragment);
}

function setStatus(key) {
  const lang = currentLang();
  statusNode.textContent = feedbackCopy[lang][key] || key;
}

function applyFeedbackLanguage(lang) {
  const copy = feedbackCopy[lang] || feedbackCopy.zh;
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.title = copy.title;
  document.querySelectorAll("[data-fb-i18n]").forEach((node) => {
    const key = node.getAttribute("data-fb-i18n");
    if (copy[key]) node.textContent = copy[key];
  });
  document.querySelectorAll("[data-fb-i18n-html]").forEach((node) => {
    const key = node.getAttribute("data-fb-i18n-html");
    if (copy[key]) replaceWithSafeInlineMarkup(node, copy[key]);
  });
  document.querySelectorAll("[data-fb-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-fb-i18n-placeholder");
    if (copy[key]) node.setAttribute("placeholder", copy[key]);
  });
  if (langToggle) langToggle.textContent = lang === "zh" ? "EN" : "中文";
  if (mobileNavToggle) {
    const open = mobileNavToggle.getAttribute("aria-expanded") === "true";
    mobileNavToggle.setAttribute("aria-label", copy[open ? "nav.close" : "nav.open"]);
  }
  localStorage.setItem("sleeepal-lang", lang);
  updatePreview();
}

function formValue(name) {
  return new FormData(form).get(name)?.toString().trim() || "";
}

function buildPackage() {
  const data = new FormData(form);
  return {
    schema_version: 1,
    feedback_id: feedbackId,
    created_at: new Date().toISOString(),
    source: "sleeepal.website.feedback",
    app: {
      name: "SleeePal",
      version: formValue("version") || "unknown",
      build_time: "user supplied or website",
    },
    host: {
      platform: formValue("platform"),
      user_agent: navigator.userAgent,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
    },
    issue: {
      type: formValue("issueType"),
      feature_area: formValue("issueType"),
      severity: formValue("severity"),
      route: formValue("route"),
      message: formValue("message"),
      contact: formValue("contact"),
    },
    privacy: {
      audio_included: data.get("hasAudio") === "on",
      screenshot_included: data.get("hasScreenshot") === "on",
      night_report_included: data.get("hasReport") === "on",
      full_logs_included: false,
      public_issue_approved: data.get("publicShareApproved") === "on",
      submitted_by_user_action: true,
    },
    context: {
      page_url: window.location.href,
      referrer: document.referrer || "",
      language: currentLang(),
    },
  };
}

function updatePreview() {
  if (!preview || !form) return;
  const payload = buildPackage();
  feedbackIdNode.textContent = payload.feedback_id;
  preview.textContent = JSON.stringify(payload, null, 2);
}

async function copyPackage() {
  const text = JSON.stringify(buildPackage(), null, 2);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  setStatus("status.copied");
}

function downloadPackage() {
  const payload = buildPackage();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${payload.feedback_id}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  setStatus("status.downloaded");
}

async function openGitHubIssue() {
  if (!form.elements.publicShareApproved.checked) {
    setStatus("status.githubApproval");
    return;
  }
  await copyPackage();
  window.open("https://github.com/HiClawBot/Sleeepal/issues/new", "_blank", "noopener,noreferrer");
}

function updatePublicShareState() {
  if (githubButton) githubButton.disabled = !form.elements.publicShareApproved.checked;
}

function setMobileNavigation(open) {
  if (!mobileNav || !mobileNavToggle) return;
  if (open) mobileNav.setAttribute("data-open", "");
  else mobileNav.removeAttribute("data-open");
  mobileNavToggle.setAttribute("aria-expanded", String(open));
  const lang = currentLang();
  mobileNavToggle.setAttribute("aria-label", feedbackCopy[lang][open ? "nav.close" : "nav.open"]);
}

function openMail() {
  const payload = buildPackage();
  const subject = `SleeePal feedback ${payload.feedback_id}`;
  const body = `请查看 SleeePal 反馈包：\n\n${JSON.stringify(payload, null, 2)}`;
  window.location.href = `mailto:HiClawBot@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function resetForm() {
  form.reset();
  feedbackId = makeFeedbackId();
  updatePreview();
  updatePublicShareState();
  setStatus("status.reset");
}

if (form) {
  form.addEventListener("input", () => {
    updatePreview();
    updatePublicShareState();
  });
  form.addEventListener("change", () => {
    updatePreview();
    updatePublicShareState();
  });
  document.querySelector("[data-feedback-copy]")?.addEventListener("click", copyPackage);
  document.querySelector("[data-feedback-download]")?.addEventListener("click", downloadPackage);
  document.querySelector("[data-feedback-github]")?.addEventListener("click", openGitHubIssue);
  document.querySelector("[data-feedback-mail]")?.addEventListener("click", openMail);
  document.querySelector("[data-feedback-reset]")?.addEventListener("click", resetForm);
}

mobileNavToggle?.addEventListener("click", () => {
  setMobileNavigation(mobileNavToggle.getAttribute("aria-expanded") !== "true");
});
mobileNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMobileNavigation(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMobileNavigation(false);
});

langToggle?.addEventListener("click", () => {
  applyFeedbackLanguage(currentLang() === "zh" ? "en" : "zh");
});

applyFeedbackLanguage(currentLang());
updatePublicShareState();
setStatus("status.ready");
