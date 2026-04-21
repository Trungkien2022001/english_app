/**
 * Quick Import Screen
 * Screen nhanh để import dataset
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { importPhrasalVerbsDataset } from '../../lib/database/importDataset';
import { seedPhrasalVerbsMock } from '../../lib/database/seedPhrasalVerbsMock';
import { sqliteDB } from '../../lib/database/sqlite';
import BackHeader from '../../components/BackHeader';

export default function ImportDatasetScreen() {
  const [loading, setLoading] = useState(false);

  const handleImportMockData = async () => {
    setLoading(true);
    try {
      await sqliteDB.init();
      await seedPhrasalVerbsMock();
      Alert.alert('Thành công!', 'Đã import 10 phrasal verbs mock data thành công!');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportFullDataset = async () => {
    setLoading(true);
    try {
      await sqliteDB.init();
      await importPhrasalVerbsDataset();
      Alert.alert('Thành công!', 'Đã import 25 phrasal verbs từ dataset!');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title="Import Dataset" />

      <View style={styles.content}>
        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📚 Chọn Dataset để Import</Text>
          <Text style={styles.infoText}>
            Import phrasal verbs vào database để tạo bài học
          </Text>
        </View>

        {/* Mock Data Option */}
        <View style={styles.optionCard}>
          <Text style={styles.optionTitle}>Option 1: Mock Data (Nhanh)</Text>
          <Text style={styles.optionDescription}>
            10 phrasal verbs thông dụng nhất
          </Text>
          <View style={styles.details}>
            <Text style={styles.detailItem}>• 10 phrasal verbs</Text>
            <Text style={styles.detailItem}>• Tập trung: basic & common</Text>
            <Text style={styles.detailItem}>• Nhanh: ~2 giây</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.mockButton]}
            onPress={handleImportMockData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>📥 Import Mock Data (10 items)</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Full Dataset Option */}
        <View style={styles.optionCard}>
          <Text style={styles.optionTitle}>Option 2: Full Dataset (Đầy đủ)</Text>
          <Text style={styles.optionDescription}>
            25 phrasal verbs với đầy đủ thông tin
          </Text>
          <View style={styles.details}>
            <Text style={styles.detailItem}>• 25 phrasal verbs</Text>
            <Text style={styles.detailItem}>• Đầy đủ: meanings, examples, grammar</Text>
            <Text style={styles.detailItem}>• Nhiều chủ đề: business, daily, travel...</Text>
            <Text style={styles.detailItem}>• Tự động tạo 25 câu hỏi</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.fullButton]}
            onPress={handleImportFullDataset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>📥 Import Full Dataset (25 items)</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Warning */}
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Lưu ý</Text>
          <Text style={styles.warningText}>
            • Vocabulary đã tồn tại sẽ bị skip
          </Text>
          <Text style={styles.warningText}>
            • Exercise sẽ được tạo nếu chưa tồn tại
          </Text>
          <Text style={styles.warningText}>
            • Sau khi import, vào "Danh sách bài tập" để test
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  optionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  details: {
    marginBottom: 16,
  },
  detailItem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  mockButton: {
    backgroundColor: '#8b5cf6',
  },
  fullButton: {
    backgroundColor: '#22c55e',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningCard: {
    backgroundColor: '#fef9c3',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#78350f',
    marginBottom: 4,
  },
});
