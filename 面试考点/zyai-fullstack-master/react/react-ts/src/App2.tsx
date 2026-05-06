import React, { useRef, useState } from 'react'

export default function App2() {
  const [num, setNum] = useState<number>()
  // const ref = useRef<HTMLDivElement>(null)
  const ref = useRef<{num: number}>(null)
  ref.current = {num: 2}

  return (
    <div>App2</div>
  )
}

