'use client';

import { CalculationResult, DayData } from '@/components/stock-calculator/types';
import { useMemo } from 'react';

/**
 * 使用卡片视图数据钩子的返回接口
 */
interface UseCardViewDataReturn {
  groupedDayData: Record<
    number,
    {
      upData: DayData[];
      downData: DayData[];
    }
  >;
  percentages: number[];
  hasData: boolean;
}

/**
 * 处理卡片视图数据的自定义Hook
 * 提取筛选数据分组逻辑以提高复用性
 */
export function useCardViewData(
  results: CalculationResult[],
  dayData?: DayData[]
): UseCardViewDataReturn {
  // 根据百分比对筛选后的日数据进行分组
  const groupedDayData = useMemo(() => {
    const grouped: Record<
      number,
      {
        upData: DayData[];
        downData: DayData[];
      }
    > = {};

    // 如果传入了日数据，则按照结果百分比分组
    if (dayData && dayData.length > 0) {
      dayData.forEach(day => {
        if (!day.resultPercentage) return;

        // 确保该百分比的分组存在
        if (!grouped[day.resultPercentage]) {
          grouped[day.resultPercentage] = {
            upData: [],
            downData: [],
          };
        }

        // 根据方向添加到对应的数组
        if (day.direction === '上涨') {
          grouped[day.resultPercentage].upData.push(day);
        } else if (day.direction === '下跌') {
          grouped[day.resultPercentage].downData.push(day);
        }
      });

      return grouped;
    }

    // 如果没有日数据，则直接使用结果数据
    results.forEach(result => {
      grouped[result.percentage] = {
        upData: result.upData || [],
        downData: result.downData || [],
      };
    });

    return grouped;
  }, [results, dayData]);

  // 获取所有百分比并排序
  const percentages = useMemo(
    () =>
      Object.keys(groupedDayData)
        .map(Number)
        .sort((a, b) => a - b),
    [groupedDayData]
  );

  // 判断是否有数据
  const hasData = percentages.length > 0;

  return {
    groupedDayData,
    percentages,
    hasData,
  };
}
