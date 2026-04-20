package entity

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type VocabularyCategory struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Name        string    `gorm:"type:varchar(100);not null" json:"name"`
	Slug        string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"slug"`
	Description string    `gorm:"type:text" json:"description"`
	Icon        string    `gorm:"type:varchar(50)" json:"icon"`
	Color       string    `gorm:"type:varchar(20)" json:"color"`
	SortOrder   int       `gorm:"type:integer;default:0" json:"sort_order"`
	IsActive    bool      `gorm:"type:boolean;default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"created_at"`
}

type Vocabulary struct {
	ID                   uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Word                 string    `gorm:"type:varchar(255);not null" json:"word"`
	Meaning              string    `gorm:"type:text;not null" json:"meaning"`
	Pronunciation        string    `gorm:"type:varchar(255)" json:"pronunciation"`
	ExampleSentence      string    `gorm:"type:text" json:"example_sentence"`
	ExampleTranslation   string    `gorm:"type:text" json:"example_translation"`
	PartOfSpeech         string    `gorm:"type:varchar(50)" json:"part_of_speech"`
	CategoryID           uuid.UUID `gorm:"type:uuid" json:"category_id"`
	Category             *VocabularyCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	DifficultyLevel      string    `gorm:"type:varchar(20);default:intermediate" json:"difficulty_level"`
	AudioURL             string    `gorm:"type:varchar(500)" json:"audio_url"`
	ImageURL             string    `gorm:"type:varchar(500)" json:"image_url"`
	Tags                 pq.StringArray `gorm:"type:text[]" json:"tags"`
	CreatedAt            time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt            time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

type ExerciseType struct {
	ID          uuid.UUID          `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Name        string             `gorm:"type:varchar(100);not null" json:"name"`
	Slug        string             `gorm:"type:varchar(100);uniqueIndex;not null" json:"slug"`
	Description string             `gorm:"type:text" json:"description"`
	Config      map[string]interface{} `gorm:"type:jsonb;default:{}" json:"config"`
	CreatedAt   time.Time          `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"created_at"`
}

type Exercise struct {
	ID                uuid.UUID     `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Title             string        `gorm:"type:varchar(255);not null" json:"title"`
	Description       string        `gorm:"type:text" json:"description"`
	CategoryID        uuid.UUID     `gorm:"type:uuid" json:"category_id"`
	Category          *VocabularyCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	ExerciseTypeID    uuid.UUID     `gorm:"type:uuid" json:"exercise_type_id"`
	ExerciseType      *ExerciseType `gorm:"foreignKey:ExerciseTypeID" json:"exercise_type,omitempty"`
	Difficulty        string        `gorm:"type:varchar(20);default:intermediate" json:"difficulty"`
	TimeLimitSeconds  *int          `gorm:"type:integer" json:"time_limit_seconds"`
	QuestionCount     int           `gorm:"type:integer;default:10" json:"question_count"`
	PassScore         int           `gorm:"type:integer;default:70" json:"pass_score"`
	IsActive          bool          `gorm:"type:boolean;default:true" json:"is_active"`
	CreatedBy         uuid.UUID     `gorm:"type:uuid" json:"created_by"`
	CreatedAt         time.Time     `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt         time.Time     `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

type Question struct {
	ID             uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	ExerciseID     uuid.UUID `gorm:"type:uuid" json:"exercise_id"`
	Exercise       *Exercise `gorm:"foreignKey:ExerciseID" json:"exercise,omitempty"`
	VocabularyID   *uuid.UUID `gorm:"type:uuid" json:"vocabulary_id"`
	Vocabulary     *Vocabulary `gorm:"foreignKey:VocabularyID" json:"vocabulary,omitempty"`
	QuestionText   string    `gorm:"type:text;not null" json:"question_text"`
	QuestionType   string    `gorm:"type:varchar(50);not null" json:"question_type"`
	HintText       string    `gorm:"type:text" json:"hint_text"`
	Explanation    string    `gorm:"type:text" json:"explanation"`
	OrderIndex     int       `gorm:"type:integer;default:0" json:"order_index"`
	Config         map[string]interface{} `gorm:"type:jsonb;default:{}" json:"config"`
	CreatedAt      time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"created_at"`
}

type Answer struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	QuestionID  uuid.UUID `gorm:"type:uuid" json:"question_id"`
	Question    *Question `gorm:"foreignKey:QuestionID" json:"question,omitempty"`
	AnswerText  string    `gorm:"type:text;not null" json:"answer_text"`
	IsCorrect   bool      `gorm:"type:boolean;default:false" json:"is_correct"`
	Explanation string    `gorm:"type:text" json:"explanation"`
	OrderIndex  int       `gorm:"type:integer;default:0" json:"order_index"`
	CreatedAt   time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"created_at"`
}

type TestSession struct {
	ID                uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	UserID            uuid.UUID `gorm:"type:uuid" json:"user_id"`
	User              *User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	ExerciseID        uuid.UUID `gorm:"type:uuid" json:"exercise_id"`
	Exercise          *Exercise `gorm:"foreignKey:ExerciseID" json:"exercise,omitempty"`
	StartedAt         time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"started_at"`
	CompletedAt       *time.Time `gorm:"type:timestamp" json:"completed_at,omitempty"`
	TotalQuestions    int       `gorm:"type:integer;default:0" json:"total_questions"`
	CorrectAnswers    int       `gorm:"type:integer;default:0" json:"correct_answers"`
	Score             *float64  `gorm:"type:decimal(5,2)" json:"score,omitempty"`
	TimeSpentSeconds  *int      `gorm:"type:integer" json:"time_spent_seconds,omitempty"`
	Status            string    `gorm:"type:varchar(20);default:in_progress" json:"status"`
	DeviceInfo        map[string]interface{} `gorm:"type:jsonb;default:{}" json:"device_info"`
	CreatedAt         time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"created_at"`
}

type TestAnswer struct {
	ID              uuid.UUID    `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	TestSessionID   uuid.UUID    `gorm:"type:uuid" json:"test_session_id"`
	TestSession     *TestSession `gorm:"foreignKey:TestSessionID" json:"test_session,omitempty"`
	QuestionID      uuid.UUID    `gorm:"type:uuid" json:"question_id"`
	Question        *Question    `gorm:"foreignKey:QuestionID" json:"question,omitempty"`
	AnswerID        *uuid.UUID   `gorm:"type:uuid" json:"answer_id,omitempty"`
	Answer          *Answer      `gorm:"foreignKey:AnswerID" json:"answer,omitempty"`
	IsCorrect       *bool        `gorm:"type:boolean" json:"is_correct,omitempty"`
	IsHintUsed      bool         `gorm:"type:boolean;default:false" json:"is_hint_used"`
	HintType        *string      `gorm:"type:varchar(50)" json:"hint_type,omitempty"`
	TimeSpentSeconds *int        `gorm:"type:integer" json:"time_spent_seconds,omitempty"`
	AnsweredAt      time.Time    `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"answered_at"`
}

type UserProgress struct {
	ID                 uuid.UUID  `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	UserID             uuid.UUID  `gorm:"type:uuid" json:"user_id"`
	User               *User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	CategoryID         uuid.UUID  `gorm:"type:uuid" json:"category_id"`
	Category           *VocabularyCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	TotalWordsLearned  int        `gorm:"type:integer;default:0" json:"total_words_learned"`
	TestsCompleted     int        `gorm:"type:integer;default:0" json:"tests_completed"`
	AverageScore       *float64   `gorm:"type:decimal(5,2)" json:"average_score,omitempty"`
	LastPracticedAt    *time.Time `gorm:"type:timestamp" json:"last_practiced_at,omitempty"`
	CreatedAt          time.Time  `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt          time.Time  `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

// DTOs for API requests/responses
type StartTestRequest struct {
	ExerciseID  uuid.UUID              `json:"exercise_id" binding:"required"`
	DeviceInfo  map[string]interface{} `json:"device_info"`
}

type SubmitAnswerRequest struct {
	QuestionID         uuid.UUID `json:"question_id" binding:"required"`
	AnswerID           *uuid.UUID `json:"answer_id,omitempty"`
	AnswerText         *string    `json:"answer_text,omitempty"`
	IsHintUsed         bool       `json:"is_hint_used"`
	HintType           *string    `json:"hint_type,omitempty"`
	TimeSpentSeconds   *int       `json:"time_spent_seconds,omitempty"`
}

type CompleteTestRequest struct {
	TestSessionID uuid.UUID `json:"test_session_id" binding:"required"`
}

type TestSessionResponse struct {
	ID              uuid.UUID       `json:"id"`
	Exercise        *Exercise       `json:"exercise"`
	Questions       []QuestionWithAnswers `json:"questions"`
	StartedAt       time.Time       `json:"started_at"`
	Status          string          `json:"status"`
	TotalQuestions  int             `json:"total_questions"`
	CorrectAnswers  int             `json:"correct_answers,omitempty"`
	Score           *float64        `json:"score,omitempty"`
	TimeSpentSeconds *int           `json:"time_spent_seconds,omitempty"`
}

type QuestionWithAnswers struct {
	Question
	Answers []Answer `json:"answers"`
}

type TestHistoryResponse struct {
	TestSession
	CategoryName    string       `json:"category_name"`
	ExerciseTitle   string       `json:"exercise_title"`
	ExerciseType    string       `json:"exercise_type"`
	Answers         []TestAnswer `json:"answers"`
}

type SubmitAnswerResponse struct {
	TestAnswer   *TestAnswer `json:"test_answer"`
	IsCorrect    bool        `json:"is_correct"`
	CorrectAnswer *Answer    `json:"correct_answer"`
	Explanation  string      `json:"explanation"`
}
