/**
 * Quiz Types Exercise Screen
 * Multiple exercise types: MC, Fill blank, Matching, Listening
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackHeader from '../../components/BackHeader';

type QuizType = 'mc' | 'fill_blank' | 'matching' | 'listening';
type Difficulty = 'easy' | 'medium' | 'hard';

interface MatchingPair {
  id: string;
  word: string;
  meaning: string;
  matched: boolean;
}

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [quizType, setQuizType] = useState<QuizType>('mc');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Matching game state
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);

  // Listening game state
  const [showListeningWord, setShowListeningWord] = useState(false);

  useEffect(() => {
    loadVocabularies();
  }, []);

  useEffect(() => {
    // Reset matching state when changing question or quiz type
    if (quizType === 'matching') {
      initMatchingGame();
    }
    if (quizType === 'listening') {
      setShowListeningWord(false);
    }
  }, [currentQuestion, quizType]);

  const loadVocabularies = async () => {
    try {
      const { sqliteDB } = await import('../../lib/database/sqlite');
      await sqliteDB.init();
      const db = sqliteDB.getDatabase();

      const result = await db.getAllAsync<any>(
        'SELECT * FROM vocabularies LIMIT 50'
      );

      const shuffled = result.sort(() => Math.random() - 0.5);
      setVocabularies(shuffled);
    } catch (error) {
      console.error('Error loading vocabularies:', error);
    } finally {
      setLoading(false);
    }
  };

  const initMatchingGame = () => {
    const vocab = vocabularies[currentQuestion];
    if (!vocab) return;

    const wrongs = vocabularies
      .filter((v: any) => v.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const pairs: MatchingPair[] = [
      { id: vocab.id, word: vocab.word, meaning: vocab.meaning_vi, matched: false },
      ...wrongs.map((w: any) => ({
        id: w.id,
        word: w.word,
        meaning: w.meaning_vi,
        matched: false,
      })),
    ].sort(() => Math.random() - 0.5);

    setMatchingPairs(pairs);
    setSelectedWord(null);
    setSelectedMeaning(null);
    setMatchedPairs(0);
  };

  const generateQuestion = () => {
    const vocab = vocabularies[currentQuestion];
    if (!vocab) return null;

    switch (quizType) {
      case 'mc':
        return {
          word: vocab.word,
          options: generateMCOptions(vocab),
        };

      case 'fill_blank':
        return {
          sentence: generateFillBlankSentence(vocab),
          answer: vocab.word,
          hint: vocab.meaning_vi.substring(0, 20) + '...',
        };

      case 'matching':
        return {
          pairs: matchingPairs,
        };

      case 'listening':
        return {
          word: vocab.word,
          options: generateListeningOptions(vocab),
        };

      default:
        return null;
    }
  };

  const generateMCOptions = (vocab: any) => {
    const wrongs = vocabularies
      .filter((v: any) => v.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v: any) => v.meaning_vi);

    const all = [...wrongs, vocab.meaning_vi].sort(() => Math.random() - 0.5);
    return all;
  };

  const generateListeningOptions = (vocab: any) => {
    const wrongs = vocabularies
      .filter((v: any) => v.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v: any) => v.word);

    const all = [...wrongs, vocab.word].sort(() => Math.random() - 0.5);
    return all;
  };

  const generateFillBlankSentence = (vocab: any) => {
    const examples = [
      vocab.example_sentence,
      vocab.example_2_sentence,
      `I ___ ${vocab.word} every day.`,
      `Can you ___ ${vocab.word}?`,
    ].filter(Boolean);

    const example = examples[Math.floor(Math.random() * examples.length)];
    return example.replace(new RegExp(vocab.word, 'gi'), '___');
  };

  const handleWordSelect = (pairId: string) => {
    if (selectedMeaning) {
      // Try to match
      const pair = matchingPairs.find((p) => p.id === pairId);
      const meaningPair = matchingPairs.find((p) => p.id === selectedMeaning);

      if (pair && meaningPair) {
        const isMatch = pair.word === meaningPair.word;
        if (isMatch) {
          // Correct match
          setMatchingPairs((prev) =>
            prev.map((p) =>
              p.id === pairId ? { ...p, matched: true } : p
            )
          );
          setMatchedPairs((prev) => prev + 1);
        }
      }
      setSelectedWord(null);
      setSelectedMeaning(null);
    } else {
      setSelectedWord(pairId);
    }
  };

  const handleMeaningSelect = (pairId: string) => {
    if (selectedWord) {
      // Try to match
      const pair = matchingPairs.find((p) => p.id === pairId);
      const wordPair = matchingPairs.find((p) => p.id === selectedWord);

      if (pair && wordPair) {
        const isMatch = pair.id === wordPair.id;
        if (isMatch) {
          // Correct match
          setMatchingPairs((prev) =>
            prev.map((p) =>
              p.id === pairId ? { ...p, matched: true } : p
            )
          );
          setMatchedPairs((prev) => prev + 1);
        }
      }
      setSelectedWord(null);
      setSelectedMeaning(null);
    } else {
      setSelectedMeaning(pairId);
    }
  };

  const checkAnswer = () => {
    const vocab = vocabularies[currentQuestion];
    let correct = false;

    switch (quizType) {
      case 'mc':
        correct = userAnswer === vocab.meaning_vi;
        break;

      case 'fill_blank':
        correct = userAnswer.toLowerCase().trim() === vocab.word.toLowerCase();
        break;

      case 'matching':
        correct = matchedPairs === matchingPairs.length;
        break;

      case 'listening':
        correct = userAnswer === vocab.word;
        break;
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNext = () => {
    if (currentQuestion < vocabularies.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(null);
      setShowListeningWord(false);
    } else {
      Alert.alert(
        'Hoàn thành!',
        `Điểm: ${score}/${vocabularies.length * 10}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const renderMCQuestion = () => {
    const question = generateQuestion();
    if (!question) return null;

    return (
      <View style={styles.quizContainer}>
        <Text style={styles.questionText}>
          "{question.word}" nghĩa là gì?
        </Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                showResult &&
                  userAnswer === option &&
                  (option === vocabularies[currentQuestion].meaning_vi
                    ? styles.optionCorrect
                    : styles.optionWrong),
              ]}
              onPress={() => !showResult && setUserAnswer(option)}
              disabled={showResult}
            >
              <Text
                style={[
                  styles.optionText,
                  showResult && userAnswer === option && styles.optionTextDisabled,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showResult && (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultText,
                isCorrect ? styles.resultCorrect : styles.resultWrong,
              ]}
            >
              {isCorrect ? '✅ Chính xác!' : '❌ Sai rồi!'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderFillBlankQuestion = () => {
    const question = generateQuestion();
    if (!question) return null;

    return (
      <View style={styles.quizContainer}>
        <Text style={styles.questionText}>Điền từ còn thiếu:</Text>

        <View style={styles.sentenceBox}>
          <Text style={styles.sentence}>{question.sentence}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nhập từ tiếng Anh..."
          value={userAnswer}
          onChangeText={setUserAnswer}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!showResult}
        />

        <Text style={styles.hint}>Gợi ý: {question.hint}</Text>

        {showResult && (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultText,
                isCorrect ? styles.resultCorrect : styles.resultWrong,
              ]}
            >
              {isCorrect ? '✅ Chính xác!' : `❌ Đáp án: ${vocabularies[currentQuestion].word}`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderMatchingQuestion = () => {
    const question = generateQuestion();
    if (!question) return null;

    return (
      <View style={styles.quizContainer}>
        <Text style={styles.questionText}>Nối từ với nghĩa đúng:</Text>

        <View style={styles.matchingProgress}>
          <Text style={styles.matchingProgressText}>
            Đã nối: {matchedPairs}/{matchingPairs.length}
          </Text>
        </View>

        <ScrollView style={styles.pairsContainer}>
          {matchingPairs.map((pair) => (
            <View key={pair.id} style={[styles.pairRow, pair.matched && styles.pairRowMatched]}>
              <TouchableOpacity
                style={[
                  styles.pairCard,
                  selectedWord === pair.id && styles.pairCardSelected,
                  pair.matched && styles.pairCardMatched,
                ]}
                onPress={() => !pair.matched && !showResult && handleWordSelect(pair.id)}
                disabled={pair.matched || showResult}
              >
                <Text style={styles.pairWord}>{pair.word}</Text>
              </TouchableOpacity>

              <Text style={styles.pairArrow}>
                {pair.matched ? '✓' : '←→'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.pairCard,
                  selectedMeaning === pair.id && styles.pairCardSelected,
                  pair.matched && styles.pairCardMatched,
                ]}
                onPress={() => !pair.matched && !showResult && handleMeaningSelect(pair.id)}
                disabled={pair.matched || showResult}
              >
                <Text style={styles.pairMeaning}>{pair.meaning}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {showResult && (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultText,
                isCorrect ? styles.resultCorrect : styles.resultWrong,
              ]}
            >
              {isCorrect ? '✅ Chính xác!' : '❌ Sai rồi!'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderListeningQuestion = () => {
    const question = generateQuestion();
    if (!question) return null;

    return (
      <View style={styles.quizContainer}>
        <Text style={styles.questionText}>Nghe và chọn từ đúng:</Text>

        <View style={styles.listeningContainer}>
          <TouchableOpacity
            style={styles.audioButton}
            onPress={() => setShowListeningWord(!showListeningWord)}
          >
            <Text style={styles.audioIcon}>{showListeningWord ? '🔇' : '🔊'}</Text>
            <Text style={styles.audioButtonText}>
              {showListeningWord ? 'Ẩn từ' : 'Hiện từ'}
            </Text>
          </TouchableOpacity>

          {showListeningWord && (
            <Text style={styles.listeningWord}>{question.word}</Text>
          )}

          <Text style={styles.listeningHint}>
            Gợi ý: {vocabularies[currentQuestion].meaning_vi}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options?.map((word: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                showResult &&
                  userAnswer === word &&
                  word === vocabularies[currentQuestion].word
                  ? styles.optionCorrect
                  : showResult && userAnswer === word
                  ? styles.optionWrong
                  : null,
              ]}
              onPress={() => !showResult && setUserAnswer(word)}
              disabled={showResult}
            >
              <Text style={styles.optionText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showResult && (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultText,
                isCorrect ? styles.resultCorrect : styles.resultWrong,
              ]}
            >
              {isCorrect ? '✅ Chính xác!' : '❌ Sai rồi!'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderQuizContent = () => {
    if (vocabularies.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>
            Chưa có dữ liệu. Hãy import từ vựng trước!
          </Text>
        </View>
      );
    }

    switch (quizType) {
      case 'mc':
        return renderMCQuestion();
      case 'fill_blank':
        return renderFillBlankQuestion();
      case 'matching':
        return renderMatchingQuestion();
      case 'listening':
        return renderListeningQuestion();
      default:
        return null;
    }
  };

  const canCheckAnswer = () => {
    if (showResult) return false;

    switch (quizType) {
      case 'mc':
      case 'listening':
        return userAnswer.length > 0;
      case 'fill_blank':
        return userAnswer.trim().length > 0;
      case 'matching':
        return matchedPairs === matchingPairs.length;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Bài tập" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Bài tập tương tác" />

      {/* Quiz Type Selection */}
      <View style={styles.typeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.typeChip, quizType === 'mc' && styles.typeChipActive]}
            onPress={() => {
              setQuizType('mc');
              setCurrentQuestion(0);
              setUserAnswer('');
              setShowResult(false);
              setIsCorrect(null);
              setScore(0);
            }}
          >
            <Text style={styles.typeChipText}>📝 Trắc nghiệm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeChip, quizType === 'fill_blank' && styles.typeChipActive]}
            onPress={() => {
              setQuizType('fill_blank');
              setCurrentQuestion(0);
              setUserAnswer('');
              setShowResult(false);
              setIsCorrect(null);
              setScore(0);
            }}
          >
            <Text style={styles.typeChipText}>✏️ Điền từ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeChip, quizType === 'matching' && styles.typeChipActive]}
            onPress={() => {
              setQuizType('matching');
              setCurrentQuestion(0);
              setUserAnswer('');
              setShowResult(false);
              setIsCorrect(null);
              setScore(0);
            }}
          >
            <Text style={styles.typeChipText}>🔗 Nối từ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeChip, quizType === 'listening' && styles.typeChipActive]}
            onPress={() => {
              setQuizType('listening');
              setCurrentQuestion(0);
              setUserAnswer('');
              setShowResult(false);
              setIsCorrect(null);
              setScore(0);
            }}
          >
            <Text style={styles.typeChipText}>🔊 Nghe</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Difficulty Selection */}
      <View style={styles.difficultySelector}>
        <Text style={styles.difficultyLabel}>Độ khó:</Text>
        <TouchableOpacity
          style={[styles.difficultyBtn, difficulty === 'easy' && styles.difficultyBtnActive]}
          onPress={() => setDifficulty('easy')}
        >
          <Text style={styles.difficultyBtnText}>Dễ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.difficultyBtn, difficulty === 'medium' && styles.difficultyBtnActive]}
          onPress={() => setDifficulty('medium')}
        >
          <Text style={styles.difficultyBtnText}>Trung bình</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.difficultyBtn, difficulty === 'hard' && styles.difficultyBtnActive]}
          onPress={() => setDifficulty('hard')}
        >
          <Text style={styles.difficultyBtnText}>Khó</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Câu {currentQuestion + 1}/{vocabularies.length}
        </Text>
        <Text style={styles.scoreText}>Điểm: {score}</Text>
      </View>

      {/* Quiz Content */}
      {renderQuizContent()}

      {/* Action Button */}
      {!showResult && canCheckAnswer() && (
        <TouchableOpacity style={styles.submitButton} onPress={checkAnswer}>
          <Text style={styles.submitButtonText}>Kiểm tra</Text>
        </TouchableOpacity>
      )}

      {/* Next Button */}
      {showResult && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentQuestion < vocabularies.length - 1 ? 'Tiếp theo →' : 'Xem kết quả'}
          </Text>
        </TouchableOpacity>
      )}
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
  typeSelector: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginBottom: 12,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  typeChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  difficultySelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 8,
  },
  difficultyLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  difficultyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  difficultyBtnActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  difficultyBtnText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  quizContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  optionCorrect: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  optionWrong: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  optionText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  optionTextDisabled: {
    color: '#ffffff',
  },
  resultContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultCorrect: {
    color: '#22c55e',
  },
  resultWrong: {
    color: '#ef4444',
  },
  sentenceBox: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  sentence: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  hint: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  matchingProgress: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  matchingProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  pairsContainer: {
    maxHeight: 300,
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    opacity: 1,
  },
  pairRowMatched: {
    opacity: 0.5,
  },
  pairCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  pairCardSelected: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  pairCardMatched: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  pairWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pairMeaning: {
    fontSize: 14,
    color: '#666',
  },
  pairArrow: {
    fontSize: 20,
    color: '#999',
    marginHorizontal: 8,
  },
  listeningContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  audioButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioIcon: {
    fontSize: 20,
  },
  audioButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  listeningWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginVertical: 16,
  },
  listeningHint: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#22c55e',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#0ea5e9',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
});
