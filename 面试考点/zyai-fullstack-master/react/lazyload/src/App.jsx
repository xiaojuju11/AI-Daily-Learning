import LazyLoad from "react-lazyload"
import { lazy } from 'react'
import MyLazyLoad from "./MyLazyLoad"

// 组件没有出现在可视区域时，组件代码都不加载，被import('./Demo')包裹的模块会单独打包
const Demo = lazy(() => import('./Demo')) 


export default function App() {
  return (
    <div>
      {/* <Demo></Demo> */}
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <p>xxxxxxx</p>
      <MyLazyLoad placeholder={<div>loading...</div>} onContentVisible={() => {
        console.log('组件加载了');
      }}>
        {/* <img src="https://gips3.baidu.com/it/u=3905956784,3339852483&fm=3074&app=3074&f=PNG?w=2048&h=2048" alt="" /> */}
        <Demo></Demo>
      </MyLazyLoad>

      <MyLazyLoad placeholder={<div>loading...</div>} offset={300}>  
        <img src="https://gips1.baidu.com/it/u=644059463,65824265&fm=3074&app=3074&f=PNG?w=2048&h=2048" alt="" />
      </MyLazyLoad>
    </div>
  )
}
