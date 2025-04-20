import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  fetchFeedbacks,
  deleteFeedback,
  blockFeedback,
} from '../redux/feedbackSlice';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Компонент для перетаскиваемых заголовков
const DraggableHeader = ({ header, moveColumn }) => {
  const ref = React.useRef(null);
// Используем хук `useDrop` для обработки перетаскивания колонок
  const [, drop] = useDrop({
    accept: 'column', // Тип элемента, который можно перетаскивать
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index; // Индекс перетаскиваемой колонки
      const hoverIndex = header.index; // Индекс колонки, над которой находится курсор
      if (dragIndex === hoverIndex) return; // Если индексы совпадают, ничего не делаем
      moveColumn(dragIndex, hoverIndex); // Перемещаем колонку
      item.index = hoverIndex; // Обновляем индекс перетаскиваемого элемента
    },
  });
 // Используем хук `useDrag` для перетаскивания
  const [{ isDragging }, drag] = useDrag({
    type: 'column',
    item: { index: header.index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
// Привязываем перетаскивание и сброс к элементу
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
// Основной компонент для управления отзывами
const AdminFeedbacks = () => {
  const dispatch = useDispatch();
  const { items: feedbacks, loading, error } = useSelector((state) => state.feedbacks);
  const [sorting, setSorting] = useState([]);
  const [columnOrder, setColumnOrder] = useState(
    ['id', 'author', 'title', 'message', 'date', 'isBlocked', 'actions']
  );

  useEffect(() => {
    if (!feedbacks || feedbacks.length === 0) {
      dispatch(fetchFeedbacks());// Загружаем отзывы, если их нет в состоянии
    }
  }, [dispatch]); // Только dispatch в зависимостях
// Функция для удаления отзыва
  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      dispatch(deleteFeedback(id));
    }
  };
// Функция для блокировки/разблокировки отзыва
  const handleBlock = (id, isBlocked) => {
    dispatch(blockFeedback({ id, isBlocked }));
  };
// Определение колонок таблицы
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
    },
    {
      accessorKey: 'author',
      header: 'Автор',
      enableSorting: true,
    },
    {
      accessorKey: 'title',
      header: 'Заголовок',
      enableSorting: true,
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
            minute: '2-digit',
          })}
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
        {/* Кнопка блокировки/разблокировки отзыва */}
          <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
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
// Настройка таблицы
  const table = useReactTable({
    data: feedbacks || [], // Данные для таблицы
    columns, // Определенные колонки
    getCoreRowModel: getCoreRowModel(), // Модель для получения строк
    getSortedRowModel: getSortedRowModel(), // Модель для сортировки строк
    state: {
      sorting, // Текущая сортировка
      columnOrder, // Текущий порядок колонок
    },
    onSortingChange: setSorting, // Обновление состояния сортировки
    onColumnOrderChange: setColumnOrder, // Обновление порядка колонок
  });

  if (loading) return <Typography>Загрузка отзывов...</Typography>;
  if (error) return <Typography color="error">Ошибка: {error}</Typography>;

  return (
    <DndProvider backend={HTML5Backend}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Управление отзывами
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
                      {/* Отображаем содержимое ячеек */}
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

export default AdminFeedbacks;