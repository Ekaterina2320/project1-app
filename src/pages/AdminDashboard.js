import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import AdminUsersTable from '../components/AdminUsersTable';
import AdminFeedbacks from './AdminFeedbacks';
import { Paper, Typography } from '@mui/material';

const AdminDashboard = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

      <Box sx={{ pt: 3 }}>
        {value === 0 && <AdminUsersTable />}
        {value === 1 && <AdminFeedbacks />}
      </Box>
    </Paper>
  );
};

export default AdminDashboard;