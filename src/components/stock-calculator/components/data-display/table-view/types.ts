import { CalculationResult, DayData } from '@/components/stock-calculator/types';

/**
 * 表格视图属性
 */
export interface TableViewProps {
  /** 计算结果数组 */
  results: CalculationResult[];
  /** 经过筛选的日数据数组 */
  dayData?: DayData[];
}

/**
 * 表格行数据类型
 */
export interface TableRow {
  /** 行ID */
  id: string;
  /** 天数 */
  day: number;
  /** 方向 (上涨/下跌) */
  direction: '上涨' | '下跌';
  /** 百分比 */
  percentage: number;
  /** 价格 */
  price: string;
  /** 价格单位 */
  priceUnit: string;
  /** 累计百分比 */
  percentageTotal: string;
  /** 市场价值 */
  marketValue?: string;
  /** 市场价值单位 */
  marketValueUnit?: string;
  /** 盈亏 */
  profit?: string;
  /** 盈亏单位 */
  profitUnit?: string;
  /** 收益率 */
  profitPercentage?: string;
  /** 原始数据 */
  _raw: DayData;
}

/**
 * 表格过滤器状态
 */
export interface TableFilterState {
  /** 选中的百分比 */
  selectedPercentage: number | null;
  /** 选中的方向 */
  selectedDirection: '上涨' | '下跌' | null;
  /** 是否显示所有天数 */
  showAllDays: boolean;
  /** 选中的天数 */
  selectedDay: number | null;
  /** 全局搜索词 */
  searchTerm: string;
  /** 是否显示过滤面板 */
  showFilterPanel: boolean;
}
