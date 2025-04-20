import { CalculationResult } from '@/components/stock-calculator/types';
import { useCallback, useMemo } from 'react';
import { TableFilterState, TableRow } from './types';

/**
 * 表格数据处理钩子
 * 负责将计算结果数据转换为表格数据并处理过滤
 */
export const useTableData = (results: CalculationResult[], filters: TableFilterState) => {
  /**
   * 将计算结果转换为表格行数据
   */
  const convertToTableRows = useCallback((results: CalculationResult[]): TableRow[] => {
    if (!results || results.length === 0) return [];

    const rows: TableRow[] = [];

    results.forEach(result => {
      // 处理上涨数据
      if (result.upData) {
        result.upData.forEach(day => {
          rows.push({
            id: `up-${result.percentage}-${day.day}`,
            day: day.day,
            direction: '上涨',
            percentage: result.percentage,
            price: day.price.number,
            priceUnit: day.price.unit,
            percentageTotal: day.percentageTotal,
            marketValue: day.marketValue?.number,
            marketValueUnit: day.marketValue?.unit,
            profit: day.profit?.number,
            profitUnit: day.profit?.unit,
            profitPercentage: day.profitPercentage,
            _raw: day,
          });
        });
      }

      // 处理下跌数据
      if (result.downData) {
        result.downData.forEach(day => {
          rows.push({
            id: `down-${result.percentage}-${day.day}`,
            day: day.day,
            direction: '下跌',
            percentage: result.percentage,
            price: day.price.number,
            priceUnit: day.price.unit,
            percentageTotal: day.percentageTotal,
            marketValue: day.marketValue?.number,
            marketValueUnit: day.marketValue?.unit,
            profit: day.profit?.number,
            profitUnit: day.profit?.unit,
            profitPercentage: day.profitPercentage,
            _raw: day,
          });
        });
      }
    });

    return rows;
  }, []);

  /**
   * 应用过滤器到表格数据
   */
  const applyFilters = useCallback((rows: TableRow[], filters: TableFilterState): TableRow[] => {
    return rows.filter(row => {
      // 过滤百分比
      if (filters.selectedPercentage !== null && row.percentage !== filters.selectedPercentage) {
        return false;
      }

      // 过滤方向
      if (filters.selectedDirection !== null && row.direction !== filters.selectedDirection) {
        return false;
      }

      // 过滤天数
      if (!filters.showAllDays && filters.selectedDay !== null && row.day !== filters.selectedDay) {
        return false;
      }

      return true;
    });
  }, []);

  // 转换原始数据为表格行
  const allRows = useMemo(() => convertToTableRows(results), [results, convertToTableRows]);

  // 应用过滤器
  const filteredRows = useMemo(
    () => applyFilters(allRows, filters),
    [allRows, filters, applyFilters]
  );

  // 可用的过滤器选项
  const filterOptions = useMemo(() => {
    if (allRows.length === 0) return { percentages: [], days: [] };

    const percentagesSet = new Set<number>();
    const daysSet = new Set<number>();

    allRows.forEach(row => {
      percentagesSet.add(row.percentage);
      daysSet.add(row.day);
    });

    return {
      percentages: Array.from(percentagesSet).sort((a, b) => a - b),
      days: Array.from(daysSet).sort((a, b) => a - b),
    };
  }, [allRows]);

  return {
    rows: filteredRows,
    allRows,
    filterOptions,
  };
};
