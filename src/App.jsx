import React, { useState, useMemo, useEffect } from 'react';
import filosofosData from './data/filosofos.json';
import TimelineFlow from './components/TimelineFlow';
import GeographicView from './components/GeographicView';
import FloatingPopover from './components/FloatingPopover';
import BiographyModal from './components/BiographyModal';
import Sidebar from './components/Sidebar';
import LegislacionView from './components/LegislacionView';
import TemarioView from './components/TemarioView';
import SobreNosotrosView from './components/SobreNosotrosView';
import {
  Compass,
  Clock,
  Globe,
  Search,
  Sparkles,
  Layers,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Menu,
  Scale,
  Users,
} from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState('atlas'); // 'atlas' | 'ley_vigente' | 'temario' | 'sobre_nosotros'
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      
      {/* Menú Desplegable Lateral Izquierdo (Drawer) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSelectSection={(section) => setActiveSection(section)}
      />

      {/* Barra de Navegación Superior Responsive */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-3 sm:px-6 py-2.5 md:py-0 md:h-16 flex flex-col md:flex-row items-stretch md:items-center justify-between z-30 shrink-0 gap-2.5 md:gap-4">
        
        {/* Fila 1 en móvil / Izquierda en escritorio: Menú hamburguesa, Logotipo, Título y Controles contextuales */}
        <div className="flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón de apertura del menú lateral */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition min-w-[38px] min-h-[38px] flex items-center justify-center border border-slate-700/60 shadow-sm"
              aria-label="Abrir menú"
              title="Abrir menú"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>

            {/* Logotipo y Título */}
            <div
              onClick={() => setActiveSection('atlas')}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Volver a la portada del Atlas"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Atlas Filosófico
                  {activeSection !== 'atlas' && (
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 hidden sm:inline">
                      {activeSection === 'ley_vigente'
                        ? 'Ley Vigente'
                        : activeSection === 'temario'
                        ? 'Temario Oficial'
                        : '¿Qué es esto?'}
                    </span>
                  )}
                </h1>
                <p className="text-[11px] text-slate-400 hidden xl:block">
                  Visualización cronológica y geográfica progresiva
                </p>
              </div>
            </div>
          </div>

          {/* Si estamos en el Atlas: Buscador y Contador en móvil */}
          {activeSection === 'atlas' ? (
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
          ) : (
            <button
              onClick={() => setActiveSection('atlas')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 font-semibold text-xs border border-slate-700 transition"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Volver al Atlas</span>
            </button>
          )}
        </div>

        {/* Fila 2 en móvil / Centro en escritorio: Solo visible en la vista Atlas */}
        {activeSection === 'atlas' && (
          <div className="flex items-center justify-between sm:justify-center gap-2 flex-wrap">
            
            {/* Selector de Vistas (Cronología vs Mapamundi) */}
            <nav className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shadow-inner">
              <button
                onClick={() => setActiveView('cronologica')}
                className={`min-h-[42px] md:min-h-[36px] flex items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeView === 'cronologica'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
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
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
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
        )}
      </header>

      {/* Área Principal de Visualización según la sección activa */}
      <main className="flex-1 relative w-full overflow-hidden">
        {activeSection === 'atlas' ? (
          activeView === 'cronologica' ? (
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
          )
        ) : activeSection === 'ley_vigente' ? (
          <LegislacionView />
        ) : activeSection === 'temario' ? (
          <TemarioView onNavigateToAtlas={() => setActiveSection('atlas')} />
        ) : (
          <SobreNosotrosView />
        )}

        {/* Tarjeta Flotante (Popover) del Atlas (1 Clic) */}
        {activeSection === 'atlas' && (
          <FloatingPopover
            filosofo={selectedFilosofo}
            allFilosofos={filteredFilosofos}
            onClose={() => setSelectedFilosofo(null)}
            onOpenBiography={handleOpenBiography}
            onSelectFilosofo={handleSelectFilosofo}
          />
        )}

        {/* Modal Centrado de Biografía Completa del Atlas (2 Clics) */}
        {activeSection === 'atlas' && (
          <BiographyModal
            filosofo={modalFilosofo}
            onClose={() => setModalFilosofo(null)}
          />
        )}
      </main>

    </div>
  );
}

