'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DEFAULT_FORM_VALUES, FORM_LIMITS } from '../constants';
import { useCalculation } from '../contexts';
import { StockCalculatorFormData } from '../types';

// 使用 Zod 创建表单验证架构
const calculatorFormSchema = z
  .object({
    initialPrice: z.coerce
      .number({ invalid_type_error: '请输入有效的价格数值' })
      .min(FORM_LIMITS.MIN_PRICE, `价格必须大于等于 ${FORM_LIMITS.MIN_PRICE}`)
      .max(FORM_LIMITS.MAX_PRICE, `价格必须小于等于 ${FORM_LIMITS.MAX_PRICE}`),

    initialCapital: z
      .string()
      .transform(val => (val === '' ? '0' : val))
      .refine(val => !isNaN(Number(val)), { message: '请输入有效的资金数值' })
      .refine(val => Number(val) >= FORM_LIMITS.MIN_CAPITAL, {
        message: `资金必须大于等于 ${FORM_LIMITS.MIN_CAPITAL}`,
      })
      .refine(val => Number(val) <= FORM_LIMITS.MAX_CAPITAL, {
        message: `资金必须小于等于 ${FORM_LIMITS.MAX_CAPITAL}`,
      })
      .optional(),

    daysToCalculate: z.coerce
      .number({ invalid_type_error: '请输入有效的天数' })
      .min(FORM_LIMITS.MIN_DAYS, `天数必须大于等于 ${FORM_LIMITS.MIN_DAYS}`)
      .max(FORM_LIMITS.MAX_DAYS, `天数必须小于等于 ${FORM_LIMITS.MAX_DAYS}`),

    useUnitConversion: z.boolean(),
    useThousandsSeparator: z.boolean(),

    minPercentage: z.coerce
      .number({ invalid_type_error: '请输入有效的百分比' })
      .min(FORM_LIMITS.MIN_PERCENTAGE, `百分比必须大于等于 ${FORM_LIMITS.MIN_PERCENTAGE}`)
      .max(FORM_LIMITS.MAX_PERCENTAGE, `百分比必须小于等于 ${FORM_LIMITS.MAX_PERCENTAGE}`),

    maxPercentage: z.coerce
      .number({ invalid_type_error: '请输入有效的百分比' })
      .min(FORM_LIMITS.MIN_PERCENTAGE, `百分比必须大于等于 ${FORM_LIMITS.MIN_PERCENTAGE}`)
      .max(FORM_LIMITS.MAX_PERCENTAGE, `百分比必须小于等于 ${FORM_LIMITS.MAX_PERCENTAGE}`),

    percentageStep: z.coerce
      .number({ invalid_type_error: '请输入有效的步长' })
      .min(FORM_LIMITS.MIN_STEP, `步长必须大于等于 ${FORM_LIMITS.MIN_STEP}`)
      .max(FORM_LIMITS.MAX_STEP, `步长必须小于等于 ${FORM_LIMITS.MAX_STEP}`),
  })
  .refine(data => data.minPercentage < data.maxPercentage, {
    message: '最大百分比必须大于最小百分比',
    path: ['percentageRange'],
  });

// 表单值类型
type CalculatorFormValues = z.infer<typeof calculatorFormSchema> & {
  percentageRange?: string; // 添加百分比范围错误字段
};

/**
 * 股票计算器表单组件
 * 使用 react-hook-form 和 zod 进行表单控制和验证
 */
export default function CalculatorForm() {
  const { handleFormSubmit, handleReset, isCalculating } = useCalculation();

  // 初始化表单
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      initialPrice: Number(DEFAULT_FORM_VALUES.initialPrice),
      initialCapital: DEFAULT_FORM_VALUES.initialCapital,
      daysToCalculate: DEFAULT_FORM_VALUES.daysToCalculate,
      useUnitConversion: DEFAULT_FORM_VALUES.useUnitConversion,
      useThousandsSeparator: DEFAULT_FORM_VALUES.useThousandsSeparator,
      minPercentage: DEFAULT_FORM_VALUES.minPercentage,
      maxPercentage: DEFAULT_FORM_VALUES.maxPercentage,
      percentageStep: DEFAULT_FORM_VALUES.percentageStep,
    },
    mode: 'onChange', // 实时验证
  });

  // 提交表单处理函数
  const onSubmit = (data: CalculatorFormValues) => {
    const formData: StockCalculatorFormData = {
      ...data,
      initialPrice: data.initialPrice.toString(),
      initialCapital: data.initialCapital || '0',
    };
    handleFormSubmit(formData);
  };

  // 重置表单
  const resetForm = () => {
    reset({
      initialPrice: Number(DEFAULT_FORM_VALUES.initialPrice),
      initialCapital: DEFAULT_FORM_VALUES.initialCapital,
      daysToCalculate: DEFAULT_FORM_VALUES.daysToCalculate,
      useUnitConversion: DEFAULT_FORM_VALUES.useUnitConversion,
      useThousandsSeparator: DEFAULT_FORM_VALUES.useThousandsSeparator,
      minPercentage: DEFAULT_FORM_VALUES.minPercentage,
      maxPercentage: DEFAULT_FORM_VALUES.maxPercentage,
      percentageStep: DEFAULT_FORM_VALUES.percentageStep,
    });
    handleReset();
  };

  // 监听百分比步长变化，确保与最小/最大百分比兼容
  const minPercentage = watch('minPercentage');
  const maxPercentage = watch('maxPercentage');
  const percentageStep = watch('percentageStep');

  useEffect(() => {
    // 检查步长是否大于百分比范围
    if (percentageStep > maxPercentage - minPercentage) {
      setValue('percentageStep', maxPercentage - minPercentage, { shouldValidate: true });
    }
  }, [minPercentage, maxPercentage, percentageStep, setValue]);

  // 计算百分比范围错误
  const percentageRangeError = errors.percentageRange?.message;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
            价格与投资设置
          </h2>

          {/* 初始价格 */}
          <div className="space-y-2">
            <label htmlFor="initialPrice" className="block text-sm font-medium text-gray-700">
              初始价格
            </label>
            <div className="relative">
              <input
                type="number"
                id="initialPrice"
                min={FORM_LIMITS.MIN_PRICE}
                max={FORM_LIMITS.MAX_PRICE}
                step="0.01"
                className={`
                  block w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200
                  ${errors.initialPrice ? 'border-red-400 bg-red-50' : 'border-gray-200'}
                `}
                {...register('initialPrice')}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400">元</span>
              </div>
            </div>
            {errors.initialPrice && (
              <p className="mt-1 text-sm text-red-500">{errors.initialPrice.message}</p>
            )}
          </div>

          {/* 初始资金 */}
          <div className="space-y-2">
            <label htmlFor="initialCapital" className="block text-sm font-medium text-gray-700">
              初始资金
            </label>
            <div className="relative">
              <input
                type="text"
                id="initialCapital"
                placeholder="例如：1000000"
                className={`
                  block w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200
                  ${errors.initialCapital ? 'border-red-400 bg-red-50' : 'border-gray-200'}
                `}
                {...register('initialCapital')}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400">元</span>
              </div>
            </div>
            {errors.initialCapital && (
              <p className="mt-1 text-sm text-red-500">{errors.initialCapital.message}</p>
            )}
            <p className="text-xs text-gray-500 italic">可选，用于计算投资回报</p>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
            计算参数
          </h2>

          {/* 计算天数 */}
          <div className="space-y-2">
            <label htmlFor="daysToCalculate" className="block text-sm font-medium text-gray-700">
              计算天数
            </label>
            <div className="relative">
              <input
                type="number"
                id="daysToCalculate"
                min={FORM_LIMITS.MIN_DAYS}
                max={FORM_LIMITS.MAX_DAYS}
                className={`
                  block w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200
                  ${errors.daysToCalculate ? 'border-red-400 bg-red-50' : 'border-gray-200'}
                `}
                {...register('daysToCalculate')}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400">天</span>
              </div>
            </div>
            {errors.daysToCalculate && (
              <p className="mt-1 text-sm text-red-500">{errors.daysToCalculate.message}</p>
            )}
          </div>

          {/* 百分比范围 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 最小百分比 */}
            <div className="space-y-2">
              <label htmlFor="minPercentage" className="block text-sm font-medium text-gray-700">
                最小百分比
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="minPercentage"
                  min={FORM_LIMITS.MIN_PERCENTAGE}
                  max={FORM_LIMITS.MAX_PERCENTAGE}
                  step="0.01"
                  className={`
                    block w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200
                    ${errors.minPercentage || percentageRangeError ? 'border-red-400 bg-red-50' : 'border-gray-200'}
                  `}
                  {...register('minPercentage')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">%</span>
                </div>
              </div>
              {errors.minPercentage && (
                <p className="mt-1 text-sm text-red-500">{errors.minPercentage.message}</p>
              )}
            </div>

            {/* 最大百分比 */}
            <div className="space-y-2">
              <label htmlFor="maxPercentage" className="block text-sm font-medium text-gray-700">
                最大百分比
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="maxPercentage"
                  min={FORM_LIMITS.MIN_PERCENTAGE}
                  max={FORM_LIMITS.MAX_PERCENTAGE}
                  step="0.01"
                  className={`
                    block w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200
                    ${errors.maxPercentage || percentageRangeError ? 'border-red-400 bg-red-50' : 'border-gray-200'}
                  `}
                  {...register('maxPercentage')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">%</span>
                </div>
              </div>
              {errors.maxPercentage && (
                <p className="mt-1 text-sm text-red-500">{errors.maxPercentage.message}</p>
              )}
              {percentageRangeError && (
                <p className="mt-1 text-sm text-red-500">{percentageRangeError}</p>
              )}
            </div>

            {/* 百分比步长 */}
            <div className="space-y-2">
              <label htmlFor="percentageStep" className="block text-sm font-medium text-gray-700">
                百分比步长
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="percentageStep"
                  min={FORM_LIMITS.MIN_STEP}
                  max={FORM_LIMITS.MAX_STEP}
                  step="0.01"
                  className={`
                    block w-full px-4 py-3 rounded-lg border bg-gray-50 focus:bg-white
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200
                    ${errors.percentageStep ? 'border-red-400 bg-red-50' : 'border-gray-200'}
                  `}
                  {...register('percentageStep')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">%</span>
                </div>
              </div>
              {errors.percentageStep && (
                <p className="mt-1 text-sm text-red-500">{errors.percentageStep.message}</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
            显示选项
          </h2>

          <div className="space-y-4">
            {/* 单位转换选项 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useUnitConversion"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                {...register('useUnitConversion')}
              />
              <label
                htmlFor="useUnitConversion"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                自动转换单位 (元、万、亿)
              </label>
            </div>

            {/* 千分位分隔符选项 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useThousandsSeparator"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                {...register('useThousandsSeparator')}
              />
              <label
                htmlFor="useThousandsSeparator"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                使用千分位分隔符
              </label>
            </div>
          </div>
        </section>

        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={!isValid || isCalculating}
            className={`
              w-full py-3 px-6 rounded-lg font-medium text-white
              ${
                isValid && !isCalculating
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-400 cursor-not-allowed'
              }
              transition-all duration-200
            `}
          >
            {isCalculating ? '计算中...' : '计算'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="w-full py-3 px-6 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            重置
          </button>
        </div>
      </form>
    </div>
  );
}
