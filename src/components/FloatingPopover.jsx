import React, { useMemo } from 'react';
import { X, BookOpen, MapPin, Calendar, Compass, ArrowRight, Users } from 'lucide-react';

export default function FloatingPopover({
  filosofo,
  allFilosofos = [],
  onClose,
  onOpenBiography,
  onSelectFilosofo,
}) {
  // Cálculo incondicional de los pensadores coetáneos (regla de hooks de React)
  const coetaneos = useMemo(() => {
    if (!filosofo || !allFilosofos.length) return [];
    const start = filosofo.año_nacimiento;
    const end =
      typeof filosofo.año_fallecimiento === 'number'
        ? filosofo.año_fallecimiento
        : 2026;

    return allFilosofos
      .filter((f) => {
        if (f.id === filosofo.id) return false;
        const fStart = f.año_nacimiento;
        const fEnd =
          typeof f.año_fallecimiento === 'number' ? f.año_fallecimiento : 2026;
        return Math.max(start, fStart) <= Math.min(end, fEnd);
      })
      .slice(0, 6); // Mostramos hasta 6 destacados
  }, [filosofo, allFilosofos]);

  if (!filosofo) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:right-6 sm:inset-x-auto sm:w-96 max-w-full sm:max-w-md z-40 max-h-[85vh] flex flex-col bg-slate-900/95 border-t sm:border border-amber-500/40 rounded-t-3xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Píldora de arrastre superior para móviles */}
      <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-2 sm:hidden shrink-0" />

      {/* Botón de cierre y etiqueta */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Resumen Breve (1 Clic)
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl hover:bg-slate-800 transition-colors"
          title="Cerrar resumen"
          aria-label="Cerrar resumen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contenido principal con scroll vertical suave */}
      <div className="mt-3 overflow-y-auto max-h-[calc(85vh-5rem)] pr-0.5" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {filosofo.nombre}
          </h3>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 shrink-0">
            {filosofo.nivel === 1 ? 'Nivel 1: Canon' : filosofo.nivel === 2 ? 'Nivel 2: Universitario' : 'Nivel 3: Académico'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-amber-300 border border-slate-700 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {filosofo.epoca_año}
          </span>
          {filosofo.coordenadas && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {filosofo.coordenadas.lugar || `${filosofo.coordenadas.latitud}, ${filosofo.coordenadas.longitud}`}
            </span>
          )}
        </div>

        {/* Coordenadas geográficas exactas */}
        {filosofo.coordenadas && (
          <div className="mt-2 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-slate-400" />
            <span>Lat: {filosofo.coordenadas.latitud}° | Lon: {filosofo.coordenadas.longitud}°</span>
          </div>
        )}

        {/* Texto del resumen breve */}
        <div className="mt-3.5 bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
          <p className="text-sm text-slate-200 leading-relaxed">
            {filosofo.resumen_breve}
          </p>
        </div>

        {/* Pensadores coetáneos en vida */}
        {coetaneos.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Coincidió en vida con:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {coetaneos.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectFilosofo && onSelectFilosofo(c)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 border border-slate-700/80 transition min-h-[30px] flex items-center"
                  title={`Ver a ${c.nombre} (${c.epoca_año})`}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botón para abrir la biografía completa */}
        <button
          onClick={() => onOpenBiography(filosofo)}
          className="mt-4 w-full min-h-[44px] py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all group"
        >
          <BookOpen className="w-4 h-4" />
          <span>Abrir biografía completa</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <p className="text-center text-[10px] text-slate-500 mt-2">
          (o haz doble clic directamente sobre el autor)
        </p>
      </div>
    </div>
  );
}
