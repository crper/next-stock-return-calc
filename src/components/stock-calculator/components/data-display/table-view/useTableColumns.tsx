import FormattedValue from '@/components/ui/formatted-value';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { TableRow } from './types';

/**
 * 表格列定义钩子
 * 用于创建和配置表格列
 */
export const useTableColumns = () => {
  const columnHelper = createColumnHelper<TableRow>();

  // 定义表格列
  const columns = useMemo<ColumnDef<TableRow, unknown>[]>(
    () =>
      [
        // 百分比列
        columnHelper.accessor('percentage', {
          header: '涨跌幅',
          cell: info => {
            const value = `${info.getValue()}%`;
            const isPositive = info.row.original.direction === '上涨';
            return (
              <FormattedValue
                value={isPositive ? `+${value}` : `-${value}`}
                showSign
                highlightChange
                className="font-medium"
              />
            );
          },
          size: 100,
          enableSorting: true,
          sortingFn: 'basic',
        }),

        // 方向列
        columnHelper.accessor('direction', {
          header: '方向',
          cell: info => {
            const direction = info.getValue();
            const isPositive = direction === '上涨';
            return (
              <span
                className={` flex whitespace-nowrap items-center justify-center py-1 px-2.5 text-xs font-medium rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
              >
                {direction}
              </span>
            );
          },
          size: 90,
          enableSorting: true,
          sortingFn: 'basic',
        }),

        // 天数列
        columnHelper.accessor('day', {
          header: '天数',
          cell: info => <span className="font-medium">{info.getValue()}</span>,
          size: 90,
          enableSorting: true,
          sortingFn: 'basic',
        }),

        // 价格列
        columnHelper.accessor(row => ({ number: row.price, unit: row.priceUnit }), {
          id: 'price',
          header: '价格',
          cell: info => {
            const { number, unit } = info.getValue();
            return <FormattedValue value={{ number, unit, raw: 0 }} className="font-medium" />;
          },
          size: 110,
          enableSorting: true,
          sortingFn: (rowA, rowB) => {
            const a = parseFloat(rowA.original.price.replace(/,/g, ''));
            const b = parseFloat(rowB.original.price.replace(/,/g, ''));
            return a > b ? 1 : a < b ? -1 : 0;
          },
        }),

        // 累计百分比列
        columnHelper.accessor('percentageTotal', {
          header: '累计涨跌幅',
          cell: info => {
            const value = info.getValue();
            const isPositive = !value.startsWith('-');
            return (
              <FormattedValue
                value={value}
                showSign
                highlightChange={isPositive}
                className="font-medium"
              />
            );
          },
          size: 120,
          enableSorting: true,
          sortingFn: (rowA, rowB) => {
            const a = parseFloat(rowA.original.percentageTotal.replace(/[+%,]/g, ''));
            const b = parseFloat(rowB.original.percentageTotal.replace(/[+%,]/g, ''));
            return a > b ? 1 : a < b ? -1 : 0;
          },
        }),

        // 市场价值列 (可选)
        columnHelper.accessor(
          row => (row.marketValue ? { number: row.marketValue, unit: row.marketValueUnit } : null),
          {
            id: 'marketValue',
            header: '市值',
            cell: info => {
              const data = info.getValue();
              if (!data) return <span className="text-gray-400">-</span>;
              return (
                <FormattedValue
                  value={{ number: data.number, unit: data.unit ?? '', raw: 0 }}
                  className="font-medium"
                />
              );
            },
            size: 130,
            enableSorting: true,
            sortingFn: (rowA, rowB) => {
              if (!rowA.original.marketValue || !rowB.original.marketValue) return 0;
              const a = parseFloat(rowA.original.marketValue.replace(/,/g, ''));
              const b = parseFloat(rowB.original.marketValue.replace(/,/g, ''));
              return a > b ? 1 : a < b ? -1 : 0;
            },
          }
        ),

        // 盈亏列 (可选)
        columnHelper.accessor(
          row => (row.profit ? { number: row.profit, unit: row.profitUnit } : null),
          {
            id: 'profit',
            header: '盈亏',
            cell: info => {
              const data = info.getValue();
              if (!data) return <span className="text-gray-400">-</span>;

              const isPositive = !data.number.startsWith('-');
              const value = {
                number: isPositive ? data.number : data.number.substring(1),
                unit: data.unit ?? '',
                raw: 0,
              };

              return (
                <FormattedValue
                  value={value}
                  showSign={isPositive}
                  highlightChange
                  className="font-medium"
                />
              );
            },
            size: 130,
            enableSorting: true,
            sortingFn: (rowA, rowB) => {
              if (!rowA.original.profit || !rowB.original.profit) return 0;
              const a = parseFloat(rowA.original.profit.replace(/,/g, ''));
              const b = parseFloat(rowB.original.profit.replace(/,/g, ''));
              return a > b ? 1 : a < b ? -1 : 0;
            },
          }
        ),

        // 收益率列 (可选)
        columnHelper.accessor('profitPercentage', {
          header: '收益率',
          cell: info => {
            const value = info.getValue();
            if (!value) return <span className="text-gray-400">-</span>;
            const isPositive = !value.startsWith('-');
            return (
              <FormattedValue
                value={value}
                showSign
                highlightChange={isPositive}
                className="font-medium"
              />
            );
          },
          size: 110,
          enableSorting: true,
          sortingFn: (rowA, rowB) => {
            if (!rowA.original.profitPercentage || !rowB.original.profitPercentage) return 0;
            const a = parseFloat(rowA.original.profitPercentage.replace(/[+%,]/g, ''));
            const b = parseFloat(rowB.original.profitPercentage.replace(/[+%,]/g, ''));
            return a > b ? 1 : a < b ? -1 : 0;
          },
        }),
      ] as ColumnDef<TableRow, unknown>[],
    [columnHelper]
  );

  return columns;
};
