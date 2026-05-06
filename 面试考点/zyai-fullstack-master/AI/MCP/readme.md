# MCP (model context protocol)
统一 LLM 与外部工具的交互方式

1. 构建一个 MCP 服务
2. 往MCP服务中注册一个工具函数
3. 构建一个 MCP 客户端 （通常是一个应用程序）
4. MCP 客户端 向 LLM 发请求，LLM 无法处理该请求，于是调用 MCP 服务中的工具函数 listFiles
5. MCP 客户端 接收 MCP 服务返回的结果
