import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Play,
  ExternalLink,
  Clock,
  Users,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Compass,
  Layers,
} from 'lucide-react';
import TimelineFlow from './TimelineFlow';
import FloatingPopover from './FloatingPopover';
import BiographyModal from './BiographyModal';

export default function TemaDetail({
  tema,
  allTemas,
  allFilosofos,
  onBack,
  onSelectTema,
}) {
  const [selectedFilosofo, setSelectedFilosofo] = useState(null);
  const [modalFilosofo, setModalFilosofo] = useState(null);

  // Filtrar los filósofos correspondientes a los IDs del tema
  const relatedFilosofos = useMemo(() => {
    if (!tema?.autores_relacionados || tema.autores_relacionados.length === 0) {
      return [];
    }
    const idsSet = new Set(tema.autores_relacionados.map((id) => id.toLowerCase()));
    return allFilosofos.filter((f) => idsSet.has(f.id.toLowerCase()));
  }, [tema, allFilosofos]);

  // Navegación secuencial entre temas (Anterior / Siguiente)
  const currentIndex = useMemo(() => {
    return allTemas.findIndex((t) => t.id === tema.id);
  }, [allTemas, tema]);

  const prevTema = currentIndex > 0 ? allTemas[currentIndex - 1] : null;
  const nextTema = currentIndex < allTemas.length - 1 ? allTemas[currentIndex + 1] : null;

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 space-y-8">
      
      {/* Barra superior de navegación */}
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Volver al listado de temas</span>
        </button>

        {/* Paginación anterior / siguiente */}
        <div className="flex items-center gap-2">
          {prevTema && (
            <button
              onClick={() => {
                setSelectedFilosofo(null);
                onSelectTema(prevTema);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition"
              title={`Tema ${prevTema.num}: ${prevTema.titulo}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Tema {prevTema.num}</span>
            </button>
          )}

          <span className="text-xs text-slate-500 font-mono px-2">
            {tema.num} / {allTemas.length}
          </span>

          {nextTema && (
            <button
              onClick={() => {
                setSelectedFilosofo(null);
                onSelectTema(nextTema);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition"
              title={`Tema ${nextTema.num}: ${nextTema.titulo}`}
            >
              <span>Tema {nextTema.num}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tarjeta de Encabezado del Tema */}
      <div className="max-w-6xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black font-mono text-base flex items-center justify-center shadow-md shadow-amber-500/20">
              {tema.num}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700 text-xs font-semibold">
              {tema.bloque}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Oposiciones Secundaria • Filosofía
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {tema.titulo}
          </h1>
        </div>

        {/* Acciones principales: Videoclase */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            {tema.video_url ? (
              <a
                href={tema.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Ver Videoclase Explicativa</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 text-xs">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>Videoclase explicativa en preparación</span>
              </div>
            )}
          </div>

          {/* Autores y corrientes resumen */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{relatedFilosofos.length} autores vinculados</span>
            </span>
            {tema.corrientes_relacionadas?.length > 0 && (
              <>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{tema.corrientes_relacionadas.join(', ')}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Píldoras de autores relacionados para acceso directo */}
      {relatedFilosofos.length > 0 && (
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pensadores clave en este tema:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {relatedFilosofos.map((f) => {
              const isSelected = selectedFilosofo?.id === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilosofo(isSelected ? null : f)}
                  onDoubleClick={() => setModalFilosofo(f)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                  title="1 clic: ver ficha | 2 clics: ver biografía completa"
                >
                  <span>{f.nombre}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    ({f.epoca_año})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sección del TimelineFlow Filtrado */}
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Línea Temporal Filtrada</span>
            </h2>
            <p className="text-xs text-slate-400">
              Marco cronológico interactivo con los pensadores y coetáneos de este tema.
            </p>
          </div>
          {relatedFilosofos.length > 0 && (
            <span className="text-xs text-amber-400 font-mono bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              {relatedFilosofos.length} pensadores en escena
            </span>
          )}
        </div>

        {/* Contenedor del TimelineFlow */}
        <div className="w-full h-[480px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative">
          {relatedFilosofos.length > 0 ? (
            <TimelineFlow
              filosofos={relatedFilosofos}
              selectedFilosofo={selectedFilosofo}
              onSelectFilosofo={(f) => setSelectedFilosofo(f)}
              onOpenBiography={(f) => setModalFilosofo(f)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-sm sm:text-base font-bold text-slate-300">
                  Sin autores vinculados todavía
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Para visualizar la línea temporal de este tema, añade los IDs de los filósofos correspondientes en el campo{' '}
                  <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded font-mono">
                    "autores_relacionados"
                  </code>{' '}
                  de <code className="text-slate-400 font-mono">src/data/temario.json</code> (por ejemplo:{' '}
                  <span className="text-slate-400">"platon", "aristoteles", "kant"</span>).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popover Flotante de Autor (1 Clic) */}
      {selectedFilosofo && (
        <FloatingPopover
          filosofo={selectedFilosofo}
          allFilosofos={relatedFilosofos}
          onClose={() => setSelectedFilosofo(null)}
          onOpenBiography={(f) => setModalFilosofo(f)}
          onSelectFilosofo={(f) => setSelectedFilosofo(f)}
        />
      )}

      {/* Modal de Biografía Completa (2 Clics) */}
      {modalFilosofo && (
        <BiographyModal
          filosofo={modalFilosofo}
          onClose={() => setModalFilosofo(null)}
        />
      )}

    </div>
  );
}
