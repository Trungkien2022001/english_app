package entity

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Email        string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"type:varchar(255);not null" json:"-"`
	FullName     string    `gorm:"type:varchar(100)" json:"full_name"`
	AvatarURL    string    `gorm:"type:varchar(500)" json:"avatar_url"`
	Level        string    `gorm:"type:varchar(50);default:beginner" json:"level"`
	TotalXP      int       `gorm:"type:integer;default:0" json:"total_xp"`
	StreakDays   int       `gorm:"type:integer;default:0" json:"streak_days"`
	IsVerified   bool      `gorm:"type:boolean;default:false" json:"is_verified"`
	CreatedAt    time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt    time.Time `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

type UserRegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name"`
}

type UserLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UserResponse struct {
	ID         uuid.UUID `json:"id"`
	Email      string    `json:"email"`
	FullName   string    `json:"full_name"`
	AvatarURL  string    `json:"avatar_url"`
	Level      string    `json:"level"`
	TotalXP    int       `json:"total_xp"`
	StreakDays int       `json:"streak_days"`
	IsVerified bool      `json:"is_verified"`
	CreatedAt  time.Time `json:"created_at"`
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
	TokenType    string `json:"token_type"`
}
