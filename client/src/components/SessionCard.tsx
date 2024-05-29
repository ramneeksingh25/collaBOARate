import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

type SessionCardProps = {
  func: string
};

const SessionCard: React.FC<SessionCardProps> = ({func}) => {
  const navigate = useNavigate();
  const [title,setTitle]= useState("");
  const [ID,setID]= useState("");
  return (
    <Row className="justify-content-center align-items-center p-5">
        <Col className="bg-dark-subtle p-5 rounded-4 border border-dark border-3">
          <Form className='d-flex flex-column align-items-center'>
            <h2 className=" fw-bold mb-3 text-decoration-underline">{func} Session</h2>
            <Form.Group controlId="JoinRoom" className="d-flex flex-column gap-0 m-3">
              <Form.Control type="text" placeholder={`Enter Room ${func=="Join"?"ID":"Title"}`} className="border border-dark border-3 rounded-bottom-0 rounded-top-4" onChange={(e)=>{
                func!="Join"?setTitle(e.target.value):setID(e.target.value);
                }}/>
              <Button variant="dark" className='rounded-top-0 rounded-bottom-4' onClick={()=>{
                if (func=="Join") {
                  //join room    
                  console.log(ID);
                  navigate(`/board/${ID}`);
                }
                else{
                  //create new room
                  console.log(title);
                }
              }}>
                {func} Room
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
  )
}

export default SessionCard