import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/sideMenu.css';
import '../styles/weeklyCalendar.css';

const ThisWeek: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]); // Array of dates for the current week
  const [startDate, setStartDate] = useState<Date | null>(null); // Start date of the current week

  useEffect(() => {
    // Set the initial week when the component loads
    const now = new Date();
    setWeek(now);
  }, []);

  const setWeek = (date: Date) => {
    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Adjust to the previous Sunday

    // Create an array of 7 days (Sunday to Saturday)
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i); // Add i days to the start of the week
      return day;
    });

    setStartDate(startOfWeek);
    setCurrentWeek(weekDates);
  };

  const handlePreviousWeek = () => {
    if (startDate) {
      const previousWeek = new Date(startDate);
      previousWeek.setDate(startDate.getDate() - 7); // Go back 7 days
      setWeek(previousWeek);
    }
  };

  const handleNextWeek = () => {
    if (startDate) {
      const nextWeek = new Date(startDate);
      nextWeek.setDate(startDate.getDate() + 7); // Move forward 7 days
      setWeek(nextWeek);
    }
  };

  useEffect(() => {
    document.body.className = 'sideMenuBody';

    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      {/* Sidebar */}
      <div className="containerSide">
        <Link to="/this-week" className="boxSide active" id="this-week">
          This Week
        </Link>
        <Link to="/this-month" className="boxSide" id="this-month">
          This Month
        </Link>
        <Link to="/todo-list" className="boxSide" id="todo-list">
          To-Do List
        </Link>
        <Link to="/add-task" className="boxSide" id="add-task">
          New Task
        </Link>
        <Link to="/login" className="boxSide" id="logout">
          Logout
        </Link>
      </div>

      {/* Weekly Calendar */}
      <div style={{ flex: 1, padding: '20px', marginLeft: '150px', width:'800px' }}>
        <div className="weekHeader">
          <button className="arrowButton" onClick={handlePreviousWeek}>
            &lt;
          </button>
          <h2>
            Week of {startDate?.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <button className="arrowButton" onClick={handleNextWeek}>
            &gt;
          </button>
        </div>
        <div className="weeklyCalendar">
          <div className="header">
            {currentWeek.map((date, index) => (
              <div key={index} className="dayHeader">
                <div>{date.toLocaleDateString('default', { weekday: 'short' })}</div>
                <div>{date.getDate()}</div>
              </div>
            ))}
          </div>
          <div className="boxes">
            {currentWeek.map((date, index) => (
              <div key={index} className="day">
                ..
                {/* Tasks for {date.toLocaleDateString('default', { month: 'short', day: 'numeric' })} */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThisWeek;
