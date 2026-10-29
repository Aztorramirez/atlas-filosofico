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
  GraduationCap,
  Bookmark,
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

  // Extraer los IDs de los filósofos relacionados (soporta strings u objetos enriquecidos con id_filosofo)
  const authorIds = useMemo(() => {
    if (!tema?.autores_relacionados || tema.autores_relacionados.length === 0) {
      return [];
    }
    return tema.autores_relacionados
      .map((item) => (typeof item === 'string' ? item : item.id_filosofo))
      .filter(Boolean);
  }, [tema]);

  // Filtrar los objetos completos de filósofos correspondientes a los IDs del tema
  const relatedFilosofos = useMemo(() => {
    if (authorIds.length === 0) return [];
    const idsSet = new Set(authorIds.map((id) => id.toLowerCase()));
    return allFilosofos.filter((f) => idsSet.has(f.id.toLowerCase()));
  }, [authorIds, allFilosofos]);

  // Lista de autores que cuentan con texto de justificación
  const autoresConJustificacion = useMemo(() => {
    if (!tema?.autores_relacionados || tema.autores_relacionados.length === 0) {
      return [];
    }
    return tema.autores_relacionados
      .filter((item) => typeof item === 'object' && item.id_filosofo && item.justificacion)
      .map((item) => {
        const idLower = item.id_filosofo.toLowerCase();
        const filosofoObj = allFilosofos.find((f) => f.id.toLowerCase() === idLower);
        return {
          id_filosofo: item.id_filosofo,
          nombre: item.nombre || filosofoObj?.nombre || item.id_filosofo,
          justificacion: item.justificacion,
          filosofo: filosofoObj || null,
        };
      });
  }, [tema, allFilosofos]);

  // Lista de corrientes que cuentan con texto de justificación
  const corrientesConJustificacion = useMemo(() => {
    if (!tema?.corrientes_relacionadas || tema.corrientes_relacionadas.length === 0) {
      return [];
    }
    return tema.corrientes_relacionadas
      .filter((item) => typeof item === 'object' && (item.nombre || item.id_corriente) && item.justificacion)
      .map((item) => ({
        nombre: item.nombre || item.id_corriente,
        justificacion: item.justificacion,
      }));
  }, [tema]);

  const hasAutoresJustificados = autoresConJustificacion.length > 0;
  const hasCorrientesJustificadas = corrientesConJustificacion.length > 0;
  const hasObrasJustificadas = tema?.obras_relacionadas && tema.obras_relacionadas.length > 0;

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
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
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

        {/* Acciones principales: Botón de Videoclase de YouTube en cabecera */}
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
                  <span>
                    {tema.corrientes_relacionadas
                      .map((c) => (typeof c === 'string' ? c : (c.nombre || c.id_corriente || '')))
                      .filter(Boolean)
                      .join(', ')}
                  </span>
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
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
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
              Marco cronológico interactivo con los pensadores vinculados a este tema de oposición.
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
                  de <code className="text-slate-400 font-mono">src/data/temario.json</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          NUEVA SECCIÓN: JUSTIFICACIÓN CURRICULAR PARA EL EXAMEN
      ========================================================================= */}
      {(hasAutoresJustificados || hasCorrientesJustificadas || hasObrasJustificadas) && (
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
            
            {/* Cabecera del panel de justificación */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>Preparación de Oposiciones • Argumentario para el Tribunal</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Justificación Curricular para el Examen
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Fundamentación conceptual de la presencia de cada autor, corriente y obra en el desarrollo temático.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                Tema {tema.num} • BOE
              </span>
            </div>

            {/* Sub-bloque 1: Autores y su Justificación */}
            {hasAutoresJustificados && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <Users className="w-4 h-4 text-amber-400" />
                  <h4>Autores Clave y Enfoque Filosófico</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {autoresConJustificacion.map(({ filosofo, justificacion, id_filosofo, nombre: authorDisplay }) => {
                    const nombre = authorDisplay || (filosofo ? filosofo.nombre : id_filosofo);
                    const epoca = filosofo ? filosofo.epoca_año : '';
                    return (
                      <div
                        key={id_filosofo}
                        onClick={() => filosofo && setSelectedFilosofo(filosofo)}
                        className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-amber-400/40 hover:bg-slate-950 transition-all space-y-3 cursor-pointer group"
                        title={filosofo ? "Haz clic para seleccionar en la línea temporal" : ""}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center justify-center font-bold text-xs uppercase font-mono group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                              {nombre.charAt(0)}
                            </span>
                            <div>
                              <div className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                                {nombre}
                              </div>
                              {filosofo?.corrientes?.[0] && (
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {filosofo.corrientes[0]}
                                </div>
                              )}
                            </div>
                          </div>
                          {epoca && (
                            <span className="text-[11px] font-mono text-slate-500">
                              {epoca}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-0.5">
                          {justificacion}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-bloque 2: Corrientes y Tradiciones Filosóficas */}
            {hasCorrientesJustificadas && (
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h4>Corrientes y Tradiciones Filosóficas</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {corrientesConJustificacion.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-amber-400/30 transition-all space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                        <h5 className="text-sm sm:text-base font-bold text-amber-300">
                          {c.nombre}
                        </h5>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {c.justificacion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-bloque 3: Obras y Tratados Fundamentales */}
            {hasObrasJustificadas && (
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <h4>Obras y Tratados Fundamentales</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tema.obras_relacionadas.map((obra, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-amber-400/30 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-amber-400 shrink-0" />
                          <h5 className="text-sm sm:text-base font-bold text-amber-300 italic">
                            {obra.titulo}
                          </h5>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                          {obra.autor}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {obra.justificacion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

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
