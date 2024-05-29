import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:2000");

const Canvas = ({id}:{id:string|undefined}) => {
	const boardRef = useRef<HTMLDivElement>(null);
	const [cursor,setCursor]=useState({});
	const [other,setOther] = useState();
	useEffect(()=>{
		socket.emit("join_room",id)
		boardRef.current?.addEventListener("mousemove",(e:MouseEvent)=>{
			socket.emit("cursor_moved",{x:e.x,y:e.y,id:id})
			setCursor({x:e.x,y:e.y,id:id})
		})
	},[id])
	useEffect(()=>{
		console.log("hello");
		socket.on("other",(data)=>{
			console.log(data);
			setOther(data);
		})
	},[])

	return (
		<div
			ref={boardRef}
			className=" border border-5 border-black bg-white"
			style={{
				height: "80vh",
				width: "94vw",
				marginTop: "10vh",
				marginLeft: "3vw",
			}}>
			{JSON.stringify(other)}
			<h1>
				{JSON.stringify(cursor)}
			</h1>
		</div>
	);
};

export default Canvas;
