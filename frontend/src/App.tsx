import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
// import Dashboard from './dashboard';
import './styles/LogSign.css';
// import Tasks from './Tasks';
// import './styles/checkTask.css';
import Homepage from './pages/Homepage';
import './styles/homeP.css';
// import './styles/menuIcon.css';
// import './styles/sideMenu.css';
// import './styles/homePG.css';

// TypeScript types for the App component (optional but helpful for larger projects)
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Homepage" element={<Homepage />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/Tasks" element={<Tasks />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
