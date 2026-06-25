import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(() => {
    // Recupera la sesión persistente en LocalStorage si existe
    const savedUser = localStorage.getItem('active-couple-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user && user.tema) {
      // Sincroniza el atributo visual del HTML con el guardado en la base de datos
      document.documentElement.setAttribute('data-theme', user.tema);
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('active-couple-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('active-couple-user');
  };

  return (
    <ThemeProvider>
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}

export default App;