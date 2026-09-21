# 原始vibe coding (氛围编程)
帮我做一个xxx管理工具, 要好看一点, 直接写代码.

1. 不确定性很重(不一定想要的东西)
2. 可能才在一定的bug


# prompt engineering (结构化提示词)
目标: 展示把需求一次性, 结构化的交给AI后, 首版得到成果会更完整.

1. 给AI赋予人设(让AI知道自己的定位, 更关注于什么地方)
2. 规范约束
3. 上下文
4. 输出格式

> 缺点: 依然需要人工深度介入审核和调试, 无法处理复杂的系统级逻辑

# context engineering (上下文环境, 面试, 人为干涉, 决策, 去对话)

如果工程很大怎么办?
每个都要这么写?, 提示词怎么写会更好?
AI在执行任务之前, 应该知道什么?

prompt 是一次性的输入, context 是 AI 工作所处的环境.


# SDD(面试, Spec Driven Development), 持久化的开发状态
所以 AI 降低了编码成本 , 却提高了 "精确定义问题" 的价值
在 SDD 中, 着重区别 What 和 How,

idea -> contitution(原则, AGENTS.md) -> spec(文档), (歧义)-> plan(计划) -> tasks(任务) -> implement(执行, 代码开发) -> converge(验收 + 收敛)

spec -> 提出需求后, AI 会思考功能怎么设计, 并提出歧义, 向你提问, 最后形成文档(目标, 用户, 核心场景, 不做什么), 并产生一系列验收标准(可验证的需求, 确定性的指标)

plan(从what -> how) 确定技术架构, 模块划分, 数据流, 写什么文件, 问我

tasks -> 将plan拆解成可以独立执行和验证的任务

# 下班之后做
implenment -> 写代码

converge -> 根据 spec 检查代码是否发现 gap(缺口), 发现了就补回taks, 然后循环, 直到真正收敛完后, 最后验收.

SDD 本质是一个持久化的开发状态 -> context + process engineering -> 先让 AI 和人把 "到底要做什么" 讲清楚并固化成规范, 再把规范主播转化成技术方案, 任务, 代码, 最后反过来检查代码是否真的满足规范.

把需求变成 AI 可以持续执行和验证的工程规范

# 怎么实现 SDD?
- Agent 描述(AGENTS.md)
- Spec 文件(记录spec.md, plan.md)
- workflow(一套工作流程贯通实现闭环, 在AGENTS.md做好)



# 碎碎念
- 以前和现在有区别

- AI 有一定的缺点: 同质化(适合做固有的流程, 人的决策能力重要了),
- skill(是否适合你, fronted-design, tasted-design), 找
- 到适合自己的skill或者说制作适合自己的skill(diy),定义好适合自己coding模式,vibecoding
- 不是任何时候都去使用SDD, 氛围编程, 问就完了, 看看demo找找灵感, 结构化提示词, context, SDD
- 不要妄想自己的工作流或者文档能一次性写的非常精美, 需要反复修改, 润色.
- 







# AGENTS.md
# readme.md // 程序员对于项目的使用说明书
# AGENTS.md // AI 对于项目的使用说明书(claude.md -> 每次开发去读AGENTS.md)

OpenAI
my-project/
│
├── AGENTS.md                       # AI 全局工作规则
├── README.md                       # 项目介绍、启动方式
│
├── docs/                           # 项目级长期上下文
│   ├── requirements.md             # 产品整体需求
│   ├── architecture.md             # 系统架构
│   ├── design.md                   # UI / UX 设计规范
    --- Handoff/                    # 交接文档
            -----handoff.1()
            -----handoff.2
│   │
│   └── conventions/                # 通用工程规范
│       ├── coding.md               # 编码规范
│       ├── testing.md              # 测试规范
│       ├── git.md                  # Git / Commit 规范
│       └── security.md             # 安全规范
│
├── frontend/
│   ├── AGENTS.md                   # 前端专属 AI 规则
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   └── tests/
│
├── backend/
│   ├── AGENTS.md                   # 后端专属 AI 规则
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── models/
│   └── tests/
│
├── database/
│   ├── AGENTS.md                   # 数据库专属 AI 规则
│   ├── migrations/
│   └── schema/
│
├── scripts/
│   ├── build.sh
│   ├── test.sh
│   └── check.sh
│
└── package.json


根AGENTS.md(太长了 几百行) 比较健康的文档长度大概在50-70行左右
│
├── 1. Project Overview        项目是什么
├── 2. Repository Structure   项目怎么组织
├── 3. Context Routing        去哪里找上下文 ⭐
├── 4. Global Rules           什么能做 / 不能做
├── 5. Architecture           必须遵守什么架构
├── 6. Commands               怎么运行 / 测试
├── 7. Verification           怎么验证
└── 8. Definition of Done     什么叫真正完成
    10. 记录后端的代码开发规范




# SDD 简版目录
demo/
├── AGENTS.md
├── specs/
│   └── task1-management/ (新建任务模块)
│     │
│     ├── spec.md
│     ├── plan.md
│     ├── tasks.md
│     ├── checklist.md
│     └── decisions.md
    ----task2-management (删除任务模块)
        -- spec.md
        -- plan.md
        -- ...
└── src/


my-project/
│
├── AGENTS.md                       # AI 全局工作规则 (写开发前一定要看SDD)
----SDD.md (SDD详细工作流程)
├── README.md
│
├── docs/                           # 项目级长期上下文
│   ├── requirements.md
│   ├── architecture.md
│   ├── design.md
│   │
│   └── conventions/
│       ├── coding.md
│       ├── testing.md
│       ├── git.md
│       └── security.md
│
├── specs/                          # ⭐ SSD 核心
│   │
│   ├── authentication/
│   │   ├── spec.md                 # WHAT：要实现什么
│   │   ├── plan.md                 # HOW：准备怎么实现
│   │   └── tasks.md                # EXECUTE：拆成哪些任务
│   │
│   ├── payment/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   │
│   └── user-profile/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── frontend/
│   ├── AGENTS.md
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   └── tests/
│
├── backend/
│   ├── AGENTS.md
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── models/
│   └── tests/
│
├── database/
│   ├── AGENTS.md
│   ├── migrations/
│   └── schema/
│
├── memory/                         # Agent 执行状态
│   ├── progress.md                 # 当前执行到哪里
│   └── issues.md                   # 当前发现的问题
│
├── scripts/
│   ├── build.sh
│   ├── test.sh
│   └── check.sh
│
└── package.json
