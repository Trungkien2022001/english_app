package postgres

import (
	"context"

	"github.com/englishapp/backend/domain/entity"
	"github.com/englishapp/backend/domain/repository"
	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) repository.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *entity.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *userRepository) GetByID(ctx context.Context, id string) (*entity.User, error) {
	var user entity.User
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*entity.User, error) {
	var user entity.User
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Update(ctx context.Context, user *entity.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}

func (r *userRepository) UpdateXP(ctx context.Context, userID string, xp int) error {
	return r.db.WithContext(ctx).Model(&entity.User{}).
		Where("id = ?", userID).
		Update("total_xp", gorm.Expr("total_xp + ?", xp)).
		Error
}

func (r *userRepository) UpdateStreak(ctx context.Context, userID string, days int) error {
	return r.db.WithContext(ctx).Model(&entity.User{}).
		Where("id = ?", userID).
		Update("streak_days", days).
		Error
}

func (r *userRepository) List(ctx context.Context, limit, offset int) ([]*entity.User, error) {
	var users []*entity.User
	err := r.db.WithContext(ctx).Limit(limit).Offset(offset).Find(&users).Error
	return users, err
}
