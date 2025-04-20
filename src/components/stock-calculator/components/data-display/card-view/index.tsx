'use client';

import { CalculationResult, DayData } from '@/components/stock-calculator/types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useRef } from 'react';
import { EmptyView, PercentageCard } from './components';
import { useCardViewData } from './hooks/useCardViewData';

/**
 * 卡片视图属性接口
 */
export interface CardViewProps {
  results: CalculationResult[];
  dayData?: DayData[];
}

/**
 * 卡片视图组件
 * 使用卡片方式展示计算结果，基于筛选后的数据
 * 使用虚拟列表提高大量数据下的性能
 */
const CardView = memo(({ results, dayData = [] }: CardViewProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // 使用自定义hook处理数据
  const { groupedDayData, percentages, hasData } = useCardViewData(results, dayData);

  // 创建虚拟列表
  const rowVirtualizer = useVirtualizer({
    count: percentages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320, // 固定高度为320px
    overscan: 2, // 预加载项目数量
    scrollPaddingEnd: 16,
    scrollPaddingStart: 16,
  });

  // 无数据显示
  if (!hasData) {
    return <EmptyView />;
  }

  return (
    <div className="h-[calc(100vh-350px)] overflow-hidden">
      <div ref={parentRef} className="h-full w-full overflow-y-auto overflow-x-hidden">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const percentage = percentages[virtualRow.index];
            const { upData, downData } = groupedDayData[percentage];

            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <PercentageCard percentage={percentage} upData={upData} downData={downData} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

CardView.displayName = 'CardView';

export default CardView;
