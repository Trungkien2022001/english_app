/**
 * Seed Mock Data cho Phrasal Verbs
 * Dùng để test với 10 phrasal verbs thông dụng
 */

import { sqliteDB } from './sqlite';
import { PHRASAL_VERBS_MOCK_DATA } from '../data/phrasalVerbsMockData';

/**
 * Seed mock phrasal verbs data vào database
 * Chạy function này để import mock data
 */
export async function seedPhrasalVerbsMock(): Promise<void> {
  try {
    console.log('🌱 Seeding phrasal verbs mock data...');

    const db = sqliteDB.getDatabase();

    // 1. Insert exercise
    await db.runAsync(
      `INSERT INTO exercises (id, title, description, category_id, exercise_type_id, difficulty, question_count, pass_score, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        PHRASAL_VERBS_MOCK_DATA.exercise.id,
        PHRASAL_VERBS_MOCK_DATA.exercise.title,
        PHRASAL_VERBS_MOCK_DATA.exercise.description,
        PHRASAL_VERBS_MOCK_DATA.exercise.category_id,
        PHRASAL_VERBS_MOCK_DATA.exercise.exercise_type_id,
        PHRASAL_VERBS_MOCK_DATA.exercise.difficulty,
        PHRASAL_VERBS_MOCK_DATA.exercise.question_count,
        PHRASAL_VERBS_MOCK_DATA.exercise.pass_score,
        PHRASAL_VERBS_MOCK_DATA.exercise.is_active,
      ]
    );

    console.log(`✅ Inserted exercise: ${PHRASAL_VERBS_MOCK_DATA.exercise.title}`);

    // 2. Insert vocabularies
    for (const vocab of PHRASAL_VERBS_MOCK_DATA.vocabularies) {
      await db.runAsync(
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
          vocab.audio_url,
          vocab.part_of_speech,
          vocab.grammar_pattern,
          vocab.grammar_note,
          vocab.example_sentence,
          vocab.example_translation,
          vocab.example_2_sentence,
          vocab.example_2_translation,
          vocab.synonyms,
          vocab.antonyms,
          vocab.collocations,
          vocab.level,
          vocab.difficulty_level,
          vocab.category_id,
          vocab.topic,
          vocab.tags,
          vocab.image_url,
          vocab.frequency,
          vocab.is_common,
        ]
      );
    }

    console.log(`✅ Inserted ${PHRASAL_VERBS_MOCK_DATA.vocabularies.length} vocabularies`);

    // 3. Generate questions and answers
    const exerciseId = PHRASAL_VERBS_MOCK_DATA.exercise.id;
    const allVocabs = PHRASAL_VERBS_MOCK_DATA.vocabularies;

    for (let i = 0; i < allVocabs.length; i++) {
      const vocab = allVocabs[i];
      const questionId = `q-${exerciseId}-${i + 1}`;

      // Create question
      await db.runAsync(
        `INSERT INTO questions (id, exercise_id, vocabulary_id, question_text, question_type, order_index, created_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          questionId,
          exerciseId,
          vocab.id,
          `"${vocab.word}" nghĩa là gì?`,
          'multiple_choice',
          i,
        ]
      );

      // Generate wrong answers (get 3 random wrong answers from other vocabs)
      const wrongAnswers = allVocabs
        .filter((v) => v.id !== vocab.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((v) => v.meaning_vi);

      // Add correct answer and shuffle
      const allAnswers = [...wrongAnswers, vocab.meaning_vi].sort(
        () => Math.random() - 0.5
      );

      // Create answers
      for (let j = 0; j < allAnswers.length; j++) {
        const answerId = `a-${questionId}-${j + 1}`;
        const isCorrect = allAnswers[j] === vocab.meaning_vi ? 1 : 0;

        await db.runAsync(
          `INSERT INTO answers (id, question_id, answer_text, is_correct, order_index, created_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`,
          [answerId, questionId, allAnswers[j], isCorrect, j]
        );
      }
    }

    console.log(`✅ Generated ${allVocabs.length} questions with answers`);
    console.log('🎉 Phrasal verbs mock data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding phrasal verbs mock data:', error);
    throw error;
  }
}

/**
 * Gán function vào global object để có thể gọi từ React Native Debugger
 * Usage: Trong app, gọi: window.seedPhrasalVerbsMock()
 */
if (typeof global !== 'undefined') {
  (global as any).seedPhrasalVerbsMock = seedPhrasalVerbsMock;
}

export default seedPhrasalVerbsMock;
