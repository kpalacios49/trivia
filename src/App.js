import React, { useEffect, useState } from 'react';
import './App.css';

import { io } from "socket.io-client";


function App() {
  const [users, setUsers] = useState([]);
  
  
  const URL = "http://localhost:8080";
  const socket = io(URL, { autoConnect: false });


  const userLogIn = (event) => {
    event.preventDefault();
    // console.log("You are submitting ");
    // console.log()

    socket.auth = { 
      "username" : event.target.username.value,
      "group" : event.target.group.value
     }
    socket.connect();
  }

  useEffect(() => {


    socket.on('usersConnected1', (users) => {
      console.log(users)
      setUsers(users)
    })

  }, [])
  

  return (
    <div className="App">
      <header className="App-header">
        { users.map(user =>  (
          <div>
        <span>{user.username}</span>
        <span>{user.group}</span>
          </div>

        
        )) }
        <form onSubmit={userLogIn}>
        <input name="username" placeholder="username"/>
        <input name="group" placeholder="group"/>
        <button >Enviar</button>

      </form>
      </header>

    </div>
  );
}

export default App;
