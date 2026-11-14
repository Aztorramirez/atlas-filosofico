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

const ProgramacionView = React.lazy(() => import('./components/ProgramacionView'));
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
    <div className="flex flex-col h-screen w-screen bg-academia-mesh text-slate-100 overflow-hidden font-sans select-none relative">
      
      {/* Menú Desplegable Lateral Izquierdo (Drawer) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSelectSection={(section) => setActiveSection(section)}
      />

      {/* Barra de Navegación Superior Glassmorphic */}
      <header className="border-b border-white/10 bg-slate-950/65 backdrop-blur-xl px-3 sm:px-6 py-2.5 md:py-0 md:h-[68px] flex flex-col md:flex-row items-stretch md:items-center justify-between z-30 shrink-0 gap-2.5 md:gap-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        
        {/* Fila 1 en móvil / Izquierda en escritorio: Menú hamburguesa, Logotipo, Título y Controles contextuales */}
        <div className="flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Botón de apertura del menú lateral */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-300 hover:text-amber-300 bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center border border-white/10 hover:border-amber-400/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Abrir menú"
              title="Abrir menú"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>

            {/* Logotipo y Título Editorial */}
            <div
              onClick={() => setActiveSection('atlas')}
              className="flex items-center gap-3 cursor-pointer group"
              title="Volver a la portada del Atlas"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_24px_rgba(251,191,36,0.12)] shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:scale-105 transition-all duration-300">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="font-editorial text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-white flex items-center gap-2.5 leading-none">
                  <span>Atlas Filosófico</span>
                  {activeSection !== 'atlas' && (
                    <span className="font-sans text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 hidden sm:inline-flex items-center">
                      {activeSection === 'ley_vigente'
                        ? 'Ley Vigente'
                        : activeSection === 'temario'
                        ? 'Temario Oficial'
                        : activeSection === 'programacion'
                        ? 'Programación Didáctica'
                        : '¿Qué es esto?'}
                    </span>
                  )}
                </h1>
                <p className="text-[11px] text-slate-400 hidden xl:block tracking-wide mt-0.5">
                  Cartografía cronológica y geográfica del pensamiento
                </p>
              </div>
            </div>
          </div>

          {/* Si estamos en el Atlas: Buscador y Contador en móvil */}
          {activeSection === 'atlas' ? (
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar filósofo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-28 sm:w-40 lg:w-52 pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.07] transition-all"
                />
              </div>

              {/* Contador sutil de autores visibles */}
              <div
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-white/[0.04] text-slate-300 border border-white/10 tabular-nums"
                title={`Mostrando ${filteredFilosofos.length} autores de un total de ${filosofos.length} en el catálogo`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-amber-300">{filteredFilosofos.length}</span>
                <span className="text-slate-400">/{filosofos.length}</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveSection('atlas')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-amber-400 text-slate-200 hover:text-slate-950 font-semibold text-xs border border-white/10 hover:border-amber-300 transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950 transition-colors" />
              <span>Volver al Atlas</span>
            </button>
          )}
        </div>

        {/* Fila 2 en móvil / Centro en escritorio: Solo visible en la vista Atlas */}
        {activeSection === 'atlas' && (
          <div className="flex items-center justify-between sm:justify-center gap-2.5 flex-wrap">
            
            {/* Selector de Vistas (Cronología vs Mapamundi) */}
            <nav className="flex items-center bg-white/[0.03] backdrop-blur-md p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveView('cronologica')}
                className={`min-h-[40px] md:min-h-[34px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeView === 'cronologica'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.28)] font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vista Cronológica</span>
                <span className="sm:hidden">Tiempo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('geografica')}
                className={`min-h-[40px] md:min-h-[34px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeView === 'geografica'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.28)] font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vista Geográfica</span>
                <span className="sm:hidden">Mapa</span>
              </button>
            </nav>

            {/* Divulgación Progresiva: Filtro Acumulativo de 3 Niveles */}
            <div className="flex items-center bg-white/[0.03] backdrop-blur-md p-1 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-slate-400 px-2.5 hidden xl:inline">
                Nivel:
              </span>
              <div className="flex items-center gap-1">
                {LEVELS.map((lvl) => {
                  const Icon = lvl.icon;
                  const isSelected = selectedLevel === lvl.id;
                  return (
                    <button
                      type="button"
                      key={lvl.id}
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`min-h-[40px] md:min-h-[34px] flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.25)] font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
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
        ) : activeSection === 'programacion' ? (
          <React.Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-academia-mesh text-amber-300 font-editorial text-xl italic">
                Cargando programación didáctica...
              </div>
            }
          >
            <ProgramacionView />
          </React.Suspense>
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

