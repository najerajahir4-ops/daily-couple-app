require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Configuración del pool de conexiones hacia la nube de Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras en entornos como Neon/Render
  }
});

// Función de utilidad para traducir consultas SQLite (?) a PostgreSQL ($1, $2, ...)
function traducirQuery(sql) {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

const initDB = async () => {
  try {
    // 1. Tabla de Usuarios
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      foto_perfil TEXT DEFAULT NULL,
      bio TEXT DEFAULT NULL,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Tabla de Fotos Diarias
    await pool.query(`CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER NOT NULL,
      imagen_url TEXT NOT NULL,
      descripcion TEXT DEFAULT NULL,
      fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(usuario_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // 3. Tabla de Preferencias Estéticas
    await pool.query(`CREATE TABLE IF NOT EXISTS preferences (
      usuario_id INTEGER PRIMARY KEY,
      color_tema TEXT DEFAULT 'theme-ashley-pink',
      idioma TEXT DEFAULT 'es',
      FOREIGN KEY(usuario_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // 4. Registro único e inicial de la pareja
    const res = await pool.query("SELECT COUNT(*) as count FROM users");
    
    if (parseInt(res.rows[0].count) === 0) {
      const hashKenny = await bcrypt.hash('Kenny2026!', 10);
      const hashAshley = await bcrypt.hash('Ashley2026!', 10);

      // Inserción formal de usuarios reales
      await pool.query("INSERT INTO users (nombre, email, password) VALUES ($1, $2, $3)", 
        ["Kenny Jahir Nájera Sánchez", "kenny@dailycouple.local", hashKenny]
      );
      await pool.query("INSERT INTO users (nombre, email, password) VALUES ($1, $2, $3)", 
        ["Ashley Katherine Nuñez Llagua", "ashley@dailycouple.local", hashAshley]
      );

      // Asignación de configuraciones estéticas iniciales
      await pool.query("INSERT INTO preferences (usuario_id, color_tema) VALUES (1, 'theme-kenny-blue')");
      await pool.query("INSERT INTO preferences (usuario_id, color_tema) VALUES (2, 'theme-ashley-pink')");
      
      console.log("✅ Estructura y semillas PostgreSQL creadas con éxito en Neon.");
    } else {
      console.log("✅ Conexión con base de datos PostgreSQL en Neon lista.");
    }
  } catch (err) {
    console.error("❌ Error inicializando la base de datos PostgreSQL:", err);
  }
};

// Ejecutar inicialización asíncrona
initDB();

/* ==========================================================================
  WRAPPER DE COMPATIBILIDAD (ABSTRACCIÓN DE INTERFAZ SQLITE A POSTGRESQL)
  Evita tener que modificar las consultas y métodos en tus controladores.
  ==========================================================================
*/
const dbWrapper = {
  // Simulación del método db.get (Traer una sola fila)
  get: (sql, params, callback) => {
    if (typeof params === 'function') { callback = params; params = []; }
    pool.query(traducirQuery(sql), params)
      .then(result => callback(null, result.rows[0]))
      .catch(err => callback(err));
  },
  
  // Simulación del método db.all (Traer múltiples filas)
  all: (sql, params, callback) => {
    if (typeof params === 'function') { callback = params; params = []; }
    pool.query(traducirQuery(sql), params)
      .then(result => result.rows) // Adaptación de estructura nativa
      .catch(err => callback(err));
  },

  // Simulación del método db.run (Ejecutar inserts, updates, deletes)
  run: (sql, params, callback) => {
    if (typeof params === 'function') { callback = params; params = []; }
    pool.query(traducirQuery(sql), params)
      .then(result => {
        if (callback) callback(null, { lastID: null, changes: result.rowCount });
      })
      .catch(err => {
        if (callback) callback(err);
      });
  },

  // Stub para emular el encadenamiento secuencial de SQLite si es invocado
  serialize: (fn) => fn()
};

module.exports = dbWrapper;