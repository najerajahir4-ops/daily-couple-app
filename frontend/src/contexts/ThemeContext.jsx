import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('user-theme') || 'theme-ashley-pink');

  useEffect(() => {
    // Aplica el atributo dinámico en la raíz del documento HTML
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('user-theme', theme);
  }, [theme]);

  const changeTheme = (newTheme) => setTheme(newTheme);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};