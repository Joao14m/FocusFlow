import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/sideMenu.css';



const ThisMonth: React.FC = () => {
    useEffect(() => {
        // Add a class to the body tag for this page
        document.body.className = 'sideMenuBody';
    
        // Cleanup to remove class when leaving the page
        return () => {
          document.body.className = '';
        };
      }, []);
  return (
    <div >
      {/* <Link to="/this-week" className="boxSide" id="this-week">This Week</Link>
      <Link to="/this-month" className="boxSide" id="this-month">This Month</Link>
      <Link to="/todo-list" className="boxSide" id="todo-list">To-Do List</Link>
      <Link to="/add-task" className="boxSide" id="add-task">New Task</Link>
      <Link to="/login" className="boxSide" id="add-task">Logout</Link> */}

    </div>
  );
};

export default ThisMonth;
