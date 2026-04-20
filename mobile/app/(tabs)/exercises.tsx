import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { exerciseApi, Exercise } from '../../lib/api/exercise';

export default function ExercisesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryId = params.categoryId as string;

  useEffect(() => {
    loadExercises();
  }, [categoryId]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const data = await exerciseApi.getExercises({
        category_id: categoryId,
        limit: 50,
      });
      setExercises(data.exercises);
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExercise = (exercise: Exercise) => {
    router.push({
      pathname: '/exercises/[id]',
      params: { id: exercise.id },
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#22c55e';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Nâng cao';
      default:
        return difficulty;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách bài tập</Text>

      {exercises.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có bài tập nào</Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exerciseCard}
              onPress={() => handleStartExercise(item)}
            >
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.categoryIcon}>
                    {item.category.icon}
                  </Text>
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseTitle}>{item.title}</Text>
                    <Text style={styles.exerciseDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.exerciseMeta}>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(item.difficulty) },
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {getDifficultyLabel(item.difficulty)}
                  </Text>
                </View>

                <View style={styles.exerciseStats}>
                  <Text style={styles.statText}>
                    {item.question_count} câu hỏi
                  </Text>
                  {item.time_limit_seconds && (
                    <>
                      <Text style={styles.statSeparator}>•</Text>
                      <Text style={styles.statText}>
                        {Math.floor(item.time_limit_seconds / 60)} phút
                      </Text>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.exerciseFooter}>
                <Text style={styles.passScore}>
                  Điểm đạt: {item.pass_score}%
                </Text>
                <Text style={styles.startButton}>Bắt đầu →</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    marginBottom: 12,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  exerciseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  statSeparator: {
    marginHorizontal: 8,
    color: '#ccc',
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  passScore: {
    fontSize: 14,
    color: '#666',
  },
  startButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
});
