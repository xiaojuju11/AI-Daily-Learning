// 导入必要的库
import { createCrawl, createCrawlOpenAI} from 'x-crawl' // 导入x-crawl库中的爬虫相关函数
// import dotenv from 'dotenv' // 导入dotenv用于加载环境变量
import fs from 'fs' // 导入fs模块用于文件操作

// 加载.env文件中的环境变量
// dotenv.config()


// 创建爬虫实例，配置基础参数
const crawlApp = createCrawl({
  maxRetry: 3, // 最大重试次数
  intervalTime: { min: 1000, max: 3000 }, // 请求间隔时间，在1-3秒之间随机，防止被反爬
})

// 创建OpenAI爬虫实例，用于AI解析数据
const crawlOpenAI = createCrawlOpenAI({
  clientOptions: {
    apiKey: '', // 从环境变量获取OpenAI API密钥
    baseURL: '', // 从环境变量获取OpenAI API基础URL
  }
})

// 开始爬取豆瓣南昌正在热映电影页面
crawlApp.crawlPage('https://movie.douban.com/cinema/nowplaying/nanchang/').then(async(res) => {
  // 打印响应结果
  // console.log(res)
  
  // 从响应数据中解构出page（页面对象）和browser（浏览器实例）
  const { page, browser} = res.data

  // 获取页面内容 - 定位到正在上映电影的容器元素
  const targetSelector = '#nowplaying' // CSS选择器，定位到正在上映电影的容器
  await page.waitForSelector(targetSelector) // 等待目标元素加载完成
  
  // 提取目标元素的HTML内容
  const highlyHTML = await page.$eval(targetSelector, (el) => el.innerHTML)
  // console.log(highlyHTML) // 可选：打印HTML内容用于调试

  // 让AI解析HTML内容，提取需要的电影信息
  const result = await crawlOpenAI.parseElements(
    highlyHTML, // 传入需要解析的HTML内容
    `获取正在上映的电影，将电影的图片链接、电影名称、电影的上映时间，电影评分获取到。
    输出格式为 JSON 数组。如：
    [
      {
        "image": "https://img.com/1.jpg",
        "name": "电影名称",
        "time": "上映时间",
        "scode": "评分"
      }
    ]` // AI解析提示词，指定需要提取的数据字段和输出格式
  )

  // 关闭浏览器实例，释放资源
  browser.close()
  
  // 打印解析结果到控制台
  console.log(result)
  
  // 将解析结果保存到result.json文件，使用缩进格式化JSON输出
  fs.writeFileSync('./result.json', JSON.stringify(result, null, 2))
})