const { group } = require('console');
const express = require('express');
const app = express();
const http = require('http').Server(app);


const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})



// app.use(express.static)

http.listen(8080, () => console.log("server ON 8080"))

let sum = 0

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  const group = socket.handshake.auth.group;

  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.group = group;
  next();
});

const users = [];


io.on('connection', (socket) => {
  console.log("Usuario conecntado : " + socket.id)


  users.push({
    userID: socket.id,
    username: socket.username,
    group: socket.group
  });
  console.log(users)


  const group = 1;

  io.emit(`usersConnected${group}`, users)


  // socket.on("connect", () => {
  //     console.log("conectado")
  //     users.forEach((user) => {
  //       if (user.self) {
  //         user.connected = true;
  //       }
  //     });
  //   });

  socket.on("disconnect", () => {
    console.log("desconectado")
    console.log(socket.id)
    const index = users.findIndex(u => u.userID == socket.id)
    if (index != -1) {
      users.splice(index, 1)
      console.log(users)
      io.emit(`usersConnected${group}`, users)

    }
  });
})

