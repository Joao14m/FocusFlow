import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  // State to manage inputs with types
  const [username, setUsername] = useState<string>(""); // username is a string
  const [password, setPassword] = useState<string>(""); // password is a string

  // useNavigate hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault(); // Prevent page reload
    console.log("Login Submitted:", { username, password });
    // TODO: Send username and password to the backend
  };

  return (
    <div className="container">
      <div className="card">
        <a className="login">Log in</a>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="user">Username</span>
          </div>

          <div className="inputBox">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
          </div>

          <div className="button-group">
            <button
              className="enter"
              type="button"
              onClick={() => navigate("/Homepage")}
            >
              Login
            </button>
            <button
              className="signup"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
