import React, { useState, useCallback, lazy, Suspense  } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Container as MuiContainer, Grid, CssBaseline, Drawer, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Container from './components/Container';
import Button from './components/Button';
import { increment, decrement } from './redux/counterSlice';
import './App.css';
// Ленивые импорты для тяжелых компонентов
const AuthForm = lazy(() => import('./components/AuthForm'));
const Profile = lazy(() => import('./components/Profile'));
const Menu = lazy(() => import('./components/Menu'));
const Content = lazy(() => import('./components/Content'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Компонент-заглушка для Suspense
const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress size={60} />
  </div>
);


const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true); 
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);


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
      <div className="Counter">
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
              <button onClick={() => setMenuOpen(true)}>Открыть меню</button>
            </Grid>
            <Grid item xs={12} md={9}>
              <Container>
                <Suspense fallback={<Loader />}>
                  {isAuthenticated ? (
                    <>
                      <Profile />
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
                </Suspense>

                <div className="page-content">
                  <h1>Hello World!</h1>
                  <Button text="Нажми меня!" onClick={() => alert('Hello World!')} />

                  <Routes>
                    <Route path="/" element={<Content />} />
                    <Route path="/lab/:id" element={<Content />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </div>
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