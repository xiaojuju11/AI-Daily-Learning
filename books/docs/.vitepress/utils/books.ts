import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 书单：加一本新书 = 在这里加一行 + 建一个同名目录。
 * dir 是 docs 下的目录名，也是网址前缀（/js/、/react/ ...）。
 */
export interface Book {
  dir: string
  text: string
  tagline: string
}

export const BOOKS: Book[] = [
  {
    dir: 'js',
    text: 'JavaScript 精讲',
    tagline: '语言机制 · 手写实现 · TypeScript',
  },
  {
    dir: 'react',
    text: 'React 深度进阶',
    tagline: 'Hooks 原理 · 渲染机制 · 工程化',
  },
  {
    dir: 'ai',
    text: 'AI 应用工程',
    tagline: 'LLM · Agent · RAG · MCP',
  },
  {
    dir: 'interview',
    text: '面试与性能实战',
    tagline: '性能优化 · 数据结构 · 设计模式',
  },
  {
    dir: 'daily',
    text: '每日笔记',
    tagline: '当天素材，先放这儿，周末再成书',
  },
]

const DOCS_DIR = fileURLToPath(new URL('../../', import.meta.url))

interface PageItem {
  text: string
  link: string
  order: number
}

interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

function stripOrderPrefix(name: string): string {
  return name.replace(/^\d+\s*[-_.、\s]\s*/, '')
}

/** 只认 title / order 两个字段，够用了，不引第三方依赖 */
function readMeta(file: string, fallback: string): { title: string; order: number } {
  const raw = fs.readFileSync(file, 'utf8')
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  let title = ''
  let order = Number.NaN

  if (block) {
    for (const line of block[1].split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/)
      if (!kv) continue
      const value = kv[2].trim().replace(/^['"]|['"]$/g, '')
      if (kv[1] === 'title') title = value
      if (kv[1] === 'order') order = Number(value)
    }
  }

  if (!title) {
    const body = block ? raw.slice(block[0].length) : raw
    const h1 = body.match(/^#\s+(.+)$/m)
    title = h1 ? h1[1].trim() : stripOrderPrefix(fallback)
  }

  return { title, order: Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER }
}

function mdFiles(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name)
}

function sortPages(pages: PageItem[]): PageItem[] {
  return pages.sort(
    (a, b) =>
      a.order - b.order ||
      a.text.localeCompare(b.text, 'zh-Hans-CN', { numeric: true }),
  )
}

function toItem(dir: string, fileName: string, urlBase: string): PageItem {
  const slug = fileName.replace(/\.md$/, '')
  const { title, order } = readMeta(path.join(dir, fileName), slug)
  return { text: title, link: `${urlBase}${slug}`, order }
}

/** 扫描 docs/<书>/ 目录，自动生成侧边栏：新建 md 文件就自动出现，不用改配置 */
export function buildSidebar(book: Book): SidebarItem[] {
  const abs = path.join(DOCS_DIR, book.dir)
  const urlBase = `/${book.dir}/`
  if (!fs.existsSync(abs)) return []

  const rootPages = sortPages(
    mdFiles(abs)
      .filter((f) => f !== 'index.md')
      .map((f) => toItem(abs, f, urlBase)),
  )

  const groups: SidebarItem[] = fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', { numeric: true }))
    .map((dirName) => {
      const sub = path.join(abs, dirName)
      const items = sortPages(mdFiles(sub).map((f) => toItem(sub, f, `${urlBase}${dirName}/`)))
      return {
        text: stripOrderPrefix(dirName),
        collapsed: false,
        items: items.map(({ text, link }) => ({ text, link })),
      }
    })
    .filter((g) => g.items && g.items.length > 0)

  return [
    {
      text: book.text,
      items: [{ text: '本书导读', link: urlBase }, ...rootPages.map(({ text, link }) => ({ text, link }))],
    },
    ...groups,
  ]
}

export function buildSidebars(): Record<string, SidebarItem[]> {
  const result: Record<string, SidebarItem[]> = {}
  for (const book of BOOKS) result[`/${book.dir}/`] = buildSidebar(book)
  return result
}
