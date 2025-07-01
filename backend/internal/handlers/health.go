package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tomato-clock/backend/internal/utils"
)

// HealthHandler 健康检查处理器
type HealthHandler struct{}

// NewHealthHandler 创建健康检查处理器
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// HealthCheck 健康检查接口
// @Summary 健康检查
// @Description 检查服务器是否正常运行
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} utils.APIResponse
// @Router /health [get]
func (h *HealthHandler) HealthCheck(c *gin.Context) {
	data := gin.H{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"service":   "tomato-clock-backend",
		"version":   "1.0.0",
		"uptime":    time.Since(startTime).String(),
	}

	utils.SuccessResponse(c, data, "Service is healthy")
}

// ReadinessCheck 就绪检查接口
// @Summary 就绪检查
// @Description 检查服务器是否准备好接受请求
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} utils.APIResponse
// @Failure 503 {object} utils.APIResponse
// @Router /ready [get]
func (h *HealthHandler) ReadinessCheck(c *gin.Context) {
	// 这里可以添加数据库连接检查、Redis 连接检查等
	// 目前简单返回成功

	data := gin.H{
		"status":    "ready",
		"timestamp": time.Now().Format(time.RFC3339),
		"checks": gin.H{
			"database": "ok", // TODO: 实际检查数据库连接
			"redis":    "ok", // TODO: 实际检查 Redis 连接
		},
	}

	utils.SuccessResponse(c, data, "Service is ready")
}

// LivenessCheck 存活检查接口
// @Summary 存活检查
// @Description 检查服务器是否存活
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} utils.APIResponse
// @Router /live [get]
func (h *HealthHandler) LivenessCheck(c *gin.Context) {
	// 简单的存活检查，只要能响应就说明服务存活
	c.JSON(http.StatusOK, gin.H{
		"status":    "alive",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// 服务启动时间
var startTime = time.Now()
