const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Abre o crea el archivo físico de la base de datos
const db = new sqlite3.Database(path.join(__dirname, 'dailycouple.db'));

const initDB = () => {
  db.serialize(async () => {
    // 1. Tabla de Usuarios
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      foto_perfil TEXT DEFAULT NULL,
      bio TEXT DEFAULT NULL,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Tabla de Fotos Diarias
    db.run(`CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      imagen_url TEXT NOT NULL,
      descripcion TEXT DEFAULT NULL,
      fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(usuario_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // 3. Tabla de Preferencias Estéticas
    db.run(`CREATE TABLE IF NOT EXISTS preferences (
      usuario_id INTEGER PRIMARY KEY,
      color_tema TEXT DEFAULT 'theme-ashley-pink',
      idioma TEXT DEFAULT 'es',
      FOREIGN KEY(usuario_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // 4. Registro único e inicial de la pareja
    db.get("SELECT count(*) as count FROM users", async (err, row) => {
      if (err) {
        console.error("Error al verificar usuarios:", err);
        return;
      }
      
      if (row.count === 0) {
        // Encriptación de seguridad para contraseñas locales
        const hashKenny = await bcrypt.hash('Kenny2026!', 10);
        const hashAshley = await bcrypt.hash('Ashley2026!', 10);

        const stmt = db.prepare("INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)");
        
        // Registro formal con nombres legales completos
        stmt.run("Kenny Jahir Nájera Sánchez", "kenny@dailycouple.local", hashKenny);
        stmt.run("Ashley Katherine Nuñez Llagua", "ashley@dailycouple.local", hashAshley, function(err) {
          if (!err) {
            // Asignación de configuraciones estéticas iniciales
            db.run("INSERT INTO preferences (usuario_id, color_tema) VALUES (1, 'theme-kenny-blue')");
            db.run("INSERT INTO preferences (usuario_id, color_tema) VALUES (2, 'theme-ashley-pink')");
            console.log("✅ Base de datos configurada con éxito.");
          }
        });
        stmt.finalize();
      } else {
        console.log("✅ Conexión con base de datos SQLite lista.");
      }
    });
  });
};

initDB();
module.exports = db;