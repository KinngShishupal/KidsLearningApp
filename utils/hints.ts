import { shuffle } from '@/utils/question-pool';

/**
 * Picks which wrong options a hint should hide.
 * Never hides a correct option, and always leaves at least `keepWrong` wrong ones.
 */
export function pickWrongOptionsToHide<T>(
  options: readonly T[],
  isCorrect: (option: T) => boolean,
  count = 2,
  keepWrong = 0
): T[] {
  const wrong = options.filter((option) => !isCorrect(option));
  const hideCount = Math.max(0, Math.min(count, wrong.length - keepWrong));
  return shuffle(wrong).slice(0, hideCount);
}
