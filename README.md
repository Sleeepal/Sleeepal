# SleeePal public website

This branch contains only the allowlisted files published at [sleeepal.com](https://sleeepal.com/).

这个分支只保存 `sleeepal.com` 的公开静态内容。应用源码、测试包、音频、内部工程资料、供应链资料和未公开知识产权材料不属于本站发布范围。

## Public pages

- Personal quiet-space overview for laptop work, phone rest/sleep, and headphone-free transit browsing scenarios
- Automatic platform matching from one “开始体验” entry, with fail-closed public downloads
- Near-field acoustic principle, phase overlay, and three-layer field visualizations with explicit noise sensing and speaker-output origins
- Public hardware forms, concealed installation concepts, and human sleep scenarios
- Local-first feedback package
- Beta privacy and usage boundaries
- SleeePal Lab: multi-dream cards, local conversation, progress, preview, and export
- Future-facing “梦境再现” concept with research references and explicit availability/privacy boundaries

## Release boundary

- No public app download is exposed before signing, notarization, and physical acceptance; the homepage stays in place instead of redirecting to GitHub.
- The only GitHub entry is kept in the homepage footer.
- The former `/desktop.html` URL remains as a lightweight compatibility page and routes visitors back to the homepage entry.
- Feedback does not upload audio, screenshots, reports, or logs automatically.
- GitHub Issues are public and stay disabled until the visitor confirms the content contains no sensitive information.
- Undisclosed implementation, engineering, supplier, and user-submitted material is not published here.

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000/`.

## License

MIT. See `LICENSE`.
