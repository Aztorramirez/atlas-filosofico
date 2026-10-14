import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Users,
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
  Compass,
} from 'lucide-react';

// Grandes épocas históricas de la filosofía
const ERAS = [
  {
    id: 'antiguedad',
    name: 'Antigüedad Clásica y Helenismo',
    shortName: 'Grecia y Helenismo',
    start: -650,
    end: -100,
    bg: 'bg-amber-950/20',
    border: 'border-amber-500/40',
    badge: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
    barColor: 'from-amber-500/90 to-yellow-600/90 text-slate-950 border-amber-300',
  },
  {
    id: 'tardia',
    name: 'Imperio Romano y Tardoantigüedad',
    shortName: 'Roma y Tardoantigüedad',
    start: -100,
    end: 500,
    bg: 'bg-orange-950/20',
    border: 'border-orange-500/40',
    badge: 'bg-orange-400/10 text-orange-300 border-orange-400/20',
    barColor: 'from-orange-500/90 to-amber-600/90 text-slate-950 border-orange-300',
  },
  {
    id: 'medieval',
    name: 'Edad Media y Filosofía Islámica',
    shortName: 'Medievo e Islam',
    start: 500,
    end: 1450,
    bg: 'bg-emerald-950/20',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    barColor: 'from-emerald-500/90 to-teal-600/90 text-slate-950 border-emerald-300',
  },
  {
    id: 'revolucion',
    name: 'Renacimiento y Revolución Científica',
    shortName: 'Rev. Científica',
    start: 1450,
    end: 1650,
    bg: 'bg-cyan-950/20',
    border: 'border-cyan-500/40',
    badge: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
    barColor: 'from-cyan-500/90 to-sky-600/90 text-slate-950 border-cyan-300',
  },
  {
    id: 'ilustracion',
    name: 'Ilustración y Modernidad',
    shortName: 'Ilustración',
    start: 1650,
    end: 1800,
    bg: 'bg-blue-950/20',
    border: 'border-blue-500/40',
    badge: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
    barColor: 'from-blue-500/90 to-indigo-600/90 text-white border-blue-300',
  },
  {
    id: 'xix',
    name: 'Siglo XIX: Idealismo, Positivismo y Evolución',
    shortName: 'Siglo XIX',
    start: 1800,
    end: 1900,
    bg: 'bg-purple-950/20',
    border: 'border-purple-500/40',
    badge: 'bg-purple-400/10 text-purple-300 border-purple-400/20',
    barColor: 'from-purple-500/90 to-fuchsia-600/90 text-white border-purple-300',
  },
  {
    id: 'contemporanea',
    name: 'Siglo XX y Filosofía Contemporánea',
    shortName: 'Siglo XX - Hoy',
    start: 1900,
    end: 2035,
    bg: 'bg-rose-950/20',
    border: 'border-rose-500/40',
    badge: 'bg-rose-400/10 text-rose-300 border-rose-400/20',
    barColor: 'from-rose-500/90 to-pink-600/90 text-white border-rose-300',
  },
];

const START_YEAR = -660;
const END_YEAR = 2035;

export default function TimelineFlow({
  filosofos,
  selectedFilosofo,
  onSelectFilosofo,
  onOpenBiography,
}) {
  const containerRef = useRef(null);
  const [pixelsPerYear, setPixelsPerYear] = useState(2.8); // Nivel de zoom (px por año)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // 1. Algoritmo de asignación de carriles paralelos (Interval Scheduling / Swimming Lanes)
  const { processedFilosofos, totalTracks } = useMemo(() => {
    const sorted = [...filosofos].sort((a, b) => a.año_nacimiento - b.año_nacimiento);
    const tracks = []; // tracks[i] almacena el año de fallecimiento del último pensador en el carril i
    const result = [];
    const minPaddingYears = 3; // Margen de separación entre autores en el mismo carril

    for (const f of sorted) {
      const start = f.año_nacimiento;
      const end = typeof f.año_fallecimiento === 'number' ? f.año_fallecimiento : 2026;

      let assignedTrack = -1;
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i] + minPaddingYears <= start) {
          assignedTrack = i;
          tracks[i] = end;
          break;
        }
      }

      if (assignedTrack === -1) {
        assignedTrack = tracks.length;
        tracks.push(end);
      }

      // Encontrar la época para estilos cromáticos
      const era =
        ERAS.find((e) => start >= e.start && start < e.end) || ERAS[ERAS.length - 1];

      result.push({
        ...f,
        track: assignedTrack,
        lifespanStart: start,
        lifespanEnd: end,
        durationYears: Math.max(end - start, 1),
        era,
      });
    }

    return {
      processedFilosofos: result,
      totalTracks: Math.max(tracks.length, 6),
    };
  }, [filosofos]);

  // 2. Cálculo de pensadores coetáneos al autor seleccionado
  const coetaneosInfo = useMemo(() => {
    if (!selectedFilosofo) return null;

    const selStart = selectedFilosofo.año_nacimiento;
    const selEnd =
      typeof selectedFilosofo.año_fallecimiento === 'number'
        ? selectedFilosofo.año_fallecimiento
        : 2026;

    const coetaneosList = processedFilosofos.filter((f) => {
      if (f.id === selectedFilosofo.id) return false;
      const overlapStart = Math.max(selStart, f.lifespanStart);
      const overlapEnd = Math.min(selEnd, f.lifespanEnd);
      return overlapStart <= overlapEnd; // Hubo al menos un año coincidente
    });

    return {
      selectedStart: selStart,
      selectedEnd: selEnd,
      coetaneos: coetaneosList,
      coetaneosIds: new Set(coetaneosList.map((c) => c.id)),
    };
  }, [selectedFilosofo, processedFilosofos]);

  // Funciones de coordenadas geométricas temporales
  const yearToX = useCallback(
    (year) => (year - START_YEAR) * pixelsPerYear,
    [pixelsPerYear]
  );

  const totalWidth = useMemo(
    () => (END_YEAR - START_YEAR) * pixelsPerYear + 200,
    [pixelsPerYear]
  );

  // Marcas de siglos para la regla superior
  const centuryTicks = useMemo(() => {
    const ticks = [];
    for (let y = -600; y <= 2000; y += 100) {
      let label = '';
      if (y < 0) label = `${Math.abs(y)} a.C.`;
      else if (y === 0) label = 'Año 0';
      else label = `${y} d.C.`;
      ticks.push({ year: y, label });
    }
    return ticks;
  }, []);

  // Marcas de medio siglo (cada 50 años)
  const halfCenturyTicks = useMemo(() => {
    const ticks = [];
    for (let y = -650; y <= 2000; y += 50) {
      if (y % 100 !== 0) {
        ticks.push(y);
      }
    }
    return ticks;
  }, []);

  // Desplazamiento suave al autor seleccionado
  useEffect(() => {
    if (selectedFilosofo && containerRef.current) {
      const targetX = yearToX(selectedFilosofo.año_nacimiento);
      const containerWidth = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: Math.max(0, targetX - containerWidth / 3),
        behavior: 'smooth',
      });
    }
  }, [selectedFilosofo, yearToX]);

  // Salto rápido a una época concreta
  const scrollToEra = (startYear) => {
    if (!containerRef.current) return;
    const targetX = yearToX(startYear);
    containerRef.current.scrollTo({
      left: Math.max(0, targetX - 60),
      behavior: 'smooth',
    });
  };

  // Manejadores de arrastre con el ratón (pan drag)
  const handleMouseDown = (e) => {
    if (e.target.closest('.interactive-bar')) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  // Altura dinámica por carril
  const trackHeight = 54;
  const tracksContainerHeight = totalTracks * trackHeight + 40;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden relative">
      
      {/* 1. Barra de Herramientas Superior: Épocas, Zoom y Estado de Coetáneos */}
      <div className="h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20 backdrop-blur-md gap-3">
        
        {/* Atajos a grandes épocas históricas */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Épocas:
          </span>
          {ERAS.map((era) => (
            <button
              key={era.id}
              onClick={() => scrollToEra(era.start)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition"
            >
              {era.shortName}
            </button>
          ))}
        </div>

        {/* Panel de estado de coetáneos */}
        {coetaneosInfo && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-400/30 rounded-xl text-xs text-amber-300">
            <Users className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              <strong>{selectedFilosofo.nombre}</strong> coincidió en vida con{' '}
              <strong>{coetaneosInfo.coetaneos.length}</strong> pensadores
            </span>
          </div>
        )}

        {/* Controles de Zoom */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-800/60 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setPixelsPerYear((prev) => Math.max(prev - 0.7, 1.2))}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
            title="Alejar (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPixelsPerYear(2.8)}
            className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
            title="Restablecer Zoom"
          >
            {Math.round((pixelsPerYear / 2.8) * 100)}%
          </button>
          <button
            onClick={() => setPixelsPerYear((prev) => Math.min(prev + 0.7, 7.0))}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
            title="Acercar (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Contenedor de la Línea de Tiempo con Desplazamiento */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 overflow-x-auto overflow-y-auto relative cursor-grab active:cursor-grabbing ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        <div
          className="relative min-h-full"
          style={{ width: `${totalWidth}px` }}
        >
          {/* A. Franjas de Fondo de las Grandes Épocas */}
          <div className="absolute inset-0 pointer-events-none flex">
            {ERAS.map((era) => {
              const xStart = yearToX(era.start);
              const xEnd = yearToX(era.end);
              const width = xEnd - xStart;
              return (
                <div
                  key={era.id}
                  className={`absolute top-0 bottom-0 border-l ${era.border} ${era.bg} opacity-40`}
                  style={{ left: `${xStart}px`, width: `${width}px` }}
                >
                  <div className="sticky top-16 left-4 px-3 py-1 inline-block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {era.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* B. Líneas de Cuadrícula de Siglos y Medios Siglos */}
          {halfCenturyTicks.map((year) => (
            <div
              key={`half-${year}`}
              className="absolute top-0 bottom-0 w-px border-r border-slate-800/40 pointer-events-none"
              style={{ left: `${yearToX(year)}px` }}
            />
          ))}

          {centuryTicks.map((tick) => (
            <div
              key={`century-${tick.year}`}
              className="absolute top-0 bottom-0 w-px border-r border-slate-800/80 pointer-events-none"
              style={{ left: `${yearToX(tick.year)}px` }}
            />
          ))}

          {/* C. Franja Sombreada de Coetaneidad del Autor Seleccionado */}
          {coetaneosInfo && (
            <div
              className="absolute top-0 bottom-0 bg-amber-400/10 border-x-2 border-amber-400/50 pointer-events-none z-10 transition-all duration-300"
              style={{
                left: `${yearToX(coetaneosInfo.selectedStart)}px`,
                width: `${Math.max(
                  (coetaneosInfo.selectedEnd - coetaneosInfo.selectedStart) *
                    pixelsPerYear,
                  4
                )}px`,
              }}
            >
              <div className="sticky top-20 bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-lg mx-auto w-max uppercase tracking-wider">
                Vigencia: {selectedFilosofo.nombre} ({selectedFilosofo.epoca_año})
              </div>
            </div>
          )}

          {/* D. Regla Superior de Siglos (Sticky) */}
          <div className="sticky top-0 z-30 h-10 bg-slate-900/95 border-b border-slate-800 flex items-center shadow-lg backdrop-blur-md">
            {centuryTicks.map((tick) => (
              <div
                key={`label-${tick.year}`}
                className="absolute flex flex-col items-center -translate-x-1/2 pointer-events-none"
                style={{ left: `${yearToX(tick.year)}px` }}
              >
                <div className="w-px h-2 bg-slate-700" />
                <span className="text-[11px] font-mono font-semibold text-slate-400 mt-0.5">
                  {tick.label}
                </span>
              </div>
            ))}
          </div>

          {/* E. Carriles Paralelos de Filósofos (Swimming Lanes) */}
          <div
            className="relative pt-6 pb-20"
            style={{ minHeight: `${tracksContainerHeight}px` }}
          >
            {/* Líneas tenues delimitadoras de carriles */}
            {Array.from({ length: totalTracks }).map((_, trackIdx) => (
              <div
                key={`lane-bg-${trackIdx}`}
                className="absolute left-0 right-0 border-b border-slate-800/25 pointer-events-none"
                style={{
                  top: `${trackIdx * trackHeight + 24}px`,
                  height: `${trackHeight}px`,
                }}
              />
            ))}

            {/* Renderizado de las Barras de Vida de cada Filósofo */}
            {processedFilosofos.map((filosofo) => {
              const xStart = yearToX(filosofo.lifespanStart);
              const barWidth = Math.max(
                filosofo.durationYears * pixelsPerYear,
                140 // Ancho mínimo para que el texto sea siempre legible
              );
              const top = filosofo.track * trackHeight + 28;

              const isSelected = selectedFilosofo?.id === filosofo.id;
              const isCoetaneo = coetaneosInfo?.coetaneosIds.has(filosofo.id);
              const isDimmed =
                selectedFilosofo && !isSelected && !isCoetaneo;

              return (
                <div
                  key={filosofo.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFilosofo(filosofo);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onOpenBiography(filosofo);
                  }}
                  style={{
                    left: `${xStart}px`,
                    top: `${top}px`,
                    width: `${barWidth}px`,
                    height: '42px',
                  }}
                  className={`interactive-bar absolute z-20 flex items-center px-3 rounded-2xl cursor-pointer transition-all duration-300 shadow-md border ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold ring-4 ring-amber-400/50 shadow-2xl shadow-amber-500/40 z-30 scale-105 border-white'
                      : isCoetaneo
                      ? `bg-slate-800/95 text-white border-amber-400/60 ring-2 ring-amber-400/20 shadow-lg hover:scale-105`
                      : isDimmed
                      ? 'bg-slate-900/40 text-slate-500 border-slate-800/60 opacity-35 hover:opacity-100 hover:scale-102'
                      : `bg-slate-900/90 text-slate-200 border-slate-700/80 hover:border-amber-400/80 hover:bg-slate-800 hover:scale-102`
                  }`}
                  title={`${filosofo.nombre} (${filosofo.epoca_año})\n1 clic: Resumen • 2 clics: Biografía completa`}
                >
                  {/* Avatar o Inicial */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold mr-2 shrink-0 ${
                      isSelected
                        ? 'bg-slate-950 text-amber-400'
                        : isCoetaneo
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {filosofo.nombre.charAt(0)}
                  </div>

                  {/* Nombre y Años */}
                  <div className="flex flex-col min-w-0 pr-1 overflow-hidden leading-tight">
                    <span className="font-bold text-xs truncate">
                      {filosofo.nombre}
                    </span>
                    <span
                      className={`text-[10px] font-mono truncate ${
                        isSelected
                          ? 'text-slate-900 font-semibold'
                          : isCoetaneo
                          ? 'text-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {filosofo.epoca_año.split('(')[0].trim()}
                    </span>
                  </div>

                  {/* Distintivo de coetáneo */}
                  {isCoetaneo && (
                    <span className="ml-auto shrink-0 text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Coetáneo
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Leyenda Inferior de Ayuda */}
      <div className="h-10 bg-slate-900/90 border-t border-slate-800 px-6 flex items-center justify-between text-xs text-slate-400 shrink-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Haz <strong>1 clic</strong> en un autor para resaltar sus coetáneos y ver su resumen</span>
          </span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            Haz <strong>doble clic</strong> para su biografía completa
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <span>Arrastra con el ratón para desplazarte horizontalmente</span>
        </div>
      </div>

    </div>
  );
}
