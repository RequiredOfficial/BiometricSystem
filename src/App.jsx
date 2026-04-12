import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login-page/LoginPage';
import RegisterPage from './pages/register-page/RegisterPage'
import './App.css';
import MainPage from './pages/main-page/MainPage';
import Profile from './pages/profile-page/ProfilePage'
import EditProfilePage  from './pages/editprofile-page/EditProfilePage';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/edit' element={<EditProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}


