import { useReducer, useState } from "react"
import { produce } from 'immer'

function reducer(state, action) {
  console.log('aaaaa');
  
  switch (action.type) {
    case 'add':
      // return {result: state.result + action.num}
      // state.result += action.num
      // return state
      // return {
      //   ...state,
      //   a: {
      //     ...state.a,
      //     b: {
      //       ...state.a.b,
      //       c: {
      //         ...state.a.b.c,
      //         d: {
      //           e: state.a.b.c.d.e + action.num
      //         }
      //       }
      //     }
      //   }
      // }
      return produce(state, (state) => {   // proxy 
        state.a.b.c.d.e += action.num
      })

    case 'minus':
      return {result: state.result - action.num}
  }
  return state
}


export default function Reducer() {
  const [res, dispatch] = useReducer(reducer, null, (params) => {
    return {
      a: {
        b: {
          c: {
            d: {
              e: 0
            }
          },
          f: 0
        },
        g: 0
      }
    }
  })

  return (
    <div>
      <button onClick={() => dispatch({type: 'add', num: 2})}>加</button>
      <button onClick={() => dispatch({type: 'minus', num: 1})}>减</button>
      <h2>{JSON.stringify(res)}</h2>
    </div>
  )
}
