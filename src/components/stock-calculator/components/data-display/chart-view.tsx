'use client';

import { CalculationResult } from '@/components/stock-calculator/types';
import { LoadingSpinner } from '@/components/ui';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * 图表视图组件的属性
 * @typedef {Object} ChartViewProps
 * @property {CalculationResult[]} results - 计算结果数组
 */
export type ChartViewProps = {
  results: CalculationResult[];
};

/**
 * 图表数据类型
 */
type ChartData = {
  day: number;
  [key: string]: number | string;
};

/**
 * 图表类型选项
 */
type ChartType = 'price' | 'percentage' | 'marketValue' | 'profit';

/**
 * 图表样式选项
 */
type ChartStyle = 'line' | 'area' | 'composed';

/**
 * 图表视图组件
 * 使用折线图、面积图或复合图展示股票价格和收益变化趋势
 * @param {ChartViewProps} props - 组件属性
 */
const ChartView: React.FC<ChartViewProps> = ({ results }) => {
  // 添加调试日志
  useEffect(() => {
    console.log('ChartView渲染: ', {
      resultsLength: results?.length || 0,
      hasData: Boolean(results && results.length > 0),
      firstResultHasUpData: results && results.length > 0 ? Boolean(results[0]?.upData) : false,
      firstResultHasDownData: results && results.length > 0 ? Boolean(results[0]?.downData) : false,
    });
  }, [results]);

  const [chartType, setChartType] = useState<ChartType>('price');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('line');

  // 获取可用的天数范围
  const maxDays = useMemo(
    () => (results && results.length > 0 && results[0]?.upData ? results[0].upData.length : 0),
    [results]
  );

  // 添加调试日志
  useEffect(() => {
    console.log('ChartView计算的天数: ', maxDays);
  }, [maxDays]);

  const days = useMemo(() => Array.from({ length: maxDays || 0 }, (_, i) => i + 1), [maxDays]);

  // 准备图表数据
  const chartData = useMemo(() => {
    if (!results || results.length === 0 || maxDays === 0) {
      // 如果没有实际数据，返回一些默认数据点以保证图表能够渲染
      return Array.from({ length: 5 }, (_, i) => ({ day: i + 1 }));
    }

    return days.map(day => {
      const dayIndex = day - 1;
      const dataPoint: ChartData = { day };

      results.forEach(result => {
        // 确保结果包含有效的数据
        if (
          !result.upData ||
          !result.downData ||
          !result.upData[dayIndex] ||
          !result.downData[dayIndex]
        )
          return;

        try {
          const upData = result.upData[dayIndex];
          const downData = result.downData[dayIndex];

          // 根据选择的图表类型添加数据
          if (chartType === 'price') {
            // 确保能解析为数字
            const upPrice =
              typeof upData.price.number === 'string'
                ? parseFloat(upData.price.number.replace(/[^0-9.-]+/g, ''))
                : upData.price.number;

            const downPrice =
              typeof downData.price.number === 'string'
                ? parseFloat(downData.price.number.replace(/[^0-9.-]+/g, ''))
                : downData.price.number;

            dataPoint[`上涨${result.percentage}%`] = upPrice || 0;
            dataPoint[`下跌${result.percentage}%`] = downPrice || 0;
          } else if (chartType === 'percentage') {
            const upPercentage =
              typeof upData.percentageTotal === 'string'
                ? parseFloat(upData.percentageTotal.replace(/[^0-9.-]+/g, ''))
                : upData.percentageTotal;

            const downPercentage =
              typeof downData.percentageTotal === 'string'
                ? parseFloat(downData.percentageTotal.replace(/[^0-9.-]+/g, ''))
                : downData.percentageTotal;

            dataPoint[`上涨${result.percentage}%`] = upPercentage || 0;
            dataPoint[`下跌${result.percentage}%`] = downPercentage || 0;
          } else if (chartType === 'marketValue' && upData.totalValue && downData.totalValue) {
            const upValue =
              typeof upData.totalValue.number === 'string'
                ? parseFloat(upData.totalValue.number.replace(/[^0-9.-]+/g, ''))
                : upData.totalValue.number;

            const downValue =
              typeof downData.totalValue.number === 'string'
                ? parseFloat(downData.totalValue.number.replace(/[^0-9.-]+/g, ''))
                : downData.totalValue.number;

            dataPoint[`上涨${result.percentage}%`] = upValue || 0;
            dataPoint[`下跌${result.percentage}%`] = downValue || 0;
          } else if (chartType === 'profit' && upData.profit && downData.profit) {
            const upProfit =
              typeof upData.profit.number === 'string'
                ? parseFloat(upData.profit.number.replace(/[^0-9.-]+/g, ''))
                : upData.profit.number;

            const downProfit =
              typeof downData.profit.number === 'string'
                ? parseFloat(downData.profit.number.replace(/[^0-9.-]+/g, ''))
                : downData.profit.number;

            dataPoint[`上涨${result.percentage}%`] = upProfit || 0;
            dataPoint[`下跌${result.percentage}%`] = downProfit || 0;
          }
        } catch (err) {
          console.error('图表数据处理错误:', err);
        }
      });

      return dataPoint;
    });
  }, [results, days, chartType, maxDays]);

  // 添加调试日志
  useEffect(() => {
    console.log('ChartView生成的图表数据: ', {
      chartDataLength: chartData.length,
      sampleData: chartData.length > 0 ? chartData[0] : null,
    });
  }, [chartData]);

  // 生成图表线条
  const chartLines = useMemo(() => {
    if (!results || results.length === 0) return [];

    // 生成颜色
    const generateColor = (percentage: number, isUp: boolean) => {
      const baseColor = isUp ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)';
      const opacity = 0.5 + (percentage / 10) * 0.5; // 根据百分比调整不透明度
      return baseColor.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
    };

    // 创建线条数组
    return results.flatMap(result => [
      {
        dataKey: `上涨${result.percentage}%`,
        stroke: generateColor(result.percentage, true),
        fill: `rgba(239, 68, 68, 0.1)`,
        type: chartStyle === 'composed' ? 'monotone' : undefined,
      },
      {
        dataKey: `下跌${result.percentage}%`,
        stroke: generateColor(result.percentage, false),
        fill: `rgba(34, 197, 94, 0.1)`,
        type: chartStyle === 'composed' ? 'monotone' : undefined,
      },
    ]);
  }, [results, chartStyle]);

  // 添加调试日志
  useEffect(() => {
    console.log('ChartView生成的线条: ', {
      chartLinesLength: chartLines.length,
      sampleLine: chartLines.length > 0 ? chartLines[0] : null,
    });
  }, [chartLines]);

  // 图表类型选项
  const chartTypeOptions = useMemo(
    () => [
      { value: 'price', label: '价格' },
      { value: 'percentage', label: '涨跌幅' },
      {
        value: 'marketValue',
        label: '市值',
        disabled:
          !results?.length || !results[0]?.upData?.length || !results[0]?.upData[0]?.totalValue,
      },
      {
        value: 'profit',
        label: '盈亏',
        disabled: !results?.length || !results[0]?.upData?.length || !results[0]?.upData[0]?.profit,
      },
    ],
    [results]
  );

  // 图表样式选项
  const chartStyleOptions = useMemo(
    () => [
      { value: 'line', label: '线图' },
      { value: 'area', label: '面积图' },
      { value: 'composed', label: '复合图' },
    ],
    []
  );

  // 获取Y轴标签
  const getYAxisLabel = useCallback(() => {
    switch (chartType) {
      case 'price':
        return '价格 (元)';
      case 'percentage':
        return '涨跌幅 (%)';
      case 'marketValue':
        return '市值';
      case 'profit':
        return '盈亏';
      default:
        return '';
    }
  }, [chartType]);

  // 缓存Y轴标签
  const yAxisLabel = useMemo(() => getYAxisLabel(), [getYAxisLabel]);

  // 获取提示框单位
  const getTooltipUnit = useCallback(() => {
    switch (chartType) {
      case 'price':
        return '元';
      case 'percentage':
        return '%';
      case 'marketValue':
        return (
          (results &&
            results.length > 0 &&
            results[0]?.upData &&
            results[0].upData[0]?.totalValue?.unit) ||
          '元'
        );
      case 'profit':
        return (
          (results &&
            results.length > 0 &&
            results[0]?.upData &&
            results[0].upData[0]?.profit?.unit) ||
          '元'
        );
      default:
        return '';
    }
  }, [chartType, results]);

  // 缓存提示框单位
  const tooltipUnit = useMemo(() => getTooltipUnit(), [getTooltipUnit]);

  // 渲染图表
  const renderChart = useCallback(() => {
    // 添加调试日志
    console.log('渲染图表调用，数据长度: ', chartData.length);

    if (!chartData.length || (chartData.length > 0 && Object.keys(chartData[0]).length <= 1)) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10 bg-white rounded-xl border border-gray-100">
          <LoadingSpinner variant="pulse" color="info" size="md" className="mb-4" />
          <p className="text-gray-500 font-medium">暂无符合筛选条件的数据</p>
        </div>
      );
    }

    // 根据选择的图表样式渲染不同类型的图表
    switch (chartStyle) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              name="天数"
              label={{ value: '天数', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: number) => [`${value} ${tooltipUnit}`, '']}
              labelFormatter={label => `第 ${label} 天`}
            />
            <Legend />
            {chartLines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                activeDot={{ r: 6 }}
                dot={{ r: 2 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              name="天数"
              label={{ value: '天数', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: number) => [`${value} ${tooltipUnit}`, '']}
              labelFormatter={label => `第 ${label} 天`}
            />
            <Legend />
            {chartLines.map((line, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                fillOpacity={0.1}
                fill={line.fill}
              />
            ))}
          </AreaChart>
        );

      case 'composed':
        return (
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              name="天数"
              label={{ value: '天数', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: number) => [`${value} ${tooltipUnit}`, '']}
              labelFormatter={label => `第 ${label} 天`}
            />
            <Legend />
            {chartLines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                activeDot={{ r: 4 }}
              />
            ))}
            {chartLines.map((line, index) => (
              <Scatter key={`scatter-${index}`} dataKey={line.dataKey} fill={line.stroke} />
            ))}
          </ComposedChart>
        );

      default:
        return (
          <div className="flex items-center justify-center p-10 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 font-medium">请选择有效的图表类型</p>
          </div>
        );
    }
  }, [chartData, chartLines, chartStyle, tooltipUnit, yAxisLabel]);

  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* 图表控制区 */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-4">
          {/* 图表类型选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">图表内容</label>
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              {chartTypeOptions.map(option => (
                <button
                  key={option.value}
                  className={clsx(
                    'px-3 py-1.5 text-sm font-medium',
                    chartType === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => !option.disabled && setChartType(option.value as ChartType)}
                  disabled={option.disabled}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 图表样式选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">图表样式</label>
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              {chartStyleOptions.map(option => (
                <button
                  key={option.value}
                  className={clsx(
                    'px-3 py-1.5 text-sm font-medium',
                    chartStyle === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={() => setChartStyle(option.value as ChartStyle)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 图表显示区 */}
      <div className="flex-1 min-h-[400px] flex flex-col bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        {(!results || results.length === 0) && (
          <div className="flex flex-col items-center justify-center p-4 text-gray-500 h-full">
            <LoadingSpinner variant="dots" color="secondary" size="md" className="mb-3" />
            <p>暂无数据，请先计算或更改筛选条件</p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartView;
