import StockCalculator from '@/components/stock-calculator';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 页面标题和介绍 */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">股票收益计算器</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          一款专业的股票投资回报计算工具，帮助您分析不同涨跌幅情景下的收益变化
        </p>
      </div>

      {/* 计算器区域 */}
      <Glassmorphism className="p-6 sm:p-8 max-w-7xl mx-auto shadow-lg hover-lift">
        <StockCalculator />
      </Glassmorphism>

      {/* 功能特点介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">
        {featureCards.map(feature => (
          <Glassmorphism key={feature.title} className="p-6 hover-lift" intensity="light">
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
                {feature.description}
              </p>
            </div>
          </Glassmorphism>
        ))}
      </div>
    </div>
  );
}

const featureCards = [
  {
    title: '多视图展示',
    description: '支持表格、卡片和图表三种视图方式，满足不同场景需求',
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    title: '高性能计算',
    description: '采用虚拟滚动技术，轻松处理大量数据，提供流畅的用户体验',
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    title: '精确分析',
    description: '精确计算不同涨跌幅场景下的股票价格和收益变化，辅助投资决策',
    icon: <BarChart3 className="w-6 h-6" />,
  },
];
