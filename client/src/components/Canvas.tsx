import { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, StageProps}  from "react-konva";
import { io } from "socket.io-client";
import OtherCursor from "./OtherCursor";
import { userContext } from "../contexts/userContext";
import { Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import { KonvaEventObject } from "konva/lib/Node";
const socket = io("http://localhost:2000");
type LineProps = {
	points: [number, number];
	color: string;
	width: number;
	id: string | undefined;
};
type KonvaMouseEvent = KonvaEventObject<MouseEvent>
const Canvas = ({ id }: { id: string | undefined }) => {
	const userData = useContext(userContext);
	const boardRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<StageProps>(null);
	const [undoStack, setUndoStack] = useState<LineProps[]>([]);
	const [redoStack, setRedoStack] = useState<LineProps[]>([]);
	// const [other, setOther] = useState({});
	const [lines, setLines] = useState<LineProps[]>([]);
	const [color, setColor] = useState<string>("#000000");
	const [width, setWidth] = useState<number>(2);
	const isDrawing = useRef(false);
	const saveAsImage = () => {
		const uri = stageRef.current?.toDataURL();
		const link = document.createElement("a");
		link.download = "whiteboard.png";
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const saveAsPDF = () => {
		const uri = stageRef.current?.toDataURL();
		const pdf = new jsPDF();
		pdf.addImage(
			uri,
			"PNG",
			0,
			0,
			pdf.internal.pageSize.getWidth(),
			pdf.internal.pageSize.getHeight()
		);
		pdf.save(`board_${id}.pdf`);
	};

	const handleMouseDown = (e : KonvaMouseEvent ) => {
		isDrawing.current = true;
		const pos = e.target?.getStage().getPointerPosition();
		setLines([...lines, { points: [pos.x, pos.y], color, width, id }]);
	};

	const handleMouseMove = (e: KonvaMouseEvent ) => {
		if (!isDrawing.current) return;
		const stage = e.target?.getStage();
		const point = stage?.getPointerPosition();
		const lastLine = lines[lines.length - 1];
		lastLine.points = point ? lastLine.points.concat([point.x, point.y]): [1,1];
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
		}
	};

	const handleRedo = () => {
		console.log("Redo");
	};




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

			{/* <OtherCursor cursor={other} />*/}
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
				ref={stageRef}>
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
				<Button variant="dark" onClick={handleUndo} >Undo</Button>
				<Button variant="dark" onClick={handleRedo}>Redo</Button>
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
				<Button variant="dark" onClick={saveAsImage}>Save as Image</Button>
				<Button variant="dark" onClick={saveAsPDF}>Save as PDF</Button>
			</div>
		</div>
	);
};

export default Canvas;
