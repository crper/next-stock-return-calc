import { Glassmorphism } from '@/components/ui/glassmorphism';
import { getAssetPath } from '@/utils/path-utils';
import {
  BarChart3,
  ChevronLeft,
  Code,
  Coffee,
  GitBranchPlus,
  LineChart,
  Settings,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { chunkArray } from '../utils';

// 特性数据
const features = [
  { id: 1, name: '设定初始股价和本金' },
  { id: 2, name: '自定义计算天数（1-365天）' },
  { id: 3, name: '自定义涨跌幅范围（0.01%-100%）' },
  { id: 4, name: '自定义涨跌幅步长' },
  { id: 5, name: '支持金额单位自动转换' },
  { id: 6, name: '支持千分位分隔符显示' },
];

// 使用 es-toolkit 的 chunk 函数分组数据
const featureGroups = chunkArray(features, 3);

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">关于本计算器</h1>
            <p className="text-gray-600 dark:text-gray-400">
              股票投资收益计算工具 - 帮助投资者分析价格波动对收益的影响
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1 px-4 py-2 bg-white/10 backdrop-blur-sm text-blue-600 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>

        {/* 主要内容 */}
        <Glassmorphism className="p-6 md:p-8 mb-8">
          <div className="prose max-w-none dark:prose-invert">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              工具介绍
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              这是一款专为股票投资者设计的收益计算工具，可以根据初始价格和本金，模拟计算不同涨跌幅情况下的价格变化和收益情况。
              无论是新手还是有经验的投资者，都可以通过这个工具更直观地了解投资风险和回报。
            </p>
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              主要功能
            </h2>
            {/* 功能特性卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Glassmorphism intensity="light" className="p-4">
                <h3 className="flex items-center gap-2 text-lg font-medium text-blue-600 mb-3">
                  <GitBranchPlus className="w-4 h-4" />
                  基础计算功能
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {featureGroups[0].map(feature => (
                    <li key={feature.id} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {feature.name}
                    </li>
                  ))}
                </ul>
              </Glassmorphism>

              <Glassmorphism intensity="light" className="p-4">
                <h3 className="flex items-center gap-2 text-lg font-medium text-blue-600 mb-3">
                  <LineChart className="w-4 h-4" />
                  丰富的展示方式
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    卡片视图 - 直观展示涨跌情况
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    表格视图 - 详细数据对比
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    图表视图 - 趋势可视化分析
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    支持自定义筛选条件
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    支持虚拟滚动加载大量数据
                  </li>
                </ul>
              </Glassmorphism>
            </div>
            <Glassmorphism intensity="light" className="p-4 mb-8">
              <h3 className="flex items-center gap-2 text-lg font-medium text-blue-600 mb-3">
                <Settings className="w-4 h-4" />
                高级功能
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  导出计算参数 - 保存自定义设置
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  导出计算结果 - 支持CSV格式
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  导入参数 - 快速恢复之前的计算
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  响应式设计 - 适配不同屏幕尺寸
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  高精度计算 - 使用mathjs解决精度问题
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  性能优化 - 支持大数据量流畅渲染
                </li>
              </ul>
            </Glassmorphism>
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <LineChart className="w-5 h-5 text-blue-600" />
              性能亮点
            </h2>
            <Glassmorphism intensity="light" className="p-4 mb-8">
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <strong>高性能渲染</strong> - 使用虚拟列表技术，支持大量数据渲染
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <strong>精确计算</strong> - 使用专业数学库确保计算精度
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <strong>组件优化</strong> - 使用React.memo减少不必要的重渲染
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <strong>缓存计算</strong> - 使用useMemo缓存计算结果提高性能
                </li>
              </ul>
            </Glassmorphism>
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              使用说明
            </h2>
            <Glassmorphism intensity="light" className="p-4 mb-8">
              <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs mt-0.5">
                    1
                  </span>
                  在左侧面板输入初始股价和其他参数
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs mt-0.5">
                    2
                  </span>
                  点击「计算」按钮获取结果
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs mt-0.5">
                    3
                  </span>
                  在右侧面板查看不同展示方式下的结果
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs mt-0.5">
                    4
                  </span>
                  可以使用筛选功能按涨跌幅或天数筛选结果
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs mt-0.5">
                    5
                  </span>
                  使用导入/导出功能保存或加载计算参数
                </li>
              </ol>
            </Glassmorphism>
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              免责声明
            </h2>
            <Glassmorphism intensity="light" className="p-4 mb-8 border-l-4 border-yellow-400">
              <p className="text-gray-700 dark:text-gray-300">
                本计算器仅供参考，不构成任何投资建议。股票投资有风险，请投资者根据自身情况谨慎决策。
                计算结果基于简化模型，真实市场可能受到多种因素影响而与计算结果不同。
              </p>
            </Glassmorphism>
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Code className="w-5 h-5 text-blue-600" />
              技术支持
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              本项目为开源项目，基于MIT许可证。如有问题或建议，欢迎在GitHub仓库提交issue或贡献代码。
            </p>
            <Glassmorphism intensity="light" className="p-4">
              <h3 className="flex items-center gap-2 text-lg font-medium text-blue-600 mb-3">
                <Code className="w-4 h-4" />
                开发技术
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  前端框架: Next.js 15.3
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  UI库: React 19
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  类型系统: TypeScript
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  样式: Tailwind CSS 4.1
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  表单处理: React Hook Form + Zod
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  数据可视化: Recharts
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  表格处理: TanStack Table
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  虚拟列表: TanStack Virtual
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  数学计算: mathjs
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  工具集: es-toolkit
                </div>
              </div>
            </Glassmorphism>
            <h2 className="flex items-center gap-2 text-xl font-semibold mt-8 mb-4">
              <Coffee className="w-5 h-5 text-blue-600" />
              打赏支持
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              如果您觉得这个工具对您有所帮助，可以考虑请开发者喝杯咖啡，这将是对我们持续维护和优化的最大动力。
            </p>
            <Glassmorphism intensity="light" className="p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-medium text-blue-600 mb-4">支付宝</h3>
                  <div className="relative w-80 h-80 overflow-hidden rounded-xl mb-2 border-2 border-blue-100 dark:border-blue-900 transition-transform hover:scale-105 flex items-center justify-center p-3">
                    <Image
                      src={getAssetPath('/images/sponsor/sponsor_alipay.jpg')}
                      alt="支付宝打赏码"
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">支付宝扫码打赏</p>
                </div>

                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-medium text-blue-600 mb-4">微信支付</h3>
                  <div className="relative w-80 h-80 overflow-hidden rounded-xl mb-2 border-2 border-blue-100 dark:border-blue-900 transition-transform hover:scale-105 flex items-center justify-center p-3">
                    <Image
                      src={getAssetPath('/images/sponsor/sponsor_wechat.jpg')}
                      alt="微信打赏码"
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">微信扫码打赏</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                感谢您的支持，我们将持续优化工具体验！
              </p>
            </Glassmorphism>
          </div>
        </Glassmorphism>
      </div>
    </div>
  );
}
