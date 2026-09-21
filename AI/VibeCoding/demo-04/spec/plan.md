# campusTasks 实现计划（Plan）

> 状态：**待用户确认**
> 最后更新：2026-09-19
> 上游依据：`spec/requirements.md`（已确认）· 本文件回答 **How**，不改变 **What**

---

## 0. 与已有 demo 的关系

`demo-02`（提示词工程）与 `demo-03`（上下文工程）实现的是**同一个产品 CampusTask**。`demo-04` 是它的 **SDD 版本**。

**决定：不复用 demo-02 / demo-03 的任何代码。**

理由：本阶段的教学价值在于「规格 → 计划 → 任务 → 实现」这条链路本身。若直接拷贝既有实现，演示就退化成一次复制粘贴。仅保持**品牌与文件风格一致**（同名的 `CampusTask` 品牌、中文界面、原生三件套）。

---

## 1. 技术架构

### 1.1 交付物

```text
demo-04/
├── AGENTS.md                    # 已有：工作流原则
├── docs/workflow.md             # 已有：阶段说明
├── spec/
│   ├── README.md                # 已有
│   ├── requirements.md          # ✅ 已完成（需求真相来源）
│   ├── plan.md                  # ← 本文件
│   ├── tasks.md                 # 待产出（下一步）
│   └── convergence-report.md    # 最后产出（验收）
├── index.html                   # 待实现：结构骨架
├── css/style.css                # 待实现：样式与响应式
└── js/app.js                    # 待实现：全部逻辑
```

**运行方式**：`python3 -m http.server 8000` → `http://localhost:8000`（推荐）。Chrome / Edge 下双击 `index.html` 亦可。

### 1.2 技术选型（全部由规格锁定，无新增依赖）

| 项 | 选择 | 依据 |
| --- | --- | --- |
| 语言 | 原生 HTML / CSS / JavaScript | NFR-08 |
| 依赖 | **0 个**，无框架、无构建工具、无 CDN | NFR-08 |
| 脚本加载 | 经典 `<script src="js/app.js">`，**禁用 ES Module** | NFR-09 / 规格 9.1 |
| 存储 | `localStorage` | NFR-02 |
| 后端 | 无 | 规格 4.2 |

### 1.3 需要用户拍板的一处细节 ⚠️

规格里 `css/style.css`、`js/app.js` 的子目录结构来自你确认选项的预览图，但 **demo-02 / demo-03 都是平铺的**（`index.html` + `styles.css` + `app.js` 同级）。

| 方案 | 结构 | 评价 |
| --- | --- | --- |
| **A（默认，按你已确认的）** | `index.html` + `css/style.css` + `js/app.js` | 分类清晰，为后续扩展留位置 |
| B（与 demo-02/03 一致） | `index.html` + `styles.css` + `app.js` | 三个 demo 结构统一，对比教学更顺 |

> 我默认按 **A** 执行（尊重你已确认的预览）。若想与兄弟 demo 统一，回复「改用 B」即可。

---

## 2. 分层设计（`js/app.js` 内部）

单文件但**严格分层**，用中文分区横幅隔开，便于课堂逐块讲解（NFR-10）：

```text
§0 常量与枚举     存储键、类型/优先级/状态枚举、时间状态枚举
§1 全局状态       state = { tasks, view, filters, keyword, editingId }
§2 存储层 Store    load / save / backupCorrupt / buildExport / parseImport
§3 工具层 Utils    genId / 日期计算 / 格式化 / 校验
§4 领域层 Tasks    add / update / remove / toggleDone / moveStatus / visible / sort / stats
§5 渲染层 Render   renderAll / renderStats / renderList / renderGroup / renderBoard / renderEmpty
§6 交互层 Events   表单 / 筛选 / 视图切换 / 看板移动 / 导入导出 / 弹窗
§7 启动           init()
```

### 2.1 单向数据流（关键约束）

```text
用户操作 → 改 state → save() → renderAll()
```

**渲染层是纯函数：只读 state、只写 DOM，绝不修改数据。** 这条纪律能消掉一整类「界面和数据对不上」的 bug，也是本计划里最重要的架构决定。

---

## 3. 数据设计

### 3.1 存储结构

- localStorage key：`campusTasks:v1`
- 损坏数据备份 key：`campusTasks:v1:corrupt`

```json
{
  "version": 1,
  "tasks": [
    {
      "id": "t_lz3k9x_4821",
      "title": "数据结构第3次作业",
      "course": "数据结构",
      "type": "作业",
      "dueAt": "2026-09-22T23:59",
      "priority": "高",
      "status": "todo",
      "note": "第三章 树与二叉树",
      "createdAt": "2026-09-19T16:40:00.000Z",
      "completedAt": null
    }
  ]
}
```

### 3.2 一个容易踩坑的决定：`dueAt` 不转 UTC ⚠️

`dueAt` 直接存 `<input type="datetime-local">` 给出的**本地墙上时间**字符串 `YYYY-MM-DDTHH:mm`，**不做时区转换**。

理由：截止时间是「墙上时间」概念——「下周一 23:59 交」指的是你手表上的 23:59。若转成 UTC 存储再转回来，跨时区或跨夏令时会凭空偏移几小时，导致任务显示成前一天。`createdAt` / `completedAt` 是真实时间戳，用 ISO 格式。

### 3.3 枚举值

| 字段 | 取值 |
| --- | --- |
| `type` | 作业 / 实验 / 考试 / 活动 / 其他 |
| `priority` | 高 / 中 / 低 |
| `status` | `todo` 待办 / `doing` 进行中 / `done` 已完成 |

---

## 4. 核心算法

### 4.1 时间状态（对应 AC-04）

**按自然日比较，不按毫秒差：**

```text
startOfDay(d) = new Date(d.getFullYear(), d.getMonth(), d.getDate())
dayDiff = Math.round((startOfDay(now) - startOfDay(due)) / 86400000)

dayDiff > 0        → overdue  显示「已逾期 N 天」
dayDiff === 0      → today    显示「今天到期」
-3 <= dayDiff <= -1 → soon    显示「还有 N 天」
其余                → normal   显示「还有 N 天」（N ≥ 4）
dueAt 为空          → none     显示「无期限」
```

为什么按自然日：若用毫秒差取整，「今天 09:00 看今天 23:59 截止」会算成「还有 0 天」，语义错误。自然日边界保证它显示「今天到期」。

### 4.2 排序规则

| 场景 | 规则 |
| --- | --- |
| 列表视图 | `dueAt` 升序；**无期限的一律排最后**（AC-05） |
| 分组视图 | 组间按课程名 `localeCompare('zh')` 排序，「未分类」固定排最后；组内 `dueAt` 升序（AC-06） |
| 看板：待办 / 进行中列 | `dueAt` 升序，无期限最后 |
| 看板：已完成列 | `completedAt` 降序（最近完成的在最上） |

> 优先级**不参与排序**，只用颜色和标签表达。保持规则简单可验证。

### 4.3 筛选与搜索（对应 AC-08）

- 全局筛选：课程 / 类型 / 状态 + 关键词（匹配标题与备注，忽略大小写、去首尾空格）
- 统一入口 `visibleTasks()`，**渲染前一次性应用**
- **状态筛选项**：全部 / 未完成（默认）/ 待办 / 进行中 / 已完成
  - 默认「未完成」→ 满足 AC-03「完成后离开待办列表」
- **看板视图下隐藏状态筛选器**：看板本身就是按状态分的，再叠一层会自相矛盾
- **概览统计不受筛选影响**：统计是全局的（AC-11 按全局口径验证）

### 4.4 看板状态流转（对应 AC-07）

两种方式并存：

| 方式 | 用途 | 是否纳入自动验收 |
| --- | --- | --- |
| **每张卡片上的 `←` / `→` 按钮** | 键盘可达、移动端可用 | ✅ 是（主路径） |
| HTML5 拖拽（draggable） | 桌面端体验增强 | ❌ 否（headless 下难以可靠模拟） |

按钮路径同时满足 NFR-06 的可访问性要求，所以它才是主路径、拖拽只是锦上添花。

---

## 5. 界面结构

### 5.1 `index.html` 骨架（预计 ~180 行）

```text
<header>  品牌区（CampusTask）+ 新建任务按钮
<section> 概览统计条：待办 / 今日到期 / 逾期 / 本周完成
<nav>     视图切换：列表 | 按课程分组 | 看板
<section> 工具栏：课程筛选 / 类型筛选 / 状态筛选 / 搜索框 / 导入 / 导出
<main>    三个视图容器（同一时刻只显示一个）
           #view-list / #view-group / #view-board
<dialog>  任务表单弹窗（新建与编辑共用同一个）
<dialog>  确认弹窗（删除确认、导入覆盖确认）+ 提示条
<script src="js/app.js">   ← 经典标签，置于 body 末尾
```

### 5.2 视觉与响应式（`css/style.css`，预计 ~450 行）

- CSS 变量集中定义配色，四档时间状态各有独立视觉（颜色 **+ 文字标签 + 符号**，不只靠颜色 → NFR-06）
- 断点 `640px`：概览 4 数字转 2×2、工具栏换行
- **看板窄屏横向滚动**：滚动条挂在看板容器自己身上（`overflow-x:auto`），**不是 body** → 满足 AC-15「内容不横向溢出」

### 5.3 安全：XSS 防护（必须遵守）⚠️

任务标题和备注是用户输入。**一律用 `textContent` 写入 DOM，禁止用 `innerHTML` 拼接任何用户数据。**

否则标题里写 `<img src=x onerror=alert(1)>` 会被真实执行。这是实现阶段的硬性约束，会写进 `tasks.md` 并在验收时抽查。

---

## 6. 数据导入导出（对应 AC-10 / AC-14）

**导出**：`{version, tasks}` → `Blob` → `<a download="campusTasks-backup-YYYY-MM-DD.json">`

**导入**：`<input type="file" accept=".json,application/json">` → `FileReader` → `JSON.parse` 包在 `try/catch` 里 → 校验 → 弹窗确认「将覆盖当前 N 条任务」→ 写入

**校验分两档**（这个区分是刻意的）：

| 情况 | 处理 |
| --- | --- |
| 顶层不是对象、或 `tasks` 不是数组 | ❌ **整体拒绝** |
| 单条任务 `title` 不是非空字符串 | ❌ **整体拒绝** |
| 单条任务缺 `course` / `note` / `priority` 等可选字段 | ✅ 补默认值，放行 |

**任一拒绝 → 中文错误提示 + 绝不改动现有数据**（AC-14）。宁可让用户重导，也不留半截脏数据。

**异常兜底**：启动读取时若 localStorage 内容损坏，先把原文备份到 `campusTasks:v1:corrupt`（不静默丢数据），提示用户后以空列表启动。写入失败（配额满 / Safari `file://` 禁用）也要有中文提示。

---

## 7. 验证策略

「页面能打开」不算完成。下面每一项都要有**实际验证证据**。

### 7.1 自动化：CDP 端到端验收

**关键约束：测试脚本写在系统临时目录，绝不放进 `demo-04/`** —— 交付物必须只有规格中列出的文件。

技术手段（本项目零依赖，测试也不许引入依赖）：

- 用 Node 24 内置模块驱动本机 Chrome：`child_process.spawn` + `http` 取 `/json` + 全局 `WebSocket` 走 DevTools 协议
- 启动参数：`--headless=new --remote-debugging-port=<port> --user-data-dir=<临时目录>`
- 每个用例开始先 `localStorage.clear()` + reload，保证干净起点
- **`try/finally` 确保退出时杀掉 Chrome**，否则残留实例会占用调试端口，下次运行会静默连上它并继承脏数据
- **断言计算样式与真实几何**（`getBoundingClientRect()`），**绝不断言 `element.style.X`**（无效 CSS 声明会被静默丢弃，断言会假绿）
- 桌面与 400px 两档各截一张图，人工过目

### 7.2 验收标准 → 验证方法对照

| AC | 验证方法 |
| --- | --- |
| AC-01 | 填表单提交 → 断言任务出现在 DOM 正确位置且 localStorage 已写入 |
| AC-02 | 标题留空提交 → 断言无新任务、出现中文错误文案 |
| AC-03 | 点复选框 → 断言卡片离开待办列表、`status==='done'`、`completedAt` 非空 |
| AC-04 | 注入 4 条不同 `dueAt` → 断言各自标签文字正确，且四者计算样式互不相同 |
| AC-05 | 注入乱序任务 → 读 DOM 顺序断言升序、无期限在最后 |
| AC-06 | 切分组视图 → 断言分组标题、组序与组内顺序 |
| AC-07 | 切看板 → 断言三列存在；点 `→` → 断言卡片落到目标列且 `status` 同步 |
| AC-08 | 设筛选与关键词 → 断言可见卡片数等于期望值 |
| AC-09 | 操作后 `reload` → 断言任务与完成状态完整保留 |
| AC-10 | 拦截导出 Blob 内容 → 清空 → 导入 → 断言与导出前深度相等 |
| AC-11 | 注入已知数据集 → 断言四个统计数字 |
| AC-12 | 点删除 → 断言确认弹窗出现且数据未变；确认后消失 |
| AC-13 | 清空数据 → 断言空状态引导文案存在 |
| AC-14 | 导入坏 JSON 与结构错误 JSON → 断言中文报错且原数据条数不变 |
| AC-15 | `Emulation.setDeviceMetricsOverride` 到 400px → 断言 `scrollWidth <= clientWidth` 且核心按钮可见可点 |

### 7.3 人工验收（不可省）

自动化跑绿之后，**由你本人**在浏览器里做一次真实走查：打开 → 建几条任务 → 切三种视图 → 刷新 → 导出再导入。自动化能证明逻辑对，证明不了「好不好用」。

---

## 8. 风险与对策

| 风险 | 对策 |
| --- | --- |
| Safari `file://` 下禁用 localStorage | 已在规格 9.1 声明；验证以 http 服务器为准 |
| CDP 断言全绿但界面视觉错乱 | 双保险：几何断言 + 截图人工过目（历史教训：曾有一次 CSS 错误骗过了全绿用例） |
| headless 下 HTML5 拖拽难模拟 | 看板移动的验收走 `←/→` 按钮路径，拖拽不进自动验收 |
| 看板窄屏把 body 撑出横向滚动 | 滚动条挂在看板容器自身（`overflow-x:auto`） |
| 日期格式化受环境影响 | 手写格式化，不依赖 `toLocaleDateString` 的隐式 locale |
| 演示时被要求「顺便加个登录」 | 规格 4.2 已明确范围外；新增需求 → 回 Clarify 更新规格，不悄悄夹带 |

---

## 9. 实施顺序（将展开为 `tasks.md`）

按依赖顺序，每步都可独立验证：

```text
1. 静态骨架      index.html + style.css 布局与配色（无逻辑，先能看）
2. 数据层        §0 §2 §3：存储、日期算法、工具函数
3. 领域层        §4：增删改查、状态流转、排序、筛选、统计
4. 列表视图      §5 §6 第一部分：渲染 + 新建/编辑/删除/完成 + 概览统计 + 空状态
5. 分组视图      按课程分组渲染
6. 看板视图      三列 + 状态流转（按钮 + 拖拽）
7. 筛选与搜索    工具栏联动
8. 导入导出      含全部异常分支
9. 响应式        640px 断点与看板横向滚动
10. 验收         跑 CDP 全量用例 + 截图 + 人工走查 → convergence-report.md
```

---

## 10. 变更记录

| 日期 | 阶段 | 变更 |
| --- | --- | --- |
| 2026-09-19 | Plan | 依据已确认的 `requirements.md` 制定架构、分层、数据、算法、界面与验证策略 |
