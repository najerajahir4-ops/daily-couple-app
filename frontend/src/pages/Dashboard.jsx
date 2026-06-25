import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { 
  FiHeart, FiCamera, FiGrid, FiLogOut, FiTrash2, FiMaximize2, FiX, 
  FiSparkles, FiSettings, FiCalendar, FiUser, FiMessageCircle 
} from 'react-icons/fi';

export default function Dashboard({ user, onLogout }) {
  const { theme, changeTheme } = useContext(ThemeContext);
  const [fotos, setFotos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Estados avanzados de Configuración de la interfaz
  const [tipoParticula, setTipoParticula] = useState(localStorage.getItem('pref-particula') || 'corazones');
  const [mostrarMascota, setMostrarMascota] = useState(JSON.parse(localStorage.getItem('pref-mascota')) !== false);
  const [fraseMascota, setFraseMascota] = useState('¡Hola Ashley Katherine! Qué alegría verte hoy aquí 🐾');
  const [reacciones, setReacciones] = useState(JSON.parse(localStorage.getItem('love-reactions')) || {});

  // Estados de control de interfaces
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const fechaEspecial = new Date('2024-02-14T00:00:00'); 
  const [diasJuntos, setDiasJuntos] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const diferencia = new Date().getTime() - fechaEspecial.getTime();
    setDiasJuntos(Math.floor(diferencia / (1000 * 3600 * 24)));
    fetchPhotos();
    generarParticulas();
  }, [tipoParticula]);

  // CORREGIDO: Sintaxis limpia para las dimensiones de las partículas
  const generarParticulas = () => {
    const iconos = {
      corazones: ['❤️', '💖', '💝', '🌸'],
      gatitos: ['🐱', '🐾', '🐈', '🎀'],
      kuromi: ['😈', '🖤', '🔮', '✨']
    };
    const pool = iconos[tipoParticula] || iconos.corazones;
    const nuevasParticulas = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      char: pool[Math.floor(Math.random() * pool.length)],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${14 + Math.random() * 20}px` 
    }));
    setParticles(nuevasParticulas);
  };

  const fetchPhotos = async () => {
    try {
      const res = await fetch('http://192.168.100.9:5000/api/photos');
      const data = await res.json();
      if (res.ok) setFotos(data);
    } catch (err) {
      console.error("Error cargando base de datos");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showNotice('error', 'La foto excede el límite permitido de 5MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoadingUpload(true);

    const formData = new FormData();
    formData.append('imagen', selectedFile);
    formData.append('usuario_id', user.id);
    formData.append('descripcion', descripcion);

    try {
      const res = await fetch('http://192.168.100.9:5000/api/photos', {
        method: 'POST',
        body: formData
      });
      const newPhoto = await res.json();
      
      if (res.ok) {
        setFotos([newPhoto, ...fotos]);
        setDescripcion('');
        setSelectedFile(null);
        setPreviewUrl(null);
        showNotice('success', '¡Recuerdo guardado con éxito, amor!');
        interactuarMascota('upload');
      } else {
        showNotice('error', newPhoto.error);
      }
    } catch (err) {
      showNotice('error', 'Error al procesar la subida');
    } finally {
      setLoadingUpload(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    try {
      const res = await fetch(`http://192.168.100.9:5000/api/photos/${deleteConfirmation}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: user.id })
      });
      if (res.ok) {
        setFotos(fotos.filter(f => f.id !== deleteConfirmation));
        showNotice('success', 'Recuerdo removido de la bitácora.');
        if (activeLightbox && activeLightbox.id === deleteConfirmation) setActiveLightbox(null);
      }
    } catch (err) {
      showNotice('error', 'No se pudo eliminar');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleThemeChange = async (themeId) => {
    changeTheme(themeId);
    try {
      await fetch('http://192.168.100.9:5000/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: user.id, color_tema: themeId })
      });
    } catch (e) {
      console.error("Error guardando tema");
    }
  };

  const darSuperCorazon = (fotoId) => {
    const nuevosVotos = { ...reacciones, [fotoId]: (reacciones[fotoId] || 0) + 1 };
    setReacciones(nuevosVotos);
    localStorage.setItem('love-reactions', JSON.stringify(nuevosVotos));
    interactuarMascota('like');
  };

  const interactuarMascota = (accion) => {
    const frases = {
      click: [
        "¡Eres la mejor futura profesora de inglés del mundo entero! 📚✨",
        "Kuromi dice que Kenny te ama con todo su corazón hoy y siempre 🖤",
        "Miau... ¿Ya le dijiste a Kenny cuánto lo extrañas hoy? 🐱",
        "Tu sonrisa hace que todo este código valga la pena, Ashley Katherine 🌸"
      ],
      upload: "¡Acabas de colgar un recuerdo precioso! Lo cuidaré perfectamente aquí 🎀",
      like: "¡Súper amor enviado! Romantizando la bitácora al máximo...💖"
    };
    const lista = frases[accion] || frases.click;
    if (Array.isArray(lista)) {
      setFraseMascota(lista[Math.floor(Math.random() * lista.length)]);
    } else {
      setFraseMascota(lista);
    }
  };

  const showNotice = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const paletasAshley = [
    { id: 'theme-kitty-pink', label: 'Hello Kitty Soft Pink 🌸', hex: '#FFB7CA' },
    { id: 'theme-kuromi-goth', label: 'Kuromi Goth Mode 😈', hex: '#D6A3FB' },
    { id: 'theme-coquette-rose', label: 'Coquette Vintage Rose 🎀', hex: '#F7D6C8' },
    { id: 'theme-neko-mint', label: 'Pastel Neko Mint 🐱', hex: '#A8E6CF' },
    { id: 'theme-royal-gold', label: 'Gold Elegante ✨', hex: '#E5C158' }
  ];

  const paletasKenny = [
    { id: 'theme-kenny-blue', label: 'Azul Corporativo', hex: '#2563EB' },
    { id: 'theme-kenny-dark', label: 'Gris Minimalista', hex: '#374151' }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500 pb-20 relative overflow-x-hidden">
      
      {/* CAPA DE PARTÍCULAS INTERACTIVAS */}
      {particles.map(p => (
        <span 
          key={p.id} 
          className="floating-particle" 
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, fontSize: p.size }}
        >
          {p.char}
        </span>
      ))}

      {/* HEADER */}
      <header className="border-b border-[var(--border-color)] bg-white/40 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between transition-colors">
        <h2 className="text-3xl font-elegant font-bold tracking-wider text-[var(--text-main)] flex items-center gap-2">
          Daily Couple <FiSparkles className="text-[var(--primary)] animate-spin" size={18} />
        </h2>
        
        {/* Contador Estético */}
        <div className="flex items-center gap-3 bg-[var(--primary)]/20 px-6 py-2.5 rounded-2xl border border-[var(--primary)]/30 shadow-xs">
          <FiHeart className="text-[var(--secondary)] fill-[var(--secondary)] animate-bounce" size={18} />
          <span className="text-sm font-semibold tracking-wide font-elegant">{diasJuntos} Días Juntos</span>
        </div>

        {/* Sesión */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none">{user.nombre}</p>
            <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase font-semibold">Espacio Seguro</span>
          </div>
          <button onClick={() => onLogout()} className="text-[var(--text-muted)] hover:text-red-500 p-2.5 rounded-xl bg-white/60 hover:bg-red-50 transition-all cursor-pointer shadow-xs">
            <FiLogOut size={18} />
          </button>
        </div>
      </header>

      {/* CUERPO CENTRAL */}
      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-20">
        
        {/* BARRA LATERAL IZQUIERDA */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* MASCOTA VIRTUAL */}
          {mostrarMascota && (
            <div className="glass-card p-5 text-center bg-gradient-to-b from-[var(--primary)]/10 to-transparent relative group">
              <div 
                className="w-20 h-20 mx-auto mb-3 bg-white rounded-full flex items-center justify-center text-4xl shadow-md cursor-pointer transform transition-transform group-hover:scale-110 active:scale-90"
                onClick={() => interactuarMascota('click')}
              >
                {theme === 'theme-kuromi-goth' ? '😈' : '🐱'}
              </div>
              <div className="bg-white/80 p-3 rounded-2xl border border-[var(--border-color)] text-xs font-medium leading-relaxed shadow-xs">
                "{fraseMascota}"
              </div>
              <span className="text-[9px] text-[var(--text-muted)] block mt-2 uppercase font-bold tracking-widest">Haz clic para interactuar</span>
            </div>
          )}

          {/* CAPTURAR RECUERDO */}
          <div className="glass-card p-6">
            <h3 className="font-elegant text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text-main)]">
              <FiCamera className="text-[var(--secondary)]" /> Guardar Instante
            </h3>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <label className="block border-2 border-dashed border-[var(--border-color)] rounded-2xl p-4 text-center cursor-pointer hover:border-[var(--primary)] bg-white/30 transition-all group">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-xl object-cover shadow-md" />
                ) : (
                  <div className="py-4 space-y-2">
                    <span className="text-3xl block group-hover:animate-bounce">📸</span>
                    <p className="text-xs font-medium text-[var(--text-muted)]">Subir fotografía (Máx 5MB)</p>
                  </div>
                )}
              </label>

              <input 
                type="text" 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="w-full px-4 py-3 text-xs rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary)] bg-white/60 font-medium placeholder:text-gray-400"
              />

              <button type="submit" disabled={loadingUpload || !selectedFile} className="w-full btn-kawaii text-xs uppercase tracking-widest cursor-pointer disabled:opacity-30">
                {loadingUpload ? 'Subiendo...' : 'Publicar en la Bitácora'}
              </button>
            </form>
          </div>

          {/* PERSONALIZACIÓN AVANZADA */}
          <div className="glass-card p-6">
            <h3 className="font-elegant text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text-main)]">
              <FiSettings className="text-[var(--secondary)]" /> Personalización Pro
            </h3>
            
            <div className="space-y-3 mb-5 border-b border-[var(--border-color)] pb-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest mb-2">Efectos Mágicos de Fondo</label>
                <select 
                  value={tipoParticula} 
                  onChange={(e) => { setTipoParticula(e.target.value); localStorage.setItem('pref-particula', e.target.value); }}
                  className="w-full p-2 text-xs rounded-xl border border-[var(--border-color)] bg-white/60 focus:outline-none focus:border-[var(--primary)] text-gray-800"
                >
                  <option value="corazones">Lluvia de Corazones y Flores 🌸</option>
                  <option value="gatitos">Huellas y Caras de Gatitos 🐱</option>
                  <option value="kuromi">Poder Oscuro de Kuromi ✨</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold">Ver Asistente Virtual</span>
                <input 
                  type="checkbox" 
                  checked={mostrarMascota} 
                  onChange={(e) => { setMostrarMascota(e.target.checked); localStorage.setItem('pref-mascota', e.target.checked); }}
                  className="w-4 h-4 accent-[var(--secondary)] cursor-pointer" 
                />
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest block mb-2">Estilos de Ashley Katherine</span>
            <div className="grid grid-cols-1 gap-1.5 mb-4">
              {paletasAshley.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => handleThemeChange(p.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${theme === p.id ? 'border-[var(--secondary)] bg-[var(--primary)]/20 font-bold shadow-xs' : 'border-[var(--border-color)] bg-white/40 hover:bg-white'}`}
                >
                  <span>{p.label}</span>
                  <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: p.hex }} />
                </button>
              ))}
            </div>

            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest block mb-2">Estilos de Kenny</span>
            <div className="grid grid-cols-1 gap-1.5">
              {paletasKenny.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => handleThemeChange(p.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${theme === p.id ? 'border-[var(--primary)] bg-[var(--primary)]/20 font-bold' : 'border-[var(--border-color)] bg-white/40 hover:bg-white'}`}
                >
                  <span>{p.label}</span>
                  <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: p.hex }} />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* CONTENEDOR DE LA BITÁCORA */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-white/30 p-4 rounded-2xl backdrop-blur-md border border-[var(--border-color)]">
            <h3 className="text-2xl font-elegant font-bold">Línea de Tiempo Privada</h3>
            <span className="text-xs font-bold px-4 py-1.5 bg-white border border-[var(--border-color)] rounded-full text-[var(--text-muted)] shadow-xs">
              {fotos.length} Instantes Inmortales
            </span>
          </div>

          {message.text && (
            <div className={`p-3 rounded-xl border text-xs text-center font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {message.text}
            </div>
          )}

          {/* GRID DE GALERÍA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fotos.map(foto => (
              <div key={foto.id} className="glass-card overflow-hidden group bg-white/80 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video bg-black/5 overflow-hidden cursor-pointer" onClick={() => setActiveLightbox(foto)}>
                    <img src={`http://192.168.100.9:5000${foto.imagen_url}`} alt="Recuerdo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103" />
                    
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button onClick={(e) => { e.stopPropagation(); setActiveLightbox(foto); }} className="p-3 bg-white rounded-full text-[var(--text-main)] shadow-lg hover:scale-110 transition-transform cursor-pointer">
                        <FiMaximize2 size={16} />
                      </button>
                      {foto.usuario_id === user.id && (
                        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmation(foto.id); }} className="p-3 bg-white rounded-full text-red-600 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-2.5">
                      <span className="flex items-center gap-1"><FiUser /> Por: {foto.uploader}</span>
                      <span className="flex items-center gap-1"><FiCalendar /> {new Date(foto.fecha_subida).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-main)] leading-relaxed">
                      {foto.descripcion || 'Sin dedicatoria textual.'}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-4 pt-2 border-t border-[var(--border-color)] flex justify-between items-center bg-gray-50/50">
                  <button onClick={() => darSuperCorazon(foto.id)} className="flex items-center gap-1.5 text-xs font-bold text-[var(--secondary)] bg-white px-3 py-1.5 rounded-full border border-[var(--border-color)] hover:bg-red-50/50 transition-colors shadow-2xs cursor-pointer">
                    <FiHeart size={14} className="fill-[var(--secondary)] animate-pulse" /> Súper Corazón
                  </button>
                  <span className="text-xs font-bold text-[var(--text-muted)]">
                    {reacciones[foto.id] || 0} Reacciones
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* LIGHTBOX ESTILO FACEBOOK */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-0 md:p-6">
          <button onClick={() => setActiveLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-md cursor-pointer z-50">
            <FiX size={22} />
          </button>

          <div className="w-full h-full max-w-6xl md:h-[85vh] bg-white rounded-none md:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-black flex items-center justify-center relative p-2 h-[50vh] lg:h-full">
              <img 
                src={`http://192.168.100.9:5000${activeLightbox.imagen_url}`} 
                alt="Recuerdo expandido" 
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="lg:col-span-1 bg-white p-6 flex flex-col justify-between border-l border-gray-100 h-[35vh] lg:h-full">
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 bg-[var(--primary)] text-[var(--text-main)] font-bold rounded-full flex items-center justify-center shadow-inner">
                    {activeLightbox.uploader.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{activeLightbox.uploader}</h4>
                    <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                      <FiCalendar size={12} /> {new Date(activeLightbox.fecha_subida).toLocaleString('es-EC', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Dedicatoria</span>
                  <p className="text-sm font-medium text-gray-800 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed max-h-[22vh] overflow-y-auto">
                    {activeLightbox.descripcion || 'Este hermoso momento no necesitó palabras escritas.'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between items-center px-1 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-1 text-[var(--secondary)]">
                    <FiHeart className="fill-[var(--secondary)]" /> {reacciones[activeLightbox.id] || 0} personas les encanta esto
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => darSuperCorazon(activeLightbox.id)}
                    className="flex-1 bg-[var(--secondary)] text-white hover:opacity-90 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-transform cursor-pointer"
                  >
                    <FiHeart className="fill-white" size={14} /> Reaccionar
                  </button>
                  {activeLightbox.usuario_id === user.id && (
                    <button 
                      onClick={() => setDeleteConfirmation(activeLightbox.id)}
                      className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer border border-red-100"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMACIÓN DE ELIMINACIÓN */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <h4 className="font-elegant text-xl font-bold mb-2 text-gray-900">¿Remover de la Historia?</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">Esta acción eliminará la fotografía física del servidor de forma irreversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmation(null)} className="flex-1 border border-gray-200 py-2.5 text-xs font-bold rounded-xl hover:bg-gray-50 cursor-pointer text-gray-700">
                Conservar
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2.5 text-xs font-bold rounded-xl hover:bg-red-700 cursor-pointer shadow-md">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}