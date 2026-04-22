/**
 * Flashcards Learning Screen
 * Học với thẻ từ, spaced repetition
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackHeader from '../../components/BackHeader';

interface Flashcard {
  id: string;
  word: string;
  meaning_vi: string;
  meaning_en: string;
  example_sentence: string;
  example_translation: string;
}

type CardSide = 'front' | 'back';

export default function FlashcardsScreen() {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const { sqliteDB } = await import('../../lib/database/sqlite');

      await sqliteDB.init();
      const db = sqliteDB.getDatabase();

      // Get vocabularies for flashcards
      const result = await db.getAllAsync<any>(
        'SELECT id, word, meaning_vi, meaning_en, example_sentence, example_translation FROM vocabularies LIMIT 20'
      );

      setFlashcards(result as Flashcard[]);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      Alert.alert('Hoàn thành!', 'Bạn đã học hết tất cả thẻ từ!');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnow = () => {
    // TODO: Update spaced repetition data
    handleNext();
  };

  const handleDontKnow = () => {
    // TODO: Mark for review
    handleNext();
  };

  const renderCard = () => {
    if (flashcards.length === 0) return null;

    const card = flashcards[currentIndex];

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={handleFlip}
          activeOpacity={0.9}
        >
          {!isFlipped ? (
            // Front - Word
            <View style={styles.cardFront}>
              <Text style={styles.progress}>
                {currentIndex + 1} / {flashcards.length}
              </Text>
              <Text style={styles.word}>{card.word}</Text>
              <Text style={styles.hint}>Tap để xem nghĩa →</Text>
            </View>
          ) : (
            // Back - Meaning
            <View style={styles.cardBack}>
              <Text style={styles.meaning}>{card.meaning_vi}</Text>
              {card.meaning_en && (
                <Text style={styles.meaningEn}>{card.meaning_en}</Text>
              )}
              {card.example_sentence && (
                <View style={styles.example}>
                  <Text style={styles.exampleText}>{card.example_sentence}</Text>
                  <Text style={styles.exampleTranslation}>{card.example_translation}</Text>
                </View>
              )}
              <Text style={styles.hint}>← Tap để xem từ</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Action Buttons */}
        {isFlipped && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, styles.dontKnowBtn]} onPress={handleDontKnow}>
              <Text style={styles.actionBtnText}>❌ Không biết</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.knowBtn]} onPress={handleKnow}>
              <Text style={styles.actionBtnText}>✅ Đã biết</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navBtnText}>← Trước</Text>
          </TouchableOpacity>

          <Text style={styles.cardCounter}>
            {currentIndex + 1} / {flashcards.length}
          </Text>

          <TouchableOpacity
            style={[styles.navBtn, currentIndex === flashcards.length - 1 && styles.navBtnDisabled]}
            onPress={handleNext}
            disabled={currentIndex === flashcards.length - 1}
          >
            <Text style={styles.navBtnText}>Tiếp →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Học với Flashcards" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      </SafeAreaView>
    );
  }

  if (flashcards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Học với Flashcards" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎴</Text>
          <Text style={styles.emptyText}>
            Chưa có thẻ từ nào. Hãy import từ vựng trước!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Học với Flashcards" />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Hoàn thành {Math.round((currentIndex / flashcards.length) * 100)}%
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${(currentIndex / flashcards.length) * 100}%` }]}
          />
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
    fontSize: 16,
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
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    height: 380,
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
    justifyContent: 'center',
  },
  cardBack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontSize: 13,
    color: '#999',
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#999',
  },
  meaning: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 12,
    textAlign: 'center',
  },
  meaningEn: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  example: {
    marginTop: 16,
  },
  exampleText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  exampleTranslation: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dontKnowBtn: {
    backgroundColor: '#ef4444',
  },
  knowBtn: {
    backgroundColor: '#22c55e',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  navBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  navBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  cardCounter: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
