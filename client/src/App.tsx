import useAuth from "./hooks/useAuth";
import Protected from "./pages/Protected";
import Public from "./pages/Public";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import Board from "./pages/Board";

function App() {
	const [isLogin, user, logout] = useAuth();
	return (
		<>
			<NavBar
				user={user}
				logout={logout}
			/>
			<Routes>
				<Route
					path="/"
					element={isLogin ? <Protected /> : <Public />}
				/>
        <Route path="/board/:id"
        element={<Board/>}/>
			</Routes>
		</>
	);
}

export default App;
