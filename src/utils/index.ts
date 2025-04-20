import * as arrayUtils from './array-utils';
import * as dateUtils from './date-utils';
import * as numberUtils from './number-utils';
import * as pathUtils from './path-utils';

export { arrayUtils, dateUtils, numberUtils, pathUtils };

// 导出常用函数，方便直接引用
export const { formatDate, formatDateTime, getRelativeTime, isToday } = dateUtils;

export const {
  add,
  subtract,
  multiply,
  divide,
  formatPercentage,
  formatCurrency,
  formatAmountWithUnit,
  round,
} = numberUtils;

export const { groupBy, unique, sortBy, arrayToObject } = arrayUtils;

export const { getAssetPath } = pathUtils;
