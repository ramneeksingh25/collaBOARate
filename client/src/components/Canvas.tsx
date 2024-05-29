import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import OtherCursor from "./OtherCursor";
import { userContext } from "../contexts/userContext";
const socket = io("http://localhost:2000");

const Canvas = ({ id }: { id: string | undefined }) => {
	const userData = useContext(userContext);
	const boardRef = useRef<HTMLDivElement>(null);
	const [cursor, setCursor] = useState({});
	const [other, setOther] = useState({});

	useEffect(() => {
		socket.emit("join_room", id);
		boardRef.current?.addEventListener("mousemove", (e: MouseEvent) => {
			socket.emit("cursor_moved", {
				x: e.x,
				y: e.y,
				id: id,
				userData: userData?.name,
			});
			setCursor({ x: e.x, y: e.y, id: id, userData: userData?.name });
		});
	}, [id, userData?.name]);
	useEffect(() => {
		socket.on("other", (data) => {
			setOther(data);
		});
	}, []);
	return (
		<div
			ref={boardRef}
			className=" border border-5 border-black bg-white"
			style={{
				height: "800px",
				width: "1800px",
				marginTop: "10vh",
				marginLeft: "3vw",
			}}>
			<div style={{ position: "fixed" }}>
				{JSON.stringify(other)}
				<h1>{JSON.stringify(cursor)}</h1>
			</div>

			<OtherCursor cursor={other} />
		</div>
	);
};

export default Canvas;
