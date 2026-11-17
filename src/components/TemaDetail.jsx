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

  // Micro-interacción magnética Pro Max para el CTA focal (respeta prefers-reduced-motion)
  const handleMagneticMove = (e) => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.16;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.16;
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  };

  const handleMagneticLeave = (e) => {
    e.currentTarget.style.transform = 'translate3d(0, 0, 0)';
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-academia-mesh text-slate-100 px-4 sm:px-8 md:px-10 py-8 sm:py-12 space-y-14 sm:space-y-20">
      
      {/* Barra superior de navegación flotante */}
      <nav
        aria-label="Navegación del temario"
        className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap animate-fade-in"
      >
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-md border border-white/10 hover:border-amber-400/40 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver al listado</span>
        </button>

        {/* Paginación anterior / siguiente */}
        <div className="flex items-center gap-1.5 bg-white/[0.03] backdrop-blur-md p-1 rounded-full border border-white/10">
          {prevTema && (
            <button
              type="button"
              onClick={() => {
                setSelectedFilosofo(null);
                onSelectTema(prevTema);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title={`Tema ${prevTema.num}: ${prevTema.titulo}`}
            >
              <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Tema {prevTema.num}</span>
            </button>
          )}

          <span className="text-xs text-slate-300 font-mono tabular-nums px-3">
            {tema.num} <span className="text-slate-500">/</span> {allTemas.length}
          </span>

          {nextTema && (
            <button
              type="button"
              onClick={() => {
                setSelectedFilosofo(null);
                onSelectTema(nextTema);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title={`Tema ${nextTema.num}: ${nextTema.titulo}`}
            >
              <span>Tema {nextTema.num}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
        </div>
      </nav>

      {/* HERO EDITORIAL ASIMÉTRICO */}
      <header className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start animate-fade-in-up">
        
        {/* Columna Izquierda (8 cols): Tipografía editorial dramática y sinopsis */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3.5 flex-wrap">
            <span className="font-editorial italic text-4xl sm:text-5xl font-semibold text-amber-400 leading-none tabular-nums">
              {String(tema.num).padStart(2, '0')}
            </span>
            <span className="h-6 w-px bg-white/15" aria-hidden="true" />
            <span className="px-3.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 text-xs font-semibold tracking-wide">
              {tema.bloque}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Oposiciones Secundaria • Filosofía
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight text-white leading-[1.08] text-balance">
            {tema.titulo}
          </h1>

          {tema?.sinopsis && (
            <div className="pt-2">
              <p className="border-l-2 border-amber-400/40 pl-5 sm:pl-6 max-w-[62ch] text-base sm:text-lg text-slate-300 leading-[1.8] text-pretty whitespace-pre-line">
                {tema.sinopsis}
              </p>
            </div>
          )}
        </div>

        {/* Columna Derecha (4 cols): Tarjeta Glassmorphic de Videoclase & Ficha */}
        <aside className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 space-y-6 lg:sticky lg:top-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-semibold text-slate-300 tracking-wide">
              Dossier del Tema
            </span>
            <span className="font-mono text-xs tabular-nums text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
              BOE • {tema.num}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
              <div className="text-[11px] text-slate-400">Pensadores</div>
              <div className="font-editorial text-2xl font-semibold text-white tabular-nums mt-0.5">
                {relatedFilosofos.length}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
              <div className="text-[11px] text-slate-400">Obras clave</div>
              <div className="font-editorial text-2xl font-semibold text-white tabular-nums mt-0.5">
                {tema?.obras_relacionadas?.length || 0}
              </div>
            </div>
          </div>

          {/* CTA Magnético de Videoclase */}
          {tema.video_url ? (
            <a
              href={tema.video_url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              style={{ willChange: 'transform', transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s ease, box-shadow 0.25s ease' }}
              className="group relative flex items-center justify-between gap-3 w-full p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-[0.98] shadow-[0_14px_36px_rgba(251,191,36,0.26)] hover:shadow-[0_18px_44px_rgba(251,191,36,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </span>
                <div className="text-left">
                  <div className="text-sm font-extrabold leading-tight">
                    Ver Videoclase
                  </div>
                  <div className="text-[11px] font-semibold text-slate-800">
                    Explicación completa en YouTube
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 shrink-0 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <div className="flex items-center gap-3 w-full p-4 rounded-2xl bg-black/30 border border-white/10 text-slate-400">
              <span className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-slate-400" />
              </span>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-300">
                  Videoclase en preparación
                </div>
                <div className="text-[11px] text-slate-400">
                  Próximamente disponible en el archivo
                </div>
              </div>
            </div>
          )}
        </aside>
      </header>

      {/* PÍLDORAS DE AUTORES RELACIONADOS */}
      {relatedFilosofos.length > 0 && (
        <section
          aria-label="Pensadores clave"
          className="max-w-6xl mx-auto space-y-3.5 animate-fade-in-up"
          style={{ animationDelay: '80ms' }}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pensadores clave en este tema</span>
            </h2>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              1 clic: ficha rápida · 2 clics: biografía
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {relatedFilosofos.map((f, idx) => {
              const isSelected = selectedFilosofo?.id === f.id;
              return (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setSelectedFilosofo(isSelected ? null : f)}
                  onDoubleClick={() => setModalFilosofo(f)}
                  style={{ '--stagger-index': idx }}
                  className={`stagger-item magnetic-card px-4 py-2 rounded-full border text-xs font-medium flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_8px_24px_rgba(251,191,36,0.28)]'
                      : 'bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] text-slate-200 border-white/10 hover:border-amber-400/40'
                  }`}
                  title="1 clic: ver ficha | 2 clics: ver biografía completa"
                >
                  <span>{f.nombre}</span>
                  <span
                    className={`text-[11px] font-mono tabular-nums ${
                      isSelected ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {f.epoca_año}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* SECCIÓN DEL TIMELINEFLOW FILTRADO */}
      <section
        className="max-w-6xl mx-auto space-y-5 animate-fade-in-up"
        style={{ animationDelay: '140ms' }}
      >
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-white flex items-center gap-2.5 tracking-tight">
              <Compass className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Línea Temporal Filtrada</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-[60ch]">
              Marco cronológico interactivo con los pensadores vinculados a este tema.
            </p>
          </div>
          {relatedFilosofos.length > 0 && (
            <span className="text-xs text-amber-300 font-medium tabular-nums bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/25">
              {relatedFilosofos.length} pensadores en escena
            </span>
          )}
        </div>

        {/* Contenedor Glassmorphic del TimelineFlow */}
        <div className="w-full h-[480px] rounded-3xl border border-white/10 bg-[#04070f]/90 backdrop-blur-xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.75)] relative">
          {relatedFilosofos.length > 0 ? (
            <TimelineFlow
              filosofos={relatedFilosofos}
              selectedFilosofo={selectedFilosofo}
              onSelectFilosofo={(f) => setSelectedFilosofo(f)}
              onOpenBiography={(f) => setModalFilosofo(f)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-amber-400/80">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="font-editorial text-xl font-semibold text-slate-200">
                  Sin autores vinculados todavía
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Para visualizar la línea temporal de este tema, añade los IDs de los filósofos correspondientes en el campo{' '}
                  <code className="text-amber-300 bg-white/[0.06] px-1.5 py-0.5 rounded font-mono text-xs">
                    "autores_relacionados"
                  </code>{' '}
                  de <code className="text-slate-300 font-mono text-xs">src/data/temario.json</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN EDITORIAL ASIMÉTRICA: JUSTIFICACIÓN CURRICULAR PARA EL EXAMEN
      ========================================================================= */}
      {(hasAutoresJustificados || hasCorrientesJustificadas || hasObrasJustificadas) && (
        <section
          className="max-w-6xl mx-auto pt-8 border-t border-white/10 space-y-12 animate-fade-in-up deferred-section"
          style={{ animationDelay: '200ms' }}
        >
          {/* Cabecera Editorial */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-white tracking-tight flex items-center gap-3">
                <GraduationCap className="w-7 h-7 text-amber-400 shrink-0" />
                <span>Justificación Curricular para el Examen</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Fundamentación conceptual de la presencia de cada autor, corriente y obra en el desarrollo temático ante el tribunal.
              </p>
            </div>
            <span className="text-xs text-slate-300 font-mono tabular-nums bg-white/[0.04] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 self-start md:self-auto shrink-0">
              Tema {tema.num} • Argumentario BOE
            </span>
          </div>

          {/* Sub-bloque 1: Autores Clave (Layout Asimétrico 4/8) */}
          {hasAutoresJustificados && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-6">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                  <Users className="w-4 h-4 text-amber-400" />
                  <h3>Autores Clave y Enfoque</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Haz clic sobre cualquier pensador para localizarlo y destacarlo en la línea temporal interactiva.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {autoresConJustificacion.map(({ filosofo, justificacion, id_filosofo, nombre: authorDisplay }, idx) => {
                  const nombre = authorDisplay || (filosofo ? filosofo.nombre : id_filosofo);
                  const epoca = filosofo ? filosofo.epoca_año : '';
                  const CardTag = filosofo ? 'button' : 'article';
                  return (
                    <CardTag
                      key={id_filosofo}
                      style={{ '--stagger-index': idx }}
                      {...(filosofo
                        ? {
                            type: 'button',
                            onClick: () => setSelectedFilosofo(filosofo),
                            title: 'Haz clic para seleccionar en la línea temporal',
                          }
                        : {})}
                      className={`stagger-item magnetic-card p-6 rounded-3xl glass-panel text-left w-full space-y-3.5 ${
                        filosofo
                          ? 'hover:border-amber-400/45 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-400/25 flex items-center justify-center font-editorial italic font-bold text-xl group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shrink-0">
                            {nombre.charAt(0)}
                          </span>
                          <div>
                            <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                              {nombre}
                            </h4>
                            {filosofo?.corrientes?.[0] && (
                              <div className="text-xs text-slate-400">
                                {filosofo.corrientes[0]}
                              </div>
                            )}
                          </div>
                        </div>
                        {epoca && (
                          <span className="text-xs font-mono tabular-nums text-slate-400 shrink-0">
                            {epoca}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-300 leading-[1.7]">
                        {justificacion}
                      </p>
                    </CardTag>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-bloques 2 y 3: Corrientes y Obras en Composición Asimétrica */}
          {(hasCorrientesJustificadas || hasObrasJustificadas) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/10">
              
              {/* Corrientes y Tradiciones */}
              {hasCorrientesJustificadas && (
                <div className={`${hasObrasJustificadas ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h3>Corrientes y Tradiciones</h3>
                  </div>

                  <div className="space-y-3">
                    {corrientesConJustificacion.map((c, idx) => (
                      <article
                        key={idx}
                        style={{ '--stagger-index': idx }}
                        className="stagger-item magnetic-card p-5 rounded-2xl glass-panel space-y-2"
                      >
                        <h4 className="text-base font-bold text-amber-300">
                          {c.nombre}
                        </h4>
                        <p className="text-sm text-slate-300 leading-[1.7]">
                          {c.justificacion}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Obras y Tratados Fundamentales */}
              {hasObrasJustificadas && (
                <div className={`${hasCorrientesJustificadas ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <h3>Obras y Tratados Fundamentales</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tema.obras_relacionadas.map((obra, idx) => (
                      <article
                        key={idx}
                        style={{ '--stagger-index': idx }}
                        className="stagger-item magnetic-card p-5 rounded-2xl glass-panel space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <Bookmark className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-slate-200 text-[11px] font-semibold">
                              {obra.autor}
                            </span>
                          </div>
                          <h4 className="font-editorial italic text-xl font-semibold text-amber-200 leading-snug">
                            {obra.titulo}
                          </h4>
                        </div>

                        <p className="text-sm text-slate-300 leading-[1.65]">
                          {obra.justificacion}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </section>
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
