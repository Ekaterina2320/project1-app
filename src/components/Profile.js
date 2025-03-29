import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
  };

  return (
    <div>
      <span>Добро пожаловать, {user.login}</span>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Profile;