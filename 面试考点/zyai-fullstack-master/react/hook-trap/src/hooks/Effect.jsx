import { useState, useEffect } from 'react'

async function getData() {
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(100)
    }, 1000)
  })
  return data
}

export default function Effect() {
  const [num, setNum] = useState(() => {
    return 1
  })
  const [age, setAge] = useState(18)

  // useEffect(() => {
  //   async function foo() {
  //     const data = await getData()
  //     setNum(data)
  //   }
  //   foo()
  // }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(num);
      setNum(num + 1)
    }, 1000)

    return () => {  // 组件卸载前
      clearInterval(timer)
    }
  })



  function add() {
    setNum((prev) => {
      return prev + 1
    })
    // setAge(age + 1)
  }

  return (
    <div onClick={add}>{num} -- {age}</div>
  )
}
