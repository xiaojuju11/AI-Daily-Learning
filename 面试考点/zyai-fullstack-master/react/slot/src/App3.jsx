import { useEffect, useRef, useState } from 'react'
import Protal from './components/Protal'

export default function App3() {
  const [count, setCount] = useState(1)

  useEffect(() => {
    setInterval(() => {
      setCount((prev) => {
        // return prev + 1
      })
    }, 1000)
  }, [])

  const content = <div className='btn'>
                    <button>按钮</button>
                  </div>

  return (
    <div>
      <h2>{count}</h2>
      <Protal attach={'#root'}>{content}</Protal>
    </div>
  )
}
