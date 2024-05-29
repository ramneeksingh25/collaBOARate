

const OtherCursor = ({cursor}) => {
  return (
    <div style={{backgroundColor:"red",position:"absolute",height:"10px",width:"10px",top:cursor.y,left:cursor.x,borderRadius:"100%"}}>
        <div style={{position:"relative",top:"10px",left:"10px"}}>
            {cursor.userData}
        </div>
    </div>
  )
}

export default OtherCursor