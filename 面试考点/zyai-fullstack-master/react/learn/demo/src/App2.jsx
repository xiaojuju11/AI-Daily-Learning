import './app2.css';

function App() {
  const name = '小君'
  const songs = [
    {id: 1, name: '稻香'},
    {id: 2, name: '夜曲'},
    {id: 3, name: '最伟大的作品'},
  ]
  let flag = true
  const styleObj = {
    color: 'red'
  }

  return (
    <div>
      <h1>你好，我是{name}</h1>
      <ul>
        {
          songs.map((item, i) => {
            return <li key={item.id}>{item.name}</li>
          })
        }
      </ul>

      {/* <h2>{flag ? '鹤鹤很帅' : '佳俊更帅'}</h2> */}
      {/* <h2>{flag && '鹤鹤很帅'}</h2> */}


      {/* <div className="box" style={{color: 'green'}}>子涵哥哥</div> */}
      
      {/* <div className="box" style={ styleObj }>子涵哥哥</div> */}

      <div className="box">子涵哥哥</div>
      
    </div>
  )
}

export default App