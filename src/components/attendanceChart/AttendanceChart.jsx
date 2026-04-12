import React, { useState } from 'react';
import './AttendanceChart.css';

export default function AttendanceChart() {
  const [attendance, setAttendance] = useState([100, 50, 0, 100, 0]);
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

  return (
    <div className="attendanceCountainer">
      <h3>График посещаемости</h3>
      
      <div className="chart">
        {attendance.map((value, index) => (
          <div key={index} className="item">
            <div className="container">
              <div 
                className="bar" 
                style={{ height: `${value}%` }}
              ></div>
            </div>
            <p className="day">{days[index]}</p>
            <input
              value={value}
              className="numberValue"
            />
          </div>
        ))}
      </div>
      <div className="explan">
        <div className="explanText1">100 - посещение без опозданий</div>
        <div className="explanText2">50 - посещение с опозданием</div>
        <div className="explanText3">0 - пропуск</div>
      </div>
    </div>
  );
}