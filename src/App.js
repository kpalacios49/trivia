import React, { useEffect, useState } from 'react';
import './App.css';
import {
  useHistory,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";
import Home from './Home/Home'
import Admin from './Admin/Admin'
import Guest from './Guest/Guest'



// import { io } from "socket.io-client";


function App() {
  const history = useHistory();
  // const [users, setUsers] = useState([]);


  // const URL = "http://localhost:8080";
  // const socket = io(URL, { autoConnect: false });


  const userLogIn = (event) => {
    // event.preventDefault();
    // socket.auth = {
    //   "username": event.target.username.value,
    //   "group": event.target.group.value
    // }
    // socket.connect();
  }

  useEffect(() => {
    // socket.on('usersConnected1', (users) => {
    //   console.log(users)
    //   setUsers(users)
    // })

  }, [])


  function handleClick() {
    history.push("/about");
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/admin/:name">
            <Admin></Admin>
          </Route>
          <Route path="/join/:group_id/:username">
            <Guest></Guest>
          </Route>
          <Route path="/">
            <Home></Home>
          </Route>
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
