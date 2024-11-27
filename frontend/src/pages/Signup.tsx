import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false); // Modal state
  const [modalMessage, setModalMessage] = useState<string>(""); // Modal message

  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match!");
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch("http://54.225.24.146:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMessage("Signup successful! Please log in.");
        setShowModal(true);

        // Redirect after a short delay
        setTimeout(() => {
          setShowModal(false);
          navigate("/login");
        }, 3000);
      } else {
        setModalMessage(data.error || "Signup failed. Please try again.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setModalMessage("An error occurred. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="login">Sign up</h1>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              type="email"
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
              className="have-account"
              type="button"
              onClick={() => navigate("/login")}
            >
              Have an account? Log in
            </button>
          </div>
        </form>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
