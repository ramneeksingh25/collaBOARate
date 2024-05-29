import { useParams } from 'react-router-dom'
import Menu from '../components/Menu';
import Canvas from '../components/Canvas';
const Board = () => {
  const id = useParams().id
  return (
    <div className='bg-dark position-fixed h-100 w-100'>
      <Menu id={id}/>
      <Canvas id={id}/>
    </div>
  )
}

export default Board