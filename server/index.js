import express from 'express';
import http from "http";
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

io.on('connection',(socket)=>{
    console.log("User Connected ",socket.id);
    socket.on('join_room',(data)=>{
        socket.join(data)
        console.log("joined room ",data);
    })
    socket.on("cursor_moved",(data)=>{
        socket.to(data.id).emit("other",data);
    })
})

server.listen(2000,()=>{
    console.log("Server listening on ",2000);
})
