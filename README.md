# 🌟 AI-Daily-Learning (AI与现代全栈工程师进阶指南)

<p align="center">
  <img src="https://img.shields.io/badge/AI-Agent%20%26%20MCP-blue?style=for-the-badge&logo=openai" alt="AI Agent" />
  <img src="https://img.shields.io/badge/LLM-DeepSeek%20%26%20Ollama-orange?style=for-the-badge&logo=huggingface" alt="LLM" />
  <img src="https://img.shields.io/badge/React-18%20%2F%2019-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Status-Daily%20Updating-success?style=for-the-badge" alt="Status" />
</p>

---

## 📖 项目简介 (About The Project)

> **系统化前端与 AI 全栈学习实践仓库。** 🚀  
> 收录本人日常学习与实战代码，覆盖从 **HTML/CSS 基础、JavaScript 核心机制、React / TypeScript 框架**，到 **Node.js 服务端、设计模式、数据结构与算法、核心性能优化（虚拟列表 / 大文件分片上传 / 异步并发控制）** 及 **AI Agent 架构、MCP 协议、大模型应用工程（RAG / Function Calling / Mini-Transformer）** 等全链路主题。  
> 
> 🌈 **每个目录均附核心代码、思路与实战注释；持续迭代更新，同步大厂面试考点与 AI 前沿实践，⭐ 欢迎 Star 收藏，一起构建系统化全栈技术成长路线图！**

---

## 🧭 全景知识导航 (Repository Structure)

```plaintext
📦 AI-Daily-Learning
├── 🤖 Agent/                # AI Agent 架构体系（Agent Loop, Context Engineering, Tool System）
├── 🧠 AI/                   # LLM 应用开发（MCP, RAG, Function Calling, SSE 流式输出, 视频生成）
├── 🔬 Transformers/         # 深入自然语言处理与从零实现 Mini-Transformer
├── ⚛️ React/                # React 全家桶深度实践（Hooks 原理与陷阱、React Flow、状态管理）
├── 💻 前端基础/             # HTML / CSS 现代布局 / TS 进阶 / Node.js 事件循环
├── ✍️ js手写系列/           # 手写 Promise A+、防抖节流、深拷贝等核心手写
├── 📊 数据结构与算法/       # 链表、排序、队列、树、递归与动态规划高频题解
├── 🎯 面试考点与性能实战/   # 大文件分片上传、虚拟列表万条渲染、并发调度、跨域与缓存
└── 🎨 设计模式/             # 单例模式、观察者模式等常用设计模式落地
```

---

## 🚀 核心模块与亮点 (Core Highlights)

### 1. 🤖 AI Agent & MCP 协议生态
- **Agent Loop 架构**：拆解 Agent 自主决策循环、上下文工程（Context-Engineering）与多工具调度系统（Tool System）。
- **`little-orange-agent`**：基于 Vercel AI SDK 与 TypeScript 构建的端到端 Agent 项目实战。
- **MCP (Model Context Protocol)**：探索与实现标准化模型上下文交互协议。

### 2. 🧠 LLM 全栈应用与落地实战
- **AI Streaming**：基于 SSE (Server-Sent Events) 的流式输出与打字机响应实现。
- **Function Calling & Tools**：结合结构化输出与函数调用的复杂工作流封装。
- **RAG (检索增强生成)**：向量知识库构建、分块召回与增强检索流程。
- **多模型生态**：DeepSeek 接入实战、Ollama 本地离线大模型推理、Coze 智能体流转、可灵 AI / Remotion 代码驱动视频生成。

### 3. 🔬 Transformers 原理剖析
- **自然语言发展史**：从规则、统计学习到自注意力机制的演进脉络。
- **Mini-Transformer**：手写核心注意力机制与编码器/解码器架构，彻底攻破底层黑盒。

### 4. ⚛️ 现代 React 深度进阶
- **Hooks 深度机制**：解析闭包陷阱、常用 Hooks 自定义封装与调优。
- **复杂可视化与交互**：集成 React Flow 工作流编排、React Spring 物理动画系统、ECharts 数据可视化。
- **工程化全家桶**：全面覆盖 React-Router、现代 Store 状态管理、TypeScript 严苛类型推导。

### 5. 🎯 硬核面试手写与高并发性能调优
- **大文件上传**：文件切片（Blob.slice）、Web Worker 计算 Hash、断点续传与秒传。
- **万条数据渲染**：虚拟列表（Virtual List）与时间分片（Time Slicing）极致平滑渲染。
- **异步控制**：异步并发调度器（Limit 并发池）、请求失败自动重试机制、红绿灯算法。
- **全链路底层**：深入浏览器缓存策略、Event Loop、页面渲染流水线（输入 URL 到首屏加载）。

---

## 🛠️ 快速上手 (Quick Start)

### 1. 克隆本仓库
```bash
git clone https://github.com/xiaojuju11/AI-Daily-Learning.git
cd AI-Daily-Learning
```

### 2. 运行示例项目 (以 Agent 为例)
```bash
# 进入指定子项目目录
cd Agent/little-orange-agent

# 安装依赖
pnpm install

# 配置环境变量 (例如 OPENAI_API_KEY / DEEPSEEK_API_KEY)
cp .env.example .env

# 启动开发服务
pnpm dev
```

---

## 📅 持续演进与路线 (Roadmap)

- [x] Agent 核心循环与上下文工程框架构建
- [x] MCP 协议原型与多工具 Function Calling 集成
- [x] 经典高频手写题与性能瓶颈解决方案收录
- [ ] 深入 Agentic Workflow (多智能体协作架构与评估)
- [ ] 本地模型微调 (LoRA / SFT) 实践与笔记补充
- [ ] 更多 React 19 新特性与全栈应用案例

---

## 🤝 参与与交流 (Contributing)

欢迎各位开发者提出 Issue 或提交 PR，共同完善这一份 AI 与全栈开发路线图！

如果这个仓库对你的学习有所帮助，请给它点一个 ⭐️ **Star**，这是持续更新的最大动力！

---

## 📄 开源协议 (License)

本项目采用 [MIT License](LICENSE) 开源协议。
