import { useEffect, useReducer, useState } from "react"

function reducer(state, action) {
  console.log(state, action);
  
  switch(action.type) {
    case 'add':
      return state + action.num
    case 'minus':
      return state - action.num
  }
  return state
}


export default function Trap() {
  // const [count, setCount] = useState(0)
  const [count, dispatch] = useReducer(reducer, 0)  // [0, fn]

  useEffect(() => {  // useEffect的回调中引用了count  let count = 0
    setInterval(() => {
      // setCount((prev) => prev + 1)

      dispatch({type: 'add', num: 1})
    }, 1000)
  }, [])

  return (
    <div>{count}</div>
  )
}