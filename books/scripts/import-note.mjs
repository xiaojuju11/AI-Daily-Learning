#!/usr/bin/env node
/**
 * 从旧笔记导入一章：
 *   npm run import -- "D:\AIforstudy\面试考点\虚拟列表.md" interview "虚拟列表原理" virtual-list
 * 会去掉源文件的 frontmatter 和第一个标题，套上统一格式，写入 docs/<书>/chNN-slug.md
 * 注意：导入只是搬运，成书还得自己重写结构。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const DOCS = path.join(ROOT, 'docs')

const [srcPath, book, title, slug] = process.argv.slice(2)
if (!srcPath || !book || !title) {
  console.error('用法: npm run import -- <源 md 路径> <书目录> "<章节标题>" [slug]')
  process.exit(1)
}

const absSrc = path.resolve(srcPath)
if (!fs.existsSync(absSrc)) {
  console.error(`源文件不存在：${absSrc}`)
  process.exit(1)
}

const bookDir = path.join(DOCS, book)
if (!fs.existsSync(bookDir)) {
  console.error(`没有这本书：docs/${book}/`)
  process.exit(1)
}

let raw = fs.readFileSync(absSrc, 'utf8').replace(/^\uFEFF/, '')
raw = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
raw = raw.replace(/^#\s+.*\r?\n+/, '')
raw = raw.trim()

const maxNo = fs
  .readdirSync(bookDir)
  .map((f) => (f.match(/^ch(\d+)/) || [])[1])
  .filter(Boolean)
  .reduce((max, n) => Math.max(max, Number(n)), 0)

const finalSlug = slug || Date.now().toString(36)
const fileName = `ch${String(maxNo + 1).padStart(2, '0')}-${finalSlug}.md`
const today = new Date().toISOString().slice(0, 10)
const relSource = path.relative(path.join(ROOT, '..'), absSrc).replace(/\\/g, '/')

const out = `---
title: ${title}
order: ${maxNo + 1}
date: ${today}
source: ${relSource}
---

# ${title}

> 本章由旧笔记改写，原始素材：\`${relSource}\`

${raw}
`

fs.writeFileSync(path.join(bookDir, fileName), out, 'utf8')
console.log(`已导入 docs/${book}/${fileName}`)
