import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { fetchUsers, deleteUser, updateUserRole, blockUser } from '../redux/authSlice';
import { Paper, Typography, Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import AdminPanelIcon from '@mui/icons-material/AdminPanelSettings';

const AdminUsersTable = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.auth);
  const { currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      dispatch(deleteUser(userId));
    }
  };

  const handleBlock = (userId, isBlocked) => {
    dispatch(blockUser({ userId, isBlocked }));
  };

  const handleChangeRole = (userId, newRole) => {
    dispatch(updateUserRole({ userId, newRole }));
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Имя',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Роль',
      cell: ({ getValue }) => (
        <span style={{
          color: getValue() === 'admin' ? 'red' : 'green',
          fontWeight: 'bold',
        }}>
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'isBlocked',
      header: 'Статус',
      cell: ({ getValue }) => (
        <span style={{
          color: getValue() ? 'red' : 'green',
          fontWeight: 'bold',
        }}>
          {getValue() ? 'Заблокирован' : 'Активен'}
        </span>
      ),
    },
    {
      header: 'Действия',
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Кнопка удаления */}
          <IconButton
            color="error"
            onClick={() => handleDelete(row.original.id)}
            disabled={row.original.id === currentUser?.id}
          >
            <DeleteIcon />
          </IconButton>

          {/* Кнопка блокировки/разблокировки */}
          <IconButton
            color={row.original.isBlocked ? 'success' : 'warning'}
            onClick={() => handleBlock(row.original.id, !row.original.isBlocked)}
            disabled={row.original.id === currentUser?.id}
          >
            <BlockIcon />
          </IconButton>

          {/* Кнопка изменения роли */}
          {row.original.role !== 'admin' && (
            <IconButton
              color="primary"
              onClick={() => handleChangeRole(row.original.id, 'admin')}
            >
              <AdminPanelIcon />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <Typography>Загрузка пользователей...</Typography>;
  if (error) return <Typography color="error">Ошибка: {error}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Управление пользователями
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      padding: '12px',
                      borderBottom: '2px solid #ddd',
                      textAlign: 'left',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Paper>
  );
};

export default AdminUsersTable;