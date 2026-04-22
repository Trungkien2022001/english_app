/**
 * Progress & Stats Screen
 * Thống kê học tập
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import BackHeader from '../../components/BackHeader';

interface Stats {
  totalWords: number;
  totalLearned: number;
  totalCorrect: number;
  streak: number;
  level: string;
  xp: number;
  todayStudyTime: number;
}

export default function ProgressScreen() {
  const [stats, setStats] = useState<Stats>({
    totalWords: 0,
    totalLearned: 0,
    totalCorrect: 0,
    streak: 0,
    level: 'A1',
    xp: 0,
    todayStudyTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { sqliteDB } = await import('../../lib/database/sqlite');
      await sqliteDB.init();
      const db = sqliteDB.getDatabase();

      // Get total words
      const totalWordsResult = await db.getFirstAsync<any>(
        'SELECT COUNT(*) as count FROM vocabularies'
      );

      // Get test sessions stats
      const sessionsResult = await db.getAllAsync<any>(
        'SELECT * FROM local_test_sessions WHERE status = "completed"'
      );

      let totalCorrect = 0;
      sessionsResult.forEach((session: any) => {
        totalCorrect += session.correct_answers || 0;
      });

      // Load from AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const xp = await AsyncStorage.getItem('xp');
      const streak = await AsyncStorage.getItem('streak');
      const level = await AsyncStorage.getItem('level');

      setStats({
        totalWords: totalWordsResult?.count || 0,
        totalLearned: sessionsResult.length || 0,
        totalCorrect,
        streak: streak ? parseInt(streak) : 0,
        level: level || 'A1',
        xp: xp ? parseInt(xp) : 0,
        todayStudyTime: 0, // TODO: Calculate from sessions
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = (currentLevel: string) => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(currentLevel);
    return {
      current: currentIndex + 1,
      total: levels.length,
      percentage: ((currentIndex + 1) / levels.length) * 100,
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Tiến độ" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      </SafeAreaView>
    );
  }

  const levelProgress = getLevelProgress(stats.level);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Tiến độ học tập" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Level Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cấp độ của bạn</Text>

          <View style={styles.levelCard}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Trình độ</Text>
              <Text style={styles.levelValue}>{stats.level}</Text>
            </View>

            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>
                Level {levelProgress.current} / {levelProgress.total}
              </Text>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${levelProgress.percentage}%` }]} />
            </View>

            <Text style={styles.levelHint}>
              {levelProgress.current === levelProgress.total
                ? 'Đạt trình độ cao nhất!'
                : `Còn ${levelProgress.total - levelProgress.current} level để đạt ${['C2', 'C1'][levelProgress.current % 2]}`}
            </Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thống kê tổng quan</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={styles.statValue}>{stats.totalWords}</Text>
              <Text style={styles.statLabel}>Tổng từ</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>{stats.totalLearned}</Text>
              <Text style={styles.statLabel}>Đã học</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>{stats.totalCorrect}</Text>
              <Text style={styles.statLabel}>Câu đúng</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Chuỗi ngày</Text>
            </View>
          </View>
        </View>

        {/* XP & Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Điểm kinh nghiệm</Text>

          <View style={styles.xpCard}>
            <View style={styles.xpInfo}>
              <Text style={styles.xpIcon}>⭐</Text>
              <View>
                <Text style={styles.xpValue}>{stats.xp}</Text>
                <Text style={styles.xpLabel}>Điểm XP</Text>
              </View>
            </View>

            <View style={styles.xpProgress}>
              <View style={styles.xpBar}>
                <View style={[styles.xpFill, { width: `${Math.min(stats.xp / 10, 100)}%` }]} />
              </View>
              <Text style={styles.xpText}>
                {stats.xp} / 100 XP (Level {Math.floor(stats.xp / 100) + 1})
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>📝</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Hoàn thành bài test</Text>
              <Text style={styles.activityTime}>
                {stats.totalLearned > 0 ? 'Hôm nay' : 'Chưa có hoạt động'}
              </Text>
            </View>
          </View>

          {stats.streak > 0 && (
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text>🔥</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Đang học {stats.streak} ngày liên tục
                </Text>
                <Text style={styles.activityTime}>Tiếp tục维持!</Text>
              </View>
            </View>
          )}
        </View>

        {/* Learning Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gợi ý học tập</Text>

          {stats.totalLearned < 10 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                Hãy làm ít nhất 10 bài test để bắt đầu track tiến độ
              </Text>
            </View>
          )}

          {levelProgress.current < 2 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>🎯</Text>
              <Text style={styles.tipText}>
                Tập trung vào từ vựng A1-A2 trước khi chuyển sang B1
              </Text>
            </View>
          )}

          {stats.totalCorrect < stats.totalLearned * 5 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>📈</Text>
              <Text style={styles.tipText}>
                Điểm số khá thấp, hãy ôn tập lại những từ đã học
              </Text>
            </View>
          )}
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
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  levelCard: {
    backgroundColor: '#f0f9ff',
    padding: 20,
    borderRadius: 12,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelLabel: {
    fontSize: 14,
    color: '#666',
  },
  levelValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  levelBadge: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
  },
  levelHint: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  xpCard: {
    backgroundColor: '#fef9c3',
    padding: 16,
    borderRadius: 12,
  },
  xpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  xpValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#92400e',
    marginRight: 8,
  },
  xpLabel: {
    fontSize: 14,
    color: '#78350f',
  },
  xpProgress: {
    gap: 8,
  },
  xpBar: {
    height: 12,
    backgroundColor: '#fde68a',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#92400e',
  },
  xpText: {
    fontSize: 13,
    color: '#78350f',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: '#666',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
