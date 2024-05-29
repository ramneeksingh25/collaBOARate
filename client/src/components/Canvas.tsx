import { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, StageProps } from "react-konva";
import { io } from "socket.io-client";
import OtherCursor from "./OtherCursor";
import { userContext } from "../contexts/userContext";
import { Form } from "react-bootstrap";
import jsPDF from "jspdf";
const socket = io("http://localhost:2000");
type LineProps = {
	points: [number, number];
	color: string;
	width: number;
};
const Canvas = ({ id }: { id: string | undefined }) => {
	const userData = useContext(userContext);
	const boardRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<StageProps>(null);
	const [undoStack, setUndoStack] = useState([]);
	const [redoStack, setRedoStack] = useState([]);
	const [cursor, setCursor] = useState({});
	const [other, setOther] = useState({});
	const [lines, setLines] = useState<LineProps[]>([]);
	const [color, setColor] = useState("#000000");
	const [width, setWidth] = useState(2);
	const isDrawing = useRef(false);
	const saveAsImage = () => {
		const uri = stageRef.current.toDataURL();
		const link = document.createElement("a");
		link.download = "whiteboard.png";
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const saveAsPDF = () => {
		const uri = stageRef.current.toDataURL();
		const pdf = new jsPDF();
		pdf.addImage(
			uri,
			"PNG",
			0,
			0,
			pdf.internal.pageSize.getWidth(),
			pdf.internal.pageSize.getHeight()
		);
		pdf.save("whiteboard.pdf");
	};
	const handleMouseDown = (e) => {
		isDrawing.current = true;
		const pos = e.target?.getStage().getPointerPosition();
		setLines([...lines, { points: [pos.x, pos.y], color, width }]);
	};
	const handleMouseMove = (e) => {
		if (!isDrawing.current) return;
		const stage = e.target?.getStage();
		const point = stage.getPointerPosition();
		const lastLine = lines[lines.length - 1];
		lastLine.points = lastLine.points.concat([point.x, point.y]);
		lines.splice(lines.length - 1, 1, lastLine);
		setLines(lines.concat());
	};

	const handleMouseUp = () => {
		isDrawing.current = false;
	};

	const handleUndo = () => {
		if (undoStack.length > 0) {
			setRedoStack(redoStack.concat(lines));
			setUndoStack(undoStack.slice(0, undoStack.length - 1));
			setLines(undoStack.slice(0, undoStack.length - 1));
			console.log("wow");
		}
	};
	const handleRedo = () => {
		if (redoStack.length > 0) {
			setUndoStack([...undoStack, redoStack.pop()]);
			setLines(redoStack);
		}
	};
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
	useEffect(() => {
		socket.emit("drawing", lines);
		setUndoStack(lines);
	}, [lines]);
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
			<OtherCursor cursor={other} />
			<div style={{ position: "fixed" }}>
				{/* {JSON.stringify(other)}
				<h1>{JSON.stringify(cursor)}</h1> */}
			</div>
			<Stage
				width={1790}
				height={750}
				style={{ border: "1px solid" }}
				onMouseDown={handleMouseDown}
				onMousemove={handleMouseMove}
				onMouseup={handleMouseUp}
				ref={stageRef}
				>
				<Layer>
					{lines.map((line, i) => (
						<Line
							key={i}
							points={line.points}
							stroke={line.color}
							strokeWidth={line.width}
							tension={0.5}
							lineCap="round"
							lineJoin="round"
						/>
					))}
				</Layer>
			</Stage>
			<div style={{ display: "flex", gap: "100px" }}>
				<button
					onClick={handleUndo}
					// disabled={undoStack.length === 0}
				>
					Undo
				</button>
				<button
					onClick={handleRedo}
					// disabled={redoStack.length === 0}
				>
					Redo
				</button>
				<input
					type="color"
					name="color"
					onChange={(e) => {
						setColor(e.target.value);
					}}
				/>
				<Form.Range
					onChange={(e) => {
						setWidth(parseInt(e.target.value));
					}}
					style={{ width: "100px", color: "black" }}
				/>
				<button onClick={saveAsImage}>Save as Image</button>
        <button onClick={saveAsPDF}>Save as PDF</button>
			</div>
		</div>
	);
};

export default Canvas;
