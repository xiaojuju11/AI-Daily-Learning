import { createClient } from '../mcp/client.js';
import axios from 'axios';

// 单次对话最多允许的工具调用轮数，避免模型反复请求工具造成无限递归
const MAX_TOOL_ROUNDS = 5;

export class LLM {
  mcpClient = createClient()
  constructor(model, base_url, api_key) {
    this.model = model
    this.base_url = base_url
    this.api_key = api_key
  }

  async listTools() {  // 获取所有工具
    return (await (await this.mcpClient).listTools()).tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    }))
  }

  async callTool(tool_name, tool_args) {
    const result = await (await this.mcpClient).callTool({
      name: tool_name,
      arguments: tool_args || {}
    })
    // 工具可能返回空 content，兜底成空串而不是抛 TypeError
    const text = result?.content?.[0]?.text ?? ''
    return {
      role: 'tool',
      content: text,
      name: tool_name,
    }
  }

  async chat(messages, round = 0) {
    const response = await axios.post(`${this.base_url}/api/chat`, {
      model: this.model,
      messages,
      tools: await this.listTools(),   // 注册工具
      stream: false,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.api_key}`,
      },
    })

    // /api/chat 返回的是单个 message 对象，tool_calls 也在其中
    const message = response.data.message
    const reply = message.content   // 回答的内容
    const tool_calls = message.tool_calls   // LLM想调用的工具
    if (tool_calls && tool_calls.length > 0) {
      if (round >= MAX_TOOL_ROUNDS) {
        throw new Error(`工具调用超过 ${MAX_TOOL_ROUNDS} 轮，已中止`)
      }
      const list = tool_calls.map(tool_call => {
        return this.callTool(tool_call.function.name, tool_call.function.arguments)
      })
      const results = await Promise.all(list)  // 调用所有工具
      // 按协议顺序回灌：assistant(tool_calls) -> tool(result1) -> tool(result2)...
      return await this.chat([
        ...messages,
        { role: 'assistant', content: reply, tool_calls },
        ...results
      ], round + 1)
    }
    return reply
  }
}

// let llm = new LLM('gpt-3.5-turbo', 'https://api.openai.com/v1', 'sk-xxxxx')
// llm.chat([{role: 'user', content: '你好'}])