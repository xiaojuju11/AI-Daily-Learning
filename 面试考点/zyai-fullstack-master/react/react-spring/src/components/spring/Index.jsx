import React, { useEffect } from 'react'
import { animated, useSpringValue, useSpring, useSprings, useTrail } from '@react-spring/web'
import './index.css'

export default function Index() {
  // const styles = useSpring({
  //   from: {
  //     width: 0,
  //     height: 0
  //   },
  //   to: {
  //     width: 200,
  //     height: 200
  //   },
  //   config: {
  //     // duration: 2000,
  //     mass: 2,
  //     tension: 400,
  //     friction: 10
  //   }
  // })
  // useEffect(() => {
  //   // width.start(300)
  // }, [])

  // const [styles, api] = useSpring(() => ({
  //   from: {
  //     width: 100,
  //     height: 100
  //   },
  //   config: {
  //     mass: 2,
  //     tension: 400,
  //     friction: 10
  //   }
  // }))

  // const clickHandler = () => {
  //   api.start({
  //     width: 200,
  //     height: 200
  //   })
  // }

  const [springs, api] = useTrail(3, () => ({
    from: {width: 0},
    config: {
      duration: 1000
    }
  }))

  useEffect(() => {
    api.start({width: 300})
  }, [])
  

  return (
    <div>
      {
        springs.map((styles, index) => (
          <animated.div key={index} className='box' style={styles} ></animated.div>
        ))
      }
    </div>
    
  )
}
