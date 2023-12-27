
import { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";




export default   function GET(req,res) {
  
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io
    io.on('connection',(socket)=>{
      console.log("Server is connected !")
  })
  }
  res.end()
}

