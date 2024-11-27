import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  // State to manage inputs with types
  const [username, setUsername] = useState<string>(""); // username is a string
  const [password, setPassword] = useState<string>(""); // password is a string

  // useNavigate hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://54.225.24.146/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/Homepage"); // Navigate to Homepage only if login is successful
      } else {
        alert(data.error || "Invalid login credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("An error occurred. Please try again later.");
    }
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
              type="submit" // Submit the form and validate the login
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