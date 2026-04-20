package postgres

import (
	"context"

	"github.com/englishapp/backend/domain/entity"
	"github.com/englishapp/backend/domain/repository"
	"gorm.io/gorm"
)

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) repository.CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(ctx context.Context, category *entity.VocabularyCategory) error {
	return r.db.WithContext(ctx).Create(category).Error
}

func (r *categoryRepository) GetByID(ctx context.Context, id string) (*entity.VocabularyCategory, error) {
	var category entity.VocabularyCategory
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) GetBySlug(ctx context.Context, slug string) (*entity.VocabularyCategory, error) {
	var category entity.VocabularyCategory
	err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) Update(ctx context.Context, category *entity.VocabularyCategory) error {
	return r.db.WithContext(ctx).Save(category).Error
}

func (r *categoryRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&entity.VocabularyCategory{}, "id = ?", id).Error
}

func (r *categoryRepository) List(ctx context.Context, activeOnly bool) ([]*entity.VocabularyCategory, error) {
	var categories []*entity.VocabularyCategory
	query := r.db.WithContext(ctx).Order("sort_order ASC")

	if activeOnly {
		query = query.Where("is_active = ?", true)
	}

	err := query.Find(&categories).Error
	return categories, err
}
