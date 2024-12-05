import React, { useEffect, useState } from "react";
import "../styles/sideMenu.css";
import "../styles/monthlyCalendar.css";

interface Task {
  _id: string;
  title: string;
  time: string; // ISO date format (e.g., "2024-12-03T10:00")
  priorityLevel: string; // "High", "Medium", or "Low"
}

const ThisMonth: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Current date
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [startDay, setStartDay] = useState<number>(0); // Index of the first day (0 = Sunday)
  const [monthName, setMonthName] = useState<string>("");
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [tasks, setTasks] = useState<Task[]>([]); // Tasks for the current month

  useEffect(() => {
    updateCalendar(currentDate);
  }, [currentDate]);

  const updateCalendar = (date: Date) => {
    const month = date.getMonth(); // 0-based index for months (0 = January)
    const year = date.getFullYear();

    // Get the first day of the selected month
    const firstDay = new Date(year, month, 1).getDay(); // Day of the week (0 = Sunday)

    // Get the number of days in the selected month
    const days = new Date(year, month + 1, 0).getDate(); // Last day of the month

    setMonthName(date.toLocaleString("default", { month: "long" })); // Full month name
    setYear(year);
    setStartDay(firstDay);
    setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1)); // Days array

    fetchTasksForMonth(year, month + 1); // Fetch tasks for the selected month
  };

  const fetchTasksForMonth = async (year: number, month: number) => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks"); // Replace with your API endpoint
      const data = await response.json();

      if (response.ok) {
        // Filter tasks for the current month
        const monthTasks = data.tasks.filter((task: Task) => {
          const taskDate = new Date(task.time);
          return (
            taskDate.getFullYear() === year && taskDate.getMonth() + 1 === month
          );
        });
        setTasks(monthTasks);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(newDate);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      <div style={{ color: "black", flex: 1, padding: "20px", marginLeft: "10 0px", width: "800px" }}>
        <div className="calendar">
          <div className="calendarHeaderContainer">
            <button className="arrowButton" onClick={handlePreviousMonth}>
              &lt;
            </button>
            <h2>
              {monthName} {year}
            </h2>
            <button className="arrowButton" onClick={handleNextMonth}>
              &gt;
            </button>
          </div>
          <div className="calendarHeader">
            <div className="dayName">Sun</div>
            <div className="dayName">Mon</div>
            <div className="dayName">Tue</div>
            <div className="dayName">Wed</div>
            <div className="dayName">Thu</div>
            <div className="dayName">Fri</div>
            <div className="dayName">Sat</div>
          </div>
          <div className="calendarGrid">
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: startDay }, (_, i) => (
              <div key={`empty-${i}`} className="calendarCell empty"></div>
            ))}

            {/* Days of the current month */}
            {daysInMonth.map((day) => {
              const currentDay = `${year}-${String(
                currentDate.getMonth() + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

              const tasksForDay = tasks.filter((task) =>
                task.time.startsWith(currentDay)
              );

              return (
                <div key={day} className="calendarCell">
                  <span>{day}</span>
                  <div className="taskIcons">
                    {tasksForDay.map((task) => (
                      <img
                        key={task._id}
                        src="/img/star.svg"
                        alt="Task"
                        title={task.title}
                        className="taskStar"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThisMonth;
