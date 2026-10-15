import React, { useState } from 'react';
import legislacionData from '../data/legislacion.json';
import {
  Scale,
  ExternalLink,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Search,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react';

export default function LegislacionView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCcaa, setOpenCcaa] = useState({ 'comunidad-de-madrid': true }); // Madrid abierta por defecto

  const toggleCcaa = (id) => {
    setOpenCcaa((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCcaa = legislacionData.ccaa.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 lg:p-10 space-y-10">
      
      {/* Cabecera de la Sección */}
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Oposiciones de Filosofía • Especialidad Secundaria</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Marco Normativo y Ley Vigente
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Consulta la legislación educativa estatal y autonómica actualizada bajo el marco de la <strong>LOMLOE</strong>. 
          Indispensable para fundamentar la programación didáctica, las situaciones de aprendizaje y la defensa ante el tribunal.
        </p>
      </div>

      {/* PANEL 1: LEY VIGENTE NACIONAL */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              1. Normativa Estatal Básica (BOE)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Ámbito: Todo el territorio nacional
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {legislacionData.nacional.map((ley) => (
            <div
              key={ley.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-xl group hover:shadow-amber-500/5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-400/15 text-amber-300 font-mono font-bold text-xs border border-amber-400/30">
                    {ley.siglas}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {ley.boletin.split(',')[0]}
                  </span>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition">
                    {ley.nombre}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {ley.subtitulo}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ley.descripcion}
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Impacto en Filosofía:
                    </span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                      {ley.relevanciaFilosofia}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={ley.boeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full py-2.5 px-4 bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 font-semibold text-xs rounded-xl border border-slate-700/80 flex items-center justify-center gap-2 transition-all shadow-sm group/btn"
              >
                <span>Consultar en BOE</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL 2: COMUNIDADES AUTÓNOMAS */}
      <div className="max-w-6xl mx-auto space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              2. Currículos Autonómicos (17 Comunidades Autónomas)
            </h3>
          </div>

          {/* Buscador de Comunidad Autónoma */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar comunidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>

        {/* Lista de Acordeón */}
        <div className="space-y-3">
          {filteredCcaa.map((ca) => {
            const isOpen = !!openCcaa[ca.id];
            const isMadrid = ca.id === 'comunidad-de-madrid';

            return (
              <div
                key={ca.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isMadrid
                    ? 'border-amber-500/50 bg-slate-900/90 shadow-lg shadow-amber-500/5'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                {/* Cabecera del Acordeón */}
                <button
                  onClick={() => toggleCcaa(ca.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left transition hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isMadrid
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {ca.nombre.charAt(0)}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        {ca.nombre}
                        {isMadrid && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            BOCM Oficial Configurado
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Diario Oficial: <span className="font-mono text-slate-300">{ca.bocm_diario}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-xs hidden sm:inline">
                      {isOpen ? 'Ocultar decretos' : 'Ver decretos'}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Contenido desplegable con los Decretos */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Decreto de ESO */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                            ESO (Secundaria)
                          </span>
                          {ca.eso.boletinDetalle && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {ca.eso.boletinDetalle}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-sm text-white">
                          {ca.eso.norma}
                        </h5>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {ca.eso.descripcion}
                        </p>
                      </div>

                      <a
                        href={ca.eso.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 py-2 px-3 bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 font-semibold text-xs rounded-lg border border-slate-700/80 flex items-center justify-center gap-1.5 transition-all group/link"
                      >
                        <span>Consultar Decreto ESO ({ca.bocm_diario})</span>
                        <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    </div>

                    {/* Decreto de Bachillerato */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-400/10 text-sky-300 border border-sky-400/20">
                            Bachillerato
                          </span>
                          {ca.bachillerato.boletinDetalle && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {ca.bachillerato.boletinDetalle}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-sm text-white">
                          {ca.bachillerato.norma}
                        </h5>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {ca.bachillerato.descripcion}
                        </p>
                      </div>

                      <a
                        href={ca.bachillerato.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 py-2 px-3 bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 font-semibold text-xs rounded-lg border border-slate-700/80 flex items-center justify-center gap-1.5 transition-all group/link"
                      >
                        <span>Consultar Decreto Bachillerato ({ca.bocm_diario})</span>
                        <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
