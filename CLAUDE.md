# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pomodoro Timer application built with modern full-stack technologies. It's designed as a production-level project with comprehensive documentation, testing, and development practices.

**Architecture**: Full-stack monorepo with Next.js frontend and Go backend
**Development Style**: Test-Driven Development (TDD) with AI-assisted development
**Quality Focus**: 85%+ test coverage, TypeScript type safety, comprehensive documentation

## Quick Development Commands

### Frontend (Next.js + TypeScript)
```bash
cd frontend

# Development
pnpm install          # Install dependencies (required - use pnpm only)
pnpm run dev         # Start development server (localhost:3000)
pnpm run build       # Build for production
pnpm run start       # Start production server
pnpm run lint        # Run ESLint
pnpm run lint:fix    # Fix linting issues
pnpm run format      # Format code with Prettier

# Testing (Jest + Testing Library)
pnpm run test               # Run all tests
pnpm run test:watch         # Run tests in watch mode
pnpm run test:coverage      # Generate coverage report
pnpm run test:ci            # Run tests in CI mode
pnpm run type-check         # TypeScript type checking only
```

### Backend (Go + Gin)
```bash
cd backend

# Development
go mod tidy           # Install/update dependencies
go run cmd/server/main.go    # Start development server (localhost:8080)
go build -o bin/server cmd/server/main.go  # Build binary

# Testing (Testify + Ginkgo)
go test ./...                # Run all unit tests
go test -v ./...             # Run tests with verbose output
go test -race ./...          # Run tests with race detection
go test -cover ./...          # Run tests with coverage
go test -tags=integration ./...  # Run integration tests
ginkgo ./...                 # Run BDD-style tests (if installed)
```

### Docker Development (Recommended)
```bash
# Development environment (default)
docker-compose up -d

# Development with extra debugging
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Production environment
export DOMAIN_NAME=your-domain.com
export ADMIN_EMAIL=your-email@example.com
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f caddy
```

### Testing Commands
```bash
# Frontend tests
cd frontend && pnpm run test:coverage

# Backend tests
cd backend && go test -cover ./...

# Full test suite
pnpm run test:ci && cd ../backend && go test -cover ./...
```

## Code Architecture

### Project Structure
```
tomato-clock/
├── frontend/                    # Next.js 14 App Router application
│   ├── src/
│   │   ├── app/                # App Router pages (auth/, timer/, etc.)
│   │   ├── components/         # Reusable React components
│   │   │   ├── Timer/         # Pomodoro timer components
│   │   │   ├── Layout/        # Layout components
│   │   │   └── UI/            # Reusable UI components
│   │   ├── lib/               # Utilities and configurations
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Zustand state management
│   │   ├── types/             # TypeScript type definitions
│   │   └── __mocks__/         # MSW API mocks for testing
│   ├── public/                # Static assets
│   └── package.json
├── backend/                     # Go + Gin REST API
│   ├── cmd/
│   │   └── server/main.go     # Application entry point
│   ├── internal/
│   │   ├── handlers/          # HTTP request handlers
│   │   ├── services/          # Business logic layer
│   │   ├── models/            # Data models and structs
│   │   ├── middleware/        # HTTP middleware (CORS, auth, etc.)
│   │   ├── config/            # Configuration management
│   │   └── utils/             # Utility functions
│   ├── migrations/            # Database migration files
│   └── go.mod
├── docs/                       # Comprehensive project documentation
├── Caddyfile*                  # Reverse proxy configurations
└── docker-compose*.yml         # Container orchestration
```

### Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode, no `any` types)
- **Styling**: Tailwind CSS with mobile-first design
- **State Management**: Zustand for global state, useState for local state
- **Testing**: Jest + Testing Library + MSW for API mocking
- **Package Manager**: pnpm only (no npm/yarn)

### Backend Architecture
- **Framework**: Gin (HTTP router)
- **Language**: Go 1.22+ (no generics unless necessary)
- **Database**: PostgreSQL with GORM ORM
- **Sessions**: Cookie-based sessions with Redis storage
- **Testing**: Testify for unit tests, Ginkgo for BDD tests
- **Configuration**: Environment variables with .env support

### Key Design Patterns
- **Test-Driven Development**: Red-Green-Refactor cycle
- **Dependency Injection**: Service layer pattern in backend
- **Component Composition**: Reusable React components
- **Middleware Chain**: Cross-cutting concerns (CORS, security, logging)
- **Configuration Management**: Environment-based config loading

## Development Workflow

### Task Management Process
Every feature/bugfix follows this strict workflow:

1. **Create Task Plan** (`docs/tasks/task-plan-[name].md`)
   - Define objectives and acceptance criteria
   - Break down into sub-tasks if complex (day-1, day-2, etc.)
   - Wait for user confirmation before starting

2. **TDD Implementation**
   - 🔴 **Red**: Write failing tests first
   - 🟢 **Green**: Write minimal code to pass tests
   - 🔄 **Refactor**: Improve code quality while maintaining tests

3. **Create Task Summary** (`docs/tasks/task-summary-[name].md`)
   - Document what was actually implemented
   - List files changed and key code changes
   - Update related documentation

### Code Standards
- **TypeScript**: All files must have proper type definitions
- **Go**: Comprehensive comments on functions and complex logic
- **Testing**: 80%+ frontend coverage, 85%+ backend coverage
- **Commits**: Conventional Commits format (`feat(scope): description`)
- **Documentation**: Update docs/ files with every significant change

### Environment Configuration
- **Development**: `Caddyfile.dev` with HTTP, debug logging, relaxed security
- **Production**: `Caddyfile.prod` with auto-HTTPS, security headers, file logging
- **Database**: PostgreSQL with GORM auto-migrations
- **Sessions**: Redis-based session storage with secure cookies

## Important Technical Details

### API Design
- **Base Path**: `/api/v1` (configurable via `BASE_PATH`)
- **Response Format**: Consistent JSON structure with success/error fields
- **Authentication**: Cookie-based sessions (no JWT tokens)
- **CORS**: Configured for frontend origin in development

### State Management
- **Global State**: Zustand stores (user settings, timer state)
- **Local State**: React useState for component-specific data
- **Server State**: Direct API calls with axios, no client-side caching
- **Session State**: Managed by backend, stored in Redis

### Testing Strategy
- **Unit Tests**: 70% - Test individual functions/components
- **Integration Tests**: 20% - Test API endpoints and database interactions
- **E2E Tests**: 10% - Test complete user workflows
- **Mocking**: MSW for API calls in frontend, test doubles in backend

### Security Considerations
- **Session Management**: Secure, HTTP-only cookies
- **CORS**: Restricted to frontend origin
- **Input Validation**: Go validator for API inputs, React Hook Form for frontend
- **SQL Injection**: Protected by GORM ORM
- **XSS Protection**: Content Security Policy headers via Caddy

## File Naming Conventions

### Frontend
- **Components**: `PascalCase.tsx` (e.g., `PomodoroTimer.tsx`)
- **Pages**: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatTime.ts`)
- **Types**: `camelCase.ts` (e.g., `userTypes.ts`)
- **Hooks**: `useCamelCase.ts` (e.g., `useTimer.ts`)

### Backend
- **Files**: `snake_case.go` (e.g., `user_service.go`)
- **Functions**: `PascalCase` (public), `camelCase` (private)
- **Variables**: `camelCase`
- **Constants**: `ALL_CAPS`
- **Packages**: lowercase, single words when possible

## Key Services and Components

### Core Frontend Components
- `PomodoroTimer`: Main timer functionality with start/pause/reset
- `PageLayout`: Consistent layout wrapper with navigation
- `Timer`: Timer display and controls (25min work, 5min break, 15min long break)
- `TaskManager`: Task creation, completion, and statistics
- `UserSettings`: Preferences and configuration management

### Backend Services
- `HealthHandler`: Health check endpoints (`/health`, `/ready`, `/live`)
- `UserService`: User authentication and management
- `TimerService`: Pomodoro session tracking and persistence
- `TaskService`: Task CRUD operations and user associations
- `StatsService`: Usage analytics and reporting

### Database Schema
- `users`: User accounts with session management
- `timers`: Pomodoro sessions with duration and completion status
- `tasks`: User tasks with completion tracking
- `user_settings`: Individual preferences and configurations

## Development Notes

### Common Issues and Solutions
- **Port Conflicts**: Use Docker Compose to avoid port conflicts
- **CORS Issues**: Ensure `CORS_ALLOWED_ORIGIN` matches frontend URL
- **Session Issues**: Check Redis connection and cookie domain settings
- **Database Issues**: Verify PostgreSQL is running and migrations are applied

### Performance Optimizations
- **Frontend**: Next.js automatic code splitting and image optimization
- **Backend**: Connection pooling for database and Redis
- **Caching**: Redis for session storage and frequent data
- **Compression**: Gzip compression enabled in Caddy configuration

### Debugging Tips
- **Frontend**: Use React DevTools and browser dev tools
- **Backend**: Enable debug logging via `LOG_LEVEL=debug`
- **Database**: Connect directly to check data state
- **Network**: Use Caddy admin interface (`localhost:2019`) for debugging

### Testing Best Practices
- **Write tests first** in TDD fashion
- **Test behavior, not implementation**
- **Use descriptive test names** that explain the scenario
- **Mock external dependencies** to isolate units under test
- **Maintain high coverage** without sacrificing readability

Remember: This project emphasizes production quality, comprehensive testing, and maintainable code. Every change should include appropriate tests and documentation updates.