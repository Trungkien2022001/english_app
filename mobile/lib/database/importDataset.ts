/**
 * Import JSON Dataset vào Database
 * Import file phrasalVerbsDataset.json vào SQLite
 */

import { sqliteDB } from './sqlite';
import phrasalVerbsDataset from '../data/phrasalVerbsDataset.json';

/**
 * Import phrasal verbs từ JSON dataset vào database
 * Tự động tạo exercise và questions
 */
export async function importPhrasalVerbsDataset(): Promise<void> {
  try {
    console.log('🌱 Importing phrasal verbs dataset...');

    const db = sqliteDB.getDatabase();

    // 1. Create exercise cho phrasal verbs
    const exerciseId = 'ex-pv-dataset-001';
    const exerciseExists = await db.getFirstAsync<any>(
      'SELECT id FROM exercises WHERE id = ?',
      [exerciseId]
    );

    if (!exerciseExists) {
      await db.runAsync(
        `INSERT INTO exercises (id, title, description, category_id, exercise_type_id, difficulty, question_count, pass_score, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [
          exerciseId,
          '25 Phrasal Verbs Thông Dụng',
          'Bài tập về 25 cụm động từ được dùng nhiều nhất trong tiếng Anh',
          'cat-phrasal-001',
          'ext-mc-av-001',
          'beginner',
          25,
          70,
          1,
        ]
      );
      console.log('✅ Created exercise');
    }

    // 2. Import vocabularies từ dataset
    const dataset = phrasalVerbsDataset as any;
    const phrasalVerbs = dataset.phrasal_verbs || [];

    let importedCount = 0;

    for (const pv of phrasalVerbs) {
      const vocabId = `voc-pv-ds-${importedCount + 1}`;

      // Check if vocabulary already exists
      const existing = await db.getFirstAsync<any>(
        'SELECT id FROM vocabularies WHERE word = ?',
        [pv.phrasal_verb]
      );

      if (existing) {
        console.log(`⏭️  Skipped: ${pv.phrasal_verb} (already exists)`);
        continue;
      }

      // Parse synonyms từ JSON array string nếu cần
      let synonymsStr = '[]';
      if (pv.synonyms && Array.isArray(pv.synonyms)) {
        synonymsStr = JSON.stringify(pv.synonyms);
      }

      // Parse collocations
      let collocationsStr = '[]';
      if (pv.collocations && Array.isArray(pv.collocations)) {
        collocationsStr = JSON.stringify(pv.collocations);
      }

      // Get examples
      const example1 = pv.examples?.[0];
      const example2 = pv.examples?.[1];

      // Insert vocabulary
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
          vocabId,
          pv.phrasal_verb,
          pv.type,
          pv.subtype || null,
          pv.meaning_vi,
          pv.meaning_en,
          pv.pronunciation || null,
          null, // audio_url
          'phrasal_verb',
          pv.grammar_pattern,
          pv.grammar_note || null,
          example1?.sentence || null,
          example1?.translation || null,
          example2?.sentence || null,
          example2?.translation || null,
          synonymsStr,
          '[]', // antonyms - dataset không có
          collocationsStr,
          pv.level,
          'beginner',
          'cat-phrasal-001',
          pv.topic,
          JSON.stringify([pv.topic, pv.is_common ? 'common' : 'uncommon']),
          pv.frequency,
          pv.is_common ? 1 : 0,
        ]
      );

      importedCount++;
      console.log(`✅ Imported ${importedCount}/${phrasalVerbs.length}: ${pv.phrasal_verb}`);
    }

    // 3. Generate questions cho exercise
    await generateQuestionsForExercise(db, exerciseId);

    console.log(`🎉 Successfully imported ${importedCount} phrasal verbs!`);
  } catch (error) {
    console.error('❌ Error importing phrasal verbs dataset:', error);
    throw error;
  }
}

/**
 * Generate questions và answers cho exercise từ vocabularies
 */
async function generateQuestionsForExercise(
  db: any,
  exerciseId: string
): Promise<void> {
  // Lấy tất cả phrasal verbs trong category
  const vocabularies = await db.getAllAsync<any>(
    `SELECT id, word, meaning_vi FROM vocabularies WHERE category_id = 'cat-phrasal-001'`
  );

  // Shuffle để random thứ tự
  const shuffled = vocabularies.sort(() => Math.random() - 0.5).slice(0, 25);

  for (let i = 0; i < shuffled.length; i++) {
    const vocab = shuffled[i];
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

    // Generate wrong answers
    const wrongAnswers = shuffled
      .filter((v) => v.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => v.meaning_vi);

    // Add correct answer và shuffle
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

  console.log(`✅ Generated ${shuffled.length} questions for exercise ${exerciseId}`);
}

/**
 * Gán function vào global để gọi từ React Native Debugger
 */
if (typeof global !== 'undefined') {
  (global as any).importPhrasalVerbsDataset = importPhrasalVerbsDataset;
}

export default importPhrasalVerbsDataset;
