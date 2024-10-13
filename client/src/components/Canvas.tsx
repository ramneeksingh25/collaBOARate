import { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { io } from "socket.io-client";
import OtherCursor from "./OtherCursor";
import { userContext } from "../contexts/userContext";
import { Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import { KonvaEventObject } from "konva/lib/Node";
import MessageForm from "./MesssageForm";
import { Link } from "react-router-dom";

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
	const stageRef = useRef(null);
	const [undoStack, setUndoStack] = useState<LineProps[][]>([]);
	const [redoStack, setRedoStack] = useState<LineProps[][]>([]);
	const [lines, setLines] = useState<LineProps[]>([]);
	const [color, setColor] = useState<string>("#000000");
	const [width, setWidth] = useState<number>(2);
	const isDrawing = useRef(false);
	const [stageWidth, setStageWidth] = useState<number>(100);
	const [stageHeight, setStageHeight] = useState<number>(100);
	const [otherCursor, setOtherCursor] = useState({
		x: 0,
		y: 0,
		id: id,
		user: userData?.name,
		color: color,
		width: width,
		visible: false,
	});
	const [message, setMessage] = useState("");
	const [newMessage, setNewMessage] = useState({
		message: "",
		user: "",
		id: "",
	});

	//Will run to set board dimesions
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
	}, [stageHeight, stageWidth]);

	//Will run when Joining Room
	useEffect(() => {
		socket.emit("join", { id: id, user: userData?.name });
	}, [id, userData?.name]);

	//to show real-time drawing and cursor
	useEffect(() => {
		socket.on("drawings", (data) => {
			setOtherCursor(data[0]);
			const newLines = data[1];
			console.log(newLines);
			setLines([...lines, newLines]);
			setUndoStack([...undoStack, [...lines, newLines]]);
			setRedoStack([]);
		});
	}, [lines, undoStack]);

	//messenging
	useEffect(() => {
		const messageObj = { message: message, user: userData?.name, id: id };
		socket.emit("message", messageObj);
	}, [message, userData?.name, id]);

	useEffect(() => {
		socket.on("messageRecieve", (data) => {
			setNewMessage(data);
			setTimeout(() => {
				setNewMessage({ user: "", message: "", id: "" });
			}, 10000);
		});
	}, [newMessage]);

	const saveAsImage = () => {
		const uri = stageRef.current ? stageRef.current.toDataURL() : null;
		const link = document.createElement("a");
		link.download = "whiteboard.png";
		link.href = uri || "";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const saveAsPDF = () => {
		const uri = stageRef.current ? stageRef.current.toDataURL() : null;
		const pdf = new jsPDF();
		pdf.addImage(uri || "", "PNG", 0, 0, stageWidth, stageHeight);
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
			socket.emit("drawing", [
				{
					id: id,
					x: e.evt.x,
					y: e.evt.y,
					user: userData?.name,
					color: color,
					width: width,
					visible: true,
				},
				newLine,
			]);
			setLines(lines.slice(0, -1).concat(newLine));
			setUndoStack(
				undoStack.slice(0, -1).concat([lines.slice(0, -1).concat(newLine)])
			);
		}
	};

	const handleMouseUp = () => {
		isDrawing.current = false;
		setOtherCursor({ ...otherCursor, visible: false });
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
			{otherCursor.visible && <OtherCursor cursor={otherCursor} />}
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
				{newMessage.message != "" && (
					<div
						style={{
							position: "absolute",
							backgroundColor: "white",
							padding: "3px",
							borderRadius: "10px",
							bottom: 0,
						}}>
						<span>Message from {newMessage.user} :</span>
						<span className="fs-5">{newMessage.message}</span>
					</div>
				)}
				<Link to="/">
					<Button
						variant="dark"
						>
						Home
					</Button>
				</Link>
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
						setWidth(parseInt(e.target.value)/10);
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
				<MessageForm setMessage={setMessage} />
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
