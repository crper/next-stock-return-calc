'use client';

import { Download, FileText, Table as TableIcon, Upload } from 'lucide-react';
import { useState } from 'react';

/**
 * 下载文件工具函数
 * @param content 文件内容
 * @param fileName 文件名
 * @param contentType 内容类型
 */
export const downloadFile = (content: string, fileName: string, contentType: string): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * 通用数据导出导入组件的接口
 */
export interface DataExportImportProps<
  T,
  R extends Record<string, unknown> = Record<string, unknown>,
> {
  /** 要导出的数据对象 */
  exportData?: T | null;
  /** 导出结果数据的数组 */
  exportResults?: R[];
  /** 导入回调函数 */
  onImport: (data: T) => void;
  /** 参数导出文件名前缀，默认为"参数" */
  paramsFilePrefix?: string;
  /** 结果导出文件名前缀，默认为"结果" */
  resultsFilePrefix?: string;
  /** 自定义导出参数函数 */
  exportParamsToJson?: (data: T) => string;
  /** 自定义导出结果函数 */
  exportResultsToCsv?: (results: R[]) => string;
  /** 自定义导入数据解析函数 */
  importFromJson?: (jsonStr: string) => T | null;
  /** 自定义错误消息 */
  invalidFileError?: string;
}

/**
 * 通用数据导出导入组件
 * 支持导出参数为JSON、导出结果为CSV，以及导入JSON格式的参数
 */
function DataExportImport<T, R extends Record<string, unknown> = Record<string, unknown>>({
  exportData,
  exportResults = [],
  onImport,
  paramsFilePrefix = '参数',
  resultsFilePrefix = '结果',
  exportParamsToJson,
  exportResultsToCsv,
  importFromJson,
  invalidFileError = '无效的参数文件格式',
}: DataExportImportProps<T, R>) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setImportError(null);
  };

  // 导出参数为JSON
  const handleExportParams = () => {
    if (!exportData) return;

    let json: string;

    // 使用自定义导出函数或默认导出
    if (exportParamsToJson) {
      json = exportParamsToJson(exportData);
    } else {
      json = JSON.stringify(exportData, null, 2);
    }

    const fileName = `${paramsFilePrefix}_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(json, fileName, 'application/json');
    setIsDropdownOpen(false);
  };

  // 导出结果为CSV
  const handleExportCsv = () => {
    if (!exportResults || exportResults.length === 0) return;

    let csv: string;

    // 使用自定义导出函数或默认导出
    if (exportResultsToCsv) {
      csv = exportResultsToCsv(exportResults);
    } else {
      // 简单的默认CSV导出方法
      csv = '数据,值\n';
      if (exportResults.length > 0) {
        const firstItem = exportResults[0];
        for (const [key, value] of Object.entries(firstItem)) {
          if (typeof value !== 'object') {
            csv += `${key},${value}\n`;
          }
        }
      }
    }

    const fileName = `${resultsFilePrefix}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csv, fileName, 'text/csv;charset=utf-8');
    setIsDropdownOpen(false);
  };

  // 处理导入
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = event => {
        try {
          const jsonStr = event.target?.result as string;

          let data: T | null = null;

          // 使用自定义导入函数或默认导入
          if (importFromJson) {
            data = importFromJson(jsonStr);
          } else {
            data = JSON.parse(jsonStr) as T;
          }

          if (data) {
            onImport(data);
            setImportError(null);
            setIsDropdownOpen(false);
          } else {
            setImportError(invalidFileError);
          }
        } catch (error) {
          console.error('导入参数失败:', error);
          setImportError('导入参数失败，请检查文件格式');
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-2 rounded-lg bg-white border border-gray-300 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FileText className="h-4 w-4 mr-1.5" />
        导入/导出
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="p-2">
            <button
              onClick={handleExportParams}
              disabled={!exportData}
              className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4 mr-2" />
              导出计算参数
            </button>

            <button
              onClick={handleExportCsv}
              disabled={!exportResults || exportResults.length === 0}
              className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TableIcon className="h-4 w-4 mr-2" />
              导出结果为CSV
            </button>

            <button
              onClick={handleImportClick}
              className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Upload className="h-4 w-4 mr-2" />
              导入参数
            </button>

            {importError && <p className="text-xs text-red-500 mt-1 px-2">{importError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default DataExportImport;
