# 项目贡献指南

欢迎为番茄时钟项目贡献代码！本文档将指导你如何参与项目开发，包括任务管理、代码规范、提交流程等。

## 目录

1. [快速开始](#快速开始)
2. [任务管理流程](#任务管理流程)
3. [开发环境设置](#开发环境设置)
4. [代码规范](#代码规范)
5. [提交规范](#提交规范)
6. [Pull Request 流程](#pull-request-流程)
7. [文档维护](#文档维护)
8. [测试要求](#测试要求)
9. [发布流程](#发布流程)

## 快速开始

### 1. Fork 项目
在 GitHub 上 fork 本项目到你的账户

### 2. 克隆项目
```bash
git clone https://github.com/你的用户名/tomato-clock.git
cd tomato-clock
```

### 3. 设置远程仓库
```bash
git remote add upstream https://github.com/原项目/tomato-clock.git
```

### 4. 安装依赖
```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
go mod tidy
```

## 任务管理流程

每个任务（无论是新功能、Bug 修复还是文档更新）都需要遵循以下流程：

### 第一步：创建任务计划文档

在开始任何开发工作之前，需要在 `docs/tasks/` 目录下创建任务计划文档：

**文件命名规范：** `task-plan-[任务简短描述].md`

**示例：** `task-plan-add-user-auth.md`

**模板内容：**
```markdown
# 任务计划：[任务名称]

## 任务概述
简要描述这个任务要做什么

## 任务目标
- [ ] 目标1
- [ ] 目标2
- [ ] 目标3

## 技术方案
描述技术实现方案

## 涉及文件
列出预计会修改的文件

## 预计工作量
估计完成时间

## 依赖关系
是否依赖其他任务或功能

## 风险评估
可能遇到的问题和风险

## 验收标准
如何验证任务完成

## 创建时间
YYYY-MM-DD

## 负责人
开发者姓名
```

### 第二步：开发实现

1. 创建功能分支
```bash
git checkout -b feature/任务简短描述
```

2. 进行开发工作

3. 提交代码
```bash
git add .
git commit -m "type(scope): description"
```

### 第三步：创建任务总结文档

完成开发后，需要在 `docs/tasks/` 目录下创建任务总结文档：

**文件命名规范：** `task-summary-[任务简短描述].md`

**示例：** `task-summary-add-user-auth.md`

**模板内容：**
```markdown
# 任务总结：[任务名称]

## 任务概述
简要描述完成的任务

## 实际完成情况
- [x] 已完成的目标1
- [x] 已完成的目标2
- [ ] 未完成的目标3（说明原因）

## 技术实现
### 主要变更
1. **新增文件**
   - `path/to/file1.ts` - 功能描述
   - `path/to/file2.go` - 功能描述

2. **修改文件**
   - `path/to/file3.tsx` - 修改内容描述
   - `path/to/file4.go` - 修改内容描述

3. **删除文件**
   - `path/to/old-file.js` - 删除原因

### 核心代码变更
```typescript
// 关键代码示例
```

## 数据库变更
如果有数据库相关变更，需要说明：
- 新增表结构
- 修改字段
- 数据迁移脚本

## API 变更
如果有 API 变更，需要说明：
- 新增接口
- 修改接口
- 废弃接口

## 前端变更
- 新增页面/组件
- 修改UI/UX
- 新增功能

## 测试覆盖
- 单元测试
- 集成测试
- E2E测试

## 预计影响
### 正面影响
- 用户体验改进
- 性能提升
- 功能增强

### 潜在风险
- 可能的副作用
- 兼容性问题
- 性能影响

## 更新的文档
列出因此任务而需要更新的文档：
- [ ] `docs/requirements.md` - 更新需求描述
- [ ] `docs/functional-design.md` - 更新功能设计
- [ ] `docs/implementation.md` - 更新技术实现
- [ ] `docs/ui-design.md` - 更新UI设计说明
- [ ] `README.md` - 更新项目说明

## 部署注意事项
- 环境变量配置
- 数据库迁移步骤
- 依赖包更新

## 完成时间
YYYY-MM-DD

## 负责人
开发者姓名

## 代码审查
- [ ] 自测通过
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 代码审查通过
```

## 开发环境设置

### 推荐使用 Docker Compose

```bash
# 开发环境
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 访问地址
# 主应用：http://localhost
# API接口：http://localhost/api
# 前端调试：http://localhost:3001
# 后端调试：http://localhost:8001
```

### 手动设置

参考 [README.md](../README.md) 中的详细说明

## 代码规范

### 前端 (TypeScript/React)

1. **文件命名**
   - 组件文件：`PascalCase.tsx`
   - 工具文件：`camelCase.ts`
   - 页面文件：`kebab-case.tsx`

2. **组件规范**
   ```typescript
   // 使用函数组件和 TypeScript
   interface Props {
     title: string;
     onClick: () => void;
   }

   export const MyComponent: React.FC<Props> = ({ title, onClick }) => {
     return (
       <div className="component-class">
         <h1>{title}</h1>
         <button onClick={onClick}>Click me</button>
       </div>
     );
   };
   ```

3. **状态管理**
   - 使用 Zustand 进行全局状态管理
   - 组件内状态使用 useState

4. **样式规范**
   - 使用 Tailwind CSS
   - 遵循移动优先设计
   - 使用语义化的类名

### 后端 (Go)

1. **文件结构**
   ```
   internal/
   ├── handlers/    # HTTP 处理器
   ├── services/    # 业务逻辑
   ├── models/      # 数据模型
   ├── middleware/  # 中间件
   └── config/      # 配置
   ```

2. **命名规范**
   - 包名：小写，单数形式
   - 文件名：snake_case
   - 函数名：PascalCase (公开) / camelCase (私有)
   - 变量名：camelCase

3. **错误处理**
   ```go
   func GetUser(id string) (*User, error) {
       user, err := userService.FindByID(id)
       if err != nil {
           return nil, fmt.Errorf("failed to get user: %w", err)
       }
       return user, nil
   }
   ```

4. **API 响应格式**
   ```go
   type APIResponse struct {
       Success bool        `json:"success"`
       Data    interface{} `json:"data,omitempty"`
       Message string      `json:"message,omitempty"`
       Error   string      `json:"error,omitempty"`
   }
   ```

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交格式
```
type(scope): description

[optional body]

[optional footer(s)]
```

### 类型 (type)
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化（不影响代码运行）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化

### 作用域 (scope)
- `frontend`: 前端相关
- `backend`: 后端相关
- `docs`: 文档相关
- `config`: 配置相关
- `ui`: UI/UX 相关
- `api`: API 相关

### 示例
```bash
feat(frontend): add user authentication UI
fix(backend): resolve session timeout issue
docs(readme): update installation instructions
refactor(api): simplify user service logic
```

## Pull Request 流程

### 1. 同步主分支
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. 创建功能分支
```bash
git checkout -b feature/your-feature-name
```

### 3. 开发和提交
按照任务管理流程进行开发

### 4. 推送分支
```bash
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

在 GitHub 上创建 PR，确保：
- [ ] 填写完整的 PR 描述
- [ ] 关联相关的 Issue
- [ ] 通过所有 CI 检查
- [ ] 包含对应的任务总结文档
- [ ] 更新相关文档

### 6. 代码审查

- 等待维护者审查
- 根据反馈修改代码
- 保持持续沟通

### 7. 合并

审查通过后，维护者会合并 PR

## 文档维护

### 文档更新原则

1. **同步更新**：代码变更时同步更新相关文档
2. **完整性**：确保文档覆盖所有重要功能
3. **准确性**：文档内容必须与实际代码一致
4. **可读性**：使用清晰的语言和结构

### 需要维护的文档

- **README.md** - 项目总体介绍
- **docs/requirements.md** - 需求分析
- **docs/functional-design.md** - 功能设计
- **docs/implementation.md** - 技术实现
- **docs/ui-design.md** - UI设计
- **docs/roadmap.md** - 发展路线图
- **docs/contribution.md** - 本文档

### 文档审查清单

在每次任务完成后，检查是否需要更新：
- [ ] 功能描述是否准确
- [ ] API 文档是否最新
- [ ] 安装和部署说明是否有效
- [ ] 示例代码是否可运行
- [ ] 链接是否有效

## 测试要求

### 前端测试

1. **单元测试**
   ```bash
   cd frontend
   npm run test
   ```

2. **集成测试**
   ```bash
   npm run test:integration
   ```

3. **E2E 测试**
   ```bash
   npm run test:e2e
   ```

### 后端测试

1. **单元测试**
   ```bash
   cd backend
   go test ./...
   ```

2. **集成测试**
   ```bash
   go test -tags=integration ./...
   ```

### 测试覆盖率

- 前端：最低 80% 覆盖率
- 后端：最低 85% 覆盖率
- 关键业务逻辑：100% 覆盖率

## 发布流程

### 版本号规范

使用 [Semantic Versioning](https://semver.org/)：
- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能性新增
- **PATCH**: 向下兼容的问题修正

### 发布步骤

1. **更新版本号**
2. **生成 CHANGELOG**
3. **创建 Release Tag**
4. **部署到生产环境**
5. **发布公告**

## 社区准则

### 行为准则

1. **尊重他人**：友善、专业的交流
2. **建设性反馈**：提供有用的意见和建议
3. **协作精神**：乐于分享和帮助他人
4. **持续学习**：保持开放的心态

### 沟通渠道

- **GitHub Issues**: Bug 报告和功能请求
- **GitHub Discussions**: 技术讨论和问答
- **Pull Requests**: 代码审查和讨论

## 联系方式

如有疑问，可以通过以下方式联系：

- 创建 [GitHub Issue](链接)
- 参与 [GitHub Discussions](链接)
- 邮件：项目维护者邮箱

## 致谢

感谢所有为项目做出贡献的开发者！你们的参与让番茄时钟变得更好。

---

最后更新：2025-06-28
版本：1.0.0