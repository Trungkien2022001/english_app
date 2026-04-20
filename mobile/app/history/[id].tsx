import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

interface TestAnswer {
  question: {
    question_text: string;
    vocabulary?: {
      word: string;
      meaning: string;
      pronunciation: string;
      example_sentence: string;
    };
  };
  answer: {
    answer_text: string;
    is_correct: boolean;
  };
  is_correct: boolean;
  is_hint_used: boolean;
  time_spent_seconds: number;
  answered_at: string;
}

interface TestDetail {
  id: string;
  exercise: {
    title: string;
  };
  category_name: string;
  exercise_type: string;
  started_at: string;
  completed_at: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  answers: TestAnswer[];
}

export default function HistoryDetailScreen() {
  const params = useLocalSearchParams();
  const sessionId = params.id as string;

  const [detail, setDetail] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [sessionId]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/history/tests/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
          },
        }
      );
      const data = await response.json();
      setDetail(data);
    } catch (error) {
      console.error('Error loading detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = async () => {
    // This should be from SecureStore
    return '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !detail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Chi tiết bài test',
          headerBackTitle: 'Quay lại',
        }}
      />

      {/* Overview */}
      <View style={styles.overviewCard}>
        <Text style={styles.exerciseTitle}>{detail.exercise.title}</Text>

        <View style={styles.scoreOverview}>
          <View style={styles.scoreBig}>
            <Text style={styles.scoreBigText}>{Math.round(detail.score)}%</Text>
            <Text style={styles.scoreBigLabel}>Điểm số</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{detail.correct_answers}</Text>
              <Text style={styles.statLabel}>Câu đúng</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{detail.total_questions}</Text>
              <Text style={styles.statLabel}>Tổng câu</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(detail.score * detail.total_questions / 100)}
              </Text>
              <Text style={styles.statLabel}>Câu đạt</Text>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Danh mục:</Text>
          <Text style={styles.metaValue}>{detail.category_name}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Loại bài:</Text>
          <Text style={styles.metaValue}>{detail.exercise_type}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Thời gian:</Text>
          <Text style={styles.metaValue}>
            {formatDate(detail.completed_at)}
          </Text>
        </View>
      </View>

      {/* Answers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết câu trả lời</Text>

        {detail.answers.map((answer, index) => (
          <View
            key={index}
            style={[
              styles.answerCard,
              answer.is_correct ? styles.correctCard : styles.incorrectCard,
            ]}
          >
            <View style={styles.answerHeader}>
              <Text style={styles.questionNumber}>Câu {index + 1}</Text>
              <View
                style={[
                  styles.resultBadge,
                  {
                    backgroundColor: answer.is_correct ? '#22c55e' : '#ef4444',
                  },
                ]}
              >
                <Text style={styles.resultText}>
                  {answer.is_correct ? 'Đúng' : 'Sai'}
                </Text>
              </View>
            </View>

            <Text style={styles.questionText}>
              {answer.question.question_text}
            </Text>

            {answer.question.vocabulary && (
              <View style={styles.vocabularyInfo}>
                <Text style={styles.vocabWord}>
                  {answer.question.vocabulary.word}
                </Text>
                <Text style={styles.vocabMeaning}>
                  {answer.question.vocabulary.meaning}
                </Text>
                <Text style={styles.vocabPronunciation}>
                  {answer.question.vocabulary.pronunciation}
                </Text>
                {answer.question.vocabulary.example_sentence && (
                  <Text style={styles.vocabExample}>
                    Ví dụ: {answer.question.vocabulary.example_sentence}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.answerInfo}>
              <View style={styles.answerMeta}>
                <Text style={styles.answerLabel}>Đáp án của bạn:</Text>
                <Text
                  style={[
                    styles.answerValue,
                    answer.is_correct ? styles.correctText : styles.incorrectText,
                  ]}
                >
                  {answer.answer.answer_text}
                </Text>
              </View>

              {answer.is_hint_used && (
                <View style={styles.hintBadge}>
                  <Text style={styles.hintText}>💡 Đã dùng gợi ý</Text>
                </View>
              )}

              <Text style={styles.timeText}>
                ⏱️ {formatTime(answer.time_spent_seconds)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
  overviewCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  scoreOverview: {
    marginBottom: 20,
  },
  scoreBig: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreBigText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  scoreBigLabel: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  metaRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  metaValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  answerCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  correctCard: {
    borderColor: '#22c55e',
  },
  incorrectCard: {
    borderColor: '#ef4444',
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  vocabularyInfo: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  vocabWord: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  vocabMeaning: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  vocabPronunciation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  vocabExample: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  answerInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  answerMeta: {
    flex: 1,
  },
  answerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  answerValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  correctText: {
    color: '#22c55e',
  },
  incorrectText: {
    color: '#ef4444',
  },
  hintBadge: {
    backgroundColor: '#fef9c3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#854d0e',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
});
