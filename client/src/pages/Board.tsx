import { useParams } from 'react-router-dom'
import Menu from '../components/Menu';
import Canvas from '../components/Canvas';
const Board = () => {
  return (
    <div className='bg-dark position-fixed h-100 w-100'>
      <Menu id={useParams().id}/>
      <Canvas/>
    </div>
  )
}

export default Board