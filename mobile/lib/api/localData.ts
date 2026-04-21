/**
 * Local Data Service
 * Fetch data from SQLite database instead of API
 */

import { sqliteDB } from '../database/sqlite';

export interface VocabularyCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface Vocabulary {
  id: string;
  word: string;
  word_type: string;                    // 'word', 'phrasal_verb', 'idiom', 'collocation'
  subtype: string;                      // 'V+To', 'V+V-ing', 'V+N', etc.
  meaning_vi: string;                   // Nghĩa tiếng Việt
  meaning_en: string;                   // Nghĩa tiếng Anh
  pronunciation: string;
  audio_url: string;
  part_of_speech: string;
  grammar_pattern: string;              // Cấu trúc ngữ pháp
  grammar_note: string;                 // Ghi chú ngữ pháp
  example_sentence: string;
  example_translation: string;
  example_2_sentence: string;
  example_2_translation: string;
  synonyms: string;                     // JSON array
  antonyms: string;                     // JSON array
  collocations: string;                 // JSON array
  level: string;                        // CEFR: A1-C2
  difficulty_level: string;
  category_id: string;
  topic: string;
  tags: string;
  image_url: string;
  frequency: number;                    // Tần suất 1-100
  is_common: number;
  review_count: number;
  correct_count: number;
  last_reviewed_at: string;
  next_review_at: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category_id: string;
  exercise_type_id: string;
  difficulty: string;
  question_count: number;
  pass_score: number;
  is_active: number;
  created_at: string;
}

export interface Question {
  id: string;
  exercise_id: string;
  vocabulary_id: string;
  question_text: string;
  question_type: string;
  hint_text: string;
  explanation: string;
  order_index: number;
}

export interface Answer {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: number;
  explanation: string;
  order_index: number;
}

export interface TestSession {
  id: string;
  exercise_id: string;
  started_at: string;
  completed_at: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  time_spent_seconds: number;
  status: string;
}

export interface TestAnswer {
  id: string;
  test_session_id: string;
  question_id: string;
  answer_id: string;
  is_correct: number;
  is_hint_used: number;
  hint_type: string;
  time_spent_seconds: number;
  answered_at: string;
}

class LocalDataService {
  /**
   * Get all categories
   */
  async getCategories(): Promise<VocabularyCategory[]> {
    const db = sqliteDB.getDatabase();
    const categories = await db.getAllAsync<any>(
      'SELECT * FROM vocabulary_categories WHERE is_active = 1 ORDER BY sort_order'
    );
    return categories as VocabularyCategory[];
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<VocabularyCategory | null> {
    const db = sqliteDB.getDatabase();
    const categories = await db.getAllAsync<any>(
      'SELECT * FROM vocabulary_categories WHERE slug = ? LIMIT 1',
      [slug]
    );
    return categories.length > 0 ? (categories[0] as VocabularyCategory) : null;
  }

  /**
   * Get vocabularies by category
   */
  async getVocabulariesByCategory(categoryId: string): Promise<Vocabulary[]> {
    const db = sqliteDB.getDatabase();
    const vocabularies = await db.getAllAsync<any>(
      'SELECT * FROM vocabularies WHERE category_id = ? ORDER BY created_at',
      [categoryId]
    );
    return vocabularies as Vocabulary[];
  }

  /**
   * Get all exercises with category info
   */
  async getExercises(): Promise<any[]> {
    const db = sqliteDB.getDatabase();
    const exercises = await db.getAllAsync<any>(`
      SELECT
        e.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        et.name as exercise_type,
        et.slug as exercise_type_slug
      FROM exercises e
      LEFT JOIN vocabulary_categories c ON e.category_id = c.id
      LEFT JOIN exercise_types et ON e.exercise_type_id = et.id
      WHERE e.is_active = 1
      ORDER BY c.sort_order, e.created_at
    `);
    return exercises;
  }

  /**
   * Get exercise by ID with questions
   */
  async getExerciseById(exerciseId: string): Promise<any | null> {
    const db = sqliteDB.getDatabase();
    const exercises = await db.getAllAsync<any>(`
      SELECT
        e.*,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        et.name as exercise_type,
        et.slug as exercise_type_slug
      FROM exercises e
      LEFT JOIN vocabulary_categories c ON e.category_id = c.id
      LEFT JOIN exercise_types et ON e.exercise_type_id = et.id
      WHERE e.id = ?
      LIMIT 1
    `, [exerciseId]);

    if (exercises.length === 0) return null;

    const exercise = exercises[0];

    // Get questions with answers
    const questions = await db.getAllAsync<any>(`
      SELECT
        q.*,
        v.word,
        v.word_type,
        v.subtype,
        v.meaning_vi,
        v.meaning_en,
        v.pronunciation,
        v.part_of_speech,
        v.grammar_pattern,
        v.grammar_note,
        v.example_sentence,
        v.example_translation,
        v.example_2_sentence,
        v.example_2_translation,
        v.synonyms,
        v.antonyms,
        v.collocations,
        v.level
      FROM questions q
      LEFT JOIN vocabularies v ON q.vocabulary_id = v.id
      WHERE q.exercise_id = ?
      ORDER BY q.order_index
    `, [exerciseId]);

    // Get answers for each question
    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const answers = await db.getAllAsync<any>(
          'SELECT * FROM answers WHERE question_id = ? ORDER BY order_index',
          [q.id]
        );
        return { ...q, answers };
      })
    );

    return {
      ...exercise,
      questions: questionsWithAnswers,
    };
  }

  /**
   * Create local test session
   */
  async createTestSession(exerciseId: string): Promise<any> {
    const db = sqliteDB.getDatabase();
    const sessionId = `session-${Date.now()}`;

    // Get exercise to get question count
    const exercise = await this.getExerciseById(exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    const questionCount = exercise.questions?.length || 0;

    await db.runAsync(
      `INSERT INTO local_test_sessions (id, exercise_id, started_at, total_questions, status, device_info, created_at)
       VALUES (?, ?, datetime('now'), ?, 'in_progress', '{}', datetime('now'))`,
      [sessionId, exerciseId, questionCount]
    );

    const sessions = await db.getAllAsync<any>(
      'SELECT * FROM local_test_sessions WHERE id = ?',
      [sessionId]
    );

    const dbSession = sessions[0];

    // Return TestSession in the format expected by the API
    return {
      id: dbSession.id,
      exercise: exercise,
      questions: exercise.questions || [],
      started_at: dbSession.started_at,
      status: dbSession.status,
      total_questions: dbSession.total_questions,
      correct_answers: 0,
      score: 0,
      time_spent_seconds: 0,
    };
  }

  /**
   * Submit answer
   */
  async submitAnswer(
    sessionId: string,
    questionId: string,
    answerId: string,
    isHintUsed: boolean = false
  ): Promise<any> {
    const db = sqliteDB.getDatabase();

    // Check if answer is correct
    const answers = await db.getAllAsync<any>(
      'SELECT * FROM answers WHERE id = ?',
      [answerId]
    );

    if (answers.length === 0) throw new Error('Answer not found');

    const answer = answers[0];
    const isCorrect = answer.is_correct === 1;

    // Insert test answer
    const testAnswerId = `ta-${Date.now()}`;
    await db.runAsync(
      `INSERT INTO local_test_answers (id, test_session_id, question_id, answer_id, is_correct, is_hint_used, answered_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        testAnswerId,
        sessionId,
        questionId,
        answerId,
        isCorrect ? 1 : 0,
        isHintUsed ? 1 : 0,
      ]
    );

    // Get correct answer for explanation
    const correctAnswers = await db.getAllAsync<any>(
      'SELECT * FROM answers WHERE question_id = ? AND is_correct = 1',
      [questionId]
    );

    return {
      result: {
        is_correct: isCorrect,
        explanation: answer.explanation || 'Đáp án ' + (isCorrect ? 'đúng' : 'sai'),
      },
      correct_answer: correctAnswers[0] || null,
    };
  }

  /**
   * Complete test session
   */
  async completeTestSession(sessionId: string): Promise<any> {
    const db = sqliteDB.getDatabase();

    // Calculate score
    const result = await db.getFirstAsync<any>(`
      SELECT
        COUNT(*) as total_answered,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_count
      FROM local_test_answers
      WHERE test_session_id = ?
    `, [sessionId]);

    const totalAnswered = result?.total_answered || 0;
    const correctCount = result?.correct_count || 0;
    const score = totalAnswered > 0 ? (correctCount / totalAnswered) * 100 : 0;

    // Update session
    await db.runAsync(
      `UPDATE local_test_sessions
       SET completed_at = datetime('now'),
           correct_answers = ?,
           score = ?,
           status = 'completed'
       WHERE id = ?`,
      [correctCount, score, sessionId]
    );

    // Get updated session
    const sessions = await db.getAllAsync<any>(
      'SELECT * FROM local_test_sessions WHERE id = ?',
      [sessionId]
    );

    return {
      session: sessions[0],
    };
  }

  /**
   * Get test history
   */
  async getTestHistory(): Promise<any[]> {
    const db = sqliteDB.getDatabase();
    const sessions = await db.getAllAsync<any>(`
      SELECT
        ts.*,
        e.title as exercise_title,
        e.category_id,
        c.name as category_name,
        et.slug as exercise_type
      FROM local_test_sessions ts
      LEFT JOIN exercises e ON ts.exercise_id = e.id
      LEFT JOIN vocabulary_categories c ON e.category_id = c.id
      LEFT JOIN exercise_types et ON e.exercise_type_id = et.id
      WHERE ts.status = 'completed'
      ORDER BY ts.completed_at DESC
    `);
    return sessions;
  }

  /**
   * Get test session detail
   */
  async getTestSessionDetail(sessionId: string): Promise<any> {
    const db = sqliteDB.getDatabase();

    const sessions = await db.getAllAsync<any>(`
      SELECT
        ts.*,
        e.title as exercise_title,
        c.name as category_name,
        et.slug as exercise_type
      FROM local_test_sessions ts
      LEFT JOIN exercises e ON ts.exercise_id = e.id
      LEFT JOIN vocabulary_categories c ON e.category_id = c.id
      LEFT JOIN exercise_types et ON e.exercise_type_id = et.id
      WHERE ts.id = ?
    `, [sessionId]);

    if (sessions.length === 0) return null;

    const session = sessions[0];

    // Get answers with question details
    const answers = await db.getAllAsync<any>(`
      SELECT
        ta.*,
        q.question_text,
        v.word,
        v.word_type,
        v.subtype,
        v.meaning_vi,
        v.meaning_en,
        v.pronunciation,
        v.part_of_speech,
        v.grammar_pattern,
        v.grammar_note,
        v.example_sentence,
        v.example_translation,
        v.synonyms,
        v.antonyms,
        v.collocations,
        v.level
      FROM local_test_answers ta
      LEFT JOIN questions q ON ta.question_id = q.id
      LEFT JOIN vocabularies v ON q.vocabulary_id = v.id
      WHERE ta.test_session_id = ?
      ORDER BY ta.answered_at
    `, [sessionId]);

    return {
      ...session,
      answers: answers.map((a) => ({
        ...a,
        is_correct: a.is_correct === 1,
        is_hint_used: a.is_hint_used === 1,
      })),
    };
  }
}

export const localDataService = new LocalDataService();
export default localDataService;
