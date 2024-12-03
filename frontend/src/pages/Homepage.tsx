import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "../styles/homeP.css";
// import { time } from "console";
import "../styles/newNavBar.css";
import "../styles/modal.css";

const app_name = "focusflow.ink";

function buildPath(route: string): string {
  if (process.env.NODE_ENV !== "development") {
    return `https://${app_name}/${route}`;
  } else {
    return `http://localhost:5000/${route}`;
  }
}

const Homepage: React.FC = () => {
  const curName = localStorage.getItem("name");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [taskCategory, setTaskCategory] = useState<string>("");
  // const [taskDates, setTaskDates] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<string>("Pending"); //incase the user doesnt select a status
  const [taskTime, setTaskTime] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<string>("High"); //incase the user doesnt select a  prio

  const handleAddTask = () => {
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM

    setTaskTime(formattedDateTime); // Initialize with today's date and time
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setTaskCategory("");
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("");
    // setTaskDates("");
    setTaskTime("");
    setTaskPriority("High");
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("user_id"); // Assuming user_id is stored in localStorage after login
    console.log("Retrieved user_id from localStorage:", userId);
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    console.log("Priority is" + taskPriority);
    const task = {
      user_id: userId,
      // category: taskCategory,
      title: taskTitle,
      description: taskDescription,
      priorityLevel: taskPriority,
      // dates: taskDates,
      time: taskTime,
      status: taskStatus,
    };

    try {
      const response = await fetch(buildPath("api/tasks"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Task added successfully!");
        console.log("Task added:", data.task);
        handleCloseModal();
      } else {
        alert(data.error || "Error adding task");
      }
    } catch (error) {
      console.log("Error adding task:", error);
      alert("Error while adding task");
    }
  };

  return (
    <div className="homepage">
      {/* top menu */}
      {location.pathname === "/Homepage" && !isModalOpen && (
        <>
           {localStorage.getItem("user_id") ? (
        <>
          <p>Welcome Home.</p>
          <h4>{curName ? curName : "Guest"}</h4>
      </>
    ) : (
      <h4>Invalid User</h4>
    )}
        </>
        // this makes is so that the welcome home user only shows in the home
      )}
      <link rel="stylesheet" href="./assets/styles/style.css" />
      <link rel="stylesheet" href="./assets/styles/homeP.css" />

      <script src="../styles/newNavBar.js" defer></script>
      <nav className="navbar">
        <div className="navbar-container">
          <ul className="menu-list">
            <li className="menu-item">
              <a className="menu-link" href="/Homepage">
                <img
                  src="/img/dashboard.svg"
                  title="Dashboard"
                  className="menu-icon"
                  alt="grid"
                />
                Home
              </a>
            </li>

            <li className="menu-item">
              <a className="menu-link" href="/Homepage/this-week">
                <img
                  src="/img/week.svg"
                  title="Ajustes"
                  className="menu-icon"
                  alt="settings"
                />
                This Week
              </a>
            </li>

            <li className="menu-item">
              <a className="menu-link" href="/Homepage/this-month">
                <img
                  src="/img/calendar.svg"
                  title="Ajustes"
                  className="menu-icon"
                  alt="settings"
                />
                This Month
              </a>
            </li>

            <li className="menu-item">
              <a className="menu-link" href="/Homepage/todo-list">
                <img
                  src="/img/task.svg"
                  title="Ajustes"
                  className="menu-icon"
                  alt="settings"
                />
                To-Do List
              </a>
            </li>

            <li className="menu-item">
              <button
                className="menu-link"
                id="add-task-button"
                onClick={handleAddTask}
              >
                <img
                  src="/img/task.svg"
                  title="Add Task"
                  className="menu-icon"
                  alt="task"
                />
                Add Task
              </button>
            </li>
          </ul>
        </div>

        <div className="user-container">
  <button
    className="logout-btn"
    onClick={() => {
      // Clear cookies
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      // Clear localStorage/sessionStorage if needed
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login page
      window.location.href = "/Homepage/login";
    }}
  >
    <img className="logout-img" src="/img/log-out.svg" alt="logout" />
  </button>
</div>

      </nav>
      <div className="content">
        {/* Render child routes */}

        {isModalOpen && (
          <div className="modal">
            <div className="modal-overlay" onClick={handleCloseModal}></div>
            <div className="modal-content">
              <div className="inputSpace">
                <label>
                  Title:
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="inputSpace">
                <label>
                  Description:
                  <input
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </label>
              </div>
              <div className="inputSpace">

              <label>
                Date:
                <input
                  type="datetime-local" // Allows users to pick a date and time
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  />
              </label>
                  </div>
              <div className="inputSpace">
                <div className="prioStatusGroup">
                  <label>
                    Priority:
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="inputSpace">
                <div className="prioStatusGroup">
                  <label>
                    Status:
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="modal-buttons">
                <button id="Submit" onClick={handleSubmit}>
                  Submit
                </button>
                <button id="Cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
};
export default Homepage;
