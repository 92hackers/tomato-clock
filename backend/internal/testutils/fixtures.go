package testutils

import (
	"fmt"
	"math/rand"
	"time"
)

// TestUser 测试用户结构
type TestUser struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

// TestTask 测试任务结构
type TestTask struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	UserID      int64  `json:"user_id"`
}

// TestFixtures 测试固件管理器
type TestFixtures struct {
	users []TestUser
	tasks []TestTask
	rng   *rand.Rand
}

// NewTestFixtures 创建新的测试固件管理器
func NewTestFixtures() (*TestFixtures, error) {
	return &TestFixtures{
		users: make([]TestUser, 0),
		tasks: make([]TestTask, 0),
		rng:   rand.New(rand.NewSource(time.Now().UnixNano())),
	}, nil
}

// CreateTestUser 创建测试用户
func (f *TestFixtures) CreateTestUser(email string) *TestUser {
	user := TestUser{
		ID:    f.rng.Int63(),
		Email: email,
		Name:  fmt.Sprintf("User_%s", f.RandomString(6)),
	}
	f.users = append(f.users, user)
	return &user
}

// CreateTestTask 创建测试任务
func (f *TestFixtures) CreateTestTask(title, description string) *TestTask {
	task := TestTask{
		ID:          f.rng.Int63(),
		Title:       title,
		Description: description,
		UserID:      0, // 暂时设为0，后续可以关联用户
	}
	f.tasks = append(f.tasks, task)
	return &task
}

// RandomString 生成指定长度的随机字符串
func (f *TestFixtures) RandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[f.rng.Intn(len(charset))]
	}
	return string(b)
}

// RandomEmail 生成随机邮箱地址
func (f *TestFixtures) RandomEmail() string {
	username := f.RandomString(8)
	domain := f.RandomString(6)
	return fmt.Sprintf("%s@%s.com", username, domain)
}

// Cleanup 清理测试数据
func (f *TestFixtures) Cleanup() error {
	// 清空所有测试数据
	f.users = f.users[:0]
	f.tasks = f.tasks[:0]
	return nil
}

// GetUsers 获取所有创建的测试用户
func (f *TestFixtures) GetUsers() []TestUser {
	return f.users
}

// GetTasks 获取所有创建的测试任务
func (f *TestFixtures) GetTasks() []TestTask {
	return f.tasks
}
