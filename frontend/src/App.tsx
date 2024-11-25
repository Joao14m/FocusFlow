import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        {/* Add other routes here, such as a login page */}
        <Route path="/login" element={<div>Login Page (to be implemented)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
