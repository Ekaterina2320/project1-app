import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav
      style={{
        backgroundColor: '#333',
        padding: '10px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Главная</Link>
      <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>О нас</Link>
      <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Контакты</Link>
    </nav>
  );
};

export default Navbar;