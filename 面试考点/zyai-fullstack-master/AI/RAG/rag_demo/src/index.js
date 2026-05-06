import path from 'node:path';
import { getEmbeddings, getVector } from './utils/index.js';
import { LocalIndex } from 'vectra';
import { fileURLToPath } from 'node:url';


export class SimpleRag {
  db = undefined;
  indexPath = '';

  constructor(indexPath = '.vectra') {
    this.indexPath = path.join(fileURLToPath(import.meta.url), '..', indexPath);
  }

  get avaliable() {
    return this.db !== undefined;
  }

  async initialize() {
    const index = new LocalIndex(this.indexPath);  // 创建索引
    if (!(await index.isIndexCreated())) {
      await index.createIndex();  // 创建向量数据库
    }
    this.db = index;
  }

  async add(text) {
    if (!this.avaliable) throw new Error('RAG is not initialized');
    const embeddings = await getEmbeddings(text);
    const res = [];
    for (const embedding of embeddings) {
      res.push(await this.db?.insertItem(embedding));  // 插入向量
    }
    return res.filter(item => item).map((item) => ({ id: item.id }));
  }

  async del(items) {
    if (!Array.isArray(items)) items = [items];
    if (!this.avaliable) throw new Error('RAG is not initialized');
    // 这地方同样也不能并行删除 /
    // return await Promise.all(items.map(async (item) => this.db?.deleteItem(item.id))); 
    const res = [];
    for (const item of items) {
      await this.db?.deleteItem(item.id);  // 删除向量
      res.push({ id: item.id });
    }
    return res;
  }

  async query(query, topK = 5) {
    if (!this.avaliable) throw new Error('RAG is not initialized');
    const vector = await getVector(query);
    const result = await this.db?.queryItems(vector, query, topK);
    return result?.map(({ item, score }) => ({
      text: item.metadata.text,
      query,
      simularity: score,
      id: item.id,
    }))
  }
}
