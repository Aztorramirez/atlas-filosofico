import React from 'react';
import {
  FileText,
  Clock,
  Sparkles,
  Layers,
  GraduationCap,
  Hammer,
  BookmarkCheck,
} from 'lucide-react';

export default function ProgramacionView() {
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 lg:p-10 space-y-8 flex flex-col justify-start items-center">
      
      {/* Cabecera */}
      <div className="max-w-4xl w-full text-center space-y-3 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
          <span>Oposiciones de Filosofía • Especialidad Secundaria</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Programación Didáctica
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Guías paso a paso, diseño de situaciones de aprendizaje y plantillas oficiales 
          para la segunda prueba de las oposiciones docentes de Filosofía.
        </p>
      </div>

      {/* Contenedor Destacado: En Construcción */}
      <div className="max-w-2xl w-full p-8 rounded-3xl bg-slate-900/80 border border-amber-400/30 shadow-2xl shadow-amber-500/5 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
          <Hammer className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Módulo en Desarrollo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Página en construcción
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg mx-auto">
            Muy pronto subiremos esta información con modelos curriculares completos, rúbricas de evaluación LOMLOE y guías para la defensa oral ante el tribunal.
          </p>
        </div>

        {/* Adelanto de contenidos */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Estructura</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Marco legal, contextualización y justificación.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <FileText className="w-3.5 h-3.5" />
              <span>UUDD / SdA</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Situaciones de aprendizaje competenciales.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Defensa Oral</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Estrategias retóricas y preparación de la exposición.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Próximamente disponible en el Atlas Filosófico</span>
        </div>
      </div>

    </div>
  );
}
