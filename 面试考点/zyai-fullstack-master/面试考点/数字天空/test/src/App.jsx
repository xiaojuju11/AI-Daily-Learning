import React from 'react'
import { useState, useRef, useEffect } from 'react';

function handle() {
  console.log('handle');
}

export default function App() {
  const [count, setCount] = useState(0);
  const num = useRef(0);
  let n = 0

  useEffect(() => {
    console.log('num.current 变化了', num.current);
  }, [num]);

  console.log('组件重载了', num.current);

  return (
    <div>
      <button ref={num} onClick={() => {}}>{n}</button>
    </div>
  )
}
