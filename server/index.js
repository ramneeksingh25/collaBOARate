import express from 'express';
import http from "http";
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
});

io.on('connection',(socket)=>{
    var id = "";
    console.log("User Connected ",socket.id);
    // socket.on('join_room',(data)=>{
    //     socket.join(data.id)
    //     id = data.id
    //     socket.to(data.id).emit("joined",data.lines)
    // })
    // socket.on("cursor_moved",(data)=>{
    //     socket.to(data.id).emit("other",data);
    // })
    // socket.on("draw",(data)=>{
    //     socket.to(id).emit("otherDraw",data);
    // })
})

server.listen(2000,()=>{
    console.log("Server listening on ",2000);
})
