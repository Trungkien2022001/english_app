-- Sample Data for EnglishApp
-- Dữ liệu mẫu để test

-- ============================================
-- SAMPLE USERS
-- ============================================

-- User 1: Test user (password: password123 - hash from bcrypt)
INSERT INTO users (id, email, password_hash, full_name, level, total_xp, streak_days, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'test@example.com', '$2a$10$YourBcryptHashHere', 'Test User', 'intermediate', 500, 7, true);

-- ============================================
-- SAMPLE VOCABULARY
-- ============================================

-- TOEIC Vocabulary
INSERT INTO vocabularies (word, meaning, pronunciation, example_sentence, example_translation, part_of_speech, category_id, difficulty_level, tags) VALUES
('accommodate', 'chứa đựng, chứa được, cung cấp chỗ ở', '/əˈkɒmədeɪt/', 'This hotel can accommodate 200 guests.', 'Khách sạn này có thể chứa 200 khách.', 'verb', (SELECT id FROM vocabulary_categories WHERE slug = 'toeic'), 'intermediate', ARRAY['hotel', 'business']),
('agenda', 'chương trình nghị sự, nhật ký công việc', '/əˈdʒendə/', 'What is on the agenda for today?', 'Chương trình hôm nay có gì?', 'noun', (SELECT id FROM vocabulary_categories WHERE slug = 'toeic'), 'beginner', ARRAY['meeting', 'business']),
('allocate', 'phân bổ, phân chia', '/ˈæləkeɪt/', 'We need to allocate more resources.', 'Chúng ta cần phân bổ nhiều tài nguyên hơn.', 'verb', (SELECT id FROM vocabulary_categories WHERE slug = 'toeic'), 'intermediate', ARRAY['resource', 'management']),
('alternative', 'sự lựa chọn thay thế', '/ɔːlˈtɜːnətɪv/', 'We have no alternative but to wait.', 'Chúng ta không có lựa chọn nào khác ngoài việc chờ đợi.', 'noun', (SELECT id FROM vocabulary_categories WHERE slug = 'toeic'), 'beginner', ARRAY['option']),
('anticipate', 'đợi trước, đoán trước', '/ænˈtɪsɪpeɪt/', 'We anticipate a large crowd.', 'Chúng tôi đoán sẽ có đông người.', 'verb', (SELECT id FROM vocabulary_categories WHERE slug = 'toeic'), 'advanced', ARRAY['expect', 'predict']);

-- IELTS Vocabulary
INSERT INTO vocabularies (word, meaning, pronunciation, example_sentence, example_translation, part_of_speech, category_id, difficulty_level, tags) VALUES
('comprehensive', 'toàn diện, đầy đủ', '/ˌkɒmprɪˈhensɪv/', 'This is a comprehensive study.', 'Đây là một nghiên cứu toàn diện.', 'adjective', (SELECT id FROM vocabulary_categories WHERE slug = 'ielts'), 'advanced', ARRAY['academic']),
('demonstrate', 'chứng minh, diễn tả', '/ˈdemənstreɪt/', 'Can you demonstrate your theory?', 'Bạn có thể chứng minh lý thuyết của mình không?', 'verb', (SELECT id FROM vocabulary_categories WHERE slug = 'ielts'), 'intermediate', ARRAY['academic', 'proof']),
('enhance', 'tăng cường, cải thiện', '/ɪnˈhɑːns/', 'The course will enhance your skills.', 'Khóa học này sẽ cải thiện kỹ năng của bạn.', 'verb', (SELECT id FROM vocabulary_categories WHERE slug = 'ielts'), 'intermediate', ARRAY['improve']),
('fluctuate', 'dao động, lên xuống', '/ˈflʌktʃueɪt/', 'Prices fluctuate daily.', 'Giá cả dao động hàng ngày.', 'verb', (SELECT id FROM vocabulary_categories WHERE slug = 'ielts'), 'advanced', ARRAY['change', 'economics']),
('inevitable', 'không thể tránh khỏi', '/ɪnˈevɪtəbl/', 'Change is inevitable.', 'Sự thay đổi là không thể tránh khỏi.', 'adjective', (SELECT id FROM vocabulary_categories WHERE slug = 'ielts'), 'advanced', ARRAY['certain']);

-- Phrasal Verbs
INSERT INTO vocabularies (word, meaning, pronunciation, example_sentence, example_translation, part_of_speech, category_id, difficulty_level, tags) VALUES
('break down', 'hỏng, trục trặc hoặc phân tích', NULL, 'My car broke down on the highway.', 'Xe tôi bị hỏng trên đường cao tốc.', 'phrasal_verb', (SELECT id FROM vocabulary_categories WHERE slug = 'phrasal-verbs'), 'intermediate', ARRAY['car', 'problem']),
('call off', 'hoãn, hủy bỏ', NULL, 'The meeting was called off.', 'Cuộc họp đã bị hủy bỏ.', 'phrasal_verb', (SELECT id FROM vocabulary_categories WHERE slug = 'phrasal-verbs'), 'beginner', ARRAY['cancel', 'meeting']),
('carry out', 'tiến hành, thực hiện', NULL, 'The research was carried out carefully.', 'Nghiên cứu được thực hiện cẩn thận.', 'phrasal_verb', (SELECT id FROM vocabulary_categories WHERE slug = 'phrasal-verbs'), 'intermediate', ARRAY['execute', 'perform']),
('look forward to', 'mong chờ', NULL, 'I look forward to seeing you.', 'Tôi mong chờ được gặp bạn.', 'phrasal_verb', (SELECT id FROM vocabulary_categories WHERE slug = 'phrasal-verbs'), 'beginner', ARRAY['expect', 'anticipate']),
('put off', 'hoãn lại', NULL, 'Don''t put off until tomorrow.', 'Đừng hoãn đến ngày mai.', 'phrasal_verb', (SELECT id FROM vocabulary_categories WHERE slug = 'phrasal-verbs'), 'beginner', ARRAY['delay', 'postpone']);

-- Business English
INSERT INTO vocabularies (word, meaning, pronunciation, example_sentence, example_translation, part_of_speech, category_id, difficulty_level, tags) VALUES
('revenue', 'doanh thu', '/ˈrevənjuː/', 'Our revenue increased this quarter.', 'Doanh thu của chúng ta tăng trong quý này.', 'noun', (SELECT id FROM vocabulary_categories WHERE slug = 'business'), 'intermediate', ARRAY['finance', 'money']),
('merger', 'sự sáp nhập', '/ˈmɜːdʒə/', 'The merger was announced yesterday.', 'Thương vụ sáp nhập được công bố hôm qua.', 'noun', (SELECT id FROM vocabulary_categories WHERE slug = 'business'), 'advanced', ARRAY['acquisition']),
('stakeholder', 'cổ đông, bên liên quan', '/ˈsteɪkhəʊldə/', 'All stakeholders were informed.', 'Tất cả các bên liên quan đã được thông báo.', 'noun', (SELECT id FROM vocabulary_categories WHERE slug = 'business'), 'advanced', ARRAY['shareholder']),
('negotiate', 'đàm phán', '/nɪˈɡəʊʃieɪt/', 'We need to negotiate the contract.', 'Chúng ta cần đàm phán hợp đồng.', 'verb', (SELECT id FROM vocabulary_categories WHERE slug = 'business'), 'intermediate', ARRAY['agreement', 'deal']),
('quarterly', 'hàng quý', '/ˈkwɔːtəli/', 'We have quarterly meetings.', 'Chúng ta có cuộc họp hàng quý.', 'adjective', (SELECT id FROM vocabulary_categories WHERE slug = 'business'), 'beginner', ARRAY['frequency']);

-- Daily Conversation
INSERT INTO vocabularies (word, meaning, pronunciation, example_sentence, example_translation, part_of_speech, category_id, difficulty_level, tags) VALUES
('awkward', 'lúng túng, ngượng ngùng', '/ˈɔːkwəd/', 'It was an awkward situation.', 'Đó là một tình huống lúng túng.', 'adjective', (SELECT id FROM vocabulary_categories WHERE slug = 'daily'), 'intermediate', ARRAY['feeling']),
'chill out', 'thư giãn, bình tĩnh lại', NULL, 'Just chill out and relax.', 'Thôi thư giãn và bình tĩnh lại.', 'phrasal_verb', (SELECT id FROM vocabulary_categories WHERE slug = 'daily'), 'beginner', ARRAY['relax']),
('fancy', 'muốn, thích (đúng không)', '/ˈfænsi/', 'I fancy a pizza tonight.', 'Tôi muốn ăn pizza tối nay.', 'verb', (SELECT id FROM vocabulary_categories WHERE slug = 'daily'), 'beginner', ARRAY['want', 'desire']),
('gut feeling', 'linh cảm', NULL, 'Trust your gut feeling.', 'Hãy tin vào linh cảm của bạn.', 'noun', (SELECT id FROM vocabulary_categories WHERE slug = 'daily'), 'intermediate', ARRAY['intuition']),
('hang out', 'đi chơi với bạn bè', NULL, 'Let''s hang out this weekend.', 'Hãy đi chơi cuối tuần này nhé.', 'phrasal_verb', (SELECT id FROM vocabulary_categories WHERE slug = 'daily'), 'beginner', ARRAY['socialize']);

-- ============================================
-- SAMPLE EXERCISES
-- ============================================

-- Exercise 1: TOEIC Multiple Choice
INSERT INTO exercises (id, title, description, category_id, exercise_type_id, difficulty, question_count, pass_score, is_active, created_by) VALUES
('550e8400-ex01-0000-0000-000000000001',
 'TOEIC Vocabulary Test 1',
 'Kiểm tra từ vựng TOEIC cơ bản',
 (SELECT id FROM vocabulary_categories WHERE slug = 'toeic'),
 (SELECT id FROM exercise_types WHERE slug = 'multiple_choice_anh_viet'),
 'beginner',
 10,
 70,
 true,
 '550e8400-e29b-41d4-a716-446655440001');

-- Exercise 2: IELTS Fill in the Blank
INSERT INTO exercises (id, title, description, category_id, exercise_type_id, difficulty, question_count, pass_score, is_active, created_by) VALUES
('550e8400-ex02-0000-0000-000000000002',
 'IELTS Advanced Vocabulary',
 'Từ vựng IELTS nâng cao - điền từ',
 (SELECT id FROM vocabulary_categories WHERE slug = 'ielts'),
 (SELECT id FROM exercise_types WHERE slug = 'fill_blank'),
 'advanced',
 5,
 60,
 true,
 '550e8400-e29b-41d4-a716-446655440001');

-- Exercise 3: Phrasal Verbs
INSERT INTO exercises (id, title, description, category_id, exercise_type_id, difficulty, question_count, pass_score, is_active, created_by) VALUES
('550e8400-ex03-0000-0000-000000000003',
 'Common Phrasal Verbs',
 'Các phrasal verbs thông dụng',
 (SELECT id FROM vocabulary_categories WHERE slug = 'phrasal-verbs'),
 (SELECT id FROM exercise_types WHERE slug = 'multiple_choice_viet_anh'),
 'intermediate',
 5,
 70,
 true,
 '550e8400-e29b-41d4-a716-446655440001');

-- ============================================
-- SAMPLE QUESTIONS & ANSWERS
-- ============================================

-- Questions for Exercise 1 (TOEIC Multiple Choice Anh-Việt)
INSERT INTO questions (id, exercise_id, vocabulary_id, question_text, question_type, order_index) VALUES
('550e8400-q001-0000-0000-000000000001',
 '550e8400-ex01-0000-0000-000000000001',
 (SELECT id FROM vocabularies WHERE word = 'accommodate'),
 'Accommodate nghĩa là gì?',
 'multiple_choice',
 1);

INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES
('550e8400-q001-0000-0000-000000000001', 'Chứa đựng, chứa được', true, 1),
('550e8400-q001-0000-0000-000000000001', 'Phân chia, phân bổ', false, 2),
('550e8400-q001-0000-0000-000000000001', 'Tăng cường, cải thiện', false, 3),
('550e8400-q001-0000-0000-000000000001', 'Chờ đợi, mong chờ', false, 4);

INSERT INTO questions (id, exercise_id, vocabulary_id, question_text, question_type, order_index) VALUES
('550e8400-q002-0000-0000-000000000002',
 '550e8400-ex01-0000-0000-000000000001',
 (SELECT id FROM vocabularies WHERE word = 'agenda'),
 'Agenda nghĩa là gì?',
 'multiple_choice',
 2);

INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES
('550e8400-q002-0000-0000-000000000002', 'Chương trình nghị sự', true, 1),
('550e8400-q002-0000-0000-000000000002', 'Sự lựa chọn thay thế', false, 2),
('550e8400-q002-0000-0000-000000000002', 'Sự phân bổ', false, 3),
('550e8400-q002-0000-0000-000000000002', 'Doanh thu', false, 4);

-- Questions for Exercise 3 (Phrasal Verbs Việt-Anh)
INSERT INTO questions (id, exercise_id, vocabulary_id, question_text, question_type, order_index) VALUES
('550e8400-q003-0000-0000-000000000003',
 '550e8400-ex03-0000-0000-000000000003',
 (SELECT id FROM vocabularies WHERE word = 'call off'),
 '"Hủy bỏ" trong tiếng Anh là gì?',
 'multiple_choice',
 1);

INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES
('550e8400-q003-0000-0000-000000000003', 'Call off', true, 1),
('550e8400-q003-0000-0000-000000000003', 'Break down', false, 2),
('550e8400-q003-0000-0000-000000000003', 'Carry out', false, 3),
('550e8400-q003-0000-0000-000000000003', 'Look forward to', false, 4);

INSERT INTO questions (id, exercise_id, vocabulary_id, question_text, question_type, order_index) VALUES
('550e8400-q004-0000-0000-000000000004',
 '550e8400-ex03-0000-0000-000000000003',
 (SELECT id FROM vocabularies WHERE word = 'hang out'),
 '"Đi chơi với bạn bè" trong tiếng Anh là gì?',
 'multiple_choice',
 2);

INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES
('550e8400-q004-0000-0000-000000000004', 'Hang out', true, 1),
('550e8400-q004-0000-0000-000000000004', 'Put off', false, 2),
('550e8400-q004-0000-0000-000000000004', 'Chill out', false, 3),
('550e8400-q004-0000-0000-000000000004', 'Look forward to', false, 4);
