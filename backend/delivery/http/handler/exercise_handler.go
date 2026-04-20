package handler

import (
	"net/http"
	"strconv"

	"github.com/englishapp/backend/domain/entity"
	"github.com/englishapp/backend/usecase"
	"github.com/gin-gonic/gin"
)

type ExerciseHandler struct {
	exerciseUsecase usecase.ExerciseUsecase
}

func NewExerciseHandler(exerciseUsecase usecase.ExerciseUsecase) *ExerciseHandler {
	return &ExerciseHandler{
		exerciseUsecase: exerciseUsecase,
	}
}

// GetCategories retrieves all vocabulary categories
func (h *ExerciseHandler) GetCategories(c *gin.Context) {
	categories, err := h.exerciseUsecase.GetCategories(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"categories": categories,
	})
}

// GetExercises retrieves exercises with optional filters
func (h *ExerciseHandler) GetExercises(c *gin.Context) {
	filter := make(map[string]interface{})

	if categoryID := c.Query("category_id"); categoryID != "" {
		filter["category_id"] = categoryID
	}
	if difficulty := c.Query("difficulty"); difficulty != "" {
		filter["difficulty"] = difficulty
	}
	if exerciseTypeID := c.Query("exercise_type_id"); exerciseTypeID != "" {
		filter["exercise_type_id"] = exerciseTypeID
	}

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset := (page - 1) * limit

	exercises, err := h.exerciseUsecase.GetExercises(c.Request.Context(), filter, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve exercises"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"exercises": exercises,
		"page":       page,
		"limit":      limit,
	})
}

// GetExerciseByID retrieves a single exercise by ID
func (h *ExerciseHandler) GetExerciseByID(c *gin.Context) {
	exerciseID := c.Param("id")
	if exerciseID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Exercise ID is required"})
		return
	}

	exercise, err := h.exerciseUsecase.GetExerciseByID(c.Request.Context(), exerciseID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exercise not found"})
		return
	}

	c.JSON(http.StatusOK, exercise)
}

// StartTest starts a new test session
func (h *ExerciseHandler) StartTest(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req entity.StartTestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Add device info from headers
	if req.DeviceInfo == nil {
		req.DeviceInfo = make(map[string]interface{})
	}
	req.DeviceInfo["user_agent"] = c.GetHeader("User-Agent")
	req.DeviceInfo["ip"] = c.ClientIP()

	session, err := h.exerciseUsecase.StartTest(c.Request.Context(), userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Test started successfully",
		"session":  session,
	})
}

// SubmitAnswer submits an answer for a question
func (h *ExerciseHandler) SubmitAnswer(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	sessionID := c.Param("session_id")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Session ID is required"})
		return
	}

	var req entity.SubmitAnswerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.exerciseUsecase.SubmitAnswer(c.Request.Context(), userID, sessionID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Answer submitted successfully",
		"result":  result,
	})
}

// CompleteTest completes a test session and calculates final score
func (h *ExerciseHandler) CompleteTest(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req entity.CompleteTestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	session, err := h.exerciseUsecase.CompleteTest(c.Request.Context(), userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Test completed successfully",
		"session": session,
	})
}

// GetTestHistory retrieves user's test history
func (h *ExerciseHandler) GetTestHistory(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset := (page - 1) * limit

	// Filters
	filter := make(map[string]interface{})
	if categoryID := c.Query("category_id"); categoryID != "" {
		filter["category_id"] = categoryID
	}

	history, err := h.exerciseUsecase.GetTestHistory(c.Request.Context(), userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve test history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"history": history,
		"page":    page,
		"limit":   limit,
		"total":   len(history),
	})
}

// GetTestDetail retrieves details of a specific test session
func (h *ExerciseHandler) GetTestDetail(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	sessionID := c.Param("id")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Session ID is required"})
		return
	}

	detail, err := h.exerciseUsecase.GetTestDetail(c.Request.Context(), userID, sessionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Test session not found"})
		return
	}

	c.JSON(http.StatusOK, detail)
}
