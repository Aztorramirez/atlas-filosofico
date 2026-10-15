import React, { useState, useMemo, useEffect } from 'react';
import filosofosData from './data/filosofos.json';
import TimelineFlow from './components/TimelineFlow';
import GeographicView from './components/GeographicView';
import FloatingPopover from './components/FloatingPopover';
import BiographyModal from './components/BiographyModal';
import { Compass, Clock, Globe, Search, Sparkles, Layers, GraduationCap, ShieldCheck, BookOpen } from 'lucide-react';

const LEVELS = [
  {
    id: 1,
    label: 'Canon',
    name: 'Canon Fundamental',
    description: 'Los 16 autores axiales e indispensables de la historia del pensamiento',
    icon: ShieldCheck,
  },
  {
    id: 2,
    label: 'Universitario',
    name: 'Universitario',
    description: 'Canon + figuras universitarias, corrientes y debates clave',
    icon: BookOpen,
  },
  {
    id: 3,
    label: 'Académico',
    name: 'Académico',
    description: 'Panorama exhaustivo completo con todos los pensadores, comentadores y científicos',
    icon: GraduationCap,
  },
];

export default function App() {
  const [filosofos] = useState(filosofosData);
  const [selectedLevel, setSelectedLevel] = useState(1); // 1 = Canon (default), 2 = Universitario, 3 = Académico
  const [activeView, setActiveView] = useState('cronologica'); // 'cronologica' | 'geografica'
  const [selectedFilosofo, setSelectedFilosofo] = useState(null);
  const [modalFilosofo, setModalFilosofo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Filtrado acumulativo por Nivel de Divulgación Progresiva: autor.nivel <= selectedLevel
  const levelFilteredFilosofos = useMemo(() => {
    return filosofos.filter((f) => (f.nivel || 1) <= selectedLevel);
  }, [filosofos, selectedLevel]);

  // 2. Filtrado reactivo adicional si el usuario utiliza el buscador
  const filteredFilosofos = useMemo(() => {
    if (!searchTerm.trim()) return levelFilteredFilosofos;
    const term = searchTerm.toLowerCase();
    return levelFilteredFilosofos.filter(
      (f) =>
        f.nombre.toLowerCase().includes(term) ||
        f.epoca_año.toLowerCase().includes(term) ||
        (f.coordenadas?.lugar && f.coordenadas.lugar.toLowerCase().includes(term))
    );
  }, [levelFilteredFilosofos, searchTerm]);

  // Si el filósofo seleccionado queda fuera del nivel curricular activo, cerramos el popover para evitar referencias huérfanas
  useEffect(() => {
    if (selectedFilosofo && (selectedFilosofo.nivel || 1) > selectedLevel) {
      setSelectedFilosofo(null);
    }
  }, [selectedLevel, selectedFilosofo]);

  // Clic simple: muestra el popover flotante con el resumen
  const handleSelectFilosofo = (filosofo) => {
    setSelectedFilosofo(filosofo);
  };

  // Doble clic: abre la biografía completa
  const handleOpenBiography = (filosofo) => {
    setModalFilosofo(filosofo);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Barra de Navegación Superior Responsive */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-3 sm:px-6 py-2.5 md:py-0 md:h-16 flex flex-col md:flex-row items-stretch md:items-center justify-between z-30 shrink-0 gap-2.5 md:gap-4">
        
        {/* Fila 1 en móvil / Izquierda en escritorio: Logotipo, Buscador y Contador */}
        <div className="flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Atlas Filosófico
              </h1>
              <p className="text-[11px] text-slate-400 hidden xl:block">
                Visualización cronológica y geográfica progresiva
              </p>
            </div>
          </div>

          {/* Buscador y Contador */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar filósofo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-28 sm:w-36 lg:w-48 pl-7 sm:pl-8 pr-2.5 sm:pr-3 py-1.5 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Contador sutil de autores visibles */}
            <div
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700 shadow-sm"
              title={`Mostrando ${filteredFilosofos.length} autores de un total de ${filosofos.length} en el catálogo`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-amber-300">{filteredFilosofos.length}</span>
              <span className="text-slate-400">/{filosofos.length}</span>
            </div>
          </div>
        </div>

        {/* Fila 2 en móvil / Centro en escritorio: Selector de Vistas + Divulgación Progresiva */}
        <div className="flex items-center justify-between sm:justify-center gap-2 flex-wrap">
          
          {/* Selector de Vistas (Cronología vs Mapamundi) */}
          <nav className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveView('cronologica')}
              className={`min-h-[42px] md:min-h-[36px] flex items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeView === 'cronologica'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vista Cronológica</span>
              <span className="sm:hidden">Tiempo</span>
            </button>

            <button
              onClick={() => setActiveView('geografica')}
              className={`min-h-[42px] md:min-h-[36px] flex items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeView === 'geografica'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vista Geográfica</span>
              <span className="sm:hidden">Mapa</span>
            </button>
          </nav>

          {/* Divulgación Progresiva: Filtro Acumulativo de 3 Niveles */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 hidden xl:inline">
              Nivel:
            </span>
            <div className="flex items-center gap-1">
              {LEVELS.map((lvl) => {
                const Icon = lvl.icon;
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`min-h-[42px] md:min-h-[36px] flex items-center gap-1.5 px-2.5 sm:px-3 py-2 md:py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                    title={lvl.description}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{lvl.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </header>

      {/* Área Principal de Visualización según la vista seleccionada */}
      <main className="flex-1 relative w-full overflow-hidden">
        {activeView === 'cronologica' ? (
          <TimelineFlow
            filosofos={filteredFilosofos}
            selectedFilosofo={selectedFilosofo}
            onSelectFilosofo={handleSelectFilosofo}
            onOpenBiography={handleOpenBiography}
          />
        ) : (
          <GeographicView
            filosofos={filteredFilosofos}
            selectedFilosofo={selectedFilosofo}
            onSelectFilosofo={handleSelectFilosofo}
            onOpenBiography={handleOpenBiography}
          />
        )}

        {/* Tarjeta Flotante (Popover) compartida para ambas vistas (1 Clic) */}
        <FloatingPopover
          filosofo={selectedFilosofo}
          allFilosofos={filteredFilosofos}
          onClose={() => setSelectedFilosofo(null)}
          onOpenBiography={handleOpenBiography}
          onSelectFilosofo={handleSelectFilosofo}
        />

        {/* Modal Centrado de Biografía Completa compartido para ambas vistas (2 Clics) */}
        <BiographyModal
          filosofo={modalFilosofo}
          onClose={() => setModalFilosofo(null)}
        />
      </main>

    </div>
  );
}
