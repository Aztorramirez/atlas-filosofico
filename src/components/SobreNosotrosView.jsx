import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  MessageSquareHeart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Heart,
  Send,
} from 'lucide-react';

// ==============================================================================
// CONFIGURACIÓN DEL FORMULARIO DE GOOGLE (GOOGLE FORMS)
// 👉 Pega aquí la URL de tu Google Forms:
//    - GOOGLE_FORMS_URL: Para el botón principal que abre el formulario en pestaña nueva.
//    - GOOGLE_FORMS_EMBED_URL: (Opcional) Si quieres incrustarlo directamente, pega
//      aquí el enlace de inserción de Google Forms (que suele terminar en /viewform?embedded=true).
// ==============================================================================
export const GOOGLE_FORMS_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSekhwCfkAzrtRfabUs1GyLCB3QRQuRT4AzMQyR_fzy9gY5-CQ/viewform?usp=publish-editor';
export const GOOGLE_FORMS_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSekhwCfkAzrtRfabUs1GyLCB3QRQuRT4AzMQyR_fzy9gY5-CQ/viewform?embedded=true';

export default function SobreNosotrosView() {
  const [showIframe, setShowIframe] = useState(Boolean(GOOGLE_FORMS_EMBED_URL));

  // Comprueba si ya se ha configurado un enlace real
  const isUrlConfigured =
    GOOGLE_FORMS_URL && !GOOGLE_FORMS_URL.includes('TU_ENLACE_DE_GOOGLE_FORMS_AQUI');

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 px-4 py-8 sm:py-12 md:py-16 flex flex-col items-center select-text">
      
      {/* Contenedor centralizado con enfoque Mobile-First */}
      <div className="w-full max-w-2xl mx-auto space-y-8 sm:space-y-10">

        {/* 1. Cabecera y Títulos */}
        <div className="text-center space-y-4">
          
          {/* Badge superior discreto */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 text-xs font-semibold shadow-sm">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Atlas Filosófico</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            ¿Qué es esto?
          </h1>

          {/* Subtítulo destacado visualmente */}
          <div className="pt-1">
            <span className="inline-block px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400/15 via-amber-400/25 to-amber-500/15 text-amber-300 border border-amber-400/30 text-sm sm:text-base font-bold tracking-wide shadow-md shadow-amber-500/5">
              Para estudiantes, universitarios y opositores
            </span>
          </div>
        </div>

        {/* 2. Cuerpo de Texto Principal */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-slate-200 text-sm sm:text-base leading-relaxed backdrop-blur-sm">
          
          <p className="text-slate-200 font-normal">
            Si has llegado hasta aquí, es porque eres colega o conocido. Pero si no, te explico: el Atlas pretende ser una herramienta interactiva que te permita tener a la mano información sobre escuelas, filósofos y leyes educativas.
          </p>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

          <p className="text-slate-300 font-normal">
            Aún queda mucho por mejorar (¡la hice literalmente antes de ayer!). Cualquier feedback hará esto un espacio más útil para todos. Mucha suerte ;)
          </p>
        </div>

        {/* 3. Área Destacada: Buzón de Sugerencias */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/35 shadow-2xl shadow-amber-500/10 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Buzón de sugerencias
                </h2>
                <p className="text-xs text-slate-400">
                  Críticas, propuestas de mejora, erratas o nuevas ideas
                </p>
              </div>
            </div>

            {/* Botón Principal: Dejar una sugerencia */}
            <a
              href={GOOGLE_FORMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Dejar una sugerencia</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950 opacity-80" />
            </a>
          </div>

          {/* Opción secundaria: Alternar vista incrustada (iframe) */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setShowIframe(!showIframe)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors py-1 cursor-pointer"
            >
              {showIframe ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ocultar formulario integrado</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                  <span>¿Prefieres responderlo aquí mismo sin salir de la página?</span>
                </>
              )}
            </button>

            {/* Contenedor Adaptado y Responsivo para Google Forms (iframe) */}
            {showIframe && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner p-1 sm:p-2">
                {isUrlConfigured ? (
                  <iframe
                    src={GOOGLE_FORMS_EMBED_URL || GOOGLE_FORMS_URL}
                    width="100%"
                    height="620"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    className="w-full min-h-[520px] rounded-xl"
                    title="Formulario de Google de sugerencias"
                  >
                    Cargando formulario de Google…
                  </iframe>
                ) : (
                  <div className="p-6 text-center space-y-3 bg-slate-900/60 rounded-xl">
                    <p className="text-xs sm:text-sm text-slate-300">
                      El formulario está listo para incrustarse.
                    </p>
                    <p className="text-[11px] text-amber-400/90 font-mono bg-slate-950/70 p-3 rounded-lg border border-amber-400/20 max-w-lg mx-auto">
                      💡 Abre <span className="text-amber-300 font-semibold">src/components/SobreNosotrosView.jsx</span> y sustituye <span className="text-amber-300">GOOGLE_FORMS_URL</span> por el enlace de tu Google Forms.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Pie cálido y sutil */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <span>para la comunidad filosófica y educativa</span>
          </p>
        </div>

      </div>

    </div>
  );
}
