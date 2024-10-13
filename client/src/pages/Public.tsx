import { useAuth0 } from "@auth0/auth0-react";
import { Container, Navbar } from "react-bootstrap";
import Button from "react-bootstrap/Button";

const Public = () => {
	const { loginWithRedirect, user } = useAuth0();
	return (
		<>
			<Navbar
          style={{height:"9vh",position:"absolute",width:"100%",padding:"6vh"}}
          >
				<Container>
					<Navbar.Brand
						href="/"
						className=" fw-bolder fs-2 px-3 border border-dark border-3 rounded-5 bg-white"
            >
						<img
							src="./public/logo.png"
							width={70}
              />{" "}
						collaBOARate
					</Navbar.Brand>
					<Navbar.Collapse className="justify-content-end">
						<Navbar.Text>
							<span className="text-decoration-underline">{user?.email}</span>
						</Navbar.Text>
						<Button
							variant="dark"
							onClick={() => loginWithRedirect({})}>
							Sign In
						</Button>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<div
				className="d-flex justify-content-between align-items-center"
				style={{ height: "100vh"}}>
				<div
					style={{ height: "60%", width: "40%",paddingLeft:"2vh",}}
					className="d-flex flex-column justify-content-around align-items-center">
					<div className="d-flex flex-column justify-content-around">
						<span>
							<h1>Connect and Create</h1>
							<p>
								collaBOARate is a real-time collaborative whiteboard platform
								designed to enhance teamwork. Create, share, and innovate
								effortlessly with intuitive tools that transform ideas into
								visuals, regardless of distance
							</p>
						</span>
						<Button
							variant="dark"
							onClick={() => loginWithRedirect({})}>
							Get Started
						</Button>
					</div>
					<div>
						Made with &#128420; by{" "}
						<a
							className="text-dark"
							href="https://github.com/ramneeksingh25">
							Ramneek Singh
						</a>
					</div>
				</div>
				<div
					id="logo"
					style={{
						backgroundImage: `url(/image.png)`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						width: "50%",
						height: "100%",
						position: "relative",
					}}>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundImage:
								"linear-gradient(to right, rgba(255, 255, 255, 1),rgba(255,255,255,0.0), rgba(255, 255, 255, 0))",
						}}></div>
				</div>
			</div>
		</>
	);
};

export default Public;
