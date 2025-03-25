import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Лабораторные работы
        </Typography>
          <button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'dark' : 'light'} theme
          </button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;