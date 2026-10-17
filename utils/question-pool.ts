/**
 * Helpers for drawing a random round of questions from a larger pool.
 * Each game keeps a pool of 50 questions and plays `count` of them per round.
 */

/** Returns a shuffled copy (Fisher–Yates); the input is not modified. */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Picks `count` distinct random items from `pool`. */
export function pickRandomQuestions<T>(pool: readonly T[], count: number): T[] {
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}
