import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Auth0Provider
			domain="dev-84ied8ck2bi4382u.us.auth0.com"
			clientId="NvEKxXT9OGQRJas5sXzaIPEHQfUXeQfU"
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Auth0Provider>
	</React.StrictMode>
);
