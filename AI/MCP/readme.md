# MCP （model context protocol）
统一LLM与外部工具的交互方式

1. 构建一个MCP服务
2. 往Mcp服务中注册一个工具函数
3. 构建一个MCP客户端 （通常是一个应用程序）
4. MCP客户端调向 LLM 大模型发请求，LLM无法处理该请求，于是调用MCP服务中的工具函数，执行该请求
5. MCp客户端接收MCP服务返回的结果
