import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MapPin, Calendar, BookOpen, Sparkles } from 'lucide-react';

function PhilosopherNode({ data, selected }) {
  const { filosofo } = data;

  return (
    <div
      className={`group relative rounded-2xl p-5 w-72 backdrop-blur-md transition-all duration-300 shadow-xl border cursor-pointer select-none ${
        selected
          ? 'bg-slate-800/95 border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/20 scale-105'
          : 'bg-slate-900/90 border-slate-700/80 hover:border-amber-400/70 hover:bg-slate-800/95 hover:shadow-2xl'
      }`}
    >
      {/* Handles de conexión */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-slate-900 !-left-1.5"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-slate-900 !-right-1.5"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-slate-900 !-top-1.5"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-slate-900 !-bottom-1.5"
      />

      {/* Cabecera del Nodo */}
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
          <Calendar className="w-3 h-3" />
          {filosofo.epoca_año}
        </span>
        <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          {filosofo.año_nacimiento < 0 ? `${Math.abs(filosofo.año_nacimiento)} a.C.` : `${filosofo.año_nacimiento} d.C.`}
        </span>
      </div>

      {/* Nombre */}
      <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
        {filosofo.nombre}
      </h3>

      {/* Ubicación geográfica */}
      {filosofo.coordenadas && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">
            {filosofo.coordenadas.lugar || `${filosofo.coordenadas.latitud}, ${filosofo.coordenadas.longitud}`}
          </span>
        </div>
      )}

      {/* Resumen preliminar */}
      <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed border-t border-slate-800 pt-2.5">
        {filosofo.resumen_breve}
      </p>

      {/* Indicador de ayuda para clics */}
      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1 text-amber-400/90">
          <Sparkles className="w-3 h-3" /> 1 clic: resumen
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <BookOpen className="w-3 h-3" /> 2 clics: biografía
        </span>
      </div>
    </div>
  );
}

export default memo(PhilosopherNode);
