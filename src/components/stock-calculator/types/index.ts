/**
 * 股票回报率计算器 - 类型定义
 */

/**
 * 格式化数字类型
 */
export interface FormattedNumber {
  number: string; // 格式化后的数字字符串
  unit: string; // 单位 (元、万、亿)
  raw: number; // 原始数值
}

/**
 * 每日数据类型
 */
export interface DayData {
  day: number; // 天数
  price: FormattedNumber; // 价格
  percentageTotal: string; // 累计百分比变化
  percentage?: number; // 每日百分比变化
  totalValue?: FormattedNumber; // 总价值 (仅在有初始资金时存在)
  profit?: FormattedNumber; // 盈亏金额 (仅在有初始资金时存在)
  profitPercentage?: string; // 盈亏百分比 (仅在有初始资金时存在)
  shareCount?: number; // 股票数量
  marketValue?: FormattedNumber; // 市场价值

  // 筛选相关字段，在筛选结果中使用
  resultPercentage?: number; // 对应的结果百分比
  direction?: '上涨' | '下跌'; // 涨跌方向
  color?: string; // 颜色值
}

/**
 * 计算结果接口
 */
export interface CalculationResult {
  percentage: number; // 涨跌幅百分比
  formattedPercentage: string; // 格式化后的百分比 (如 "+12.50%")
  newPrice: number; // 新价格
  formattedNewPrice: string; // 格式化后的新价格
  profit: number; // 盈亏金额
  formattedProfit: string; // 格式化后的盈亏金额
  totalValue: number; // 总价值
  formattedTotalValue: string; // 格式化后的总价值
  profitPercentage: number; // 投资收益率
  formattedProfitPercentage: string; // 格式化后的投资收益率
  color: string; // 颜色指示 (上涨、下跌、持平)
  upData: DayData[]; // 上涨数据
  downData: DayData[]; // 下跌数据
}

/**
 * 计算参数接口
 */
export interface CalculationParams {
  initialPrice: number; // 初始价格
  initialCapital: string; // 初始资金
  percentage: number; // 百分比变化
  daysToCalculate: number; // 计算天数
  useUnitConversion: boolean; // 是否使用单位转换
  useThousandsSeparator: boolean; // 是否使用千分位分隔符
}

/**
 * 日计算参数接口
 */
export interface DailyCalculationParams {
  initialPrice: number; // 初始价格
  percentage: number; // 百分比
  days: number; // 天数
  hasCapital: boolean; // 是否有初始资金
  shareCount: number; // 股票数量
  capital: number; // 初始资金
  useUnitConversion: boolean; // 是否使用单位转换
  useThousandsSeparator: boolean; // 是否使用千分位分隔符
}

/**
 * 数据条目参数接口
 */
export interface DataEntryParams {
  day: number; // 天数
  formattedPrice: FormattedNumber; // 格式化后的价格
  percentageTotal: string; // 总百分比
  rawPrice: number; // 原始价格
  hasCapital: boolean; // 是否有初始资金
  shareCount: number; // 股票数量
  capital: number; // 初始资金
  useUnitConversion: boolean; // 是否使用单位转换
  useThousandsSeparator: boolean; // 是否使用千分位分隔符
}

/**
 * 股票计算器表单数据类型
 */
export interface StockCalculatorFormData {
  initialPrice: number | string; // 初始价格
  initialCapital?: string; // 初始资金
  daysToCalculate: number; // 计算天数
  useUnitConversion: boolean; // 是否使用单位转换
  useThousandsSeparator: boolean; // 是否使用千分位分隔符
  minPercentage: number; // 最小百分比
  maxPercentage: number; // 最大百分比
  percentageStep: number; // 百分比步长
}

/**
 * 股票数量计算结果
 */
export interface SharesCalculationResult {
  shares: number; // 可购买的股票数量
  remainingCapital: number; // 剩余资金
}

/**
 * 格式化选项
 */
export interface FormatOptions {
  useUnitConversion: boolean; // 是否使用单位转换
  useThousandsSeparator: boolean; // 是否使用千分位分隔符
}
