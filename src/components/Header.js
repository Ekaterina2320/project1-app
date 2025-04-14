import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Лабораторные работы
        </Typography>
        <IconButton
          color="inherit"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;