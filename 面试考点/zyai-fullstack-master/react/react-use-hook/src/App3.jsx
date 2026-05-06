// import { useHover } from 'react-use';
import useHover from './hooks/useHover'

export default function App3() {
  const element = (hovered) => {
    return <div>
      Hover me! {hovered && 'Thanks!'}
    </div>
  }

  const [hoverable, hovered] = useHover(element);
  console.log(hoverable);
  

  return (
    <div>
      {hoverable}
      {hovered ? 'ok' : 'no'}
    </div>
  )
}
