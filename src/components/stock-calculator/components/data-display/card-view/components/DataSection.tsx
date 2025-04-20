'use client';

import ResultCard from '@/components/stock-calculator/components/ResultsCard';
import { DayData } from '@/components/stock-calculator/types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import { memo, useRef } from 'react';

/**
 * 数据区域组件属性接口
 */
interface DataSectionProps {
  title: string;
  data: DayData[];
  isUp: boolean;
  percentage: number;
  isEmptyText: string;
}

/**
 * 数据区域组件 - 上涨或下跌的卡片区域
 */
const DataSection = memo(({ title, data, isUp, percentage, isEmptyText }: DataSectionProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // 创建虚拟列表实例
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160, // 估计卡片高度
    overscan: 3, // 预加载的项目数量
    scrollPaddingEnd: 8,
    scrollPaddingStart: 8,
  });

  return (
    <div
      className={`col-span-1 md:col-span-5 p-3 border-${isUp ? 'r' : 'l'} border-gray-200 bg-white h-[300px] overflow-hidden`}
    >
      <div className={`flex items-center mb-2 ${isUp ? 'text-red-600' : 'text-green-600'}`}>
        <div className={`w-1 h-4 ${isUp ? 'bg-red-500' : 'bg-green-500'} rounded-full mr-2`}></div>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>

      {data.length > 0 ? (
        <div ref={parentRef} className="h-[250px] overflow-y-auto overflow-x-hidden pr-2">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => (
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
                <div className="p-2 my-1">
                  <ResultCard
                    key={`${isUp ? 'up' : 'down'}-${percentage}-${data[virtualRow.index].day}`}
                    data={data[virtualRow.index]}
                    isUp={isUp}
                    percentage={percentage}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[250px] text-gray-400 bg-gray-50 rounded-md">
          <div className={`p-2 rounded-full ${isUp ? 'bg-red-50' : 'bg-green-50'} mb-2`}>
            {isUp ? (
              <ArrowUpToLine className="h-5 w-5 text-gray-400" />
            ) : (
              <ArrowDownToLine className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-center">{isEmptyText}</p>
        </div>
      )}
    </div>
  );
});

DataSection.displayName = 'DataSection';

export default DataSection;
