/**
 * Review Session Screen
 * Spaced repetition-based review
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackHeader from '../../components/BackHeader';
import {
  CardData,
  Rating,
  calculateNextReview,
  initializeCard,
  getRatingLabel,
  getRatingColor,
} from '../../lib/utils/spacedRepetition';

interface ReviewSession {
  cards: (CardData & { word: string; meaning: string; example?: string })[];
  currentIndex: number;
  isFlipped: boolean;
  completed: number;
  correct: number;
}

export default function ReviewSessionScreen() {
  const router = useRouter();
  const [session, setSession] = useState<ReviewSession>({
    cards: [],
    currentIndex: 0,
    isFlipped: false,
    completed: 0,
    correct: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    loadReviewCards();
  }, []);

  const loadReviewCards = async () => {
    try {
      const { sqliteDB } = await import('../../lib/database/sqlite');
      await sqliteDB.init();
      const db = sqliteDB.getDatabase();

      // Get cards due for review
      const result = await db.getAllAsync<any>(
        `SELECT v.id, v.word, v.meaning_vi as meaning, v.example_sentence as example,
              s.repetitions, s.ease_factor, s.review_interval
       FROM vocabularies v
       LEFT JOIN spaced_repetition s ON v.id = s.vocabulary_id
       WHERE s.next_review_at <= datetime('now')
          OR s.next_review_at IS NULL
       ORDER BY s.next_review_at ASC
       LIMIT 20`
      );

      if (result.length === 0) {
        // No cards due - get new cards to learn
        const newCards = await db.getAllAsync<any>(
          `SELECT v.id, v.word, v.meaning_vi as meaning, v.example_sentence as example
           FROM vocabularies v
           LEFT JOIN spaced_repetition s ON v.id = s.vocabulary_id
           WHERE s.vocabulary_id IS NULL
           LIMIT 10`
        );

        const cardsWithSR = newCards.map((card) => ({
          ...card,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReviewAt: new Date(),
          lastReviewAt: null,
        }));

        setSession({ ...session, cards: cardsWithSR });
      } else {
        const cardsWithSR = result.map((card) => ({
          ...card,
          easeFactor: card.ease_factor || 2.5,
          interval: card.review_interval || 0,
          repetitions: card.repetitions || 0,
          nextReviewAt: new Date(),
          lastReviewAt: null,
        }));

        setSession({ ...session, cards: cardsWithSR });
      }
    } catch (error) {
      console.error('Error loading review cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: Rating) => {
    const currentCard = session.cards[session.currentIndex];

    // Update spaced repetition data
    const updatedCard = calculateNextReview(currentCard, rating);

    // Save to database
    try {
      const { sqliteDB } = await import('../../lib/database/sqlite');
      const db = sqliteDB.getDatabase();

      await db.runAsync(
        `INSERT INTO spaced_repetition (vocabulary_id, repetitions, ease_factor, review_interval, next_review_at, last_reviewed_at)
         VALUES (?, ?, ?, ?, datetime('now', '+' || ? || ' days'), datetime('now'))
         ON CONFLICT(vocabulary_id) DO UPDATE SET
           repetitions = excluded.repetitions,
           ease_factor = excluded.ease_factor,
           review_interval = excluded.review_interval,
           next_review_at = excluded.next_review_at,
           last_reviewed_at = excluded.last_reviewed_at`,
        [
          currentCard.id,
          updatedCard.repetitions,
          updatedCard.easeFactor,
          updatedCard.interval,
        ]
      );
    } catch (error) {
      console.error('Error saving spaced repetition data:', error);
    }

    // Update session stats
    const wasCorrect = rating === 'good' || rating === 'easy';
    setSession({
      ...session,
      completed: session.completed + 1,
      correct: wasCorrect ? session.correct + 1 : session.correct,
    });

    // Move to next card
    moveToNext();
  };

  const moveToNext = () => {
    if (session.currentIndex < session.cards.length - 1) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1,
        isFlipped: false,
      });
      setShowAnswer(false);
    } else {
      // Session complete
      showSessionSummary();
    }
  };

  const showSessionSummary = () => {
    const accuracy = Math.round((session.correct / session.completed) * 100);
    Alert.alert(
      'Hoàn thành phiên ôn tập!',
      `✅ Đã ôn: ${session.completed} thẻ\n🎯 Chính xác: ${accuracy}%\n⭐ XP: +${session.completed * 5}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderCard = () => {
    if (session.cards.length === 0) return null;

    const card = session.cards[session.currentIndex];

    return (
      <View style={styles.cardContainer}>
        <Text style={styles.progress}>
          {session.currentIndex + 1} / {session.cards.length}
        </Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowAnswer(!showAnswer)}
          activeOpacity={0.9}
        >
          {!showAnswer ? (
            // Front
            <View style={styles.cardFront}>
              <Text style={styles.word}>{card.word}</Text>
              <Text style={styles.hint}>Tap để xem đáp án →</Text>
            </View>
          ) : (
            // Back
            <View style={styles.cardBack}>
              <Text style={styles.meaning}>{card.meaning}</Text>
              {card.example && (
                <Text style={styles.example}>"{card.example}"</Text>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Rating Buttons */}
        {showAnswer && (
          <View style={styles.ratingContainer}>
            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: getRatingColor('again') }]}
              onPress={() => handleRating('again')}
            >
              <Text style={styles.ratingBtnText}>{getRatingLabel('again')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: getRatingColor('hard') }]}
              onPress={() => handleRating('hard')}
            >
              <Text style={styles.ratingBtnText}>{getRatingLabel('hard')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: getRatingColor('good') }]}
              onPress={() => handleRating('good')}
            >
              <Text style={styles.ratingBtnText}>{getRatingLabel('good')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: getRatingColor('easy') }]}
              onPress={() => handleRating('easy')}
            >
              <Text style={styles.ratingBtnText}>{getRatingLabel('easy')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Ôn tập thông minh" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      </SafeAreaView>
    );
  }

  if (session.cards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Ôn tập thông minh" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyText}>
            Hiện không có thẻ nào cần ôn tập!
          </Text>
          <Text style={styles.emptySubtext}>
            Hãy quay lại sau hoặc học thêm từ mới
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Ôn tập thông minh" />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Hoàn thành {Math.round((session.currentIndex / session.cards.length) * 100)}%
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(session.currentIndex / session.cards.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Session Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{session.completed}</Text>
          <Text style={styles.statLabel}>Đã ôn</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{session.correct}</Text>
          <Text style={styles.statLabel}>Chính xác</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {session.completed > 0 ? Math.round((session.correct / session.completed) * 100) : 0}%
          </Text>
          <Text style={styles.statLabel}>Độ chính xác</Text>
        </View>
      </View>

      {/* Card */}
      {renderCard()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  progress: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontSize: 13,
    color: '#999',
  },
  card: {
    width: '100%',
    height: 350,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cardFront: {
    alignItems: 'center',
  },
  cardBack: {
    alignItems: 'center',
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  meaning: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 16,
    textAlign: 'center',
  },
  example: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#999',
  },
  ratingContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    marginTop: 16,
  },
  ratingBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ratingBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
});
