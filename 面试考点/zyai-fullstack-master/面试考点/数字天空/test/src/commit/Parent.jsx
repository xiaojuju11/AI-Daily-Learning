import Child from './Child'
import React, { useState, useRef, useEffect } from 'react'

export default function Parent() {
  const [values, setValues] = useState(['html', 'css'])
  const childRef = useRef(null)

  
  return (
    <div>
      <Child ref={childRef} />
      
      <button onClick={() => {
          setValues([...values, childRef.current.inputValue])
      }}>提交</button>

      <ul>
        {values.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
