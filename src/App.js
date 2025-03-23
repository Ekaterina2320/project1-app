/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

import React, { useState } from 'react';
import { Container as MuiContainer, Grid, CssBaseline, Drawer } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Content from './components/Content';
import Navbar from './components/Navbar';
import Container from './components/Container';
import Button from './components/Button';
import './App.css';

const App = () => {
  const [selectedLab, setSelectedLab] = useState(null); // Состояние для выбранной лабораторной работы
  const [menuOpen, setMenuOpen] = useState(false); // Состояние для открытия меню

  const handleLabSelect = (lab) => {
    setSelectedLab(lab); // Устанавливаем выбранную лабораторную работу
    setMenuOpen(false); // Закрываем меню после выбора
  };

  const handleClick = () => {
    alert('Hello World!');
  };


  return (
    <MuiContainer className="app">
      <CssBaseline />
      <Navbar />
      <Header />

      {/* Меню отображается в Drawer */}
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Menu onLabSelect={handleLabSelect} />
      </Drawer>

      {/* Основной контент */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <button onClick={() => setMenuOpen(true)}>Открыть меню</button>
        </Grid>
        <Grid item xs={12} md={9}>
          <Container>
            <h1>Hello World!</h1>
            <Button text="Нажми меня" onClick={handleClick} />
            <Content lab={selectedLab} />
          </Container>
        </Grid>
      </Grid>

      <Footer />
    </MuiContainer>
  );
};

export default App;