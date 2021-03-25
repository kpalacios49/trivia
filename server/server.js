const { group } = require('console');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const admin = require("firebase-admin");


const serviceAccount = require("../trivia-aeccd-firebase-adminsdk-khbrc-3f8aa20754.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://trivia-aeccd-default-rtdb.firebaseio.com/'
});

var database = admin.database();

// console.log(database)



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
  const group_id = socket.handshake.auth.group_id;
  const is_admin = !!socket.handshake.auth.is_admin;


  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.group_id = group_id;
  socket.is_admin = is_admin;

  next();
});

// const users = [];


io.on('connection', (socket) => {
  console.log("Usuario conecntado : " + socket.id)


  admin.database().ref(`groups/${socket.group_id}/${socket.id}`).set(
    {
      username: socket.username,
      is_admin: socket.is_admin
    }
  );

  showMembers(socket.group_id)

  // var members = admin.database().ref(`groups/${socket.group_id}`);
  // members.on('value', (snapshot) => {
  //   const members = snapshot.val();
  //   // console.log(data)
  //   io.emit(`membersConnected${socket.group_id}`, members)

  // });




  socket.on("disconnect", () => {
    console.log("desconectado")
    console.log(socket.id)
    admin.database().ref(`groups/${socket.group_id}/${socket.id}`).remove();

    showMembers(socket.group_id)


  });
})


const showMembers = (group_id) => {
  var members = admin.database().ref(`groups/${group_id}`);
  members.on('value', (snapshot) => {
    const members = snapshot.val();
    // console.log(data)
    io.emit(`membersConnected${group_id}`, members)
  });
}
