import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [name, setName] = useState<string>(""); // Full Name
  const [username, setUsername] = useState<string>(""); // Username
  const [email, setEmail] = useState<string>(""); // Email
  const [password, setPassword] = useState<string>(""); // Password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Confirm Password

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Make API call to backend
      const response = await fetch("http://54.225.24.146:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (response.ok) {
        alert("Signup successful! Please log in.");
        navigate("/login");
      } else {
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="login">Sign up</h1>
        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="inputBox">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="user">Full Name</span>
          </div>

          {/* Username Input */}
          <div className="inputBox">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="user">Username</span>
          </div>

          {/* Email Input */}
          <div className="inputBox">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="user">Email</span>
          </div>

          {/* Password Input */}
          <div className="inputBox">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
          </div>

          {/* Confirm Password Input */}
          <div className="inputBox">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span>Confirm Password</span>
          </div>

          {/* Buttons */}
          <div className="button-group-sign">
            <button className="enter" type="submit">
              Sign up
            </button>
            <button
              className="have-account"
              type="button"
              onClick={() => navigate("/login")}
            >
              Have an account? Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
