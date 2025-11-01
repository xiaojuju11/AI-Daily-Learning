//用户输入内容,点击发送按钮，得到ds的回答，展示在 output 中

//1. 获取到用户输入的内容
var input = document.getElementById('input')
//2.给按钮绑定点击事件
var btn = document.getElementById('btn')
//设置output中的内容为思考中
var output = document.querySelector('.output')

btn.addEventListener('click', async () => {
    var question = input.value
    if (question == '') {
        return
    }
    //设置output中的内容为思考中
    output.innerHTML = '思考中...'
    //将question传给ds
    var answer = await getAnswer(question)
    //将ds的回答展示在output中
    output.innerHTML = answer
})

async function getAnswer(question) {
    var endPoint = 'https://api.deepseek.com/chat/completions'//终端
    var headers = {
        'Authorization': 'Bearer xxxxxxxx',
        'Content-Type': 'application/json'
    }
    var payload = {
        'model': 'deepseek-chat',
        'messages': [
            { 'role': 'system', 'content': '你是一个专业的助手' },
            { 'role': 'user', 'content': question }
        ],
        'stream': false
    }
    //给ds发请求
    var response = await fetch(endPoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
    
    var data = await response.json()//将响应体解析为json格式
    //返回ds的回答
    return data.choices[0].message.content
}
