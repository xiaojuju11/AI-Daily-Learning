import { SimpleRag } from '../src/index.js';

async function main() {
  const rag = new SimpleRag();
  await rag.initialize();  // 初始化 RAG
  const inserted = await rag.add('RAG是什么原理？');
  // console.log(JSON.stringify(inserted));

  const res = await rag.query('RAG是什么？');
  console.log(res);

  const res2 = await rag.query('胡言乱语');
  // console.log(res2);
  
}

main()