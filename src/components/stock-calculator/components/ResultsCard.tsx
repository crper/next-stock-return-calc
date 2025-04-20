'use client';

import { DayData, FormattedNumber } from '@/components/stock-calculator/types';
import { ArrowDown, ArrowUp, Calendar, DollarSign, Percent } from 'lucide-react';
import { memo, useMemo } from 'react';

/**
 * 结果卡片属性接口
 */
interface ResultCardProps {
  data: DayData;
  isUp: boolean;
  percentage: number;
}

/**
 * 数据项组件 - 提取为单独组件以优化性能
 */
const DataItem = memo(
  ({
    label,
    value,
    icon,
    className = '',
  }: {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    className?: string;
  }) => (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center justify-center w-6 h-6 mr-2 text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
);

DataItem.displayName = 'DataItem';

/**
 * 趋势指示器组件 - 提取为单独组件以优化性能
 */
const TrendIndicator = memo(({ isUp }: { isUp: boolean }) => (
  <div
    className={`absolute top-0 right-0 w-0 h-0
    border-t-0 border-l-[24px] border-r-0
    ${
      isUp
        ? 'border-b-[24px] border-b-red-100 border-l-transparent'
        : 'border-b-[24px] border-b-green-100 border-l-transparent'
    }`}
  >
    <div className={`absolute top-1 -right-2 text-xs ${isUp ? 'text-red-600' : 'text-green-600'}`}>
      {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
    </div>
  </div>
));

TrendIndicator.displayName = 'TrendIndicator';

/**
 * 格式化FormattedNumber对象为字符串
 */
const formatNumberWithUnit = (formatted: FormattedNumber) => {
  return `${formatted.number} ${formatted.unit}`;
};

/**
 * 结果卡片组件
 * 展示单日的计算结果数据
 * @param {ResultCardProps} props - 组件属性
 */
const ResultCard = memo(({ data, isUp, percentage }: ResultCardProps) => {
  // 计算是否有盈亏数据
  const hasProfitData = data.marketValue !== undefined && data.profit !== undefined;

  // 计算价格变化
  const percentageChange = useMemo(() => {
    if (data.percentageTotal) {
      return data.percentageTotal;
    }
    return isUp ? `+${percentage.toFixed(2)}%` : `-${percentage.toFixed(2)}%`;
  }, [data.percentageTotal, isUp, percentage]);

  // 确定盈亏颜色
  const getProfitColor = () => {
    if (!data.profit) return 'text-gray-700';

    const profitValue = parseFloat(data.profit.number);
    if (profitValue > 0) return 'text-red-600';
    if (profitValue < 0) return 'text-green-600';
    return 'text-gray-700';
  };

  return (
    <div
      className={`relative bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden
      ${isUp ? 'hover:border-red-200' : 'hover:border-green-200'}`}
    >
      {/* 趋势指示器 */}
      <TrendIndicator isUp={isUp} />

      {/* 标题与日期 */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${isUp ? 'bg-red-500' : 'bg-green-500'}`}
          ></div>
          <h4 className="text-sm font-medium text-gray-800">{`第 ${data.day} 天`}</h4>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={12} className="mr-1" />
          <span>{`Day ${data.day}`}</span>
        </div>
      </div>

      {/* 价格信息区域 */}
      <div className="grid grid-cols-1 gap-2 mb-3">
        <div className="flex items-center justify-between">
          <DataItem
            label="当前价格"
            value={formatNumberWithUnit(data.price)}
            icon={<DollarSign size={14} />}
          />
          <div className={`flex items-center ${isUp ? 'text-red-500' : 'text-green-500'}`}>
            {isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="text-xs ml-1">{percentageChange}</span>
          </div>
        </div>

        {data.totalValue && (
          <div className="flex justify-between">
            <DataItem
              label="总价值"
              value={formatNumberWithUnit(data.totalValue)}
              icon={<DollarSign size={14} />}
            />
            <DataItem
              label="累计变化"
              value={percentageChange}
              icon={<Percent size={14} />}
              className={isUp ? 'text-red-600' : 'text-green-600'}
            />
          </div>
        )}
      </div>

      {/* 市值信息区域 - 仅在有市值数据时显示 */}
      {hasProfitData && (
        <div className={`mt-2 pt-2 border-t ${isUp ? 'border-red-100' : 'border-green-100'}`}>
          <div className="flex justify-between">
            <DataItem
              label="市场价值"
              value={formatNumberWithUnit(data.marketValue!)}
              icon={<DollarSign size={14} />}
            />
            {data.profit && (
              <div className="text-right">
                <span className="text-xs text-gray-500 block">盈亏</span>
                <span className={`text-sm font-medium ${getProfitColor()}`}>
                  {formatNumberWithUnit(data.profit)}
                </span>
              </div>
            )}
          </div>
          {data.profitPercentage && (
            <div className="mt-2 text-right">
              <span className="text-xs text-gray-500 mr-1">收益率:</span>
              <span className={`text-sm font-semibold ${isUp ? 'text-red-600' : 'text-green-600'}`}>
                {data.profitPercentage}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ResultCard.displayName = 'ResultCard';

export default ResultCard;
