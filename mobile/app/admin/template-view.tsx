/**
 * Template View Screen
 * Hiển thị template format cho user reference
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import vocabularyTemplate from '../../lib/data/templates/vocabulary_template.json';

export default function TemplateViewScreen() {
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    // TODO: Implement clipboard copy later
    Alert.alert('Thông báo', 'Template đã được hiển thị bên dưới!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>JSON Template</Text>
        </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Hướng dẫn</Text>
        <Text style={styles.text}>
          1. Copy template bên dưới
        </Text>
        <Text style={styles.text}>
          2. Tạo file JSON mới và paste template
        </Text>
        <Text style={styles.text}>
          3. Thêm vocabulary của bạn vào array "vocabularies"
        </Text>
        <Text style={styles.text}>
          4. Import file vào app
        </Text>
      </View>

      {/* Copy Button */}
      <TouchableOpacity
        style={styles.copyButton}
        onPress={() => copyToClipboard(JSON.stringify(vocabularyTemplate, null, 2))}
      >
        <Text style={styles.copyButtonText}>📋 Copy Template</Text>
      </TouchableOpacity>

      {/* Template Display */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📄 JSON Template</Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>
            {JSON.stringify(vocabularyTemplate, null, 2)}
          </Text>
        </View>
      </View>

      {/* Field Reference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Reference</Text>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldName}>word_type:</Text>
          <Text style={styles.fieldValues}>
            word, phrasal_verb, idiom, collocation
          </Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldName}>subtype:</Text>
          <Text style={styles.fieldValues}>
            V+To, V+V-ing, V+N, V+prep, V+adv
          </Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldName}>level:</Text>
          <Text style={styles.fieldValues}>
            A1, A2, B1, B2, C1, C2
          </Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldName}>category_id:</Text>
          <Text style={styles.fieldValues}>
            cat-toeic-001, cat-ielts-001, cat-phrasal-001, cat-business-001, cat-daily-001
          </Text>
        </View>
      </View>

      {/* Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Ví dụ</Text>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>Phrasal Verb</Text>
          <Text style={styles.exampleCode}>
            {'{\n  "word": "look forward to",\n  "word_type": "phrasal_verb",\n  "subtype": "V+To",\n  "meaning_vi": "mong chờ",\n  "example_sentence": "I look forward to seeing you",\n  "example_translation": "Tôi mong chờ gặp bạn"\n}'}
          </Text>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>Idiom</Text>
          <Text style={styles.exampleCode}>
            {'{\n  "word": "break a leg",\n  "word_type": "idiom",\n  "meaning_vi": "chúc may mắn",\n  "example_sentence": "Break a leg! You\'ll be great",\n  "example_translation": "Chúc may mắn!"\n}'}
          </Text>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#0ea5e9',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  copyButton: {
    backgroundColor: '#8b5cf6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  copyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  codeContainer: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 8,
  },
  codeText: {
    color: '#d4d4d4',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  fieldRow: {
    marginBottom: 12,
  },
  fieldName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  fieldValues: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  exampleCard: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  exampleCode: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
