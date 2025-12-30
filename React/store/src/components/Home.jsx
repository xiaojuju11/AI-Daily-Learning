import React from 'react'
import useCountStore from '../store/count.js'

export default function Home() {
    const count = useCountStore((state) => state.count)
    const increase = useCountStore((state) => state.increase)
    const decrease = useCountStore((state) => state.decrease)

  return (
    <div>
        <button onClick={increase}>增加-{count}</button>
        <button onClick={() => decrease(10)}>减少</button>
    </div>
  )
}
