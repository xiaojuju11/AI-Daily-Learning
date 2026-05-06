import bdImg from '../bd.webp'

export default function Border(props) {
  console.log(props);
  

  const style = {
    border: '10px solid transparent',
    borderStyle: 'solid',
    borderImage: `url(${bdImg})`,
    borderImageSlice: '30%'
  }
  return (
    <div className="bd_box" style={style}>
      {/* 插槽 */}
      {props.children}
    </div>
  )
}
