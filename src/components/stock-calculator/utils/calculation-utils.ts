import {
  add,
  divide,
  formatAmountWithUnit,
  formatCurrency,
  formatPercentage,
  multiply,
  subtract,
} from '@/utils';

// 定义股票计算结果类型
export interface StockCalculationResult {
  percentage: number;
  initialPrice: number;
  newPrice: number;
  priceChange: number;
  quantity: number;
  initialInvestment: number;
  newValue: number;
  profit: number;
  profitPercentage: number;
  formattedPercentage: string;
  formattedProfitPercentage: string;
  formattedInitialInvestment: string;
  formattedNewValue: string;
  formattedProfit: string;
  formattedPriceWithUnit: string;
  isProfitable: boolean;
}

/**
 * 计算股票在不同涨跌幅情况下的价格和收益
 * @param {number} currentPrice - 当前价格
 * @param {number} quantity - 持有数量
 * @param {number[]} percentages - 涨跌幅百分比数组
 * @returns {StockCalculationResult[]} 计算结果数组
 */
export const calculateStockReturns = (
  currentPrice: number,
  quantity: number,
  percentages: number[]
): StockCalculationResult[] => {
  const initialInvestment = multiply(currentPrice, quantity);

  return percentages.map(percentage => {
    // 使用精确计算的乘法和加法
    const priceChange = multiply(currentPrice, percentage);
    const newPrice = add(currentPrice, priceChange);

    // 计算新的总价值和盈亏
    const newValue = multiply(newPrice, quantity);
    const profit = subtract(newValue, initialInvestment);

    // 计算盈亏比例
    const profitPercentage = divide(profit, initialInvestment);

    return {
      percentage,
      initialPrice: currentPrice,
      newPrice,
      priceChange,
      quantity,
      initialInvestment,
      newValue,
      profit,
      profitPercentage,
      formattedPercentage: formatPercentage(percentage),
      formattedProfitPercentage: formatPercentage(profitPercentage),
      formattedInitialInvestment: formatCurrency(initialInvestment),
      formattedNewValue: formatCurrency(newValue),
      formattedProfit: formatCurrency(profit),
      formattedPriceWithUnit: formatAmountWithUnit(newPrice),
      isProfitable: profit > 0,
    };
  });
};

// 定义导出对象
const calculationUtils = {
  calculateStockReturns,
};

export default calculationUtils;
