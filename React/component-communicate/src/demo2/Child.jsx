export default function Child(props) {
  
  const state = {
    num: 100
  }

  function send() {
    props.getNum(state.num)
  }

  return (
    <div>
      <h3>子组件二</h3>
      <button onClick={send}>发送</button>
    </div>
  )
}