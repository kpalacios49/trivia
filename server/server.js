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
  const profile_image = socket.handshake.auth.profile_image;


  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.group_id = group_id;
  socket.is_admin = is_admin;
  socket.profile_image = profile_image;

  next();
});

// const users = [];


io.on('connection', (socket) => {

  console.log("Usuario conectado : " + socket.id)

  socket.join(socket.group_id)

  if (socket.is_admin) {
    admin.database().ref(`games/${socket.group_id}`).set(
      {
        state: "waiting"
      }
    )
  }


  admin.database().ref(`groups/${socket.group_id}/${socket.id}`).set(
    {
      username: socket.username,
      profile_image: socket.profile_image,
      is_admin: socket.is_admin
    }
  );


  showMembers(socket.group_id)



  socket.on('triviaQuestionsAPI', (trivia) => {
    console.log(trivia)
    admin.database().ref(`games/${socket.group_id}`).update(
      {
        trivia: trivia
      }
    )
  })

  socket.on('startTrivia', ({ state }) => {
    admin.database().ref(`games/${socket.group_id}`).update(
      {
        state: state
      }
    )
    let game = admin.database().ref(`games/${socket.group_id}`);
    game.once('value', (snapshot) => {
      // return io.emit(`gameStarted${socket.group_id}`, snapshot.val())
      return io.to(socket.group_id).emit(`gameStarted`, snapshot.val());

    })

  })

  socket.on('resultAnswers', (trivia) => {
    admin.database().ref(`results/${socket.group_id}/${socket.id}`).set({
      score: 500,
      responses: trivia
    }
    );
  })

  socket.on("disconnect", () => {
    console.log("Usuario desconectado : " + socket.id)
    admin.database().ref(`groups/${socket.group_id}/${socket.id}`).remove();

    showMembers(socket.group_id)
  });
})


const showMembers = (group_id) => {
  let members = admin.database().ref(`groups/${group_id}`);
  members.once('value', (snapshot) => {
    return io.to(group_id).emit(`membersConnected`, snapshot.val());
    // return io.emit(`membersConnected${group_id}`, snapshot.val())
  })
}
