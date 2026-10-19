import React, { useState, useMemo } from 'react';
import legislacionData from '../data/legislacion.json';
import {
  Scale,
  ExternalLink,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Search,
  Sparkles,
  Layers,
  GraduationCap,
  Tag,
  X,
  Target,
  ListChecks,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export default function LegislacionView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCcaa, setOpenCcaa] = useState({ 'comunidad-de-madrid': true }); // Madrid abierta por defecto
  
  // Estado para la ley estatal seleccionada para ver su desglose curricular (LOMLOE, RD ESO, RD Bachillerato)
  const [selectedLeyId, setSelectedLeyId] = useState('rd-bachillerato'); // Abierto por defecto en Bachillerato
  // Pestaña activa dentro del desglose curricular: 'competencias' | 'criterios' | 'saberes'
  const [activeTab, setActiveTab] = useState('competencias');
  // Filtro de materia para leyes con múltiples materias (como RD Bachillerato)
  const [materiaFilter, setMateriaFilter] = useState('todas');

  const toggleCcaa = (id) => {
    setOpenCcaa((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectLey = (id) => {
    if (selectedLeyId === id) {
      setSelectedLeyId(null); // Permite contraer si se pulsa de nuevo
    } else {
      setSelectedLeyId(id);
      setMateriaFilter('todas');
    }
  };

  const selectedLey = useMemo(() => {
    return legislacionData.nacional.find((l) => l.id === selectedLeyId);
  }, [selectedLeyId]);

  // Obtener las materias únicas disponibles en la ley seleccionada
  const availableMaterias = useMemo(() => {
    if (!selectedLey) return [];
    const set = new Set();
    if (selectedLey.competencias_especificas) {
      selectedLey.competencias_especificas.forEach((ce) => {
        if (ce.materia) set.add(ce.materia);
      });
    }
    return Array.from(set);
  }, [selectedLey]);

  // Filtrado de Competencias Específicas por materia
  const filteredCompetencias = useMemo(() => {
    if (!selectedLey?.competencias_especificas) return [];
    if (materiaFilter === 'todas') return selectedLey.competencias_especificas;
    return selectedLey.competencias_especificas.filter(
      (ce) => !ce.materia || ce.materia === materiaFilter
    );
  }, [selectedLey, materiaFilter]);

  // Filtrado de Criterios de Evaluación por materia
  const filteredCriterios = useMemo(() => {
    if (!selectedLey?.criterios_evaluacion) return [];
    if (materiaFilter === 'todas') return selectedLey.criterios_evaluacion;
    return selectedLey.criterios_evaluacion.filter(
      (cr) => !cr.materia || cr.materia === materiaFilter
    );
  }, [selectedLey, materiaFilter]);

  // Filtrado de Saberes Básicos por materia
  const filteredSaberes = useMemo(() => {
    if (!selectedLey?.saberes_basicos) return [];
    if (materiaFilter === 'todas') return selectedLey.saberes_basicos;
    return selectedLey.saberes_basicos.filter(
      (sb) => !sb.materia || sb.materia === materiaFilter
    );
  }, [selectedLey, materiaFilter]);

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
          Incluye el desglose exhaustivo de <strong>Competencias Específicas</strong>, <strong>Criterios de Evaluación</strong> y <strong>Saberes Básicos</strong> para las materias filosóficas de ESO y Bachillerato.
        </p>
      </div>

      {/* PANEL 1: LEY VIGENTE NACIONAL */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              1. Normativa Estatal Básica (BOE)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Haz clic en una tarjeta para desplegar su currículo
          </span>
        </div>

        {/* Tarjetas Principales de Leyes Estatales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {legislacionData.nacional.map((ley) => {
            const isSelected = selectedLeyId === ley.id;

            return (
              <div
                key={ley.id}
                onClick={() => handleSelectLey(ley.id)}
                className={`cursor-pointer rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-xl group border ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30 shadow-amber-500/10'
                    : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900'
                }`}
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
                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition">
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

                {/* Acciones de la Tarjeta */}
                <div className="pt-4 space-y-2">
                  <div className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-amber-300 border-slate-700'
                  }`}>
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Ocultar desglose curricular' : 'Ver desglose curricular'}</span>
                    {isSelected ? (
                      <ChevronUp className="w-3.5 h-3.5 ml-1" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 ml-1" />
                    )}
                  </div>

                  <a
                    href={ley.boeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-1.5 px-3 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] rounded-lg border border-slate-800 flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Consultar en BOE</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ÁREA EXPANDIDA: DESGLOSE CURRICULAR (Competencias, Criterios y Saberes) */}
        {selectedLey && (
          <div className="rounded-3xl border border-amber-400/40 bg-slate-900/95 shadow-2xl p-5 sm:p-7 md:p-8 space-y-6 animate-in fade-in zoom-in-98 duration-200 backdrop-blur-md">
            
            {/* Cabecera del Panel Curricular */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-mono border border-amber-400/30">
                    {selectedLey.siglas} • Desglose Curricular
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedLey.boletin}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                  {selectedLey.nombre}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  {selectedLey.relevanciaFilosofia}
                </p>
              </div>

              <button
                onClick={() => setSelectedLeyId(null)}
                className="p-2 self-start md:self-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition border border-slate-800 flex items-center gap-1 text-xs shrink-0"
                title="Cerrar desglose"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar</span>
              </button>
            </div>

            {/* Selector de Materias (si hay más de 1 materia, como en Bachillerato) */}
            {availableMaterias.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 w-fit">
                <span className="text-xs text-slate-400 font-semibold px-2.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Materia:</span>
                </span>
                <button
                  onClick={() => setMateriaFilter('todas')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    materiaFilter === 'todas'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Todas las materias
                </button>
                {availableMaterias.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setMateriaFilter(mat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      materiaFilter === mat
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            )}

            {/* Pestañas Principales: Competencias Específicas / Criterios de Evaluación / Saberes Básicos */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('competencias')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'competencias'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Competencias Específicas ({filteredCompetencias.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('criterios')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'criterios'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ListChecks className="w-4 h-4" />
                <span>Criterios de Evaluación ({filteredCriterios.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('saberes')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'saberes'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Saberes Básicos ({filteredSaberes.length} bloques)</span>
              </button>
            </div>

            {/* CONTENIDO DE LA PESTAÑA: COMPETENCIAS ESPECÍFICAS */}
            {activeTab === 'competencias' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCompetencias.map((ce, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-400/15 text-amber-300 font-mono font-bold text-xs border border-amber-400/30">
                          {ce.codigo}
                        </span>
                        {ce.materia && (
                          <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {ce.materia}
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition">
                        {ce.nombre}
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ce.descripcion}
                      </p>
                    </div>

                    {ce.descriptores && (
                      <div className="pt-2 border-t border-slate-900/80 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Perfil salida:</span>
                        {ce.descriptores.map((desc, dIdx) => (
                          <span
                            key={dIdx}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800"
                          >
                            {desc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CONTENIDO DE LA PESTAÑA: CRITERIOS DE EVALUACIÓN */}
            {activeTab === 'criterios' && (
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900/90 border-b border-slate-800 text-amber-300 font-bold uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3.5 w-20">Código</th>
                        {filteredCriterios.some(c => c.materia) && (
                          <th className="px-4 py-3.5 w-44">Materia</th>
                        )}
                        <th className="px-4 py-3.5 w-28">Competencia</th>
                        <th className="px-4 py-3.5">Criterio de Evaluación Oficial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {filteredCriterios.map((cr, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60 transition">
                          <td className="px-4 py-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                            {cr.codigo}
                          </td>
                          {filteredCriterios.some(c => c.materia) && (
                            <td className="px-4 py-3 text-slate-400 font-medium">
                              {cr.materia || cr.dimension || '—'}
                            </td>
                          )}
                          <td className="px-4 py-3 font-mono text-slate-400">
                            {cr.competencia ? (
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800 font-semibold">
                                {cr.competencia}
                              </span>
                            ) : (
                              cr.dimension || 'General'
                            )}
                          </td>
                          <td className="px-4 py-3 leading-relaxed text-slate-200">
                            {cr.descripcion}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTENIDO DE LA PESTAÑA: SABERES BÁSICOS */}
            {activeTab === 'saberes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSaberes.map((sb, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-sm hover:border-amber-400/40 transition"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-800/80">
                      <h5 className="font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{sb.bloque}</span>
                      </h5>
                      {sb.materia && (
                        <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {sb.materia}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-2 pt-1 text-xs text-slate-300 leading-relaxed">
                      {sb.contenidos.map((cont, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{cont}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

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
