import React from 'react'
import useCountStore from '../store/count.js'

export default function About() {
    const count = useCountStore((state) => state.count)

    return (
        <div>
            <h2>title --{count}</h2>
        </div>
    )
}
