# 项目名：一句话说清楚这是什么

Next.js 14 项目，App Router + TypeScript。

## 常用命令

- `pnpm dev`：启动开发服务器
- `pnpm test src/xxx.test.ts`：跑单个测试文件，不要跑全量
- `pnpm typecheck`：改完代码必须跑一次

## 项目结构

- `/app` - 页面和路由
- `/lib` - 工具函数（跨模块共享的逻辑都在这，别重复造）
- `/prisma` - 数据库 schema，migration 文件不要手动改

## 重要约定

- 不要用 --force 推送，用 --force-with-lease
- 环境变量在 .env.local，不要提交
- 认证相关的改动，先读 @docs/auth-patterns.md