import React from 'react';
import { Box, Typography } from '@mui/material';

const Content = ({ lab }) => {
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