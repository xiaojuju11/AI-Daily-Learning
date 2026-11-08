# 橙子书库

把每天学的东西，写成一本本可以读完的书。和 [LangChain.js 中文入门](https://cleversnail.github.io/lang-chain-js-cn/) 同一套思路：**Markdown 写内容 → 静态站构建 → push 自动上线**。

## 为什么是这个方案

| 方案 | 适合 | 结论 |
| --- | --- | --- |
| VitePress | 技术文档、教程书，要搜索 / 侧边栏 / 代码高亮 | ✅ 选它，和参考站同款 |
| GitBook / 语雀 | 不想碰代码 | 受平台限制，导出和样式都不自由 |
| Word / PDF | 给人看的定稿 | 适合最后出一版，不适合日常迭代 |

关键点：**内容只有一个真身——Markdown**。以后想出 PDF / EPUB，用 Pandoc 从同一份 md 转就行，不用重写。

## 目录结构

```
books/
├─ docs/
│  ├─ index.md                  # 首页（书库入口）
│  ├─ js/                       # 一本书 = 一个目录 = 网址前缀 /js/
│  │  ├─ index.md               # 本书导读
│  │  └─ ch01-scope-and-context.md
│  ├─ react/  ai/  interview/   # 其余几本
│  ├─ daily/                    # 素材层：当天草稿
│  └─ .vitepress/
│     ├─ config.mts             # 书名、导航、搜索、主题
│     ├─ utils/books.ts         # 书单 + 自动侧边栏
│     └─ theme/custom.css       # 配色、正文宽度
└─ scripts/                     # new / import 两个小工具
```

## 每天怎么写

```bash
cd books
npm run dev            # 打开 http://localhost:5173，边写边看

# 新建当天笔记
npm run new -- daily "2026-11-09" 2026-11-09
```

只填三格：今天搞懂了什么 / 卡在哪 / 明天第一步。

## 周末怎么成书

```bash
# 新建一章
npm run new -- interview "虚拟列表实战" virtual-list

# 或者从旧笔记直接导入骨架，再改写
npm run import -- "D:\AIforstudy\面试考点\虚拟列表.md" interview "虚拟列表实战" virtual-list
```

搬运时只做三件事：**给秩序**（按"为什么 / 怎么工作 / 怎么用"重排）、**补例子**（能跑的代码 + 预期输出）、**删废话**。

## 加一本新书

1. 在 `docs/.vitepress/utils/books.ts` 的 `BOOKS` 里加一行：

   ```ts
   { dir: 'rust', text: 'Rust 入门', tagline: '所有权 · 生命周期 · 工程实践' }
   ```

2. 建目录 `docs/rust/`，写一个 `index.md` 当导读。

导航和侧边栏会自动出现，**没有第二步**。

## 章节怎么排

- 文件名决定顺序：`ch01-xxx.md`、`ch02-xxx.md`，数字补零。
- 标题写在 frontmatter 里，中文标题没问题，文件名建议用英文短横线（网址更干净）：

  ```md
  ---
  title: 第 3 章 this 与调用方式
  order: 3
  ---
  ```

- 想分"部分"，在书目录下建带数字前缀的子目录，例如 `docs/js/02-进阶/`，侧边栏自动变成一个可折叠分组，分组名会去掉 `02-`。

## 发布到 GitHub Pages

1. 仓库已带好工作流：`.github/workflows/deploy-books.yml`（在仓库根目录，不在 books 里）。
2. GitHub 仓库 → Settings → Pages → Source 选 **GitHub Actions**。
3. push 到 `main`，等 Action 跑完，访问 `https://<用户名>.github.io/<仓库名>/`。

工作流会自动把 `DOCS_BASE` 设成 `/<仓库名>/`；本地构建默认根路径 `/`，互不影响。

> 仓库里提交了 `node_modules`（文件数很多），CI 的 checkout 会比较慢。嫌慢的话，把 `books/` 单独拆成一个干净仓库，工作流和配置原样搬过去就能用。

## 常见问题

**中文文件名能用吗？** 能，VitePress 会编码成 `%E4%B8%AD...`，只是链接比较长。推荐英文名 + 中文标题。

**图片放哪？** `docs/public/img/xxx.png`，正文里写 `![说明](/img/xxx.png)`。部署到子路径时也正常。

**搜索怎么来的？** 配置里 `search.provider: 'local'`，构建时自动生成全文索引，不需要任何后端。

**能不能导出 PDF？** 能。`npm run docs:build` 之后，用 Pandoc 或浏览器打印逐章导出；后续真要出书再补这一步。

**写完就自动更新吗？** 本地 `npm run dev` 改完即刷新；线上要 `git push` 才会重新构建。
