# 番茄时钟

## 项目概述

番茄时钟是一个基于Web的时间管理工具，采用了现代化的前后端分离架构和iOS风格的设计语言，主要功能包括：

- 专注时钟（25分钟工作，5分钟短休息，15分钟长休息）
- 任务管理（添加、完成、统计任务）
- 数据统计（专注时间、完成任务数量等）
- 成就系统（激励用户持续使用）
- 专注技巧（提供时间管理和专注的建议）
- 专注历程（记录用户的使用历程和进步）
- 用户账户与数据同步
- 多设备支持

## 文档结构

本文档包含以下几个部分：

1. [需求分析](./docs/requirements.md) - 项目的需求拆解和用户故事
2. [功能设计](./docs/functional-design.md) - 详细的功能设计和交互流程
3. [技术实现](./docs/implementation.md) - 具体的技术实现方案和代码结构
4. [UI设计](./docs/ui-design.md) - 用户界面设计原则和实现
5. [未来规划](./docs/roadmap.md) - 项目的后续发展计划和功能扩展

## 项目概览

番茄时钟是一个基于Web的时间管理工具，采用了现代化的前后端分离架构和iOS风格的设计语言，主要功能包括：

- 专注时钟（25分钟工作，5分钟短休息，15分钟长休息）
- 任务管理（添加、完成、统计任务）
- 数据统计（专注时间、完成任务数量等）
- 成就系统（激励用户持续使用）
- 专注技巧（提供时间管理和专注的建议）
- 专注历程（记录用户的使用历程和进步）
- 用户账户与数据同步
- 多设备支持

该项目采用现代化的前后端分离架构，具备高性能、可扩展性和良好的用户体验。

## 技术栈

### 前端技术
- **Next.js** - React 全栈框架（最新稳定版本）
- **React 18+** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Zustand** - 轻量级状态管理
- **React Hook Form** - 表单处理
- **Framer Motion** - 动画库
- **Chart.js** - 数据可视化

### 后端技术
- **Go** - 高性能后端语言
- **Gin** - 轻量级 Web 框架
- **GORM** - Go ORM 库
- **Session** - 基于 Cookie 的会话认证
- **Validator** - 数据验证
- **Zap** - 高性能日志库

### 数据库与缓存
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话存储
- **数据库迁移** - 使用 GORM 自动迁移

### 开发工具
- **Docker** - 容器化部署
- **Docker Compose** - 本地开发环境
- **Caddy** - 现代化反向代理和 Web 服务器
- **ESLint & Prettier** - 代码质量工具
- **Jest & Testing Library** - 前端测试
- **Testify** - Go 单元测试

## 项目架构

```
番茄时钟项目
├── frontend/           # Next.js 前端应用
│   ├── src/
│   │   ├── app/        # App Router 路由
│   │   ├── components/ # React 组件
│   │   ├── lib/        # 工具库和配置
│   │   ├── hooks/      # 自定义 Hooks
│   │   ├── store/      # 状态管理
│   │   └── types/      # TypeScript 类型定义
│   ├── public/         # 静态资源
│   └── package.json
│
├── backend/            # Gin 后端 API
│   ├── cmd/           # 应用入口点
│   ├── internal/      # 内部代码
│   │   ├── handlers/  # HTTP 处理器
│   │   ├── models/    # 数据模型
│   │   ├── services/  # 业务逻辑
│   │   ├── middleware/# 中间件
│   │   └── config/    # 配置管理
│   ├── migrations/    # 数据库迁移
│   └── go.mod
│
├── Caddyfile           # Caddy 配置指南和默认开发配置
├── Caddyfile.dev       # 开发环境专用配置
├── Caddyfile.prod      # 生产环境专用配置
├── docker-compose.yml  # 基础容器编排配置
├── docker-compose.dev.yml   # 开发环境专用配置
├── docker-compose.prod.yml  # 生产环境专用配置
├── docs/              # 项目文档
└── README.md
```

## 核心特性

### 🚀 性能优化
- Next.js App Router 提供的现代化路由和优化
- 服务端渲染 (SSR) 和静态生成 (SSG)
- 图片优化和懒加载
- API 路由缓存和优化

### 🔒 安全性
- 基于 Cookie 的 Session 认证
- CORS 跨域保护
- 数据验证和清理
- SQL 注入防护（GORM ORM）

### 📱 用户体验
- 响应式设计，完美适配所有设备
- PWA 支持，可安装为原生应用
- 离线功能支持
- 实时数据同步

### ⚡ 开发体验
- TypeScript 全栈类型安全
- 热重载开发环境
- 自动化测试集成
- Docker 容器化部署

## 部署架构

### 开发环境
- 反向代理：Caddy (localhost:80)
- 前端：Next.js 开发服务器 (内部 3000 端口)
- 后端：Gin 开发服务器 (内部 8080 端口)
- 数据库：PostgreSQL (内部 5432 端口)
- 缓存：Redis (内部 6379 端口)

### 生产环境
- 反向代理：Caddy (自动 HTTPS，80/443 端口)
- 前端：Next.js 生产应用或 Vercel/Netlify 部署
- 后端：Go 编译后的二进制文件或云服务器
- 数据库：云数据库 PostgreSQL
- 缓存：云 Redis 服务
- CDN：静态资源加速

### 架构优势
- **自动 HTTPS**：Caddy 自动管理 SSL/TLS 证书
- **现代化配置**：简洁的 Caddyfile 配置语法
- **高性能**：内置的 HTTP/2 和 HTTP/3 支持
- **零配置**：开箱即用的安全默认设置

## 快速开始

### 环境要求
- Node.js 18+
- Go 1.21+
- PostgreSQL 15+
- Redis 6+
- Docker & Docker Compose (可选)

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd tomato-clock
```

2. **使用 Docker Compose 启动（推荐）**

**开发环境：**
```bash
# 使用默认开发环境配置
docker-compose up -d

# 或使用开发环境专用配置（包含额外的调试功能）
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

**生产环境：**
```bash
# 设置环境变量
export DOMAIN_NAME=your-domain.com
export ADMIN_EMAIL=your-email@example.com

# 使用生产环境配置
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 或者使用 .env 文件
echo "DOMAIN_NAME=your-domain.com" > .env
echo "ADMIN_EMAIL=your-email@example.com" >> .env
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

3. **或手动启动服务**

前端：
```bash
cd frontend
npm install
npm run dev
```

后端：
```bash
cd backend
go mod tidy
go run cmd/main.go
```

4. **访问应用**

**开发环境：**
- 主应用入口：http://localhost (通过 Caddy 代理)
- 备用端口：http://localhost:8000 (开发环境额外端口)
- 前端直接访问：http://localhost:3001 (调试用)
- 后端直接访问：http://localhost:8001 (调试用)
- API 接口：http://localhost/api (通过 Caddy 代理)
- Caddy 管理界面：http://localhost:2019 (开发模式)

**生产环境：**
- 应用入口：https://your-domain.com (自动 HTTPS)
- API 接口：https://your-domain.com/api
- 健康检查：https://health.your-domain.com/health (如果配置)

**传统端口访问（开发调试）：**
- 前端服务：http://localhost:3000 (需要暴露端口)
- 后端服务：http://localhost:8080 (需要暴露端口)
- PostgreSQL：localhost:5432 (需要暴露端口)
- Redis：localhost:6379 (需要暴露端口)

## 数据流架构

```
用户浏览器
    ↕ HTTPS/HTTP
Caddy 反向代理 (自动 HTTPS)
    ↕ HTTP (内部网络)
用户界面 (Next.js) + API 网关 (Gin)
    ↕ WebSocket/HTTP
业务逻辑层 (Services)
    ↕
数据访问层 (GORM)
    ↕
PostgreSQL + Redis
```

## 项目特色

- **现代化技术栈**：采用最新稳定版本的前后端技术
- **类型安全**：TypeScript 和 Go 提供完整的类型保护
- **高性能**：Go 后端和 Next.js 前端的性能优化
- **可扩展性**：微服务架构设计，支持水平扩展
- **开发友好**：完善的开发工具链和文档 