import { Container } from "react-bootstrap";
import SessionCard from "../components/SessionCard";
import NavBar from "../components/NavBar";
import { KeycloakTokenParsed } from "keycloak-js";

interface ProtectedProps {
	user: KeycloakTokenParsed|undefined;
	logout: () => void;
  }

const Protected = ({user,logout}:ProtectedProps) => {  
	return (
		<>
			<NavBar
				user={user}
				logout={logout}
			/>
				<Container
					// fluid
					className="d-flex justify-content-center align-items-center"
					style={{ height: "80vh" }}>
					<SessionCard func="Join" />
					<SessionCard func="Create" />
				</Container>
		</>
		
	);
};

export default Protected;
