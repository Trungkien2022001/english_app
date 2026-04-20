package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/englishapp/backend/domain/entity"
	"github.com/englishapp/backend/domain/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase interface {
	Register(ctx context.Context, req *entity.UserRegisterRequest) (*entity.UserResponse, error)
	Login(ctx context.Context, req *entity.UserLoginRequest) (*entity.TokenResponse, *entity.UserResponse, error)
	RefreshToken(ctx context.Context, refreshToken string) (*entity.TokenResponse, error)
	Logout(ctx context.Context, token string) error
	ValidateToken(ctx context.Context, tokenString string) (string, error)
	GetCurrentUser(ctx context.Context, userID string) (*entity.UserResponse, error)
}

type authUsecase struct {
	userRepo       repository.UserRepository
	authRepo       repository.AuthRepository
	jwtSecret      string
	accessDuration time.Duration
	refreshDuration time.Duration
}

func NewAuthUsecase(
	userRepo repository.UserRepository,
	authRepo repository.AuthRepository,
	jwtSecret string,
	accessDuration, refreshDuration time.Duration,
) AuthUsecase {
	return &authUsecase{
		userRepo:        userRepo,
		authRepo:        authRepo,
		jwtSecret:       jwtSecret,
		accessDuration:  accessDuration,
		refreshDuration: refreshDuration,
	}
}

func (uc *authUsecase) Register(ctx context.Context, req *entity.UserRegisterRequest) (*entity.UserResponse, error) {
	// Check if user already exists
	existingUser, err := uc.userRepo.GetByEmail(ctx, req.Email)
	if err == nil && existingUser != nil {
		return nil, errors.New("user already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &entity.User{
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		FullName:     req.FullName,
		Level:        "beginner",
		TotalXP:      0,
		StreakDays:   0,
		IsVerified:   false,
	}

	if err := uc.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	return uc.toUserResponse(user), nil
}

func (uc *authUsecase) Login(ctx context.Context, req *entity.UserLoginRequest) (*entity.TokenResponse, *entity.UserResponse, error) {
	// Get user
	user, err := uc.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	// Generate tokens
	accessToken, err := uc.generateAccessToken(user.ID.String())
	if err != nil {
		return nil, nil, err
	}

	refreshToken, err := uc.generateRefreshToken(user.ID.String())
	if err != nil {
		return nil, nil, err
	}

	tokenResp := &entity.TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(uc.accessDuration.Seconds()),
		TokenType:    "Bearer",
	}

	return tokenResp, uc.toUserResponse(user), nil
}

func (uc *authUsecase) RefreshToken(ctx context.Context, refreshToken string) (*entity.TokenResponse, error) {
	userID, err := uc.authRepo.ValidateToken(ctx, refreshToken)
	if err != nil {
		return nil, errors.New("invalid refresh token")
	}

	accessToken, err := uc.generateAccessToken(userID)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := uc.generateRefreshToken(userID)
	if err != nil {
		return nil, err
	}

	return &entity.TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		ExpiresIn:    int64(uc.accessDuration.Seconds()),
		TokenType:    "Bearer",
	}, nil
}

func (uc *authUsecase) Logout(ctx context.Context, token string) error {
	return uc.authRepo.RevokeToken(ctx, token)
}

func (uc *authUsecase) ValidateToken(ctx context.Context, tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(uc.jwtSecret), nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["sub"].(string), nil
	}

	return "", errors.New("invalid token")
}

func (uc *authUsecase) GetCurrentUser(ctx context.Context, userID string) (*entity.UserResponse, error) {
	user, err := uc.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return uc.toUserResponse(user), nil
}

func (uc *authUsecase) generateAccessToken(userID string) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(uc.accessDuration).Unix(),
		"iat": time.Now().Unix(),
		"type": "access",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(uc.jwtSecret))
}

func (uc *authUsecase) generateRefreshToken(userID string) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(uc.refreshDuration).Unix(),
		"iat": time.Now().Unix(),
		"type": "refresh",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(uc.jwtSecret))
}

func (uc *authUsecase) toUserResponse(user *entity.User) *entity.UserResponse {
	return &entity.UserResponse{
		ID:         user.ID,
		Email:      user.Email,
		FullName:   user.FullName,
		AvatarURL:  user.AvatarURL,
		Level:      user.Level,
		TotalXP:    user.TotalXP,
		StreakDays: user.StreakDays,
		IsVerified: user.IsVerified,
		CreatedAt:  user.CreatedAt,
	}
}
