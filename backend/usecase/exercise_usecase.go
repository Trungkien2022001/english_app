package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/englishapp/backend/domain/entity"
	"github.com/englishapp/backend/domain/repository"
	"github.com/google/uuid"
)

type ExerciseUsecase interface {
	StartTest(ctx context.Context, userID string, req *entity.StartTestRequest) (*entity.TestSessionResponse, error)
	SubmitAnswer(ctx context.Context, userID string, sessionID string, req *entity.SubmitAnswerRequest) (*entity.SubmitAnswerResponse, error)
	CompleteTest(ctx context.Context, userID string, req *entity.CompleteTestRequest) (*entity.TestSessionResponse, error)
	GetTestHistory(ctx context.Context, userID string, limit, offset int) ([]*entity.TestHistoryResponse, error)
	GetTestDetail(ctx context.Context, userID, sessionID string) (*entity.TestHistoryResponse, error)
	GetCategories(ctx context.Context) ([]*entity.VocabularyCategory, error)
	GetExercises(ctx context.Context, filter map[string]interface{}, limit, offset int) ([]*entity.Exercise, error)
	GetExerciseByID(ctx context.Context, exerciseID string) (*entity.Exercise, error)
}

type exerciseUsecase struct {
	categoryRepo      repository.CategoryRepository
	exerciseRepo      repository.ExerciseRepository
	questionRepo      repository.QuestionRepository
	answerRepo        repository.AnswerRepository
	testSessionRepo   repository.TestSessionRepository
	testAnswerRepo    repository.TestAnswerRepository
	userProgressRepo  repository.UserProgressRepository
	userRepo          repository.UserRepository
}

func NewExerciseUsecase(
	categoryRepo repository.CategoryRepository,
	exerciseRepo repository.ExerciseRepository,
	questionRepo repository.QuestionRepository,
	answerRepo repository.AnswerRepository,
	testSessionRepo repository.TestSessionRepository,
	testAnswerRepo repository.TestAnswerRepository,
	userProgressRepo repository.UserProgressRepository,
	userRepo repository.UserRepository,
) ExerciseUsecase {
	return &exerciseUsecase{
		categoryRepo:     categoryRepo,
		exerciseRepo:     exerciseRepo,
		questionRepo:     questionRepo,
		answerRepo:       answerRepo,
		testSessionRepo:  testSessionRepo,
		testAnswerRepo:   testAnswerRepo,
		userProgressRepo: userProgressRepo,
		userRepo:         userRepo,
	}
}

func (uc *exerciseUsecase) StartTest(ctx context.Context, userID string, req *entity.StartTestRequest) (*entity.TestSessionResponse, error) {
	// Get exercise
	exercise, err := uc.exerciseRepo.GetByID(ctx, req.ExerciseID.String())
	if err != nil {
		return nil, errors.New("exercise not found")
	}

	// Check if there's an active session
	activeSession, _ := uc.testSessionRepo.GetUserActiveSession(ctx, userID, req.ExerciseID.String())
	if activeSession != nil {
		return uc.buildTestSessionResponse(ctx, activeSession)
	}

	// Get questions for exercise
	questions, err := uc.questionRepo.GetByExercise(ctx, req.ExerciseID.String())
	if err != nil || len(questions) == 0 {
		return nil, errors.New("no questions found for this exercise")
	}

	// Create test session
	session := &entity.TestSession{
		UserID:         uuid.MustParse(userID),
		ExerciseID:     req.ExerciseID,
		TotalQuestions: len(questions),
		Status:         "in_progress",
		DeviceInfo:     req.DeviceInfo,
	}

	if err := uc.testSessionRepo.Create(ctx, session); err != nil {
		return nil, err
	}

	return uc.buildTestSessionResponse(ctx, session)
}

func (uc *exerciseUsecase) SubmitAnswer(ctx context.Context, userID string, sessionID string, req *entity.SubmitAnswerRequest) (*entity.SubmitAnswerResponse, error) {
	// Get session
	session, err := uc.testSessionRepo.GetByID(ctx, sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	// Validate session belongs to user
	if session.UserID.String() != userID {
		return nil, errors.New("unauthorized")
	}

	// Check session status
	if session.Status != "in_progress" {
		return nil, errors.New("session already completed")
	}

	// Get question and answers
	question, err := uc.questionRepo.GetByID(ctx, req.QuestionID.String())
	if err != nil {
		return nil, errors.New("question not found")
	}

	answers, err := uc.answerRepo.GetByQuestion(ctx, req.QuestionID.String())
	if err != nil {
		return nil, err
	}

	// Check if already answered
	existingAnswers, _ := uc.testAnswerRepo.GetBySession(ctx, sessionID)
	for _, existing := range existingAnswers {
		if existing.QuestionID.String() == req.QuestionID.String() {
			return nil, errors.New("question already answered")
		}
	}

	// Determine correct answer
	var isCorrect bool
	var correctAnswer *entity.Answer
	for _, ans := range answers {
		if ans.IsCorrect {
			correctAnswer = ans
			if req.AnswerID != nil && *req.AnswerID == ans.ID {
				isCorrect = true
			}
			break
		}
	}

	// Calculate score (with hint penalty)
	score := isCorrect
	if isCorrect && req.IsHintUsed {
		score = false // Or reduce score
	}

	// Create test answer
	testAnswer := &entity.TestAnswer{
		TestSessionID:    session.ID,
		QuestionID:       req.QuestionID,
		AnswerID:         req.AnswerID,
		IsCorrect:        &isCorrect,
		IsHintUsed:       req.IsHintUsed,
		HintType:         req.HintType,
		TimeSpentSeconds: req.TimeSpentSeconds,
	}

	if err := uc.testAnswerRepo.Create(ctx, testAnswer); err != nil {
		return nil, err
	}

	// Update session progress
	allAnswers, _ := uc.testAnswerRepo.GetBySession(ctx, sessionID)
	correctCount := 0
	for _, ans := range allAnswers {
		if ans.IsCorrect != nil && *ans.IsCorrect {
			correctCount++
		}
	}

	session.CorrectAnswers = correctCount
	uc.testSessionRepo.Update(ctx, session)

	return &entity.SubmitAnswerResponse{
		TestAnswer:    testAnswer,
		IsCorrect:     isCorrect,
		CorrectAnswer: correctAnswer,
		Explanation:   question.Explanation,
	}, nil
}

func (uc *exerciseUsecase) CompleteTest(ctx context.Context, userID string, req *entity.CompleteTestRequest) (*entity.TestSessionResponse, error) {
	session, err := uc.testSessionRepo.GetByID(ctx, req.TestSessionID.String())
	if err != nil {
		return nil, errors.New("session not found")
	}

	if session.UserID.String() != userID {
		return nil, errors.New("unauthorized")
	}

	if session.Status != "in_progress" {
		return nil, errors.New("session already completed")
	}

	// Calculate score
	allAnswers, _ := uc.testAnswerRepo.GetBySession(ctx, req.TestSessionID.String())
	correctCount := 0
	for _, ans := range allAnswers {
		if ans.IsCorrect != nil && *ans.IsCorrect {
			correctCount++
		}
	}

	// Calculate final score
	score := float64(correctCount) / float64(session.TotalQuestions) * 100
	now := time.Now()
	session.CorrectAnswers = correctCount
	session.Score = &score
	session.Status = "completed"
	session.CompletedAt = &now

	if err := uc.testSessionRepo.Update(ctx, session); err != nil {
		return nil, err
	}

	// Update user progress
	uc.updateUserProgress(ctx, userID, session)

	// Update user XP
	xpEarned := int(score)
	if xpEarned > 0 {
		uc.userRepo.UpdateXP(ctx, userID, xpEarned)
	}

	return uc.buildTestSessionResponse(ctx, session)
}

func (uc *exerciseUsecase) GetTestHistory(ctx context.Context, userID string, limit, offset int) ([]*entity.TestHistoryResponse, error) {
	sessions, err := uc.testSessionRepo.GetUserHistory(ctx, userID, map[string]interface{}{
		"status": "completed",
	}, limit, offset)
	if err != nil {
		return nil, err
	}

	responses := make([]*entity.TestHistoryResponse, 0, len(sessions))
	for _, session := range sessions {
		resp, err := uc.buildTestHistoryResponse(ctx, session)
		if err != nil {
			continue
		}
		responses = append(responses, resp)
	}

	return responses, nil
}

func (uc *exerciseUsecase) GetTestDetail(ctx context.Context, userID, sessionID string) (*entity.TestHistoryResponse, error) {
	session, err := uc.testSessionRepo.GetByID(ctx, sessionID)
	if err != nil {
		return nil, err
	}

	if session.UserID.String() != userID {
		return nil, errors.New("unauthorized")
	}

	return uc.buildTestHistoryResponse(ctx, session)
}

func (uc *exerciseUsecase) GetCategories(ctx context.Context) ([]*entity.VocabularyCategory, error) {
	return uc.categoryRepo.List(ctx, true)
}

func (uc *exerciseUsecase) GetExercises(ctx context.Context, filter map[string]interface{}, limit, offset int) ([]*entity.Exercise, error) {
	return uc.exerciseRepo.List(ctx, filter, limit, offset)
}

func (uc *exerciseUsecase) GetExerciseByID(ctx context.Context, exerciseID string) (*entity.Exercise, error) {
	return uc.exerciseRepo.GetByID(ctx, exerciseID)
}

func (uc *exerciseUsecase) buildTestSessionResponse(ctx context.Context, session *entity.TestSession) (*entity.TestSessionResponse, error) {
	questions, _ := uc.questionRepo.GetByExercise(ctx, session.ExerciseID.String())

	questionsWithAnswers := make([]entity.QuestionWithAnswers, 0)
	for _, q := range questions {
		answers, _ := uc.answerRepo.GetByQuestion(ctx, q.ID.String())
		questionsWithAnswers = append(questionsWithAnswers, entity.QuestionWithAnswers{
			Question: q,
			Answers:  answers,
		})
	}

	return &entity.TestSessionResponse{
		ID:              session.ID,
		Exercise:        session.Exercise,
		Questions:       questionsWithAnswers,
		StartedAt:       session.StartedAt,
		Status:          session.Status,
		TotalQuestions:  session.TotalQuestions,
		CorrectAnswers:  session.CorrectAnswers,
		Score:           session.Score,
		TimeSpentSeconds: session.TimeSpentSeconds,
	}, nil
}

func (uc *exerciseUsecase) buildTestHistoryResponse(ctx context.Context, session *entity.TestSession) (*entity.TestHistoryResponse, error) {
	answers, _ := uc.testAnswerRepo.GetBySession(ctx, session.ID.String())

	exercise := session.Exercise
	categoryName := ""
	exerciseType := ""
	if exercise != nil {
		if exercise.Category != nil {
			categoryName = exercise.Category.Name
		}
		if exercise.ExerciseType != nil {
			exerciseType = exercise.ExerciseType.Name
		}
	}

	return &entity.TestHistoryResponse{
		TestSession:    *session,
		CategoryName:   categoryName,
		ExerciseTitle:  exercise.Title,
		ExerciseType:   exerciseType,
		Answers:        answers,
	}, nil
}

func (uc *exerciseUsecase) updateUserProgress(ctx context.Context, userID string, session *entity.TestSession) error {
	progress, _ := uc.userProgressRepo.GetUserProgressByCategory(ctx, userID, session.Exercise.CategoryID.String())

	if progress == nil {
		progress = &entity.UserProgress{
			UserID:            uuid.MustParse(userID),
			CategoryID:        session.Exercise.CategoryID,
			TotalWordsLearned: 0,
			TestsCompleted:    0,
		}
	}

	progress.TestsCompleted++
	if session.Score != nil {
		if progress.AverageScore == nil {
			progress.AverageScore = session.Score
		} else {
			avg := (*progress.AverageScore*float64(progress.TestsCompleted-1) + *session.Score) / float64(progress.TestsCompleted)
			progress.AverageScore = &avg
		}
	}

	now := time.Now()
	progress.LastPracticedAt = &now

	return uc.userProgressRepo.Upsert(ctx, progress)
}
