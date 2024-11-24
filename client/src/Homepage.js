import React, { useState } from "react";

function Homepage() {
  const [tasks, setTasks] = useState([
    { id: 1, label: "Something", completed: false },
    { id: 2, label: "Like", completed: false },
    { id: 3, label: "This?", completed: false },
  ]);

    // API WILL PROB ROUTE NEW TASKS TO HERE.

  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now(), label: newTask, completed: false },
      ]);
      setNewTask(""); // Clear input field
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="container2">
      <p>
        <label htmlFor="new-task">Item tester here // adding works.</label>
        <input
          id="new-task"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </p>

      <p>
        <label htmlFor="new-task">Add Item</label>
        <button>i like the strikethrough animation, unsure how to proceed for now</button>
      </p>

      <h3>Todo</h3>
      <ul id="incomplete-tasks">
        {tasks.map((task) => (
          <li key={task.id}>
            <div id="checklist">
              <input
                type="checkbox"
                id={`checkbox-${task.id}`} // Unique ID
                checked={task.completed}
                onChange={() => handleCheckboxChange(task.id)} // Toggle state
              />
              <label
                htmlFor={`checkbox-${task.id}`}
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.label}
              </label>
            </div>
            <button className="edit">Edit</button>
            <button className="delete">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Homepage;
