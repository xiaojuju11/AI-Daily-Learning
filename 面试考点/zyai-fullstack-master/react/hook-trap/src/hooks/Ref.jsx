import { useEffect, useRef, useState } from "react"


export default function Ref() {
  const numRef = useRef(0)
  const [a, forceRender] = useState(0)
  const [age, setAge] = useState(1)
 
  return (
    <div>
      {/* <input type="text" ref={inputRef}/> */}
      <h2 onClick={() => {
        // forceRender(Math.random())
        numRef.current += 1
        if (numRef.current > 10) {
          setAge(age + 1)
        }
      }}>
        {numRef.current} - {age}
      </h2>
      <button onClick={() => {
        console.log(numRef.current);
      }}>获取结果</button>
    </div>
  )
}
