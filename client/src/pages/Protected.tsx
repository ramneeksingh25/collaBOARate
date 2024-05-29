import { Container } from "react-bootstrap";
import SessionCard from "../components/SessionCard";

const Protected = () => {  
	return (
		<Container
			// fluid
			className="d-flex justify-content-center align-items-center"
			style={{ height: "80vh" }}>
			<SessionCard func="Join" />
			<SessionCard func="Create" />
		</Container>
	);
};

export default Protected;
