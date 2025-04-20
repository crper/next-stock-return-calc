import { all, create } from 'mathjs';

// 创建自定义math实例
const math = create(all, {
  number: 'BigNumber',
  precision: 64,
});

/**
 * 精确加法，避免浮点数计算误差
 * @param {number} a - 第一个加数
 * @param {number} b - 第二个加数
 * @returns {number} 精确的加法结果
 */
export const add = (a: number, b: number): number => {
  return Number(math.format(math.add(math.bignumber(a), math.bignumber(b))));
};

/**
 * 精确减法，避免浮点数计算误差
 * @param {number} a - 被减数
 * @param {number} b - 减数
 * @returns {number} 精确的减法结果
 */
export const subtract = (a: number, b: number): number => {
  return Number(math.format(math.subtract(math.bignumber(a), math.bignumber(b))));
};

/**
 * 精确乘法，避免浮点数计算误差
 * @param {number} a - 第一个因数
 * @param {number} b - 第二个因数
 * @returns {number} 精确的乘法结果
 */
export const multiply = (a: number, b: number): number => {
  return Number(math.format(math.multiply(math.bignumber(a), math.bignumber(b))));
};

/**
 * 精确除法，避免浮点数计算误差
 * @param {number} a - 被除数
 * @param {number} b - 除数
 * @returns {number} 精确的除法结果
 */
export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('除数不能为零');
  }
  return Number(math.format(math.divide(math.bignumber(a), math.bignumber(b))));
};

/**
 * 格式化百分比
 * @param {number} value - 要格式化的数值
 * @param {number} [decimal=2] - 小数位数
 * @param {boolean} [withSymbol=true] - 是否包含百分号
 * @returns {string} 格式化后的百分比字符串
 */
export const formatPercentage = (value: number, decimal = 2, withSymbol = true): string => {
  const factor = 100;
  const percentValue = multiply(value, factor);
  const formattedValue = percentValue.toFixed(decimal);
  return withSymbol ? `${formattedValue}%` : formattedValue;
};

/**
 * 将数字格式化为货币形式
 * @param {number} value - 要格式化的数值
 * @param {number} [decimal=2] - 小数位数
 * @param {string} [currency='¥'] - 货币符号
 * @returns {string} 格式化后的货币字符串
 */
export const formatCurrency = (value: number, decimal = 2, currency = '¥'): string => {
  const formattedValue = Math.abs(value).toFixed(decimal);
  const parts = formattedValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const result = parts.join('.');
  return `${value < 0 ? '-' : ''}${currency}${result}`;
};

/**
 * 按照单位格式化金额（元/万/亿）
 * @param {number} value - 要格式化的数值
 * @param {number} [decimal=2] - 小数位数
 * @returns {string} 带有单位的金额字符串
 */
export const formatAmountWithUnit = (value: number, decimal = 2): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e8) {
    // 亿级别
    return `${sign}${(absValue / 1e8).toFixed(decimal)}亿`;
  } else if (absValue >= 1e4) {
    // 万级别
    return `${sign}${(absValue / 1e4).toFixed(decimal)}万`;
  } else {
    // 元级别
    return `${sign}${absValue.toFixed(decimal)}元`;
  }
};

/**
 * 四舍五入到指定小数位
 * @param {number} value - 要四舍五入的数值
 * @param {number} [decimal=2] - 小数位数
 * @returns {number} 四舍五入后的数值
 */
export const round = (value: number, decimal = 2): number => {
  const factor = Math.pow(10, decimal);
  return Math.round(value * factor) / factor;
};

// 创建命名对象
const numberUtils = {
  add,
  subtract,
  multiply,
  divide,
  formatPercentage,
  formatCurrency,
  formatAmountWithUnit,
  round,
};

export default numberUtils;
