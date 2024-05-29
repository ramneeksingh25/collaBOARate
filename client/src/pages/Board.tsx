import { useEffect } from 'react';
import { useParams } from 'react-router-dom'


const Board = () => {
    useEffect(()=>{
      
    },[])
    const {id} = useParams();
    console.log(id);
    
  return (
    <div>Board {id}</div>
  )
}

export default Board