/**
 * 股票回报率计算器 - 表单验证工具函数
 */

import { FORM_LIMITS } from '../constants';
import { StockCalculatorFormData } from '../types';

/**
 * 验证价格是否有效
 * @param price 价格
 * @returns 验证结果和错误信息
 */
export function validatePrice(price: number | string): { valid: boolean; error?: string } {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return { valid: false, error: '请输入有效的价格数值' };
  }

  if (numericPrice < FORM_LIMITS.MIN_PRICE) {
    return {
      valid: false,
      error: `价格必须大于等于 ${FORM_LIMITS.MIN_PRICE}`,
    };
  }

  if (numericPrice > FORM_LIMITS.MAX_PRICE) {
    return {
      valid: false,
      error: `价格必须小于等于 ${FORM_LIMITS.MAX_PRICE}`,
    };
  }

  return { valid: true };
}

/**
 * 验证资金是否有效
 * @param capital 资金
 * @returns 验证结果和错误信息
 */
export function validateCapital(capital: string): { valid: boolean; error?: string } {
  // 允许为空
  if (!capital) {
    return { valid: true };
  }

  const numericCapital = parseFloat(capital);

  if (isNaN(numericCapital)) {
    return { valid: false, error: '请输入有效的资金数值' };
  }

  if (numericCapital < FORM_LIMITS.MIN_CAPITAL) {
    return {
      valid: false,
      error: `资金必须大于等于 ${FORM_LIMITS.MIN_CAPITAL}`,
    };
  }

  if (numericCapital > FORM_LIMITS.MAX_CAPITAL) {
    return {
      valid: false,
      error: `资金必须小于等于 ${FORM_LIMITS.MAX_CAPITAL}`,
    };
  }

  return { valid: true };
}

/**
 * 验证天数是否有效
 * @param days 天数
 * @returns 验证结果和错误信息
 */
export function validateDays(days: number): { valid: boolean; error?: string } {
  if (isNaN(days)) {
    return { valid: false, error: '请输入有效的天数' };
  }

  if (days < FORM_LIMITS.MIN_DAYS) {
    return {
      valid: false,
      error: `天数必须大于等于 ${FORM_LIMITS.MIN_DAYS}`,
    };
  }

  if (days > FORM_LIMITS.MAX_DAYS) {
    return {
      valid: false,
      error: `天数必须小于等于 ${FORM_LIMITS.MAX_DAYS}`,
    };
  }

  return { valid: true };
}

/**
 * 验证百分比是否有效
 * @param percentage 百分比
 * @returns 验证结果和错误信息
 */
export function validatePercentage(percentage: number): { valid: boolean; error?: string } {
  if (isNaN(percentage)) {
    return { valid: false, error: '请输入有效的百分比' };
  }

  if (percentage < FORM_LIMITS.MIN_PERCENTAGE) {
    return {
      valid: false,
      error: `百分比必须大于等于 ${FORM_LIMITS.MIN_PERCENTAGE}`,
    };
  }

  if (percentage > FORM_LIMITS.MAX_PERCENTAGE) {
    return {
      valid: false,
      error: `百分比必须小于等于 ${FORM_LIMITS.MAX_PERCENTAGE}`,
    };
  }

  return { valid: true };
}

/**
 * 验证步长是否有效
 * @param step 步长
 * @returns 验证结果和错误信息
 */
export function validateStep(step: number): { valid: boolean; error?: string } {
  if (isNaN(step)) {
    return { valid: false, error: '请输入有效的步长' };
  }

  if (step < FORM_LIMITS.MIN_STEP) {
    return {
      valid: false,
      error: `步长必须大于等于 ${FORM_LIMITS.MIN_STEP}`,
    };
  }

  if (step > FORM_LIMITS.MAX_STEP) {
    return {
      valid: false,
      error: `步长必须小于等于 ${FORM_LIMITS.MAX_STEP}`,
    };
  }

  return { valid: true };
}

/**
 * 验证百分比范围是否有效
 * @param min 最小百分比
 * @param max 最大百分比
 * @returns 验证结果和错误信息
 */
export function validatePercentageRange(
  min: number,
  max: number
): { valid: boolean; error?: string } {
  if (min >= max) {
    return {
      valid: false,
      error: '最大百分比必须大于最小百分比',
    };
  }

  return { valid: true };
}

/**
 * 验证整个表单数据
 * @param formData 表单数据
 * @returns 验证结果对象
 */
export function validateFormData(formData: StockCalculatorFormData): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // 验证初始价格
  const priceResult = validatePrice(formData.initialPrice);
  if (!priceResult.valid && priceResult.error) {
    errors.initialPrice = priceResult.error;
  }

  // 验证初始资金
  if (formData.initialCapital) {
    const capitalResult = validateCapital(formData.initialCapital);
    if (!capitalResult.valid && capitalResult.error) {
      errors.initialCapital = capitalResult.error;
    }
  }

  // 验证天数
  const daysResult = validateDays(formData.daysToCalculate);
  if (!daysResult.valid && daysResult.error) {
    errors.daysToCalculate = daysResult.error;
  }

  // 验证最小百分比
  const minPercentageResult = validatePercentage(formData.minPercentage);
  if (!minPercentageResult.valid && minPercentageResult.error) {
    errors.minPercentage = minPercentageResult.error;
  }

  // 验证最大百分比
  const maxPercentageResult = validatePercentage(formData.maxPercentage);
  if (!maxPercentageResult.valid && maxPercentageResult.error) {
    errors.maxPercentage = maxPercentageResult.error;
  }

  // 验证百分比范围
  const rangeResult = validatePercentageRange(formData.minPercentage, formData.maxPercentage);
  if (!rangeResult.valid && rangeResult.error) {
    errors.percentageRange = rangeResult.error;
  }

  // 验证步长
  const stepResult = validateStep(formData.percentageStep);
  if (!stepResult.valid && stepResult.error) {
    errors.percentageStep = stepResult.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
