import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

const Child = forwardRef((props, ref) => {
  const [inputValue, setInputValue] = useState('')

  const test = () => {}

  useImperativeHandle(ref, () => ({  // 暴露给父组件的方法
    test,
    inputValue
  }))

  return (
    <div>
      <div>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
        
      </div>
    </div>
  )
})

export default Child
