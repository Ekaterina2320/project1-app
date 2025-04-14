import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Container as MuiContainer, Grid, CssBaseline, Drawer } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//import { login } from './redux/authSlice';
import { loginUser } from './redux/authSlice';
import useLoginState from './hooks/useLoginState';
import AuthForm  from './components/AuthForm';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Profile from './components/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Content from './components/Content';
import Navbar from './components/Navbar';
import Container from './components/Container';
import Button from './components/Button';
import About from './pages/About';
import Contact from './pages/Contact';
import { increment, decrement } from './redux/counterSlice';
import './App.css';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showLogin, setShowLogin] = useState(true); // true for login, false for register
  //const isAuthenticated = useLoginState();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      dispatch(loginUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  const addFeedback = useCallback((feedback) => {
    setFeedbacks(prev => [...prev, feedback]);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setShowLogin(true);
  }, []);

  const toggleAuthMode = useCallback(() => {
    setShowLogin(prev => !prev);
  }, []);

  const Counter = () => {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
      <div>
        <h2>Счётчик: {count}</h2>
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
          
          {isAuthenticated }

          <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
            <Menu onClose={() => setMenuOpen(false)} />
          </Drawer>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <button onClick={() => setMenuOpen(true)}>Open Menu</button>
            </Grid>
            <Grid item xs={12} md={9}>
              <Container>
                {isAuthenticated ? (
                  <>
                    <Profile />
                    <FeedbackForm addFeedback={addFeedback} />
                    <FeedbackList feedbacks={feedbacks} />
                  </>
                ) : (
                  <>
                    <AuthForm 
                      isLogin={showLogin} 
                      onSuccess={handleAuthSuccess} 
                    />
                    <button onClick={toggleAuthMode}>
                      {showLogin ? 'Нажми для регистрации' : 'Уже есть аккаунт?'}
                    </button>
                  </>
                )}
                <h1>Hello World!</h1>
                <Button text="Нажми меня!" onClick={() => alert('Hello World!')} />
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