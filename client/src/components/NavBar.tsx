import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function NavBar({user,logout}) {
  return (
    <Navbar className="bg-dark-subtle border border-bottom-4 border-black ">
      <Container>
        <Navbar.Brand href="/" className=' fw-bolder fs-2 border border-dark border-3 px-3 rounded-5 bg-white'>CollaBOARate</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <span className='text-decoration-underline'>{user?.email}</span>
          </Navbar.Text>
          <Button variant='dark' className='ms-3 px-3 fs-5 border border-1 border-white' onClick={logout}>Logout</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;