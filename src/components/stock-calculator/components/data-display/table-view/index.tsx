'use client';

import { LoadingSpinner } from '@/components/ui';
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TableRow, TableViewProps } from './types';
import { useTableColumns } from './useTableColumns';

/**
 * 空数据显示组件
 */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-500 px-4">
    <LoadingSpinner variant="dots" color="secondary" size="md" className="mb-3" />
    <p className="text-center text-base">暂无符合筛选条件的数据</p>
    <p className="text-center text-sm mt-1">请尝试调整筛选条件查看更多结果</p>
  </div>
);

/**
 * 虚拟表格视图组件
 * 使用虚拟列表优化大量数据渲染性能
 */
function VirtualTable({ table }: { table: ReturnType<typeof useReactTable<TableRow>> }) {
  const { rows } = table.getRowModel();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // 监听容器宽度变化
  useEffect(() => {
    if (!tableContainerRef.current) return;

    // 设置初始宽度
    setContainerWidth(tableContainerRef.current.clientWidth);

    // 创建 ResizeObserver 监听宽度变化
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === tableContainerRef.current) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(tableContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 获取所有表格列
  const allColumns = table.getAllColumns();

  // 获取所有列并计算列宽度
  const columnSizes = useMemo(() => {
    if (containerWidth === 0) return [];

    const totalColumnWidth = allColumns.reduce((acc, column) => acc + column.getSize(), 0);
    const widthRatio = containerWidth / totalColumnWidth;

    // 如果比例小于1，说明列宽度总和超过容器宽度，不需要调整
    if (widthRatio <= 1) {
      return allColumns.map(column => ({
        id: column.id,
        width: column.getSize(),
      }));
    }

    // 否则按比例分配额外宽度给每一列
    return allColumns.map(column => {
      // 计算新宽度，并保留一定的内边距
      const adjustedWidth = Math.floor(column.getSize() * widthRatio) - 2;
      return {
        id: column.id,
        width: adjustedWidth,
      };
    });
  }, [allColumns, containerWidth]);

  // 计算表格总宽度
  const totalWidth = useMemo(() => {
    return containerWidth > 0
      ? containerWidth - 2
      : columnSizes.reduce((acc, curr) => acc + curr.width, 0);
  }, [columnSizes, containerWidth]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60, // 调整行高使表格更现代化
    overscan: 5, // 预加载的行数
  });

  // 无数据提示
  if (rows.length === 0) {
    return (
      <div className="overflow-auto border-t border-x border-gray-200 rounded-t-lg bg-white h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>暂无数据</p>
          <p className="text-sm mt-1">请尝试调整筛选条件</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={tableContainerRef}
      className="overflow-auto border rounded-lg border-gray-200 bg-white h-[620px] w-full"
    >
      <div style={{ width: `${totalWidth}px`, minWidth: '100%' }}>
        {/* 表头 - 固定在顶部 */}
        <div className="bg-gray-50 sticky top-0 z-50 shadow-sm w-full">
          {table.getHeaderGroups().map(headerGroup => (
            <div key={headerGroup.id} className="flex border-b border-gray-200 w-full">
              {headerGroup.headers.map((header, index) => {
                const columnSize = columnSizes.find(col => col.id === header.id);
                const columnWidth = columnSize ? columnSize.width : header.getSize();

                // 对最后一列特殊处理，确保填满剩余空间
                const isLastColumn = index === headerGroup.headers.length - 1;
                const style =
                  isLastColumn && containerWidth > 0
                    ? { flex: '1 1 auto', minWidth: `${columnWidth}px` }
                    : { width: `${columnWidth}px`, minWidth: `${columnWidth}px` };

                return (
                  <div
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    style={style}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none hover:text-gray-900'
                            : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="text-gray-400 inline-block">
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted() as string] ??
                            (header.column.getCanSort() ? '↕' : null)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 表格内容 - 虚拟化 */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${totalWidth}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row.id}
                data-index={virtualRow.index}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex h-full hover:bg-gray-50 border-b border-gray-100 transition-colors w-full">
                  {row.getVisibleCells().map((cell, index) => {
                    const columnSize = columnSizes.find(col => col.id === cell.column.id);
                    const columnWidth = columnSize ? columnSize.width : cell.column.getSize();

                    // 对最后一列特殊处理，确保填满剩余空间
                    const isLastColumn = index === row.getVisibleCells().length - 1;
                    const style =
                      isLastColumn && containerWidth > 0
                        ? { flex: '1 1 auto', minWidth: `${columnWidth}px` }
                        : { width: `${columnWidth}px`, minWidth: `${columnWidth}px` };

                    return (
                      <div
                        key={cell.id}
                        className="px-6 py-4 text-sm flex items-center"
                        style={style}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 表格视图组件
 * 以表格形式展示股票计算结果
 * 使用虚拟列表优化大量数据的展示
 */
function TableView({ dayData = [] }: TableViewProps) {
  // 表格排序状态
  const [sorting, setSorting] = useState<SortingState>([{ id: 'percentage', desc: false }]);

  // 表格列筛选状态
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // 获取表格列定义
  const columns = useTableColumns();

  // 处理表格数据
  const rows = useMemo(() => {
    if (dayData && dayData.length > 0) {
      // 使用传入的筛选后的日数据
      return dayData.map(day => {
        const id = `${day.direction || ''}-${day.resultPercentage || 0}-${day.day}`;
        return {
          id,
          day: day.day,
          direction: day.direction || '上涨',
          percentage: day.resultPercentage || 0,
          price: day.price.number,
          priceUnit: day.price.unit,
          percentageTotal: day.percentageTotal,
          marketValue: day.totalValue?.number,
          marketValueUnit: day.totalValue?.unit,
          profit: day.profit?.number,
          profitUnit: day.profit?.unit,
          profitPercentage: day.profitPercentage,
          _raw: day,
        };
      });
    }

    return [];
  }, [dayData]);

  // 创建表格实例
  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    // 功能启用
    enableSortingRemoval: false,
    enableMultiSort: true,
    // 功能实现模型
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // 事件处理程序
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  // 无数据显示
  if (rows.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="rounded-lg shadow-sm bg-white flex flex-col w-full">
      {/* 虚拟表格 */}
      <VirtualTable table={table} />
    </div>
  );
}

export default TableView;
