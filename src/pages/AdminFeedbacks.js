import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  fetchFeedbacks,
  deleteFeedback,
  blockFeedback
} from '../redux/feedbackSlice';
import { Paper, Typography, Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';

const AdminFeedbacks = () => {
  const dispatch = useDispatch();
  const { items: feedbacks, loading, error } = useSelector(state => state.feedbacks);
  const { currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      dispatch(deleteFeedback(id));
    }
  };

  const handleBlock = (id, isBlocked) => {
    dispatch(blockFeedback({ id, isBlocked }));
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'author',
      header: 'Автор',
    },
    {
      accessorKey: 'title',
      header: 'Заголовок',
    },
    {
      accessorKey: 'message',
      header: 'Сообщение',
      cell: ({ getValue }) => (
        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {getValue()}
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Дата',
      cell: ({ getValue }) => (
        <span>
          {new Date(getValue()).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
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
          <IconButton
            color="error"
            onClick={() => handleDelete(row.original.id)}
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            color={row.original.isBlocked ? 'success' : 'warning'}
            onClick={() => handleBlock(row.original.id, !row.original.isBlocked)}
          >
            <BlockIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: feedbacks || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <Typography>Загрузка отзывов...</Typography>;
  if (error) return <Typography color="error">Ошибка: {error}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Управление отзывами
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

export default AdminFeedbacks;