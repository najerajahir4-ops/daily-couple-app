import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { FiHeart, FiCamera, FiGrid, FiLogOut, FiTrash2, FiMaximize2, FiX } from 'react-icons/fi';

export default function Dashboard({ user, onLogout }) {
  const { theme, changeTheme } = useContext(ThemeContext);
  const [fotos, setFotos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Estados de control de la interfaz (UI)
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Fecha de aniversario para el contador dinámico de días juntos
  const fechaEspecial = new Date('2024-02-14T00:00:00'); 
  const [diasJuntos, setDiasJuntos] = useState(0);

  useEffect(() => {
    const calcularDias = () => {
      const diferencia = new Date().getTime() - fechaEspecial.getTime();
      setDiasJuntos(Math.floor(diferencia / (1000 * 3600 * 24)));
    };
    calcularDias();
    fetchPhotos();
  }, []);

  // Obtener las fotos desde la IP de tu computadora
  const fetchPhotos = async () => {
    try {
      const res = await fetch('http://192.168.100.9:5000/api/photos');
      const data = await res.json();
      if (res.ok) setFotos(data);
    } catch (err) {
      console.error("Error cargando fotos de la base de datos");
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

  // Subir la nueva fotografía apuntando a la IP de la red
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
        showNotice('success', 'Recuerdo añadido a la galería diaria');
      } else {
        showNotice('error', newPhoto.error);
      }
    } catch (err) {
      showNotice('error', 'Error al procesar la subida');
    } finally {
      setLoadingUpload(false);
    }
  };

  // Confirmar y procesar eliminación física en el servidor central IP
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
        showNotice('success', 'Foto eliminada permanentemente');
      } else {
        const errData = await res.json();
        showNotice('error', errData.error);
      }
    } catch (err) {
      showNotice('error', 'No se pudo completar la acción');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  // Cambiar de tema visual y guardarlo en la base de datos remota
  const handleThemeChange = async (themeId) => {
    changeTheme(themeId);
    try {
      await fetch('http://192.168.100.9:5000/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: user.id, color_tema: themeId })
      });
    } catch (e) {
      console.error("Error persistiendo el tema elegido");
    }
  };

  const showNotice = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const paletasAshley = [
    { id: 'theme-ashley-pink', label: 'Rosa Pastel', hex: '#FFB6D9' },
    { id: 'theme-ashley-purple', label: 'Lila Púrpura', hex: '#C77DFF' },
    { id: 'theme-ashley-coral', label: 'Coral Melocotón', hex: '#FFB6A3' },
    { id: 'theme-ashley-mint', label: 'Mint Femenino', hex: '#98D8C8' },
    { id: 'theme-ashley-gold', label: 'Dorado Elegante', hex: '#D4AF37' }
  ];

  const paletasKenny = [
    { id: 'theme-kenny-blue', label: 'Azul Profesional', hex: '#1E3A8A' },
    { id: 'theme-kenny-dark', label: 'Gris Moderno', hex: '#1F2937' },
    { id: 'theme-kenny-green', label: 'Verde Minimalista', hex: '#064E3B' }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500 pb-16">
      
      {/* HEADER DE LA APLICACIÓN */}
      <header className="border-b border-[var(--border-color)] bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-elegant font-bold tracking-wider text-[var(--text-main)]">Daily Couple</h2>
        
        {/* Contador de Tiempo Juntos */}
        <div className="flex items-center gap-2.5 bg-[var(--primary)]/10 px-5 py-2 rounded-full border border-[var(--primary)]/20 shadow-xs">
          <FiHeart className="text-[var(--secondary)] fill-[var(--primary)] animate-pulse" size={16} />
          <span className="text-sm font-medium tracking-wide">{diasJuntos} Días Juntos</span>
        </div>

        {/* Información de Sesión Activa */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold leading-none">{user.nombre}</p>
            <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase font-medium">Conectado</span>
          </div>
          <button onClick={() => onLogout()} className="text-[var(--text-muted)] hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer" title="Cerrar espacio">
            <FiLogOut size={18} />
          </button>
        </div>
      </header>

      {/* ÁREA CENTRAL DE TRABAJO */}
      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* COLUMNA LATERAL (HERRAMIENTAS Y TEMAS) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* SECTOR DE CARGA DE FOTOS */}
          <div className="card-organic p-6">
            <h3 className="font-elegant text-lg font-semibold mb-4 flex items-center gap-2">
              <FiCamera className="text-[var(--primary)]" /> Capturar Momento
            </h3>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <label className="block border-2 border-dashed border-[var(--border-color)] rounded-2xl p-4 text-center cursor-pointer hover:border-[var(--primary)] bg-white/40 transition-colors">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                ) : (
                  <p className="text-xs text-[var(--text-muted)] py-4">Haz clic para buscar foto del día (Máx 5MB)</p>
                )}
              </label>

              <input 
                type="text" 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Escribe una descripción..."
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary)] bg-white/50 text-[var(--text-main)]"
              />

              <button 
                type="submit" 
                disabled={loadingUpload || !selectedFile} 
                className="w-full btn-primary text-xs uppercase tracking-wider font-semibold py-3 cursor-pointer disabled:opacity-40"
              >
                {loadingUpload ? 'Guardando...' : 'Subir Recuerdo'}
              </button>
            </form>
          </div>

          {/* CONTROL DE SELECCIÓN DE PALETAS EN TIEMPO REAL */}
          <div className="card-organic p-6">
            <h3 className="font-elegant text-lg font-semibold mb-3 flex items-center gap-2">
              <FiGrid className="text-[var(--primary)]" /> Panel Estético
            </h3>
            
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest block mb-2">Para Ashley Katherine</span>
            <div className="grid grid-cols-1 gap-1.5 mb-4">
              {paletasAshley.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => handleThemeChange(p.id)}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs text-left cursor-pointer transition-all ${theme === p.id ? 'border-[var(--primary)] bg-[var(--primary)]/10 font-medium' : 'border-[var(--border-color)] hover:bg-gray-50'}`}
                >
                  <span>{p.label}</span>
                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: p.hex }} />
                </button>
              ))}
            </div>

            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest block mb-2">Para Kenny</span>
            <div className="grid grid-cols-1 gap-1.5">
              {paletasKenny.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => handleThemeChange(p.id)}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs text-left cursor-pointer transition-all ${theme === p.id ? 'border-[var(--primary)] bg-[var(--primary)]/10 font-medium' : 'border-[var(--border-color)] hover:bg-gray-50'}`}
                >
                  <span>{p.label}</span>
                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: p.hex }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN PRINCIPAL: GRIDS DE LA GALERÍA DIARIA CON LINK DE LA IP */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-elegant font-semibold">Bitácora Diaria</h3>
            <span className="text-xs px-3 py-1 border border-[var(--border-color)] bg-white rounded-full text-[var(--text-muted)] font-medium">
              {fotos.length} Recuerdos guardados
            </span>
          </div>

          {message.text && (
            <div className={`mb-6 p-3 rounded-xl border text-xs text-center font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fotos.map(foto => (
              <div key={foto.id} className="card-organic overflow-hidden group bg-white">
                <div className="relative aspect-video bg-gray-50 overflow-hidden">
                  {/* Se mapea la imagen usando tu IP local */}
                  <img src={`http://192.168.100.9:5000${foto.imagen_url}`} alt="Recuerdo" className="w-full h-full object-cover" />
                  
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => setActiveLightbox(foto.imagen_url)} className="bg-white/90 hover:bg-white text-[var(--text-main)] p-2.5 rounded-xl backdrop-blur-xs shadow-xs cursor-pointer">
                      <FiMaximize2 size={13} />
                    </button>
                    {foto.usuario_id === user.id && (
                      <button onClick={() => setDeleteConfirmation(foto.id)} className="bg-white/90 hover:bg-red-50 text-red-600 p-2.5 rounded-xl backdrop-blur-xs shadow-xs cursor-pointer">
                        <FiTrash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-semibold tracking-wide uppercase mb-1.5">
                    <span>Subido por: {foto.uploader}</span>
                    <span>{new Date(foto.fecha_subida).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--text-main)] leading-relaxed">
                    {foto.descripcion || 'Sin descripción detallada.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL 1: LIGHTBOX MAPEADO A TU IP */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setActiveLightbox(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-md cursor-pointer">
            <FiX size={20} />
          </button>
          <img src={`http://192.168.100.9:5000${activeLightbox}`} alt="Recuerdo gigante" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain" />
        </div>
      )}

      {/* MODAL 2: CONFIRMACIÓN DE ELIMINACIÓN */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-[var(--border-color)]">
            <h4 className="font-elegant text-xl font-bold mb-2 text-[var(--text-main)]">¿Remover Recuerdo?</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-5">Esta acción eliminará la fotografía física del servidor de forma irreversible. No se podrá recuperar.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmation(null)} className="flex-1 border border-[var(--border-color)] py-2.5 text-xs font-semibold rounded-xl hover:bg-gray-50 cursor-pointer">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2.5 text-xs font-semibold rounded-xl hover:bg-red-700 cursor-pointer">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}