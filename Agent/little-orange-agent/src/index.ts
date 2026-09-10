import 'dotenv/config'
import { streamText, type ModelMessage, stepCountIs } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createMockModel } from './mock-model'
import { createInterface } from 'readline'
import { weatherTool } from './tools/utility-tools'
import { agentLoop,type BudgetState } from './agent/loop'



const tools = {get_weather: weatherTool}  //自己封装了一个工具函数
const messages: ModelMessage[] = []// 用于存储用户和助手的对话记录  对象数组
const rl = createInterface({ // 用于从命令行读取用户输入
  input: process.stdin,
  output: process.stdout,
})


const qwen = createOpenAI({ //创建openAI模型，用于生成文本
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.DASHSCOPE_API_KEY,
})

const model = process.env.DASHSCOPE_API_KEY ? qwen.chat('qwen-plus-latest') : createMockModel()  

// async function main() {
//   const result = streamText({
//     model: model as any,
//     prompt: '用一句话介绍你自己',
//   })

//   for await (const chunk of result.textStream) {
//     process.stdout.write(chunk)
//   }

// }
// main()

const budget: BudgetState = {used:0,limit:15000}  //token预算



const system = `你是 Super Agent，一个有工具调用能力的AI助手。需要时主动使用工具获取信息，不要编造数据`

function ask(){
    rl.question('\nYou:', async(input) => {
        const trimmed = input.trim();
        if (!trimmed || trimmed === 'exit') {
          console.log('Bye!');
          rl.close();
          return;
        }

        messages.push({ role: 'user', content: trimmed });//这个是和模型通讯

        agentLoop(model,  tools, messages, system,budget);//不止一次调用，需要递归调用
        ask();
    })
}

console.log('Super Agent v0.3 - Agent Loop (type "exit" to  quit)\n');
console.log('试试输入：“测试死循环”')
ask();