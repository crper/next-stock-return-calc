'use client';

import { DayData } from '@/components/stock-calculator/types';
import { memo } from 'react';
import DataSection from './DataSection';
import PercentageCardHeader from './PercentageCardHeader';
import PercentageIndicator from './PercentageIndicator';

/**
 * 百分比卡片属性接口
 */
export interface PercentageCardProps {
  percentage: number;
  upData: DayData[];
  downData: DayData[];
}

/**
 * 百分比卡片组件 - 包含上涨和下跌数据区域
 */
const PercentageCard = memo(({ percentage, upData, downData }: PercentageCardProps) => (
  <div className="rounded-lg shadow overflow-hidden border border-gray-200 h-full">
    {/* 百分比标题栏 */}
    <PercentageCardHeader percentage={percentage} />

    {/* 三栏布局：上涨情况 - 中间说明 - 下跌情况 */}
    <div className="grid grid-cols-1 md:grid-cols-12 h-full">
      {/* 左侧：上涨情况 */}
      <DataSection
        title="上涨情况"
        data={upData}
        isUp={true}
        percentage={percentage}
        isEmptyText="无上涨数据"
      />

      {/* 中间：价格变化说明 */}
      <PercentageIndicator percentage={percentage} />

      {/* 右侧：下跌情况 */}
      <DataSection
        title="下跌情况"
        data={downData}
        isUp={false}
        percentage={percentage}
        isEmptyText="无下跌数据"
      />
    </div>
  </div>
));

PercentageCard.displayName = 'PercentageCard';

export default PercentageCard;
