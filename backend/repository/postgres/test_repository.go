package postgres

import (
	"context"

	"github.com/englishapp/backend/domain/entity"
	"github.com/englishapp/backend/domain/repository"
	"gorm.io/gorm"
)

type testSessionRepository struct {
	db *gorm.DB
}

func NewTestSessionRepository(db *gorm.DB) repository.TestSessionRepository {
	return &testSessionRepository{db: db}
}

func (r *testSessionRepository) Create(ctx context.Context, session *entity.TestSession) error {
	return r.db.WithContext(ctx).Create(session).Error
}

func (r *testSessionRepository) GetByID(ctx context.Context, id string) (*entity.TestSession, error) {
	var session entity.TestSession
	err := r.db.WithContext(ctx).
		Preload("Exercise").
		Preload("Exercise.Category").
		Preload("Exercise.ExerciseType").
		Preload("User").
		Where("id = ?", id).
		First(&session).Error
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *testSessionRepository) GetUserActiveSession(ctx context.Context, userID, exerciseID string) (*entity.TestSession, error) {
	var session entity.TestSession
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND exercise_id = ? AND status = ?", userID, exerciseID, "in_progress").
		First(&session).Error
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *testSessionRepository) Update(ctx context.Context, session *entity.TestSession) error {
	return r.db.WithContext(ctx).Save(session).Error
}

func (r *testSessionRepository) ListByUser(ctx context.Context, userID string, limit, offset int) ([]*entity.TestSession, error) {
	var sessions []*entity.TestSession
	err := r.db.WithContext(ctx).
		Preload("Exercise").
		Where("user_id = ?", userID).
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&sessions).Error
	return sessions, err
}

func (r *testSessionRepository) GetUserHistory(ctx context.Context, userID string, filter map[string]interface{}, limit, offset int) ([]*entity.TestSession, error) {
	var sessions []*entity.TestSession
	query := r.db.WithContext(ctx).
		Preload("Exercise").
		Preload("Exercise.Category").
		Preload("Exercise.ExerciseType").
		Where("user_id = ?", userID)

	if status, ok := filter["status"]; ok {
		query = query.Where("status = ?", status)
	}
	if categoryID, ok := filter["category_id"]; ok {
		query = query.Where("exercise_id IN (SELECT id FROM exercises WHERE category_id = ?)", categoryID)
	}

	err := query.
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&sessions).Error
	return sessions, err
}

type testAnswerRepository struct {
	db *gorm.DB
}

func NewTestAnswerRepository(db *gorm.DB) repository.TestAnswerRepository {
	return &testAnswerRepository{db: db}
}

func (r *testAnswerRepository) Create(ctx context.Context, answer *entity.TestAnswer) error {
	return r.db.WithContext(ctx).Create(answer).Error
}

func (r *testAnswerRepository) GetByID(ctx context.Context, id string) (*entity.TestAnswer, error) {
	var answer entity.TestAnswer
	err := r.db.WithContext(ctx).
		Preload("Question").
		Preload("Answer").
		Where("id = ?", id).
		First(&answer).Error
	if err != nil {
		return nil, err
	}
	return &answer, nil
}

func (r *testAnswerRepository) GetBySession(ctx context.Context, sessionID string) ([]*entity.TestAnswer, error) {
	var answers []*entity.TestAnswer
	err := r.db.WithContext(ctx).
		Preload("Question").
		Preload("Question.Vocabulary").
		Preload("Answer").
		Where("test_session_id = ?", sessionID).
		Order("answered_at ASC").
		Find(&answers).Error
	return answers, err
}

func (r *testAnswerRepository) Update(ctx context.Context, answer *entity.TestAnswer) error {
	return r.db.WithContext(ctx).Save(answer).Error
}

func (r *testAnswerRepository) CreateBatch(ctx context.Context, answers []*entity.TestAnswer) error {
	return r.db.WithContext(ctx).CreateInBatches(answers, 100).Error
}

type userProgressRepository struct {
	db *gorm.DB
}

func NewUserProgressRepository(db *gorm.DB) repository.UserProgressRepository {
	return &userProgressRepository{db: db}
}

func (r *userProgressRepository) Create(ctx context.Context, progress *entity.UserProgress) error {
	return r.db.WithContext(ctx).Create(progress).Error
}

func (r *userProgressRepository) GetByID(ctx context.Context, id string) (*entity.UserProgress, error) {
	var progress entity.UserProgress
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&progress).Error
	if err != nil {
		return nil, err
	}
	return &progress, nil
}

func (r *userProgressRepository) GetUserProgressByCategory(ctx context.Context, userID, categoryID string) (*entity.UserProgress, error) {
	var progress entity.UserProgress
	err := r.db.WithContext(ctx).
		Preload("User").
		Preload("Category").
		Where("user_id = ? AND category_id = ?", userID, categoryID).
		First(&progress).Error
	if err != nil {
		return nil, err
	}
	return &progress, nil
}

func (r *userProgressRepository) Update(ctx context.Context, progress *entity.UserProgress) error {
	return r.db.WithContext(ctx).Save(progress).Error
}

func (r *userProgressRepository) ListByUser(ctx context.Context, userID string) ([]*entity.UserProgress, error) {
	var progress []*entity.UserProgress
	err := r.db.WithContext(ctx).
		Preload("Category").
		Where("user_id = ?", userID).
		Order("last_practiced_at DESC").
		Find(&progress).Error
	return progress, err
}

func (r *userProgressRepository) Upsert(ctx context.Context, progress *entity.UserProgress) error {
	return r.db.WithContext(ctx).
		Where("user_id = ? AND category_id = ?", progress.UserID, progress.CategoryID).
		Assign(progress).
		FirstOrCreate(progress).Error
}
