/**
 * Vocabulary List Screen
 * Danh sách từ vựng với filter và search
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackHeader from '../../components/BackHeader';

interface Vocabulary {
  id: string;
  word: string;
  word_type: string;
  meaning_vi: string;
  meaning_en: string;
  pronunciation: string;
  level: string;
  frequency: number;
  is_common: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

type FilterType = 'all' | 'word' | 'phrasal_verb' | 'idiom' | 'collocation';
type LevelFilter = 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export default function VocabularyListScreen() {
  const router = useRouter();
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterLevel, setFilterLevel] = useState<LevelFilter>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { localDataService } = await import('../../lib/api/localData');
      const { sqliteDB } = await import('../../lib/database/sqlite');

      await sqliteDB.init();

      // Load vocabularies
      const allVocabs = await localDataService.default.getVocabulariesByCategory('cat-phrasal-001');
      setVocabularies(allVocabs as Vocabulary[]);

      // Load categories
      const allCategories = await localDataService.default.getCategories();
      setCategories(allCategories as Category[]);

      // Load favorites
      loadFavorites();
    } catch (error) {
      console.error('Error loading vocabularies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const favs = await AsyncStorage.getItem('favorites');
      if (favs) {
        setFavorites(new Set(JSON.parse(favs)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (wordId: string) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(wordId)) {
      newFavs.delete(wordId);
    } else {
      newFavs.add(wordId);
    }

    setFavorites(newFavs);

    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('favorites', JSON.stringify([...newFavs]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const filteredVocabularies = vocabularies.filter((vocab) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchWord = vocab.word.toLowerCase().includes(query);
      const matchMeaning = vocab.meaning_vi.toLowerCase().includes(query);
      if (!matchWord && !matchMeaning) return false;
    }

    // Type filter
    if (filterType !== 'all' && vocab.word_type !== filterType) {
      return false;
    }

    // Level filter
    if (filterLevel !== 'all' && vocab.level !== filterLevel) {
      return false;
    }

    return true;
  });

  const getWordTypeIcon = (type: string) => {
    switch (type) {
      case 'phrasal_verb': return '💬';
      case 'idiom': return '🎭';
      case 'collocation': return '🔗';
      default: return '📝';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1':
      case 'A2':
        return '#22c55e';
      case 'B1':
      case 'B2':
        return '#f59e0b';
      case 'C1':
      case 'C2':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderVocabulary = ({ item }: { item: Vocabulary }) => {
    const isFav = favorites.has(item.id);

    return (
      <TouchableOpacity
        style={styles.vocabCard}
        onPress={() => router.push({ pathname: '/vocabulary/[id]', params: { id: item.id } })}
      >
        <View style={styles.vocabHeader}>
          <View style={styles.vocabInfo}>
            <View style={styles.vocabTypeIcon}>
              <Text style={styles.typeIcon}>{getWordTypeIcon(item.word_type)}</Text>
            </View>
            <View style={styles.vocabTitle}>
              <Text style={styles.word}>{item.word}</Text>
              {item.pronunciation && (
                <Text style={styles.pronunciation}>{item.pronunciation}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.favButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.meaning}>{item.meaning_vi}</Text>

        {item.meaning_en && (
          <Text style={styles.meaningEn} numberOfLines={1}>
            {item.meaning_en}
          </Text>
        )}

        <View style={styles.vocabMeta}>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
            <Text style={styles.levelText}>{item.level || 'N/A'}</Text>
          </View>

          {item.frequency >= 80 && (
            <View style={styles.commonBadge}>
              <Text style={styles.commonText}>Phổ biến</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (
    label: string,
    value: string,
    current: string,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[styles.filterChip, current === value && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, current === value && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Danh sách từ vựng" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Danh sách từ vựng" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm từ vựng, nghĩa..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Type Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Từ đơn', value: 'word' },
            { label: 'Cụm động từ', value: 'phrasal_verb' },
            { label: 'Thành ngữ', value: 'idiom' },
            { label: 'Từ đi kèm', value: 'collocation' },
          ]}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <View style={styles.filterItem}>
              {renderFilterChip(item.label, item.value, filterType, () => setFilterType(item.value as FilterType))}
            </View>
          )}
        />
      </View>

      {/* Level Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { label: 'Tất cả', value: 'all' },
            { label: 'A1', value: 'A1' },
            { label: 'A2', value: 'A2' },
            { label: 'B1', value: 'B1' },
            { label: 'B2', value: 'B2' },
            { label: 'C1', value: 'C1' },
            { label: 'C2', value: 'C2' },
          ]}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <View style={styles.filterItem}>
              {renderFilterChip(item.label, item.value, filterLevel, () => setFilterLevel(item.value as LevelFilter))}
            </View>
          )}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Hiển thị {filteredVocabularies.length} / {vocabularies.length} từ vựng
        </Text>
      </View>

      {/* Vocabulary List */}
      {filteredVocabularies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>
            {searchQuery ? 'Không tìm thấy từ vựng nào' : 'Chưa có từ vựng nào'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVocabularies}
          keyExtractor={(item) => item.id}
          renderItem={renderVocabulary}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#1a1a1a',
  },
  clearButton: {
    fontSize: 20,
    color: '#999',
    marginLeft: 8,
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  filterItem: {
    paddingHorizontal: 16,
    marginRight: 8,
  },
  filterChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  filterChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  vocabCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vocabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vocabInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vocabTypeIcon: {
    backgroundColor: '#f0f9ff',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeIcon: {
    fontSize: 18,
  },
  vocabTitle: {
    flex: 1,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  pronunciation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  favButton: {
    padding: 8,
  },
  favIcon: {
    fontSize: 20,
  },
  meaning: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  meaningEn: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  vocabMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  commonBadge: {
    backgroundColor: '#fef9c3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  commonText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
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
