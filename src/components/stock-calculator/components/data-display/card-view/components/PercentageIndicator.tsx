'use client';

import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import { memo } from 'react';

/**
 * 百分比指示器组件属性接口
 */
interface PercentageIndicatorProps {
  percentage: number;
}

/**
 * 中间百分比指示组件 - 提取为单独组件以优化性能
 */
const PercentageIndicator = memo(({ percentage }: PercentageIndicatorProps) => (
  <div className="col-span-1 md:col-span-2 p-3 bg-white border-l border-r border-gray-200 text-center h-[300px] overflow-hidden">
    <div className="h-full flex flex-col justify-center items-center rounded-md py-3 bg-gray-50">
      <div className="text-xs text-gray-500 mb-2">预期变化</div>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center text-red-600">
          <ArrowUpToLine className="h-4 w-4 mr-1" />
          <span className="text-sm font-semibold">+{percentage.toFixed(2)}%</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-200 my-1"></div>
        <div className="flex items-center text-green-600">
          <ArrowDownToLine className="h-4 w-4 mr-1" />
          <span className="text-sm font-semibold">-{percentage.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  </div>
));

PercentageIndicator.displayName = 'PercentageIndicator';

export default PercentageIndicator;
