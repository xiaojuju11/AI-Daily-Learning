import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";   // 自动加载 .env

async function main() {
  // 1. 创建模型实例
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    apiKey: process.env.AI_API_KEY,
    configuration: { baseURL: process.env.AI_ENDPOINT },
  });

  // 2. 发起调用（invoke = 调用并等待完整结果）
  const response = await model.invoke("用一句话解释 LangChain 是什么。");

  // 3. 读取回复内容
  console.log(response.content);
}

main().catch(console.error);