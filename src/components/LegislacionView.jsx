import React, { useState, useMemo } from 'react';
import legislacionData from '../data/legislacion.json';
import {
  Scale,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  GraduationCap,
  X,
  Target,
  ListChecks,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
  Brain,
  Shield,
  ScrollText,
} from 'lucide-react';

export default function LegislacionView() {
  // Pestaña principal activa: 'asignaturas' | 'descriptores' | 'objetivos'
  const [mainTab, setMainTab] = useState('asignaturas');

  // En 'asignaturas': id de la asignatura activa ('valores', 'filosofia', 'historia-filosofia', 'psicologia')
  const [selectedAsignaturaId, setSelectedAsignaturaId] = useState('filosofia');

  // Sub-pestaña dentro de la asignatura: 'competencias' | 'saberes' | 'criterios'
  const [asignaturaSubTab, setAsignaturaSubTab] = useState('competencias');

  // Filtro de bloque en saberes básicos
  const [selectedBloqueFilter, setSelectedBloqueFilter] = useState('TODOS');

  // En 'descriptores': filtro de competencia clave ('TODAS' | 'CCL' | 'CP' | 'STEM' | 'CD' | 'CPSAA' | 'CC' | 'CE' | 'CCEC')
  const [selectedClaveFilter, setSelectedClaveFilter] = useState('TODAS');

  // En 'objetivos': etapa activa ('eso' | 'bachillerato')
  const [selectedEtapa, setSelectedEtapa] = useState('bachillerato');

  // Término de búsqueda global/local
  const [searchTerm, setSearchTerm] = useState('');

  // Estado de acordeones de competencias específicas { [numero]: boolean }
  const [openCompetencias, setOpenCompetencias] = useState({ 1: true, 2: true });

  // Estado del modal de información rápida de descriptor
  const [activeDescriptorModal, setActiveDescriptorModal] = useState(null);

  // Diccionario global de descriptores operativos y sus competencias clave
  const descriptoresMap = useMemo(() => {
    const map = {};
    legislacionData.descriptoresOperativos.competencias.forEach((comp) => {
      comp.descriptores.forEach((desc) => {
        map[desc.codigo] = {
          ...desc,
          claveCodigo: comp.codigo,
          claveNombre: comp.nombre,
        };
      });
    });
    return map;
  }, []);

  // Mapeo inverso: para cada descriptor, en qué materias y competencias se utiliza
  const descriptorUsos = useMemo(() => {
    const usos = {};
    legislacionData.asignaturas.forEach((asig) => {
      asig.competencias.forEach((comp) => {
        comp.descriptores.forEach((dCode) => {
          if (!usos[dCode]) usos[dCode] = [];
          usos[dCode].push({
            asignaturaId: asig.id,
            asignaturaNombre: asig.nombreCorto || asig.nombre,
            competenciaNumero: comp.numero,
            competenciaTexto: comp.texto,
          });
        });
      });
    });
    return usos;
  }, []);

  // Asignatura activa
  const activeAsignatura = useMemo(() => {
    return (
      legislacionData.asignaturas.find((a) => a.id === selectedAsignaturaId) ||
      legislacionData.asignaturas[1]
    );
  }, [selectedAsignaturaId]);

  // Manejar click en un descriptor tag para abrir modal
  const handleOpenDescriptor = (code) => {
    const info = descriptoresMap[code];
    if (info) {
      setActiveDescriptorModal({
        ...info,
        usos: descriptorUsos[code] || [],
      });
    } else {
      setActiveDescriptorModal({
        codigo: code,
        texto: 'Descriptor operativo oficial recogido en el perfil de salida.',
        claveCodigo: code.replace(/[0-9.]/g, ''),
        claveNombre: 'Competencia Clave',
        usos: descriptorUsos[code] || [],
      });
    }
  };

  // Alternar acordeón de competencia
  const toggleCompetencia = (num) => {
    setOpenCompetencias((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const expandAllCompetencias = () => {
    const all = {};
    activeAsignatura.competencias.forEach((c) => {
      all[c.numero] = true;
    });
    setOpenCompetencias(all);
  };

  const collapseAllCompetencias = () => {
    setOpenCompetencias({});
  };

  // Filtrado de Competencias Específicas
  const filteredCompetencias = useMemo(() => {
    if (!searchTerm.trim()) return activeAsignatura.competencias;
    const term = searchTerm.toLowerCase();
    return activeAsignatura.competencias.filter((c) => {
      const matchText = c.texto.toLowerCase().includes(term);
      const matchNum = `competencia ${c.numero}`.includes(term) || `ce ${c.numero}`.includes(term);
      const matchDesc = c.descriptores.some((d) => d.toLowerCase().includes(term));
      const matchCrit = c.criterios?.some(
        (cr) => cr.codigo.toLowerCase().includes(term) || cr.texto.toLowerCase().includes(term)
      );
      return matchText || matchNum || matchDesc || matchCrit;
    });
  }, [activeAsignatura, searchTerm]);

  // Filtrado de Saberes Básicos
  const filteredSaberes = useMemo(() => {
    let bloques = activeAsignatura.saberes;
    if (selectedBloqueFilter !== 'TODOS') {
      bloques = bloques.filter((b) => b.letra === selectedBloqueFilter);
    }
    if (!searchTerm.trim()) return bloques;
    const term = searchTerm.toLowerCase();

    return bloques
      .map((b) => {
        const matchingItems = b.items.filter((item) => item.texto.toLowerCase().includes(term));
        const blockMatches = b.titulo.toLowerCase().includes(term);
        if (blockMatches) return b;
        if (matchingItems.length > 0) {
          return {
            ...b,
            items: matchingItems,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [activeAsignatura, selectedBloqueFilter, searchTerm]);

  // Filtrado de Criterios de Evaluación de la asignatura activa
  const filteredCriterios = useMemo(() => {
    const list = activeAsignatura.criteriosEvaluacion;
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (cr) =>
        cr.codigo.toLowerCase().includes(term) ||
        cr.texto.toLowerCase().includes(term) ||
        `competencia ${cr.competencia}`.includes(term)
    );
  }, [activeAsignatura, searchTerm]);

  // Filtrado de Descriptores Operativos
  const filteredDescriptoresClave = useMemo(() => {
    let comps = legislacionData.descriptoresOperativos.competencias;
    if (selectedClaveFilter !== 'TODAS') {
      comps = comps.filter((c) => c.codigo === selectedClaveFilter);
    }
    if (!searchTerm.trim()) return comps;
    const term = searchTerm.toLowerCase();

    return comps
      .map((c) => {
        const filteredDesc = c.descriptores.filter(
          (d) =>
            d.codigo.toLowerCase().includes(term) ||
            d.texto.toLowerCase().includes(term) ||
            c.nombre.toLowerCase().includes(term)
        );
        if (filteredDesc.length > 0) {
          return {
            ...c,
            descriptores: filteredDesc,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [selectedClaveFilter, searchTerm]);

  // Filtrado de Objetivos de Etapa
  const activeObjetivosData = useMemo(() => {
    const data = legislacionData.objetivosEtapa[selectedEtapa];
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return {
      ...data,
      objetivos: data.objetivos.filter(
        (o) =>
          o.letra.toLowerCase().includes(term) ||
          o.texto.toLowerCase().includes(term) ||
          `objetivo ${o.letra}`.includes(term)
      ),
    };
  }, [selectedEtapa, searchTerm]);

  // Total de elementos encontrados con el buscador
  const searchResultsCount = useMemo(() => {
    if (!searchTerm.trim()) return 0;
    if (mainTab === 'asignaturas') {
      if (asignaturaSubTab === 'competencias') return filteredCompetencias.length;
      if (asignaturaSubTab === 'saberes') {
        return filteredSaberes.reduce((acc, b) => acc + b.items.length, 0);
      }
      return filteredCriterios.length;
    }
    if (mainTab === 'descriptores') {
      return filteredDescriptoresClave.reduce((acc, c) => acc + c.descriptores.length, 0);
    }
    if (mainTab === 'objetivos') {
      return activeObjetivosData.objetivos.length;
    }
    return 0;
  }, [
    searchTerm,
    mainTab,
    asignaturaSubTab,
    filteredCompetencias,
    filteredSaberes,
    filteredCriterios,
    filteredDescriptoresClave,
    activeObjetivosData,
  ]);

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 lg:p-10 space-y-8">
      {/* =========================================================================
          CABECERA PRINCIPAL
      ========================================================================= */}
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span>Marco Curricular Oficial • LOMLOE & Comunidad de Madrid</span>
          {searchTerm && (
            <span className="text-amber-400 font-mono text-[11px]">
              ({searchResultsCount} coincidencias)
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
          Legislación y Currículo de Filosofía
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Estructura curricular completa del departamento: <strong>Objetivos de Etapa</strong> (ESO y Bachillerato),{' '}
          <strong>Descriptores Operativos</strong> (Perfil de Salida LOMLOE) y el currículo madrileño por materias:
          competencias específicas, criterios de evaluación y saberes básicos.
        </p>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Materias Oficiales</div>
              <div className="text-sm font-bold text-white">4 Asignaturas</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <Target className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Competencias Esp.</div>
              <div className="text-sm font-bold text-white">27 en total</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <ListChecks className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Criterios de Eval.</div>
              <div className="text-sm font-bold text-white">64 criterios</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Descriptores Perfil</div>
              <div className="text-sm font-bold text-white">34 clave</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BARRA DE HERRAMIENTAS: PESTAÑAS PRINCIPALES Y BUSCADOR
      ========================================================================= */}
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Navegación de Nivel Superior */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => setMainTab('asignaturas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mainTab === 'asignaturas'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Currículo por Asignatura</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                mainTab === 'asignaturas' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              4 materias
            </span>
          </button>

          <button
            onClick={() => setMainTab('descriptores')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mainTab === 'descriptores'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Descriptores Operativos</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                mainTab === 'descriptores' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              8 claves
            </span>
          </button>

          <button
            onClick={() => setMainTab('objetivos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mainTab === 'objetivos'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Objetivos de Etapa</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                mainTab === 'objetivos' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              ESO & Bach.
            </span>
          </button>
        </div>

        {/* Buscador reactivo */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={
              mainTab === 'asignaturas'
                ? `Buscar en ${activeAsignatura.nombreCorto} (ej. argumento, ética, 1.2, CCL2)...`
                : mainTab === 'descriptores'
                ? 'Buscar por código o texto de descriptor (ej. CCL1, digital, emociones)...'
                : 'Buscar en objetivos de etapa (ej. democracia, ciencia, igualdad)...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          CONTENIDO: PESTAÑA 1 - CURRÍCULO POR ASIGNATURA
      ========================================================================= */}
      {mainTab === 'asignaturas' && (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Selector de Asignatura */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {legislacionData.asignaturas.map((asig) => {
              const isSelected = asig.id === selectedAsignaturaId;
              let IconComp = BookOpen;
              if (asig.id === 'valores') IconComp = Shield;
              if (asig.id === 'filosofia') IconComp = Brain;
              if (asig.id === 'historia-filosofia') IconComp = ScrollText;
              if (asig.id === 'psicologia') IconComp = Sparkles;

              return (
                <button
                  key={asig.id}
                  onClick={() => {
                    setSelectedAsignaturaId(asig.id);
                    setSelectedBloqueFilter('TODOS');
                  }}
                  className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/50 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {asig.etapaCorta}
                    </span>
                  </div>
                  <div>
                    <div
                      className={`text-xs sm:text-sm font-bold line-clamp-1 ${
                        isSelected ? 'text-amber-300' : 'text-slate-200'
                      }`}
                    >
                      {asig.nombreCorto || asig.nombre}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {asig.competencias.length} CE • {asig.criteriosEvaluacion.length} Crit.
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tarjeta de Información de la Asignatura Activa */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{activeAsignatura.nombre}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    {activeAsignatura.curso}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed max-w-4xl">
                  {activeAsignatura.descripcion}
                </p>
              </div>

              {activeAsignatura.marcoLegalUrl && (
                <a
                  href={activeAsignatura.marcoLegalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold transition shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver en BOCAM</span>
                </a>
              )}
            </div>

            <div className="pt-2 text-xs text-slate-400 border-t border-slate-800/60 flex items-center gap-2 flex-wrap">
              <span className="text-slate-500 font-medium">Marco regulador:</span>
              <span className="text-slate-300 font-mono text-[11px]">{activeAsignatura.marcoLegal}</span>
            </div>

            {/* Sub-pestañas de la Asignatura */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 overflow-x-auto">
              <button
                onClick={() => setAsignaturaSubTab('competencias')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                  asignaturaSubTab === 'competencias'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Competencias Específicas ({activeAsignatura.competencias.length})</span>
              </button>

              <button
                onClick={() => setAsignaturaSubTab('saberes')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                  asignaturaSubTab === 'saberes'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Saberes Básicos ({activeAsignatura.saberes.length} Bloques)</span>
              </button>

              <button
                onClick={() => setAsignaturaSubTab('criterios')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                  asignaturaSubTab === 'criterios'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Criterios de Evaluación ({activeAsignatura.criteriosEvaluacion.length})</span>
              </button>
            </div>
          </div>

          {/* 1.1 SUB-VISTA: COMPETENCIAS ESPECÍFICAS */}
          {asignaturaSubTab === 'competencias' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Mostrando {filteredCompetencias.length} de {activeAsignatura.competencias.length} competencias
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAllCompetencias}
                    className="hover:text-amber-400 transition"
                  >
                    Expandir todas
                  </button>
                  <span>•</span>
                  <button
                    onClick={collapseAllCompetencias}
                    className="hover:text-amber-400 transition"
                  >
                    Contraer todas
                  </button>
                </div>
              </div>

              {filteredCompetencias.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  No se encontraron competencias específicas con el término{' '}
                  <strong className="text-white">"{searchTerm}"</strong>.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCompetencias.map((comp) => {
                    const isOpen = Boolean(openCompetencias[comp.numero]);
                    return (
                      <div
                        key={comp.numero}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all hover:border-slate-700"
                      >
                        {/* Cabecera de la Competencia */}
                        <div
                          onClick={() => toggleCompetencia(comp.numero)}
                          className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-4 select-none hover:bg-slate-800/30 transition"
                        >
                          <div className="space-y-2.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-bold font-mono">
                                CE {comp.numero}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">
                                Competencia Específica {comp.numero}
                              </span>
                            </div>

                            <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                              {comp.texto}
                            </p>

                            {/* Tags de Descriptores Operativos */}
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              <span className="text-[11px] text-slate-500 font-semibold mr-1">
                                Descriptores vinculados:
                              </span>
                              {comp.descriptores.map((dCode) => (
                                <button
                                  key={dCode}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDescriptor(dCode);
                                  }}
                                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-400/30 text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1"
                                  title="Ver definición oficial del descriptor"
                                >
                                  <span>{dCode}</span>
                                  <Info className="w-2.5 h-2.5 opacity-60" />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="p-1 rounded-lg bg-slate-800 text-slate-400 shrink-0 mt-1">
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-amber-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>

                        {/* Criterios vinculados (Acordeón desplegable) */}
                        {isOpen && comp.criterios && comp.criterios.length > 0 && (
                          <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-2.5">
                            <div className="text-xs font-bold text-amber-400/90 flex items-center gap-2">
                              <ListChecks className="w-3.5 h-3.5" />
                              <span>Criterios de Evaluación vinculados ({comp.criterios.length}):</span>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              {comp.criterios.map((crit) => (
                                <div
                                  key={crit.codigo}
                                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3"
                                >
                                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-amber-300 text-xs font-bold shrink-0 mt-0.5">
                                    {crit.codigo}
                                  </span>
                                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    {crit.texto}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 1.2 SUB-VISTA: SABERES BÁSICOS */}
          {asignaturaSubTab === 'saberes' && (
            <div className="space-y-4">
              {/* Filtro por Bloque */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-slate-500 font-medium shrink-0">Filtrar bloque:</span>
                <button
                  onClick={() => setSelectedBloqueFilter('TODOS')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                    selectedBloqueFilter === 'TODOS'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Todos los bloques ({activeAsignatura.saberes.length})
                </button>
                {activeAsignatura.saberes.map((b) => (
                  <button
                    key={b.letra}
                    onClick={() => setSelectedBloqueFilter(b.letra)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                      selectedBloqueFilter === b.letra
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Bloque {b.letra}
                  </button>
                ))}
              </div>

              {filteredSaberes.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  No se encontraron saberes básicos para el filtro o término actual.
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredSaberes.map((bloque) => (
                    <div
                      key={bloque.letra}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                          {bloque.letra}
                        </span>
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                            Bloque {bloque.letra}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white">{bloque.titulo}</h3>
                        </div>
                      </div>

                      {/* Lista de contenidos jerarquizada */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        {bloque.items.map((item, idx) => {
                          const isLevel1 = item.nivel === 1;
                          const isLevel3 = item.nivel === 3;
                          return (
                            <div
                              key={idx}
                              className={`flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed ${
                                isLevel1
                                  ? 'font-bold text-amber-300 pt-3 pb-1 border-b border-slate-800/40 first:pt-0'
                                  : isLevel3
                                  ? 'pl-6 text-slate-400'
                                  : 'pl-2 text-slate-300'
                              }`}
                            >
                              <span
                                className={`shrink-0 select-none ${
                                  isLevel1
                                    ? 'text-amber-400'
                                    : isLevel3
                                    ? 'text-slate-600'
                                    : 'text-amber-400/80 font-bold'
                                }`}
                              >
                                {isLevel1 ? '§' : isLevel3 ? '•' : '–'}
                              </span>
                              <span>{item.texto}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 1.3 SUB-VISTA: CRITERIOS DE EVALUACIÓN */}
          {asignaturaSubTab === 'criterios' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Mostrando {filteredCriterios.length} de {activeAsignatura.criteriosEvaluacion.length} criterios
                </span>
                <span className="font-mono text-[11px] text-amber-400">
                  {activeAsignatura.nombreCorto || activeAsignatura.nombre}
                </span>
              </div>

              {filteredCriterios.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  No se encontraron criterios de evaluación con el término "{searchTerm}".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredCriterios.map((crit) => (
                    <div
                      key={crit.codigo}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 font-mono text-xs font-bold">
                            Criterio {crit.codigo}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            CE {crit.competencia}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{crit.texto}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Evalúa la Competencia Específica {crit.competencia}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          CONTENIDO: PESTAÑA 2 - DESCRIPTORES OPERATIVOS (PERFIL DE SALIDA)
      ========================================================================= */}
      {mainTab === 'descriptores' && (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Explicación oficial Educagob */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Perfil de Salida del Alumnado • Marco Estatal LOMLOE</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              «{legislacionData.descriptoresOperativos.definicion}»
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
              <span>Fuente: {legislacionData.descriptoresOperativos.fuente}</span>
              <a
                href={legislacionData.descriptoresOperativos.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-400 hover:underline font-medium"
              >
                <span>educagob.educacion.gob.es</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Filtro por Competencia Clave */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-slate-500 font-medium shrink-0">Competencia clave:</span>
            <button
              onClick={() => setSelectedClaveFilter('TODAS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                selectedClaveFilter === 'TODAS'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Todas (34)
            </button>
            {legislacionData.descriptoresOperativos.competencias.map((comp) => (
              <button
                key={comp.codigo}
                onClick={() => setSelectedClaveFilter(comp.codigo)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  selectedClaveFilter === comp.codigo
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {comp.codigo} ({comp.descriptores.length})
              </button>
            ))}
          </div>

          {/* Listado de Competencias Clave y sus descriptores */}
          {filteredDescriptoresClave.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
              No se encontraron descriptores operativos para el filtro actual.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDescriptoresClave.map((comp) => (
                <div
                  key={comp.codigo}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black font-mono text-sm">
                        {comp.codigo}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">{comp.nombre}</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {comp.descriptores.length} descriptores operativos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {comp.descriptores.map((desc) => {
                      const usos = descriptorUsos[desc.codigo] || [];
                      return (
                        <div
                          key={desc.codigo}
                          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-400/40 transition space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                {desc.codigo}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">LOMLOE</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{desc.texto}</p>
                          </div>

                          {/* Vinculación con asignaturas de Filosofía */}
                          <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                              Vinculado en el departamento:
                            </div>
                            {usos.length > 0 ? (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {usos.map((uso, uIdx) => (
                                  <span
                                    key={uIdx}
                                    className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono"
                                  >
                                    {uso.asignaturaNombre}: CE{uso.competenciaNumero}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-600 italic">
                                Descriptor transversal
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          CONTENIDO: PESTAÑA 3 - OBJETIVOS DE ETAPA
      ========================================================================= */}
      {mainTab === 'objetivos' && (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Selector de Etapa: ESO vs Bachillerato */}
          <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setSelectedEtapa('eso')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                selectedEtapa === 'eso'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>ESO • Real Decreto 217/2022</span>
              <span className="font-mono text-xs">(12 objetivos a-l)</span>
            </button>

            <button
              onClick={() => setSelectedEtapa('bachillerato')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                selectedEtapa === 'bachillerato'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Bachillerato • Real Decreto 243/2022</span>
              <span className="font-mono text-xs">(15 objetivos a-o)</span>
            </button>
          </div>

          {/* Banner de Referencia Legal */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-1">
                {activeObjetivosData.articulos}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{activeObjetivosData.titulo}</h2>
              <p className="text-xs text-slate-400 mt-1">{activeObjetivosData.normativa}</p>
            </div>

            <a
              href={activeObjetivosData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 text-xs font-semibold border border-slate-700 transition shrink-0"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Consultar en el BOE</span>
            </a>
          </div>

          {/* Grid de Objetivos a-l / a-o */}
          {activeObjetivosData.objetivos.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
              No se encontraron objetivos de etapa para la búsqueda "{searchTerm}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeObjetivosData.objetivos.map((obj) => (
                <div
                  key={obj.letra}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-start gap-4"
                >
                  <span className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center font-black font-mono text-sm shrink-0 mt-0.5">
                    {obj.letra}
                  </span>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400">
                      Objetivo {obj.letra})
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{obj.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL DE INFORMACIÓN RÁPIDA DE DESCRIPTOR OPERATIVO
      ========================================================================= */}
      {activeDescriptorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-black font-mono text-xs">
                    {activeDescriptorModal.codigo}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {activeDescriptorModal.claveCodigo}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeDescriptorModal.claveNombre}
                </h3>
              </div>
              <button
                onClick={() => setActiveDescriptorModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 leading-relaxed">
              {activeDescriptorModal.texto}
            </div>

            {/* Materias y Competencias que activan este descriptor */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Presencia curricular en el Departamento de Filosofía:
              </div>
              {activeDescriptorModal.usos && activeDescriptorModal.usos.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeDescriptorModal.usos.map((uso, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-amber-300 font-semibold font-mono">
                        <span>{uso.asignaturaNombre}</span>
                        <span>CE {uso.competenciaNumero}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] line-clamp-2">
                        {uso.competenciaTexto}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Este descriptor opera como competencia clave transversal de salida.
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveDescriptorModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
