import { useLayoutEffect, useState } from "react"

function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(666)
    }, 1000)
  })
}

export default function LayoutEffect() {
  const [num, setNum] = useState(1)

  useLayoutEffect(() => {
    console.log('useLayoutEffect');
    
    // getData().then(res => {
    //   setNum(res)
    // })
  })

  console.log('render');
  return (
    <div onClick={() => {setNum(num + 1)}}>{num}</div>
  )
}



// js执行             渲染       js执行  （effect）
// js执行 （effect）   渲染       js执行
