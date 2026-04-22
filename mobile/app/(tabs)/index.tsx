/**
 * Home Screen - Daily Goals & Dashboard
 * Màn hình chính với mục tiêu hàng ngày
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
import { useRouter } from 'expo-router';
import BackHeader from '../../components/BackHeader';
import {
  DailyGoalsData,
  loadDailyGoals,
  formatGoalProgress,
  getCompletionPercentage,
  getStreakMessage,
} from '../../lib/utils/dailyGoals';

export default function HomeScreen() {
  const router = useRouter();
  const [goalsData, setGoalsData] = useState<DailyGoalsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await loadDailyGoals();
      setGoalsData(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalPress = (goalId: string) => {
    switch (goalId) {
      case 'learn-new':
        router.push('/learn/flashcards');
        break;
      case 'review-flashcards':
        router.push('/learn/review');
        break;
      case 'complete-quiz':
        router.push('/learn/quiz');
        break;
      case 'perfect-score':
        router.push('/learn/quiz');
        break;
    }
  };

  const renderGoalCard = (goal: any) => {
    const progress = (goal.current / goal.target) * 100;

    return (
      <TouchableOpacity
        key={goal.id}
        style={[styles.goalCard, goal.completed && styles.goalCardCompleted]}
        onPress={() => !goal.completed && handleGoalPress(goal.id)}
        disabled={goal.completed}
      >
        <View style={styles.goalHeader}>
          <Text style={styles.goalIcon}>{goal.icon}</Text>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </View>
          {goal.completed && (
            <Text style={styles.completedBadge}>✅</Text>
          )}
        </View>

        <View style={styles.goalProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
                goal.completed && styles.progressFillCompleted,
              ]}
            />
          </View>
          <Text style={styles.goalProgressText}>
            {formatGoalProgress(goal)}
          </Text>
        </View>

        <View style={styles.goalReward}>
          <Text style={styles.rewardText}>+{goal.xpReward} XP</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderWordOfDay = () => {
    return (
      <View style={styles.wordOfDayCard}>
        <Text style={styles.wordOfDayLabel}>📖 Từ vựng hôm nay</Text>
        <View style={styles.wordOfDayContent}>
          <Text style={styles.wordOfDayWord}>Serendipity</Text>
          <Text style={styles.wordOfDayPronunciation}>/ˌser.ənˈdɪp.ə.ti/</Text>
          <Text style={styles.wordOfDayMeaning}>
            Sự tình cờ may mắn; tìm thấy điều tốt đẹp một cách bất ngờ
          </Text>
          <Text style={styles.wordOfDayExample}>
            "We found this amazing restaurant by pure serendipity."
          </Text>
        </View>
        <TouchableOpacity
          style={styles.wordOfDayButton}
          onPress={() => Alert.alert('Sắp ra mắt!', 'Tính năng đang phát triển')}
        >
          <Text style={styles.wordOfDayButtonText}>Học từ này</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Trang chủ" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      </SafeAreaView>
    );
  }

  if (!goalsData) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Trang chủ" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không thể tải dữ liệu</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completionPercentage = getCompletionPercentage(goalsData);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Trang chủ" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Xin chào! 👋</Text>
          <Text style={styles.welcomeSubtext}>
            Hãy hoàn thành mục tiêu học tập hôm nay
          </Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakInfo}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View>
              <Text style={styles.streakValue}>{goalsData.streak} ngày</Text>
              <Text style={styles.streakMessage}>
                {getStreakMessage(goalsData.streak)}
              </Text>
            </View>
          </View>
          <View style={styles.streakXP}>
            <Text style={styles.streakXPValue}>+{goalsData.totalXP}</Text>
            <Text style={styles.streakXPLabel}>XP hôm nay</Text>
          </View>
        </View>

        {/* Daily Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mục tiêu hôm nay</Text>
            <Text style={styles.sectionPercentage}>{completionPercentage}%</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.mainProgressBar}>
              <View
                style={[
                  styles.mainProgressFill,
                  { width: `${completionPercentage}%` },
                ]}
              />
            </View>
          </View>

          {goalsData.goals.map((goal) => renderGoalCard(goal))}
        </View>

        {/* Word of Day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Từ vựng hôm nay</Text>
          {renderWordOfDay()}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bắt đầu nhanh</Text>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/learn/flashcards')}
            >
              <Text style={styles.quickActionIcon}>🎴</Text>
              <Text style={styles.quickActionText}>Flashcards</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/learn/quiz')}
            >
              <Text style={styles.quickActionIcon}>✅</Text>
              <Text style={styles.quickActionText}>Bài tập</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/learn/review')}
            >
              <Text style={styles.quickActionIcon}>🔄</Text>
              <Text style={styles.quickActionText}>Ôn tập</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/(tabs)/vocabulary')}
            >
              <Text style={styles.quickActionIcon}>📚</Text>
              <Text style={styles.quickActionText}>Từ vựng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  welcomeSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 15,
    color: '#666',
  },
  streakCard: {
    backgroundColor: '#fef3c7',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
  },
  streakMessage: {
    fontSize: 13,
    color: '#78350f',
  },
  streakXP: {
    alignItems: 'flex-end',
  },
  streakXPValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400e',
  },
  streakXPLabel: {
    fontSize: 12,
    color: '#78350f',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  sectionPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  progressCard: {
    marginBottom: 12,
  },
  mainProgressBar: {
    height: 10,
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
    overflow: 'hidden',
  },
  mainProgressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  goalCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  goalCardCompleted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 13,
    color: '#666',
  },
  completedBadge: {
    fontSize: 20,
  },
  goalProgress: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
  },
  progressFillCompleted: {
    backgroundColor: '#22c55e',
  },
  goalProgressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  goalReward: {
    alignItems: 'flex-end',
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  wordOfDayCard: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  wordOfDayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
    marginBottom: 12,
  },
  wordOfDayContent: {
    marginBottom: 12,
  },
  wordOfDayWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  wordOfDayPronunciation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  wordOfDayMeaning: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  wordOfDayExample: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  wordOfDayButton: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  wordOfDayButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
