import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  Layers,
  Maximize2,
  MapPin,
  Calendar,
  Clock,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

const MIN_YEAR = -600;
const MAX_YEAR = 2026;

const formatYear = (year) => {
  if (year < 0) return `${Math.abs(year)} a.C.`;
  if (year === 0) return 'Año 0';
  return `${year} d.C.`;
};

export default function GeographicView({
  filosofos,
  selectedFilosofo,
  onSelectFilosofo,
  onOpenBiography,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const sliderPanelRef = useRef(null);
  const hasInitialFitRef = useRef(false);
  const markersRef = useRef({});

  const [mapStyle, setMapStyle] = useState('dark'); // 'dark' | 'osm'
  const [timelineFilterActive, setTimelineFilterActive] = useState(false); // Por defecto desactivado
  const [selectedYear, setSelectedYear] = useState(-380); // Año inicial (Atenas clásica, época de Platón)
  const [isPlaying, setIsPlaying] = useState(false);

  // Capa OpenStreetMap estándar 100% libre sin necesidad de API Key ni servicios externos
  const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // Filtrado temporal en tiempo real: nacimiento <= año && fallecimiento >= año
  const displayedFilosofos = useMemo(() => {
    if (!timelineFilterActive) return filosofos;
    return filosofos.filter((f) => {
      const birth = f.año_nacimiento;
      const death = typeof f.año_fallecimiento === 'number' ? f.año_fallecimiento : 2026;
      return birth <= selectedYear && death >= selectedYear;
    });
  }, [filosofos, timelineFilterActive, selectedYear]);

  // Si el filósofo seleccionado queda fuera del año activo, deseleccionar para evitar referencias huérfanas
  useEffect(() => {
    if (selectedFilosofo && timelineFilterActive) {
      const birth = selectedFilosofo.año_nacimiento;
      const death =
        typeof selectedFilosofo.año_fallecimiento === 'number'
          ? selectedFilosofo.año_fallecimiento
          : 2026;
      if (birth > selectedYear || death < selectedYear) {
        onSelectFilosofo(null);
      }
    }
  }, [selectedYear, timelineFilterActive, selectedFilosofo, onSelectFilosofo]);

  // Avance cronológico automático cuando el botón Play está activo
  useEffect(() => {
    if (!isPlaying || !timelineFilterActive) return;
    const interval = setInterval(() => {
      setSelectedYear((prev) => {
        if (prev >= MAX_YEAR) {
          setIsPlaying(false);
          return MAX_YEAR;
        }
        const step = prev < 1500 ? 10 : 5;
        return Math.min(prev + step, MAX_YEAR);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, timelineFilterActive]);

  // Desactivar propagación de eventos táctiles y clics sobre el panel flotante para no arrastrar ni hacer zoom en el mapa
  useEffect(() => {
    if (sliderPanelRef.current) {
      L.DomEvent.disableClickPropagation(sliderPanelRef.current);
      L.DomEvent.disableScrollPropagation(sliderPanelRef.current);
    }
  }, [timelineFilterActive]);

  // Función para generar icono HTML personalizado con Tailwind
  const createMarkerIcon = (filosofo, isSelected) => {
    const initials = filosofo.nombre
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('');

    return L.divIcon({
      className: 'bg-transparent border-0',
      html: `
        <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-300 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-20'
        }">
          <!-- Pin circular -->
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-2xl transition-all duration-300 border-2 ${
            isSelected
              ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/50 shadow-amber-500/50 scale-110'
              : 'bg-slate-900 text-amber-300 border-amber-400/80 group-hover:bg-amber-400 group-hover:text-slate-950 shadow-black/80'
          }">
            <span>${initials}</span>
          </div>

          <!-- Flecha inferior del marcador -->
          <div class="w-2 h-2 -mt-1 rotate-45 border-r-2 border-b-2 ${
            isSelected
              ? 'bg-amber-400 border-white'
              : 'bg-slate-900 border-amber-400/80 group-hover:bg-amber-400'
          }"></div>

          <!-- Etiqueta con el nombre y época -->
          <div class="mt-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl border pointer-events-none transition-all ${
            isSelected
              ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/30 font-bold'
              : 'bg-slate-900/95 text-slate-200 border-slate-700/80 group-hover:border-slate-500'
          }">
            <span>${filosofo.nombre}</span>
            <span class="opacity-75 font-normal text-[10px] ml-1">(${filosofo.epoca_año.split('(')[0].trim()})</span>
          </div>
        </div>
      `,
      iconSize: [40, 60],
      iconAnchor: [20, 50],
    });
  };

  // Inicialización del Mapa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Crear mapa centrado en Europa/Mediterráneo (origen de gran parte de la filosofía clásica y moderna)
    const map = L.map(mapContainerRef.current, {
      center: [48.0, 15.0],
      zoom: 4,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false, // Lo reposicionaremos para que no tape botones
      doubleClickZoom: false, // Desactivamos zoom de doble clic para reservar el doble clic a la biografía
    });

    // Control de zoom en la esquina inferior izquierda
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Capa base estándar OpenStreetMap (Zero-API, 100% libre)
    const currentLayer = L.tileLayer(OSM_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = { map, layer: currentLayer };

    // Manejador de clic en el lienzo del mapa para deseleccionar
    map.on('click', (e) => {
      // Si se hizo clic en el fondo del mapa, deseleccionamos
      if (e.originalEvent.target === map.getContainer() || e.originalEvent.target.classList.contains('leaflet-tile')) {
        onSelectFilosofo(null);
      }
    });

    // Forzar ajuste de tamaño por si el contenedor tardó en renderizarse
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Renderizado y actualización de Marcadores
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const { map } = mapInstanceRef.current;

    // Limpiar marcadores anteriores
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    displayedFilosofos.forEach((filosofo) => {
      if (
        !filosofo.coordenadas ||
        typeof filosofo.coordenadas.latitud !== 'number' ||
        typeof filosofo.coordenadas.longitud !== 'number'
      ) {
        return;
      }

      const { latitud, longitud } = filosofo.coordenadas;
      const isSelected = selectedFilosofo?.id === filosofo.id;
      const icon = createMarkerIcon(filosofo, isSelected);

      const marker = L.marker([latitud, longitud], {
        icon,
        riseOnHover: true,
      }).addTo(map);

      // Clic Simple -> Selección y Popover
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectFilosofo(filosofo);
      });

      // Doble Clic -> Biografía Completa
      marker.on('dblclick', (e) => {
        L.DomEvent.stopPropagation(e);
        onOpenBiography(filosofo);
      });

      markersRef.current[filosofo.id] = marker;
      bounds.extend([latitud, longitud]);
    });

    // Ajustar límites automáticamente solo la primera vez que se monta la vista
    if (!hasInitialFitRef.current && !selectedFilosofo && bounds.isValid() && displayedFilosofos.length > 0) {
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 6 });
      hasInitialFitRef.current = true;
    }
  }, [displayedFilosofos]);

  // Efecto cuando cambia el filósofo seleccionado
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const { map } = mapInstanceRef.current;

    // Actualizar estilos visuales de los iconos
    displayedFilosofos.forEach((filosofo) => {
      const marker = markersRef.current[filosofo.id];
      if (marker) {
        const isSelected = selectedFilosofo?.id === filosofo.id;
        marker.setIcon(createMarkerIcon(filosofo, isSelected));
        if (isSelected) {
          marker.setZIndexOffset(1000);
        } else {
          marker.setZIndexOffset(0);
        }
      }
    });

    // Desplazarse suavemente al autor seleccionado
    if (selectedFilosofo?.coordenadas) {
      const { latitud, longitud } = selectedFilosofo.coordenadas;
      map.flyTo([latitud, longitud], Math.max(map.getZoom(), 6), {
        duration: 1.2,
      });
    }
  }, [selectedFilosofo, displayedFilosofos]);

  // Botón para reencuadrar todos los marcadores
  const handleFitAll = () => {
    if (!mapInstanceRef.current) return;
    const { map } = mapInstanceRef.current;
    const bounds = L.latLngBounds([]);

    displayedFilosofos.forEach((f) => {
      if (f.coordenadas?.latitud && f.coordenadas?.longitud) {
        bounds.extend([f.coordenadas.latitud, f.coordenadas.longitud]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 6 });
    }
  };

  return (
    <div className="w-full h-full relative bg-[#1a1a1a] overflow-hidden">
      {/* Estilo CSS puro para Modo Oscuro (Zero-API): invierte solo las teselas del mapa sin tocar marcadores */}
      <style>{`
        .leaflet-container {
          background-color: #1a1a1a !important;
        }
        .leaflet-dark-mode .leaflet-tile-pane {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>

      {/* Contenedor Leaflet */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full z-0 transition-opacity duration-300 ${
          mapStyle === 'dark' ? 'leaflet-dark-mode' : ''
        }`}
        style={{ backgroundColor: '#1a1a1a' }}
      />

      {/* Barra de herramientas flotante del mapa (Esquina superior derecha) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-slate-800 shadow-2xl flex-wrap justify-end">
        {/* Interruptor: Filtro por Año */}
        <button
          onClick={() => {
            const next = !timelineFilterActive;
            setTimelineFilterActive(next);
            if (!next) setIsPlaying(false);
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition min-h-[38px] ${
            timelineFilterActive
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Línea temporal interactiva con cursor por año"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Filtro por Año</span>
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              timelineFilterActive ? 'bg-slate-950 animate-pulse' : 'bg-slate-600'
            }`}
          />
        </button>

        <div className="w-px h-4 bg-slate-800 hidden sm:block" />

        {/* Selector de capa de mapa */}
        <button
          onClick={() => setMapStyle(mapStyle === 'dark' ? 'osm' : 'dark')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition min-h-[38px]"
          title="Cambiar estilo de mapa"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{mapStyle === 'dark' ? 'Modo Oscuro' : 'Modo Clásico (OSM)'}</span>
          <span className="sm:hidden">{mapStyle === 'dark' ? 'Oscuro' : 'OSM'}</span>
        </button>

        <div className="w-px h-4 bg-slate-800 hidden sm:block" />

        {/* Reencuadrar todos los autores */}
        <button
          onClick={handleFitAll}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition min-h-[38px]"
          title="Ver todos los filósofos"
        >
          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Reencuadrar</span>
        </button>
      </div>

      {/* Leyenda de navegación del mapa en la esquina inferior izquierda (oculta si el slider está activo para evitar colisiones) */}
      <div
        className={`absolute bottom-6 left-16 z-20 items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 shadow-xl ${
          timelineFilterActive ? 'hidden' : 'hidden md:flex'
        }`}
      >
        <span className="flex items-center gap-1 text-slate-300">
          <MapPin className="w-3 h-3 text-amber-400" /> Clic en marcador: resumen
        </span>
        <span className="text-slate-700">•</span>
        <span>Doble clic en marcador: biografía completa</span>
      </div>

      {/* Panel Flotante Inferior: Línea Temporal Interactiva con Slider */}
      {timelineFilterActive && (
        <div
          ref={sliderPanelRef}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[95%] sm:w-[580px] max-w-xl bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-100 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Cabecera del Panel: Título, Año Grande Formateado y Cierre */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Línea Temporal Interactiva
              </span>
            </div>

            {/* Año Activo Formateado en grande */}
            <div className="flex items-center gap-2.5">
              <div className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-mono font-extrabold text-base sm:text-lg shadow-md shadow-amber-400/20">
                {formatYear(selectedYear)}
              </div>
              <button
                onClick={() => {
                  setTimelineFilterActive(false);
                  setIsPlaying(false);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                title="Desactivar filtro por año"
                aria-label="Cerrar filtro por año"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contador de pensadores coetáneos en vida en ese año */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>
              {displayedFilosofos.length === 0 ? (
                <span className="text-slate-500">Ningún filósofo de este nivel en vida</span>
              ) : (
                <span>
                  <strong className="text-amber-300 font-bold">{displayedFilosofos.length}</strong>{' '}
                  {displayedFilosofos.length === 1 ? 'filósofo en vida' : 'filósofos en vida simultáneamente'}
                </span>
              )}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {MIN_YEAR < 0 ? `${Math.abs(MIN_YEAR)} a.C.` : MIN_YEAR} — {MAX_YEAR} d.C.
            </span>
          </div>

          {/* Control Deslizante (Slider) */}
          <div className="relative py-1">
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
            />
          </div>

          {/* Controles de Reproducción y Atajos de Épocas */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
            {/* Reproducción Play / Pause y pasos de 10 años */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setSelectedYear((prev) => Math.max(MIN_YEAR, prev - 10));
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition min-h-[32px] min-w-[32px] flex items-center justify-center"
                title="-10 años"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition min-h-[32px] ${
                  isPlaying
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                    : 'bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200'
                }`}
                title={isPlaying ? 'Pausar avance cronológico' : 'Reproducir avance cronológico'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pausar' : 'Play'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedYear((prev) => Math.min(MAX_YEAR, prev + 10));
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition min-h-[32px] min-w-[32px] flex items-center justify-center"
                title="+10 años"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Atajos a épocas históricas clave */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {[
                { label: 'Grecia (-400)', year: -400 },
                { label: 'Roma (150)', year: 150 },
                { label: 'Medievo (1250)', year: 1250 },
                { label: 'Ilustración (1780)', year: 1780 },
                { label: 'S. XX (1930)', year: 1930 },
              ].map((era) => (
                <button
                  key={era.year}
                  onClick={() => {
                    setSelectedYear(era.year);
                    setIsPlaying(false);
                  }}
                  className={`text-[10px] px-2 py-1 rounded-lg border transition whitespace-nowrap min-h-[28px] ${
                    Math.abs(selectedYear - era.year) < 30
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 font-semibold'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {era.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
