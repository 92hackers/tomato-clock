package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tomato-clock/backend/internal/config"
	"github.com/tomato-clock/backend/internal/handlers"
	"github.com/tomato-clock/backend/internal/middleware"
)

func main() {
	// 加载配置
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 设置 Gin 模式
	gin.SetMode(cfg.Server.Mode)

	// 创建 Gin 引擎
	r := gin.New()

	// 添加基础中间件
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.SecurityMiddleware())

	// 创建处理器
	healthHandler := handlers.NewHealthHandler()

	// 注册路由
	setupRoutes(r, cfg, healthHandler)

	// 创建 HTTP 服务器
	server := &http.Server{
		Addr:         ":" + cfg.Server.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	log.Printf("Server starting on port %s in %s mode", cfg.Server.Port, cfg.Server.Mode)
	log.Printf("Health check available at: http://localhost:%s/health", cfg.Server.Port)

	// 启动服务器
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// setupRoutes 设置路由
func setupRoutes(r *gin.Engine, cfg *config.Config, healthHandler *handlers.HealthHandler) {
	// 健康检查路由（不需要认证）
	r.GET("/health", healthHandler.HealthCheck)
	r.GET("/ready", healthHandler.ReadinessCheck)
	r.GET("/live", healthHandler.LivenessCheck)

	// API 路由组
	api := r.Group(cfg.Server.BasePath)
	{
		// 健康检查 API
		api.GET("/health", healthHandler.HealthCheck)

		// TODO: 添加其他 API 路由
		// - 认证路由 (/auth)
		// - 计时器路由 (/timer)
		// - 任务路由 (/tasks)
		// - 统计路由 (/stats)
		// - 设置路由 (/settings)
	}
}
