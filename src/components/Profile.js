// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutUser } from '../redux/authSlice';

// const Profile = () => {
//   const dispatch = useDispatch();
//   const currentUser = useSelector(state => state.auth.currentUser);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     localStorage.removeItem('currentUser');
//   };

//   return (
//     <div className="profile">
//       <h2>Добро пожаловать, {currentUser?.name}</h2>
//       <p>Email: {currentUser?.email}</p>
//       <button onClick={handleLogout} className="logout-btn">
//         Выйти
//       </button>
//     </div>
//   );
// };

// export default Profile;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, logoutUser } from '../redux/authSlice';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      // Передаем только те данные, которые можно изменять
      await dispatch(updateUser({
        name: data.name,
        email: data.email
        // Пароль не изменяем через эту форму
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Профиль пользователя
      </Typography>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Имя"
              variant="outlined"
              {...register('name', { required: 'Обязательное поле' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              {...register('email', {
                required: 'Обязательное поле',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Некорректный email'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Сохранить
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(false)}
            >
              Отмена
            </Button>
          </Box>
        </form>
      ) : (
        <>
          <Typography variant="body1" paragraph>
            <strong>Имя:</strong> {currentUser?.name}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> {currentUser?.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
            >
              Редактировать
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default Profile;