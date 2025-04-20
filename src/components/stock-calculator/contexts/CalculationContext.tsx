'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CalculationResult, StockCalculatorFormData } from '../types';
import { calculateAllResults, validateFormData } from '../utils';

/**
 * 计算上下文接口
 */
interface CalculationContextType {
  // 状态
  results: CalculationResult[];
  deferredResults: CalculationResult[];
  isLoading: boolean;
  isCalculating: boolean;
  currentFormData: StockCalculatorFormData | null;
  error: string | null;

  // 操作
  handleFormSubmit: (formData: StockCalculatorFormData) => void;
  handleReset: () => void;
  handleImport: (formData: StockCalculatorFormData) => void;
}

// 创建计算上下文
const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

/**
 * 计算上下文提供者属性
 */
interface CalculationProviderProps {
  children: React.ReactNode;
}

/**
 * 计算上下文提供者组件
 */
export function CalculationProvider({ children }: CalculationProviderProps) {
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [deferredResults, setDeferredResults] = useState<CalculationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<StockCalculatorFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 处理表单提交
  const handleFormSubmit = useCallback(async (formData: StockCalculatorFormData) => {
    // 重置错误和状态
    setError(null);
    setIsCalculating(true);
    setIsLoading(true);

    try {
      // 验证表单数据
      const validation = validateFormData(formData);
      if (!validation.valid) {
        const errorMessage = Object.values(validation.errors)[0];
        throw new Error(errorMessage);
      }

      // 转换价格为数字
      const initialPrice =
        typeof formData.initialPrice === 'string'
          ? parseFloat(formData.initialPrice)
          : formData.initialPrice;

      // 检查价格是否是NaN
      if (isNaN(initialPrice)) {
        throw new Error('初始价格无效');
      }

      // 保存当前表单数据
      setCurrentFormData(formData);

      // 使用 requestAnimationFrame 确保不阻塞UI
      requestAnimationFrame(() => {
        try {
          // 计算所有结果
          const calculatedResults = calculateAllResults(
            initialPrice,
            formData.initialCapital || '0',
            formData.daysToCalculate,
            formData.useUnitConversion,
            formData.useThousandsSeparator,
            formData.minPercentage,
            formData.maxPercentage,
            formData.percentageStep
          );

          // 立即更新结果状态
          setResults(calculatedResults);

          // 使用 requestAnimationFrame 延迟更新渲染数据，避免UI卡顿
          requestAnimationFrame(() => {
            setDeferredResults(calculatedResults);
            setIsLoading(false);
            setIsCalculating(false);
          });
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : '计算过程中出现错误';
          setError(errorMsg);
          setIsLoading(false);
          setIsCalculating(false);
        }
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '表单数据验证失败';
      setError(errorMsg);
      setIsLoading(false);
      setIsCalculating(false);
    }
  }, []);

  // 处理重置
  const handleReset = useCallback(() => {
    setResults([]);
    setDeferredResults([]);
    setCurrentFormData(null);
    setError(null);
  }, []);

  // 处理导入
  const handleImport = useCallback(
    (formData: StockCalculatorFormData) => {
      handleFormSubmit(formData);
    },
    [handleFormSubmit]
  );

  // 创建上下文值
  const contextValue = useMemo(
    () => ({
      results,
      deferredResults,
      isLoading,
      isCalculating,
      currentFormData,
      error,
      handleFormSubmit,
      handleReset,
      handleImport,
    }),
    [
      results,
      deferredResults,
      isLoading,
      isCalculating,
      currentFormData,
      error,
      handleFormSubmit,
      handleReset,
      handleImport,
    ]
  );

  return <CalculationContext.Provider value={contextValue}>{children}</CalculationContext.Provider>;
}

/**
 * 计算上下文使用钩子
 */
export function useCalculation(): CalculationContextType {
  const context = useContext(CalculationContext);

  if (context === undefined) {
    throw new Error('useCalculation must be used within a CalculationProvider');
  }

  return context;
}
