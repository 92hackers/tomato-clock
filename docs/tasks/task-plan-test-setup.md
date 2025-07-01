# 任务计划：测试环境与框架搭建

## 任务概述
建立番茄时钟项目的完整测试基础设施，包括前端和后端的测试框架、测试数据库环境、CI/CD测试流水线和代码覆盖率监控系统。这是v1.1版本TDD开发的基础任务，为后续所有开发工作奠定质量保障基础。

## 任务目标
- [ ] 搭建Go后端测试框架 (Testify + Ginkgo)
- [ ] 搭建前端测试框架 (Jest + Testing Library + MSW)
- [ ] 配置PostgreSQL测试数据库隔离环境
- [ ] 设置CI/CD测试流水线基础架构
- [ ] 配置代码覆盖率报告和监控工具
- [ ] 创建测试示例和文档
- [ ] 验证整个测试环境可用性

## 技术方案

### 后端测试框架 (Go)
1. **核心测试库**
   - `testify/assert` - 断言库
   - `testify/mock` - 模拟对象
   - `testify/suite` - 测试套件
   - `onsi/ginkgo` - BDD风格测试框架
   - `onsi/gomega` - 匹配器库

2. **测试数据库**
   - 使用Docker Compose配置独立的PostgreSQL测试实例
   - 配置测试数据初始化和清理脚本
   - 支持并行测试的数据库隔离

3. **测试工具**
   - `golang-migrate` - 数据库迁移工具
   - `testcontainers-go` - 集成测试容器管理

### 前端测试框架 (TypeScript/React)
1. **核心测试库**
   - `jest` - 测试运行器和断言库
   - `@testing-library/react` - React组件测试
   - `@testing-library/jest-dom` - DOM断言扩展
   - `@testing-library/user-event` - 用户交互模拟

2. **API模拟**
   - `msw` (Mock Service Worker) - API调用模拟
   - 配置开发和测试环境的API模拟

3. **测试工具**
   - `jest-environment-jsdom` - DOM环境模拟
   - `@jest/globals` - Jest全局函数类型支持

### CI/CD 测试架构
1. **GitHub Actions工作流**
   - 后端测试工作流 (Go test + 覆盖率)
   - 前端测试工作流 (Jest + 覆盖率)
   - 集成测试工作流 (Docker Compose)

2. **代码覆盖率**
   - `codecov` 或 `coveralls` 集成
   - 覆盖率门槛设置 (后端85%, 前端80%)
   - 覆盖率报告和徽章

## 涉及文件
### 新增文件
- `backend/go.mod` - Go模块依赖 (添加测试依赖)
- `backend/internal/testutils/` - 测试工具包
- `backend/internal/testutils/database.go` - 测试数据库助手
- `backend/internal/testutils/fixtures.go` - 测试数据固件
- `backend/cmd/server/main_test.go` - 服务器集成测试示例
- `frontend/jest.config.js` - Jest配置
- `frontend/jest.setup.js` - Jest环境设置
- `frontend/src/setupTests.ts` - 测试环境初始化
- `frontend/src/__mocks__/` - 模拟对象目录
- `frontend/src/testUtils.tsx` - 测试工具函数
- `.github/workflows/backend-tests.yml` - 后端测试CI
- `.github/workflows/frontend-tests.yml` - 前端测试CI
- `docker-compose.test.yml` - 测试环境Docker配置

### 修改文件
- `backend/go.mod` - 添加测试依赖
- `frontend/package.json` - 添加测试相关依赖和脚本
- `frontend/tsconfig.json` - 添加测试类型支持
- `.gitignore` - 添加测试输出目录忽略
- `README.md` - 添加测试运行说明

## 预计工作量
**总计：M (4-5天)**

- Day 1: 后端测试框架搭建 (Go + Testify + Ginkgo)
- Day 2: 前端测试框架搭建 (Jest + Testing Library)
- Day 3: 测试数据库环境配置和Docker集成
- Day 4: CI/CD测试流水线配置
- Day 5: 代码覆盖率配置、文档编写和验证

## 依赖关系
- **前置依赖**: 无 (这是第一个任务)
- **后续依赖**: ARCH-001 (项目结构搭建)

## 风险评估

### 主要风险
1. **工具兼容性风险**
   - 风险: 不同测试工具版本兼容性问题
   - 缓解: 使用经过验证的稳定版本组合

2. **CI/CD配置复杂性**
   - 风险: GitHub Actions配置可能复杂，调试困难
   - 缓解: 采用渐进式配置，先本地验证再上云

3. **测试数据库隔离**
   - 风险: 并行测试可能出现数据污染
   - 缓解: 使用事务回滚或独立数据库实例

4. **学习曲线**
   - 风险: 团队对某些测试工具不熟悉
   - 缓解: 提供详细文档和示例代码

### 缓解策略
- 分阶段验证，每个组件独立测试
- 提供详细的安装和使用文档
- 创建示例测试用例作为参考
- 建立测试最佳实践指南

## 验收标准

### 后端测试环境
- [ ] Go测试框架正常运行：`go test ./... -v`
- [ ] Testify断言库可用，示例测试通过
- [ ] Ginkgo BDD测试框架可用，示例测试通过
- [ ] 测试数据库连接正常，数据隔离有效
- [ ] 模拟对象 (testify/mock) 正常工作

### 前端测试环境
- [ ] Jest测试运行器正常：`pnpm test`
- [ ] React Testing Library组件测试可用
- [ ] MSW API模拟正常工作
- [ ] 测试覆盖率报告生成正常
- [ ] TypeScript类型检查在测试中正常

### CI/CD测试流水线
- [ ] GitHub Actions自动触发测试
- [ ] 后端测试工作流正常运行
- [ ] 前端测试工作流正常运行
- [ ] 测试失败时CI流水线阻塞
- [ ] 代码覆盖率报告上传成功

### 代码覆盖率监控
- [ ] 后端代码覆盖率报告生成
- [ ] 前端代码覆盖率报告生成
- [ ] 覆盖率阈值配置生效 (后端85%, 前端80%)
- [ ] 覆盖率下降时有告警机制
- [ ] 覆盖率报告可视化 (如徽章)

### 文档和示例
- [ ] 测试运行文档完整准确
- [ ] 提供后端测试示例 (单元测试、集成测试)
- [ ] 提供前端测试示例 (组件测试、Hook测试)
- [ ] TDD开发流程指导文档
- [ ] 测试最佳实践指南

## 创建时间
2025-01-01

## 负责人
AI Assistant

---

## 附录：技术细节

### 推荐的依赖版本
```go
// backend/go.mod 测试依赖
require (
    github.com/stretchr/testify v1.8.4
    github.com/onsi/ginkgo/v2 v2.13.0
    github.com/onsi/gomega v1.29.0
    github.com/testcontainers/testcontainers-go v0.26.0
    github.com/golang-migrate/migrate/v4 v4.16.2
)
```

```json
// frontend/package.json 测试依赖
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/user-event": "^14.5.1",
    "msw": "^2.0.11",
    "@jest/globals": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

### 目录结构预览
```
backend/
├── internal/
│   └── testutils/
│       ├── database.go     # 测试数据库助手
│       ├── fixtures.go     # 测试数据固件
│       └── helpers.go      # 通用测试助手
└── cmd/server/
    └── main_test.go        # 集成测试示例

frontend/
├── jest.config.js          # Jest配置
├── jest.setup.js           # Jest环境设置
├── src/
│   ├── setupTests.ts       # 测试环境初始化
│   ├── __mocks__/          # 模拟对象
│   ├── testUtils.tsx       # 测试工具函数
│   └── components/
│       └── __tests__/      # 组件测试

.github/
└── workflows/
    ├── backend-tests.yml   # 后端测试CI
    ├── frontend-tests.yml  # 前端测试CI
    └── integration-tests.yml # 集成测试CI
``` 