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
import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Container as MuiContainer, Grid, CssBaseline, Drawer } from '@mui/material';
import { useDispatch, useSelector} from 'react-redux';
import { login } from './redux/authSlice';
import useLoginState from './hooks/useLoginState';
import { AuthForm } from './components/AuthForm';
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
//import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './redux/counterSlice';
import './App.css';
import './styles.css';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const isAuthenticated = useLoginState();
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const handleClick = () => {
    alert('Hello World!');
  };


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(login(user));
    }
  }, [dispatch]);

  const addFeedback = (feedback) => {
    setFeedbacks([...feedbacks, feedback]);
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
                {isAuthenticated ? (
                  <>
                    <Profile />
                    <FeedbackForm addFeedback={addFeedback} />
                    <FeedbackList feedbacks={feedbacks} />
                  </>
                ) : (
                  <AuthForm isLogin={true} onSuccess={() => {}} />
                )}
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


