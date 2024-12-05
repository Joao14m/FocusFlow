import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import ThisWeek from './pages/ThisWeek';
import ThisMonth from './pages/ThisMonth';
import ToDo from './pages/ToDo';
import './styles/thisWeekAnimation.css'
import './styles/tableDo.css';
import './styles/LogSign.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root path to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Login and Signup routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Homepage layout for other pages */}
          <Route path="/homepage" element={<Homepage />}>
            <Route path="this-week" element={<ThisWeek />} />
            <Route path="this-month" element={<ThisMonth />} />
            <Route path="todo-list" element={<ToDo />} />
          </Route>

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
