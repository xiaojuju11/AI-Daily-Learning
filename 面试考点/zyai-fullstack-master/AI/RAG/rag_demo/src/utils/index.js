/**
 * 工具函数集合
 * 
 * **/

import ollama from 'ollama';

function splitText(text, chunkSize = 300, overlap = 50) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}


function getEmbedding(text) {
  return ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text
  })
}

export async function getEmbeddings(text) {
  const chunks = splitText(text);
  const embeddings = await Promise.all(chunks.map(chunk => getEmbedding(chunk)));
  return embeddings.map((embedding, index) => ({
    vector: embedding.embedding,
    metadata: { text: chunks[index] }
  }))
}

export async function getVector(text) {
  return (await getEmbedding(text)).embedding;
}
 
