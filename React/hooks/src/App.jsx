import { useState } from 'react'//弥补函数组件不能使用状态的问题

export function App() {
  const [count, setCount] = useState(0)//[o,fn]  //缓存count值，避免每次渲染都重新创建count变量
  const [list, setList] = useState([])
  const [name, setName] = useState(() => {
    return '张三'
  })

  function add() {
    setCount(count + 1)
    // console.log(count);//0 （异步）
    setList(() => {
      list.push('html')
      return list
    })
  }
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={add}>add</button>
      <ul>
        {
          list.map((item, i) => {
            return <li key={i}>{item}</li>
          })
        }
      </ul>
      <h3>{name}</h3>
    </div>
  )
}
export default App
