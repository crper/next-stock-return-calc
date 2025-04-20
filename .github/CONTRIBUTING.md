# 贡献指南

感谢您考虑为股票投资收益计算工具项目做出贡献！这是一个开源项目，我们非常欢迎社区成员的贡献和参与。

## 如何贡献

### 报告问题

如果您发现了问题或有新功能建议，请[提交一个 issue](https://github.com/crper/next-stock-return-calc/issues/new)。请尽可能详细地描述问题或建议，包括：

- 对于问题：描述问题、复现步骤、预期行为和实际行为
- 对于功能建议：描述功能、使用场景和潜在实现方式

### 提交代码

如果您想直接贡献代码，请按照以下步骤操作：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的修改 (`git commit -m '添加一些惊人的特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

### Pull Request 流程

1. 确保您的代码符合项目的代码规范
2. 更新相关文档（如有必要）
3. Pull Request 将由项目维护者审核和合并

## 开发指南

### 环境设置

请确保您的开发环境满足以下要求：

- Node.js 18.17.0 或更高版本
- pnpm 10.x（推荐）或 npm/yarn

### 代码规范

本项目遵循以下代码规范：

- 使用 TypeScript 编写代码，并确保类型完整
- 使用 ES6+ 语法特性
- 遵循 ESLint 配置的代码风格
- 组件和函数长度适中，单一职责原则
- 添加适当的注释和文档

### 提交信息规范

提交信息应遵循以下格式：

```
<类型>: <描述>

[可选的详细描述]

[可选的关闭 issue]
```

类型包括：

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档修改
- `style`: 代码格式修改（不影响代码运行）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

例如：

```
fix: 修复涨跌幅计算精度问题

修复了涨跌幅超过10%时的计算精度问题，使用mathjs库确保精确计算。

Closes #42
```

## 联系方式

如果您有任何疑问，可以通过以下方式联系项目维护者：

- GitHub Issues: https://github.com/crper/next-stock-return-calc/issues
- 邮箱: crper@outlook.com

感谢您的贡献！
