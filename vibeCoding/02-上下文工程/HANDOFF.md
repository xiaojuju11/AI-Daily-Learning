# 认证重构 - 交接

## 已完成

- JWT 签发逻辑迁移到 auth/jwt.service.ts
- 登录接口已切到新逻辑，测试通过

## 待办

- refresh token 还没迁移，逻辑在 auth/legacy.ts:120
- bar.ts 有个 unused import 的 warning，顺手修掉

## 已知的坑

- 别动 auth/session.ts 的 Redis key 格式，线上有老数据依赖
- 方案 A（在中间件里验签）试过，不行：中间件拿不到 user context