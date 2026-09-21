# 技术与架构记录

> 本文件记录已经确认的技术事实和约束。技术选择发生变化时同步更新；具体“为什么这样选”写入 `docs/decisions.md`。

## 技术栈与运行方式

- 技术栈：原生 HTML + CSS + JavaScript（ES2020+），无框架、无构建、无 npm 依赖。
- 依赖与服务：无。不引入任何外部库、CDN 资源或后端服务，离线可用。
- 启动 / 运行方式：用浏览器直接打开 `index.html`（`file://` 协议）即可，无需安装或启动任何服务。
- 支持的环境：现代桌面浏览器（Chrome / Edge / Safari / Firefox）。不要求移动端适配，但窄屏下布局不应错乱。

## 项目结构

```text
demo-03/
  index.html        # 页面结构：任务清单、概览、筛选栏、课程表视图、任务编辑表单
  styles.css        # 全部样式
  app.js            # 状态、渲染、事件与本地存储读写
  docs/             # 项目记忆文档
```

## 核心模块与职责

- 数据层：`loadState()` / `saveState()`，负责 `localStorage` 读写，并为缺失字段补默认值。
- 状态层：内存中唯一一份 `state`（含 `tasks`、`courses`、`filters`、`view`），所有修改走统一入口。
- 渲染层：`render()` 依据 `state` 重建清单、概览与课表的 DOM。
- 事件层：表单提交、按钮点击、筛选变更统一用事件委托在容器上处理。

## 数据与状态

- 核心数据模型：

```js
Course = { id, name, teacher, location, schedule: [{ day, start, end }] }
Task   = { id, title, courseId, category, due, priority, location, note, done, createdAt, updatedAt }
```

  - `category`：`homework` | `exam` | `lab` | `club` | `personal` | `other`
  - `priority`：`high` | `medium` | `low`
  - `due`：ISO 8601 字符串，或 `null` 表示无截止日期
  - `courseId`：关联 `Course.id`，或 `null` 表示不属于任何课程
  - `Task.location`：考试 / 活动地点等，可为空字符串（用于满足"考试可记录地点"的产品要求）
  - `schedule[].day`：`1`–`7`（周一至周日）；`start` / `end`：`"HH:mm"`

- 数据来源与持久化方式：数据全部由用户在本机录入，持久化到浏览器 `localStorage`，键名为 `campustask.tasks` 与 `campustask.courses`。
- 状态管理约定：任何修改先改内存 `state`，调用 `saveState()` 后再 `render()`；不从 DOM 反读数据。

## 关键实现约束

- 不得引入构建步骤、npm 依赖或任何外部网络资源。
- 不发起网络请求；应用完全离线可用。
- 渲染用户输入一律使用 `textContent` / `createElement`，禁止用 `innerHTML` 拼接用户数据。
- `localStorage` 读写必须做异常保护：隐私模式或存储被禁用时，应用不得白屏，应降级为仅内存可用并在界面提示。
- 时间统一以 ISO 字符串存储，展示时按本地时区格式化。
- 周课表的课程块必须用**绝对定位 + 百分比**换算位置。不要改用 `grid-row`：CSS Grid 的行号只接受整数，`grid-row: 2 / 3.667` 这类小数会被浏览器静默丢弃并回退为自动放置，导致课程块全部堆到表格底部。

## 已知技术风险

- 同一门课或不同课程若在同一天的同一时段有安排，课表上的课程块会互相重叠（后渲染的盖住先渲染的）。本期接受，未做分列排布。
- `file://` 协议下各浏览器对 `localStorage` 的处理不一致：可能按文件路径隔离，清除浏览器数据会丢失全部任务。本期接受此风险；后续可增加"导出 / 导入 JSON"作为兜底。
- 无账号与同步机制，数据不跨设备、不跨浏览器。
- 若改用本地静态服务器（`http://`）打开，`localStorage` 的源与 `file://` 不同，两处数据互不可见。
