import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  GraduationCap,
  Compass,
} from 'lucide-react';
import BLOQUES_TEMARIO from '../data/temario.json';

export default function TemarioView({ onNavigateToAtlas }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBloques = useMemo(() => {
    if (!searchTerm.trim()) return BLOQUES_TEMARIO;
    const term = searchTerm.toLowerCase();

    return BLOQUES_TEMARIO.map((b) => ({
      ...b,
      temas: b.temas.filter(
        (t) =>
          t.titulo.toLowerCase().includes(term) ||
          t.num.toString().includes(term)
      ),
    })).filter((b) => b.temas.length > 0);
  }, [searchTerm]);

  const totalTemasFiltrados = useMemo(() => {
    return filteredBloques.reduce((acc, b) => acc + b.temas.length, 0);
  }, [filteredBloques]);

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 lg:p-10 space-y-8">
      
      {/* Cabecera */}
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Oposiciones de Filosofía • Temario Oficial</span>
          {searchTerm && (
            <span className="text-amber-400 font-mono text-[11px]">({totalTemasFiltrados} temas encontrados)</span>
          )}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Temario Oficial de Oposiciones de Secundaria
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Estructura de los <strong>71 temas oficiales</strong> (Orden de 9 de septiembre de 1993, BOE 21/09/1993) 
          del Cuerpo de Profesores de Enseñanza Secundaria, en interconexión directa con los autores y épocas del Atlas Filosófico.
        </p>
      </div>

      {/* Barra de herramientas: Buscador y enlace rápido al Atlas */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por tema, filósofo, corriente o palabra clave (ej. Kant, ética, verdad)..."
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
        {filteredBloques.map((bloque, bIdx) => (
          <div
            key={bIdx}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl"
          >
            <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                {bloque.bloque}
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {bloque.temas.length} {bloque.temas.length === 1 ? 'tema' : 'temas'}
              </span>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {bloque.temas.map((tema) => (
                <div
                  key={tema.num}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-400/40 transition-all flex items-start gap-3 group"
                >
                  <span className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                    {tema.num}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white leading-snug">
                      {tema.titulo}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredBloques.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <p className="text-slate-400 text-sm">
              No se encontraron temas con el término «<strong>{searchTerm}</strong>».
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700"
            >
              Restablecer búsqueda
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
