'use client';

import clsx from 'clsx';
import React from 'react';

/**
 * 格式化数字类型
 */
export interface FormattedNumber {
  number: string; // 格式化后的数字字符串
  unit: string; // 单位 (元、万、亿)
  raw: number; // 原始数值
}

export type FormattedValueProps = {
  value: FormattedNumber | string;
  className?: string;
  showSign?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  highlightChange?: boolean;
  unitClassName?: string;
  valueClassName?: string;
};

/**
 * 通用格式化数值展示组件
 * 用于展示格式化后的数值，支持单位展示和颜色变化
 */
const FormattedValue: React.FC<FormattedValueProps> = ({
  value,
  className,
  showSign = false,
  size = 'md',
  highlightChange = false,
  unitClassName,
  valueClassName,
}) => {
  // 解析数值和单位
  let displayText = '';
  let unit = '';
  let isPositive = false;
  let isNegative = false;

  if (typeof value === 'string') {
    // 处理百分比
    if (value.includes('%')) {
      displayText = value.replace(/[+\-%]/g, '');
      unit = '%';
      isPositive = value.startsWith('+');
      isNegative = value.startsWith('-');
    } else {
      displayText = value;
    }
  } else {
    // 处理格式化数字对象
    displayText = value.number;
    unit = value.unit;

    // 检查是否为正负值
    if (showSign && !isNaN(parseFloat(displayText))) {
      const numValue = parseFloat(displayText.replace(/,/g, ''));
      isPositive = numValue > 0;
      isNegative = numValue < 0;
    }
  }

  // 字体大小样式
  const sizeStyle = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[size];

  // 颜色样式
  let colorStyle = '';
  if (highlightChange) {
    if (isPositive) {
      colorStyle = 'text-green-600';
    } else if (isNegative) {
      colorStyle = 'text-red-600';
    }
  }

  return (
    <span className={clsx('inline-flex items-baseline', sizeStyle, className)}>
      {showSign && isPositive && <span className="text-green-600 mr-0.5">+</span>}
      <span className={clsx(colorStyle, valueClassName)}>{displayText}</span>
      {unit && (
        <span
          className={clsx(
            'ml-0.5',
            {
              'text-xs': size === 'md' || size === 'sm',
              'text-sm': size === 'lg',
              'text-xs opacity-80': size === 'xl',
            },
            unitClassName
          )}
        >
          {unit}
        </span>
      )}
    </span>
  );
};

export default FormattedValue;
