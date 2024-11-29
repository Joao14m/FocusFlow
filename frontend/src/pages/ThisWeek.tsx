import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/sideMenu.css';
import '../styles/weeklyCalendar.css';

const ThisWeek: React.FC = () => {
  useEffect(() => {
    // Add a class to the body tag for this page
    document.body.className = 'sideMenuBody';

    // Cleanup to remove class when leaving the page
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div>
      {/* Weekly Calendar */}
      <div style={{ flex: 1, padding: '20px', marginLeft: '150px' }}>
      {/* Implement current Week Time */}

        <h1>** Date ** </h1>
        <div className="weeklyCalendar">
            <div className="header">
                <div className="dayHeader">Sunday</div>
                <div className="dayHeader">Monday</div>
                <div className="dayHeader">Tuesday</div>
                <div className="dayHeader">Wednesday</div>
                <div className="dayHeader">Thursday</div>
                <div className="dayHeader">Friday</div>
                <div className="dayHeader">Saturday</div>
            </div>
            <div className="boxes">
                <div className="day">..</div>
                <div className="day">..</div>
                <div className="day">..</div>
                <div className="day">..</div>
                <div className="day">..</div>
                <div className="day">..</div>
                <div className="day">..</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ThisWeek;
