/**
 * 工具函数集合
 * 
 * **/

import ollama from 'ollama';

/**
 * Split text into fixed-size chunks with an overlap between neighbours.
 *
 * - chunkSize must be a positive integer and overlap an integer in
 *   [0, chunkSize), otherwise the step (chunkSize - overlap) is <= 0 and
 *   the loop never advances (hangs / OOM). Validate instead of looping.
 * - Stop as soon as a chunk reaches the end of the text: the old loop kept
 *   emitting a trailing chunk whose content was already fully covered by
 *   the previous one, costing an extra embedding and a duplicate vector.
 *
 * @param {string} text
 * @param {number} [chunkSize=300]
 * @param {number} [overlap=50]
 * @returns {string[]}
 */
export function splitText(text, chunkSize = 300, overlap = 50) {
  if (typeof text !== 'string') {
    throw new TypeError('splitText: text must be a string');
  }
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new RangeError('splitText: chunkSize must be a positive integer');
  }
  if (!Number.isInteger(overlap) || overlap < 0 || overlap >= chunkSize) {
    throw new RangeError('splitText: overlap must be an integer in [0, chunkSize)');
  }
  if (text.length === 0) return [];

  const chunks = [];
  const step = chunkSize - overlap;
  for (let i = 0; i < text.length; i += step) {
    chunks.push(text.slice(i, i + chunkSize));
    if (i + chunkSize >= text.length) break;
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
 