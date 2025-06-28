# Caddy 配置文件使用说明

本项目为番茄时钟应用提供了灵活的 Caddy 反向代理配置，支持开发环境和生产环境的不同需求。

## 配置文件说明

| 文件名 | 用途 | 特性 |
|-------|------|------|
| `Caddyfile` | 配置指南 + 默认开发配置 | 基础开发环境配置，包含详细说明 |
| `Caddyfile.dev` | 开发环境专用 | 禁用 HTTPS，调试日志，多端口访问 |
| `Caddyfile.prod` | 生产环境专用 | 自动 HTTPS，安全头部，限流保护 |

## 快速开始

### 开发环境

```bash
# 1. 启动所有服务（使用默认配置）
docker-compose up -d

# 2. 访问应用
open http://localhost

# 3. 查看日志
docker-compose logs -f caddy
```

### 生产环境

```bash
# 1. 设置环境变量
export DOMAIN_NAME=your-domain.com
export ADMIN_EMAIL=your-email@example.com

# 2. 启动生产环境
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 3. 验证 HTTPS 证书
docker-compose exec caddy caddy list-certificates
```

## 配置切换

### 方法 1：Docker Compose 覆盖

```bash
# 开发环境
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 生产环境
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 方法 2：符号链接

```bash
# 切换到开发配置
ln -sf Caddyfile.dev Caddyfile.active

# 切换到生产配置
ln -sf Caddyfile.prod Caddyfile.active

# 在 docker-compose.yml 中使用
# volumes:
#   - ./Caddyfile.active:/etc/caddy/Caddyfile
```

### 方法 3：运行时重新加载

```bash
# 重新加载为开发配置
docker-compose exec caddy caddy reload --config /etc/caddy/Caddyfile.dev

# 重新加载为生产配置
docker-compose exec caddy caddy reload --config /etc/caddy/Caddyfile.prod
```

## 环境差异对比

| 特性 | 开发环境 | 生产环境 |
|------|----------|----------|
| HTTPS | 禁用 | 自动启用 |
| 日志输出 | 控制台 | 文件 + 轮转 |
| 安全头部 | 基础 | 完整 |
| 限流保护 | 无 | 启用 |
| 健康检查 | 无 | 启用 |
| 缓存策略 | 无 | 优化 |
| 管理接口 | 启用 | 禁用 |

## 自定义配置

### 修改域名

编辑 `Caddyfile.prod`：

```caddyfile
# 将以下行修改为您的域名
your-domain.com {
    # 配置内容...
}
```

### 添加 SSL 证书邮箱

编辑 `Caddyfile.prod` 全局配置：

```caddyfile
{
    auto_https on
    email your-email@example.com  # 修改为您的邮箱
}
```

### 调整安全策略

根据应用需求修改 `Content-Security-Policy`：

```caddyfile
header {
    Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline';"
}
```

## 故障排除

### 检查配置语法

```bash
# 验证配置文件语法
docker-compose exec caddy caddy validate --config /etc/caddy/Caddyfile.prod
```

### 查看当前配置

```bash
# 查看当前生效的配置
docker-compose exec caddy caddy config --pretty
```

### 查看证书状态

```bash
# 查看 SSL 证书
docker-compose exec caddy caddy list-certificates
```

### 重新申请证书

```bash
# 强制重新申请证书
docker-compose exec caddy caddy reload --force
```

## 监控和日志

### 访问日志

生产环境的访问日志位于容器内 `/var/log/caddy/access.log`：

```bash
# 查看访问日志
docker-compose exec caddy tail -f /var/log/caddy/access.log

# 查看错误日志
docker-compose exec caddy tail -f /var/log/caddy/error.log
```

### 性能监控

Caddy 提供了内置的指标接口（开发环境）：

```bash
# 访问 Caddy 指标
curl http://localhost:2019/metrics
```

## 最佳实践

1. **开发环境**：使用 `Caddyfile.dev` 进行本地开发，享受简化的配置和详细的调试信息
2. **测试环境**：使用 `Caddyfile.prod` 进行预生产测试，确保配置正确
3. **生产环境**：使用 `Caddyfile.prod` 并设置正确的域名和邮箱
4. **配置管理**：将域名和邮箱等信息通过环境变量或 `.env` 文件管理
5. **日志监控**：在生产环境中定期检查日志文件，设置日志轮转策略

## 安全注意事项

1. 生产环境建议禁用 Caddy 管理接口
2. 定期更新 Caddy 镜像版本
3. 根据应用需求调整 CSP 策略
4. 配置适当的限流规则
5. 定期备份 SSL 证书和配置文件 