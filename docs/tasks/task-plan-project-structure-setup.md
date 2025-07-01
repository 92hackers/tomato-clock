# 任务计划：ARCH-001 项目结构搭建

## 任务概述
此任务是番茄时钟项目 v1.1 架构重构版本的第一个关键任务，负责建立现代化的前后端分离项目结构，为后续的 TDD 开发奠定坚实基础。该任务将创建一个完整的 monorepo 结构，包含前端 Next.js 应用和后端 Go 应用，并集成必要的开发工具和测试框架。

## 任务目标
- [x] 创建 monorepo 项目结构，包含 frontend/ 和 backend/ 目录
- [x] 配置前端 Next.js 项目，包含 TypeScript、Tailwind CSS、ESLint、Prettier
- [x] 配置后端 Go 项目，包含 Gin 框架、GORM、基础模块结构
- [x] 集成前端测试框架（Jest + Testing Library + MSW）
- [x] 集成后端测试框架（Testify + Ginkgo + GoMock）
- [x] 配置代码质量工具（ESLint、Prettier、Go fmt、Go vet）
- [x] 设置 .gitignore 和基础配置文件
- [x] 确保前后端项目可以独立启动和运行

## 技术方案

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.x
- **状态管理**: Zustand（后续任务中集成）
- **测试**: Jest + Testing Library + MSW
- **代码质量**: ESLint + Prettier
- **包管理**: pnpm

### 后端技术栈
- **语言**: Go 1.21+
- **框架**: Gin
- **ORM**: GORM
- **数据库**: PostgreSQL（Docker 环境）
- **缓存**: Redis（Docker 环境）
- **测试**: Testify + Ginkgo + GoMock
- **代码质量**: Go fmt + Go vet + golangci-lint
- **包管理**: Go modules

### 目录结构设计
```
tomato-clock/
├── frontend/                   # Next.js 前端应用
│   ├── src/
│   │   ├── app/               # App Router 路由
│   │   ├── components/        # React 组件
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── store/             # Zustand 状态管理
│   │   ├── lib/               # 工具库
│   │   └── types/             # TypeScript 类型
│   ├── __tests__/             # 测试文件
│   ├── public/                # 静态资源
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── jest.config.js
│   └── next.config.js
│
├── backend/                    # Go 后端应用
│   ├── cmd/
│   │   └── server/
│   │       └── main.go        # 应用入口
│   ├── internal/              # 内部代码包
│   │   ├── handlers/          # HTTP 处理器
│   │   ├── services/          # 业务逻辑层
│   │   ├── models/            # 数据模型
│   │   ├── repository/        # 数据访问层
│   │   ├── middleware/        # 中间件
│   │   ├── config/            # 配置管理
│   │   └── utils/             # 工具函数
│   ├── tests/                 # 测试文件
│   │   ├── unit/              # 单元测试
│   │   ├── integration/       # 集成测试
│   │   └── fixtures/          # 测试数据
│   ├── migrations/            # 数据库迁移
│   ├── go.mod
│   └── go.sum
│
├── docs/                       # 项目文档
├── scripts/                    # 脚本文件
├── .gitignore
├── README.md
└── LICENSE
```

### 集成测试框架策略
- **前端**: 配置 Jest + Testing Library，设置 MSW 用于 API 模拟
- **后端**: 配置 Testify 和 Ginkgo，准备 GoMock 生成器
- **测试命令**: 确保 `pnpm test` 和 `go test` 命令正常工作
- **CI 准备**: 为后续 CI/CD 集成做好基础配置

## 涉及文件

### 新建文件
- `frontend/package.json` - 前端依赖配置
- `frontend/tsconfig.json` - TypeScript 配置
- `frontend/tailwind.config.js` - Tailwind CSS 配置
- `frontend/jest.config.js` - Jest 测试配置
- `frontend/next.config.js` - Next.js 配置
- `frontend/.eslintrc.json` - ESLint 配置
- `frontend/.prettierrc` - Prettier 配置
- `frontend/src/app/layout.tsx` - Next.js 根布局
- `frontend/src/app/page.tsx` - Next.js 首页
- `frontend/src/app/globals.css` - 全局样式

- `backend/go.mod` - Go 模块配置
- `backend/go.sum` - Go 依赖校验
- `backend/cmd/server/main.go` - 应用入口点
- `backend/internal/config/config.go` - 配置结构
- `backend/internal/handlers/health.go` - 健康检查处理器
- `backend/internal/middleware/cors.go` - CORS 中间件
- `backend/internal/utils/response.go` - 响应工具

### 配置文件
- `.gitignore` - Git 忽略规则
- `README.md` - 项目说明文档（更新）

## 预计工作量
**总估时**: 3-5 天

**详细分解**:
- 项目结构设计和创建: 0.5 天
- 前端 Next.js 项目配置: 1.5 天
- 后端 Go 项目配置: 1.5 天
- 测试框架集成和配置: 1 天
- 代码质量工具配置: 0.5 天
- 文档编写和验收测试: 0.5 天

## 依赖关系
**前置依赖**: 
- TEST-SETUP-001 (测试环境与框架搭建) - 已完成

**后续依赖任务**:
- ARCH-002 (Docker 开发环境搭建)
- FE-001 (Next.js 项目初始化与测试)

## 风险评估

### 主要风险
1. **技术栈兼容性风险**
   - 风险: Next.js 14 App Router 与测试框架的兼容性问题
   - 缓解: 提前验证技术栈兼容性，准备降级方案

2. **测试框架集成复杂度**
   - 风险: 前后端测试框架配置可能比预期复杂
   - 缓解: 参考最佳实践，保持配置简洁

3. **Go 模块依赖管理**
   - 风险: Go 依赖版本冲突或下载问题
   - 缓解: 使用稳定版本，配置代理加速

### 次要风险
1. **开发工具配置冲突**
   - 风险: ESLint、Prettier 配置可能与项目需求冲突
   - 缓解: 采用社区推荐配置，最小化自定义规则

## 验收标准

### 项目结构验收
- [x] 项目目录结构完全符合设计规范
- [x] 所有必要的配置文件都已创建并配置正确
- [x] .gitignore 文件配置合理，排除不必要文件

### 前端验收标准
- [x] `cd frontend && pnpm install` 成功安装所有依赖
- [x] `pnpm run dev` 可以启动开发服务器，访问 http://localhost:3000 正常
- [x] `pnpm run build` 可以成功构建生产版本
- [x] `pnpm run lint` 代码检查通过
- [x] `pnpm run test` 测试框架正常运行（即使没有具体测试）
- [x] TypeScript 编译无错误
- [x] Tailwind CSS 样式正常加载

### 后端验收标准
- [x] `cd backend && go mod tidy` 成功整理依赖
- [x] `go build ./cmd/server` 可以成功编译
- [x] `go run ./cmd/server` 可以启动服务器
- [x] `go test ./...` 测试框架正常运行
- [x] `go fmt ./...` 和 `go vet ./...` 检查通过
- [x] 健康检查端点 `/health` 返回正确响应

### 代码质量验收
- [x] ESLint 配置正确，可以检查前端代码质量
- [x] Prettier 配置正确，可以格式化前端代码
- [x] Go 代码格式化工具配置正确
- [x] 所有配置文件语法正确

### 文档验收
- [x] README.md 包含项目介绍和基础使用说明
- [x] 代码中包含必要的注释
- [x] 配置文件包含适当的说明

## 创建时间
2025-01-01

## 负责人
AI Assistant

## 特殊说明

### TDD 开发准备
此任务为后续 TDD 开发做好基础准备，重点关注：
- 测试框架的正确集成
- 测试命令的可用性
- 项目结构对测试友好的设计

### 与 TEST-SETUP-001 的衔接
- 复用 TEST-SETUP-001 中验证的测试工具和配置
- 确保测试框架在项目结构中正确集成
- 为后续测试开发提供清晰的基础结构

### 下一步规划
完成此任务后，项目将具备：
- 清晰的代码组织结构
- 完整的开发工具链
- 可运行的前后端基础框架
- 为 TDD 开发准备的测试环境

这将为 ARCH-002 (Docker 环境搭建) 和后续的 TDD 开发任务提供坚实的基础。 