package testutils

import (
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("TestFixtures", func() {
	var (
		fixtures *TestFixtures
		err      error
	)

	BeforeEach(func() {
		fixtures, err = NewTestFixtures()
		Expect(err).NotTo(HaveOccurred())
		Expect(fixtures).NotTo(BeNil())
	})

	AfterEach(func() {
		if fixtures != nil {
			fixtures.Cleanup()
		}
	})

	Context("当创建测试固件时", func() {
		It("应该成功创建测试用户", func() {
			user := fixtures.CreateTestUser("test@example.com")
			Expect(user).NotTo(BeNil())
			Expect(user.Email).To(Equal("test@example.com"))
		})

		It("应该成功创建测试任务", func() {
			task := fixtures.CreateTestTask("Test Task", "This is a test task")
			Expect(task).NotTo(BeNil())
			Expect(task.Title).To(Equal("Test Task"))
			Expect(task.Description).To(Equal("This is a test task"))
		})

		It("应该能够清理测试数据", func() {
			// Create some test data
			fixtures.CreateTestUser("user1@example.com")
			fixtures.CreateTestTask("Task 1", "Description 1")

			// Cleanup should not error
			err := fixtures.Cleanup()
			Expect(err).NotTo(HaveOccurred())
		})
	})

	Context("当使用测试助手时", func() {
		It("应该能够生成随机字符串", func() {
			str1 := fixtures.RandomString(10)
			str2 := fixtures.RandomString(10)

			Expect(str1).To(HaveLen(10))
			Expect(str2).To(HaveLen(10))
			Expect(str1).NotTo(Equal(str2)) // 应该生成不同的随机字符串
		})

		It("应该能够生成随机邮箱", func() {
			email := fixtures.RandomEmail()
			Expect(email).To(ContainSubstring("@"))
			Expect(email).To(ContainSubstring(".com"))
		})
	})
})
