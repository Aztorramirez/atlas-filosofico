import React, { useState, useEffect } from 'react';
import {
  Compass,
  GraduationCap,
  Scale,
  BookOpen,
  Users,
  ChevronDown,
  ChevronRight,
  X,
  FileText,
  ExternalLink,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
}) {
  const [oposicionesOpen, setOposicionesOpen] = useState(
    activeSection === 'ley_vigente' || activeSection === 'temario' || activeSection === 'programacion'
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex overscroll-contain">
      {/* Fondo oscuro con desenfoque que cierra el menú al hacer clic */}
      <div
        className="fixed inset-0 bg-[#050811]/75 backdrop-blur-md animate-fade-in overscroll-contain"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel lateral deslizante Dark Academia */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="relative w-80 max-w-[85vw] bg-slate-950/85 backdrop-blur-2xl border-r border-white/10 h-full shadow-[24px_0_80px_rgba(0,0,0,0.85)] flex flex-col z-10 animate-slide-in-left overscroll-contain"
      >
        
        {/* Cabecera del Sidebar */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-gradient-to-b from-amber-500/[0.06] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-semibold text-white tracking-tight leading-none">
                Atlas Filosófico
              </h2>
              <span className="text-[11px] text-amber-300/90 font-medium tracking-wide">
                Archivo y Navegación
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Navegación */}
        <nav className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2.5">
          
          {/* Opción 1: Atlas Filosófico */}
          <button
            type="button"
            onClick={() => {
              onSelectSection('atlas');
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 transition-all duration-200 text-left cursor-pointer border ${
              activeSection === 'atlas'
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_8px_28px_rgba(251,191,36,0.25)]'
                : 'text-slate-200 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-white/15 hover:translate-x-0.5'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'atlas'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-white/[0.05] text-amber-400 border border-white/10'
              }`}
            >
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Atlas Filosófico</div>
              <div
                className={`text-xs ${
                  activeSection === 'atlas' ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                Cronología y Mapamundi
              </div>
            </div>
          </button>

          {/* Opción 2: Oposiciones Filosofía (Con Submenú desplegable) */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <button
              type="button"
              onClick={() => setOposicionesOpen(!oposicionesOpen)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 text-amber-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    Oposiciones Filosofía
                  </div>
                  <div className="text-xs text-slate-400">
                    ESO y Bachillerato
                  </div>
                </div>
              </div>
              {oposicionesOpen ? (
                <ChevronDown className="w-4 h-4 text-amber-400 transition-transform" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
              )}
            </button>

            {/* Sub-opciones de Oposiciones */}
            {oposicionesOpen && (
              <div className="px-3 pb-3 pt-2 space-y-1.5 border-t border-white/10 bg-black/20">
                {/* Sub-opción A: Ley Vigente */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('ley_vigente');
                    onClose();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all duration-200 text-left text-xs cursor-pointer ${
                    activeSection === 'ley_vigente'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_4px_20px_rgba(251,191,36,0.22)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5'
                  }`}
                >
                  <Scale className={`w-4 h-4 shrink-0 ${activeSection === 'ley_vigente' ? 'text-slate-950' : 'text-amber-400'}`} />
                  <div>
                    <div className="font-semibold">Ley Vigente</div>
                    <div
                      className={`text-[11px] ${
                        activeSection === 'ley_vigente' ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      BOE y Decretos de CCAA (BOCM...)
                    </div>
                  </div>
                </button>

                {/* Sub-opción B: Temario */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('temario');
                    onClose();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all duration-200 text-left text-xs cursor-pointer ${
                    activeSection === 'temario'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_4px_20px_rgba(251,191,36,0.22)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 shrink-0 ${activeSection === 'temario' ? 'text-slate-950' : 'text-amber-400'}`} />
                  <div>
                    <div className="font-semibold">Temario Oficial</div>
                    <div
                      className={`text-[11px] ${
                        activeSection === 'temario' ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      Los 71 temas estructurados
                    </div>
                  </div>
                </button>

                {/* Sub-opción C: Programación Didáctica */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('programacion');
                    onClose();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all duration-200 text-left text-xs cursor-pointer ${
                    activeSection === 'programacion'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_4px_20px_rgba(251,191,36,0.22)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5'
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 ${activeSection === 'programacion' ? 'text-slate-950' : 'text-amber-400'}`} />
                  <div>
                    <div className="font-semibold">Programación didáctica</div>
                    <div
                      className={`text-[11px] ${
                        activeSection === 'programacion' ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      Cómo prepararla
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Opción 3: ¿Qué es esto? */}
          <button
            type="button"
            onClick={() => {
              onSelectSection('sobre_nosotros');
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 transition-all duration-200 text-left cursor-pointer border ${
              activeSection === 'sobre_nosotros'
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_8px_28px_rgba(251,191,36,0.25)]'
                : 'text-slate-200 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-white/15 hover:translate-x-0.5'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'sobre_nosotros'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-white/[0.05] text-amber-400 border border-white/10'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">¿Qué es esto?</div>
              <div
                className={`text-xs ${
                  activeSection === 'sobre_nosotros' ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                Para estudiantes, universitarios y opositores
              </div>
            </div>
          </button>

        </nav>

        {/* Pie del Sidebar */}
        <div className="p-4 border-t border-white/10 bg-black/30 text-xs text-slate-400 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tabular-nums">Versión 1.1</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 text-[11px] font-semibold">
              Activo
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Herramienta didáctica de libre acceso desarrollada para la comunidad educativa.
          </p>
        </div>

      </div>
    </div>
  );
}
