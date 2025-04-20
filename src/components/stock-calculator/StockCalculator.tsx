'use client';

// 直接从文件导入组件，避免从索引导入
import CalculatorForm from './components/CalculatorForm';
import ResultsView from './components/ResultsView';
import { CalculationProvider } from './contexts/CalculationContext';

/**
 * 股票回报率计算组件内容
 * 使用上下文数据
 */
function StockCalculatorContent() {
  return (
    <div className="w-full max-w-full mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* 左侧参数输入面板 */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto  bg-gray-50">
          <CalculatorForm />
        </div>

        {/* 右侧结果展示面板 */}
        <div className="w-full md:w-2/3 lg:w-3/4 overflow-y-auto p-4 bg-white">
          <ResultsView />
        </div>
      </div>
    </div>
  );
}

/**
 * 股票回报率计算组件
 * 提供股票价格涨跌计算功能，可根据初始价格、初始本金计算不同涨跌幅下的收益情况
 */
export default function StockCalculator() {
  return (
    <CalculationProvider>
      <StockCalculatorContent />
    </CalculationProvider>
  );
}
