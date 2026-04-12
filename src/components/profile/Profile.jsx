import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';
import defaultAvatar from '../../avatars/default.jpg'
import { person1 } from '../../users';

export default function Profile() {
    const navigate = useNavigate();
    function onEditClick(){
        navigate('/edit')
    }
  return (
    <div className="profileCountainer">
      <div className="profileHeader">
        <h3>Мой профиль</h3>
        <button 
          className="editBtn"
          onClick={onEditClick}
        >
          Редактировать
        </button>
      </div>
      
      <div className="profileContent">
        <img 
          src={defaultAvatar} 
          alt="Мой аватар" 
          className="profileAvatar"
        />
        
        <div className="profileInfo">
          <div className="profileRow">
            <span className="label">ФИО:</span>
            <span className="value">{person1.lastName} {person1.firstName} {person1.middleName}</span>
          </div>
          
          <div className="profileRow">
            <span className="label">Возраст:</span>
            <span className="value">{person1.age}</span>
          </div>
          
          <div className="profileRow">
            <span className="label">Город:</span>
            <span className="value">{person1.city}</span>
          </div>
          
          <div className="profileRow">
            <span className="label">Группа:</span>
            <span className="value">{person1.group}</span>
          </div>
          
          <div className="profileRow">
            <span className="label">Посещаемость:</span>
            <span className="value">{person1.attendance}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
