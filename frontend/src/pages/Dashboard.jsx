import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { 
  FiHeart, FiCamera, FiLogOut, FiTrash2, FiMaximize2, FiX, 
  FiStar, FiSettings, FiCalendar, FiUser, FiMessageSquare, FiActivity, FiSmile, FiSearch, FiFilter 
} from 'react-icons/fi';

const VectorParticle = ({ type }) => {
  if (type === 'gatitos') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--secondary)" opacity="0.6">
        <path d="M12 21.5c-1.35 0-2.52-.74-3.14-1.83A4.48 4.48 0 0 1 4.5 15.5c0-2.5 2-4.5 4.5-4.5.35 0 .69.04 1.02.12C10.43 9.44 11.13 8 12 8s1.57 1.44 1.98 3.12c.33-.08.67-.12 1.02-.12 2.5 0 4.5 2 4.5 4.5 0 1.76-.1 3.2-.74 4.17-.62 1.09-1.79 1.83-3.14 1.83h-3.76z" />
        <circle cx="9.5" cy="14.5" r="1" fill="white" />
        <circle cx="14.5" cy="14.5" r="1" fill="white" />
      </svg>
    );
  }
  if (type === 'kuromi') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--primary)" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary)" opacity="0.7">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
};

export default function Dashboard({ user, onLogout }) {
  const { theme, changeTheme } = useContext(ThemeContext);
  const [fotos, setFotos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Motores de Filtros y Búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');

  // Ajustes de Stickers avanzados (Kuromi, Gatoo, GatonInteligente, GatobInteliente)
  const [stickerElegido, setStickerElegido] = useState(localStorage.getItem('pref-sticker') || 'none');
  const [notaCompartida, setNotaCompartida] = useState(localStorage.getItem('shared-love-note') || '¡Hola mi amor! Déjame una nota aquí... 💖');
  const [autorNota, setAutorNota] = useState(localStorage.getItem('shared-love-author') || 'Sistema');
  const [inputNota, setInputNota] = useState('');
  const [estadoActual, setEstadoActual] = useState(localStorage.getItem(`status-${user.id}`) || 'Disponible');
  const [contadorPensamientos, setContadorPensamientos] = useState(parseInt(localStorage.getItem('shared-thinking-counter')) || 0);
  const [efectoCorazonPulso, setEfectoCorazonPulso] = useState(false);

  const [tipoParticula, setTipoParticula] = useState(localStorage.getItem('pref-particula') || 'corazones');
  const [fraseFortuna, setFraseFortuna] = useState('Haz clic abajo para descubrir tu mensaje del día ✨');
  const [reacciones, setReacciones] = useState(JSON.parse(localStorage.getItem('love-reactions')) || {});

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

    const handleStorageChange = () => {
      setNotaCompartida(localStorage.getItem('shared-love-note') || '¡Hola mi amor!');
      setAutorNota(localStorage.getItem('shared-love-author') || 'Sistema');
      setContadorPensamientos(parseInt(localStorage.getItem('shared-thinking-counter')) || 0);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [tipoParticula]);

  const generarParticulas = () => {
    const nuevasParticulas = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${7 + Math.random() * 5}s`,
      scale: 0.6 + Math.random() * 0.8
    }));
    setParticles(nuevasParticulas);
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
      console.error("Error guardando tema preferido");
    }
  };

  const guardarNuevaNota = (e) => {
    e.preventDefault();
    if (!inputNota.trim()) return;
    localStorage.setItem('shared-love-note', inputNota);
    localStorage.setItem('shared-love-author', user.nombre);
    setNotaCompartida(inputNota);
    setAutorNota(user.nombre);
    setInputNota('');
    setMessage({ type: 'success', text: '¡Nota colgada en la pizarra!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const cambiarEstadoActividad = (nuevoEstado) => {
    setEstadoActual(nuevoEstado);
    localStorage.setItem(`status-${user.id}`, nuevoEstado);
  };

  const enviarPensamiento = () => {
    const nuevoTotal = contadorPensamientos + 1;
    setContadorPensamientos(nuevoTotal);
    localStorage.setItem('shared-thinking-counter', nuevoTotal);
    setEfectoCorazonPulso(true);
    setTimeout(() => setEfectoCorazonPulso(false), 2500);
  };

  const abrirFortuna = () => {
    const fortunas = [
      "Kenny dice: Eres la profesora de inglés más hermosa del universo entero 📚💖",
      "Reto de hoy: Envíale una nota de voz a Kenny diciéndole tu palabra favorita en inglés.",
      "Tu sonrisa tiene el poder de alegrarle el día entero a Kenny, incluso a la distancia 🥰",
      "Cupón válido por un abrazo gigante y un chocolate la próxima vez que se vean 🍫",
      "Kuromi aprueba oficialmente la hermosa relación que tienes con tu ingeniero número 1 😈💜"
    ];
    setFraseFortuna(fortunas[Math.floor(Math.random() * fortunas.length)]);
  };

  const fetchPhotos = async () => {
    try {
      const res = await fetch('http://192.168.100.9:5000/api/photos');
      const data = await res.json();
      if (res.ok) setFotos(data);
    } catch (err) {
      console.error("Error cargando bitácora remota");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
      }
    } catch (err) {
      console.error(err);
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
      if (res.ok) setFotos(fotos.filter(f => f.id !== deleteConfirmation));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const darSuperCorazon = (fotoId) => {
    const nuevosVotos = { ...reacciones, [fotoId]: (reacciones[fotoId] || 0) + 1 };
    setReacciones(nuevosVotos);
    localStorage.setItem('love-reactions', JSON.stringify(nuevosVotos));
  };

  const fotosFiltradas = fotos.filter(foto => {
    const coincideTexto = foto.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
    const fecha = new Date(foto.fecha_subida);
    const coincideMes = filterMonth === 'all' || fecha.getMonth().toString() === filterMonth;
    return coincideTexto && coincideMes;
  });

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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500 pb-32 relative overflow-x-hidden font-sans font-medium">
      
      {particles.map(p => (
        <span key={p.id} className="floating-particle" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, transform: `scale(${p.scale})` }}>
          <VectorParticle type={tipoParticula} />
        </span>
      ))}

      {efectoCorazonPulso && (
        <div className="fixed inset-0 z-40 bg-pink-500/10 pointer-events-none animate-overlay-smooth flex items-center justify-center">
          <div className="text-8xl animate-bounce opacity-40">💖</div>
        </div>
      )}

      {/* AISLAMIENTO DE ANIMACIÓN CONTRA INTERPOLACIÓN FIXED */}
      <div className="animate-page-smooth">
        
        {/* HEADER */}
        <header className="border-b border-[var(--border-color)] bg-white/40 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between transition-colors duration-500">
          <h2 className="text-2xl font-elegant font-bold tracking-wider text-[var(--text-main)] flex items-center gap-2">
            Daily Couple <FiStar className="text-[var(--primary)] animate-spin" size={16} />
          </h2>
          <div className="flex items-center gap-3 bg-[var(--primary)]/20 px-5 py-2 rounded-2xl border border-[var(--primary)]/30 shadow-xs">
            <FiHeart className="text-[var(--secondary)] fill-[var(--secondary)] animate-bounce" size={16} />
            <span className="text-xs font-bold font-elegant">{diasJuntos} Días Juntos</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold opacity-80 hidden sm:inline">{user.nombre}</span>
            <button onClick={onLogout} className="text-gray-400 hover:text-red-500 p-2 rounded-xl bg-white/60 transition-all cursor-pointer"><FiLogOut size={16} /></button>
          </div>
        </header>

        {/* COMPONENTES DE INTERFAZ */}
        <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-20 pb-12">
          
          <div className="lg:col-span-1 space-y-6">
            
            {/* HERRAMIENTAS DE FILTRO */}
            <div className="glass-card p-5 space-y-3 animate-card-smooth" style={{ animationDelay: '0.05s' }}>
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block">Herramientas de Filtro</span>
              <div className="relative">
                <input 
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar dedicatoria..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-white focus:outline-none focus:border-[var(--primary)] text-gray-800"
                />
                <FiSearch className="absolute left-2.5 top-3 text-gray-400" size={12} />
              </div>
              <div className="relative">
                <select 
                  value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-white text-gray-700 focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="all">Ver todos los meses</option>
                  <option value="0">Enero</option>
                  <option value="1">Febrero (Aniversario) 🌸</option>
                  <option value="2">Marzo</option>
                  <option value="3">Abril</option>
                  <option value="4">Mayo</option>
                  <option value="5">Junio</option>
                  <option value="6">Julio</option>
                  <option value="7">Agosto</option>
                  <option value="8">Septiembre</option>
                  <option value="9">Octubre</option>
                  <option value="10">Noviembre</option>
                  <option value="11">Diciembre</option>
                </select>
                <FiFilter className="absolute left-2.5 top-3 text-gray-400" size={12} />
              </div>
            </div>

            {/* PANEL DE TEMAS */}
            <div className="glass-card p-5 space-y-4 animate-card-smooth" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-elegant text-sm font-bold flex items-center gap-1.5 text-[var(--text-main)]">
                <FiSettings className="text-[var(--secondary)]" /> Estilos Visuales
              </h3>
              
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Partículas Flotantes</label>
                <select value={tipoParticula} onChange={(e) => { setTipoParticula(e.target.value); localStorage.setItem('pref-particula', e.target.value); }} className="w-full p-2 text-xs rounded-xl border border-[var(--border-color)] bg-white text-gray-800 focus:outline-none">
                  <option value="corazones">Lluvia de Corazones Vectoriales</option>
                  <option value="gatitos">Pizcas de Siluetas de Gato</option>
                  <option value="kuromi">Estrellas Mágicas de Destello</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1.5">Estilos de Katherine</span>
                <div className="grid grid-cols-1 gap-1">
                  {paletasAshley.map(p => (
                    <button key={p.id} onClick={() => handleThemeChange(p.id)} className={`flex items-center justify-between p-2 rounded-xl border text-xs text-left cursor-pointer transition-all duration-300 ${theme === p.id ? 'border-[var(--secondary)] bg-[var(--primary)]/20 font-bold' : 'border-[var(--border-color)] bg-white/40'}`}>
                      <span>{p.label}</span>
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: p.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block mb-1.5">Estilos de Kenny</span>
                <div className="grid grid-cols-1 gap-1">
                  {paletasKenny.map(p => (
                    <button key={p.id} onClick={() => handleThemeChange(p.id)} className={`flex items-center justify-between p-2 rounded-xl border text-xs text-left cursor-pointer transition-all duration-300 ${theme === p.id ? 'border-[var(--primary)] bg-[var(--primary)]/20 font-bold' : 'border-[var(--border-color)] bg-white/40'}`}>
                      <span>{p.label}</span>
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: p.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* EXPANDIDO: MÚLTIPLES STICKERS SELECCIONABLES EN EL DASHBOARD */}
            <div className="glass-card p-5 space-y-3 animate-card-smooth" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-elegant text-sm font-bold flex items-center gap-1.5 text-[var(--text-main)]"><FiSmile className="text-[var(--secondary)]" /> Stickers Flotantes</h3>
              <div className="grid grid-cols-1 gap-1.5">
                <button onClick={() => { setStickerElegido('kuromi'); localStorage.setItem('pref-sticker', 'kuromi'); }} className={`p-2 rounded-xl text-left text-xs font-semibold border cursor-pointer transition-all duration-300 ${stickerElegido === 'kuromi' ? 'border-[var(--secondary)] bg-[var(--primary)]/20 font-bold' : 'bg-white border-[var(--border-color)]'}`}>Modo Kuromi 😈</button>
                <button onClick={() => { setStickerElegido('gatoo'); localStorage.setItem('pref-sticker', 'gatoo'); }} className={`p-2 rounded-xl text-left text-xs font-semibold border cursor-pointer transition-all duration-300 ${stickerElegido === 'gatoo' ? 'border-[var(--secondary)] bg-[var(--primary)]/20 font-bold' : 'bg-white border-[var(--border-color)]'}`}>Gatitos Cepillándose (Babeando) 🐱</button>
                <button onClick={() => { setStickerElegido('gatoninteligente'); localStorage.setItem('pref-sticker', 'gatoninteligente'); }} className={`p-2 rounded-xl text-left text-xs font-semibold border cursor-pointer transition-all duration-300 ${stickerElegido === 'gatoninteligente' ? 'border-[var(--secondary)] bg-[var(--primary)]/20 font-bold' : 'bg-white border-[var(--border-color)]'}`}>Gato Inteligente Fluffy (☝️🤓)</button>
                <button onClick={() => { setStickerElegido('gatobinteliente'); localStorage.setItem('pref-sticker', 'gatobinteliente'); }} className={`p-2 rounded-xl text-left text-xs font-semibold border cursor-pointer transition-all duration-300 ${stickerElegido === 'gatobinteliente' ? 'border-[var(--secondary)] bg-[var(--primary)]/20 font-bold' : 'bg-white border-[var(--border-color)]'}`}>Gato Inteligente Pink Glasses (☝️🤓)</button>
                <button onClick={() => { setStickerElegido('none'); localStorage.setItem('pref-sticker', 'none'); }} className="p-1.5 rounded-xl text-center text-[10px] font-bold text-gray-400 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">Remover Stickers</button>
              </div>
            </div>

            {/* ACTIVIDAD LIVE */}
            <div className="glass-card p-5 space-y-3 animate-card-smooth" style={{ animationDelay: '0.3s' }}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] block">Tu Actividad Live</span>
              <div className="grid grid-cols-2 gap-1.5">
                {['Disponible', 'Estudiando 📚', 'Codeando 💻', 'Extrañándote 🥺'].map(st => (
                  <button key={st} onClick={() => cambiarEstadoActividad(st)} className={`p-2 rounded-lg text-left text-[11px] font-medium border cursor-pointer transition-colors duration-200 ${estadoActual === st ? 'border-[var(--primary)] bg-[var(--primary)]/20 font-bold' : 'bg-white/50 border-[var(--border-color)]'}`}>{st}</button>
                ))}
              </div>
            </div>

            {/* FORTUNA BOX */}
            <div className="glass-card p-5 text-center bg-gradient-to-tr from-[var(--primary)]/5 to-transparent animate-card-smooth" style={{ animationDelay: '0.4s' }}>
              <p className="text-xs font-medium bg-white/90 p-3 rounded-xl border border-[var(--border-color)] text-gray-700 min-h-[50px] flex items-center justify-center">{fraseFortuna}</p>
              <button onClick={abrirFortuna} className="mt-3 w-full btn-kawaii text-[11px] font-bold py-2 rounded-xl cursor-pointer">Abrir Cápsula de la Fortuna</button>
            </div>

            {/* SUBIR RECUERDO */}
            <div className="glass-card p-5 animate-card-smooth" style={{ animationDelay: '0.5s' }}>
              <h3 className="font-elegant text-sm font-bold mb-3 flex items-center gap-1"><FiCamera /> Guardar Instante</h3>
              <form onSubmit={handleUploadSubmit} className="space-y-3">
                <label className="block border-2 border-dashed border-[var(--border-color)] rounded-xl p-3 text-center cursor-pointer hover:border-[var(--primary)] bg-white/20 transition-all">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  {previewUrl ? <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded-lg object-contain animate-pop-smooth" /> : <p className="text-[11px] font-medium text-[var(--text-muted)] py-2">Selecciona fotografía</p>}
                </label>
                <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Dedicatoria..." className="w-full p-2.5 text-xs rounded-xl border border-[var(--border-color)] bg-white/60 text-gray-800" />
                <input type="submit" disabled={loadingUpload || !selectedFile} value={loadingUpload ? 'Subiendo...' : 'Publicar Recuerdo'} className="w-full btn-kawaii text-[11px] uppercase font-bold tracking-wider cursor-pointer" />
              </form>
            </div>

          </div>

          {/* PIZARRA COMPARTIDA Y GRID DERECHO */}
          <div className="lg:col-span-3 space-y-6">

            <div className="p-6 rounded-3xl bg-gradient-to-r from-[var(--primary)]/30 to-white/20 backdrop-blur-xl border border-[var(--border-color)] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 animate-card-smooth" style={{ animationDelay: '0.2s' }}>
              <div className="md:col-span-2 space-y-3">
                <h4 className="font-elegant text-base font-bold flex items-center gap-1.5 text-[var(--text-main)]"><FiMessageSquare className="text-[var(--secondary)]" /> Pizarra del Momento</h4>
                <div className="bg-white/90 p-4 rounded-2xl border border-[var(--border-color)] relative overflow-hidden shadow-2xs">
                  <p className="text-xs font-semibold text-gray-700 italic leading-relaxed">"{notaCompartida}"</p>
                  <span className="text-[9px] font-bold text-[var(--secondary)] block mt-2 uppercase text-right">— Escrito por: {autorNota}</span>
                </div>
                <form onSubmit={guardarNuevaNota} className="flex gap-2">
                  <input type="text" value={inputNota} onChange={(e) => setInputNota(e.target.value)} placeholder="Escribe un mensaje en tiempo real para tu pareja..." className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white/80 focus:outline-none text-gray-800 shadow-3xs" />
                  <input type="submit" value="Colgar" className="px-4 py-2 bg-[var(--text-main)] text-white text-xs font-bold rounded-xl cursor-pointer" />
                </form>
              </div>

              <div className="md:col-span-1 flex flex-col justify-between bg-white/60 p-4 rounded-2xl border border-[var(--border-color)] shadow-3xs">
                <div className="space-y-2">
                  <h4 className="font-elegant text-xs font-bold uppercase text-[var(--text-muted)] flex items-center gap-1"><FiActivity size={12} /> Presencia Live</h4>
                  <div className="text-[11px] space-y-1 text-gray-600 font-medium">
                    <p>🟢 <span className="font-bold">Kenny:</span> {localStorage.getItem('status-1') || 'Disponible'}</p>
                    <p>🌸 <span className="font-bold">Katherine:</span> {localStorage.getItem('status-2') || 'Disponible'}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 text-center">
                  <button onClick={enviarPensamiento} className="w-full py-2.5 bg-[var(--secondary)] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                    <FiHeart className="fill-white" size={12} /> ¡Te estoy pensando!
                  </button>
                  <span className="text-[10px] text-gray-400 font-bold block mt-1.5">Se han pensado {contadorPensamientos} veces</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/30 p-4 rounded-2xl border border-[var(--border-color)] animate-card-smooth" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-elegant font-bold">Bitácora Colectiva</h3>
              <span className="text-xs font-bold px-4 py-1.5 bg-white border border-[var(--border-color)] rounded-full text-[var(--text-muted)]">{fotosFiltradas.length} Instantes Filtrados</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-card-smooth" style={{ animationDelay: '0.4s' }}>
              {fotosFiltradas.map((foto, index) => (
                <div 
                  key={foto.id} 
                  className="glass-card overflow-hidden bg-white/90 flex flex-col justify-between shadow-xs transition-all duration-300 hover:scale-[1.01]"
                  style={{ animationDelay: `${0.4 + index * 0.04}s` }}
                >
                  <div className="relative w-full aspect-square bg-neutral-900 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => setActiveLightbox(foto)}>
                    <img src={`http://192.168.100.9:5000${foto.imagen_url}`} alt="Recuerdo" className="max-w-full max-h-full object-contain" />
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <button onClick={(e) => { e.stopPropagation(); setActiveLightbox(foto); }} className="p-2 bg-white/90 rounded-full text-gray-700 shadow-md"><FiMaximize2 size={12} /></button>
                      {foto.usuario_id === user.id && <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmation(foto.id); }} className="p-2 bg-white/90 rounded-full text-red-600 shadow-md"><FiTrash2 size={12} /></button>}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">
                        <span className="flex items-center gap-1"><FiUser size={10} /> {foto.uploader}</span>
                        <span className="flex items-center gap-1"><FiCalendar size={10} /> {new Date(foto.fecha_subida).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs font-medium text-gray-800 leading-relaxed">{foto.descripcion || 'Sin descripción.'}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex justify-between items-center">
                      <button onClick={() => darSuperCorazon(foto.id)} className="flex items-center gap-1 text-[11px] font-bold text-[var(--secondary)] bg-white px-3 py-1 rounded-full border border-[var(--border-color)] hover:bg-red-50 cursor-pointer shadow-2xs transition-colors"><FiHeart size={12} className="fill-[var(--secondary)]" /> Súper Amor</button>
                      <span className="text-[11px] font-bold text-[var(--text-muted)]">{reacciones[foto.id] || 0} Reacciones</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>

        {/* VISOR LIGHTBOX */}
        {activeLightbox && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-0 md:p-4 animate-overlay-smooth">
            <button onClick={() => setActiveLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 p-2.5 rounded-full backdrop-blur-md cursor-pointer z-50"><FiX size={20} /></button>
            <div className="w-full h-full max-w-6xl md:h-[85vh] bg-white rounded-none md:rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 shadow-2xl animate-pop-smooth">
              <div className="lg:col-span-2 bg-neutral-950 flex items-center justify-center relative p-3 h-[50vh] lg:h-full">
                <img src={`http://192.168.100.9:5000${activeLightbox.imagen_url}`} alt="Visualización" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="lg:col-span-1 bg-white p-5 flex flex-col justify-between h-[40vh] lg:h-full">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                    <div className="w-9 h-9 bg-[var(--primary)] text-[var(--text-main)] font-bold rounded-full flex items-center justify-center text-xs shadow-xs">{activeLightbox.uploader.charAt(0)}</div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{activeLightbox.uploader}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5"><FiCalendar size={10} /> {new Date(activeLightbox.fecha_subida).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Dedicatoria Privada</span>
                    <p className="text-xs font-medium text-gray-700 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 leading-relaxed max-h-[18vh] overflow-y-auto">{activeLightbox.descripcion || 'Sin descripción.'}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--secondary)]"><FiHeart className="fill-[var(--secondary)]" /> A {reacciones[activeLightbox.id] || 0} personas les encanta</span>
                  <button onClick={() => darSuperCorazon(activeLightbox.id)} className="w-full bg-[var(--secondary)] text-white py-2.5 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity shadow-md"><FiHeart className="fill-white" size={12} /> Dar Súper Corazón</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ELIMINAR */}
        {deleteConfirmation && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-overlay-smooth">
            <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-xl border border-gray-100 animate-pop-smooth">
              <h4 className="font-elegant text-base font-bold mb-1 text-gray-900">¿Remover Recuerdo?</h4>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setDeleteConfirmation(null)} className="flex-1 border border-gray-200 py-2 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">Cancelar</button>
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2 text-xs font-bold rounded-xl cursor-pointer">Eliminar</button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* RENDERIZADORES DE STICKERS TOTALMENTE CORREGIDOS CON SOPORTE COMPLETO PARA LOS GATOS INMUNE-SCROLL */}
      {stickerElegido === 'kuromi' && (
        <div className="fixed bottom-6 right-6 w-32 z-50 bg-white/90 p-1.5 rounded-2xl border border-[var(--border-color)] shadow-xl animate-pop-smooth pointer-events-none">
          <img src="/kuromi.jpg" alt="Kuromi" className="w-full rounded-xl object-contain" />
        </div>
      )}
      {stickerElegido === 'gatoo' && (
        <div className="fixed bottom-6 right-6 w-32 z-50 bg-white/90 p-1.5 rounded-2xl border border-[var(--border-color)] shadow-xl animate-pop-smooth pointer-events-none">
          <img src="/gatoo.jpg" alt="Gatos Babeando" className="w-full rounded-xl object-contain" />
        </div>
      )}
      {stickerElegido === 'gatoninteligente' && (
        <div className="fixed bottom-6 right-6 w-32 z-50 bg-white/90 p-1.5 rounded-2xl border border-[var(--border-color)] shadow-xl animate-pop-smooth pointer-events-none">
          <img src="/gatoninteligente.jpg" alt="Gato Inteligente Fluffy" className="w-full rounded-xl object-contain" />
        </div>
      )}
      {stickerElegido === 'gatobinteliente' && (
        <div className="fixed bottom-6 right-6 w-32 z-50 bg-white/90 p-1.5 rounded-2xl border border-[var(--border-color)] shadow-xl animate-pop-smooth pointer-events-none">
          <img src="/gatobinteliente.jpg" alt="Gato Inteligente Pink Glasses" className="w-full rounded-xl object-contain" />
        </div>
      )}

    </div>
  );
}