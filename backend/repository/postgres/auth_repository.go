package postgres

import (
	"context"

	"github.com/englishapp/backend/domain/repository"
	"gorm.io/gorm"
)

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) repository.AuthRepository {
	return &authRepository{db: db}
}

func (r *authRepository) CreateAccessToken(ctx context.Context, userID string) (string, error) {
	// Token creation is handled in usecase with JWT
	return "", nil
}

func (r *authRepository) CreateRefreshToken(ctx context.Context, userID string) (string, error) {
	// Token creation is handled in usecase with JWT
	return "", nil
}

func (r *authRepository) ValidateToken(ctx context.Context, token string) (string, error) {
	// Token validation is handled in usecase
	return "", nil
}

func (r *authRepository) RefreshToken(ctx context.Context, refreshToken string) (string, string, error) {
	// Token refresh is handled in usecase
	return "", "", nil
}

func (r *authRepository) RevokeToken(ctx context.Context, token string) error {
	// In a real implementation, you would add the token to a blacklist in Redis
	// For now, this is a no-op since JWT tokens are stateless
	return nil
}
