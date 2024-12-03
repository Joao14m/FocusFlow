// import React, {useState} from "react";
// import { useNavigate } from "react-router-dom";

const Homepage: React.FC = () => {
    return (
    <div className="containerHome">
        <div className="box" id="this-week">This Week</div> 
        <div className="box" id="this-month">This Month</div>
        <div className="box" id="todo-list">To-Do List</div>
        <div className="box" id="add-task">Add Task</div>
        <div className="box" id="add-task">Checking Task</div>
    </div>
    );
};

export default Homepage;