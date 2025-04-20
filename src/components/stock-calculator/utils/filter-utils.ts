/**
 * 股票回报率计算器 - 筛选工具函数
 */

import { FilterState } from '../components/ResultsFilter';
import { CalculationResult, DayData } from '../types';

/**
 * 筛选数据接口
 */
export interface FilteredData {
  results: CalculationResult[];
  dayData: DayData[];
}

/**
 * 基于筛选条件过滤结果数据
 * @param results 计算结果数组
 * @param filters 筛选条件
 * @returns 筛选后的数据
 */
export function filterResults(results: CalculationResult[], filters?: FilterState): FilteredData {
  if (!results || results.length === 0) {
    return { results: [], dayData: [] };
  }

  // 如果filters为undefined，使用默认值
  const safeFilters: FilterState = filters || {
    selectedPercentage: null,
    selectedDirection: null,
    selectedDay: null,
    showAllDays: true,
  };

  // 筛选结果
  let filteredResults = [...results];

  // 按百分比筛选
  if (safeFilters.selectedPercentage !== null) {
    filteredResults = filteredResults.filter(
      result => result.percentage === safeFilters.selectedPercentage
    );
  }

  // 获取符合条件的日数据
  const allDayData: DayData[] = [];

  filteredResults.forEach(result => {
    // 方向筛选
    if (safeFilters.selectedDirection === '上涨' || safeFilters.selectedDirection === null) {
      const upData = result.upData || [];

      // 天数筛选
      const filteredUpData =
        !safeFilters.showAllDays && safeFilters.selectedDay !== null
          ? upData.filter(day => day.day === safeFilters.selectedDay)
          : upData;

      // 添加额外的结果信息到每个日数据
      filteredUpData.forEach(day => {
        allDayData.push({
          ...day,
          resultPercentage: result.percentage,
          direction: '上涨' as const,
          color: result.color,
        });
      });
    }

    if (safeFilters.selectedDirection === '下跌' || safeFilters.selectedDirection === null) {
      const downData = result.downData || [];

      // 天数筛选
      const filteredDownData =
        !safeFilters.showAllDays && safeFilters.selectedDay !== null
          ? downData.filter(day => day.day === safeFilters.selectedDay)
          : downData;

      // 添加额外的结果信息到每个日数据
      filteredDownData.forEach(day => {
        allDayData.push({
          ...day,
          resultPercentage: result.percentage,
          direction: '下跌' as const,
          color: result.color,
        });
      });
    }
  });

  return {
    results: filteredResults,
    dayData: allDayData,
  };
}
