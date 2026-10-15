import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  FileText,
  Compass,
} from 'lucide-react';

// Estructura representativa de los 71 temas oficiales (Orden de 9 de septiembre de 1993)
const BLOQUES_TEMARIO = [
  {
    bloque: 'Bloque I: El saber filosófico, metafísica y ontología',
    temas: [
      { num: 1, titulo: 'El sentido del saber filosófico. Los orígenes de la filosofía.' },
      { num: 2, titulo: 'La metafísica como saber fundamental. Problemas centrales de la ontología.' },
      { num: 3, titulo: 'El problema del ser y de la nada en la historia de la filosofía.' },
      { num: 4, titulo: 'La categoría de sustancia: de Aristóteles a la crítica empirista.' },
      { num: 5, titulo: 'El tiempo y el espacio: enfoques metafísicos y cosmológicos.' },
      { num: 6, titulo: 'El problema de Dios en la metafísica occidental.' },
    ],
  },
  {
    bloque: 'Bloque II: Lógica, lenguaje y teoría del conocimiento',
    temas: [
      { num: 7, titulo: 'Lógica formal: cálculo proposicional y de predicados.' },
      { num: 8, titulo: 'La teoría del conocimiento: realismo, idealismo y escepticismo.' },
      { num: 9, titulo: 'La verdad: criterios, teorías clásicas y contemporáneas.' },
      { num: 10, titulo: 'Filosofía del lenguaje: significado, referencia y actos de habla.' },
      { num: 11, titulo: 'El método científico: inducción, falsacionismo y revoluciones científicas.' },
      { num: 12, titulo: 'Lógica informal y argumentación: falacias y dialéctica.' },
    ],
  },
  {
    bloque: 'Bloque III: Antropología, psicología y mente',
    temas: [
      { num: 13, titulo: 'El debate naturaleza y cultura. Hominización y humanización.' },
      { num: 14, titulo: 'El problema mente-cuerpo: dualismo, fisicalismo y funcionalismo.' },
      { num: 15, titulo: 'La conciencia y el inconsciente: de Descartes a Freud.' },
      { num: 16, titulo: 'La libertad humana: determinismo y libre albedrío.' },
      { num: 17, titulo: 'Las pasiones y las emociones en la filosofía moral.' },
    ],
  },
  {
    bloque: 'Bloque IV: Ética, moral y filosofía práctica',
    temas: [
      { num: 18, titulo: 'Fundamentación de la moral: éticas teleológicas y deontológicas.' },
      { num: 19, titulo: 'La virtud en Aristóteles y la ética del término medio.' },
      { num: 20, titulo: 'La ética formal de Kant: imperativo categórico y autonomía moral.' },
      { num: 21, titulo: 'El utilitarismo: Bentham, John Stuart Mill y el bienestar social.' },
      { num: 22, titulo: 'Bioética y ética aplicada en el siglo XXI.' },
    ],
  },
  {
    bloque: 'Bloque V: Filosofía política, sociedad y derecho',
    temas: [
      { num: 23, titulo: 'El origen del Estado: teorías contractualistas (Hobbes, Locke, Rousseau).' },
      { num: 24, titulo: 'Justicia y derecho: iusnaturalismo y positivismo jurídico.' },
      { num: 25, titulo: 'Democracia, ciudadanía y derechos humanos fundamentales.' },
      { num: 26, titulo: 'Filosofía política contemporánea: Rawls, Habermas y el debate comunitarista.' },
      { num: 27, titulo: 'Poder, legitimidad y crítica de la ideología en Marx y la Escuela de Frankfurt.' },
    ],
  },
  {
    bloque: 'Bloque VI: Historia de la Filosofía (Grecia al Siglo XX)',
    temas: [
      { num: 28, titulo: 'Los presocráticos y la búsqueda de la arjé.' },
      { num: 29, titulo: 'Sócrates y los sofistas: el giro antropológico y la dialéctica.' },
      { num: 30, titulo: 'Platón: la teoría de las Ideas, la República y la paideia.' },
      { num: 31, titulo: 'Aristóteles: física, metafísica, ética a Nicómaco y política.' },
      { num: 32, titulo: 'Filosofía helenística: estoicismo, epicureísmo y escepticismo.' },
      { num: 35, titulo: 'Filosofía medieval: San Agustín y Santo Tomás de Aquino.' },
      { num: 42, titulo: 'La revolución científica: Copérnico, Galileo, Kepler y Newton.' },
      { num: 45, titulo: 'El racionalismo continental: Descartes, Spinoza y Leibniz.' },
      { num: 48, titulo: 'El empirismo británico: Locke, Berkeley y David Hume.' },
      { num: 51, titulo: 'La Ilustración y la Crítica de la razón pura de Kant.' },
      { num: 55, titulo: 'El idealismo alemán: Hegel y la dialéctica del espíritu.' },
      { num: 60, titulo: 'Los filósofos de la sospecha: Marx, Nietzsche y Freud.' },
      { num: 65, titulo: 'Fenomenología y existencialismo: Husserl, Heidegger y Sartre.' },
      { num: 70, titulo: 'Filosofía analítica y neopositivismo: Frege, Russell, Wittgenstein y Popper.' },
      { num: 71, titulo: 'Hermenéutica y posmodernidad: Gadamer, Habermas, Derrida y Foucault.' },
    ],
  },
];

export default function TemarioView({ onNavigateToAtlas }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBloques = useMemo(() => {
    if (!searchTerm.trim()) return BLOQUES_TEMARIO;
    const term = searchTerm.toLowerCase();

    return BLOQUES_TEMARIO.map((b) => ({
      ...b,
      temas: b.temas.filter(
        (t) =>
          t.titulo.toLowerCase().includes(term) ||
          t.num.toString().includes(term)
      ),
    })).filter((b) => b.temas.length > 0);
  }, [searchTerm]);

  const totalTemasFiltrados = useMemo(() => {
    return filteredBloques.reduce((acc, b) => acc + b.temas.length, 0);
  }, [filteredBloques]);

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 lg:p-10 space-y-8">
      
      {/* Cabecera */}
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Oposiciones de Filosofía • Temario Oficial</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Temario Oficial de Oposiciones de Secundaria
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Estructura de los <strong>71 temas oficiales</strong> (Orden de 9 de septiembre de 1993, BOE 21/09/1993) 
          del Cuerpo de Profesores de Enseñanza Secundaria, en interconexión directa con los autores y épocas del Atlas Filosófico.
        </p>
      </div>

      {/* Barra de herramientas: Buscador y enlace rápido al Atlas */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por tema, filósofo, corriente o palabra clave (ej. Kant, ética, verdad)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        {onNavigateToAtlas && (
          <button
            onClick={onNavigateToAtlas}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Ver autores en el Atlas</span>
          </button>
        )}
      </div>

      {/* Listado de Bloques Temáticos */}
      <div className="max-w-6xl mx-auto space-y-6">
        {filteredBloques.map((bloque, bIdx) => (
          <div
            key={bIdx}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl"
          >
            <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                {bloque.bloque}
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {bloque.temas.length} {bloque.temas.length === 1 ? 'tema' : 'temas'}
              </span>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {bloque.temas.map((tema) => (
                <div
                  key={tema.num}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-400/40 transition-all flex items-start gap-3 group"
                >
                  <span className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                    {tema.num}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white leading-snug">
                      {tema.titulo}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredBloques.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <p className="text-slate-400 text-sm">
              No se encontraron temas con el término «<strong>{searchTerm}</strong>».
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700"
            >
              Restablecer búsqueda
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
