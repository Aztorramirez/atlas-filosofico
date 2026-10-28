import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Layers,
  FileText,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Target,
  Scale,
  Calendar,
  Users,
  Compass,
  Lightbulb,
  Award,
  BookmarkCheck,
  Library,
} from 'lucide-react';

import indiceImg1 from '../assets/indice-cervantes-1.png';
import indiceImg2 from '../assets/indice-cervantes-2.png';
import estructuraImg from '../assets/estructura-cervantes.png';

export default function ProgramacionView() {
  const puntosEstructura = [
    {
      num: 1,
      titulo: 'Introducción y contextualización',
      desc: 'Justificación epistemológica y pedagógica de la materia. Análisis exhaustivo del entorno socioeconómico, cultural y familiar del centro educativo, instalaciones del instituto y características psicoevolutivas del alumnado destinatario.',
      icon: Compass,
    },
    {
      num: 2,
      titulo: 'Marco normativo y justificación legal',
      desc: 'Anclaje jurídico vigente: Ley Orgánica 3/2020 (LOMLOE), Reales Decretos estatales de enseñanzas mínimas (RD 217/2022 para ESO y RD 243/2022 para Bachillerato) y Decretos autonómicos de ordenación curricular (en Madrid: Decreto 65/2022 para ESO y Decreto 64/2022 para Bachillerato).',
      icon: Scale,
    },
    {
      num: 3,
      titulo: 'Objetivos de etapa y materia',
      desc: 'Contribución de la asignatura a los objetivos generales de la etapa (ESO o Bachillerato). Definición de metas formativas enfocadas al desarrollo del pensamiento crítico, la autonomía moral, la curiosidad intelectual y la ciudadanía democrática.',
      icon: Target,
    },
    {
      num: 4,
      titulo: 'Competencias clave y Perfil de Salida',
      desc: 'Conexión directa entre la materia y los descriptores operativos del Perfil de Salida de la LOMLOE (CCL, CP, STEM, CD, CPSAA, CC, CE, CCEC), explicitando cómo la reflexión filosófica consolida las competencias clave del estudiante.',
      icon: Sparkles,
    },
    {
      num: 5,
      titulo: 'Competencias específicas y saberes básicos',
      desc: 'Articulación de las competencias específicas oficiales de la materia con los bloques de saberes básicos (conceptos, procedimientos y actitudes), garantizando el tratamiento riguroso de los problemas filosóficos fundamentales.',
      icon: Layers,
    },
    {
      num: 6,
      titulo: 'Situaciones de Aprendizaje (SdA)',
      desc: 'Propuestas pedagógicas vertebradoras que plantean retos contextualizados y significativos (debates socráticos, disertaciones argumentativas, dilemas morales, podcasts o proyectos de investigación) conducentes a un producto final observable.',
      icon: Lightbulb,
    },
    {
      num: 7,
      titulo: 'Secuenciación y temporalización',
      desc: 'Distribución equilibrada y coherente de las Unidades Didácticas / Situaciones de Aprendizaje a lo largo de los tres trimestres del curso lectivo, considerando horas semanales, sesiones reales y periodos festivos o de evaluación.',
      icon: Calendar,
    },
    {
      num: 8,
      titulo: 'Metodología didáctica y principios pedagógicos',
      desc: 'Estrategias metodológicas activas centradas en el alumnado: diálogo dialéctico, aprendizaje cooperativo, pensamiento visible, clase invertida (flipped classroom) y lectura guiada de textos filosóficos clásicos y contemporáneos.',
      icon: Users,
    },
    {
      num: 9,
      titulo: 'Materiales y recursos didácticos',
      desc: 'Inventario de soportes de aprendizaje: fuentes primarias y antologías de textos, biblioteca del centro, plataformas virtuales (Moodle / EducaMadrid), recursos audiovisuales y herramientas digitales seguras.',
      icon: Library,
    },
    {
      num: 10,
      titulo: 'Evaluación, instrumentos y calificación',
      desc: 'Modelo de evaluación formativa, continua y formadora. Definición de instrumentos diversificados (rúbricas analíticas, dianas de autoevaluación, escalas de observación) y ponderación transparente de criterios de calificación y planes de recuperación.',
      icon: CheckCircle2,
    },
    {
      num: 11,
      titulo: 'Atención a la diversidad y medidas DUA',
      desc: 'Aplicación de los principios del Diseño Universal para el Aprendizaje (DUA): múltiples formas de representación, expresión y compromiso. Adaptaciones no significativas, refuerzo educativo y atención inclusiva al alumnado con NEAE.',
      icon: Award,
    },
    {
      num: 12,
      titulo: 'Evaluación de la práctica docente',
      desc: 'Mecanismos e indicadores de logro para valorar el funcionamiento de la programación, la idoneidad de la temporalización, los resultados académicos y la propia labor del profesorado, con propuestas concretas de mejora.',
      icon: BookmarkCheck,
    },
    {
      num: 13,
      titulo: 'Conclusión y bibliografía',
      desc: 'Síntesis valorativa sobre el impacto humanístico de la filosofía en la formación integral de los jóvenes, acompañada del catálogo de referencias bibliográficas, artículos especializados, webgrafía y repertorio legislativo.',
      icon: FileText,
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        
        {/* Cabecera Principal */}
        <header className="space-y-4 text-center pt-2 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Guía Oficial • Oposiciones al Cuerpo de Profesores</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Programación Didáctica de Filosofía
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Fundamentos teóricos, arquitectura LOMLOE, modelo práctico de 1º de Bachillerato 
            y análisis de la programación real del IES Cervantes de Madrid.
          </p>
        </header>

        {/* =========================================================================
            SECCIÓN 1: ESTRUCTURA BÁSICA DE UNA PROGRAMACIÓN DIDÁCTICA
        ========================================================================= */}
        <section className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Sección 1</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Estructura básica: Los 13 puntos fundamentales
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Toda programación didáctica oficial para las oposiciones de Secundaria y Bachillerato
              debe articularse de forma rigurosa y cohesionada en torno a los siguientes trece elementos esenciales:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {puntosEstructura.map((punto) => {
              const IconComponent = punto.icon;
              return (
                <div
                  key={punto.num}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-amber-400/30 transition-all flex items-start gap-4 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center font-black font-mono text-sm shrink-0 mt-0.5 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                    {punto.num}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-amber-400 shrink-0" />
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                        {punto.titulo}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {punto.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 2: HACER TU PROPIA PROGRAMACIÓN (EJEMPLO SIMPLIFICADO)
        ========================================================================= */}
        <section className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Sección 2</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hacer tu propia programación: Ejemplo simplificado
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              A continuación, se detalla un esquema práctico y funcional para la materia de{' '}
              <strong className="text-slate-200">Filosofía de 1º de Bachillerato</strong>, diseñado según 
              el modelo competencial LOMLOE y el Decreto 64/2022 de la Comunidad de Madrid.
            </p>
          </div>

          {/* Bloque visualmente diferenciado con fondo bg-slate-900/50 y detalles ambar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-amber-500/30 shadow-xl space-y-8">
            
            {/* Cabecera de la ficha técnica */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Materia Troncal • 1º Bachillerato
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Programación Didáctica: Filosofía (3 horas semanales)
                </h3>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-mono shrink-0">
                Curso: 1º Bachillerato (Común)
              </div>
            </div>

            {/* Contexto Ficticio pero Realista */}
            <div className="space-y-2">
              <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>1. Contextualización del Centro</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                IES público de línea 4 situado en un entorno urbano de nivel socioeconómico y cultural medio.
                El grupo de 1º de Bachillerato cuenta con 28 alumnos (16 chicas, 12 chicos) de diversas modalidades (Ciencias y Tecnología, Humanidades y Ciencias Sociales).
                El aula dispone de panel digital interactivo, conexión wifi y acceso semanal a la biblioteca para tertulias dialógicas.
              </p>
            </div>

            {/* Secuenciación Trimestral en 9 Situaciones de Aprendizaje */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>2. Secuenciación y Situaciones de Aprendizaje (9 SdA)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* 1er Trimestre */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    1er Trimestre • El Saber y el Ser
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>
                      <strong className="text-white">SdA 1:</strong> <em>¿Para qué sirve filosofar hoy?</em> Del mito al logos y los desafíos del siglo XXI.
                    </li>
                    <li>
                      <strong className="text-white">SdA 2:</strong> <em>¿Quién soy yo?</em> Antropología, identidad y transhumanismo digital.
                    </li>
                    <li>
                      <strong className="text-white">SdA 3:</strong> <em>¿Qué podemos conocer?</em> Verdad, teoría del conocimiento y posverdad.
                    </li>
                  </ul>
                </div>

                {/* 2º Trimestre */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    2º Trimestre • Razón y Realidad
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>
                      <strong className="text-white">SdA 4:</strong> <em>El arte de argumentar.</em> Lógica, detección de falacias y sesgos cognitivos.
                    </li>
                    <li>
                      <strong className="text-white">SdA 5:</strong> <em>Ciencia e Inteligencia Artificial.</em> Criterios de demarcación y tecnociencia.
                    </li>
                    <li>
                      <strong className="text-white">SdA 6:</strong> <em>¿Qué es real?</em> Metafísica, mundos virtuales y el enigma mente-cuerpo.
                    </li>
                  </ul>
                </div>

                {/* 3er Trimestre */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    3er Trimestre • Acción y Belleza
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>
                      <strong className="text-white">SdA 7:</strong> <em>¿Cómo debemos actuar?</em> Dilemas morales, éticas del deber y del cuidado.
                    </li>
                    <li>
                      <strong className="text-white">SdA 8:</strong> <em>La sociedad justa.</em> Democracia, igualdad, derechos humanos y política.
                    </li>
                    <li>
                      <strong className="text-white">SdA 9:</strong> <em>El impacto de la imagen.</em> Estética, creación artística y cultura visual.
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Desglose de una Situación de Aprendizaje Modelo */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-bold font-mono text-xs">
                  SdA Modelo en Detalle
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  SdA 4 • 2º Trimestre (12 sesiones lectivas)
                </span>
              </div>
              <h5 className="text-base font-bold text-white">
                "El tribunal de las falacias: desarmando la posverdad y los sesgos en redes"
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
                <div>
                  <strong className="text-amber-300 block mb-1">Competencias Específicas vinculadas:</strong>
                  <span>CE3 (Uso y valoración de argumentos formales e informales) y CE4 (Ejercicio del diálogo filosófico riguroso y tolerante).</span>
                </div>
                <div>
                  <strong className="text-amber-300 block mb-1">Descriptores Operativos evaluados:</strong>
                  <span>CCL1, CCL5, STEM1, CPSAA3.1, CC2, CC3.</span>
                </div>
                <div>
                  <strong className="text-amber-300 block mb-1">Producto Final observable:</strong>
                  <span>Torneo de debate dialéctico grabado en formato podcast sobre un dilema ético-político de actualidad.</span>
                </div>
                <div>
                  <strong className="text-amber-300 block mb-1">Medidas DUA y Diversidad:</strong>
                  <span>Guías visuales de falacias, opción de entrega multimodal (vídeo/podcast o ensayo) y rúbrica analítica previa.</span>
                </div>
              </div>
            </div>

            {/* Criterios de Calificación */}
            <div className="space-y-2">
              <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>3. Procedimientos de Calificación Ponderada</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
                  <div className="text-2xl font-black text-amber-400 font-mono">60%</div>
                  <div className="text-xs font-semibold text-slate-200">Situaciones de Aprendizaje</div>
                  <div className="text-[11px] text-slate-400">Productos, disertaciones, debates y diarios de reflexión.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
                  <div className="text-2xl font-black text-amber-400 font-mono">30%</div>
                  <div className="text-xs font-semibold text-slate-200">Pruebas Competenciales</div>
                  <div className="text-[11px] text-slate-400">Comentarios críticos de texto y análisis individual.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
                  <div className="text-2xl font-black text-amber-400 font-mono">10%</div>
                  <div className="text-xs font-semibold text-slate-200">Actitud Filosófica</div>
                  <div className="text-[11px] text-slate-400">Escucha activa, respeto dialógico y trabajo cooperativo.</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 3: EJEMPLO REAL (IES CERVANTES)
        ========================================================================= */}
        <section className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sección 3</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ejemplo real: Programación del Departamento de Filosofía del IES Cervantes
            </h2>
          </div>

          {/* Bloque de lectura del caso real */}
          <div className="space-y-6 text-sm sm:text-base text-slate-300 leading-relaxed">
            
            <p>
              La siguiente es la programación del departamento de filosofía del IES Cervantes. Fijémonos primero en su índice:
            </p>

            {/* Imagen 1: Índice Parte 1 */}
            <div className="space-y-2 my-4">
              <img
                src={indiceImg1}
                alt="Índice de la programación didáctica IES Cervantes - Parte 1"
                className="w-full rounded-2xl shadow-xl border border-slate-800 object-contain bg-slate-900/50"
              />
              <div className="text-center text-xs text-slate-500 font-mono">
                Figura 1: Índice oficial de la programación de departamento (Parte 1).
              </div>
            </div>

            {/* Imagen 2: Índice Parte 2 */}
            <div className="space-y-2 my-4">
              <img
                src={indiceImg2}
                alt="Índice de la programación didáctica IES Cervantes - Parte 2"
                className="w-full rounded-2xl shadow-xl border border-slate-800 object-contain bg-slate-900/50"
              />
              <div className="text-center text-xs text-slate-500 font-mono">
                Figura 2: Índice oficial de la programación de departamento (Parte 2).
              </div>
            </div>

            <p>
              El primer apartado cubre de lleno la Introducción y contextualización: explica el contexto del centro (ubicación, instalaciones, historia, perfil del alumnado, etc.) así cómo quiénes conforman el departamento de filosofía y cómo se organizan. Además, detallan qué aspectos metodológicos son comunes a todos las asignaturas y docentes del departamento. Una vez definido, se incluyen las programaciones didácticas de cada asignatura: valores éticos (2º ESO), filosofía (1º Bachillerato), teoría del conocimiento (bachillerato internacional), etc. Pero, véase que todas las asignaturas se presentan de la misma manera:
            </p>

            {/* Imagen 3: Estructura Curricular */}
            <div className="space-y-2 my-4">
              <img
                src={estructuraImg}
                alt="Estructura curricular de las asignaturas en IES Cervantes"
                className="w-full rounded-2xl shadow-xl border border-slate-800 object-contain bg-slate-900/50"
              />
              <div className="text-center text-xs text-slate-500 font-mono">
                Figura 3: Estructura pedagógica común por asignatura en el IES Cervantes.
              </div>
            </div>

            {/* Botón de Enlace Externo al PDF oficial */}
            <div className="pt-2 pb-4 flex justify-center">
              <a
                href="https://cloud.educa.madrid.org/s/b4wsNoQW83rpZW6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver documento completo (PDF en EducaMadrid)</span>
              </a>
            </div>

            <p>
              Se indica el contexto legislativo, los objetivos de asignatura y etapa, las competencias, descriptores operativos, criterios de evaluación, contenidos, procedimientos de evaluación y calificación y métodos didácticos, así como las medidas de atención a la diversidad, los materiales y recursos didácticos y la evaluación docente. Además, en este centro proponen actividades cuya realización involucra espacios o instituciones externas al centro. Quedadas ya establecidas desde el inicio, su siguiente paso sería planificarlas y llevarlas a cabo en el plazo estipulado. Según el caso, el departamento consistirá del maravilloso equipo conformado por ti y tú mismo, o por más docentes. Cuando seáis un equipo, tendréis que poneros de acuerdo en la planificación temporal de la programación y los métodos a usar. Salvando eso, en ambos casos la estructura a seguir es la misma.
            </p>

          </div>
        </section>

      </div>
    </div>
  );
}
