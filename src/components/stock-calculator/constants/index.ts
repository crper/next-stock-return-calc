/**
 * 股票回报率计算器 - 常量定义
 */

// 颜色常量
export const COLORS = {
  UP: '#16a34a', // 上涨颜色 (绿色)
  DOWN: '#dc2626', // 下跌颜色 (红色)
  NEUTRAL: '#6b7280', // 持平颜色 (灰色)
};

// 价格单位
export const UNITS = {
  DEFAULT: '元',
  THOUSAND: '万',
  MILLION: '亿',
};

// 单位换算阈值
export const UNIT_THRESHOLDS = {
  THOUSAND: 10000, // 万元阈值
  MILLION: 100000000000, // 千亿阈值
};

// 表单默认值
export const DEFAULT_FORM_VALUES = {
  initialPrice: '10', // 初始价格
  initialCapital: '1000000', // 初始资金
  daysToCalculate: 15, // 计算天数
  useUnitConversion: true, // 使用单位换算
  useThousandsSeparator: true, // 使用千分位分隔符
  minPercentage: 5, // 最小百分比
  maxPercentage: 30, // 最大百分比
  percentageStep: 5, // 百分比步长
};

// 表单验证限制
export const FORM_LIMITS = {
  MIN_PRICE: 0.01, // 最小价格
  MAX_PRICE: 1000000, // 最大价格
  MIN_CAPITAL: 0, // 最小资金
  MAX_CAPITAL: 1000000000, // 最大资金
  MIN_DAYS: 1, // 最小天数
  MAX_DAYS: 365, // 最大天数
  MIN_PERCENTAGE: 0.01, // 最小百分比
  MAX_PERCENTAGE: 100, // 最大百分比
  MIN_STEP: 0.01, // 最小步长
  MAX_STEP: 10, // 最大步长
};
