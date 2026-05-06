export default function Child(props) {
  console.log(props);
  
  return (
    <h3>子组件 -- {props.msg}</h3>
  )
}
