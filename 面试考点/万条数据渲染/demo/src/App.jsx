import { useEffect, useState, useRef } from 'react'
import './App.css'


const listData = new Array(10000).fill(0).map((item, index) => ({
  id: index,
  name: `name${index}`
}))


export default function App() {
  const [startIndex, setStartIndex] = useState(0) // 起始索引
  const [endIndex, setEndIndex] = useState(0) // 结束索引
  const [startOffset, setStartOffset] = useState(0) // 占位容器起始偏移量
  const containerRef = useRef(null) // 容器ref

  useEffect(() => {
    setEndIndex(startIndex + 11)
  }, [startIndex])

  const visibleData = listData.slice(startIndex, Math.min(endIndex, listData.length))

  const listStyle = {
    transform: `translateY(${startOffset}px)`
  }

  // 列表总高度
  const listHeight = listData.length * 50

  // 处理滚动事件
  const handleScroll = (e) => {
    const scrollTop = containerRef.current.scrollTop
    // console.log(scrollTop)
    // 起始下标
    setStartIndex(Math.floor(scrollTop / 50))
    // 占位容器起始偏移量
    setStartOffset(scrollTop - (scrollTop % 50))
  }

  return (
    <div className='container' onScroll={handleScroll} ref={containerRef}>
      <div className="list-ph" style={{ height: `${listHeight}px` }}></div>
      <div className="list" style={listStyle}>
        <ul>
          {
            visibleData.map(item => (
              <li key={item.id}>{item.name}</li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}