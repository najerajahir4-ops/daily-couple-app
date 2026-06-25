import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Conexión apuntando a la IP local de tu computadora
      const response = await fetch('https://daily-couple-app.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error de comunicación con el servidor');
      }

      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4 transition-colors duration-500">
      <div className="card-organic w-full max-w-md p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-elegant font-semibold text-[var(--text-main)] tracking-wide mb-2">
            Daily Couple
          </h1>
          <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase font-light">
            Espacio Privado Compartido
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[var(--text-main)] mb-1.5">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] bg-white/50 text-[var(--text-main)] transition-all"
              placeholder="nombre@dailycouple.local"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[var(--text-main)] mb-1.5">
              Contraseña
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] bg-white/50 text-[var(--text-main)] transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center text-sm text-[var(--text-muted)] cursor-pointer select-none">
              <input type="checkbox" className="mr-2.5 rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)] accent-[var(--primary)]" />
              Recordar sesión activa
            </label>
          </div>

          {error && (
            <div className="text-xs text-center font-medium bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 animate-fade-in">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center h-12 text-sm uppercase tracking-wider font-semibold cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Ingresar al Espacio'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}