#!/usr/bin/env node
/**
 * 新建一章：npm run new -- js "作用域与执行上下文" [slug]
 * 会在 docs/<书>/ 下生成 chNN-slug.md，侧边栏自动出现，不用改任何配置。
 * 带 slug 时放进子目录：npm run new -- js "闭包" closures --dir 02-进阶
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const DOCS = path.join(ROOT, 'docs')

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('用法: npm run new -- <书目录> "<章节标题>" [slug] [--dir 子目录]')
  console.error('例子: npm run new -- js "作用域与执行上下文" scope')
  process.exit(1)
}

const book = args[0]
const title = args[1]
let slug = args[2] && !args[2].startsWith('--') ? args[2] : ''
const dirFlag = args.indexOf('--dir')
const subDir = dirFlag >= 0 ? args[dirFlag + 1] || '' : ''

const bookDir = path.join(DOCS, book)
if (!fs.existsSync(bookDir)) {
  console.error(`没有这本书：docs/${book}/。先在 .vitepress/utils/books.ts 里登记。`)
  process.exit(1)
}

const targetDir = subDir ? path.join(bookDir, subDir) : bookDir
fs.mkdirSync(targetDir, { recursive: true })

if (!slug) {
  // 无 slug 时用 pinyin 不现实，退回时间戳，反正标题在正文里
  slug = Date.now().toString(36)
}

const maxNo = fs
  .readdirSync(targetDir)
  .map((f) => (f.match(/^ch(\d+)/) || [])[1])
  .filter(Boolean)
  .reduce((max, n) => Math.max(max, Number(n)), 0)

const fileName = `ch${String(maxNo + 1).padStart(2, '0')}-${slug}.md`
const filePath = path.join(targetDir, fileName)
if (fs.existsSync(filePath)) {
  console.error(`已存在：${filePath}`)
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const template = `---
title: ${title}
order: ${maxNo + 1}
date: ${today}
---

# ${title}

> 一句话说清这一章要解决什么问题。

## 为什么需要它

## 它到底怎么工作

## 最小可运行示例

\`\`\`js
// 能跑起来的最小例子，带预期输出
\`\`\`

## 常见坑

::: warning 坑一
:::

## 自测三问

1.
2.
3.
`

fs.writeFileSync(filePath, template, 'utf8')
console.log(`已创建 docs/${book}/${subDir ? subDir + '/' : ''}${fileName}`)
