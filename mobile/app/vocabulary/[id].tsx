/**
 * Vocabulary Detail Screen
 * Chi tiết từ vựng với tabs: Info, Examples, Flashcard
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackHeader from '../../components/BackHeader';

interface Vocabulary {
  id: string;
  word: string;
  word_type: string;
  subtype: string;
  meaning_vi: string;
  meaning_en: string;
  pronunciation: string;
  audio_url: string;
  part_of_speech: string;
  grammar_pattern: string;
  grammar_note: string;
  example_sentence: string;
  example_translation: string;
  example_2_sentence: string;
  example_2_translation: string;
  synonyms: string;
  antonyms: string;
  collocations: string;
  level: string;
  frequency: number;
  is_common: number;
}

type TabType = 'info' | 'examples' | 'flashcard';

export default function VocabularyDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const wordId = params.id as string;

  const [vocabulary, setVocabulary] = useState<Vocabulary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    loadVocabulary();
    checkFavorite();
  }, [wordId]);

  const loadVocabulary = async () => {
    try {
      const { localDataService } = await import('../../lib/api/localData');
      const { sqliteDB } = await import('../../lib/database/sqlite');

      await sqliteDB.init();

      // Get vocabulary detail
      const db = sqliteDB.getDatabase();
      const result = await db.getFirstAsync<any>(
        'SELECT * FROM vocabularies WHERE id = ?',
        [wordId]
      );

      if (result) {
        setVocabulary(result as Vocabulary);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy từ vựng');
        router.back();
      }
    } catch (error) {
      console.error('Error loading vocabulary:', error);
      Alert.alert('Lỗi', 'Không thể tải từ vựng');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const favs = await AsyncStorage.getItem('favorites');
      if (favs) {
        const favSet = new Set(JSON.parse(favs));
        setIsFav(favSet.has(wordId));
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const favs = await AsyncStorage.getItem('favorites');
      const favSet = favs ? new Set(JSON.parse(favs)) : new Set();

      if (favSet.has(wordId)) {
        favSet.delete(wordId);
        setIsFav(false);
      } else {
        favSet.add(wordId);
        setIsFav(true);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify([...favSet]));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const startExercise = () => {
    Alert.alert(
      'Luyện tập',
      'Bạn có muốn luyện tập với từ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Luyện tập',
          onPress: () => {
            // TODO: Create exercise with this vocabulary
            Alert.alert('Sắp ra mắt!', 'Tính năng đang phát triển');
          },
        },
      ]
    );
  };

  const renderTab = (tab: TabType, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tab && styles.tabActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {icon} {label}
      </Text>
    </TouchableOpacity>
  );

  const renderInfoTab = () => {
    if (!vocabulary) return null;

    return (
      <ScrollView style={styles.tabContent}>
        {/* Word & Type */}
        <View style={styles.section}>
          <View style={styles.wordHeader}>
            <Text style={styles.word}>{vocabulary.word}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wordMeta}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>{vocabulary.word_type}</Text>
            </View>
            {vocabulary.subtype && (
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{vocabulary.subtype}</Text>
              </View>
            )}
            {vocabulary.level && (
              <View style={[styles.metaBadge, styles.levelBadge]}>
                <Text style={styles.metaBadgeText}>{vocabulary.level}</Text>
              </View>
            )}
          </View>

          {vocabulary.pronunciation && (
            <View style={styles.pronunciationBox}>
              <Text style={styles.pronunciation}>{vocabulary.pronunciation}</Text>
            </View>
          )}
        </View>

        {/* Meanings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nghĩa</Text>
          <Text style={styles.meaningVi}>{vocabulary.meaning_vi}</Text>
          {vocabulary.meaning_en && (
            <Text style={styles.meaningEn}>{vocabulary.meaning_en}</Text>
          )}
        </View>

        {/* Grammar */}
        {vocabulary.grammar_pattern && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ngữ pháp</Text>
            {vocabulary.grammar_pattern && (
              <Text style={styles.grammarPattern}>{vocabulary.grammar_pattern}</Text>
            )}
            {vocabulary.grammar_note && (
              <View style={styles.grammarNote}>
                <Text style={styles.noteLabel}>⚠️ Lưu ý:</Text>
                <Text style={styles.noteText}>{vocabulary.grammar_note}</Text>
              </View>
            )}
          </View>
        )}

        {/* Synonyms */}
        {vocabulary.synonyms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đồng nghĩa</Text>
            <Text style={styles.listText}>
              {JSON.parse(vocabulary.synonyms).join(', ')}
            </Text>
          </View>
        )}

        {/* Antonyms */}
        {vocabulary.antonyms && JSON.parse(vocabulary.antonyms).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trái nghĩa</Text>
            <Text style={styles.listText}>
              {JSON.parse(vocabulary.antonyms).join(', ')}
            </Text>
          </View>
        )}

        {/* Collocations */}
        {vocabulary.collocations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Từ đi kèm thường dùng</Text>
            {JSON.parse(vocabulary.collocations).map((col: string, i: number) => (
              <View key={i} style={styles.collocationItem}>
                <Text style={styles.collocationText}>• {col}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thống kê</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Tần suất:</Text>
            <Text style={styles.statValue}>{vocabulary.frequency}/100</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Phổ biến:</Text>
            <Text style={styles.statValue}>{vocabulary.is_common ? 'Có' : 'Không'}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={startExercise}>
            <Text style={styles.actionButtonText}>📝 Luyện tập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderExamplesTab = () => {
    if (!vocabulary) return null;

    return (
      <ScrollView style={styles.tabContent}>
        {/* Example 1 */}
        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Ví dụ 1</Text>
          <Text style={styles.exampleSentence}>{vocabulary.example_sentence}</Text>
          <Text style={styles.exampleTranslation}>{vocabulary.example_translation}</Text>
        </View>

        {/* Example 2 */}
        {vocabulary.example_2_sentence && (
          <View style={styles.exampleCard}>
            <Text style={styles.exampleLabel}>Ví dụ 2</Text>
            <Text style={styles.exampleSentence}>{vocabulary.example_2_sentence}</Text>
            <Text style={styles.exampleTranslation}>{vocabulary.example_2_translation}</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderFlashcardTab = () => {
    if (!vocabulary) return null;

    return (
      <View style={styles.flashcardContainer}>
        <TouchableOpacity
          style={styles.flashcard}
          onPress={() => setIsFlipped(!isFlipped)}
          activeOpacity={0.9}
        >
          {!isFlipped ? (
            // Front - Word
            <View style={styles.flashcardFront}>
              <Text style={styles.flashcardWord}>{vocabulary.word}</Text>
              {vocabulary.pronunciation && (
                <Text style={styles.flashcardPronunciation}>{vocabulary.pronunciation}</Text>
              )}
              <Text style={styles.flashcardHint}>Tap để xem nghĩa</Text>
            </View>
          ) : (
            // Back - Meaning
            <View style={styles.flashcardBack}>
              <Text style={styles.flashcardMeaning}>{vocabulary.meaning_vi}</Text>
              {vocabulary.meaning_en && (
                <Text style={styles.flashcardMeaningEn}>{vocabulary.meaning_en}</Text>
              )}
              {vocabulary.example_sentence && (
                <Text style={styles.flashcardExample} numberOfLines={2}>
                  "{vocabulary.example_sentence}"
                </Text>
              )}
              <Text style={styles.flashcardHint}>Tap để xem từ</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Flashcard actions */}
        <View style={styles.flashcardActions}>
          <TouchableOpacity
            style={styles.flashcardAction}
            onPress={() => setIsFlipped(false)}
          >
            <Text style={styles.flashcardActionText}>❌ Không biết</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flashcardAction, styles.flashcardActionKnow]}
            onPress={() => setIsFlipped(true)}
          >
            <Text style={styles.flashcardActionText}>✅ Đã biết</Text>
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Tiến độ học tập</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Chi tiết từ vựng" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      </SafeAreaView>
    );
  }

  if (!vocabulary) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Chi tiết từ vựng" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy từ vựng</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Chi tiết từ vựng" />

      {/* Tabs */}
      <View style={styles.tabs}>
        {renderTab('info', 'Thông tin', '📖')}
        {renderTab('examples', 'Ví dụ', '💬')}
        {renderTab('flashcard', 'Thẻ từ', '🎴')}
      </View>

      {/* Tab Content */}
      {activeTab === 'info' && renderInfoTab()}
      {activeTab === 'examples' && renderExamplesTab()}
      {activeTab === 'flashcard' && renderFlashcardTab()}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0ea5e9',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0ea5e9',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  word: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  favIcon: {
    fontSize: 28,
  },
  wordMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelBadge: {
    backgroundColor: '#fef9c3',
  },
  metaBadgeText: {
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  pronunciationBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  pronunciation: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    marginTop: 16,
  },
  meaningVi: {
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  meaningEn: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  grammarPattern: {
    fontSize: 16,
    color: '#0ea5e9',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  grammarNote: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    padding: 12,
    borderRadius: 4,
  },
  noteLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#78350f',
  },
  listText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  collocationItem: {
    marginBottom: 8,
  },
  collocationText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  exampleCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  exampleSentence: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  exampleTranslation: {
    fontSize: 14,
    color: '#666',
  },
  flashcardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  flashcard: {
    width: '100%',
    height: 300,
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
  flashcardFront: {
    alignItems: 'center',
  },
  flashcardBack: {
    alignItems: 'center',
  },
  flashcardWord: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  flashcardPronunciation: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  flashcardMeaning: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 12,
    textAlign: 'center',
  },
  flashcardMeaningEn: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  flashcardExample: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  flashcardHint: {
    fontSize: 13,
    color: '#999',
    marginTop: 24,
  },
  flashcardActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  flashcardAction: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  flashcardActionKnow: {
    backgroundColor: '#22c55e',
  },
  flashcardActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
});
