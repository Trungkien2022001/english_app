/**
 * SQLite Database Service for EnglishApp Mobile
 * Quản lý local database với expo-sqlite
 */

import * as SQLite from 'expo-sqlite';
import { SCHEMA_V2 } from './schemaV2';
import {
  SEED_CATEGORIES,
  SEED_EXERCISE_TYPES,
  SEED_EXERCISES,
} from './seed';
import { EXAMPLE_VOCABULARIES_V2 } from './seedV2';
import CONFIG from '../config';

class SQLiteDatabase {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize database
   */
  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(CONFIG.DB_NAME);
      await this.createSchema();
      await this.seedData();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  /**
   * Create database schema
   */
  private async createSchema(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Execute entire schema at once
      await this.db.execAsync(SCHEMA_V2);
      console.log('Schema created successfully');
    } catch (error) {
      console.error('Schema creation error:', error);
      throw error;
    }
  }

  /**
   * Seed initial data
   */
  private async seedData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Check if data already exists
      const categories = await this.db.getAllAsync<any>(
        'SELECT COUNT(*) as count FROM vocabulary_categories'
      );

      if (categories[0]?.count > 0) {
        console.log('Data already seeded, skipping...');
        return;
      }

      console.log('Seeding data...');

      // Seed categories
      for (const category of SEED_CATEGORIES) {
        await this.db.runAsync(
          `INSERT INTO vocabulary_categories (id, name, slug, description, icon, color, sort_order, is_active, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            category.id,
            category.name,
            category.slug,
            category.description,
            category.icon,
            category.color,
            category.sort_order,
            category.is_active,
          ]
        );
      }

      // Seed exercise types
      for (const type of SEED_EXERCISE_TYPES) {
        await this.db.runAsync(
          `INSERT INTO exercise_types (id, name, slug, description, config, created_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`,
          [type.id, type.name, type.slug, type.description, type.config]
        );
      }

      // Seed vocabularies with enhanced schema
      for (const vocab of EXAMPLE_VOCABULARIES_V2) {
        await this.db.runAsync(
          `INSERT INTO vocabularies (
            id, word, word_type, subtype,
            meaning_vi, meaning_en,
            pronunciation, audio_url,
            part_of_speech, grammar_pattern, grammar_note,
            example_sentence, example_translation,
            example_2_sentence, example_2_translation,
            synonyms, antonyms, collocations,
            level, difficulty_level,
            category_id, topic, tags,
            image_url, frequency, is_common,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          [
            vocab.id,
            vocab.word,
            vocab.word_type,
            vocab.subtype,
            vocab.meaning_vi,
            vocab.meaning_en,
            vocab.pronunciation,
            vocab.audio_url || null,
            vocab.part_of_speech,
            vocab.grammar_pattern || null,
            vocab.grammar_note || null,
            vocab.example_sentence,
            vocab.example_translation,
            vocab.example_2_sentence || null,
            vocab.example_2_translation || null,
            vocab.synonyms,
            vocab.antonyms,
            vocab.collocations,
            vocab.level,
            vocab.difficulty_level,
            vocab.category_id,
            vocab.topic,
            vocab.tags,
            vocab.image_url || null,
            vocab.frequency,
            vocab.is_common,
          ]
        );
      }

      // Seed exercises
      for (const exercise of SEED_EXERCISES) {
        await this.db.runAsync(
          `INSERT INTO exercises (id, title, description, category_id, exercise_type_id, difficulty, question_count, pass_score, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          [
            exercise.id,
            exercise.title,
            exercise.description,
            exercise.category_id,
            exercise.exercise_type_id,
            exercise.difficulty,
            exercise.question_count,
            exercise.pass_score,
            exercise.is_active,
          ]
        );
      }

      // Generate questions and answers for exercises
      await this.generateQuestions();

      console.log('Data seeded successfully');
    } catch (error) {
      console.error('Seed data error:', error);
      throw error;
    }
  }

  /**
   * Generate questions and answers from vocabularies
   */
  private async generateQuestions(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const vocabularies = await this.db.getAllAsync<any>(
      'SELECT id, word, meaning_vi, category_id FROM vocabularies'
    );

    // Group vocabularies by category
    const vocabByCategory: Record<string, any[]> = {};
    vocabularies.forEach((vocab) => {
      if (!vocabByCategory[vocab.category_id]) {
        vocabByCategory[vocab.category_id] = [];
      }
      vocabByCategory[vocab.category_id].push(vocab);
    });

    // Generate questions for each exercise
    const exercises = await this.db.getAllAsync<any>(
      'SELECT id, category_id, question_count FROM exercises'
    );

    for (const exercise of exercises) {
      const categoryVocabs = vocabByCategory[exercise.category_id] || [];
      const questionCount = Math.min(exercise.question_count, categoryVocabs.length);

      for (let i = 0; i < questionCount; i++) {
        const vocab = categoryVocabs[i];
        const questionId = `q-${exercise.id}-${i + 1}`;

        // Create question (Multiple Choice Anh-Việt)
        await this.db.runAsync(
          `INSERT INTO questions (id, exercise_id, vocabulary_id, question_text, question_type, order_index, created_at)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            questionId,
            exercise.id,
            vocab.id,
            `"${vocab.word}" nghĩa là gì?`,
            'multiple_choice',
            i,
          ]
        );

        // Generate wrong answers
        const wrongAnswers = categoryVocabs
          .filter((v) => v.id !== vocab.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => v.meaning_vi);

        const allAnswers = [...wrongAnswers, vocab.meaning_vi].sort(
          () => Math.random() - 0.5
        );

        // Create answers
        for (let j = 0; j < allAnswers.length; j++) {
          const answerId = `a-${questionId}-${j + 1}`;
          const isCorrect = allAnswers[j] === vocab.meaning_vi ? 1 : 0;

          await this.db.runAsync(
            `INSERT INTO answers (id, question_id, answer_text, is_correct, order_index, created_at)
             VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            [answerId, questionId, allAnswers[j], isCorrect, j]
          );
        }
      }
    }
  }

  /**
   * Get database instance
   */
  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db) throw new Error('Database not initialized');
    return this.db;
  }

  /**
   * Close database
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }

  /**
   * Reset database - delete and recreate
   * Use this when schema changes
   */
  async resetDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Close current connection
      await this.close();

      // Delete database file
      await SQLite.deleteDatabaseAsync(CONFIG.DB_NAME);

      // Reinitialize
      await this.init();

      console.log('Database reset successfully');
    } catch (error) {
      console.error('Database reset error:', error);
      throw error;
    }
  }

  /**
   * Check if database needs update
   */
  async needsUpdate(): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Check if new columns exist
      const result = await this.db.getFirstAsync<any>(
        "SELECT COUNT(*) as count FROM pragma_table_info('vocabularies') WHERE name IN ('word_type', 'subtype', 'meaning_vi', 'meaning_en')"
      );

      // Should have 4 new columns
      return (result?.count || 0) < 4;
    } catch (error) {
      console.error('Check update error:', error);
      return true;
    }
  }
}

// Export singleton instance
export const sqliteDB = new SQLiteDatabase();
export default sqliteDB;
