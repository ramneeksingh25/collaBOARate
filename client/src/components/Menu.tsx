import { useState } from "react";
import { Button } from "react-bootstrap";

const Menu = ({ id }: { id: string | undefined }) => {
	const [isVisible, setIsVisible] = useState(false);
    return (
        <Button variant="dark" className="position-absolute end-0" onClick={()=>{setIsVisible(!isVisible)}}>{isVisible?`${id}`:"Show ID"}</Button>
    )
};

export default Menu;
