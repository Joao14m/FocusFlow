import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const app_name = 'focusflow.ink';

function buildPath(route : string): string{
  if(process.env.NODE_ENV !== 'development'){
    return `https://${app_name}/${route}`;
  } else {
    return `http://localhost:5000/${route}`;
  }
}

const Login: React.FC = () => {
  // State to manage inputs with types
  const [username, setUsername] = useState<string>(""); // username is a string
  const [password, setPassword] = useState<string>(""); // password is a string
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // useNavigate hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      const response = await fetch(buildPath('api/login'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("Backend data: ", data);
  
      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem("token", data.token);
        console.log('Login successful: ', data);
        localStorage.setItem('ID', data.id);
        localStorage.setItem('name', data.name);
        localStorage.setItem('email', data.email);

        alert("Login successful!");
        navigate("/Homepage"); // Navigate to Homepage only if login is successful
      } else {
        setErrorMessage(data.error || "Invalid login credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <a className="login">Log in</a>
        <form onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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