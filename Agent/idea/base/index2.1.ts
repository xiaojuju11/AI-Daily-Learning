import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

// 定义可用工具集合：读文件、写文件、执行shell命令
const tools = {
  read_file: {},
  write_file: {},
  run_command: {}
}

async function agent(task: string) {
  // 初始化消息：用户原始任务
  const messages = [{ role: 'user', content: task }]
  let turnCount = 0  // 记录Agent已经跑了多少轮思考+工具调用
  const maxTurns = 30  // 硬上限，防止无限死循环

  while (true) {
    // 轮数自增，超过30轮强制终止，解决模型无限循环
    if (++turnCount > maxTurns) {
      console.log('超出最大轮数，停止执行');
      break
    }

    // 请求Claude模型，maxSteps:1 👉 告诉SDK：只允许这一轮返回工具调用，不要SDK自动循环
    const result = await generateText({
      model: anthropic('claude-sonnet-4-6'),
      messages,
      tools,
      maxSteps: 1,
    })

    // 没有toolCalls，代表模型不需要再调用工具，任务结束
    if (result.toolCalls.length === 0) {
      console.log('Agent:', result.text);
      break
    }

    // 遍历每一个要调用的工具
    for (const toolCall of result.toolCalls) {
      console.log(`调用工具: ${toolCall.tool.name}(${toolCall.tool.arguments})`);
      
      // 执行工具：读文件 /写文件 /跑命令 run_command
      const toolResult = await executeTool(toolCall)

      // ✅关键：把【assistant工具调用请求】和【tool工具返回结果】两条消息追加进messages
      messages.push(
        { role: 'assistant', content: result.text, toolCalls: [toolCall]  },
        { role: 'tool', content: toolResult, toolCallId: toolCall.id}
      )
    }
  }
}
