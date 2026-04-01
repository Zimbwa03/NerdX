import type { MathTopic } from '../data/oLevelMath/topics';
import { MATH_SIMULATIONS } from '../data/virtualLab/mathSimulationsData';
import type { SimulationMetadata } from '../data/virtualLab/simulationTypes';

const byId = new Map(MATH_SIMULATIONS.map((s) => [s.id, s]));

/** Keyword rules → lab ids (first matches add first; deduped, capped). */
const RULES: { re: RegExp; ids: string[] }[] = [
  { re: /approximat|estimat|accuracy|limit of|upper and lower/i, ids: ['bounds-accuracy-lab'] },
  { re: /ratio|proportion|rate|financial|interest|consumer|percentage|bills/i, ids: ['ratio-proportion-lab'] },
  { re: /standard form|number bases|indices|index form|large and small/i, ids: ['indices-standard-form-lab'] },
  { re: /graph|coordinate|cartesian|travel graph|distance-time|speed-time|velocity-time/i, ids: ['linear-graphs-lab'] },
  { re: /quadratic/i, ids: ['quadratic-explorer'] },
  { re: /simultaneous/i, ids: ['simultaneous-equations-lab'] },
  { re: /inequalit/i, ids: ['inequalities-region-lab'] },
  { re: /logarithm/i, ids: ['logarithms-lab'] },
  { re: /matrix|matrices/i, ids: ['matrix-sandbox'] },
  { re: /vector/i, ids: ['vector-visualizer'] },
  { re: /probability/i, ids: ['probability-simulator'] },
  { re: /trigonometr|pythagoras|bearing|angle of elevation|angle of depression/i, ids: ['pythagoras-trig-lab'] },
  { re: /circle|polygon|construction|symmetry|geometry|locus|similarity|congruen/i, ids: ['angle-rules-lab', 'similarity-scale-lab'] },
  { re: /mensuration|measure|area|volume|perimeter|density|scale drawing/i, ids: ['mensuration-lab'] },
  { re: /statistic|data |dispersion|central tendency|cumulative|histogram|classification/i, ids: ['statistics-explorer'] },
  { re: /translat|reflect|rotat|transform|enlargement|shear|stretch/i, ids: ['transformations-lab'] },
  { re: /sequence|series/i, ids: ['sequences-series-lab'] },
  { re: /linear programming/i, ids: ['linear-programming-lab'] },
  { re: /complex number|argand/i, ids: ['complex-numbers-lab'] },
  { re: /differentiat|derivative/i, ids: ['differentiation-lab'] },
  { re: /integrat|riemann/i, ids: ['integration-lab'] },
  {
    re: /number concept|operation|fraction|decimal|directed|h\.c\.f|l\.c\.m|multiple|factor(?!is)/i,
    ids: ['ratio-proportion-lab', 'indices-standard-form-lab'],
  },
  { re: /set|venn/i, ids: ['math-explorer'] },
  { re: /equation|algebraic|symbolic|manipulation|factoris|expansion|substitut/i, ids: ['simultaneous-equations-lab'] },
];

const FALLBACK_IDS = ['math-explorer', 'linear-graphs-lab', 'quadratic-explorer'];

export function getSuggestedMathLabsForTopic(topic: MathTopic, max = 4): SimulationMetadata[] {
  const hay = `${topic.name} ${topic.description}`;
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const { re, ids: labIds } of RULES) {
    if (!re.test(hay)) continue;
    for (const id of labIds) {
      if (seen.has(id)) continue;
      seen.add(id);
      ids.push(id);
      if (ids.length >= max) break;
    }
    if (ids.length >= max) break;
  }
  if (ids.length === 0) {
    for (const id of FALLBACK_IDS) {
      if (ids.length >= max) break;
      if (!seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }
  }
  return ids
    .slice(0, max)
    .map((id) => byId.get(id))
    .filter((s): s is SimulationMetadata => Boolean(s));
}
