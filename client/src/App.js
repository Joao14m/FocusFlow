import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './dashboard';
import LogSign from './styles/LogSign.css'
import Tasks from './Tasks';
import checkTask from './styles/checkTask.css'
import Homepage from './Homepage'
import menuIcon from "./styles/menuIcon.css";
import sideMenu from "./styles/sideMenu.css"
import homePG from "./styles/homePG.css"

// import menuIcon from './public/menuIcon.png';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Tasks" element={<Tasks />} />
          <Route path="/Homepage" element={<Homepage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
