import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="profile">
      <h2>Добро пожаловать, {currentUser?.name}</h2>
      <p>Email: {currentUser?.email}</p>
      <button onClick={handleLogout} className="logout-btn">
        Выйти
      </button>
    </div>
  );
};

export default Profile;