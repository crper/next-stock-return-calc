'use client';

import clsx from 'clsx';
import React from 'react';

export type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'border' | 'dots' | 'pulse';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
  label?: string;
};

/**
 * 通用加载状态组件
 * 提供多种加载动画样式
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'border',
  color = 'primary',
  className,
  label,
}) => {
  // 大小样式映射
  const sizeMap = {
    sm: {
      container: 'h-5 w-5',
      border: 'border-2',
      labelClass: 'text-xs ml-2',
    },
    md: {
      container: 'h-8 w-8',
      border: 'border-3',
      labelClass: 'text-sm ml-3',
    },
    lg: {
      container: 'h-12 w-12',
      border: 'border-4',
      labelClass: 'text-base ml-4',
    },
  };

  // 颜色样式映射
  const colorMap = {
    primary: {
      border: 'border-blue-500',
      borderLight: 'border-blue-200',
      bg: 'bg-blue-500',
    },
    secondary: {
      border: 'border-gray-500',
      borderLight: 'border-gray-200',
      bg: 'bg-gray-500',
    },
    success: {
      border: 'border-green-500',
      borderLight: 'border-green-200',
      bg: 'bg-green-500',
    },
    error: {
      border: 'border-red-500',
      borderLight: 'border-red-200',
      bg: 'bg-red-500',
    },
    warning: {
      border: 'border-yellow-500',
      borderLight: 'border-yellow-200',
      bg: 'bg-yellow-500',
    },
    info: {
      border: 'border-cyan-500',
      borderLight: 'border-cyan-200',
      bg: 'bg-cyan-500',
    },
  };

  // 选择合适的大小和颜色样式
  const sizeStyle = sizeMap[size];
  const colorStyle = colorMap[color];

  let spinner;

  // 渲染不同类型的加载动画
  if (variant === 'border') {
    spinner = (
      <div
        className={clsx(
          'rounded-full animate-spin',
          sizeStyle.container,
          sizeStyle.border,
          colorStyle.borderLight,
          `border-t-${colorStyle.border}`,
          className
        )}
      />
    );
  } else if (variant === 'dots') {
    spinner = (
      <div className={clsx('flex space-x-1', className)}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={clsx(
              'rounded-full animate-pulse',
              colorStyle.bg,
              {
                'h-2 w-2': size === 'sm',
                'h-3 w-3': size === 'md',
                'h-4 w-4': size === 'lg',
              },
              // 添加不同的延迟
              {
                'animation-delay-0': i === 0,
                'animation-delay-300': i === 1,
                'animation-delay-600': i === 2,
              }
            )}
          />
        ))}
      </div>
    );
  } else if (variant === 'pulse') {
    spinner = (
      <div
        className={clsx(
          'rounded-full animate-pulse',
          sizeStyle.container,
          colorStyle.bg,
          'opacity-75',
          className
        )}
      />
    );
  }

  // 如果有标签，添加标签
  if (label) {
    return (
      <div className="flex items-center">
        {spinner}
        <span className={sizeStyle.labelClass}>{label}</span>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
