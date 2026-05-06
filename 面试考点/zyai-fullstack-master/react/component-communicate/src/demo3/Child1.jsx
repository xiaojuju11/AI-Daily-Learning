export default function Child1(props) {
  const state = {
    msg: '3.1 中的数据'
  }

  function send() {
    props.getMsg(state.msg)
  }
  
  return (
    <div>
      <h3>子组件3.1</h3>
      <button onClick={send}>3.1</button>
    </div>
  )
}
