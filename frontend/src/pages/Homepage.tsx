import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/homeP.css';

const Homepage: React.FC = () => {
  return (
    <div className="containerHome">
      <Link to="/this-week" className="box" id="this-week">This Week</Link>
      <Link to="/this-month" className="box" id="this-month">This Month</Link>
      <Link to="/todo-list" className="box" id="todo-list">To-Do List</Link>
      <Link to="/add-task" className="box" id="add-task">New Task</Link>
    </div>
  );
};

export default Homepage;
