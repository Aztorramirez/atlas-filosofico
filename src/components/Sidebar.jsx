import React, { useState } from 'react';
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
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
}) {
  const [oposicionesOpen, setOposicionesOpen] = useState(
    activeSection === 'ley_vigente' || activeSection === 'temario'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo oscuro con desenfoque que cierra el menú al hacer clic */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel lateral deslizante */}
      <div className="relative w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        
        {/* Cabecera del Sidebar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Atlas Filosófico
              </h2>
              <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase tracking-wider">
                Navegación Global
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Navegación */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          
          {/* Opción 1: Atlas Filosófico */}
          <button
            onClick={() => {
              onSelectSection('atlas');
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 transition-all text-left ${
              activeSection === 'atlas'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                activeSection === 'atlas'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-slate-800 text-amber-400'
              }`}
            >
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Atlas Filosófico</div>
              <div
                className={`text-[11px] ${
                  activeSection === 'atlas' ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                Cronología y Mapamundi
              </div>
            </div>
          </button>

          {/* Opción 2: Oposiciones Filosofía (Con Submenú desplegable) */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 overflow-hidden">
            <button
              onClick={() => setOposicionesOpen(!oposicionesOpen)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    Oposiciones Filosofía
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Especialidad Secundaria
                  </div>
                </div>
              </div>
              {oposicionesOpen ? (
                <ChevronDown className="w-4 h-4 text-amber-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Sub-opciones de Oposiciones */}
            {oposicionesOpen && (
              <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-slate-800/60 bg-slate-900/40">
                {/* Sub-opción A: Ley Vigente */}
                <button
                  onClick={() => {
                    onSelectSection('ley_vigente');
                    onClose();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left text-xs ${
                    activeSection === 'ley_vigente'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Scale className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold">Ley Vigente</div>
                    <div
                      className={`text-[10px] ${
                        activeSection === 'ley_vigente' ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      BOE y Decretos de CCAA (BOCM...)
                    </div>
                  </div>
                </button>

                {/* Sub-opción B: Temario */}
                <button
                  onClick={() => {
                    onSelectSection('temario');
                    onClose();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left text-xs ${
                    activeSection === 'temario'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold">Temario Oficial</div>
                    <div
                      className={`text-[10px] ${
                        activeSection === 'temario' ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      Los 71 temas estructurados
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Opción 3: Sobre nosotros */}
          <button
            onClick={() => {
              onSelectSection('sobre_nosotros');
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 transition-all text-left ${
              activeSection === 'sobre_nosotros'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                activeSection === 'sobre_nosotros'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-slate-800 text-amber-400'
              }`}
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Sobre nosotros</div>
              <div
                className={`text-[11px] ${
                  activeSection === 'sobre_nosotros' ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                Propósito, destinatarios y contacto
              </div>
            </div>
          </button>

        </nav>

        {/* Pie del Sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px]">Versión 1.1</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 text-[10px] font-semibold">
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
