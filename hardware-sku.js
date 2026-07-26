(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const sections = Array.from(document.querySelectorAll("main > section"));
  sections.forEach((section) => {
    section.classList.add("section-fade");
    const rect = section.getBoundingClientRect();
    section.classList.toggle("is-visible", rect.bottom > 0 && rect.top < globalThis.innerHeight);
  });
  if (
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    || !("IntersectionObserver" in globalThis)
  ) {
    sections.forEach((section) => section.classList.add("is-visible"));
  } else {
    const sectionObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      }),
      { rootMargin: "-5% 0px -5%", threshold: 0.04 },
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }
  const commonCanvasZones = [
    [675, 710, 190, 105],
    [1095, 710, 190, 105],
  ];
  const commonWallZones = [
    [620, 705, 190, 105],
    [1010, 705, 190, 105],
  ];
  const acousticLayouts = {
    "canvas-wide": {
      zones: commonCanvasZones,
      capture: [
        "M 110 245 C 300 205, 500 205, 694 236",
        "M 1510 285 C 1420 235, 1330 220, 1242 232",
      ],
      mics: [[701, 238], [1238, 235]],
      output: [
        ["M 820 526 C 790 585, 735 610, 680 656", false],
        ["M 850 526 C 830 590, 775 625, 735 675", true],
        ["M 1110 526 C 1110 585, 1115 615, 1102 655", false],
        ["M 1150 526 C 1160 590, 1165 620, 1160 677", true],
      ],
      labels: {
        capture: [105, 166, 252, "环境声 → 上缘参考 Mic"],
        output: [913, 548, 292, "隐藏输出 → 反向声波"],
        zone: [569, 755, 600],
      },
    },
    "canvas-mini": {
      zones: [
        [535, 610, 205, 94],
        [1085, 610, 205, 94],
      ],
      capture: [
        "M 110 220 C 310 140, 520 105, 703 92",
        "M 1510 230 C 1300 145, 1080 105, 872 92",
      ],
      mics: [[703, 92], [872, 92]],
      output: [
        ["M 690 205 C 660 350, 590 470, 535 565", false],
        ["M 718 205 C 700 360, 640 490, 585 575", true],
        ["M 885 205 C 920 350, 1015 470, 1085 565", false],
        ["M 857 205 C 900 360, 970 490, 1035 575", true],
      ],
      labels: {
        capture: [105, 142, 252, "环境声 → 上缘参考 Mic"],
        output: [1018, 350, 292, "画框喇叭 → 反向声波"],
        zone: [510, 750, 600],
      },
    },
    "canvas-bar": {
      zones: commonCanvasZones,
      capture: [
        "M 110 245 C 350 190, 520 220, 690 360",
        "M 1510 285 C 1410 230, 1320 260, 1235 360",
      ],
      mics: [[696, 365], [1230, 365]],
      output: [
        ["M 770 450 C 760 530, 720 600, 680 656", false],
        ["M 800 450 C 795 540, 770 620, 735 675", true],
        ["M 1150 450 C 1140 530, 1120 600, 1102 655", false],
        ["M 1115 450 C 1125 540, 1140 620, 1160 677", true],
      ],
      labels: {
        capture: [105, 166, 252, "环境声 → 上缘参考 Mic"],
        output: [990, 470, 292, "隐藏输出 → 反向声波"],
        zone: [569, 755, 600],
      },
    },
    "wall-linear": {
      zones: commonWallZones,
      service: [443, 383, 538, 76],
      capture: [
        "M 100 230 C 260 230, 350 320, 454 390",
        "M 1490 250 C 1280 220, 1120 300, 970 390",
      ],
      mics: [[455, 395], [968, 395]],
      output: [
        ["M 560 455 C 565 545, 590 610, 615 657", false],
        ["M 595 455 C 600 540, 625 610, 660 646", true],
        ["M 870 455 C 890 545, 950 610, 1004 654", false],
        ["M 835 455 C 880 535, 1005 600, 1060 647", true],
      ],
      labels: {
        service: [616, 300, 350, "长条前置维护外壳"],
        capture: [100, 163, 252, "环境声 → 上缘参考 Mic"],
        output: [1015, 500, 292, "隐藏输出 → 反向声波"],
        zone: [515, 755, 600],
      },
    },
  };

  const svgElement = (name, attributes = {}) => {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  };

  const addMarker = (defs, id, color) => {
    const marker = svgElement("marker", {
      id,
      viewBox: "0 0 10 10",
      refX: 8,
      refY: 5,
      markerWidth: 8,
      markerHeight: 8,
      orient: "auto-start-reverse",
    });
    marker.append(svgElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }));
    defs.append(marker);
  };

  const addLabel = (svg, type, label) => {
    if (!label) return;
    const [x, y, width, copy] = label;
    const isZone = type === "zone";
    const height = isZone ? 98 : 58;
    const group = svgElement("g", {
      class: `acoustic-label label-${type}`,
      transform: `translate(${x} ${y})`,
    });
    group.append(svgElement("rect", { width, height, rx: isZone ? 30 : 29 }));
    const text = svgElement("text", {
      x: width / 2,
      y: isZone ? 0 : 37,
      "text-anchor": "middle",
    });

    if (isZone) {
      const title = svgElement("tspan", { x: width / 2, y: 37 });
      title.textContent = "枕边静谧空间，";
      const measurement = svgElement("tspan", {
        class: "zone-measurement",
        x: width / 2,
        y: 72,
      });
      measurement.textContent = "改善约15%～25%噪音值（需以实测为准）。";
      text.append(title, measurement);
    } else {
      text.textContent = copy;
    }
    group.append(text);
    svg.append(group);
  };

  const renderAcousticOverlay = (scene, index) => {
    const layout = acousticLayouts[scene.dataset.acousticLayout];
    if (!layout || scene.querySelector(".acoustic-overlay")) return;

    const captureMarker = `capture-arrow-${index}`;
    const outputMarker = `output-arrow-${index}`;
    const svg = svgElement("svg", {
      class: "acoustic-overlay",
      viewBox: "0 0 1586 992",
      role: "img",
      "aria-label": "环境声采集、反向声波输出，以及改善约15%～25%噪音值、需以实测为准的枕边静谧空间示意",
    });
    const defs = svgElement("defs");
    addMarker(defs, captureMarker, "#e6c873");
    addMarker(defs, outputMarker, "#a78bfa");
    svg.append(defs);

    layout.zones.forEach(([cx, cy, rx, ry]) => {
      svg.append(svgElement("ellipse", { class: "quiet-zone", cx, cy, rx, ry }));
    });
    if (layout.service) {
      const [x, y, width, height] = layout.service;
      svg.append(svgElement("rect", {
        class: "service-panel-outline",
        x,
        y,
        width,
        height,
        rx: 8,
      }));
    }
    layout.capture.forEach((d) => {
      svg.append(svgElement("path", {
        class: "capture-path",
        d,
        "marker-end": `url(#${captureMarker})`,
      }));
    });
    layout.mics.forEach(([cx, cy]) => {
      svg.append(svgElement("circle", { class: "mic-point", cx, cy, r: 11 }));
    });
    layout.output.forEach(([d, soft]) => {
      const attributes = {
        class: soft ? "output-path output-path-soft" : "output-path",
        d,
      };
      if (!soft) attributes["marker-end"] = `url(#${outputMarker})`;
      svg.append(svgElement("path", attributes));
    });

    addLabel(svg, "service", layout.labels.service);
    addLabel(svg, "capture", layout.labels.capture);
    addLabel(svg, "output", layout.labels.output);
    addLabel(svg, "zone", layout.labels.zone);
    scene.insertBefore(svg, scene.querySelector("figcaption"));
  };

  const scenes = Array.from(document.querySelectorAll("[data-acoustic-demo]"));
  scenes.forEach(renderAcousticOverlay);

  const products = Array.from(document.querySelectorAll(".concealed-product"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stageOrder = ["capture", "output", "zone"];
  const stageCopy = {
    capture: "01 · 上缘参考 Mic 正在提前采集房间噪音",
    output: "02 · 本地系统正在向左右枕位输出反向声波",
    zone: "03 · 枕边静谧空间，改善约15%～25%噪音值（需以实测为准）。",
  };

  const controllers = products
    .map((product) => {
      const productScenes = Array.from(product.querySelectorAll("[data-acoustic-demo]"));
      const stageButtons = Array.from(product.querySelectorAll("[data-acoustic-stage]"));
      const variantButtons = Array.from(product.querySelectorAll("[data-concealed-variant]"));
      const variantPanels = Array.from(product.querySelectorAll("[data-variant-panel]"));
      const playButton = product.querySelector("[data-acoustic-play]");
      const playLabel = product.querySelector("[data-acoustic-play-label]");
      const status = product.querySelector("[data-acoustic-status]");
      const target = product.querySelector(".concealed-variant-panels");

      if (!target || productScenes.length === 0 || stageButtons.length === 0 || !playButton || !playLabel || !status) {
        return null;
      }

      let timer = null;
      let playing = false;

      const markPlayed = () => {
        product.dataset.demoPlayed = "true";
      };

      const setStage = (stage) => {
        productScenes.forEach((scene) => {
          scene.dataset.demoStage = stage;
        });
        product.dataset.demoStage = stage;
        status.textContent = stageCopy[stage];
        stageButtons.forEach((button) => {
          button.setAttribute("aria-pressed", String(button.dataset.acousticStage === stage));
        });
      };

      const stop = (completed = false) => {
        window.clearTimeout(timer);
        timer = null;
        playing = false;
        playButton.dataset.playing = "false";
        playButton.setAttribute("aria-pressed", "false");
        playLabel.textContent = completed ? "重播演示" : "连续演示";
      };

      const play = () => {
        stop();
        playing = true;
        playButton.dataset.playing = "true";
        playButton.setAttribute("aria-pressed", "true");
        playLabel.textContent = "暂停演示";

        let index = 0;
        const advance = () => {
          setStage(stageOrder[index]);
          index += 1;
          if (index < stageOrder.length) {
            timer = window.setTimeout(advance, 1800);
          } else {
            timer = window.setTimeout(() => stop(true), 1800);
          }
        };
        advance();
      };

      const selectVariant = (name) => {
        variantPanels.forEach((panel) => {
          panel.hidden = panel.dataset.variantPanel !== name;
        });
        variantButtons.forEach((button) => {
          const selected = button.dataset.concealedVariant === name;
          button.setAttribute("aria-selected", String(selected));
          button.tabIndex = selected ? 0 : -1;
        });
      };

      stageButtons.forEach((button) => {
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
          markPlayed();
          stop();
          setStage(button.dataset.acousticStage);
        });
      });

      variantButtons.forEach((button, buttonIndex) => {
        button.addEventListener("click", () => {
          markPlayed();
          stop();
          selectVariant(button.dataset.concealedVariant);
        });
        button.addEventListener("keydown", (event) => {
          if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          event.preventDefault();
          const direction = event.key === "ArrowRight" ? 1 : -1;
          const nextIndex = (buttonIndex + direction + variantButtons.length) % variantButtons.length;
          variantButtons[nextIndex].focus();
          variantButtons[nextIndex].click();
        });
      });

      const initialVariant = variantButtons.find((button) => button.getAttribute("aria-selected") === "true");
      if (initialVariant) selectVariant(initialVariant.dataset.concealedVariant);

      playButton.setAttribute("aria-pressed", "false");
      playButton.addEventListener("click", () => {
        markPlayed();
        if (playing) {
          stop();
          return;
        }
        play();
      });

      return { product, target, play, stop };
    })
    .filter(Boolean);

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const controller = controllers.find(({ target }) => target === entry.target);
          if (!controller || controller.product.dataset.demoPlayed === "true") return;
          controller.product.dataset.demoPlayed = "true";
          controller.play();
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );

    controllers.forEach(({ target }) => observer.observe(target));
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) controllers.forEach(({ stop }) => stop());
  });
})();
