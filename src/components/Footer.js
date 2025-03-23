import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
        padding: '10px',
        marginTop: 'auto',
      }}
    >
      <Typography variant="body1">
        © 2025 Лабораторные работы. Чудесные лабораторные работы.
      </Typography>
    </Box>
  );
};

export default Footer;