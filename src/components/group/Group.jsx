import React from 'react';
import './Group.css';
import defaultAvatar from '../../avatars/default.jpg'

export default function Group() {
  const students = [
    { id: 1, lastName: 'Петухов', firstName: 'Родион', attendance: 50},
    { id: 2, lastName: 'Комиссарова', firstName: 'Мадина', attendance: 100},
    { id: 3, lastName: 'Шишкин', firstName: 'Матвей', attendance: 100},
    { id: 4, lastName: 'Уткин', firstName: 'Денис', attendance: 0},
    { id: 5, lastName: 'Кочеткова', firstName: 'София', attendance: 100},
    { id: 6, lastName: 'Михайлов', firstName: 'Тимофей', attendance: 50},
    { id: 7, lastName: 'Смирнова', firstName: 'Анастасия', attendance: 50},
  ]
   function onStudentClick(){
    alert(1)
   }
  return (
    <div className="group">
      <h3>Моя группа</h3>
      
      <div className="students-list">
        {students.map((students, index) => (
          <div 
            key={index} 
            className="studentCountainer"
            onClick={() => onStudentClick(students)}
          >
            <span className="place">#{students.id}</span>
            <img 
              src={defaultAvatar}
              alt="Аватар" 
              className="avatar"
            />
            <div className="studentStats">
              <p className="studentName">{students.lastName} {students.firstName}</p>
              <p className="attendance">Посещаемость: {students.attendance}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}