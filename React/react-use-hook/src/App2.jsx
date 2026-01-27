import React, { useState } from 'react'
import { useLifecycles } from 'react-use'

const Child = () => {
    useLifecycles(
        null,
        () => {
            console.log('Child组件挂载完成');
        },
        () => {
            console.log('Child组件卸载完成');
        }
    )

    return <h1>Child组件</h1>
}
export default function App2() {
    const [show, setShow] = useState(true);
    return (
        <div>
            <h1 onClick={() => setShow(!show)}>App2</h1>
            {show && <Child />}
        </div>
    )
}
