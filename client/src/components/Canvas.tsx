import { useEffect } from "react"
import { io } from 'socket.io-client';


const socket = io("http://localhost:2000")
const Canvas = () => {
    useEffect(()=>{
        socket.on('connect', () => {
          console.log('connected')
        })
      },[])
  return (
    <div className=" border border-5 border-black bg-white" style={{height:"80vh",width:"94vw",marginTop:"10vh",marginLeft:"3vw"}}>

    </div>
  )
}

export default Canvas