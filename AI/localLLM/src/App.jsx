import './app.css'
import { useState } from 'react'

export default function App() {
    const [question, setQuestion] = useState('请讲一个狼来了的故事')
    const [thinkContent, setThinkContent] = useState('等待您的输入')
    const [replayContent, setReplayContent] = useState('')

    const handlerChange = (e) => {
        setQuestion(e.target.value)
    }
    const update = async () => {
        //拿到用户在input输入的值，传给LLM,并且将大模型的内容展示在页面上
        if (!question) {
            return
        }
        setThinkContent('思考中...')

        //跟LLM交互
        const OLLAMA_API = 'http://localhost:11434'
        const MODEL_NAME = 'deepseek-r1:1.5b'
        const endpoint = `${OLLAMA_API}/api/generate`

        const headers = {
            'Content-Type': 'application/json'
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: question,
                stream: true
            })
        })
        // console.log(response)

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let done = false
        let buffer = ''

        setThinkContent('')

        while (!done) {
            const { value, done: doneReading } = await (reader.read())  // {value: xxx, done: xxx}
            done = doneReading
            const chunkValue = buffer + decoder.decode(value)
            // buffer = ''

            // 将字符中的换行 \n 干掉
            const lines = chunkValue.split('\n').filter(Boolean)

            for (let line of lines) {
                try {
                    const data = JSON.parse(line)
                    const delta = data.response
                    if (delta) {
                        setThinkContent((prev) => {
                            return prev + delta
                        })
                    }
                } catch (error) {
                    buffer += line
                }
            }
        }
    }


    return (
        <div className="container">
            <header className="app-header">
                <h1>Ollama 本地对话助手</h1>
                <p className="subtitle"> 简单、高效的本地 AI 对话体验</p>
            </header>

            <main className="chat-container">
                <div className="input-section">
                    <label htmlFor="question-input" className="input-label">输入问题：</label>
                    <div className="input-group">
                        <input value={question} onChange={handlerChange} type="text" id="question-input" className="input" placeholder="请输入您的问题..." />
                        <button className="submit-btn" onClick={update}>
                            <span className="btn-text">发送</span>
                        </button>
                    </div>
                </div>

                <div className="settings-section">
                    <label className="settings-lable">
                        <input type="checkbox" />
                        <span>实时的流式输出</span>
                    </label>
                </div>

                <div className="output-section">
                    <div className="output-header">
                        <h2>AI回复</h2>
                    </div>
                    <div className="output-content">
                        <div>{thinkContent}</div>
                        <div>{replayContent}</div>
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <p>连接本地的Ollama服务</p>
            </footer>

        </div>
    )
}