const RESPONSES: Record<string, string> = {//键和值都是字符串
  default: '你好！我是模拟模型。填了 DASHSCOPE_API_KEY 后会自动切换到真实的 Qwen。',
  greeting: '你好！虽然是模拟的，但流式输出的效果和真实 API 一致 :)',
  name: '你刚才告诉我了呀！我能"记住"是因为代码把对话历史传给了我。',
  intro: '我是通义千问（模拟版），在本地模拟回复，机制和真实 API 完全一致。',
  code: '模拟模式下我没有办法真的写代码，但是流式输出的体验你已经感受到了，填上真实的API_KEY后就能解锁完整能力',
};

function getMsgText(msg: any): string {
  return (msg.content || []).map((c: any) => c.text || '').join('');
}

function extractUserText(prompt: any[]): string {
  const userMsgs = (prompt || []).filter((m: any) => m.role === 'user');//filter过滤出来还是一个数组，
  const last = userMsgs[userMsgs.length - 1];//取最后一个元素
  if (!last) return '';
  return getMsgText(last).toLowerCase();//返回最后一个元素的文本内容，转换为小写
}

function findUserName(prompt: any[]): string | null {
  const userMsgs = (prompt || []).filter((m: any) => m.role === 'user');
  for (const msg of userMsgs) {
    const text = getMsgText(msg);
    const match = text.match(/(?:我(?:叫|是|的名字(?:是|叫)?))\s*(\S{1,10})/);
    if (match) return match[1];
  }
  return null;
}

function pickResponse(prompt: any[]): string {
  const last = extractUserText(prompt);
  if (last.includes('介绍你自己') || last.includes('你是谁')) return RESPONSES.intro;
  const name = findUserName(prompt);
  if (last.includes('你好') || last.includes('hello') || last.includes('hi')) {
    return name ? `你好${name}！很高兴认识你，有什么我能帮你的吗？` : '你好！很高兴认识你，有什么我能帮你的吗？';
  }
  if (last.includes('叫什么') || last.includes('名字') || last.includes('记得') || last.includes('记住')) {
    return name ? `你说你叫${name}呀 :)` : '你还没告诉我你的名字呢，要不先自我介绍一下？';
  }
  if (last.includes('代码') || last.includes('code') || last.includes('函数')) return RESPONSES.code;
  return RESPONSES.default;
}



const USAGE = {
  inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 20, text: 20, reasoning: undefined },
};

//模拟模型的流式输出
function createDelayedStream(chunks: any[], delayMs = 30) {
    //chunks= [{type:'text-start',id},{type:'text-delta',id,delta:'你'},{type:'text-delta',id,delta:'好'}......{type:'text-end',id},{type:'finish',finishReason:{unified:'stop',raw:undefined},usage:USAGE}}
    return new ReadableStream({//ReadableStream是js自带的流式数据类型，默认自己内部会创建出一个队列，用于存储数据，我们只要往队列中放东西即可
      start(controller) {
       let i = 0;
       function next(){
        if(i < chunks.length){
          controller.enqueue(chunks[i++]);//enqueue队列中添加一个元素
          setTimeout(next, delayMs);
        }else{
            controller.close();
            return;
        }
       }
       next();
      },
    });
}


export function createMockModel() {
  return {
    specificationVersion: 'v4' as const,
    provider: 'mock',
    modeId: 'mock-model',

    //做生成回复
    async doGenerate({ prompt }:any) {
      return {
        content:[{type:'text',text:pickResponse(prompt)}],//随机选择一个回复
        finishReason:{unified:'stop'as const,raw:undefined},
        usage:USAGE,
        warnings:[],
      }
    },

    //生成流式资源
    async doStream({ prompt }: any) {
      const text = pickResponse(prompt);   // 'xxxxxxxxxxx'   ['x', 'x', ..]
      const id = 'text-1';
      const chunks = [
        { type: 'text-start', id },
        ...text.split('').map((char: string) => ({ type: 'text-delta', id, delta: char })),//split将字符串转换为字符数组
        { type: 'text-end', id },
        { type: 'finish', finishReason: { unified: 'stop', raw: undefined }, usage: USAGE },
      ];
      return { stream: createDelayedStream(chunks, 30) };
    },
  }
}