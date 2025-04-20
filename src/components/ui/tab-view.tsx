'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

/**
 * TabView 组件的属性类型
 * @typedef {Object} TabViewProps
 * @property {React.ReactNode[]} children - 标签页内容数组
 * @property {string[]} titles - 标签页标题数组
 * @property {React.ReactNode[]} icons - 标签页图标数组（可选）
 * @property {number} [defaultIndex=0] - 默认激活的标签页索引
 * @property {string} [id] - 组件唯一标识符，用于本地存储
 * @property {boolean} [persistState=false] - 是否将活动标签状态保存到localStorage
 * @property {(index: number) => void} [onTabChange] - 标签切换时的回调函数
 * @property {string} [className] - 自定义CSS类名
 * @property {string} [orientation="horizontal"] - 标签方向，水平或垂直
 */
type TabViewProps = {
  children: React.ReactNode[];
  titles: string[];
  icons?: React.ReactNode[];
  defaultIndex?: number;
  id?: string;
  persistState?: boolean;
  onTabChange?: (index: number) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
};

/**
 * 标签页视图组件
 * 提供标签页切换功能，支持图标和标题，键盘导航和状态持久化
 * @param {TabViewProps} props - 组件属性
 */
const TabView = ({
  children,
  titles,
  icons,
  defaultIndex = 0,
  id,
  persistState = false,
  onTabChange,
  className = '',
  orientation = 'horizontal',
}: TabViewProps) => {
  // 从localStorage恢复状态或使用默认值
  const [activeTab, setActiveTab] = useState<number>(() => {
    if (persistState && id && typeof window !== 'undefined') {
      const savedTab = localStorage.getItem(`tabview-${id}`);
      return savedTab ? parseInt(savedTab, 10) : defaultIndex;
    }
    return defaultIndex;
  });

  // 添加调试日志
  useEffect(() => {
    console.log('TabView激活索引变化:', activeTab, '标题:', titles[activeTab]);
  }, [activeTab, titles]);

  // 当活动标签变化时保存到localStorage
  useEffect(() => {
    if (persistState && id && typeof window !== 'undefined') {
      localStorage.setItem(`tabview-${id}`, activeTab.toString());
    }
  }, [activeTab, persistState, id]);

  /**
   * 处理标签页切换
   * @param {number} index - 要激活的标签页索引
   */
  const handleTabChange = useCallback(
    (index: number) => {
      if (index >= 0 && index < children.length) {
        console.log('切换到标签页:', index, '标题:', titles[index]);
        setActiveTab(index);
        if (onTabChange) {
          onTabChange(index);
        }
      }
    },
    [children.length, onTabChange, titles]
  );

  /**
   * 处理键盘导航
   * @param {React.KeyboardEvent} event - 键盘事件
   * @param {number} index - 当前标签索引
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleTabChange(index);
      } else if (
        orientation === 'horizontal' &&
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
      ) {
        event.preventDefault();
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        const newIndex = (activeTab + direction + children.length) % children.length;
        handleTabChange(newIndex);
      } else if (
        orientation === 'vertical' &&
        (event.key === 'ArrowUp' || event.key === 'ArrowDown')
      ) {
        event.preventDefault();
        const direction = event.key === 'ArrowUp' ? -1 : 1;
        const newIndex = (activeTab + direction + children.length) % children.length;
        handleTabChange(newIndex);
      }
    },
    [activeTab, children.length, handleTabChange, orientation]
  );

  const isVertical = orientation === 'vertical';

  // 验证输入参数
  if (titles.length !== children.length) {
    console.error('TabView: titles和children数组长度不匹配');
    return <div className="p-4 text-red-500">标签页配置错误</div>;
  }

  if (icons && icons.length !== titles.length) {
    console.error('TabView: icons和titles数组长度不匹配');
    return <div className="p-4 text-red-500">标签页配置错误</div>;
  }

  return (
    <div
      className={clsx('w-full h-full', isVertical ? 'flex flex-row' : 'flex flex-col', className)}
    >
      <div
        className={clsx(
          'border-gray-200',
          isVertical
            ? 'flex flex-col border-r w-auto min-w-24 shrink-0'
            : 'flex flex-row border-b w-full'
        )}
        role="tablist"
        aria-orientation={orientation}
      >
        {titles.map((title, index) => (
          <button
            key={`tab-${index}`}
            role="tab"
            id={`tab-${id}-${index}`}
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${id}-${index}`}
            tabIndex={activeTab === index ? 0 : -1}
            className={clsx(
              'flex items-center py-3 px-4 text-sm font-medium transition-colors duration-200',
              isVertical ? 'border-r-2 justify-center' : 'border-b-2',
              activeTab === index
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
            onClick={() => handleTabChange(index)}
            onKeyDown={e => handleKeyDown(e, index)}
          >
            {icons && icons[index] && <span className="mr-2">{icons[index]}</span>}
            {title}
          </button>
        ))}
      </div>
      <div
        className={clsx('tab-content flex-1 overflow-hidden', isVertical ? 'ml-6 w-full' : 'mt-6')}
      >
        {children.map((child, index) => (
          <div
            key={`tabpanel-${index}`}
            role="tabpanel"
            id={`tabpanel-${id}-${index}`}
            aria-labelledby={`tab-${id}-${index}`}
            tabIndex={0}
            hidden={activeTab !== index}
            className={clsx(
              'transition-opacity duration-300 focus:outline-none h-full w-full',
              activeTab === index ? 'block opacity-100' : 'hidden opacity-0'
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

// 使用名称导出以便调试
export default TabView;
