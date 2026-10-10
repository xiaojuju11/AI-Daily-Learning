import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "langchain";
import "dotenv/config";

async function main() {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    apiKey: process.env.AI_API_KEY,
    configuration: { baseURL: process.env.AI_ENDPOINT },
  });

  // 用角色化的消息数组，而不是一坨字符串
  const messages = [
    new SystemMessage("你是一位耐心的老师，擅长用最简单的比喻向 10 岁孩子解释事情。"),
    new HumanMessage("解释一下量子计算。"),
  ];

  const response = await model.invoke(messages);
  console.log(response.content);
}

main().catch(console.error);