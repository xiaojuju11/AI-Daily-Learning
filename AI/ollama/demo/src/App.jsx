import React, { useState } from 'react'

export default function App() {
    const [query, setQuery] = useState('')
    const [result, setResult] = useState('')

    const handle = () => {
        if (!query) {
            return
        }
        setResult("思考中...")


    }
    return (
        <div>
            <div>
                <input type="text" onChange={(e) => setQuery(e.target.value)}></input>
                <button onClick={handle}>发送</button>
            </div>

            <div>
                <div id="output" style={{ width: '400px', minHeight: '200px', border: '2px solid #000' }}>
                    {result}
                </div>
            </div>
        </div>
    )
}
