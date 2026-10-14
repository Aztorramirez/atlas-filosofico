import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, Layers, Maximize2, MapPin } from 'lucide-react';

export default function GeographicView({
  filosofos,
  selectedFilosofo,
  onSelectFilosofo,
  onOpenBiography,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [mapStyle, setMapStyle] = useState('dark'); // 'dark' | 'osm'

  // Capas de mapas gratuitas sin API Key
  const tileLayers = {
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  };

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

    // Capa base inicial
    const currentLayer = L.tileLayer(tileLayers[mapStyle].url, {
      attribution: tileLayers[mapStyle].attribution,
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

  // Cambio de estilo de mapa (Dark / OSM)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const { map, layer } = mapInstanceRef.current;

    map.removeLayer(layer);
    const newLayer = L.tileLayer(tileLayers[mapStyle].url, {
      attribution: tileLayers[mapStyle].attribution,
    }).addTo(map);

    mapInstanceRef.current.layer = newLayer;
  }, [mapStyle]);

  // Renderizado y actualización de Marcadores
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const { map } = mapInstanceRef.current;

    // Limpiar marcadores anteriores
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    filosofos.forEach((filosofo) => {
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

    // Si no hay ninguno seleccionado pero hay marcadores, ajustar la vista inicial para ver a todos
    if (!selectedFilosofo && bounds.isValid() && filosofos.length > 0) {
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 6 });
    }
  }, [filosofos]);

  // Efecto cuando cambia el filósofo seleccionado
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const { map } = mapInstanceRef.current;

    // Actualizar estilos visuales de los iconos
    filosofos.forEach((filosofo) => {
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
  }, [selectedFilosofo]);

  // Botón para reencuadrar todos los marcadores
  const handleFitAll = () => {
    if (!mapInstanceRef.current) return;
    const { map } = mapInstanceRef.current;
    const bounds = L.latLngBounds([]);

    filosofos.forEach((f) => {
      if (f.coordenadas?.latitud && f.coordenadas?.longitud) {
        bounds.extend([f.coordenadas.latitud, f.coordenadas.longitud]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 6 });
    }
  };

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden">
      {/* Contenedor Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Barra de herramientas flotante del mapa (Esquina superior derecha) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Selector de capa de mapa */}
        <button
          onClick={() => setMapStyle(mapStyle === 'dark' ? 'osm' : 'dark')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Cambiar estilo de mapa"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>{mapStyle === 'dark' ? 'Modo Oscuro' : 'Modo Clásico (OSM)'}</span>
        </button>

        <div className="w-px h-4 bg-slate-800" />

        {/* Reencuadrar todos los autores */}
        <button
          onClick={handleFitAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Ver todos los filósofos"
        >
          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Reencuadrar</span>
        </button>
      </div>

      {/* Leyenda de navegación del mapa en la esquina inferior derecha */}
      <div className="absolute bottom-6 left-16 z-20 hidden md:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 shadow-xl">
        <span className="flex items-center gap-1 text-slate-300">
          <MapPin className="w-3 h-3 text-amber-400" /> Clic en marcador: resumen
        </span>
        <span className="text-slate-700">•</span>
        <span>Doble clic en marcador: biografía completa</span>
      </div>
    </div>
  );
}
