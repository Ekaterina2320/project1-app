// AdminUsersTable.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useBlockUserMutation,
} from '../redux/apiSlice';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import { Paper, Typography, Box, IconButton, CircularProgress, Alert  } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import AdminPanelIcon from '@mui/icons-material/AdminPanelSettings';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableHeader = ({ header, moveColumn }) => {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: 'column',
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = header.index;
      if (dragIndex === hoverIndex) return;
      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'column',
    item: { index: header.index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <th
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: header.column.getCanSort() ? 'pointer' : 'move',
        padding: '12px',
        borderBottom: '2px solid #ddd',
        textAlign: 'left',
        backgroundColor: '#f5f5f5',
      }}
      onClick={header.column.getToggleSortingHandler()}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      {{
        asc: ' 🔼',
        desc: ' 🔽',
      }[header.column.getIsSorted()] ?? null}
    </th>
  );
};
// Изменения для спиннера загрузки
const AdminUsersTable = ({ users, isLoading, isError, error }) => {
  const [sorting, setSorting] = useState([]);
  const [columnOrder, setColumnOrder] = useState(
    ['id', 'name', 'email', 'role', 'isBlocked', 'actions']
  );

  const { currentUser } = useSelector((state) => state.auth);
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [blockUser] = useBlockUserMutation();
//Изменения для query
  const handleDelete = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await deleteUser(userId).unwrap();
      } catch (err) {
        console.error('Ошибка при удалении пользователя:', err);
      }
    }
  };

  const handleBlock = async (userId, isBlocked) => {
    try {
      await blockUser({ userId, isBlocked }).unwrap();
    } catch (err) {
      console.error('Ошибка при блокировке пользователя:', err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await updateUserRole({ userId, newRole }).unwrap();
    } catch (err) {
      console.error('Ошибка при изменении роли пользовател:', err);
    }
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: 'Имя',
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: true,
    },
    {
      accessorKey: 'role',
      header: 'Роль',
      cell: ({ getValue }) => (
        <span
          style={{
            color: getValue() === 'admin' ? 'red' : 'green',
            fontWeight: 'bold',
          }}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'isBlocked',
      header: 'Статус',
      cell: ({ getValue }) => (
        <span
          style={{
            color: getValue() ? 'red' : 'green',
            fontWeight: 'bold',
          }}
        >
          {getValue() ? 'Заблокирован' : 'Активен'}
        </span>
      ),
      enableSorting: true,
    },
    {
      header: 'Действия',
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton
            color="error"
            onClick={() => handleDelete(row.original.id)}
            disabled={row.original.id === currentUser?.id}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            color={row.original.isBlocked ? 'success' : 'warning'}
            onClick={() => handleBlock(row.original.id, !row.original.isBlocked)}
            disabled={row.original.id === currentUser?.id}
          >
            <BlockIcon />
          </IconButton>
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
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error?.data?.message || error?.message || 'Ошибка загрузки пользователей'}
      </Alert>
    );
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Управление пользователями
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <DraggableHeader
                      key={header.id}
                      header={header}
                      moveColumn={(dragIndex, hoverIndex) => {
                        const newOrder = [...columnOrder];
                        const [removed] = newOrder.splice(dragIndex, 1);
                        newOrder.splice(hoverIndex, 0, removed);
                        setColumnOrder(newOrder);
                      }}
                    />
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
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
    </DndProvider>
  );
};

export default AdminUsersTable;