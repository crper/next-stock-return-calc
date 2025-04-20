'use client';

import { LoadingSpinner } from '@/components/ui';
import { memo } from 'react';

/**
 * 空视图组件 - 当没有数据时显示
 */
const EmptyView = memo(() => (
  <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg text-gray-500">
    <LoadingSpinner variant="dots" color="secondary" size="lg" className="mb-4" />
    <h3 className="text-lg font-medium mb-2">无法找到符合筛选条件的结果</h3>
    <p className="text-sm text-gray-400">请尝试调整筛选条件或重新计算</p>
  </div>
));

EmptyView.displayName = 'EmptyView';

export default EmptyView;
