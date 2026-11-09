# 每日提交历史

| 日期 | 仓库 | 改动 | 验证 | Commit |
| --- | --- | --- | --- | --- |
| 2026-11-08 | OrangeVerse | 新增 `src/preferences.js`：主题（森屿/沙洲/浅海）与环境音开关持久化；抽出 `selectTheme()` 统一入口；修复 `#ocean` 深链重复触发与 `aria-pressed` 不同步；首次指针/键盘交互时按浏览器自动播放策略恢复环境音 | `npm test` 21/21 通过；`npm run build` 通过 | `70acb6c` |
| 2026-11-08 | AI-Daily-Learning | 搭建每日提交自动化：`Agent/daily-commit/`（config.json 轮换配置、rotation.ps1 诊断、catchup.ps1 漏天检测、README 执行手册） | rotation.ps1 本机跑通；catchup.ps1 模拟漏天输出正确 | `df4b28a`、`8a1ced54`、`d7b9f2c7` |
| 2026-11-09 | parent_kid_edu | `fix(auth)`：资料更新接口加字段白名单，禁止经 `updateAvatar/updateNickname` 修改 `id`/`password_hash`/`phone`（原可越权改成他人行或写入明文密码绕过 bcrypt）；头像协议白名单（拒绝 `javascript:`/`file:`）；JWT 密钥集中到 `config/auth.js` 并支持 `JWT_SECRET`；`verifyToken` 缺 id 不再静默挂起；`getUserInfo` 处理用户不存在；dotenv 提前加载 | `npm test` 7/7 通过；`node --check` 全部通过；rebase 到远端最新后重跑测试通过 | `97d8cde` |
| 2026-11-09 | AI-Daily-Learning | 修复 catchup.ps1 误报：判定「漏天」前先核实该日在任一仓库是否已有提交；`.gitignore` 补 `__pycache__/`、`myvenv/`，避免自动同步把虚拟环境提交进仓库 | catchup.ps1 实测 11-08 不再误报；重跑 exit 0 | 见本次提交 |

## 轮换计划（4 个仓库，chatbox-demo 已排除）

| 日期 | 仓库 |
| --- | --- |
| 2026-11-09 | parent_kid_edu |
| 2026-11-10 | react-playground |
| 2026-11-11 | AI-Daily-Learning |
| 2026-11-12 | OrangeVerse |
| 2026-11-13 | parent_kid_edu（循环） |

> 2026-11-08 用户明确要求：`chatbox-demo` 以后不再提交。已从 `config.json` 的 `repos` 移出并加入 `excluded`，rotation.ps1 增加兜底过滤，即使被写回也不会进入轮换。
