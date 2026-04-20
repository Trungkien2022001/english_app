package config

import (
	"os"
	"strconv"
)

type Config struct {
	// Server
	ServerHost string
	ServerPort string
	GinMode    string

	// Database
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	// JWT
	JWTSecret            string
	JWTAccessDuration    int
	JWTRefreshDuration   int

	// Redis
	RedisHost     string
	RedisPort     string
	RedisPassword string
	RedisDB       int

	// CORS
	CORSAllowedOrigins  string
	CORSAllowedMethods  string
	CORSAllowedHeaders  string

	// App
	APPName    string
	APPVersion string
	APPEnv     string

	// Pagination
	DefaultPage     int
	DefaultPageSize int
	MaxPageSize     int
}

func NewConfig() *Config {
	return &Config{
		// Server
		ServerHost: getEnv("SERVER_HOST", "0.0.0.0"),
		ServerPort: getEnv("SERVER_PORT", "8080"),
		GinMode:    getEnv("GIN_MODE", "debug"),

		// Database
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "englishapp"),
		DBPassword: getEnv("DB_PASSWORD", "englishapp_secret"),
		DBName:     getEnv("DB_NAME", "englishapp_db"),
		DBSSLMode:  getEnv("DB_SSLMODE", "disable"),

		// JWT
		JWTSecret:          getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-this-in-production"),
		JWTAccessDuration:  getEnvAsInt("JWT_ACCESS_TOKEN_DURATION", 15),
		JWTRefreshDuration: getEnvAsInt("JWT_REFRESH_TOKEN_DURATION", 168),

		// Redis
		RedisHost:     getEnv("REDIS_HOST", "localhost"),
		RedisPort:     getEnv("REDIS_PORT", "6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		RedisDB:       getEnvAsInt("REDIS_DB", 0),

		// CORS
		CORSAllowedOrigins: getEnv("CORS_ALLOWED_ORIGINS", "*"),
		CORSAllowedMethods: getEnv("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,OPTIONS"),
		CORSAllowedHeaders: getEnv("CORS_ALLOWED_HEADERS", "Content-Type,Authorization"),

		// App
		APPName:    getEnv("APP_NAME", "EnglishApp"),
		APPVersion: getEnv("APP_VERSION", "1.0.0"),
		APPEnv:     getEnv("APP_ENV", "development"),

		// Pagination
		DefaultPage:     getEnvAsInt("DEFAULT_PAGE", 1),
		DefaultPageSize: getEnvAsInt("DEFAULT_PAGE_SIZE", 20),
		MaxPageSize:     getEnvAsInt("MAX_PAGE_SIZE", 100),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}
