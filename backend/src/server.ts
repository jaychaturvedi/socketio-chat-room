import express from "express";
const app = express();
const server = require("http").createServer(app);
import { onMessage, onOwnerChange, onUserExit, getRoom } from "./utils/room"
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket: any) => {

  socket.on("getRoom", () => {
    io.emit("onGetRoom", getRoom())
  })
  socket.join("Public");

  socket.on("claimRoom", (ownerAvatar: string) => {
    const room = onOwnerChange(socket.id, ownerAvatar)
    io.in("Public").emit('onOwnerChange',{
      owner: room.owner,
      ownerAvatar:room.ownerAvatar
    });
  })

  socket.on("sendMessage", (message: string) => {
    const room = onMessage(message, socket.id)
    io.in("Public").emit('onMessage', room.messages[room.messages.length-1])
  })

  socket.on('disconnect', () => {
    const room = onUserExit(socket.id)
    io.in("Public").emit('onOwnerChange', room.owner);
  })
})


server.listen(5000, () => {
  console.log("Backend Server is running on http://localhost:5000");
});