import React, { useEffect } from 'react';
import { X, BookOpen, MapPin, Calendar, Compass, Sparkles } from 'lucide-react';

export default function BiographyModal({ filosofo, onClose }) {
  // Manejo de la tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!filosofo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Fondo oscuro con desenfoque */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Contenedor del Modal Centrado y Responsive */}
      <div className="relative w-full max-w-[92vw] sm:max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera del modal */}
        <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                <Sparkles className="w-3 h-3" />
                Biografía Completa
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {filosofo.nivel === 1 ? 'Nivel 1: Canon' : filosofo.nivel === 2 ? 'Nivel 2: Universitario' : 'Nivel 3: Académico'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {filosofo.id}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
              {filosofo.nombre}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300 pt-1">
              <span className="inline-flex items-center gap-1 text-amber-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {filosofo.epoca_año}
              </span>
              {filosofo.coordenadas && (
                <>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="inline-flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {filosofo.coordenadas.lugar || `${filosofo.coordenadas.latitud}, ${filosofo.coordenadas.longitud}`}
                  </span>
                  <span className="text-slate-600 hidden md:inline">•</span>
                  <span className="hidden md:inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                    <Compass className="w-3 h-3 text-slate-500" />
                    Lat: {filosofo.coordenadas.latitud} | Lon: {filosofo.coordenadas.longitud}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Botón de cerrar superior */}
          <button
            onClick={onClose}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all shrink-0"
            aria-label="Cerrar modal"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del modal (Lectura de la biografía) con scroll táctil */}
        <div
          className="p-5 sm:p-8 overflow-y-auto space-y-5 sm:space-y-6 text-slate-200 leading-relaxed text-sm sm:text-base"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Tarjeta de resumen introductorio */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 italic border-l-4 border-l-amber-400">
            "{filosofo.resumen_breve}"
          </div>

          {/* Texto íntegro de la biografía */}
          <div className="space-y-4 text-slate-200 font-normal leading-relaxed sm:leading-loose text-sm sm:text-base md:text-lg">
            {filosofo.biografia_completa.split('\n\n').map((parrafo, idx) => (
              <p key={idx} className="first-letter:text-2xl sm:first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1">
                {parrafo}
              </p>
            ))}
          </div>
        </div>

        {/* Pie del modal con botón de cierre muy visible y accesible */}
        <div className="px-5 py-3.5 sm:px-8 sm:py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <p className="text-[11px] sm:text-xs text-slate-500">
            Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">Esc</kbd> o el botón para volver.
          </p>
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 sm:px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Cerrar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
