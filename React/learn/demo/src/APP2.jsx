import './App2.css'
function APP() {
    const name = '小君'
    const songs = [
        {id:1,name:'稻香'},
        {id:2,name:'夜曲'},
        {id:3,name:'最伟大的作品'}
    ]
    let flag = true
    // const styleObj = {
    //     color:'green',
    //     fontSize:'60px'
    // }
  return (
    <div>
        <h1>你好，我是{name} </h1>
        <ul>
            {
                songs.map((item,i)=>{
                    return <li key={item.id}>{item.name}</li>
                })
            }
        </ul>

        <h2>{flag?'黄子嘻嘻':'王源嘻嘻'}</h2>
        <h2>{flag && '嘻嘻'}</h2>

        {/* <div className="box" style = {{color:'green'}}>王源应援色</div> */}
        {/* <div className="box" style = {styleObj}>王源应援色</div> */}

        <div className="box" >黄子应援色</div>

    </div>
  )
}
export default APP