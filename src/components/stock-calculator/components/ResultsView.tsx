'use client';

import { LoadingSpinner, TabView } from '@/components/ui';
import { LayoutGrid, LineChart, Table } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useCalculation } from '../contexts';
import { filterResults } from '../utils';
import { CardView, ChartView, TableView } from './data-display';
import DataIO from './DataIO';
import ResultsFilter, { FilterState } from './ResultsFilter';

/**
 * 结果视图组件
 * 显示计算结果，支持卡片视图、表格视图和图表视图
 */
export default function ResultsView() {
  const { deferredResults, isLoading, isCalculating, error } = useCalculation();

  // 筛选状态
  const [filters, setFilters] = useState<FilterState>({
    selectedPercentage: null,
    selectedDirection: null,
    selectedDay: null,
    showAllDays: true,
  });

  // 筛选状态变更处理
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    console.log('筛选条件变更: ', newFilters);
    setFilters(newFilters);
  }, []);

  // 使用useMemo缓存Tab视图，减少不必要的重新渲染
  const tabTitles = useMemo(() => ['卡片视图', '表格视图', '图表视图'], []);
  const tabIcons = useMemo(
    () => [
      <LayoutGrid key="card" className="h-5 w-5" />,
      <Table key="table" className="h-5 w-5" />,
      <LineChart key="chart" className="h-5 w-5" />,
    ],
    []
  );

  // 根据筛选条件过滤结果
  const filteredData = useMemo(() => {
    if (!deferredResults || deferredResults.length === 0) {
      return { results: [], dayData: [] };
    }
    return filterResults(deferredResults, filters);
  }, [deferredResults, filters]);

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <LoadingSpinner
          size="lg"
          variant="border"
          color="primary"
          label={isCalculating ? '正在计算中，请稍候...' : '加载结果中...'}
        />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md"
          role="alert"
        >
          <div className="flex items-center mb-2">
            <LoadingSpinner size="sm" variant="pulse" color="error" className="mr-2" />
            <strong className="font-bold text-lg">计算错误</strong>
          </div>
          <p className="block">{error}</p>
          <p className="mt-3 text-sm">请检查输入参数并重试</p>
        </div>
      </div>
    );
  }

  // 无结果状态
  if (!deferredResults || deferredResults.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-500 space-y-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
        </div>
        <p className="text-lg font-medium">尚无计算结果，请输入参数点击计算</p>
        <div className="flex flex-col items-center text-sm max-w-md text-center space-y-2 bg-gray-50 p-4 rounded-lg">
          <p>1. 在左侧面板中输入初始价格和本金</p>
          <p>2. 选择涨跌幅范围和计算天数</p>
          <p>3. 点击&quot;计算&quot;按钮查看结果</p>
        </div>
      </div>
    );
  }

  // 有结果状态，显示Tab视图
  return (
    <div className="flex flex-col h-full">
      {/* 结果操作栏 */}
      <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* 筛选区域 - 占据主要空间 */}
          <div className="flex-grow border-b sm:border-b-0 sm:border-r border-gray-200">
            <ResultsFilter
              onFilterChange={handleFilterChange}
              className="border-none shadow-none rounded-none"
            />
          </div>

          {/* 导入导出区域 - 紧凑展示 */}
          <div className="p-3 flex items-center justify-center">
            <DataIO />
          </div>
        </div>
      </div>

      {/* 结果内容 */}
      <div className="flex-1 flex flex-col min-h-[500px]">
        <TabView
          titles={tabTitles}
          icons={tabIcons}
          defaultIndex={0}
          id="results-tab-view"
          persistState={true}
          onTabChange={index => {
            console.log('标签页切换到: ', index, tabTitles[index]);
          }}
          className="h-full"
        >
          <div className="h-full">
            <CardView results={filteredData.results} dayData={filteredData.dayData} />
          </div>
          <div className="h-full">
            <TableView results={filteredData.results} dayData={filteredData.dayData} />
          </div>
          <div className="h-full">
            <ChartView results={filteredData.results} />
          </div>
        </TabView>
      </div>
    </div>
  );
}
