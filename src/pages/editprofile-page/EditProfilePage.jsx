import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import './EditProfilePage.css';
import defaultAvatar from '../../avatars/default.jpg';
import { person1 } from '../../users';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [lastName, setLastName] = useState(person1.lastName);
  const [firstName, setFirstName] = useState(person1.firstName);
  const [middleName, setMiddleName] = useState(person1.middleName);
  const [age, setAge] = useState(person1.age);
  const [city, setCity] = useState(person1.city);
  const [group, setGroup] = useState(person1.group);
  const [attendance, setAttendance] = useState(person1.attendance);

  return (
    <div className="app">
      <Header />
      <div className="profileCountainer">
      <div className="profileHeader">
        <h3>Редактирование профиля</h3>
        <button type="button" className="editBtn" onClick={() => navigate('/profile')}>
          Назад
        </button>
      </div>

      <div className="profileContent">
        <img src={defaultAvatar} alt="Аватар" className="profileAvatar" />
        <div className="profileInfo">
          <div className="profileRow">
            <span className="label">Фамилия:</span>
            <input
              type="text"
              className="editProfileInput"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="profileRow">
            <span className="label">Имя:</span>
            <input
              type="text"
              className="editProfileInput"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="profileRow">
            <span className="label">Отчество:</span>
            <input
              type="text"
              className="editProfileInput"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>
          <div className="profileRow">
            <span className="label">Возраст:</span>
            <input
              type="text"
              className="editProfileInput"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="profileRow">
            <span className="label">Город:</span>
            <input
              type="text"
              className="editProfileInput"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="profileRow">
            <span className="label">Группа:</span>
            <input
              type="text"
              className="editProfileInput"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
          </div>
          <div className="profileRow">
            <span className="label">Посещаемость:</span>
            <input
              type="text"
              className="editProfileInput"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
            />
            <span className="label" style={{ minWidth: 'auto' }}>%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
