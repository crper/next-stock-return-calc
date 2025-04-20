/**
 * 股票回报率计算器 - 核心计算函数
 */

import * as math from 'mathjs';
import {
  CalculationParams,
  CalculationResult,
  DailyCalculationParams,
  DataEntryParams,
  DayData,
  SharesCalculationResult,
} from '../types';
import { determineColor, formatNumber, formatPercentage, generatePercentages } from './formatters';

/**
 * 计算可购买的股票数量
 * @param capital 初始资金
 * @param price 股票价格
 * @returns 股票数量和剩余资金
 */
export function calculateShares(capital: number, price: number): SharesCalculationResult {
  if (capital <= 0 || price <= 0) {
    return { shares: 0, remainingCapital: capital };
  }

  // 计算可购买的股票数量 (向下取整，不允许购买部分股票)
  const shares = Math.floor(capital / price);

  // 计算剩余资金
  const remainingCapital = capital - shares * price;

  return { shares, remainingCapital };
}

/**
 * 使用精确计算方法计算价格变化
 * @param initialPrice 初始价格
 * @param percentage 百分比变化
 * @param days 天数
 * @returns 新价格
 */
export function calculatePriceWithPrecision(
  initialPrice: number,
  percentage: number,
  days: number
): number {
  try {
    // 计算单日变化因子
    const dailyFactor = 1 + percentage / 100;

    // 使用BigNumber进行精确计算，避免浮点数精度问题
    const initialPriceBN = math.bignumber(initialPrice);
    const dailyFactorBN = math.bignumber(dailyFactor);

    // 计算复合增长: initialPrice * (1 + percentage/100)^days
    const newPriceBN = math.multiply(initialPriceBN, math.pow(dailyFactorBN, days));

    // 转换回普通数字并保留精度
    return parseFloat(math.format(newPriceBN, { precision: 10 }));
  } catch (error) {
    console.error('价格计算出错:', error);
    // 发生错误时使用简单的计算作为备选
    return initialPrice * Math.pow(1 + percentage / 100, days);
  }
}

/**
 * 创建数据条目
 * @param params 数据条目参数
 * @returns 天数据对象
 */
export function createDataEntry({
  day,
  formattedPrice,
  percentageTotal,
  rawPrice,
  hasCapital,
  shareCount,
  capital,
  useUnitConversion,
  useThousandsSeparator,
}: DataEntryParams): DayData {
  // 基本数据条目
  const entry: DayData = {
    day,
    price: formattedPrice,
    percentageTotal,
    percentage: parseFloat(percentageTotal.replace(/[+%]/g, '')),
  };

  // 如果有初始资金，计算总价值、盈亏额和盈亏百分比
  if (hasCapital && shareCount > 0) {
    // 计算总价值和盈亏额
    const totalValue = shareCount * rawPrice;
    const profit = totalValue - capital;

    // 计算投资收益率
    const profitPercentage = capital > 0 ? (profit / capital) * 100 : 0;

    // 添加到条目中
    entry.totalValue = formatNumber(totalValue, {
      useUnitConversion,
      useThousandsSeparator,
    });
    entry.profit = formatNumber(profit, {
      useUnitConversion,
      useThousandsSeparator,
    });
    entry.profitPercentage = formatPercentage(profitPercentage);
  }

  return entry;
}

/**
 * 计算价格变化序列
 * @param params 日计算参数
 * @returns 天数据数组
 */
export function calculatePriceChanges({
  initialPrice,
  percentage,
  days,
  hasCapital,
  shareCount,
  capital,
  useUnitConversion,
  useThousandsSeparator,
}: DailyCalculationParams): DayData[] {
  const result: DayData[] = [];

  for (let day = 1; day <= days; day++) {
    // 计算第day天的价格，考虑复利效应
    const currentPrice = calculatePriceWithPrecision(initialPrice, percentage, day);

    // 计算累计变化百分比
    const totalChange = ((currentPrice - initialPrice) / initialPrice) * 100;
    const percentageTotal = formatPercentage(totalChange);

    // 格式化价格
    const formattedPrice = formatNumber(currentPrice, {
      useUnitConversion,
      useThousandsSeparator,
    });

    // 创建并添加数据条目
    result.push(
      createDataEntry({
        day,
        formattedPrice,
        percentageTotal,
        rawPrice: currentPrice,
        hasCapital,
        shareCount,
        capital,
        useUnitConversion,
        useThousandsSeparator,
      })
    );
  }

  return result;
}

/**
 * 计算单个百分比变化的结果
 * @param params 计算参数
 * @returns 计算结果
 */
export function calculateResult({
  initialPrice,
  initialCapital,
  percentage,
  daysToCalculate,
  useUnitConversion,
  useThousandsSeparator,
}: CalculationParams): CalculationResult {
  try {
    // 转换输入参数
    const validCapital =
      initialCapital && !isNaN(parseFloat(initialCapital)) ? parseFloat(initialCapital) : 0;

    // 使用BigNumber精确计算
    const initialPriceBN = math.bignumber(initialPrice);
    const percentageBN = math.bignumber(percentage);
    const validCapitalBN = math.bignumber(validCapital);

    // 计算股票数量和剩余资金
    const { shares } = calculateShares(validCapital, initialPrice);
    const sharesBN = math.bignumber(shares);

    // 计算新价格：initialPrice * (1 + percentage/100)
    const factorBN = math.add(1, math.divide(percentageBN, 100));
    const newPriceBN = math.multiply(initialPriceBN, factorBN);

    // 精确计算市值和利润
    const totalValueBN = math.multiply(sharesBN, newPriceBN);
    const profitBN = math.subtract(totalValueBN, validCapitalBN);

    // 计算投资收益率
    const profitPercentageBN =
      validCapital > 0
        ? math.multiply(math.divide(profitBN, validCapitalBN), 100)
        : math.bignumber(0);

    // 确定颜色
    const color = determineColor(percentage);

    // 转换回原始数字类型并格式化，确保精度
    const newPrice = parseFloat(math.format(newPriceBN, { precision: 10 }));
    const totalValue = parseFloat(math.format(totalValueBN, { precision: 10 }));
    const profit = parseFloat(math.format(profitBN, { precision: 10 }));
    const profitPercentage = parseFloat(math.format(profitPercentageBN, { precision: 10 }));

    // 更精确的格式化，保留足够的小数位
    const formattedNewPrice = parseFloat(newPrice.toFixed(4));
    const formattedTotalValue = parseFloat(totalValue.toFixed(2));
    const formattedProfit = parseFloat(profit.toFixed(2));
    const formattedProfitPercentage = parseFloat(profitPercentage.toFixed(4));

    // 计算每日数据
    const upData = calculatePriceChanges({
      initialPrice,
      percentage,
      days: daysToCalculate,
      hasCapital: validCapital > 0,
      shareCount: shares,
      capital: validCapital,
      useUnitConversion,
      useThousandsSeparator,
    });

    const downData = calculatePriceChanges({
      initialPrice,
      percentage: -percentage,
      days: daysToCalculate,
      hasCapital: validCapital > 0,
      shareCount: shares,
      capital: validCapital,
      useUnitConversion,
      useThousandsSeparator,
    });

    // 返回最终结果对象
    return {
      percentage,
      formattedPercentage: formatPercentage(percentage),
      newPrice: formattedNewPrice,
      formattedNewPrice: formatNumber(formattedNewPrice, {
        useUnitConversion,
        useThousandsSeparator,
      }).number,
      profit: formattedProfit,
      formattedProfit: formatNumber(formattedProfit, {
        useUnitConversion,
        useThousandsSeparator,
      }).number,
      totalValue: formattedTotalValue,
      formattedTotalValue: formatNumber(formattedTotalValue, {
        useUnitConversion,
        useThousandsSeparator,
      }).number,
      profitPercentage: formattedProfitPercentage,
      formattedProfitPercentage: formatPercentage(formattedProfitPercentage),
      upData,
      downData,
      color,
    };
  } catch (error) {
    console.error('结果计算出错:', error);
    throw new Error('计算结果时发生错误');
  }
}

/**
 * 计算所有涨幅百分比的结果
 * @param initialPrice 初始价格
 * @param initialCapital 初始资金
 * @param daysToCalculate 计算天数
 * @param useUnitConversion 是否使用单位转换
 * @param useThousandsSeparator 是否使用千位分隔符
 * @param minPercentage 最小百分比
 * @param maxPercentage 最大百分比
 * @param percentageStep 百分比步长
 * @returns 所有计算结果
 */
export function calculateAllResults(
  initialPrice: number,
  initialCapital: string,
  daysToCalculate: number = 15,
  useUnitConversion: boolean = false,
  useThousandsSeparator: boolean = true,
  minPercentage: number = 5,
  maxPercentage: number = 30,
  percentageStep: number = 5
): CalculationResult[] {
  try {
    // 验证输入参数
    if (initialPrice <= 0) {
      throw new Error('初始价格必须大于0');
    }

    if (daysToCalculate <= 0) {
      throw new Error('计算天数必须大于0');
    }

    if (minPercentage >= maxPercentage) {
      throw new Error('最小百分比必须小于最大百分比');
    }

    if (percentageStep <= 0) {
      throw new Error('百分比步长必须大于0');
    }

    // 生成百分比序列
    const percentages = generatePercentages(minPercentage, maxPercentage, percentageStep);

    // 计算并收集所有结果
    return percentages.map(percentage => {
      return calculateResult({
        initialPrice,
        initialCapital,
        percentage,
        daysToCalculate,
        useUnitConversion,
        useThousandsSeparator,
      });
    });
  } catch (error) {
    console.error('批量计算出错:', error);
    throw error;
  }
}
