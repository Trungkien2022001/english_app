/**
 * Enhanced Vocabulary Schema for EnglishApp Mobile
 * Schema mở rộng với chi tiết hơn cho từ vựng
 */

export const SCHEMA_V2 = `
CREATE TABLE IF NOT EXISTS vocabulary_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vocabularies (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  word_type TEXT NOT NULL,
  subtype TEXT,
  meaning_vi TEXT NOT NULL,
  meaning_en TEXT,
  pronunciation TEXT,
  audio_url TEXT,
  part_of_speech TEXT,
  grammar_pattern TEXT,
  grammar_note TEXT,
  example_sentence TEXT,
  example_translation TEXT,
  example_2_sentence TEXT,
  example_2_translation TEXT,
  synonyms TEXT,
  antonyms TEXT,
  collocations TEXT,
  level TEXT,
  difficulty_level TEXT DEFAULT 'intermediate',
  category_id TEXT REFERENCES vocabulary_categories(id),
  topic TEXT,
  tags TEXT,
  image_url TEXT,
  review_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  last_reviewed_at TEXT,
  next_review_at TEXT,
  frequency INTEGER DEFAULT 0,
  is_common INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercise_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  config TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id TEXT REFERENCES vocabulary_categories(id),
  exercise_type_id TEXT REFERENCES exercise_types(id),
  difficulty TEXT DEFAULT 'intermediate',
  time_limit_seconds INTEGER,
  question_count INTEGER DEFAULT 10,
  pass_score INTEGER DEFAULT 70,
  is_active INTEGER DEFAULT 1,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  exercise_id TEXT REFERENCES exercises(id),
  vocabulary_id TEXT REFERENCES vocabularies(id),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  hint_text TEXT,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  config TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers (
  id TEXT PRIMARY KEY,
  question_id TEXT REFERENCES questions(id),
  answer_text TEXT NOT NULL,
  is_correct INTEGER DEFAULT 0,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS local_test_sessions (
  id TEXT PRIMARY KEY,
  exercise_id TEXT REFERENCES exercises(id),
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  score REAL,
  time_spent_seconds INTEGER,
  status TEXT DEFAULT 'in_progress',
  device_info TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS local_test_answers (
  id TEXT PRIMARY KEY,
  test_session_id TEXT REFERENCES local_test_sessions(id),
  question_id TEXT REFERENCES questions(id),
  answer_id TEXT REFERENCES answers(id),
  is_correct INTEGER,
  is_hint_used INTEGER DEFAULT 0,
  hint_type TEXT,
  time_spent_seconds INTEGER,
  answered_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vocab_category ON vocabularies(category_id);
CREATE INDEX IF NOT EXISTS idx_vocab_level ON vocabularies(level);
CREATE INDEX IF NOT EXISTS idx_vocab_type ON vocabularies(word_type);
CREATE INDEX IF NOT EXISTS idx_vocab_word ON vocabularies(word);
CREATE INDEX IF NOT EXISTS idx_questions_exercise ON questions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_exercise ON local_test_sessions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_test_answers_session ON local_test_answers(test_session_id);
`;

export default SCHEMA_V2;
