package utils

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// APIResponse API 响应结构
type APIResponse struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data,omitempty"`
	Message   string      `json:"message,omitempty"`
	Error     string      `json:"error,omitempty"`
	Timestamp string      `json:"timestamp"`
}

// APIError API 错误结构
type APIError struct {
	Code    string                 `json:"code"`
	Message string                 `json:"message"`
	Details map[string]interface{} `json:"details,omitempty"`
}

// SuccessResponse 成功响应
func SuccessResponse(c *gin.Context, data interface{}, message ...string) {
	response := APIResponse{
		Success:   true,
		Data:      data,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	if len(message) > 0 {
		response.Message = message[0]
	}

	c.JSON(http.StatusOK, response)
}

// CreatedResponse 创建成功响应
func CreatedResponse(c *gin.Context, data interface{}, message ...string) {
	response := APIResponse{
		Success:   true,
		Data:      data,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	if len(message) > 0 {
		response.Message = message[0]
	} else {
		response.Message = "Resource created successfully"
	}

	c.JSON(http.StatusCreated, response)
}

// ErrorResponse 错误响应
func ErrorResponse(c *gin.Context, statusCode int, err string, details ...map[string]interface{}) {
	response := APIResponse{
		Success:   false,
		Error:     err,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	c.JSON(statusCode, response)
}

// BadRequestResponse 400 错误响应
func BadRequestResponse(c *gin.Context, err string) {
	ErrorResponse(c, http.StatusBadRequest, err)
}

// UnauthorizedResponse 401 错误响应
func UnauthorizedResponse(c *gin.Context, err ...string) {
	message := "Unauthorized"
	if len(err) > 0 {
		message = err[0]
	}
	ErrorResponse(c, http.StatusUnauthorized, message)
}

// ForbiddenResponse 403 错误响应
func ForbiddenResponse(c *gin.Context, err ...string) {
	message := "Forbidden"
	if len(err) > 0 {
		message = err[0]
	}
	ErrorResponse(c, http.StatusForbidden, message)
}

// NotFoundResponse 404 错误响应
func NotFoundResponse(c *gin.Context, err ...string) {
	message := "Resource not found"
	if len(err) > 0 {
		message = err[0]
	}
	ErrorResponse(c, http.StatusNotFound, message)
}

// ConflictResponse 409 错误响应
func ConflictResponse(c *gin.Context, err ...string) {
	message := "Resource conflict"
	if len(err) > 0 {
		message = err[0]
	}
	ErrorResponse(c, http.StatusConflict, message)
}

// ValidationErrorResponse 422 验证错误响应
func ValidationErrorResponse(c *gin.Context, err string, details ...map[string]interface{}) {
	response := APIResponse{
		Success:   false,
		Error:     err,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	c.JSON(http.StatusUnprocessableEntity, response)
}

// InternalErrorResponse 500 错误响应
func InternalErrorResponse(c *gin.Context, err ...string) {
	message := "Internal server error"
	if len(err) > 0 {
		message = err[0]
	}
	ErrorResponse(c, http.StatusInternalServerError, message)
}

// PaginationResponse 分页响应
func PaginationResponse(c *gin.Context, data interface{}, page, pageSize, total int) {
	totalPages := (total + pageSize - 1) / pageSize

	response := map[string]interface{}{
		"data": data,
		"pagination": map[string]interface{}{
			"page":        page,
			"page_size":   pageSize,
			"total":       total,
			"total_pages": totalPages,
			"has_next":    page < totalPages,
			"has_prev":    page > 1,
		},
	}

	SuccessResponse(c, response)
}
