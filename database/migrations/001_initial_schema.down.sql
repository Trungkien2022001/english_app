-- Rollback script for EnglishApp Database

-- Drop tables in reverse order due to foreign key constraints
DROP TABLE IF EXISTS test_answers CASCADE;
DROP TABLE IF EXISTS test_sessions CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS exercise_types CASCADE;
DROP TABLE IF EXISTS vocabularies CASCADE;
DROP TABLE IF EXISTS vocabulary_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Drop extension
DROP EXTENSION IF EXISTS "uuid-ossp";
