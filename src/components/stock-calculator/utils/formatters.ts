/**
 * 股票回报率计算器 - 格式化工具函数
 */

import { COLORS, UNIT_THRESHOLDS, UNITS } from '../constants';
import { FormatOptions, FormattedNumber } from '../types';

/**
 * 格式化百分比，添加符号和保留小数位
 * @param percentage 百分比数值
 * @param decimals 小数位数
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(percentage: number, decimals: number = 2): string {
  // 确保精度，避免JavaScript浮点数精度问题
  const roundedPercentage =
    Math.round(percentage * Math.pow(10, decimals)) / Math.pow(10, decimals);

  // 确定符号
  const sign = roundedPercentage > 0 ? '+' : roundedPercentage < 0 ? '-' : '';

  // 格式化为固定小数位的字符串
  const formattedValue = Math.abs(roundedPercentage).toFixed(decimals);

  return `${sign}${formattedValue}%`;
}

/**
 * 应用千分位分隔符
 * @param value 数值
 * @returns 添加千分位分隔符后的字符串
 */
export function applyThousandsSeparator(value: number | string): string {
  const numStr = typeof value === 'string' ? value : value.toString();

  // 处理小数部分和整数部分
  const parts = numStr.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 如果有小数部分，添加回去
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
}

/**
 * 转换数字为带单位的格式
 * @param value 数值
 * @param options 格式化选项
 * @returns 格式化后的数字对象
 */
export function formatNumber(
  value: number,
  { useUnitConversion, useThousandsSeparator }: FormatOptions
): FormattedNumber {
  // 处理0或者NaN的情况
  if (value === 0 || isNaN(value)) {
    return {
      number: '0',
      unit: UNITS.DEFAULT,
      raw: 0,
    };
  }

  let formattedValue = value;
  let unit = UNITS.DEFAULT;

  // 应用单位转换
  if (useUnitConversion) {
    if (Math.abs(value) >= UNIT_THRESHOLDS.MILLION) {
      formattedValue = value / UNIT_THRESHOLDS.MILLION;
      unit = UNITS.MILLION;
    } else if (Math.abs(value) >= UNIT_THRESHOLDS.THOUSAND) {
      formattedValue = value / UNIT_THRESHOLDS.THOUSAND;
      unit = UNITS.THOUSAND;
    }
  }

  // 保留适当的小数位
  let decimalPlaces = 2;
  if (Math.abs(formattedValue) < 0.01) decimalPlaces = 5;
  else if (Math.abs(formattedValue) < 1) decimalPlaces = 4;
  else if (Math.abs(formattedValue) < 10) decimalPlaces = 3;

  let numberString = formattedValue.toFixed(decimalPlaces);

  // 移除末尾多余的0
  numberString = numberString.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');

  // 应用千分位分隔符
  if (useThousandsSeparator) {
    numberString = applyThousandsSeparator(numberString);
  }

  return {
    number: numberString,
    unit,
    raw: value,
  };
}

/**
 * 根据百分比确定颜色
 * @param percentage 百分比值
 * @returns 对应的颜色代码
 */
export function determineColor(percentage: number): string {
  if (percentage > 0) return COLORS.UP;
  if (percentage < 0) return COLORS.DOWN;
  return COLORS.NEUTRAL;
}

/**
 * 生成百分比数组
 * @param min 最小百分比
 * @param max 最大百分比
 * @param step 步长
 * @returns 百分比数组
 */
export function generatePercentages(min: number, max: number, step: number): number[] {
  const percentages: number[] = [];

  // 确保步长大于0
  const validStep = Math.max(0.01, step);

  // 生成百分比数组
  for (let p = min; p <= max; p += validStep) {
    // 避免浮点数精度问题
    const roundedPercentage = Math.round(p * 100) / 100;
    percentages.push(roundedPercentage);
  }

  return percentages;
}
