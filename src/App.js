import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter
} from "react-router-dom";
import Home from './Home/Home'
import Admin from './Admin/Admin'
import Guest from './Guest/Guest'
import './index.css';




// import { io } from "socket.io-client";


function App() {
  return (
      <div className="App">
        <div className="flex items-center justify-center min-h-screen bg-app-1 bg-cover">
          <BrowserRouter>
            <Switch>
              <Route path="/admin/:name/:profile_image">
                <Admin></Admin>
              </Route>
              <Route path="/join/:group_id/:username/:profile_image">
                <Guest></Guest>
              </Route>
              <Route path="/">
                <Home></Home>
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
      </div>

  );
}

export default App;
