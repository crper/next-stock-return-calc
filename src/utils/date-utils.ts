import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// 配置dayjs
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

/**
 * 格式化日期为标准显示格式
 * @param {string | Date | number} date - 日期对象、时间戳或日期字符串
 * @param {string} format - 自定义格式，默认为YYYY-MM-DD
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date: string | Date | number, format = 'YYYY-MM-DD'): string => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * 格式化日期和时间
 * @param {string | Date | number} date - 日期对象、时间戳或日期字符串
 * @param {string} format - 自定义格式，默认为YYYY-MM-DD HH:mm:ss
 * @returns {string} 格式化后的日期和时间字符串
 */
export const formatDateTime = (
  date: string | Date | number,
  format = 'YYYY-MM-DD HH:mm:ss'
): string => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * 获取相对时间（例如：几分钟前，几小时前）
 * @param {string | Date | number} date - 日期对象、时间戳或日期字符串
 * @returns {string} 相对时间字符串
 */
export const getRelativeTime = (date: string | Date | number): string => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

/**
 * 计算两个日期之间的天数差
 * @param {string | Date | number} startDate - 开始日期
 * @param {string | Date | number} endDate - 结束日期
 * @returns {number} 天数差
 */
export const getDaysDiff = (
  startDate: string | Date | number,
  endDate: string | Date | number
): number => {
  if (!startDate || !endDate) return 0;
  return dayjs(endDate).diff(dayjs(startDate), 'day');
};

/**
 * 判断日期是否是今天
 * @param {string | Date | number} date - 日期对象、时间戳或日期字符串
 * @returns {boolean} 是否是今天
 */
export const isToday = (date: string | Date | number): boolean => {
  if (!date) return false;
  return dayjs(date).isSame(dayjs(), 'day');
};

// 创建命名对象
const dateUtils = {
  formatDate,
  formatDateTime,
  getRelativeTime,
  getDaysDiff,
  isToday,
};

export default dateUtils;
