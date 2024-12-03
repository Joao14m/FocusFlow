import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import "../styles/homeP.css";
import { time } from "console";
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
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [taskTime, setTaskTime] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<string>("");

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setTaskCategory("");
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("Pending");
    // setTaskDates("");
    setTaskTime("");
    setTaskPriority("");
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
          <p>Welcome Home.</p>
          <h4>{curName ? curName : "Guest"}</h4>
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
                className="menu-link" id="add-task-button"
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
          <a className="logout-btn" href="/Homepage/login">
            <img className="logout-img" src="/img/log-out.svg" alt="logout" />
          </a>
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

// {
//   <div className="sideBar">
//   <div className="welcomeUser">
//     Welcome {curName ? curName : "Guest"}!{" "}
//     {/* shoutout joe and jeaan carlos :goat:/*/}
//   </div>
//   <Link to="/homepage/this-week" className="box" id="this-week">
//     This Week
//   </Link>
//   <Link to="/homepage/this-month" className="box" id="this-month">
//     This Month
//   </Link>
//   <Link to="/homepage/todo-list" className="box" id="todo-list">
//     To-Do List
//   </Link>
//   <Link to="/homepage/todo-list" className="box" id="add-task">
//     ADD TASK
//   </Link>
//   <Link to="/homepage/logout" className="box" id="log-out">
//     Logout
//   </Link>
// </div>
// }

{
  /* {isModalOpen && (
  <div className="modal">
  <div className="modal-content">
  <h2>Add Task</h2>
  <label>
  Category:
  <input
  type="text"
  value={taskCategory}
  onChange={(e) => setTaskCategory(e.target.value)}
  />
  </label>
  <label>
                Title:
                <input
                  type="text"

                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </label>
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
              <label>
                Dates:
                <input
                  type="date"
                  value={taskDates}
                  onChange={(e) => setTaskDates(e.target.value)}
                />
              </label>
              <label>
                Time:
                <input
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                />
              </label>
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
              <div className="modal-buttons">
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={handleCloseModal}>Cancel</button>
              </div>
            </div>
          </div> */
}
