import React, { useEffect, useRef } from 'react'

const Child: React.ForwardRefRenderFunction<HTMLInputElement> = (props, ref) => {
  return <div>
    <input ref={ref} />
  </div>
}
const WrapChild = React.forwardRef(Child)  // 将WrapChild上的 ref 属性转发给 Child


export default function App3() {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log(ref.current);
    ref.current?.focus()
  })

  return (
    <div>
      <WrapChild ref={ref}></WrapChild>
    </div>
  )
}
