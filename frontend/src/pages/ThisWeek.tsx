import React, { useEffect, useState } from "react";
import "../styles/sideMenu.css";
import "../styles/weeklyCalendar.css";
import "../styles/thisWeekAnimation.css";
// import { title } from "process";

const app_name = "focusflow.ink";

function buildPath(route: string): string {
  if (process.env.NODE_ENV === "development") {
    return `https://${app_name}/${route}`;
  } else {
    return `http://localhost:5000/${route}`;
  }
  console.log("Environment:", process.env.NODE_ENV);
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
  // const [startDate, setStartDate] = useState<Date | null>(null);
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

    // setStartDate(startOfWeek);
    setCurrentWeek(weekDates);
  };

  const fetchTasks = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    try {
      const response = await fetch(buildPath(`api/tasks?user_id=${userId}`));
      const data = await response.json();

      if (response.ok) {
        const userTasks = data.tasks
          .filter((task: Task) => task.user_id === userId) // Filter tasks for the user
          .sort(
            (a: Task, b: Task) =>
              new Date(a.time).getTime() - new Date(b.time).getTime()
          ); // Sort by time in ascending order

        setTasks(userTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case "high":
        return "#ff4d4f"; // Red for high priority
      case "medium":
        return "#faad14"; // Orange for medium priority
      case "low":
        return "#52c41a"; // Green for low priority
      default:
        return "#d9d9d9"; // Default grey for unknown priority
    }
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
    const userId = localStorage.getItem("user_id");

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
      const response = await fetch(buildPath(`api/tasks?user_id=${userId}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await response.json();
      if (response.ok) {
        // alert("Task added successfully!");
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

        // alert("Task updated successfully!");

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
    <div
      style={{
        textAlign: "center",
        height: "600px",
        padding: "10px",
        width: "800px",
      }}
    >
      <h1 style={{ paddingBottom: "20px", color: "white" }}>Week View</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "20px",
        }}
      >
        {currentWeek.map((date, index) => {
          const tasksForDate = tasks.filter(
            (task) => new Date(task.time).toDateString() === date.toDateString()
          );

          return (
            <div className="dayButton" key={index}>
              <div className="dayHeader" onClick={() => handleBoxClick(date)}>
                {date.toLocaleDateString("default", { weekday: "long" })}
              </div>
              <div style={{ marginTop: "10px" }}>
                {tasksForDate.length > 0 ? (
                  tasksForDate.map((task) => (
                    <div
                      key={task._id}
                      style={{
                        background: getPriorityColor(
                          task.priorityLevel.toString()
                        ), // Get color based on priority
                        fontWeight: "bold",
                        color: "#333",
                        padding: "10px",
                        borderRadius: "5px",
                        marginTop: "5px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {task.title}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      fontSize: "0.9em",
                      color: "white",
                      fontStyle: "italic",
                    }}
                  >
                    No tasks yet
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <div style={{ display: "inline-block", marginRight: "10px" }}>
          <span>|</span>
          <span
            style={{
              background: "#ff4d4f",
              padding: "5px 10px",
              borderRadius: "3px",
            }}
          ></span>
          {"| High Priority"}
        </div>
        <div style={{ display: "inline-block", marginRight: "10px" }}>
          <span>|</span>
          <span
            style={{
              background: "#faad14",
              padding: "5px 10px",
              borderRadius: "3px",
              marginLeft: "",
            }}
          ></span>
          {"| Medium Priority"}
        </div>
        <div style={{ display: "inline-block" }}>
          <span>|</span>
          <span
            style={{
              background: "#52c41a",
              paddingLeft: "10px",
              padding: "5px 10px",
              borderRadius: "3px",
            }}
          ></span>
          {"| Low Priority"}
        </div>
      </div>

      {/* View Tasks Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-overlay" onClick={handleCloseModal}></div>
          <div
            className="modal-content"
            id="tasks-for"
            style={{
              width: "800px",
              justifyContent: "flex-start",
              display: "flex",
            }}
          >
            <h3>Tasks for {selectedDate?.toDateString()}</h3>
            {tasksForDate.length > 0 ? (
              <ul>
                {tasksForDate.map((task) => (
                  <li
                    key={task._id}
                    style={{
                      background: getPriorityColor(
                        task.priorityLevel.toString()
                      ), // Priority-based color
                      color: "#333",
                      padding: "10px",
                      borderRadius: "5px",
                      marginTop: "5px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong>{task.title}</strong>: {task.description} at{" "}
                      {new Date(task.time).toLocaleTimeString()}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        padding: "10px",
                        paddingLeft: "10px",
                      }}
                    >
                      {" "}
                      {/*{buttons*/}
                      <button
                        className="editButton"
                        onClick={() => handleEditClick(task)}
                        style={{
                          paddingLeft: "10px",
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: "5px",
                          // backgroundColor: "blue",
                          color: "black",
                          cursor: "pointer",
                          backgroundImage: "url('../img/pencil.svg')",
                          backgroundRepeat: "no-repeat", // Prevent background from repeating
                          backgroundPosition: "left center", // Position the SVG to the left
                          backgroundSize: "20px", // Set size of the SVG
                        }}
                      >
                        `
                      </button>
                      <button
                        className="deleteButton"
                        onClick={() => handleDelete(task._id)}
                        style={{
                          paddingLeft: "10px",
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: "5px",
                          color: "black",
                          cursor: "pointer",
                          backgroundImage: "url('../img/trash.svg')",
                          backgroundRepeat: "no-repeat", // Prevent background from repeating
                          backgroundPosition: "left center", // Position the SVG to the left
                          backgroundSize: "20px",
                        }}
                      ></button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks for this date.</p>
            )}
            <button
              id="AddTask"
              onClick={handleAddTaskClick}
              style={{
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "green",
                color: "white",
                cursor: "pointer",
              }}
            >
              Add Task
            </button>
            <button
              id="Close"
              onClick={handleCloseModal}
              style={{
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "black",
                color: "white",
                cursor: "pointer",
              }}
            >
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
