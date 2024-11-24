import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password

  const navigate = useNavigate();

  const handleSubmit = (e) => {
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
              onChange={(e) => setFirstName(e.target.value)}
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
              value={confirmPassword} // Controlled input for confirm password
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span>Confirm Password</span>
          </div>

          <div className="button-group-sign">
            <button className="enter" type="submit">
              Sign up
            </button>
            <button className="signup" type="button" onClick={() => navigate("/login")}>Have an account?</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
