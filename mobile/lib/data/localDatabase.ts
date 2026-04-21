import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

const DB_NAME = 'englishapp.local.db';
const LOCAL_USER_EMAIL = 'nguyenkien2022001@gmail.com';
const LOCAL_USER_PASSWORD = '123123';
const LOCAL_USER_ID = 'usr_local_001';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initialized = false;

function randomId(prefix: string): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${suffix}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

async function setupSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      level TEXT DEFAULT 'beginner',
      total_xp INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS vocabulary_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS exercise_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category_id TEXT,
      exercise_type_id TEXT,
      difficulty TEXT DEFAULT 'intermediate',
      time_limit_seconds INTEGER,
      question_count INTEGER DEFAULT 10,
      pass_score INTEGER DEFAULT 70,
      is_active INTEGER DEFAULT 1,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      exercise_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      question_type TEXT NOT NULL,
      hint_text TEXT,
      explanation TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      answer_text TEXT NOT NULL,
      is_correct INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS test_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      started_at TEXT,
      completed_at TEXT,
      total_questions INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      score REAL,
      time_spent_seconds INTEGER,
      status TEXT DEFAULT 'in_progress',
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS test_answers (
      id TEXT PRIMARY KEY,
      test_session_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      answer_id TEXT,
      is_correct INTEGER,
      is_hint_used INTEGER DEFAULT 0,
      time_spent_seconds INTEGER,
      answered_at TEXT
    );
  `);
}

async function seedDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  const userCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM users;'
  );

  if ((userCount?.count ?? 0) > 0) {
    return;
  }

  const now = nowIso();

  await db.runAsync(
    `INSERT INTO users (id, email, password_hash, full_name, avatar_url, level, total_xp, streak_days, is_verified, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      LOCAL_USER_ID,
      LOCAL_USER_EMAIL,
      LOCAL_USER_PASSWORD,
      'Kien Nguyen',
      '',
      'beginner',
      120,
      3,
      1,
      now,
      now,
    ]
  );

  const categories = [
    {
      id: 'cat_toeic',
      name: 'TOEIC',
      slug: 'toeic',
      description: 'TOEIC vocabulary',
      icon: 'book',
      color: '#3B82F6',
      sort_order: 1,
    },
    {
      id: 'cat_daily',
      name: 'Daily Conversation',
      slug: 'daily',
      description: 'Daily English communication',
      icon: 'chat',
      color: '#EC4899',
      sort_order: 2,
    },
  ];

  for (const category of categories) {
    await db.runAsync(
      `INSERT INTO vocabulary_categories (id, name, slug, description, icon, color, sort_order, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?);`,
      [
        category.id,
        category.name,
        category.slug,
        category.description,
        category.icon,
        category.color,
        category.sort_order,
        now,
      ]
    );
  }

  await db.runAsync(
    `INSERT INTO exercise_types (id, name, slug, description) VALUES (?, ?, ?, ?);`,
    ['type_mc_en_vi', 'Multiple Choice Anh-Viet', 'multiple_choice_anh_viet', 'Choose the right meaning']
  );

  await db.runAsync(
    `INSERT INTO exercises (id, title, description, category_id, exercise_type_id, difficulty, time_limit_seconds, question_count, pass_score, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?);`,
    [
      'ex_toeic_01',
      'TOEIC Basic Words',
      'Practice common TOEIC words',
      'cat_toeic',
      'type_mc_en_vi',
      'beginner',
      600,
      2,
      70,
      now,
      now,
    ]
  );

  const questions = [
    {
      id: 'q_toeic_01',
      text: 'What is the meaning of "agenda"?',
      hint: 'Related to a meeting plan',
      explanation: 'Agenda means a list of items to discuss in a meeting.',
      order: 1,
      answers: [
        { id: 'a_toeic_01_1', text: 'A meeting schedule', correct: 1, order: 1 },
        { id: 'a_toeic_01_2', text: 'A finance report', correct: 0, order: 2 },
        { id: 'a_toeic_01_3', text: 'An office device', correct: 0, order: 3 },
        { id: 'a_toeic_01_4', text: 'A vacation plan', correct: 0, order: 4 },
      ],
    },
    {
      id: 'q_toeic_02',
      text: 'What is the meaning of "deadline"?',
      hint: 'Think about due date',
      explanation: 'Deadline is the latest time by which something must be finished.',
      order: 2,
      answers: [
        { id: 'a_toeic_02_1', text: 'A team member', correct: 0, order: 1 },
        { id: 'a_toeic_02_2', text: 'A final due date', correct: 1, order: 2 },
        { id: 'a_toeic_02_3', text: 'A company rule', correct: 0, order: 3 },
        { id: 'a_toeic_02_4', text: 'A type of contract', correct: 0, order: 4 },
      ],
    },
  ];

  for (const question of questions) {
    await db.runAsync(
      `INSERT INTO questions (id, exercise_id, question_text, question_type, hint_text, explanation, order_index, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        question.id,
        'ex_toeic_01',
        question.text,
        'multiple_choice',
        question.hint,
        question.explanation,
        question.order,
        now,
      ]
    );

    for (const answer of question.answers) {
      await db.runAsync(
        `INSERT INTO answers (id, question_id, answer_text, is_correct, order_index, created_at)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
          answer.id,
          question.id,
          answer.text,
          answer.correct,
          answer.order,
          now,
        ]
      );
    }
  }

  const completedSessionId = 'session_mock_completed_01';
  await db.runAsync(
    `INSERT INTO test_sessions (id, user_id, exercise_id, started_at, completed_at, total_questions, correct_answers, score, time_spent_seconds, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      completedSessionId,
      LOCAL_USER_ID,
      'ex_toeic_01',
      now,
      now,
      2,
      2,
      100,
      210,
      'completed',
      now,
    ]
  );

  await db.runAsync(
    `INSERT INTO test_answers (id, test_session_id, question_id, answer_id, is_correct, is_hint_used, time_spent_seconds, answered_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    ['ta_mock_01', completedSessionId, 'q_toeic_01', 'a_toeic_01_1', 1, 0, 80, now]
  );

  await db.runAsync(
    `INSERT INTO test_answers (id, test_session_id, question_id, answer_id, is_correct, is_hint_used, time_spent_seconds, answered_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    ['ta_mock_02', completedSessionId, 'q_toeic_02', 'a_toeic_02_2', 1, 0, 70, now]
  );
}

async function ensureInitialized(): Promise<SQLite.SQLiteDatabase> {
  const db = await getDb();
  if (!initialized) {
    await setupSchema(db);
    await seedDatabase(db);
    initialized = true;
  }
  return db;
}

async function mapUser(userId: string) {
  const db = await ensureInitialized();
  const user = await db.getFirstAsync<{
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    level: string;
    total_xp: number;
    streak_days: number;
    is_verified: number;
    created_at: string;
  }>('SELECT * FROM users WHERE id = ?;', [userId]);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    level: user.level,
    total_xp: user.total_xp,
    streak_days: user.streak_days,
    is_verified: Boolean(user.is_verified),
    created_at: user.created_at,
  };
}

function localTokenForUser(userId: string): string {
  return `local-access-${userId}`;
}

function localRefreshTokenForUser(userId: string): string {
  return `local-refresh-${userId}`;
}

function userIdFromToken(token: string | null): string | null {
  if (!token || !token.startsWith('local-access-')) {
    return null;
  }
  return token.replace('local-access-', '');
}

export const localDatabase = {
  async login(email: string, password: string) {
    const db = await ensureInitialized();
    const user = await db.getFirstAsync<{
      id: string;
      email: string;
      password_hash: string;
    }>('SELECT id, email, password_hash FROM users WHERE email = ?;', [email]);

    if (!user || user.password_hash !== password) {
      throw new Error('Email or password is incorrect');
    }

    const fullUser = await mapUser(user.id);

    return {
      tokens: {
        access_token: localTokenForUser(user.id),
        refresh_token: localRefreshTokenForUser(user.id),
        expires_in: 60 * 60 * 24,
        token_type: 'Bearer',
      },
      user: fullUser,
    };
  },

  async register(email: string, password: string, fullName?: string) {
    const db = await ensureInitialized();

    const exists = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM users WHERE email = ?;',
      [email]
    );

    if ((exists?.count ?? 0) > 0) {
      throw new Error('Email already exists');
    }

    const id = randomId('usr');
    const now = nowIso();

    await db.runAsync(
      `INSERT INTO users (id, email, password_hash, full_name, avatar_url, level, total_xp, streak_days, is_verified, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, email, password, fullName ?? '', '', 'beginner', 0, 0, 0, now, now]
    );

    return {
      message: 'Registered successfully',
    };
  },

  async getCurrentUser() {
    await ensureInitialized();
    const token = await SecureStore.getItemAsync('access_token');
    const userId = userIdFromToken(token);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    return mapUser(userId);
  },

  async logout() {
    return { message: 'Logged out' };
  },

  async getCategories() {
    const db = await ensureInitialized();
    const categories = await db.getAllAsync<{
      id: string;
      name: string;
      slug: string;
      description: string;
      icon: string;
      color: string;
      sort_order: number;
    }>(
      `SELECT id, name, slug, description, icon, color, sort_order
       FROM vocabulary_categories
       WHERE is_active = 1
       ORDER BY sort_order ASC;`
    );

    return { categories };
  },

  async getExercises(params?: { category_id?: string; page?: number; limit?: number }) {
    const db = await ensureInitialized();
    const where = params?.category_id ? 'AND e.category_id = ?' : '';
    const args = params?.category_id ? [params.category_id] : [];

    const rows = await db.getAllAsync<{
      id: string;
      title: string;
      description: string;
      difficulty: string;
      question_count: number;
      pass_score: number;
      time_limit_seconds: number | null;
      category_id: string;
      category_name: string;
      category_icon: string;
      category_color: string;
      exercise_type_id: string;
      exercise_type_name: string;
      exercise_type_slug: string;
    }>(
      `SELECT
         e.id,
         e.title,
         e.description,
         e.difficulty,
         e.question_count,
         e.pass_score,
         e.time_limit_seconds,
         c.id AS category_id,
         c.name AS category_name,
         c.icon AS category_icon,
         c.color AS category_color,
         t.id AS exercise_type_id,
         t.name AS exercise_type_name,
         t.slug AS exercise_type_slug
       FROM exercises e
       JOIN vocabulary_categories c ON c.id = e.category_id
       JOIN exercise_types t ON t.id = e.exercise_type_id
       WHERE e.is_active = 1 ${where}
       ORDER BY e.created_at DESC;`,
      args
    );

    const exercises = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      difficulty: row.difficulty,
      question_count: row.question_count,
      pass_score: row.pass_score,
      time_limit_seconds: row.time_limit_seconds ?? undefined,
      category: {
        id: row.category_id,
        name: row.category_name,
        icon: row.category_icon,
        color: row.category_color,
      },
      exercise_type: {
        id: row.exercise_type_id,
        name: row.exercise_type_name,
        slug: row.exercise_type_slug,
      },
    }));

    return {
      exercises,
      page: params?.page ?? 1,
      limit: params?.limit ?? exercises.length,
    };
  },

  async getExerciseById(id: string) {
    const result = await this.getExercises();
    const exercise = result.exercises.find((item) => item.id === id);
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return exercise;
  },

  async startTest(data: { exercise_id: string }) {
    const db = await ensureInitialized();
    const token = await SecureStore.getItemAsync('access_token');
    const userId = userIdFromToken(token) ?? LOCAL_USER_ID;

    const exercise = await this.getExerciseById(data.exercise_id);

    const questions = await db.getAllAsync<{
      id: string;
      question_text: string;
      question_type: string;
      hint_text: string;
      explanation: string;
      order_index: number;
    }>(
      `SELECT id, question_text, question_type, hint_text, explanation, order_index
       FROM questions
       WHERE exercise_id = ?
       ORDER BY order_index ASC;`,
      [data.exercise_id]
    );

    const sessionId = randomId('session');
    const now = nowIso();

    await db.runAsync(
      `INSERT INTO test_sessions (id, user_id, exercise_id, started_at, total_questions, correct_answers, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [sessionId, userId, data.exercise_id, now, questions.length, 0, 'in_progress', now]
    );

    const questionItems = [];
    for (const question of questions) {
      const answers = await db.getAllAsync<{
        id: string;
        answer_text: string;
        is_correct: number;
        order_index: number;
      }>(
        `SELECT id, answer_text, is_correct, order_index
         FROM answers
         WHERE question_id = ?
         ORDER BY order_index ASC;`,
        [question.id]
      );

      questionItems.push({
        ...question,
        answers: answers.map((answer) => ({
          id: answer.id,
          answer_text: answer.answer_text,
          is_correct: Boolean(answer.is_correct),
          order_index: answer.order_index,
        })),
      });
    }

    return {
      message: 'Test started',
      session: {
        id: sessionId,
        exercise,
        questions: questionItems,
        started_at: now,
        status: 'in_progress',
        total_questions: questions.length,
      },
    };
  },

  async submitAnswer(
    sessionId: string,
    data: { question_id: string; answer_id?: string; is_hint_used: boolean }
  ) {
    const db = await ensureInitialized();

    const selectedAnswer = data.answer_id
      ? await db.getFirstAsync<{
          id: string;
          answer_text: string;
          is_correct: number;
          question_id: string;
        }>(
          `SELECT id, answer_text, is_correct, question_id
           FROM answers
           WHERE id = ?;`,
          [data.answer_id]
        )
      : null;

    const correctAnswer = await db.getFirstAsync<{
      id: string;
      answer_text: string;
      is_correct: number;
      order_index: number;
    }>(
      `SELECT id, answer_text, is_correct, order_index
       FROM answers
       WHERE question_id = ? AND is_correct = 1
       LIMIT 1;`,
      [data.question_id]
    );

    if (!correctAnswer) {
      throw new Error('Correct answer not found');
    }

    const question = await db.getFirstAsync<{ explanation: string }>(
      'SELECT explanation FROM questions WHERE id = ?;',
      [data.question_id]
    );

    const isCorrect = Boolean(
      selectedAnswer && selectedAnswer.id === correctAnswer.id
    );

    await db.runAsync(
      `INSERT INTO test_answers (id, test_session_id, question_id, answer_id, is_correct, is_hint_used, time_spent_seconds, answered_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        randomId('ta'),
        sessionId,
        data.question_id,
        data.answer_id ?? null,
        isCorrect ? 1 : 0,
        data.is_hint_used ? 1 : 0,
        0,
        nowIso(),
      ]
    );

    return {
      message: 'Answer submitted',
      result: {
        test_answer: {
          question_id: data.question_id,
          answer_id: data.answer_id ?? null,
          is_correct: isCorrect,
          is_hint_used: data.is_hint_used,
        },
        is_correct: isCorrect,
        correct_answer: {
          id: correctAnswer.id,
          answer_text: correctAnswer.answer_text,
          is_correct: true,
          order_index: correctAnswer.order_index,
        },
        explanation: question?.explanation ?? 'No explanation',
      },
    };
  },

  async completeTest(data: { test_session_id: string }) {
    const db = await ensureInitialized();

    const session = await db.getFirstAsync<{
      id: string;
      exercise_id: string;
      started_at: string;
    }>('SELECT id, exercise_id, started_at FROM test_sessions WHERE id = ?;', [
      data.test_session_id,
    ]);

    if (!session) {
      throw new Error('Session not found');
    }

    const totalQuestions = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM questions WHERE exercise_id = ?;',
      [session.exercise_id]
    );

    const correctAnswers = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM test_answers WHERE test_session_id = ? AND is_correct = 1;',
      [data.test_session_id]
    );

    const total = totalQuestions?.count ?? 0;
    const correct = correctAnswers?.count ?? 0;
    const score = total === 0 ? 0 : (correct / total) * 100;

    const completedAt = nowIso();

    await db.runAsync(
      `UPDATE test_sessions
       SET completed_at = ?, total_questions = ?, correct_answers = ?, score = ?, status = ?
       WHERE id = ?;`,
      [completedAt, total, correct, score, 'completed', data.test_session_id]
    );

    return {
      message: 'Test completed',
      session: {
        id: data.test_session_id,
        total_questions: total,
        correct_answers: correct,
        score,
        completed_at: completedAt,
        status: 'completed',
      },
    };
  },

  async getHistoryTests() {
    const db = await ensureInitialized();

    const rows = await db.getAllAsync<{
      id: string;
      exercise_id: string;
      exercise_title: string;
      category_name: string;
      exercise_type: string;
      started_at: string;
      completed_at: string;
      total_questions: number;
      correct_answers: number;
      score: number;
      status: string;
    }>(
      `SELECT
         s.id,
         s.exercise_id,
         e.title AS exercise_title,
         c.name AS category_name,
         t.name AS exercise_type,
         s.started_at,
         s.completed_at,
         s.total_questions,
         s.correct_answers,
         s.score,
         s.status
       FROM test_sessions s
       JOIN exercises e ON e.id = s.exercise_id
       JOIN vocabulary_categories c ON c.id = e.category_id
       JOIN exercise_types t ON t.id = e.exercise_type_id
       WHERE s.status = 'completed'
       ORDER BY s.completed_at DESC;`
    );

    return {
      history: rows.map((row) => ({
        id: row.id,
        exercise: {
          id: row.exercise_id,
          title: row.exercise_title,
        },
        category_name: row.category_name,
        exercise_type: row.exercise_type,
        started_at: row.started_at,
        completed_at: row.completed_at,
        total_questions: row.total_questions,
        correct_answers: row.correct_answers,
        score: row.score,
        status: row.status,
      })),
    };
  },

  async getHistoryDetail(sessionId: string) {
    const db = await ensureInitialized();

    const session = await db.getFirstAsync<{
      id: string;
      exercise_title: string;
      category_name: string;
      exercise_type: string;
      started_at: string;
      completed_at: string;
      total_questions: number;
      correct_answers: number;
      score: number;
    }>(
      `SELECT
         s.id,
         e.title AS exercise_title,
         c.name AS category_name,
         t.name AS exercise_type,
         s.started_at,
         s.completed_at,
         s.total_questions,
         s.correct_answers,
         s.score
       FROM test_sessions s
       JOIN exercises e ON e.id = s.exercise_id
       JOIN vocabulary_categories c ON c.id = e.category_id
       JOIN exercise_types t ON t.id = e.exercise_type_id
       WHERE s.id = ?
       LIMIT 1;`,
      [sessionId]
    );

    if (!session) {
      throw new Error('History detail not found');
    }

    const answers = await db.getAllAsync<{
      question_text: string;
      answer_text: string;
      is_correct: number;
      is_hint_used: number;
      time_spent_seconds: number;
      answered_at: string;
    }>(
      `SELECT
         q.question_text,
         a.answer_text,
         ta.is_correct,
         ta.is_hint_used,
         ta.time_spent_seconds,
         ta.answered_at
       FROM test_answers ta
       JOIN questions q ON q.id = ta.question_id
       LEFT JOIN answers a ON a.id = ta.answer_id
       WHERE ta.test_session_id = ?
       ORDER BY ta.answered_at ASC;`,
      [sessionId]
    );

    return {
      id: session.id,
      exercise: {
        title: session.exercise_title,
      },
      category_name: session.category_name,
      exercise_type: session.exercise_type,
      started_at: session.started_at,
      completed_at: session.completed_at,
      total_questions: session.total_questions,
      correct_answers: session.correct_answers,
      score: session.score,
      answers: answers.map((item) => ({
        question: {
          question_text: item.question_text,
        },
        answer: {
          answer_text: item.answer_text ?? 'No answer',
          is_correct: Boolean(item.is_correct),
        },
        is_correct: Boolean(item.is_correct),
        is_hint_used: Boolean(item.is_hint_used),
        time_spent_seconds: item.time_spent_seconds ?? 0,
        answered_at: item.answered_at,
      })),
    };
  },
};

export { LOCAL_USER_EMAIL, LOCAL_USER_PASSWORD };
