import React from 'react';
import {
  Compass,
  GraduationCap,
  BookOpen,
  Users,
  Mail,
  Send,
  MessageSquare,
  Sparkles,
  Award,
  ExternalLink,
  Layers,
  Heart,
  CheckCircle2,
} from 'lucide-react';

// ==============================================================================
// CONFIGURACIÓN DE CONTACTO Y FORMULARIO DE GOOGLE
// Pega aquí la URL de tu Google Form y tu dirección de correo electrónico:
// ==============================================================================
export const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSc_EJEMPLO_PEGA_AQUI_TU_ENLACE/viewform';
export const CONTACT_EMAIL = 'contacto@atlasfilosofico.com';

export default function SobreNosotrosView() {
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 lg:p-12 space-y-12">
      
      {/* Cabecera Principal */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Proyecto Educativo de Acceso Abierto</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Sobre el <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Atlas Filosófico</span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Una plataforma visual e interactiva concebida para transformar el aprendizaje de la historia del pensamiento humano, 
          uniendo rigor académico, coordenadas espacio-temporales y divulgación progresiva.
        </p>
      </div>

      {/* 1. Propósito de la Herramienta */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Coordenadas Reales</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            La filosofía no ocurrió en el vacío. Visualizar dónde nació, debatió o enseñó cada pensador permite comprender los flujos culturales mediterráneos, europeos y globales.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Divulgación Progresiva</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Eliminamos el «efecto plato de espaguetis» mediante 3 niveles de complejidad curricular: <strong>Canon</strong> (16 figuras axiales), <strong>Universitario</strong> y <strong>Académico</strong>.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Coetaneidad Viva</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Un solo clic resalta instantáneamente a todos los pensadores que compartieron época histórica, facilitando la comprensión de debates cruzados e influencias mutuas.
          </p>
        </div>
      </div>

      {/* 2. Destinatarios del Proyecto */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            ¿A quién va dirigida esta herramienta?
          </h3>
          <p className="text-sm text-slate-400">
            Diseñada con versatilidad para acompañar en las distintas etapas formativas y profesionales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Bloque 1: Bachillerato */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/40 transition flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-lg bg-sky-400/10 text-sky-300 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h4 className="text-base font-bold text-white">Alumnos de Bachillerato</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Preparación estructurada de <strong>Historia de la Filosofía</strong> para las pruebas de acceso a la universidad (PAU/EBAU) con esquemas cronológicos claros.
              </p>
            </div>
            <div className="text-[11px] font-mono text-sky-400 font-semibold pt-2 border-t border-slate-800">
              Nivel recomendado: Canon
            </div>
          </div>

          {/* Bloque 2: Grado Universitario */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/40 transition flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-300 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h4 className="text-base font-bold text-white">Estudiantes de Grado</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grados en Filosofía, Humanidades, Filología, Historia y Ciencias para contextualizar corrientes de pensamiento y genealogías conceptuales.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-semibold pt-2 border-t border-slate-800">
              Nivel: Universitario
            </div>
          </div>

          {/* Bloque 3: Opositores de Secundaria */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-lg shadow-amber-500/5 transition flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h4 className="text-base font-bold text-white">Opositores a Secundaria</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aspirantes al Cuerpo de Profesores de Enseñanza Secundaria (Filosofía) para fundamentar temas, marco curricular LOMLOE y defensas ante el tribunal.
              </p>
            </div>
            <div className="text-[11px] font-mono text-amber-300 font-semibold pt-2 border-t border-slate-800">
              Sección: Oposiciones & Temario
            </div>
          </div>

          {/* Bloque 4: Académicos y Aficionados */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/40 transition flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-lg bg-purple-400/10 text-purple-300 flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h4 className="text-base font-bold text-white">Docentes y Académicos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Investigadores, profesores de secundaria y lectores apasionados por el pensamiento crítico que buscan un compendio visual ordenado y riguroso.
              </p>
            </div>
            <div className="text-[11px] font-mono text-purple-400 font-semibold pt-2 border-t border-slate-800">
              Nivel: Académico
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sección de Sugerencias, Contacto y Formulario de Google */}
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-slate-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Colabora con el Atlas</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Sugerencias, Erratas y Contacto
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            ¿Echas en falta a algún autor? ¿Quieres proponernos una mejora o notificar una corrección histórica? 
            Tu aportación nos ayuda a seguir perfeccionando este recurso libre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Tarjeta Destacada: Formulario de Google */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-400/40 flex flex-col justify-between space-y-4 hover:border-amber-400 transition shadow-lg group">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>Formulario Oficial de Google</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Buzón de Propuestas y Mejoras
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Envía tus propuestas de nuevos filósofos, sugerencias de interfaz o erratas en solo 1 minuto mediante nuestro formulario estructurado.
              </p>
            </div>

            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition group/btn"
            >
              <span>Abrir Formulario de Google</span>
              <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Tarjeta: Correo Electrónico Directo */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Contacto Directo por Email</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Escríbenos directamente
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Si prefieres un contacto institucional, académico o consultar cualquier duda sobre el proyecto, escríbenos directamente.
              </p>
            </div>

            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Atlas%20Filos%C3%B3fico%20-%20Consulta%20o%20Sugerencia`}
              className="w-full min-h-[44px] py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
