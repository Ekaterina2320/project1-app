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
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Container as MuiContainer, Grid, CssBaseline, Drawer } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Content from './components/Content';
import Navbar from './components/Navbar';
import Container from './components/Container';
import Button from './components/Button';
import './App.css';
import About from './pages/About';
import Contact from './pages/Contact';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './redux/counterSlice';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    alert('Hello World!');
  };

  const Counter = () => {
  const count = useSelector((state) => state.counter.value); // Обратите внимание на 'counter'
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Счетчик: {count}</h2>
      <button onClick={() => dispatch(increment())}>Увеличить</button>
      <button onClick={() => dispatch(decrement())}>Уменьшить</button>
    </div>
  );
};

  return (
    <Router>
      <ThemeProvider>
        <MuiContainer className="app">
          <CssBaseline />
          <Navbar />
          <Header />

          <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
            <Menu onClose={() => setMenuOpen(false)} />
          </Drawer>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <button onClick={() => setMenuOpen(true)}>Открыть меню</button>
            </Grid>
            <Grid item xs={12} md={9}>
              <Container>
                <h1>Hello World!</h1>
                <Button text="Нажми меня" onClick={handleClick} />
                <Routes>
                  <Route path="/" element={<Content />} />
                  <Route path="/lab/:id" element={<Content />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
                <Counter />
              </Container>
            </Grid>
          </Grid>

          <Footer />
        </MuiContainer>
      </ThemeProvider>
    </Router>
  );
};

export default App;

