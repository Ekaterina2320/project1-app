import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser } = useSelector(state => state.auth);

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
          sx={{ mr: 2 }}
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </IconButton>

        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                width: 40,
                height: 40,
                mr: 1
              }}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1">
              {currentUser.name}
            </Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;