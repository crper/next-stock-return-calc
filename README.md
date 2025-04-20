# 股票投资收益计算工具

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/crper/next-stock-return-calc?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/crper/next-stock-return-calc?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/crper/next-stock-return-calc?style=flat-square)
![GitHub license](https://img.shields.io/github/license/crper/next-stock-return-calc?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/crper/next-stock-return-calc?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15.3.1-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-blue?style=flat-square)

</div>

<p align="center">一个功能丰富、界面友好的股票投资收益计算工具，可根据初始价格和本金，计算股票在不同涨跌幅情况下的价格变化和收益情况。</p>

## 🎯 功能特色

### 基础功能

- 📈 支持设定初始股价和本金计算不同涨跌幅下的收益情况
- 📊 自定义计算天数（1-365天）
- 🧮 自定义涨跌幅范围和步长（0.01%-100%）
- 💰 支持金额单位自动转换（元、万元、亿元）
- 🔢 支持价格和金额的千分位分隔符显示

### 展示方式

- 🎴 卡片视图 - 直观展示每个涨跌幅下的价格变化
- 📋 表格视图 - 以表格形式展示详细数据
- 📉 图表视图 - 可视化趋势分析

### 高级功能

- 📤 导出计算参数和结果
- 📥 导入保存的计算参数
- 📱 响应式设计，适配不同设备
- 🔍 数据过滤和排序功能
- 🔄 高性能虚拟列表，支持大量数据渲染

## 🔧 技术栈

<table>
<tr>
<td align="center">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" width="40" height="40"/><br />
Next.js 15.3
</td>
<td align="center">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="40" height="40"/><br />
React 19
</td>
<td align="center">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40" height="40"/><br />
TypeScript
</td>
<td align="center">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="40" height="40"/><br />
Tailwind CSS 4.1
</td>
</tr>
</table>

- **表单处理**: React Hook Form + Zod
- **图表**: Recharts
- **表格**: TanStack Table
- **虚拟列表**: TanStack Virtual
- **数学计算**: mathjs
- **工具集**: es-toolkit
- **图标**: lucide-react

## 📁 项目结构

```
.
├── src/
│   ├── app/               # 应用路由
│   │   ├── page.tsx       # 首页
│   │   ├── about/         # 关于页面
│   │   └── layout.tsx     # 全局布局
│   ├── components/        # 组件目录
│   │   ├── ui/            # 通用UI组件
│   │   └── stock-calculator/ # 股票计算器相关组件
│   │       ├── components/    # 计算器子组件
│   │       │   ├── data-display/ # 数据展示组件
│   │       │   │   ├── card-view/ # 卡片视图
│   │       │   │   └── table-view/ # 表格视图
│   │       ├── constants/    # 常量定义
│   │       ├── contexts/     # React上下文
│   │       ├── hooks/        # 自定义钩子
│   │       ├── types/        # 类型定义
│   │       └── utils/        # 工具函数
│   └── utils/            # 全局工具函数
├── public/               # 静态资源目录
├── package.json          # 依赖配置
├── postcss.config.mjs    # PostCSS配置
└── tsconfig.json         # TypeScript配置
```

## 🚀 快速开始

### 前置要求

- Node.js 18.17.0 或更高版本
- pnpm 10.x (推荐)、npm 或 yarn

### 克隆仓库

```bash
git clone https://github.com/crper/next-stock-return-calc.git
cd next-stock-return-calc
```

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 使用 npm
npm install

# 使用 yarn
yarn
```

### 开发模式

```bash
# 使用 pnpm
pnpm dev

# 使用 npm
npm run dev

# 使用 yarn
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 构建生产版本

```bash
# 使用 pnpm
pnpm build

# 使用 npm
npm run build

# 使用 yarn
yarn build
```

### 运行生产版本

```bash
# 使用 pnpm
pnpm start

# 使用 npm
npm start

# 使用 yarn
yarn start
```

## 📖 使用说明

1. 在左侧面板输入初始股价和其他参数
2. 点击「计算」按钮获取结果
3. 在右侧面板查看不同展示方式下的结果
4. 可以使用筛选功能按涨跌幅或天数筛选结果
5. 使用导入/导出功能保存或加载计算参数
6. 通过URL参数分享特定计算场景给他人

## 🤝 贡献指南

非常欢迎您为股票投资收益计算工具做出贡献！贡献方式包括但不限于：

1. 报告问题（Issues）
2. 提交功能建议
3. 提交代码修改（Pull Requests）
4. 完善文档

详细的贡献指南请查看 [CONTRIBUTING.md](.github/CONTRIBUTING.md)。

### 开发流程

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的修改 (`git commit -m '添加一些惊人的特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

<div align="center">
  <p>由 <a href="https://github.com/crper">crper</a> 开发和维护</p>
  <p>如果您喜欢这个项目，请考虑给它一个⭐️</p>
</div>
