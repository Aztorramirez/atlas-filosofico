import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  GraduationCap,
  Compass,
  Play,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import temarioData from '../data/temario.json';
import filosofosData from '../data/filosofos.json';
import TemaDetail from './TemaDetail';

export default function TemarioView({ onNavigateToAtlas }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemaId, setSelectedTemaId] = useState(null);

  // Filtrado reactivo de temas
  const filteredTemas = useMemo(() => {
    if (!searchTerm.trim()) return temarioData;
    const term = searchTerm.toLowerCase();

    return temarioData.filter((t) => {
      const matchTitulo = t.titulo.toLowerCase().includes(term);
      const matchNum = t.num.toString() === term || `tema ${t.num}`.includes(term);
      const matchBloque = t.bloque.toLowerCase().includes(term);
      const matchAutores = t.autores_relacionados?.some((id) => id.toLowerCase().includes(term));
      const matchCorrientes = t.corrientes_relacionadas?.some((c) => c.toLowerCase().includes(term));
      return matchTitulo || matchNum || matchBloque || matchAutores || matchCorrientes;
    });
  }, [searchTerm]);

  // Agrupar los temas filtrados en sus bloques temáticos correspondientes
  const groupedBloques = useMemo(() => {
    const map = new Map();
    for (const t of filteredTemas) {
      const bKey = t.bloque || 'General';
      if (!map.has(bKey)) {
        map.set(bKey, { bloque: bKey, temas: [] });
      }
      map.get(bKey).temas.push(t);
    }
    return Array.from(map.values());
  }, [filteredTemas]);

  // Tema seleccionado para la vista de detalle
  const selectedTema = useMemo(() => {
    if (selectedTemaId === null) return null;
    return temarioData.find((t) => t.id === selectedTemaId) || null;
  }, [selectedTemaId]);

  // Si hay un tema seleccionado, transicionamos a la Vista de Detalle
  if (selectedTema) {
    return (
      <TemaDetail
        tema={selectedTema}
        allTemas={temarioData}
        allFilosofos={filosofosData}
        onBack={() => setSelectedTemaId(null)}
        onSelectTema={(t) => setSelectedTemaId(t.id)}
      />
    );
  }

  // Vista General de Lista de Temas
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 lg:p-10 space-y-8">
      
      {/* Cabecera */}
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
          <span>Oposiciones de Filosofía • Temario Oficial</span>
          {searchTerm && (
            <span className="text-amber-400 font-mono text-[11px]">
              ({filteredTemas.length} temas encontrados)
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Temario Oficial de Oposiciones de Secundaria
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Estructura de los <strong>71 temas oficiales</strong> del Cuerpo de Profesores de Enseñanza Secundaria.
          Haz clic en cualquier tema para abrir su <strong>vista de estudio</strong> con videoclase y línea temporal filtrada.
        </p>
      </div>

      {/* Barra de herramientas: Buscador y enlace rápido al Atlas */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por tema, número, autor o palabra clave (ej. Kant, Platón, 49, verdad)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        {onNavigateToAtlas && (
          <button
            onClick={onNavigateToAtlas}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Ver autores en el Atlas</span>
          </button>
        )}
      </div>

      {/* Listado de Bloques Temáticos */}
      <div className="max-w-6xl mx-auto space-y-6">
        {groupedBloques.map((bloque, bIdx) => (
          <div
            key={bIdx}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl"
          >
            <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{bloque.bloque}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {bloque.temas.length} {bloque.temas.length === 1 ? 'tema' : 'temas'}
              </span>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {bloque.temas.map((tema) => {
                const hasVideo = Boolean(tema.video_url);
                const hasAutores = tema.autores_relacionados && tema.autores_relacionados.length > 0;

                return (
                  <div
                    key={tema.id}
                    onClick={() => setSelectedTemaId(tema.id)}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-400/50 hover:bg-slate-900/90 hover:scale-[1.008] transition-all flex items-start justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                        {tema.num}
                      </span>
                      <div className="space-y-1.5 flex-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-amber-300 leading-snug transition-colors">
                          {tema.titulo}
                        </h4>

                        {/* Badges de recursos del tema */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {hasAutores && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] font-mono">
                              <Users className="w-2.5 h-2.5" />
                              <span>{tema.autores_relacionados.length} autores</span>
                            </span>
                          )}
                          {hasVideo && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 text-[10px] font-mono">
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>Videoclase</span>
                            </span>
                          )}
                          {!hasAutores && !hasVideo && (
                            <span className="text-[10px] text-slate-600 font-mono">
                              Ficha de estudio
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-600 group-hover:text-amber-400 transition-colors shrink-0 mt-1">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {groupedBloques.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-slate-400 text-sm">
              No se encontraron temas con el término «<strong>{searchTerm}</strong>».
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs px-3.5 py-2 rounded-xl bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700 transition"
            >
              Restablecer búsqueda
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
