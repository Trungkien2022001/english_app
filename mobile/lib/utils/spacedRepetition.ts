/**
 * Spaced Repetition System (SM-2 Algorithm)
 * Optimized learning review scheduling
 */

export interface CardData {
  id: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: Date;
  lastReviewAt: Date | null;
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';

/**
 * Calculate next review date using SM-2 algorithm
 * @param card Current card data
 * @param rating User rating: 'again' | 'hard' | 'good' | 'easy'
 * @returns Updated card data
 */
export function calculateNextReview(card: CardData, rating: Rating): CardData {
  const now = new Date();
  let { easeFactor, interval, repetitions } = card;

  // SM-2 Algorithm
  switch (rating) {
    case 'again':
      // Forgot - reset
      repetitions = 0;
      interval = 1;
      break;

    case 'hard':
      // Difficult - minimal progress
      repetitions += 1;
      interval = Math.max(1, Math.floor(interval * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;

    case 'good':
      // Normal - standard progress
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      easeFactor = Math.max(1.3, easeFactor);
      break;

    case 'easy':
      // Easy - extra progress
      repetitions += 1;
      if (repetitions === 1) {
        interval = 4;
      } else if (repetitions === 2) {
        interval = 10;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
      easeFactor += 0.15;
      break;
  }

  // Calculate next review date
  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return {
    ...card,
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReviewAt,
    lastReviewAt: now,
  };
}

/**
 * Initialize new card with default SM-2 values
 */
export function initializeCard(id: string): CardData {
  return {
    id,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewAt: new Date(),
    lastReviewAt: null,
  };
}

/**
 * Check if card is due for review
 */
export function isCardDue(card: CardData): boolean {
  return new Date() >= card.nextReviewAt;
}

/**
 * Get cards due for review
 */
export function getDueCards(cards: CardData[]): CardData[] {
  return cards.filter(isCardDue);
}

/**
 * Calculate review session statistics
 */
export interface ReviewStats {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  dueToday: number;
}

export function calculateReviewStats(cards: CardData[]): ReviewStats {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return {
    totalCards: cards.length,
    newCards: cards.filter((c) => c.repetitions === 0).length,
    learningCards: cards.filter(
      (c) => c.repetitions > 0 && c.interval < 21
    ).length,
    reviewCards: cards.filter((c) => c.repetitions > 0).length,
    dueToday: cards.filter((c) => {
      const reviewDate = new Date(c.nextReviewAt);
      const reviewDay = new Date(
        reviewDate.getFullYear(),
        reviewDate.getMonth(),
        reviewDate.getDate()
      );
      return reviewDay <= today;
    }).length,
  };
}

/**
 * Get rating label in Vietnamese
 */
export function getRatingLabel(rating: Rating): string {
  const labels = {
    again: '❌ Nhắc lại',
    hard: '😓 Khó',
    good: '😊 Tốt',
    easy: '😄 Dễ',
  };
  return labels[rating];
}

/**
 * Get rating color
 */
export function getRatingColor(rating: Rating): string {
  const colors = {
    again: '#ef4444',
    hard: '#f59e0b',
    good: '#22c55e',
    easy: '#0ea5e9',
  };
  return colors[rating];
}
