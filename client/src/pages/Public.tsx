
import { useAuth0 } from '@auth0/auth0-react';
import { Card, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import NavBar from '../components/NavBar';

const Public = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <>
      <NavBar	/>
      <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh",backgroundColor:"grey" }}>
        <Card className="w-50 p-5 text-center">
          <Card.Header>Welcome to the Board Game Room!</Card.Header>
          <Card.Body>
            <h2>Please Sign In:</h2>
            <Button variant="primary" onClick={() => loginWithRedirect({})}>
              Sign In with Google
            </Button>
            <br/>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default Public