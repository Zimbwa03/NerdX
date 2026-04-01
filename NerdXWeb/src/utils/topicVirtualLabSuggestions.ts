import type { Subject, SimulationMetadata } from '../data/virtualLab/simulationTypes';
import { getSimulationsBySubject } from '../data/virtualLab/simulationsData';

/**
 * Rank virtual labs for a topic using simple keyword overlap on title/topic/description.
 */
export function getSuggestedVirtualLabsForTopic(
  labSubject: Subject | null,
  topicName: string,
  topicDescription: string,
  max = 4,
): SimulationMetadata[] {
  if (!labSubject) return [];
  const labs = getSimulationsBySubject(labSubject);
  if (labs.length === 0) return [];

  const hay = `${topicName} ${topicDescription}`.toLowerCase();
  const words = new Set(
    hay
      .split(/\W+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2),
  );

  const scored = labs.map((sim) => {
    const blob = `${sim.title} ${sim.topic} ${sim.description}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (blob.includes(w)) score += 1;
    }
    const prefix = topicName.slice(0, 12).toLowerCase();
    if (prefix.length > 4 && blob.includes(prefix)) score += 6;
    return { sim, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const picked = scored.filter((s) => s.score > 0).slice(0, max).map((s) => s.sim);
  if (picked.length >= max) return picked;

  const seen = new Set(picked.map((p) => p.id));
  for (const { sim } of scored) {
    if (picked.length >= max) break;
    if (seen.has(sim.id)) continue;
    seen.add(sim.id);
    picked.push(sim);
  }
  return picked.slice(0, max);
}
