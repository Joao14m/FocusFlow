import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LogSign.css"; 

const Signup: React.FC = () => {
  const [name, setName] = useState<string>(""); // Define state type as string
  const [username, setUsername] = useState<string>(""); 
  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>(""); 
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Proceed with signup logic (e.g., send data to the backend)
    console.log("Signup Submitted:", { name, username, email, password });
  };

  return (
    <div className="container">
      <div className="card">
        <a className="login">Sign up</a>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)} // Updated to setName
            />
            <span className="user">Full Name</span>
          </div>

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
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="user">Email</span>
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

          <div className="inputBox">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span>Confirm Password</span>
          </div>

          <div className="button-group-sign">
            <button className="enter" type="submit">
              Sign up
            </button>
            <button
              className="signup"
              type="button"
              onClick={() => navigate("/login")}
            >
              Have an account?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;