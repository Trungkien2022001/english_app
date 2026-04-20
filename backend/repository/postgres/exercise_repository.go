package postgres

import (
	"context"

	"github.com/englishapp/backend/domain/entity"
	"github.com/englishapp/backend/domain/repository"
	"gorm.io/gorm"
)

type exerciseRepository struct {
	db *gorm.DB
}

func NewExerciseRepository(db *gorm.DB) repository.ExerciseRepository {
	return &exerciseRepository{db: db}
}

func (r *exerciseRepository) Create(ctx context.Context, exercise *entity.Exercise) error {
	return r.db.WithContext(ctx).Create(exercise).Error
}

func (r *exerciseRepository) GetByID(ctx context.Context, id string) (*entity.Exercise, error) {
	var exercise entity.Exercise
	err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("ExerciseType").
		Where("id = ?", id).
		First(&exercise).Error
	if err != nil {
		return nil, err
	}
	return &exercise, nil
}

func (r *exerciseRepository) Update(ctx context.Context, exercise *entity.Exercise) error {
	return r.db.WithContext(ctx).Save(exercise).Error
}

func (r *exerciseRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&entity.Exercise{}, "id = ?", id).Error
}

func (r *exerciseRepository) List(ctx context.Context, filter map[string]interface{}, limit, offset int) ([]*entity.Exercise, error) {
	var exercises []*entity.Exercise
	query := r.db.WithContext(ctx).
		Preload("Category").
		Preload("ExerciseType")

	if categoryID, ok := filter["category_id"]; ok {
		query = query.Where("category_id = ?", categoryID)
	}
	if difficulty, ok := filter["difficulty"]; ok {
		query = query.Where("difficulty = ?", difficulty)
	}
	if exerciseTypeID, ok := filter["exercise_type_id"]; ok {
		query = query.Where("exercise_type_id = ?", exerciseTypeID)
	}

	err := query.Where("is_active = ?", true).
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&exercises).Error

	return exercises, err
}

func (r *exerciseRepository) GetByCategory(ctx context.Context, categoryID string, limit, offset int) ([]*entity.Exercise, error) {
	var exercises []*entity.Exercise
	err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("ExerciseType").
		Where("category_id = ? AND is_active = ?", categoryID, true).
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&exercises).Error
	return exercises, err
}

type questionRepository struct {
	db *gorm.DB
}

func NewQuestionRepository(db *gorm.DB) repository.QuestionRepository {
	return &questionRepository{db: db}
}

func (r *questionRepository) Create(ctx context.Context, question *entity.Question) error {
	return r.db.WithContext(ctx).Create(question).Error
}

func (r *questionRepository) GetByID(ctx context.Context, id string) (*entity.Question, error) {
	var question entity.Question
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&question).Error
	if err != nil {
		return nil, err
	}
	return &question, nil
}

func (r *questionRepository) GetByExercise(ctx context.Context, exerciseID string) ([]*entity.Question, error) {
	var questions []*entity.Question
	err := r.db.WithContext(ctx).
		Where("exercise_id = ?", exerciseID).
		Order("order_index ASC").
		Find(&questions).Error
	return questions, err
}

func (r *questionRepository) Update(ctx context.Context, question *entity.Question) error {
	return r.db.WithContext(ctx).Save(question).Error
}

func (r *questionRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&entity.Question{}, "id = ?", id).Error
}

func (r *questionRepository) CreateBatch(ctx context.Context, questions []*entity.Question) error {
	return r.db.WithContext(ctx).CreateInBatches(questions, 100).Error
}

type answerRepository struct {
	db *gorm.DB
}

func NewAnswerRepository(db *gorm.DB) repository.AnswerRepository {
	return &answerRepository{db: db}
}

func (r *answerRepository) Create(ctx context.Context, answer *entity.Answer) error {
	return r.db.WithContext(ctx).Create(answer).Error
}

func (r *answerRepository) GetByID(ctx context.Context, id string) (*entity.Answer, error) {
	var answer entity.Answer
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&answer).Error
	if err != nil {
		return nil, err
	}
	return &answer, nil
}

func (r *answerRepository) GetByQuestion(ctx context.Context, questionID string) ([]*entity.Answer, error) {
	var answers []*entity.Answer
	err := r.db.WithContext(ctx).
		Where("question_id = ?", questionID).
		Order("order_index ASC").
		Find(&answers).Error
	return answers, err
}

func (r *answerRepository) Update(ctx context.Context, answer *entity.Answer) error {
	return r.db.WithContext(ctx).Save(answer).Error
}

func (r *answerRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&entity.Answer{}, "id = ?", id).Error
}

func (r *answerRepository) CreateBatch(ctx context.Context, answers []*entity.Answer) error {
	return r.db.WithContext(ctx).CreateInBatches(answers, 100).Error
}
