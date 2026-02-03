import React,{useRef,useEffect} from 'react'

const Child:React.ForwardRefRenderFunction<HTMLInputElement> = (props,ref) =>{
    return <div>
        <input type="text" ref={ref} />
    </div>
}
const WrapChild = React.forwardRef(Child)//将WrapChild上的ref属性转发给Child

export default function App3() {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        console.log(ref.current)
        ref.current?.focus()
    },[])
  return (
    <div>
        <WrapChild ref={ref} />
    </div>
  )
}
