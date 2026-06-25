const express = require('express');
const fs = require('fs');
const path = require('path');

// Asegurar que la carpeta uploads exista en producción
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Carpeta "uploads" creada automáticamente.');
}
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
const PORT = 5000;

// Configuración de Middlewares globales
app.use(cors());
app.use(express.json());
// Hace pública la carpeta física para poder servir las imágenes cargadas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Reglas de almacenamiento en disco para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
    // Evita duplicados agregando una marca de tiempo única al nombre del archivo
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

// Validador de archivos con límite estricto de 5MB por foto
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: El archivo debe ser una imagen válida (JPG, PNG, GIF, WEBP)"));
  }
});

// --- ENTRADAS DE LA API (ROUTES) ---

// 1. Endpoint de Autenticación Unificada
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Error interno del servidor" });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Credenciales inválidas" });

    db.get("SELECT color_tema FROM preferences WHERE usuario_id = ?", [user.id], (err, pref) => {
      res.json({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        foto_perfil: user.foto_perfil,
        bio: user.bio,
        tema: pref ? pref.color_tema : 'theme-ashley-pink'
      });
    });
  });
});

// 2. Obtener galería completa (Las más recientes primero)
app.get('/api/photos', (req, res) => {
  const query = `
    SELECT photos.*, users.nombre AS uploader 
    FROM photos 
    JOIN users ON photos.usuario_id = users.id 
    ORDER BY photos.fecha_subida DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al recuperar galería" });
    res.json(rows);
  });
});

// 3. Subir un nuevo recuerdo diario
app.post('/api/photos', upload.single('imagen'), (req, res) => {
  const { usuario_id, descripcion } = req.body;
  if (!req.file) return res.status(400).json({ error: "Debe adjuntar una imagen obligatoriamente" });

  const imagen_url = `/uploads/${req.file.filename}`;

  db.run(
    "INSERT INTO photos (usuario_id, imagen_url, descripcion) VALUES (?, ?, ?)",
    [usuario_id, imagen_url, descripcion],
    function(err) {
      if (err) return res.status(500).json({ error: "Error al guardar metadatos de la imagen" });
      
      // Retorna la foto insertada combinada con los datos del uploader
      db.get(
        "SELECT photos.*, users.nombre AS uploader FROM photos JOIN users ON photos.usuario_id = users.id WHERE photos.id = ?",
        [this.lastID],
        (err, newPhoto) => {
          res.status(201).json(newPhoto);
        }
      );
    }
  );
});

// 4. Eliminar foto propia
app.delete('/api/photos/:id', (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body; // Validación simple de autoría frontend-backend

  db.get("SELECT * FROM photos WHERE id = ?", [id], (err, photo) => {
    if (err || !photo) return res.status(404).json({ error: "Fotografía no encontrada" });
    
    if (photo.usuario_id !== parseInt(usuario_id)) {
      return res.status(403).json({ error: "Acción no autorizada. Solo puedes eliminar tus propias fotos" });
    }

    db.run("DELETE FROM photos WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: "No se pudo eliminar el registro" });
      res.json({ success: true, message: "Recuerdo eliminado correctamente" });
    });
  });
});

// 5. Actualizar tema estético en caliente
app.post('/api/preferences', (req, res) => {
  const { usuario_id, color_tema } = req.body;
  
  db.run(
    "INSERT INTO preferences (usuario_id, color_tema) VALUES (?, ?) ON CONFLICT(usuario_id) DO UPDATE SET color_tema = ?",
    [usuario_id, color_tema, color_tema],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al guardar preferencias de visualización" });
      res.json({ success: true, temaActualizado: color_tema });
    }
  );
});

// Levantar el proceso del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});