import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../styles/homeP.css';

const Homepage: React.FC = () => {
  return (
    <div className="homepage">
      <div className="sideBar">
        <Link to="/homepage/this-week" className="box" id='this-week'>This Week</Link>
        <Link to="/homepage/this-month" className="box" id='this-month'>This Month</Link>
        <Link to="/homepage/todo-list" className="box" id='todo-list'>To-Do List</Link>
        <Link to="/homepage/logout" className="box" id='todo-list'>Logout</Link>
      </div>
      <div className="content">
        {/* Render child routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default Homepage;
