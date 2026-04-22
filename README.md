# Sleeepal

Sleeepal is the public website repository for the SleeePal project, a local-first sleep assistance product exploring near-field active noise reduction around the pillow.

Sleeepal 是 SleeePal 项目的官网仓库。SleeePal 是一个本地优先的睡眠辅助产品，核心方向是在枕边构建近场宁静区，而不是试图消除整间房间的所有声音。

## Overview

This repository contains the public-facing marketing site only.

这个仓库当前只包含官网静态站内容，不包含桌面端、iOS、macOS 应用源码，也不包含构建产物。

## What This Repo Contains

- `index.html`: landing page
- `styles.css`: site styles
- `site.js`: site interactions and bilingual behavior
- `assets/`: logos, icon assets, and brand visuals

## Product Direction

SleeePal is being shaped around one narrow and concrete promise:

- create a quiet zone around the user's head, not the whole room
- keep processing local on device
- avoid user audio uploads
- make the system visible and explainable instead of a black box
- build a calm, premium, trustworthy product surface

SleeePal 当前不是一个泛泛的“助眠 App”概念，而是围绕一个非常具体的目标推进：

- 在头部附近建立宁静区，而不是给整个房间做声学改造
- 尽量保持本地处理
- 不上传用户音频
- 不使用不可解释的黑箱式叙事
- 让产品体验保持克制、可信和高端感

## Repository Scope

This repo is intended for:

- public website publishing
- brand presentation
- product messaging
- lightweight static hosting

This repo is not intended for:

- the Python desktop application source
- iOS or macOS app development
- packaging artifacts
- internal experiment history

## Local Preview

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Deployment

This repository is structured as a simple static site and can be deployed with:

- GitHub Pages
- Netlify
- Vercel static hosting
- any basic web server

## Broader Project

The wider SleeePal project also includes:

- a Python desktop application
- an iOS SwiftUI companion app
- a macOS SwiftUI shell
- protocol and product documentation

This repository is only the public website surface for that broader effort.

## Privacy Position

SleeePal is being developed as a local-first product direction. The project does not aim to collect user identity data or upload private bedside audio as part of the website itself.

SleeePal 的产品方向强调本地优先。至少在当前网站与公开介绍层面，它并不是一个依赖云端采集用户音频或上传卧室环境数据的产品叙事。

## License

MIT. See `LICENSE`.
