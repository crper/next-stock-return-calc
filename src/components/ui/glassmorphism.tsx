import clsx from 'clsx';
import React from 'react';

type GlassmorphismProps = {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  border?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
};

export function Glassmorphism({
  children,
  className,
  intensity = 'medium',
  rounded = 'lg',
  border = true,
  blur = 'md',
}: GlassmorphismProps) {
  // 背景颜色透明度配置
  const bgOpacity = {
    light: 'bg-white/30 dark:bg-gray-900/30',
    medium: 'bg-white/50 dark:bg-gray-900/40',
    strong: 'bg-white/70 dark:bg-gray-900/60',
  };

  // 模糊效果配置
  const blurEffect = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  // 圆角配置
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={clsx(
        bgOpacity[intensity],
        blurEffect[blur],
        roundedClass[rounded],
        border && 'border border-white/20 dark:border-gray-800/30',
        'backdrop-saturate-150 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
