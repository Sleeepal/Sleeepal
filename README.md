# SleeePal public website

This branch contains only the allowlisted files published at [sleeepal.com](https://sleeepal.com/).

这个分支只保存 `sleeepal.com` 的公开静态内容。应用源码、测试包、音频、内部工程资料、供应链资料和未公开知识产权材料不属于本站发布范围。

## Public pages

- Product overview and current validation status
- Local-first feedback package
- Beta privacy and usage boundaries
- SleeePal Lab: “梦想成真” product method

## Release boundary

- No public app download is exposed before signing, notarization, and physical acceptance.
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
