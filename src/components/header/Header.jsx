import React from 'react';
import './Header.css';
import { person1 } from '../../users'
import defaultAvatar from '../../avatars/default.jpg'
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/main" style={{ color: 'inherit', textDecoration: 'none' }}>
          <h2>Колледж IT TOP</h2>
        </Link>
      </div>
      <div className="userInfo">
        <img 
          src={defaultAvatar}
          alt="Аватар" 
          className="avatar"
        />
        <div>
          <p className="name">
            <Link to="/profile" style={{cursor: 'pointer', color: 'white', textDecoration: 'none'}}>
                {person1.lastName} {person1.firstName}
            </Link>
          </p>
          <p className="headerGroup">
            <Link to="/profile" style={{cursor: 'pointer', color: 'white', textDecoration: 'none'}}>
                Группа: {person1.group}
            </Link>
          </p>
        </div>
      </div>
    </header>
  );
}