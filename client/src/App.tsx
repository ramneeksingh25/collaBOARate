import useAuth from "./hooks/useAuth";
import Protected from "./pages/Protected";
import Public from "./pages/Public";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Board from "./pages/Board";
import { userContext } from "./contexts/userContext.ts";

function App() {
	const [isLogin, user, logout] = useAuth();
	return (
		<>
				<userContext.Provider value={user}>
			<Routes>
				<Route
					path="/"
					element={
						isLogin ? (
							<Protected
								user={user}
								logout={logout}
							/>
						) : (
							<Public />
						)
					}
				/>
				<Route
					path="/board/:id"
					element={<Board />}
				/>
			</Routes>
			</userContext.Provider>
		</>
	);
}

export default App;
