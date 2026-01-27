import React, { useState } from 'react'
import './index.css'

export default function Base() {
    const [show, setShow] = useState(true)
    const [width, setWidth] = useState(false)
  return (
    <div>
        <button onClick={() => setShow(!show)}>确认</button>
        <button onClick={() => setWidth(!width)}>改变</button>
        {show && <h1 className={`title ${width ? 'w-600' : ''}`}>宝宝</h1>}
    </div>
  )
}
