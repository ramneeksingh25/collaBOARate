import { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, StageProps } from "react-konva";
import { io } from "socket.io-client";
import OtherCursor from "./OtherCursor";
import { userContext } from "../contexts/userContext";
import { Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import { KonvaEventObject } from "konva/lib/Node";

const socket = io("http://localhost:2000");

type LineProps = {
	points: number[];
	color: string;
	width: number;
	id: string | undefined;
};

type KonvaMouseEvent = KonvaEventObject<MouseEvent>;

const Canvas = ({ id }: { id: string | undefined }) => {
	const userData = useContext(userContext);
	const boardRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<StageProps>(null);
	const [undoStack, setUndoStack] = useState<LineProps[][]>([]);
	const [redoStack, setRedoStack] = useState<LineProps[][]>([]);
	const [lines, setLines] = useState<LineProps[]>([]);
	const [color, setColor] = useState<string>("#000000");
	const [width, setWidth] = useState<number>(2);
	const isDrawing = useRef(false);
	const [stageWidth, setStageWidth] = useState<number>(window.innerWidth / 1.5);
	const [stageHeight, setStageHeight] = useState<number>(
		window.innerHeight / 1.5
	);
	//to set board dimesions
	useEffect(() => {
		const updateStageSize = () => {
			if (boardRef.current) {
				const { offsetWidth, offsetHeight } = boardRef.current;
				setStageWidth(offsetWidth);
				setStageHeight(offsetHeight * 0.94);
			}
		};

		updateStageSize();
		window.addEventListener("resize", updateStageSize);

		return () => {
			window.removeEventListener("resize", updateStageSize);
		};
	}, []);
	useEffect(()=>{
		console.log(userData?.name+ " joined room " + id);

		
	},[id])

	const saveAsImage = () => {
		const uri = stageRef.current?.toDataURL();
		const link = document.createElement("a");
		link.download = "whiteboard.png";
		link.href = uri || "";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const saveAsPDF = () => {
		const uri = stageRef.current?.toDataURL();
		const pdf = new jsPDF();
		pdf.addImage(
			uri || "",
			"PNG",
			0,
			0,
			pdf.internal.pageSize.getWidth(),
			pdf.internal.pageSize.getHeight()
		);
		pdf.save(`board_${id}.pdf`);
	};

	const handleMouseDown = (e: KonvaMouseEvent) => {
		isDrawing.current = true;
		const pos = e.target?.getStage()?.getPointerPosition();
		if (pos) {
			const newLine = { points: [pos.x, pos.y], color, width, id };
			setLines([...lines, newLine]);
			setUndoStack([...undoStack, [...lines, newLine]]);
			setRedoStack([]);
		}
	};

	const handleMouseMove = (e: KonvaMouseEvent) => {
		if (!isDrawing.current) return;
		const stage = e.target?.getStage();
		const point = stage?.getPointerPosition();
		if (point) {
			const lastLine = lines[lines.length - 1];
			const newLine = {
				...lastLine,
				points: lastLine.points.concat([point.x, point.y]),
			};
			setLines(lines.slice(0, -1).concat(newLine));
			setUndoStack(
				undoStack.slice(0, -1).concat([lines.slice(0, -1).concat(newLine)])
			);
		}
	};

	const handleMouseUp = () => {
		isDrawing.current = false;
	};

	const handleUndo = () => {
		if (undoStack.length > 0) {
			const newUndoStack = undoStack.slice(0, -1);
			const newRedoStack = [lines, ...redoStack];
			setLines(newUndoStack[newUndoStack.length - 1] || []);
			setUndoStack(newUndoStack);
			setRedoStack(newRedoStack);
		}
	};

	const handleRedo = () => {
		if (redoStack.length > 0) {
			const newRedoStack = redoStack.slice(1);
			const newUndoStack = [...undoStack, redoStack[0]];
			setLines(redoStack[0]);
			setUndoStack(newUndoStack);
			setRedoStack(newRedoStack);
		}
	};

	const clearCanvas = () => {
		setLines([]);
		setUndoStack([]);
		setRedoStack([]);
	};

	return (
		<div
			ref={boardRef}
			className="border border-5 border-black bg-white"
			style={{
				height: "93%",
				width: "98%",
			}}>
			{/* <OtherCursor cursor={other} />*/}
			<div
				style={{
					width: "100%",
					padding: "0.4vw",
					display: "flex",
					alignItems: "center",
					backgroundColor: "lightgray",
					justifyContent: "center",
					gap: "3vw",
				}}>
				<Button
					variant="dark"
					onClick={handleUndo}>
					Undo
				</Button>
				<Button
					variant="dark"
					onClick={handleRedo}>
					Redo
				</Button>
				<Button
					variant="dark"
					onClick={clearCanvas}>
					Clear Canvas
				</Button>
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
				<Button
					variant="dark"
					onClick={saveAsImage}>
					Save as Image
				</Button>
				<Button
					variant="dark"
					onClick={saveAsPDF}>
					Save as PDF
				</Button>
			</div>
			<div style={{ position: "fixed" }}></div>
			<Stage
				width={stageWidth}
				height={stageHeight}
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
		</div>
	);
};

export default Canvas;
