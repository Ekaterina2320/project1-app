import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, logoutUser } from '../redux/authSlice';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const Profile = () => {
  // Получаем dispatch для отправки действий в Redux store
  const dispatch = useDispatch();
  // Получаем текущего пользователя из Redux store
  const { currentUser } = useSelector(state => state.auth);
  // Состояние для переключения между режимами просмотра и редактирования
  const [isEditing, setIsEditing] = useState(false);

  // Инициализация react-hook-form с дефолтными значениями из currentUser
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || ''
    }
  });

  // Обработчик отправки формы редактирования
  const onSubmit = async (data) => {
    try {
      // Отправляем действие обновления пользователя с новыми данными
      await dispatch(updateUser({
        name: data.name,
        email: data.email
        // Пароль не изменяем через эту форму
      })).unwrap(); // unwrap() для обработки Promise
      // Выходим из режима редактирования после успешного обновления
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    }
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    // Контейнер профиля
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Профиль пользователя
      </Typography>

      {isEditing ? (
        // Форма редактирования профиля
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
        // Режим просмотра профиля
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