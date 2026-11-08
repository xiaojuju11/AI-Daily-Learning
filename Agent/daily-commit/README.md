# 每日 GitHub 绿块 · 部署与执行说明

目标：**每天挑选一个仓库，做一处真实的代码优化或功能完善，提交并推送到 GitHub main 分支**，保证贡献图每天都有绿块。

## 目录结构

```
Agent/
├─ daily-commit/
│  ├─ config.json         # 仓库清单、轮换规则、提交身份、执行时间
│  ├─ rotation.ps1        # 轮换计算 + 仓库健康检查（只读）
│  ├─ catchup.ps1         # 漏天检测
│  ├─ history.md          # 每日改动记录
│  ├─ README.md           # 本文件：执行流程
│  └─ state.json          # 最近一次执行的记录（脚本自动维护）
└─ repos/                 # 4 个轮换仓库的本地工作副本
   ├─ OrangeVerse/
   ├─ parent_kid_edu/
   ├─ react-playground/
   └─ chatbox-demo/       # 已移出轮换，不再提交
```

`AI-Daily-Learning` 的工作副本就是 `D:\AIforstudy` 本身。

## 每天的执行流程（agent 按此顺序做）

### 0. 先跑一遍轮换检查

```powershell
powershell -ExecutionPolicy Bypass -File D:\AIforstudy\Agent\daily-commit\rotation.ps1
```

输出会告诉你：今天是第几轮、该做哪个仓库、每个仓库是否 clean / 是否落后远端 / 今天是否已有提交。

### 1. 同步目标仓库

```powershell
git -C <repo> pull --ff-only github main
```

- 若本地有未提交改动：先判断是不是上次残留，能复用就复用，不能就 `git stash` 后继续。
- 若 `pull` 冲突：以远端为准，`git reset --hard github/main`（本地改动已 stash）。

### 2. 挑一个「小而真实」的改进

优先级从高到低：

1. **修 Bug**：边界条件、空值、异步顺序、错误处理缺失。
2. **补功能**：README 里写了但代码没做的、TODO、明显的体验缺口。
3. **优化**：重复代码合并、性能、可访问性（a11y）、可测试性。

硬性要求：

- 一次只改一个主题，改动量控制在 30~300 行，方便回滚和 review。
- 不许为了「有提交」而写无意义改动（改空格、改注释、伪造作者/时间）。
- 有逻辑改动 → 必须有测试；纯文档/样式改动 → 至少跑一次 build 或现有测试。

### 3. 验证

| 仓库 | 验证命令 |
| --- | --- |
| AI-Daily-Learning | `npm test`（若有脚本）或 `node --test`；无构建则跳过 |
| OrangeVerse | `npm test` + `npm run build` |
| parent_kid_edu | `cd frontend; npm run build`；`cd backend; node -e "require('./app')"` 之类的启动自检 |
| react-playground | `npm run build` + `npm run lint` |

### 4. 提交

```powershell
git -C <repo> add -A
git -C <repo> -c user.name="小小橘橘啊" -c user.email="3432909760@qq.com" `
  commit -m "type(scope): 一句话说明" -m "- 改了什么" -m "- 为什么" -m "- 如何验证"
git -C <repo> push github main
```

> `git -c user.email=...` 是刻意写死的：GitHub 只统计邮箱与账号绑定的提交，邮箱写错就没有绿块。
> 当前配置 `3432909760@qq.com` 已验证会在 GitHub 上归属到 `xiaojuju11`。

### 5. 回查

```powershell
# 用 GitHub API 确认最新提交已出现在 main，且 author.login == xiaojuju11
Invoke-RestMethod -Headers @{ 'User-Agent'='dsh-agent' } `
  https://api.github.com/repos/xiaojuju11/<repo>/commits/main |
  Select-Object sha, @{n='msg';e={$_.commit.message.Split("`n")[0]}}, @{n='by';e={$_.author.login}}
```

### 6. 记账

把结果写进 `state.json`（脚本会自动写），并把当天的改动摘要追加到 `daily-commit/history.md`，方便日后回顾。

## 轮换顺序

以 2026-11-08 为第 0 天（已完成 OrangeVerse），此后按 `config.json` 中 `repos` 的顺序循环。下面是 `rotation.ps1` 的实际计算结果：

| 日期 | 仓库 |
| --- | --- |
| 2026-11-08 | OrangeVerse（首日已手动完成，commit `70acb6c`） |
| 2026-11-09 | parent_kid_edu |
| 2026-11-10 | react-playground |
| 2026-11-11 | AI-Daily-Learning |
| 2026-11-12 | OrangeVerse |
| 2026-11-13 | parent_kid_edu |
| … | 循环 |

> `chatbox-demo` 已被移出轮换（见 `config.json` 的 `excluded`），以后不再向该仓库提交。

计算方式：`index = ((今天 - 2026-11-08).Days + 1) mod 4`。第 0 天（11-08）已手工完成 `repos[0]`，所以从第 1 天起索引偏移 +1，避免紧接着重复同一个仓库。

## 已知限制

- 定时提醒由 DSH 会话调度。**App 关闭期间不会执行**；重新打开后只补发最近一次到期提醒，不会把缺失的几天全部补齐。
- 若某天网络 / 凭据失败，当天就没有绿块；第二天恢复后按轮换继续，不会伪造补提交。
- GitHub 统计有几分钟延迟，`git push` 成功不代表贡献图立刻变色，属正常现象。

## 漏天补救（catch-up）

每次开始执行前先跑：

```powershell
powershell -ExecutionPolicy Bypass -File D:\AIforstudy\Agent\daily-commit\catchup.ps1
```

- 退出码 `0`：没有漏天，继续今天的流程。
- 退出码 `2`：列出了漏掉的日期与当天该做的仓库，按「最早的一天优先」依次补做真实改动。

`catchup.ps1` 只写 `last-check.json`（检查点），不修改任何仓库；补做时仍然走「改进 → 测试 → 提交 → 推送」的完整流程，绝不通过改时间戳来伪造历史提交。
