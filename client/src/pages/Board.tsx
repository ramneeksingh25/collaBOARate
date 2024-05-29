import { useParams } from 'react-router-dom'
const Board = () => {
    const id = useParams();
    console.log(id.id);
    
  return (
    <div>Board {id.id}</div>
  )
}

export default Board