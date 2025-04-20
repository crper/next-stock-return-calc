'use client';

import { DataExportImport } from '@/components/ui';
import { useCalculation } from '../contexts/CalculationContext';
import { StockCalculatorFormData } from '../types';

/**
 * 数据导出导入组件
 * 处理股票计算器数据的导入导出功能
 */
export default function DataIO() {
  const { currentFormData, deferredResults, handleImport } = useCalculation();

  // 导出数据为JSON
  const exportParamsToJsonFn = (data: StockCalculatorFormData): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('参数导出失败:', error);
      return '';
    }
  };

  // 导出结果为CSV
  const exportResultsToCsvFn = (results: Record<string, unknown>[]): string => {
    if (!results || results.length === 0) return '';

    try {
      // 创建CSV表头
      let csvContent = '百分比,方向,天数,价格,单位\n';

      // 添加每行数据
      results.forEach(result => {
        // 处理上涨数据
        const upData = result.upData as Array<{
          day: number;
          price: { number: number; unit: string };
        }>;
        if (upData && Array.isArray(upData)) {
          upData.forEach(day => {
            if (day && day.price) {
              csvContent += `${result.percentage},上涨,${day.day},${day.price.number},${day.price.unit}\n`;
            }
          });
        }

        // 处理下跌数据
        const downData = result.downData as Array<{
          day: number;
          price: { number: number; unit: string };
        }>;
        if (downData && Array.isArray(downData)) {
          downData.forEach(day => {
            if (day && day.price) {
              csvContent += `${result.percentage},下跌,${day.day},${day.price.number},${day.price.unit}\n`;
            }
          });
        }
      });

      return csvContent;
    } catch (error) {
      console.error('结果导出失败:', error);
      return '';
    }
  };

  // 导入JSON数据
  const importFromJsonFn = (jsonStr: string): StockCalculatorFormData | null => {
    try {
      const data = JSON.parse(jsonStr);

      // 详细验证数据结构
      if (
        typeof data !== 'object' ||
        data === null ||
        data.daysToCalculate === undefined ||
        data.minPercentage === undefined ||
        data.maxPercentage === undefined ||
        typeof data.daysToCalculate !== 'number' ||
        typeof data.minPercentage !== 'number' ||
        typeof data.maxPercentage !== 'number'
      ) {
        throw new Error('无效的数据格式');
      }

      return data as StockCalculatorFormData;
    } catch (error) {
      console.error('导入数据解析失败:', error);
      return null;
    }
  };

  return (
    <DataExportImport<StockCalculatorFormData, Record<string, unknown>>
      exportData={currentFormData}
      exportResults={deferredResults as unknown as Record<string, unknown>[]}
      onImport={handleImport}
      exportParamsToJson={exportParamsToJsonFn}
      exportResultsToCsv={exportResultsToCsvFn}
      importFromJson={importFromJsonFn}
      paramsFilePrefix="股票计算参数"
      resultsFilePrefix="股票计算结果"
    />
  );
}
