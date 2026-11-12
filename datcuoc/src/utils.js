import { LEVELS, MULTIPLIERS, RESULTS, MIN_BET, MAX_BET, BET_STEP, formatMultiplier } from './data';

export const validateBet = (bet, score) =>
  Number.isInteger(bet) && bet % BET_STEP === 0 && bet >= MIN_BET && bet <= MAX_BET && bet <= score
    ? ''
    : 'Mức cược phải là bội số của 100, từ 100 đến 500 và không vượt quá số điểm đang có';

export const calcChange = (bet, level, correct) => (correct ? bet * MULTIPLIERS[level] : -bet);

export const getResult = (score) => RESULTS.find((r) => score >= r.min) || RESULTS[RESULTS.length - 1];

export const headline = (q, k, total) =>
  `Câu ${k}/${total} · ${q.topic} · ${LEVELS[q.level]} (${formatMultiplier(MULTIPLIERS[q.level])})`;