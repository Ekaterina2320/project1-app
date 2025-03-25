import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Монтирование
    console.log('ThemeContext mounted');

    // Чтение из localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }

    return () => {
      // Размонтирование
      console.log('ThemeContext unmounted');
    };
  }, []);

  useEffect(() => {
    // Обновление localStorage при изменении темы
    localStorage.setItem('theme', theme);
    document.body.className = theme; // Применение темы к body
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}