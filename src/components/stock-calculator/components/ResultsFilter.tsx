'use client';

import clsx from 'clsx';
import { Check, ChevronDown, FilterX } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCalculation } from '../contexts';

/**
 * 筛选状态接口
 */
export interface FilterState {
  selectedPercentage: number | null;
  selectedDirection: '上涨' | '下跌' | null;
  selectedDay: number | null;
  showAllDays: boolean;
}

/**
 * 筛选组件属性接口
 */
interface ResultsFilterProps {
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

/**
 * 通用结果筛选组件
 * 提供百分比、方向和天数的筛选功能
 */
export default function ResultsFilter({ onFilterChange, className = '' }: ResultsFilterProps) {
  const { deferredResults } = useCalculation();

  // 筛选状态
  const [filters, setFilters] = useState<FilterState>({
    selectedPercentage: null,
    selectedDirection: null,
    selectedDay: null,
    showAllDays: true,
  });

  // 筛选下拉菜单状态
  const [isPercentageOpen, setIsPercentageOpen] = useState(false);
  const [isDaysOpen, setIsDaysOpen] = useState(false);

  // 引用DOM元素的ref
  const percentageDropdownRef = useRef<HTMLDivElement>(null);
  const daysDropdownRef = useRef<HTMLDivElement>(null);

  // 从结果中提取可用的百分比和天数
  const filterOptions = useMemo(() => {
    if (!deferredResults || deferredResults.length === 0) {
      return {
        percentages: [],
        days: [],
      };
    }

    // 提取唯一的百分比值
    const percentages = [...new Set(deferredResults.map(result => result.percentage))].sort(
      (a, b) => a - b
    );

    // 获取天数（假设所有结果的天数相同）
    let days: number[] = [];
    if (deferredResults[0]?.upData?.length) {
      days = deferredResults[0].upData.map(day => day.day);
    }

    return { percentages, days };
  }, [deferredResults]);

  // 添加点击外部关闭下拉菜单的逻辑
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // 处理百分比下拉菜单
      if (
        isPercentageOpen &&
        percentageDropdownRef.current &&
        !percentageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPercentageOpen(false);
      }

      // 处理天数下拉菜单
      if (
        isDaysOpen &&
        daysDropdownRef.current &&
        !daysDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDaysOpen(false);
      }
    }

    // 添加全局点击事件监听器
    document.addEventListener('mousedown', handleClickOutside);

    // 清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPercentageOpen, isDaysOpen]);

  // 当筛选条件改变时，通知父组件
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // 重置所有筛选条件
  const resetFilters = () => {
    setFilters({
      selectedPercentage: null,
      selectedDirection: null,
      selectedDay: null,
      showAllDays: true,
    });
  };

  // 处理百分比选择
  const handlePercentageSelect = (percentage: number | null) => {
    setFilters(prev => ({
      ...prev,
      selectedPercentage: percentage,
    }));
    setIsPercentageOpen(false);
  };

  // 处理方向选择
  const handleDirectionChange = (direction: '上涨' | '下跌' | null) => {
    setFilters(prev => ({
      ...prev,
      selectedDirection: direction,
    }));
  };

  // 处理显示所有天数切换
  const handleShowAllDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      showAllDays: e.target.checked,
      selectedDay: e.target.checked ? null : prev.selectedDay,
    }));
  };

  // 处理天数选择
  const handleDaySelect = (day: number | null) => {
    setFilters(prev => ({
      ...prev,
      selectedDay: day,
      showAllDays: day === null,
    }));
    setIsDaysOpen(false);
  };

  return (
    <div
      className={clsx('bg-white rounded-lg border border-gray-200 p-3 shadow-sm w-full', className)}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
          筛选
          {(filters.selectedPercentage !== null ||
            filters.selectedDirection !== null ||
            !filters.showAllDays ||
            filters.selectedDay !== null) && (
            <button
              className="inline-flex items-center text-xs text-red-500 hover:text-red-600 ml-2"
              onClick={resetFilters}
            >
              <FilterX className="h-3.5 w-3.5 mr-1" />
              重置
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* 百分比筛选 - 更紧凑设计 */}
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">百分比:</span>
          <div className="relative" ref={percentageDropdownRef}>
            <button
              type="button"
              className={clsx(
                'inline-flex justify-between items-center rounded-md border px-2 py-1 text-xs',
                'bg-white shadow-sm focus:outline-none',
                filters.selectedPercentage !== null
                  ? 'border-blue-500 text-blue-700'
                  : 'border-gray-200 text-gray-700'
              )}
              onClick={() => setIsPercentageOpen(!isPercentageOpen)}
            >
              {filters.selectedPercentage !== null ? `${filters.selectedPercentage}%` : '全部'}
              <ChevronDown className="h-3 w-3 ml-1" />
            </button>

            {isPercentageOpen && (
              <div className="absolute left-0 z-[100] mt-1 max-h-60 w-32 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div
                  className={clsx(
                    'flex items-center justify-between px-3 py-1 text-xs cursor-pointer hover:bg-gray-100',
                    filters.selectedPercentage === null
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700'
                  )}
                  onClick={() => handlePercentageSelect(null)}
                >
                  全部
                  {filters.selectedPercentage === null && (
                    <Check className="h-3 w-3 text-blue-600" />
                  )}
                </div>
                {filterOptions.percentages.map(percentage => (
                  <div
                    key={percentage}
                    className={clsx(
                      'flex items-center justify-between px-3 py-1 text-xs cursor-pointer hover:bg-gray-100',
                      filters.selectedPercentage === percentage
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700'
                    )}
                    onClick={() => handlePercentageSelect(percentage)}
                  >
                    {percentage}%
                    {filters.selectedPercentage === percentage && (
                      <Check className="h-3 w-3 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 方向筛选 - 更紧凑设计 */}
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">方向:</span>
          <div className="flex items-center space-x-1">
            <button
              className={clsx(
                'px-2 py-1 text-xs rounded-l-md border',
                filters.selectedDirection === '上涨'
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
              onClick={() =>
                handleDirectionChange(filters.selectedDirection === '上涨' ? null : '上涨')
              }
            >
              上涨
            </button>
            <button
              className={clsx(
                'px-2 py-1 text-xs rounded-r-md border',
                filters.selectedDirection === '下跌'
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
              onClick={() =>
                handleDirectionChange(filters.selectedDirection === '下跌' ? null : '下跌')
              }
            >
              下跌
            </button>
          </div>
        </div>

        {/* 天数筛选 - 更紧凑设计 */}
        <div className="flex items-center ml-auto">
          <span className="text-xs text-gray-500 mr-2">天数:</span>
          <div className="flex items-center gap-1">
            <input
              id="show-all-days"
              type="checkbox"
              checked={filters.showAllDays}
              onChange={handleShowAllDaysChange}
              className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="show-all-days" className="text-xs text-gray-500 mr-2">
              全部
            </label>

            <div className="relative" ref={daysDropdownRef}>
              <button
                type="button"
                className={clsx(
                  'inline-flex justify-between items-center rounded-md border px-2 py-1 text-xs',
                  'bg-white shadow-sm focus:outline-none',
                  !filters.showAllDays
                    ? 'border-blue-500 text-blue-700'
                    : 'border-gray-200 text-gray-600',
                  filters.showAllDays && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !filters.showAllDays && setIsDaysOpen(!isDaysOpen)}
                disabled={filters.showAllDays}
              >
                {filters.selectedDay !== null ? `第 ${filters.selectedDay} 天` : '选择天数'}
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>

              {isDaysOpen && !filters.showAllDays && (
                <div className="absolute right-0 z-[100] mt-1 max-h-60 w-32 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {filterOptions.days.map(day => (
                    <div
                      key={day}
                      className={clsx(
                        'flex items-center justify-between px-3 py-1 text-xs cursor-pointer hover:bg-gray-100',
                        filters.selectedDay === day ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      )}
                      onClick={() => handleDaySelect(day)}
                    >
                      第 {day} 天
                      {filters.selectedDay === day && <Check className="h-3 w-3 text-blue-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
