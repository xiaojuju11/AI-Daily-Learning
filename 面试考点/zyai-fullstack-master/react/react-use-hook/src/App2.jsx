import React, { useState } from 'react'
import { useLifecycles } from 'react-use'

const Child = () => {
  useLifecycles(
    null,
    () => {
      console.log('Child 卸载');
    }
  )
  return <h1>child组件</h1>
}

export default function App2() {
  const [show, setShow] = useState(true)
  return (
    <div>
      <h1 onClick={() => setShow(!show)}>App2</h1>
      {
        show && <Child></Child>
      }
    </div>
  )
}
