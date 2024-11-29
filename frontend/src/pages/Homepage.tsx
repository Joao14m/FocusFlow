import React, {useState} from "react";
// import { useNavigate } from "react-router-dom";

const app_name = 'focusflow.ink';

function buildPath(route : string): string{
  if(process.env.NODE_ENV !== 'development'){
    return `https://${app_name}/${route}`;
  } else {
    return `http://localhost:5000/${route}`;
  }
}
import React, { useState } from "react";
import { Link, Outlet } from 'react-router-dom';
import '../styles/homeP.css';


const Homepage: React.FC = () => {

    const curName = localStorage.getItem('name');

  return (
    <div className="homepage">
        {/* top menu */}
      <div className="sideBar">
        <div className="welcomeUser">
        Welcome {curName ? curName : 'Guest'}!  {/* shoutout joe and jeaan carlos :goat:/*/}
        </div> 
        <Link to="/homepage/this-week" className="box" id='this-week'>This Week</Link>
        <Link to="/homepage/this-month" className="box" id='this-month'>This Month</Link>
        <Link to="/homepage/todo-list" className="box" id='todo-list'>To-Do List</Link>
        <Link to="/homepage/todo-list" className="box" id='add-task'>ADD TASK</Link>
        <Link to="/homepage/logout" className="box" id='log-out'>Logout</Link>
      </div>
      <div className="content">
        {/* Render child routes */}
        <Outlet />
      </div>
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [taskCategory, setTaskCategory] = useState<string>("");
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [taskDescription, setTaskDescription] = useState<string>("");
    const [taskStatus, setTaskStatus] = useState<string>("Pending");
    const [taskDates, setTaskDates] = useState<string>("");
    const [taskTime, setTaskTime] = useState<string>("");
    const [taskPriority, setTaskPriority] = useState<string>("Medium");

    const handleAddTask = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTaskCategory("");
        setTaskTitle("");
        setTaskDescription("");
        setTaskStatus("Pending");
        setTaskDates("");
        setTaskTime("");
        setTaskPriority("Medium");
    }

    const handleSubmit = async () => {
        const userId = localStorage.getItem("user_id"); // Assuming user_id is stored in localStorage after login
        console.log("Retrieved user_id from localStorage:", userId);
        if (!userId) {
            alert("User not logged in. Please log in first.");
            return;
        }

        const task = {
            user_id: userId,
            category: taskCategory,
            title : taskTitle,
            description: taskDescription,
            priority: taskPriority,
            dates: taskDates,
            time: taskTime,
            status: taskStatus,  
        };

        try {
            const response = await fetch(buildPath('api/tasks'),{
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(task),
            });

            const data = await response.json();

            if (response.ok){
                alert("Task added successfully!");
                console.log("Task added:", data.task);
                handleCloseModal()
            } else {
                alert(data.error || "Error adding task");
            }
        } catch (error) {
            console.log("Error adding task:", error);
            alert("Error while adding task");
        }
    }

    return (
    <div className="containerHome">
        <div className="box" id="this-week">
            <button>This Week</button>
        </div> 
        <div className="box" id="this-month">
            <button>This Month</button>
        </div>
        <div className="box" id="todo-list">
            <button>To-Do List</button>
        </div>
        <div className="box" id="add-task">
            <button onClick={handleAddTask}>Add Task</button>
        </div>

        {isModalOpen && (
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
          </div>
        )}
    </div>
  );
};

export default Homepage;
