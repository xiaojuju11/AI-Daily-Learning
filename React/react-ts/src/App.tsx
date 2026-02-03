import React from 'react'

interface AaaProps {
  name: string,
  age?: number,
  content: React.ReactNode
}

function Aaa(props: AaaProps) {
  return (
    <div>aaa,{props.name},{props.content}</div>
  )
}
const content: React.ReactElement = <div>hello world</div>

const Aaa2:React.FunctionComponent<AaaProps> = (props) =>{
  return  <div>aaa,{props.name},{props.content}</div>
}

export default function App() {
  return (
    <div>
      <Aaa2 name="aaa" content={<div>hello world</div>}></Aaa2>
    </div>
  )
}
