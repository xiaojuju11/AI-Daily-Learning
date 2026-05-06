import { Children } from 'react'

export default function Aaa({ children }) {
  console.log(children.sort());
  
  return (
    <div>
      {
        // children.map((item, index) => {
        //   return <div key={index} className='item'>{item}</div>
        // })

        Children.map(children, (item ,index) => {
          return <div key={index} className='item'>{item}</div>
        })
      }
    </div>
  )
}
