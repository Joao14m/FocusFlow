import React, { useEffect, useState } from "react";
import "../styles/sideMenu.css";
import "../styles/weeklyCalendar.css";
import { title } from "process";

const app_name = "focusflow.ink";

function buildPath(route: string): string {
  if (process.env.NODE_ENV !== "development") {
    return `https://${app_name}/${route}`;
  } else {
    return `http://localhost:5000/${route}`;
  }
}

interface Task {
  _id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priorityLevel: number;
  daysOfTheWeek: string[];
  time: string;
}

const ThisWeek: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // View Tasks modal
  const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false); // Add Task modal
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksForDate, setTasksForDate] = useState<Task[]>([]);

  // Task addition modal states
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<string>("High");
  const [taskStatus, setTaskStatus] = useState<string>("Pending");
  const [taskTime, setTaskTime] = useState<string>("");

  //Task additions for edit mode
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskPriority(task.priorityLevel.toString()); // Default or fetched priority (modify if your data structure includes it)
    setTaskStatus(task.status);
    setTaskTime(new Date(task.time).toISOString().slice(0, 16)); // Convert time to suitable format
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const now = new Date();
    setWeek(now);
    fetchTasks();
  }, []);

  const setWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    setStartDate(startOfWeek);
    setCurrentWeek(weekDates);
  };

  const fetchTasks = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const response = await fetch(buildPath(`api/tasks?user_id=${userId}`));
      const data = await response.json();
      if (response.ok) {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) => new Date(task.time).toDateString() === date.toDateString()
    );
  };

  const handleBoxClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);

    const tasksForSelectedDate = tasks.filter(
      (task) => new Date(task.time).toDateString() === date.toDateString()
    );
    setTasksForDate(tasksForSelectedDate);
  };

  const handleAddTaskClick = () => {
    setIsModalOpen(false); // Close the "View Tasks" modal
    setIsModalOpen2(true); // Open the "Add Task" modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTasksForDate([]);
    setSelectedDate(null);
  };

  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("High");
    setTaskStatus("Pending");
    setTaskTime("");
  };

  const handleAddTask = async () => {
    const userId = localStorage.getItem("user_id"); // links tasks with the current user logged in
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    const task = {
      user_id: userId,
      title: taskTitle,
      description: taskDescription,
      priorityLevel: taskPriority,
      time: taskTime || selectedDate?.toISOString(),
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
        fetchTasks();
        // Refresh tasks
        setTaskTitle("");
        setTaskDescription("");
        setTaskPriority("High");
        setTaskStatus("Pending");
        setTaskTime("");
        handleCloseModal2();
      } else {
        alert(data.error || "Error adding task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Error while adding task");
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(buildPath(`api/tasks/${taskId}`), {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
        setTasksForDate((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        ); // Update tasks for the modal
      } else {
        const data = await response.json();
        console.error(data.error || "Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };
  // need to make it update live whenever edit is finished
  const handleEditTask = async () => {
    if (!taskToEdit) return;

    const updatedTask = {
      user_id: taskToEdit.user_id,
      title: taskTitle,
      description: taskDescription,
      priorityLevel: taskPriority,
      time: taskTime,
      status: taskStatus,
    };

    try {
      const response = await fetch(buildPath(`api/tasks/${taskToEdit._id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        // Update the local task list with the updated task

        alert("Task updated successfully!");

        fetchTasks(); // Refresh tasks from the server (optional)
        setIsEditModalOpen(false); // Close the modal
        //temp fix to close both pages
        setIsModalOpen(false);
        setTaskToEdit(null); // Clear the editing task state
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error updating task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error while updating task");
    }
  };

  return (
    <div>
      <div className="weeklyCalendar">
        <div className="header">
          {currentWeek.map((date, index) => (
            <div key={index} className="dayHeader">
              <div>
                {date.toLocaleDateString("default", { weekday: "short" })}
              </div>
              <div>{date.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="boxes">
          {currentWeek.map((date, index) => (
            <div
              key={index}
              className="day"
              onClick={() => handleBoxClick(date)}
            >
              View Tasks
            </div>
          ))}
        </div>
      </div>

      {/* View Tasks Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-overlay" onClick={handleCloseModal}></div>
          <div className="modal-content">
            <h3>Tasks for {selectedDate?.toDateString()}</h3>
            {tasksForDate.length > 0 ? (
              <ul>
                {tasksForDate.map((task) => (
                  <li key={task._id}>
                    <strong>{task.title}</strong>: {task.description} at{" "}
                    {new Date(task.time).toLocaleTimeString()}
                    <button
                      className="editButton"
                      onClick={() => handleEditClick(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="deleteButton"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks for this date.</p>
            )}
            <button id="AddTask" onClick={handleAddTaskClick}>
              Add Task
            </button>
            <button id="Close" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isModalOpen2 && (
        <div className="modal">
          <div className="modal-overlay" onClick={handleCloseModal2}></div>
          <div className="modal-content">
            <h3>Add New Task for {selectedDate?.toDateString()}</h3>
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
                  type="datetime-local"
                  value={taskTime || selectedDate?.toISOString().slice(0, 16)}
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
              <button id="Submit" onClick={handleAddTask}>
                Submit
              </button>
              <button id="Cancel" onClick={handleCloseModal2}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="modal">
          <div
            className="modal-overlay"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="modal-content">
            <h3>Edit Task: {taskToEdit?.title}</h3>
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
                  type="datetime-local"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                />
              </label>
            </div>
            <div className="inputSpace">
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
            <div className="inputSpace">
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
            <div className="modal-buttons">
              <button onClick={handleEditTask}>Save Changes</button>
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThisWeek;

/* <div>
      <div className="weeklyCalendar">
        <div className="header">
          {currentWeek.map((date, index) => (
            <div key={index} className="dayHeader">
              <div>
                {date.toLocaleDateString("default", { weekday: "short" })}
              </div>
              <div>{date.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="boxes">
          {currentWeek.map((date, index) => (
            <div
              key={index}
              className="day"
              onClick={() => handleBoxClick(date)}
            >
              View Tasks
            </div>
          ))}
        </div>
      </div>

    //   {/* View Tasks Modal */
// }
//   {isModalOpen && (
//     <div className="modal">
//       <div className="modal-overlay" onClick={handleCloseModal}></div>
//       <div className="modal-content">
//         <h3>Tasks for {selectedDate?.toDateString()}</h3>
//         {tasksForDate.length > 0 ? (
//           <ul>
//             {tasksForDate.map((task) => (
//               <li key={task._id}>
//                 <strong>{task.title}</strong>: {task.description} at{" "}
//                 {new Date(task.time).toLocaleTimeString()}
//                 <button
//                   className="editButton"
//                   onClick={() => handleEditClick(task)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="deleteButton"
//                   onClick={() => handleDelete(task._id)}
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No tasks for this date.</p>
//         )}
//         <button id="AddTask" onClick={handleAddTaskClick}>
//           Add Task
//         </button>
//         <button id="Close" onClick={handleCloseModal}>
//           Close
//         </button>
//       </div>
//     </div>
//   )}

//   {/* Add Task Modal */}
//   {isModalOpen2 && (
//     <div className="modal">
//       <div className="modal-overlay" onClick={handleCloseModal2}></div>
//       <div className="modal-content">
//         <h3>Add New Task for {selectedDate?.toDateString()}</h3>
//         <div className="inputSpace">
//           <label>
//             Title:
//             <input
//               type="text"
//               value={taskTitle}
//               onChange={(e) => setTaskTitle(e.target.value)}
//               required
//             />
//           </label>
//         </div>
//         <div className="inputSpace">
//           <label>
//             Description:
//             <input
//               value={taskDescription}
//               onChange={(e) => setTaskDescription(e.target.value)}
//             />
//           </label>
//         </div>
//         <div className="inputSpace">
//           <label>
//             Date:
//             <input
//               type="datetime-local"
//               value={taskTime || selectedDate?.toISOString().slice(0, 16)}
//               onChange={(e) => setTaskTime(e.target.value)}
//             />
//           </label>
//         </div>
//         <div className="inputSpace">
//           <div className="prioStatusGroup">
//             <label>
//               Priority:
//               <select
//                 value={taskPriority}
//                 onChange={(e) => setTaskPriority(e.target.value)}
//               >
//                 <option value="High">High</option>
//                 <option value="Medium">Medium</option>
//                 <option value="Low">Low</option>
//               </select>
//             </label>
//           </div>
//         </div>
//         <div className="inputSpace">
//           <div className="prioStatusGroup">
//             <label>
//               Status:
//               <select
//                 value={taskStatus}
//                 onChange={(e) => setTaskStatus(e.target.value)}
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </label>
//           </div>
//         </div>
//         <div className="modal-buttons">
//           <button id="Submit" onClick={handleAddTask}>
//             Submit
//           </button>
//           <button id="Cancel" onClick={handleCloseModal2}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   )}
//   {isEditModalOpen && (
//     <div className="modal">
//       <div
//         className="modal-overlay"
//         onClick={() => setIsEditModalOpen(false)}
//       ></div>
//       <div className="modal-content">
//         <h3>Edit Task: {taskToEdit?.title}</h3>
//         <div className="inputSpace">
//           <label>
//             Title:
//             <input
//               type="text"
//               value={taskTitle}
//               onChange={(e) => setTaskTitle(e.target.value)}
//               required
//             />
//           </label>
//         </div>
//         <div className="inputSpace">
//           <label>
//             Description:
//             <input
//               value={taskDescription}
//               onChange={(e) => setTaskDescription(e.target.value)}
//             />
//           </label>
//         </div>
//         <div className="inputSpace">
//           <label>
//             Date:
//             <input
//               type="datetime-local"
//               value={taskTime}
//               onChange={(e) => setTaskTime(e.target.value)}
//             />
//           </label>
//         </div>
//         <div className="inputSpace">
//           <label>
//             Priority:
//             <select
//               value={taskPriority}
//               onChange={(e) => setTaskPriority(e.target.value)}
//             >
//               <option value="High">High</option>
//               <option value="Medium">Medium</option>
//               <option value="Low">Low</option>
//             </select>
//           </label>
//         </div>
//         <div className="inputSpace">
//           <label>
//             Status:
//             <select
//               value={taskStatus}
//               onChange={(e) => setTaskStatus(e.target.value)}
//             >
//               <option value="Pending">Pending</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </label>
//         </div>
//         <div className="modal-buttons">
//           <button onClick={handleEditTask}>Save Changes</button>
//           <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   )}
// </div> */}

// <div style={{ textAlign: "center", height: "600px", padding: "10px" }}>
// <h1 style={{ paddingBottom: "20px" }}>Week View</h1>
// <div
//   style={{
//     display: "grid",
//     gridTemplateColumns: "repeat(7, 1fr)",
//     gap: "20px",
//     textAlign: "center",
//   }}
// >
//   {currentWeek.map((date, index) => {
//     const tasksForDate = getTasksForDate(date);

//     return (
//       <div key={index}>
//         {/* Day Header */}
//         <div
//           style={{
//             background: "#007bff",
//             color: "white",
//             padding: "15px",
//             borderRadius: "8px",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//             fontWeight: "bold",
//             transition: "background 0.3s ease",
//             cursor: "pointer", // Clickable for opening the task view
//           }}
//           onClick={() => handleBoxClick(date)}
//         >
//           {date.toLocaleDateString("default", { weekday: "long" })}
//         </div>

//         {/* Task Cards */}
//         <div style={{ marginTop: "10px" }}>
//           {tasksForDate.length > 0 ? (
//             tasksForDate.map((task) => (
//               <div
//                 key={task._id}
//                 style={{
//                   background: "white",
//                   color: "#333",
//                   padding: "10px",
//                   borderRadius: "5px",
//                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                   fontSize: "0.9em",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <strong>{task.title}</strong>: {task.description}
//               </div>
//             ))
//           ) : (
//             // Placeholder for no tasks with the click functionality
//             <div
//               key={index}
//               onClick={() => handleBoxClick(date)}
//               style={{
//                 color: "#666",
//                 fontStyle: "italic",
//                 fontSize: "0.9em",
//                 cursor: "pointer",
//               }}
//             >
//               No tasks yet
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   })}
// </div>

// {/* View Tasks Modal */}
// {isModalOpen && (
//   <div className="modal">
//     <div className="modal-overlay" onClick={handleCloseModal}></div>
//     <div className="modal-content">
//       <h3>Tasks for {selectedDate?.toDateString()}</h3>
//       {tasksForDate.length > 0 ? (
//         <ul>
//           {tasksForDate.map((task) => (
//             <li key={task._id}>
//               <strong>{task.title}</strong>: {task.description} at{" "}
//               {new Date(task.time).toLocaleTimeString()}
//               <button
//                 className="editButton"
//                 onClick={() => handleEditClick(task)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="deleteButton"
//                 onClick={() => handleDelete(task._id)}
//               >
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No tasks for this date.</p>
//       )}
//       <button id="AddTask" onClick={handleAddTaskClick}>
//         Add Task
//       </button>
//       <button id="Close" onClick={handleCloseModal}>
//         Close
//       </button>
//     </div>
//   </div>
// )}
// </div>
// );
