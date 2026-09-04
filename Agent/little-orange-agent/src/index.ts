import 'dotenv/config'
import { streamText,type ModelMessage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createMockModel } from './mock-model'
import {createInterface} from 'readline'

const qwen = createOpenAI({
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
//     process.stdout.write(chunk)//进程标准输出
//   }
// }
// main()

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const message