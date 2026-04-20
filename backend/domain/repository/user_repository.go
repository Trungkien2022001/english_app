package repository

import (
	"context"

	"github.com/englishapp/backend/domain/entity"
)

type UserRepository interface {
	Create(ctx context.Context, user *entity.User) error
	GetByID(ctx context.Context, id string) (*entity.User, error)
	GetByEmail(ctx context.Context, email string) (*entity.User, error)
	Update(ctx context.Context, user *entity.User) error
	UpdateXP(ctx context.Context, userID string, xp int) error
	UpdateStreak(ctx context.Context, userID string, days int) error
	List(ctx context.Context, limit, offset int) ([]*entity.User, error)
}

type VocabularyRepository interface {
	Create(ctx context.Context, vocab *entity.Vocabulary) error
	GetByID(ctx context.Context, id string) (*entity.Vocabulary, error)
	Update(ctx context.Context, vocab *entity.Vocabulary) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, filter map[string]interface{}, limit, offset int) ([]*entity.Vocabulary, error)
	Search(ctx context.Context, query string, limit int) ([]*entity.Vocabulary, error)
	GetByCategory(ctx context.Context, categoryID string, limit, offset int) ([]*entity.Vocabulary, error)
}

type CategoryRepository interface {
	Create(ctx context.Context, category *entity.VocabularyCategory) error
	GetByID(ctx context.Context, id string) (*entity.VocabularyCategory, error)
	GetBySlug(ctx context.Context, slug string) (*entity.VocabularyCategory, error)
	Update(ctx context.Context, category *entity.VocabularyCategory) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, activeOnly bool) ([]*entity.VocabularyCategory, error)
}

type ExerciseRepository interface {
	Create(ctx context.Context, exercise *entity.Exercise) error
	GetByID(ctx context.Context, id string) (*entity.Exercise, error)
	Update(ctx context.Context, exercise *entity.Exercise) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, filter map[string]interface{}, limit, offset int) ([]*entity.Exercise, error)
	GetByCategory(ctx context.Context, categoryID string, limit, offset int) ([]*entity.Exercise, error)
}

type QuestionRepository interface {
	Create(ctx context.Context, question *entity.Question) error
	GetByID(ctx context.Context, id string) (*entity.Question, error)
	GetByExercise(ctx context.Context, exerciseID string) ([]*entity.Question, error)
	Update(ctx context.Context, question *entity.Question) error
	Delete(ctx context.Context, id string) error
	CreateBatch(ctx context.Context, questions []*entity.Question) error
}

type AnswerRepository interface {
	Create(ctx context.Context, answer *entity.Answer) error
	GetByID(ctx context.Context, id string) (*entity.Answer, error)
	GetByQuestion(ctx context.Context, questionID string) ([]*entity.Answer, error)
	Update(ctx context.Context, answer *entity.Answer) error
	Delete(ctx context.Context, id string) error
	CreateBatch(ctx context.Context, answers []*entity.Answer) error
}

type TestSessionRepository interface {
	Create(ctx context.Context, session *entity.TestSession) error
	GetByID(ctx context.Context, id string) (*entity.TestSession, error)
	GetUserActiveSession(ctx context.Context, userID, exerciseID string) (*entity.TestSession, error)
	Update(ctx context.Context, session *entity.TestSession) error
	ListByUser(ctx context.Context, userID string, limit, offset int) ([]*entity.TestSession, error)
	GetUserHistory(ctx context.Context, userID string, filter map[string]interface{}, limit, offset int) ([]*entity.TestSession, error)
}

type TestAnswerRepository interface {
	Create(ctx context.Context, answer *entity.TestAnswer) error
	GetByID(ctx context.Context, id string) (*entity.TestAnswer, error)
	GetBySession(ctx context.Context, sessionID string) ([]*entity.TestAnswer, error)
	Update(ctx context.Context, answer *entity.TestAnswer) error
	CreateBatch(ctx context.Context, answers []*entity.TestAnswer) error
}

type UserProgressRepository interface {
	Create(ctx context.Context, progress *entity.UserProgress) error
	GetByID(ctx context.Context, id string) (*entity.UserProgress, error)
	GetUserProgressByCategory(ctx context.Context, userID, categoryID string) (*entity.UserProgress, error)
	Update(ctx context.Context, progress *entity.UserProgress) error
	ListByUser(ctx context.Context, userID string) ([]*entity.UserProgress, error)
	Upsert(ctx context.Context, progress *entity.UserProgress) error
}

type AuthRepository interface {
	CreateAccessToken(ctx context.Context, userID string) (string, error)
	CreateRefreshToken(ctx context.Context, userID string) (string, error)
	ValidateToken(ctx context.Context, token string) (string, error)
	RefreshToken(ctx context.Context, refreshToken string) (string, string, error)
	RevokeToken(ctx context.Context, token string) error
}
