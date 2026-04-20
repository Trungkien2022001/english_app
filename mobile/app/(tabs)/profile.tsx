import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../lib/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const getLevelProgress = () => {
    if (!user) return 0;
    const xpPerLevel = 1000;
    return (user.total_xp % xpPerLevel) / xpPerLevel;
  };

  const getNextLevelXP = () => {
    if (!user) return 1000;
    const xpPerLevel = 1000;
    return xpPerLevel - (user.total_xp % xpPerLevel);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
        <Text style={styles.userName}>
          {user?.full_name || 'Người dùng'}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        {/* Level Badge */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{user?.level || 'Beginner'}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống kê</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.total_xp || 0}</Text>
            <Text style={styles.statLabel}>Tổng XP</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.streak_days || 0}</Text>
            <Text style={styles.statLabel}>Ngày streak</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {Math.floor((user?.total_xp || 0) / 1000) + 1}
            </Text>
            <Text style={styles.statLabel}>Level hiện tại</Text>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Tiến độ level</Text>
            <Text style={styles.progressText}>
              {getNextLevelXP()} XP còn lại
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${getLevelProgress() * 100}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày tham gia</Text>
            <Text style={styles.infoValue}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('vi-VN')
                : 'N/A'}
            </Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: user?.is_verified ? '#22c55e' : '#f59e0b' },
              ]}
            >
              <Text style={styles.statusText}>
                {user?.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cài đặt</Text>

        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>⚙️</Text>
          <Text style={styles.actionText}>Cài đặt tài khoản</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionText}>Thông báo</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>❓</Text>
          <Text style={styles.actionText}>Trợ giúp & Hỗ trợ</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.logoutCard]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>EnglishApp v1.0.0</Text>
        <Text style={styles.footerText}>Made with ❤️ for English learners</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0ea5e9',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarIcon: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  actionArrow: {
    fontSize: 20,
    color: '#0ea5e9',
  },
  logoutCard: {
    backgroundColor: '#fef2f2',
  },
  logoutIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});
