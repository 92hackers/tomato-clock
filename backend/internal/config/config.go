package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config 应用配置结构
type Config struct {
	// 服务器配置
	Server ServerConfig `json:"server"`

	// 数据库配置
	Database DatabaseConfig `json:"database"`

	// Redis 配置
	Redis RedisConfig `json:"redis"`

	// Session 配置
	Session SessionConfig `json:"session"`

	// 日志配置
	Log LogConfig `json:"log"`
}

// ServerConfig 服务器配置
type ServerConfig struct {
	Port     string `json:"port"`
	Mode     string `json:"mode"` // debug, release, test
	Host     string `json:"host"`
	BasePath string `json:"base_path"`
}

// DatabaseConfig 数据库配置
type DatabaseConfig struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	DBName   string `json:"db_name"`
	SSLMode  string `json:"ssl_mode"`
	TimeZone string `json:"timezone"`
}

// RedisConfig Redis 配置
type RedisConfig struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	Password string `json:"password"`
	DB       int    `json:"db"`
}

// SessionConfig Session 配置
type SessionConfig struct {
	Secret     string `json:"secret"`
	Timeout    int    `json:"timeout"` // 秒
	CookieName string `json:"cookie_name"`
	Secure     bool   `json:"secure"`
	HTTPOnly   bool   `json:"http_only"`
}

// LogConfig 日志配置
type LogConfig struct {
	Level  string `json:"level"`  // debug, info, warn, error
	Format string `json:"format"` // json, text
	Output string `json:"output"` // stdout, file
}

// Load 加载配置
func Load() (*Config, error) {
	// 尝试加载 .env 文件
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: No .env file found: %v", err)
	}

	config := &Config{
		Server: ServerConfig{
			Port:     getEnv("PORT", "8080"),
			Mode:     getEnv("GIN_MODE", "debug"),
			Host:     getEnv("HOST", "localhost"),
			BasePath: getEnv("BASE_PATH", "/api/v1"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "password"),
			DBName:   getEnv("DB_NAME", "tomato_clock"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
			TimeZone: getEnv("DB_TIMEZONE", "UTC"),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvAsInt("REDIS_DB", 0),
		},
		Session: SessionConfig{
			Secret:     getEnv("SESSION_SECRET", "tomato-clock-secret-key"),
			Timeout:    getEnvAsInt("SESSION_TIMEOUT", 7200), // 2小时
			CookieName: getEnv("SESSION_COOKIE_NAME", "session_id"),
			Secure:     getEnvAsBool("SESSION_COOKIE_SECURE", false),
			HTTPOnly:   getEnvAsBool("SESSION_COOKIE_HTTPONLY", true),
		},
		Log: LogConfig{
			Level:  getEnv("LOG_LEVEL", "debug"),
			Format: getEnv("LOG_FORMAT", "text"),
			Output: getEnv("LOG_OUTPUT", "stdout"),
		},
	}

	return config, nil
}

// GetDSN 获取数据库连接字符串
func (c *Config) GetDSN() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		c.Database.Host,
		c.Database.User,
		c.Database.Password,
		c.Database.DBName,
		c.Database.Port,
		c.Database.SSLMode,
		c.Database.TimeZone,
	)
}

// GetRedisAddr 获取 Redis 地址
func (c *Config) GetRedisAddr() string {
	return fmt.Sprintf("%s:%s", c.Redis.Host, c.Redis.Port)
}

// 辅助函数

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}
