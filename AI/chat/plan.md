# DeepSeek 风格多模态 AI 聊天网站 — 实现计划

## Context
用户要用**纯 HTML/CSS/JS**（无框架）构建一个类似 DeepSeek 的 AI 聊天网站，后端 AI 使用**硅基流动上的 Qwen3.6-27B 模型**，需要支持文本对话和图片输入（多模态）。

## 技术架构

```
┌──────────────────────────────────────┐
│        浏览器 (纯 HTML/CSS/JS)        │
│  - 单页应用                          │
│  - 直接调用硅基流动 API (OpenAI 兼容)  │
│  - API Key 由用户输入，存 localStorage │
└────────────┬─────────────────────────┘
             │ fetch() + SSE streaming
┌────────────▼─────────────────────────┐
│  硅基流动 API                         │
│  POST /v1/chat/completions           │
│  model: Qwen/Qwen3.6-27B             │
│  支持 text + image_url 多模态输入     │
└──────────────────────────────────────┘
```

## 文件结构
```
d:\AIforstudy\AI\chat\
├── index.html    ← 主页面 + 结构
├── style.css     ← 所有样式 (DeepSeek 风格)
└── app.js        ← 所有交互逻辑 + API 调用
```

## 功能模块

### 1. 布局结构（类 DeepSeek）
- **左侧边栏**（可折叠）：对话列表、新建对话按钮、设置按钮
- **右侧主区域**：消息列表 + 底部输入框
- 首次进入显示 DeepSeek 风格的欢迎页（Logo + 建议问题卡片）

### 2. 聊天核心功能
- 发送文本消息
- 图片上传（文件选择 / 粘贴 / 拖拽三种方式）
- 图片预览缩略图，可删除
- 消息气泡（用户右侧蓝色 / AI 左侧灰色）
- **流式输出**：SSE 解析，逐字显示（打字机效果）
- 支持中断生成（Stop 按钮）

### 3. Markdown 渲染
- 使用 marked.js CDN 渲染 AI 回复
- 使用 highlight.js CDN 做代码语法高亮
- 支持表格、列表、引用、加粗等
- 代码块带复制按钮

### 4. 对话管理
- 新建对话
- 对话列表（标题自动取第一条用户消息）
- 删除对话
- 所有数据存 localStorage

### 5. 设置功能
- API Key 输入（存 localStorage，首次使用引导设置）
- 模型选择下拉框
- Thinking 模式开关（Qwen3.6 支持）
- Temperature 调节

### 6. API 调用细节
- **Endpoint**: `https://api.siliconflow.cn/v1/chat/completions`
- **Model**: `Qwen/Qwen3.6-27B`
- **认证**: `Authorization: Bearer <API_KEY>`
- **多模态请求格式**:
```js
messages: [{
  role: 'user',
  content: [
    { type: 'text', text: '用户输入的文字' },
    { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,...' } }
  ]
}]
```
- **流式**: `stream: true`，解析 `data: [DONE]` 格式的 SSE 响应

### 7. 注意事项
- 硅基流动 API 可能存在 CORS 限制，如果浏览器直接调用被拦截，需增加一个轻量 Node.js 代理（Express 单文件，约 30 行代码）
- API Key 存储在浏览器 localStorage，仅限个人使用场景

## 实现步骤

### Step 1: 创建 index.html — 页面结构
- 侧边栏骨架
- 主聊天区域骨架
- 欢迎页
- 输入框区域（含图片上传按钮）
- 设置弹窗骨架

### Step 2: 创建 style.css — DeepSeek 风格样式
- CSS 变量定义主题色
- 侧边栏样式
- 消息气泡样式
- 输入框区域样式
- Markdown 内容样式
- 响应式适配（移动端）
- 深色模式支持

### Step 3: 创建 app.js — 核心逻辑
- 全局状态管理
- localStorage 读写（API Key、对话列表、消息历史）
- API 调用函数（支持流式和非流式）
- SSE 解析器
- 消息渲染（Markdown + 代码高亮）
- 图片处理（上传、预览、base64 编码）
- 对话管理（新建、切换、删除）
- 设置面板交互
- 键盘快捷键（Enter 发送、Shift+Enter 换行）

### Step 4: 测试验证
- 在浏览器打开 index.html
- 输入 API Key
- 发送文本消息，验证流式输出
- 上传图片 + 文字，验证多模态识别
- 切换对话，验证历史记录

## 关键 CDN 依赖
```html
<!-- Markdown 渲染 -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<!-- 代码高亮 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js/styles/github-dark.min.css">
<script src="https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js"></script>
<!-- 图标（可选，用 emoji 替代也可） -->
```

## 备选：CORS 代理
如果浏览器直接调用被 CORS 拦截，在 `d:\AIforstudy\AI\chat\proxy.js` 添加一个简单的 Express 代理服务器（约 30 行），前端只需把 API endpoint 改为 `http://localhost:3001/api/chat`。
