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
    </div>
  );
};

export default Homepage;
