import './app.css'
import { useState, useRef } from 'react'

export default function App() {
    const [question, setQuestion] = useState('讲一个女娲补天的故事')
    const [content, setContent] = useState('')
    const checkRef = useRef(null)

     const update = async () => {
        //获取到用户在input框中的输入内容，传给dp,将dp返回的内容展示在页面上
        if (!question) return//如果用户什么都没有输入，直接返回
        setContent('思考中...')//将content设置为思考中...

        const endpoint = 'https://api.deepseek.com/chat/completions '
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        }
        const response = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "user",//角色
                        content: question//用户输入的内容
                    }
                ],
                stream: checkRef.current.checked//是否开启流式传输
            })
        })
        if(checkRef.current.checked){//要LLM以流式资源输出
            
        }else{//要LLM以非流式资源输出
            const result = await response.json()
            setContent(result.choices[0].message.content) 
        }

        // .then(res =>{
        //     return res.json()
        // }).then(result =>{
        //     // console.log(result.choices[0].message.content)
        //     setContent(result.choices[0].message.content)
        // })
    }
    const handleChange = (e) => {
        setQuestion(e.target.value)
    }


    return (
        <div className="container">
            <div>
                <label htmlFor="question">输入：</label>
                <input type="text" id="question" value={question} onChange={handleChange} />
                <button onClick={update}>提交</button>
            </div>
            <div className="output">
                <div>
                    <label htmlFor="check">Streaming</label>
                    <input type="checkbox" id="check" ref={checkRef} />
                </div>
                <div>{content}</div>
            </div>
        </div>
    )
}