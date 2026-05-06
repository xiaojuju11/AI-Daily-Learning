import Child from "./Child"

export default function Parent() {

  const state = {
    name: '俊杰'
  }

  return (
    <div>
      <h2>父组件</h2>
      <Child msg={state.name}/>
    </div>
  )
}
