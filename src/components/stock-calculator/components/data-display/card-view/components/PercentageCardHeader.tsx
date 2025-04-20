'use client';

import { memo } from 'react';

/**
 * 百分比标题组件属性接口
 */
interface PercentageCardHeaderProps {
  percentage: number;
}

/**
 * 百分比标题组件 - 提取为单独组件以优化性能
 */
const PercentageCardHeader = memo(({ percentage }: PercentageCardHeaderProps) => (
  <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 py-1 px-4 border-b border-gray-200">
    <h2 className="text-lg font-semibold text-center text-gray-800">
      {percentage.toFixed(2)}% 涨跌幅
    </h2>
  </div>
));

PercentageCardHeader.displayName = 'PercentageCardHeader';

export default PercentageCardHeader;
