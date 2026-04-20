-- EnglishApp Database Schema
-- PostgreSQL 16+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(500),
    level VARCHAR(50) DEFAULT 'beginner',
    total_xp INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);

-- ============================================
-- 2. VOCABULARY CATEGORIES
-- ============================================
CREATE TABLE vocabulary_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON vocabulary_categories(slug);
CREATE INDEX idx_categories_active ON vocabulary_categories(is_active);

-- ============================================
-- 3. VOCABULARIES
-- ============================================
CREATE TABLE vocabularies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word VARCHAR(255) NOT NULL,
    meaning TEXT NOT NULL,
    pronunciation VARCHAR(255),
    example_sentence TEXT,
    example_translation TEXT,
    part_of_speech VARCHAR(50),
    category_id UUID REFERENCES vocabulary_categories(id) ON DELETE SET NULL,
    difficulty_level VARCHAR(20) DEFAULT 'intermediate',
    audio_url VARCHAR(500),
    image_url VARCHAR(500),
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vocab_category ON vocabularies(category_id);
CREATE INDEX idx_vocab_level ON vocabularies(difficulty_level);
CREATE INDEX idx_vocab_word ON vocabularies(word);

-- ============================================
-- 4. EXERCISE TYPES
-- ============================================
CREATE TABLE exercise_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default exercise types
INSERT INTO exercise_types (name, slug, description, config) VALUES
('Multiple Choice Anh-Việt', 'multiple_choice_anh_viet', 'Chọn nghĩa tiếng Việt từ tiếng Anh', '{"choices": 4, "allow_hint": true}'),
('Multiple Choice Việt-Anh', 'multiple_choice_viet_anh', 'Chọn từ tiếng Anh từ nghĩa tiếng Việt', '{"choices": 4, "allow_hint": true}'),
('Fill in the Blank', 'fill_blank', 'Điền từ còn thiếu vào câu', '{"allow_hint": true}');

-- ============================================
-- 5. EXERCISES
-- ============================================
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES vocabulary_categories(id) ON DELETE SET NULL,
    exercise_type_id UUID REFERENCES exercise_types(id),
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    time_limit_seconds INTEGER,
    question_count INTEGER DEFAULT 10,
    pass_score INTEGER DEFAULT 70,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercises_category ON exercises(category_id);
CREATE INDEX idx_exercises_type ON exercises(exercise_type_id);
CREATE INDEX idx_exercises_active ON exercises(is_active);

-- ============================================
-- 6. QUESTIONS
-- ============================================
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    vocabulary_id UUID REFERENCES vocabularies(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    hint_text TEXT,
    explanation TEXT,
    order_index INTEGER DEFAULT 0,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_exercise ON questions(exercise_id);
CREATE INDEX idx_questions_vocab ON questions(vocabulary_id);

-- ============================================
-- 7. ANSWERS
-- ============================================
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    explanation TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answers_question ON answers(question_id);
CREATE INDEX idx_answers_correct ON answers(question_id, is_correct);

-- ============================================
-- 8. TEST SESSIONS
-- ============================================
CREATE TABLE test_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    score DECIMAL(5,2),
    time_spent_seconds INTEGER,
    status VARCHAR(20) DEFAULT 'in_progress',
    device_info JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_sessions_user ON test_sessions(user_id);
CREATE INDEX idx_test_sessions_status ON test_sessions(status);
CREATE INDEX idx_test_sessions_user_status ON test_sessions(user_id, status);

-- ============================================
-- 9. TEST ANSWERS
-- ============================================
CREATE TABLE test_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id),
    answer_id UUID REFERENCES answers(id),
    is_correct BOOLEAN,
    is_hint_used BOOLEAN DEFAULT false,
    hint_type VARCHAR(50),
    time_spent_seconds INTEGER,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_answers_session ON test_answers(test_session_id);
CREATE INDEX idx_test_answers_question ON test_answers(question_id);

-- ============================================
-- 10. USER PROGRESS
-- ============================================
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES vocabulary_categories(id) ON DELETE CASCADE,
    total_words_learned INTEGER DEFAULT 0,
    tests_completed INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    last_practiced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_category ON user_progress(category_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vocabularies_updated_at BEFORE UPDATE ON vocabularies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default vocabulary categories
INSERT INTO vocabulary_categories (name, slug, description, icon, color, sort_order) VALUES
('TOEIC', 'toeic', 'Từ vựng TOEIC', '📚', '#3B82F6', 1),
('IELTS', 'ielts', 'Từ vựng IELTS', '🎯', '#10B981', 2),
('Phrasal Verbs', 'phrasal-verbs', 'Cụm động từ', '💬', '#F59E0B', 3),
('Business English', 'business', 'Tiếng Anh thương mại', '💼', '#8B5CF6', 4),
('Daily Conversation', 'daily', 'Tiếng Anh giao tiếp hàng ngày', '🗣️', '#EC4899', 5);
