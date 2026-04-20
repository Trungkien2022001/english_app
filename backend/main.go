package main

import (
	"log"
	"os"
	"time"

	"github.com/englishapp/backend/delivery/http/handler"
	"github.com/englishapp/backend/delivery/http/middleware"
	"github.com/englishapp/backend/infrastructure/config"
	"github.com/englishapp/backend/repository/postgres"
	"github.com/englishapp/backend/usecase"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize configuration
	cfg := config.NewConfig()

	// Initialize database
	db, err := postgres.InitDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize repositories
	userRepo := postgres.NewUserRepository(db)
	authRepo := postgres.NewAuthRepository(db)
	categoryRepo := postgres.NewCategoryRepository(db)
	exerciseRepo := postgres.NewExerciseRepository(db)
	questionRepo := postgres.NewQuestionRepository(db)
	answerRepo := postgres.NewAnswerRepository(db)
	testSessionRepo := postgres.NewTestSessionRepository(db)
	testAnswerRepo := postgres.NewTestAnswerRepository(db)
	userProgressRepo := postgres.NewUserProgressRepository(db)

	// Initialize usecases
	authUsecase := usecase.NewAuthUsecase(
		userRepo,
		authRepo,
		cfg.JWTSecret,
		time.Duration(cfg.JWTAccessDuration)*time.Minute,
		time.Duration(cfg.JWTRefreshDuration)*time.Hour,
	)

	exerciseUsecase := usecase.NewExerciseUsecase(
		categoryRepo,
		exerciseRepo,
		questionRepo,
		answerRepo,
		testSessionRepo,
		testAnswerRepo,
		userProgressRepo,
		userRepo,
	)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authUsecase)
	exerciseHandler := handler.NewExerciseHandler(exerciseUsecase)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(authUsecase)

	// Setup Gin
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// Apply CORS middleware
	router.Use(middleware.CORS())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Public routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
		}

		// Protected routes
		protected := v1.Group("")
		protected.Use(authMiddleware.Authenticate())
		{
			// Auth
			auth := protected.Group("/auth")
			{
				auth.GET("/me", authHandler.GetCurrentUser)
				auth.POST("/logout", authHandler.Logout)
			}

			// Exercises
			exercises := protected.Group("/exercises")
			{
				exercises.GET("", exerciseHandler.GetExercises)
				exercises.GET("/categories", exerciseHandler.GetCategories)
				exercises.GET("/:id", exerciseHandler.GetExerciseByID)
				exercises.POST("/start", exerciseHandler.StartTest)
				exercises.POST("/:session_id/answer", exerciseHandler.SubmitAnswer)
				exercises.POST("/complete", exerciseHandler.CompleteTest)
			}

			// Test History
			history := protected.Group("/history")
			{
				history.GET("/tests", exerciseHandler.GetTestHistory)
				history.GET("/tests/:id", exerciseHandler.GetTestDetail)
			}
		}
	}

	// Start server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s...", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
