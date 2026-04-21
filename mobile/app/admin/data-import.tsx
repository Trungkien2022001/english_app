/**
 * Data Import Screen
 * Cho phép import vocabulary data từ JSON hoặc Excel
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';

interface VocabularyItem {
  word: string;
  word_type: string;
  subtype?: string;
  meaning_vi: string;
  meaning_en?: string;
  pronunciation?: string;
  part_of_speech?: string;
  grammar_pattern?: string;
  grammar_note?: string;
  example_sentence: string;
  example_translation: string;
  example_2_sentence?: string;
  example_2_translation?: string;
  synonyms?: string;
  antonyms?: string;
  collocations?: string;
  level?: string;
  difficulty_level?: string;
  category_id: string;
  topic?: string;
  tags?: string;
  frequency?: number;
  is_common?: number;
}

export default function DataImportScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<VocabularyItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Pick file (JSON or Excel)
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/json',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/comma-separated-values',
        ],
      });

      if (result.canceled) {
        return;
      }

      setSelectedFile(result);
      await processFile(result.assets[0]);
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Lỗi', 'Không thể chọn file. Vui lòng thử lại.');
    }
  };

  // Process file and extract data
  const processFile = async (file: any) => {
    setLoading(true);
    try {
      const fileData = await fetch(file.uri);
      const fileBlob = await fileData.blob();
      const fileText = await fileBlob.text();

      let parsedData: VocabularyItem[] = [];

      if (file.mimeType === 'application/json' || file.name.endsWith('.json')) {
        // Parse JSON
        const jsonData = JSON.parse(fileText);
        parsedData = jsonData.vocabularies || jsonData;
      } else if (
        file.mimeType?.includes('sheet') ||
        file.mimeType?.includes('excel') ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls') ||
        file.name.endsWith('.csv')
      ) {
        // Parse Excel/CSV
        const workbook = XLSX.read(fileText, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(worksheet) as VocabularyItem[];
      }

      // Validate data
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        throw new Error('File không có dữ liệu hợp lệ');
      }

      // Show preview (first 5 items)
      setPreviewData(parsedData.slice(0, 5));
      Alert.alert(
        'Thành công',
        `Đã load ${parsedData.length} từ vựng. Preview 5 từ đầu tiên.`
      );
    } catch (error: any) {
      console.error('Error processing file:', error);
      Alert.alert('Lỗi', `Không thể đọc file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Import data into database
  const importData = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn import dữ liệu này vào database? Dữ liệu hiện tại sẽ không bị thay đổi.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setLoading(true);
            try {
              // TODO: Implement actual import logic
              // const { sqliteDB } = require('../../lib/database/sqlite');
              // const db = sqliteDB.getDatabase();
              // ... insert data into database

              Alert.alert('Thành công', 'Đã import dữ liệu thành công!');
              setPreviewData([]);
              setSelectedFile(null);
            } catch (error: any) {
              console.error('Error importing data:', error);
              Alert.alert('Lỗi', `Không thể import: ${error.message}`);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Download template
  const downloadTemplate = () => {
    Alert.alert(
      'Download Template',
      'Chọn format template bạn muốn:',
      [
        {
          text: 'JSON Template',
          onPress: () => {
            // TODO: Implement download JSON template
            // Hoặc mở screen hiển thị template
            router.push('/admin/template-json');
          },
        },
        {
          text: 'Excel Template',
          onPress: () => {
            // TODO: Implement download Excel template
            router.push('/admin/template-excel');
          },
        },
        { text: 'Hủy', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Import Data</Text>
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Hướng dẫn</Text>
        <Text style={styles.instructionText}>
          1. Download template để biết format dữ liệu
        </Text>
        <Text style={styles.instructionText}>
          2. Điền dữ liệu vào file JSON hoặc Excel
        </Text>
        <Text style={styles.instructionText}>
          3. Chọn file để preview trước khi import
        </Text>
        <Text style={styles.instructionText}>
          4. Nhấn "Import Data" để lưu vào database
        </Text>
      </View>

      {/* Download Template Button */}
      <TouchableOpacity style={styles.templateButton} onPress={downloadTemplate}>
        <Text style={styles.templateButtonText}>📥 Download Template</Text>
      </TouchableOpacity>

      {/* Pick File Button */}
      <TouchableOpacity style={styles.pickButton} onPress={pickFile} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.pickButtonText}>📁 Chọn File (JSON/Excel)</Text>
        )}
      </TouchableOpacity>

      {/* Selected File Info */}
      {selectedFile && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 File đã chọn</Text>
          <Text style={styles.fileInfo}>Tên: {selectedFile.name}</Text>
          <Text style={styles.fileInfo}>Size: {(selectedFile.size / 1024).toFixed(2)} KB</Text>
        </View>
      )}

      {/* Preview Data */}
      {previewData.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👀 Preview (5 từ đầu)</Text>

          {previewData.map((item, index) => (
            <View key={index} style={styles.previewCard}>
              <Text style={styles.previewIndex}>#{index + 1}</Text>
              <Text style={styles.previewWord}>{item.word}</Text>
              <Text style={styles.previewMeaning}>{item.meaning_vi}</Text>
              {item.pronunciation && (
                <Text style={styles.previewIPA}>{item.pronunciation}</Text>
              )}
              <Text style={styles.previewExample}>{item.example_sentence}</Text>
            </View>
          ))}

          {/* Import Button */}
          <TouchableOpacity
            style={styles.importButton}
            onPress={importData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.importButtonText}>✅ Import Data</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
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
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  templateButton: {
    backgroundColor: '#8b5cf6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  templateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  pickButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  pickButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  previewCard: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  previewIndex: {
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  previewWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  previewMeaning: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  previewIPA: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  previewExample: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  importButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  importButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
