import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function Login() {

   // State to manage inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // useNavigate hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log('Login Submitted:', { username, password });
    //  send  username and password to backend here, good luck jean and joao, and probably me too lol
  };

  return (
    <div className="container">
      <div class="card">
        <a class="login">Log in</a>
        <form onSubmit={handleSubmit}>
          
        <div class="inputBox">
          <input type="text" required value={username} 
          onChange={(e) => setUsername(e.target.value)} ></input>
          <span class="user">Username</span>
        </div>
          
        <div className="inputBox">
            <input
              type="password"
              required
              value={password} // Controlled input
              onChange={(e) => setPassword(e.target.value)} // Update state
              />
            <span>Password</span>
          </div>
          <div className="button-group">
            <button className="enter" type="button" onClick={() => navigate('/Homepage')}> Login </button>
            <button
              className="signup"
              type="button"
              onClick={() => navigate('/signup')} // Navigate to Signup
            >
              Signup
            </button>
          </div>
          </form>
            
      </div>
    </div>
  );
}

export default Login;
