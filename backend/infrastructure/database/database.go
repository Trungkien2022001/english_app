package database

import (
	"fmt"
	"log"
	"time"

	"github.com/englishapp/backend/infrastructure/config"
	"github.com/englishapp/backend/domain/entity"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.DBSSLMode,
	)

	logLevel := logger.Silent
	if cfg.APPEnv == "development" {
		logLevel = logger.Info
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Auto migrate schemas
	if err := autoMigrate(db); err != nil {
		return nil, fmt.Errorf("failed to auto migrate: %w", err)
	}

	DB = db
	log.Println("Database connected successfully")
	return db, nil
}

func autoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&entity.User{},
		&entity.VocabularyCategory{},
		&entity.Vocabulary{},
		&entity.ExerciseType{},
		&entity.Exercise{},
		&entity.Question{},
		&entity.Answer{},
		&entity.TestSession{},
		&entity.TestAnswer{},
		&entity.UserProgress{},
	)
}

func GetDB() *gorm.DB {
	return DB
}
