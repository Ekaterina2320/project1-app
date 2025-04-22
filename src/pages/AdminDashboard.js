import React from 'react';
import {
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Typography
} from '@mui/material';
import { useGetUsersQuery, useGetFeedbacksQuery } from '../redux/apiSlice';
import AdminUsersTable from '../components/AdminUsersTable';
import AdminFeedbacks from '../components/AdminFeedbacks';

const AdminDashboard = () => {
  const [value, setValue] = React.useState(0);

  // Запрос данных пользователей
  const {
    data: users,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    isError: isUsersError,
    error: usersError
  } = useGetUsersQuery();

  // Запрос данных отзывов
  const {
    data: feedbacks,
    isLoading: isFeedbacksLoading,
    isFetching: isFeedbacksFetching,
    isError: isFeedbacksError,
    error: feedbacksError
  } = useGetFeedbacksQuery();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Состояния для активной вкладки
  const isLoading = value === 0 ? isUsersLoading : isFeedbacksLoading;
  const isFetching = value === 0 ? isUsersFetching : isFeedbacksFetching;
  const isError = value === 0 ? isUsersError : isFeedbacksError;
  const error = value === 0 ? usersError : feedbacksError;

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Панель администратора
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
          <Tab label="Пользователи" />
          <Tab label="Отзывы" />
        </Tabs>
      </Box>

      <Box sx={{ pt: 3, position: 'relative', minHeight: 300 }}>
        {/* Глобальный индикатор загрузки */}
        {(isLoading || isFetching) && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10
          }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Загрузка данных...
            </Typography>
          </Box>
        )}

        {/* Глобальное сообщение об ошибке */}
        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error?.data?.message || error?.message || 'Произошла ошибка при загрузке данных'}
          </Alert>
        )}

        {/* Контент для вкладки пользователей */}
        {value === 0 && (
          <AdminUsersTable
            users={users || []}
            isLoading={isUsersLoading}
            isError={isUsersError}
            error={usersError}
          />
        )}

        {/* Контент для вкладки отзывов */}
        {value === 1 && (
          <AdminFeedbacks
            feedbacks={feedbacks || []}
            isLoading={isFeedbacksLoading}
            isError={isFeedbacksError}
            error={feedbacksError}
          />
        )}
      </Box>
    </Paper>
  );
};

export default AdminDashboard;