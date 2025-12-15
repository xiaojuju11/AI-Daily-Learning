import { useState } from "react"
import Child1 from "./Child1"
import Child2 from "./Child2"

export default function Parent() {
  let [message, setMessage] = useState()

  const getMsg = (msg) => {
    setMessage(msg)
  }

  return (
    <div>
      <h2> 父组件三 </h2>
      <Child1 getMsg={getMsg}/>
      <Child2 message={message}/>
    </div>
  )
}