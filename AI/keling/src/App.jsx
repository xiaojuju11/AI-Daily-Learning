import { useState } from "react"


export default function App() {
  const [imgUrl, setImgUrl] = useState('') // 要展示的图片

  const generateImage = async() => {
    // 获取用户在textarea中输入的内容
    const endPoint = '/klingai/v1/images/generations'
    // 负向提示词，保障大模型一定不会生成以下的内容
    const negative_prompt = 'Blurry, Bad, Bad anatomy, Bad proportions, Deformed, Disconnected limbs, Disfigured, Extra arms, Extra limbs, Extra hands, Fused fingers, Gross proportions, Long neck, Malformed limbs, Mutated, Mutated hands, Mutated limbs, Missing arms, Missing fingers, Poorly drawn hands, Poorly drawn face.'
    const token = await (await fetch('/api/jwt-auth')).text()

    // 跟大模型交互
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
    const payload = {
      prompt: '一个8 岁左右的小女孩抱着一只橘猫，小女孩笑的非常开心',
      negative_prompt: negative_prompt,
      aspect_ratio: '1:1'
    }
    const res = await fetch(endPoint, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(payload)
    })

    console.log(res);
    
    
  }


  return (
    <div className="container">
      <div>
        <label>Prompt:</label>
        <button onClick={generateImage}>生成</button>
        <textarea></textarea>
      </div>
      <div className="ouput">
        <img src={imgUrl} alt="" />
      </div>
    </div>
  )
}