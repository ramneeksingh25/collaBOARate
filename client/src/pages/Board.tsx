import { useParams } from 'react-router-dom'
import Menu from '../components/Menu';
import Canvas from '../components/Canvas';
const Board = () => {
  const id = useParams().id
  return (
    <div className='position-fixed h-100 w-100 d-flex flex-column bg-black align-items-center justify-content-center'>
      <Menu id={id}/>
      <Canvas id={id}/>
    </div>
  )
}

export default Board