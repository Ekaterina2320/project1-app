import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const labs = [
  { id: 1, title: 'Лабораторная работа 1', content: 'Содержимое лабораторной работы 1' },
  { id: 2, title: 'Лабораторная работа 2', content: 'Содержимое лабораторной работы 2' },
  { id: 3, title: 'Лабораторная работа 3', content: 'Содержимое лабораторной работы 3' },
  { id: 4, title: 'Лабораторная работа 4', content: 'Содержимое лабораторной работы 4' },
  { id: 5, title: 'Лабораторная работа 5', content: 'Содержимое лабораторной работы 5' },
  { id: 6, title: 'Лабораторная работа 6', content: 'Содержимое лабораторной работы 6' },
  { id: 7, title: 'Лабораторная работа 7', content: 'Содержимое лабораторной работы 7' },
  { id: 8, title: 'Лабораторная работа 8', content: 'Содержимое лабораторной работы 8' },
  { id: 9, title: 'Лабораторная работа 9', content: 'Содержимое лабораторной работы 9' },
];

const Content = () => {
  const { id } = useParams();
  const lab = id ? labs.find(lab => lab.id === parseInt(id)) : null;

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4">{lab ? lab.title : 'Выберите лабораторную работу'}</Typography>
      <Typography variant="body1" sx={{ marginTop: '10px' }}>
        {lab ? lab.content : 'Содержимое лабораторной работы будет отображено здесь.'}
      </Typography>
    </Box>
  );
};

export default Content;