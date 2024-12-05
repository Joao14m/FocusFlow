import React, { useEffect, useState } from 'react';

function buildPath(route: string): string {
  const app_name = "focusflow.ink"; // Replace with your backend domain
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

const ToDo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // To track the search input

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem('user_id'); // Retrieve user_id from localStorage

      if (!userId) {
        console.warn('Invalid user: No user_id found');
        setError('Invalid user');
        return;
      }

      try {
        const response = await fetch(buildPath(`api/tasks?user_id=${userId}`));
        const data = await response.json();

        if (response.ok) {
          const userTasks = data.tasks.filter((task: Task) => task.user_id === userId);
          setTasks(userTasks); // Update state with filtered tasks
        } else {
          setError(data.error || 'Failed to fetch tasks'); // Handle API error
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('An unexpected error occurred'); // Handle network error
      }
    };

    fetchTasks(); // Call the function inside useEffect
  }, []);

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(buildPath(`api/tasks?user_id=${taskId}`), {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('An unexpected error occurred');
    }
  };

  // Filter tasks based on the search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="headerList-Search">
        <h1>To-Do List</h1>
        <form>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery} // Controlled input
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              width: '200px',
              margin: '10px 0',
            }}
          />
        </form>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            {/* <th>Category</th> */}
            <th>Status</th>
            <th>Priority Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              {/* <td>{task.category}</td> */}
              <td>{task.status}</td>
              <td>{task.priorityLevel}</td>
              <td>
                <button
                  className="taskDelete"
                  onClick={() => handleDelete(task._id)}
                  style={{
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredTasks.length === 0 && <p>No tasks match your search.</p>}
    </div>
  );
};

export default ToDo;
