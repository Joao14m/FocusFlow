import React, { useEffect, useState } from 'react';

interface Task {
  _id: string;
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

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem('user_id'); // Retrieve user_id from localStorage
  
      // Return early if user_id is not present
      if (!userId) {
        console.warn('Invalid user: No user_id found');
        setError('Invalid user');
        return;
      }
  
      try {
        // Fetch tasks for the specific user
        const response = await fetch(`http://localhost:5000/api/tasks?user_id=${userId}`);
        const data = await response.json();
  
        if (response.ok) {
          setTasks(data.tasks || []); // Update tasks state
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
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
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

  return (
    <div>
      <h1>To-Do List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Status</th>
            <th>Priority Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.category}</td>
              <td>{task.status}</td>
              <td>{task.priorityLevel}</td>
              <td>
                <button className='taskDelete' onClick={() => handleDelete(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToDo;
