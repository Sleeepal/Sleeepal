# Website release notes

## 2026-07-25

### Clearer principle and download navigation

- Pointed “原理” directly to the phase-overlay explanation and removed the retired standalone “可视化” navigation label.
- Rewrote the work/rest, phone, and antiphase headlines around explicit near-field and limited-effect boundaries.
- Simplified download language to one task: download the correct local version and begin.
- Added consistent macOS, Windows, iOS, and Android marks before platform names.
- Expanded phone and computer guidance to distinguish limited built-in-device relief from stronger external-speaker routes.

### Privacy-first closed-source distribution

- Declared that SleeePal product Apps and the core runtime are closed source and delivered only as official signed/notarized installers or store packages.
- Replaced ambiguous “audio does not upload by default” wording with the permanent rule that user recordings never upload.
- Clarified that recordings never enter feedback, accounts, cloud sync, family sharing, analytics, or AI models.
- Removed the website feedback audio-attachment option and hard-coded `audio_included: false`.
- Kept local playback and user-initiated filesystem export while separating those actions from any SleeePal upload path.

### One clear experience entry

- Reduced the homepage to one primary “开始体验” action and added a four-platform transition page that shows Mac, Windows, iOS, and Android availability without automatic downloads.
- Added device detection on the version page while keeping every download behind an explicit platform confirmation.
- Kept all public downloads fail-closed until signing and notarization requirements are satisfied.
- Reduced the top navigation and kept the only GitHub link in the footer.

### Calm navigation and responsive presentation

- Removed scripted and smooth page scrolling from public interactions.
- Added independent opacity reveals for sections without moving the page after functional button clicks.
- Hardened desktop and mobile layouts against horizontal overflow, clipped headings, and wrapped hardware navigation.
- Renamed the homepage entry to “智能硬件”, removed the deep link that opened midway through the concealed section, and added “外置式 / 隐形款” as first-screen hardware subcategories.
- Reordered the product story so sleep scenarios appear before laptop work and phone transit, and added visible detail actions to every scene card.
- Replaced the simplified acoustic cartoons with a precision local-signal board and four compact measurement stages for capture, modeling, output, and verification.

### Quiet-space product story

- Reframed the homepage around creating a personal quiet space: laptops for work, phones for rest and sleep.
- Added three-layer forward sound-field diagrams for laptop and phone scenarios.
- Re-anchored the bedside phone field to the earpiece/top speaker, showed background noise entering the phone microphone, and widened the field to a greater-than-semicircular fan toward the pillow.
- Added a phone airplane-mode reminder and clarified that microphone placement varies by device.
- Added a headphone-free subway/bus browsing scene with a realistic image, microphone path, speaker origin, three-layer face-directed field, and an explicit ANC/performance boundary.
- Reworked the phase-overlay module so noise peaks and antiphase troughs share one reference line and leave a smaller, non-zero residual.
- Expanded “场景观察” to six balanced cards, including everyday laptop work, mobile laptop work, and phone transit browsing.

### Hardware and real-room scenarios

- Added three replaceable-art-frame forms and compact in-wall linear concepts with construction, microphone, loudspeaker, control, installation, and measurement guidance.
- Moved device checking into the one-tap module and placed usage scenarios first in hardware navigation.
- Completed the six-card sleep-scene grid with adult single-bed and realistic 1.8–2.0 m couple-bed imagery.
- Added responsive acoustic overlays for adult, child, and couple scenes: noise source, microphone capture, antiphase output, and three-layer pillow-area quiet zones.

### SleeePal Lab · 美梦成真

- Expanded the local-first dream workspace with multiple dream cards, progress, per-dream conversation, action-board preview, export, archive, and delete controls.
- Preserved the public/protected disclosure boundary and kept automatic publication or external tool execution disabled.
- Added the independent “梦境再现” future-vision section, tracing a possible path from consented neural-signal clues to text, images, and video while clearly stating that the capability is not available today.
- Added primary research references and strict privacy principles for any future neural-data feature.

### Release hardening

- Kept the historic `/desktop.html` route alive to avoid breaking old bookmarks.
- Aligned the “美梦成真” canonical URL with its public main-domain route and retained fail-closed service detection.
- Hardened generated HTML previews with a no-network Content Security Policy and local `srcdoc` sandbox rendering.
- Added security policies to the public hardware pages and labeled acoustic overlays as simulations rather than measured sound fields.

## 2026-07-22

### Product clarity

- Reframed the homepage around a Mac-first, local-first nightly workflow.
- Replaced ambiguous “antiphase quiet” wording with an action–mechanism–result model: start noise relief, emit antiphase sound, and form a near-field quiet zone.
- Renamed waveform outcomes from “theoretical cancellation” to the more accurate “estimated residual after cancellation.”
- Replaced unverified implementation numbers with plain-language validation boundaries.
- Clarified that the baby scenario is environment observation, not breathing, life-safety, or emergency monitoring.
- Kept public app downloads closed while signing, notarization, and physical acceptance remain incomplete.

### SleeePal Lab · 梦想成真

- Rebuilt the former directory-style page as a concise five-stage product method.
- Removed embedded third-party pages, supplier directories, wallet/payment plans, and protected engineering references.
- Added a public-safe editorial bedroom image that contains no hardware or engineering design.
- Added clear “public vs protected” disclosure guidance.

### Privacy and safety

- Added Content Security Policy and referrer controls to every public page.
- Added a public-sharing acknowledgement before the GitHub Issue action can be enabled.
- Aligned the privacy notice with local reports and opt-in local audio clips in QA builds.
- Added an explicit public-file allowlist check before deployment.

### Responsive quality

- Added mobile navigation to the feedback page.
- Hardened CJK display typography against clipped final glyphs.
- Verified desktop and mobile layouts without horizontal overflow or clipped controls.
