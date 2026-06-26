import React, { useState } from 'react';

export default function Dashboard() {
  // 1. ESTADOS ORIGINALES DE TUS TEMAS Y PARTÍCULAS
  const [currentTheme, setCurrentTheme] = useState('theme-kuromi'); 
  const [particles, setParticles] = useState('Estrellas Mágicas de Destello');
  const [selectedActivity, setSelectedActivity] = useState('Disponible');
  const [activeFilterMonth, setActiveFilterMonth] = useState('Todos los meses');

  // 2. ESTADOS SIMULADOS DE TU PIZARRA, PENSAMIENTOS Y BITÁCORA
  const [pizarraText, setPizarraText] = useState('');
  const [thoughtCount, setThoughtCount] = useState(20);
  const [photos, setPhotos] = useState([]);

  // 3. MAPEO DINÁMICO DE PALETAS PREMIUM (Estética avanzada y responsiva)
  const themeStyles = {
    'theme-hello-kitty': {
      bg: 'bg-[#FFF5F7]',
      card: 'bg-white border-pink-100/80 shadow-pink-100/40',
      text: 'text-pink-950',
      accentBg: 'bg-pink-50 text-pink-600 border-pink-200',
      btnAccent: 'from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 shadow-pink-200',
      badge: 'bg-pink-500/10 text-pink-600'
    },
    'theme-kuromi': {
      bg: 'bg-[#FAF5FF]',
      card: 'bg-white border-purple-100/80 shadow-purple-100/40',
      text: 'text-purple-950',
      accentBg: 'bg-purple-50 text-purple-600 border-purple-200',
      btnAccent: 'from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-purple-200',
      badge: 'bg-purple-500/10 text-purple-600'
    },
    'theme-coquette': {
      bg: 'bg-[#FFF9F6]',
      card: 'bg-white border-rose-100/70 shadow-rose-500/5',
      text: 'text-[#4A2828]',
      accentBg: 'bg-rose-50 text-rose-700 border-rose-200',
      btnAccent: 'from-rose-400 to-amber-600/70 hover:from-rose-500 hover:to-amber-700/70 shadow-rose-200',
      badge: 'bg-rose-500/10 text-rose-700'
    },
    'theme-azul': {
      bg: 'bg-[#F4F8FA]',
      card: 'bg-white border-blue-100/80 shadow-blue-100/40',
      text: 'text-blue-950',
      accentBg: 'bg-blue-50 text-blue-600 border-blue-200',
      btnAccent: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-200',
      badge: 'bg-blue-500/10 text-blue-600'
    },
    'theme-gris': {
      bg: 'bg-[#F8F9FA]',
      card: 'bg-white border-gray-200 shadow-gray-200/40',
      text: 'text-gray-900',
      accentBg: 'bg-gray-100 text-gray-700 border-gray-300',
      btnAccent: 'from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black shadow-gray-300',
      badge: 'bg-gray-200 text-gray-700'
    }
  };

  const activeStyle = themeStyles[currentTheme] || themeStyles['theme-kuromi'];

  return (
    <div className={`min-h-screen ${activeStyle.bg} ${activeStyle.text} p-4 md:p-6 font-sans transition-all duration-500 ease-in-out`}>
      
      {/* HEADER PRINCIPAL: CONTADOR DE DÍAS GLOBAL */}
      <div className="max-w-[1400px] mx-auto mb-6 flex justify-between items-center bg-white/80 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-2.5">
          <span className="text-xl animate-pulse">💖</span>
          <span className="font-extrabold text-sm md:text-base bg-gradient-to-r from-pink-500 via-purple-600 to-rose-500 bg-clip-text text-transparent">
            863 Días Juntos
          </span>
        </div>
        <div className={`font-bold px-3 py-1 rounded-full text-xs md:text-sm shadow-inner transition-all duration-300 ${activeStyle.badge}`}>
          50 % de Cercanía Live
        </div>
      </div>

      {/* REJILLA RESPONSIVA AVANZADA */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* ================= COLUMNA DE HERRAMIENTAS (SIDEBAR) ================= */}
        <div className="xl:col-span-1 space-y-6 xl:sticky xl:top-6 transition-all duration-300">
          
          {/* 1. HERRAMIENTAS DE FILTRO */}
          <div className={`${activeStyle.card} p-5 rounded-2xl border shadow-md space-y-3 transition-all duration-300`}>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
              🔍 Herramientas de Filtro
            </h4>
            <input 
              type="text" 
              placeholder="Buscar dedicatoria..." 
              className="w-full p-3 text-xs border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:bg-white transition-all duration-300"
            />
            <select 
              value={activeFilterMonth}
              onChange={(e) => setActiveFilterMonth(e.target.value)}
              className="w-full p-3 text-xs border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:bg-white transition-all duration-300"
            >
              <option>Ver todos los meses</option>
            </select>
          </div>

          {/* 2. ESTILOS VISUALES Y TEMAS (Femeninos y Masculinos) */}
          <div className={`${activeStyle.card} p-5 rounded-2xl border shadow-md space-y-4 transition-all duration-300`}>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
              ✨ Estilos Visuales
            </h4>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Partículas Flotantes</label>
              <select 
                value={particles} 
                onChange={(e) => setParticles(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:bg-white transition-all duration-300"
              >
                <option>Estrellas Mágicas de Destello</option>
                <option>Corazones Flotantes</option>
              </select>
            </div>

            {/* Temas de Katherine */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-pink-400 uppercase tracking-wider">Estilos de Katherine</label>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => setCurrentTheme('theme-hello-kitty')} 
                  className={`w-full p-3 text-xs text-left font-semibold rounded-xl border flex justify-between items-center transition-all duration-300 transform hover:scale-[1.01] ${currentTheme === 'theme-hello-kitty' ? 'bg-pink-50 border-pink-300 text-pink-700 shadow-sm' : 'bg-white border-gray-100 hover:bg-pink-50/30'}`}
                >
                  <span>Hello Kitty Soft Pink 🌸</span>
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                </button>
                <button 
                  onClick={() => setCurrentTheme('theme-kuromi')} 
                  className={`w-full p-3 text-xs text-left font-semibold rounded-xl border flex justify-between items-center transition-all duration-300 transform hover:scale-[1.01] ${currentTheme === 'theme-kuromi' ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm' : 'bg-white border-gray-100 hover:bg-purple-50/30'}`}
                >
                  <span>Kuromi Goth Mode 😈</span>
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                </button>
                <button 
                  onClick={() => setCurrentTheme('theme-coquette')} 
                  className={`w-full p-3 text-xs text-left font-semibold rounded-xl border flex justify-between items-center transition-all duration-300 transform hover:scale-[1.01] ${currentTheme === 'theme-coquette' ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm' : 'bg-white border-gray-100 hover:bg-rose-50/30'}`}
                >
                  <span>Coquette Vintage Rose 🎀</span>
                  <span className="w-2 h-2 rounded-full bg-rose-300"></span>
                </button>
              </div>
            </div>

            {/* Temas de Kenny */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-wider">Estilos de Kenny</label>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => setCurrentTheme('theme-azul')} 
                  className={`w-full p-3 text-xs text-left font-semibold rounded-xl border flex justify-between items-center transition-all duration-300 transform hover:scale-[1.01] ${currentTheme === 'theme-azul' ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' : 'bg-white border-gray-100 hover:bg-blue-50/30'}`}
                >
                  <span>Azul Corporativo</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </button>
                <button 
                  onClick={() => setCurrentTheme('theme-gris')} 
                  className={`w-full p-3 text-xs text-left font-semibold rounded-xl border flex justify-between items-center transition-all duration-300 transform hover:scale-[1.01] ${currentTheme === 'theme-gris' ? 'bg-gray-100 border-gray-400 text-gray-800 shadow-sm' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                >
                  <span>Gris Minimalista</span>
                  <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. STICKERS FLOTANTES */}
          <div className={`${activeStyle.card} p-5 rounded-2xl border shadow-md space-y-3 transition-all duration-300`}>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
              🐱 Stickers Flotantes
            </h4>
            <div className="flex flex-col gap-2">
              {['Modo Kuromi 😈', 'Gatitos Cepillándose 🐱', 'Gato Inteligente Fluffy 🥸'].map(sticker => (
                <button key={sticker} className="p-3 text-xs text-left border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-gray-50 font-medium transition-all duration-200 transform hover:translate-x-0.5">
                  {sticker}
                </button>
              ))}
              <button className="text-[10px] text-gray-400 text-center pt-1 hover:underline font-medium">Remover Stickers</button>
            </div>
          </div>

          {/* 4. TU ACTIVIDAD LIVE */}
          <div className={`${activeStyle.card} p-5 rounded-2xl border shadow-md space-y-3 transition-all duration-300`}>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400">
              ⏱️ Tu Actividad Live
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {['Disponible', 'Estudiando 📚', 'Codeando 💻', 'Extrañándote 🥺'].map(act => (
                <button 
                  key={act} 
                  onClick={() => setSelectedActivity(act)}
                  className={`p-3 text-xs rounded-xl border font-bold transition-all duration-300 transform active:scale-95 ${
                    selectedActivity === act ? 'border-pink-400 bg-pink-50 text-pink-600 shadow-sm' : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* 5. CÁPSULA DE LA FORTUNA */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-5 rounded-2xl shadow-sm border border-amber-100 text-center space-y-3 transform hover:rotate-1 transition-all duration-300">
            <p className="text-xs font-semibold text-amber-800">✨ Haz clic abajo para descubrir tu mensaje del día</p>
            <button className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-amber-200 transform hover:-translate-y-0.5 transition-all duration-300">
              Abrir Cápsula de la Fortuna 🔮
            </button>
          </div>

          {/* 6. GUARDAR INSTANTE (Formulario de Subida) */}
          <div className={`${activeStyle.card} p-5 rounded-2xl border shadow-md space-y-3 transition-all duration-300`}>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
              📷 Guardar Instante
            </h4>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center text-xs text-gray-400 bg-gray-50/50 cursor-pointer hover:bg-gray-50 hover:border-pink-300 transition-all duration-300 font-medium">
              Selecciona fotografía
            </div>
            <input 
              type="text" 
              placeholder="Dedicatoria..." 
              className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300/20"
            />
            <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black rounded-xl text-xs shadow-md shadow-pink-100 transform hover:-translate-y-0.5 transition-all duration-300">
              Publicar Recuerdo 🚀
            </button>
          </div>

        </div>

        {/* ================= COLUMNA DEL CONTENIDO PRINCIPAL ================= */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* FILA SUPERIOR: PIZARRA DEL MOMENTO + PRESENCIA LIVE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* PIZARRA DEL MOMENTO */}
            <div className={`${activeStyle.card} lg:col-span-2 p-5 rounded-2xl border shadow-md flex flex-col justify-between space-y-4 transition-all duration-300`}>
              <div className="space-y-3">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  💬 Pizarra del Momento
                </h3>
                <div className="bg-amber-50/60 border border-amber-100/70 p-4 rounded-xl relative shadow-inner">
                  <p className="text-sm font-semibold italic text-gray-700">"Hola mi niña hermosa"</p>
                  <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block text-right mt-3">
                    — Escrito por: Kenny Jahir Najera Sanchez
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <input 
                  type="text" 
                  value={pizarraText}
                  onChange={(e) => setPizarraText(e.target.value)}
                  placeholder="Escribe un mensaje en tiempo real para tu pareja..." 
                  className="flex-1 p-3.5 text-xs border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-400/10 transition-all duration-300"
                />
                <button className="px-6 py-3.5 bg-gray-900 hover:bg-black text-white font-extrabold rounded-xl text-xs shadow-md transition-all duration-300 transform active:scale-95">
                  Colgar
                </button>
              </div>
            </div>

            {/* PRESENCIA LIVE */}
            <div className={`${activeStyle.card} p-5 rounded-2xl border shadow-md flex flex-col justify-between space-y-4 transition-all duration-300`}>
              <div className="space-y-3">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  🛰️ Presencia Live
                </h3>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/60 border border-gray-100/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <strong>Kenny:</strong>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-bold">{selectedActivity}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/60 border border-gray-100/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                      <strong>Katherine:</strong>
                    </div>
                    <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">Disponible 🌸</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => setThoughtCount(prev => prev + 1)}
                  className={`w-full py-3.5 bg-gradient-to-r ${activeStyle.btnAccent} text-white font-black rounded-xl text-xs shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300`}
                >
                  ❤️ ¡Te estoy pensando!
                </button>
                <span className="text-[10px] text-gray-400 block text-center font-bold tracking-wide uppercase">
                  Se han pensado {thoughtCount} veces hoy
                </span>
              </div>
            </div>

          </div>

          {/* BITÁCORA COLECTIVA */}
          <div className={`${activeStyle.card} p-6 rounded-2xl border shadow-md space-y-4 transition-all duration-300`}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider">
                🖼️ Bitácora Colectiva
              </h3>
              <span className="text-xs bg-gray-100 font-extrabold px-3 py-1 rounded-full text-gray-500">
                0 Instantes Filtrados
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px] items-center justify-center text-center text-gray-400 italic text-xs">
              {photos.length === 0 ? (
                <p className="col-span-full font-medium">Aún no hay fotos guardadas para este mes en tu base de datos de Neon.</p>
              ) : (
                photos.map(photo => (
                  <div key={photo.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300">
                    {/* Renderizado automático */}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}