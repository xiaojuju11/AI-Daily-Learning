// import './app.css'
import Border from './components/Border'
import Aaa from './components/Aaa'

export default function App() {
  
  return (
    <div>
      {/* <Border>
        <div className="home">首页</div>
      </Border> */}

      <div className="container">
        <Aaa>
          {
            [
              <span>111</span>,
              <span>333</span>,
              [<span>444</span>, <span>222</span>]
            ]
          }
        </Aaa>
      </div>

    </div>
  )
}
