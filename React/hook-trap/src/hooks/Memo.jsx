import { useEffect, useState, memo, useCallback, useMemo } from "react";

const Child = memo((props) => {
  console.log(props.count);
  
  return <h2>{props.count}</h2>
})


export default function Memo() {
  const [num, setNum] = useState(1)
  const [count, setCount] = useState(2)

  useEffect(() => {
    setInterval(() => {
      setNum(Math.random())
    }, 2000)
  }, [])

  const callback = useCallback(() => {

  }, [])

  const count2 = useMemo(() => {
    return count * Math.random()
  }, [])

  return (
    <div>
      <Child count={count2} callback={callback}></Child>
    </div>
  )
}