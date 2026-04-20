import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { exerciseApi, TestSession, Question } from '../../lib/api/exercise';

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const exerciseId = params.id as string;

  const [session, setSession] = useState<TestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    startTest();
  }, [exerciseId]);

  const startTest = async () => {
    setLoading(true);
    try {
      const data = await exerciseApi.startTest({
        exercise_id: exerciseId,
      });
      setSession(data.session);
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể bắt đầu bài test');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || selectedAnswer === null) return;

    setSubmitting(true);
    try {
      const result = await exerciseApi.submitAnswer(session.id, {
        question_id: session.questions[currentQuestionIndex].id,
        answer_id: selectedAnswer,
        is_hint_used: false,
      });

      Alert.alert(
        result.result.is_correct ? 'Chính xác! 🎉' : 'Sai rồi 😔',
        result.result.explanation,
        [
          {
            text: 'Tiếp tục',
            onPress: () => {
              if (currentQuestionIndex < session.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
              } else {
                completeTest();
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể gửi câu trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const completeTest = async () => {
    if (!session) return;

    setSubmitting(true);
    try {
      const result = await exerciseApi.completeTest({
        test_session_id: session.id,
      });

      setCompleted(true);
      Alert.alert(
        'Hoàn thành! 🎊',
        `Bạn đã trả lời đúng ${result.session.correct_answers}/${session.total_questions} câu hỏi`,
        [
          {
            text: 'Xem chi tiết',
            onPress: () => {
              router.push({
                pathname: '/history/[id]',
                params: { id: session.id },
              });
            },
          },
          {
            text: 'Về trang chủ',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể hoàn thành bài test');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !session) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: session.exercise.title,
          headerBackTitle: 'Quay lại',
        }}
      />

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Câu {currentQuestionIndex + 1}/{session.questions.length}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {currentQuestion.question_text}
        </Text>

        {currentQuestion.hint_text && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintIcon}>💡</Text>
            <Text style={styles.hintText}>{currentQuestion.hint_text}</Text>
          </View>
        )}

        {/* Answers */}
        <View style={styles.answersContainer}>
          {currentQuestion.answers.map((answer) => (
            <TouchableOpacity
              key={answer.id}
              style={[
                styles.answerOption,
                selectedAnswer === answer.id && styles.selectedAnswer,
              ]}
              onPress={() => setSelectedAnswer(answer.id)}
              disabled={submitting}
            >
              <View
                style={[
                  styles.answerRadio,
                  selectedAnswer === answer.id && styles.radioSelected,
                ]}
              >
                {selectedAnswer === answer.id && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <Text style={styles.answerText}>{answer.answer_text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedAnswer || submitting) && styles.buttonDisabled,
          ]}
          onPress={handleSubmitAnswer}
          disabled={!selectedAnswer || submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting
              ? 'Đang gửi...'
              : currentQuestionIndex < session.questions.length - 1
              ? 'Tiếp tục'
              : 'Hoàn thành'}
          </Text>
        </TouchableOpacity>
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
  progressContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  questionContainer: {
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    lineHeight: 28,
  },
  hintContainer: {
    flexDirection: 'row',
    backgroundColor: '#fef9c3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  hintIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: '#854d0e',
  },
  answersContainer: {
    marginBottom: 24,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedAnswer: {
    borderColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
  },
  answerRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#0ea5e9',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0ea5e9',
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
