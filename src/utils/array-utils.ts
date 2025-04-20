import { chunk, difference } from 'es-toolkit/array';

/**
 * 按照指定属性对数组进行分组
 * @param {Array<T>} arr - 要分组的数组
 * @param {string} key - 分组的键
 * @returns {Record<string, T[]>} 分组后的对象
 */
export const groupBy = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T
): Record<string, T[]> => {
  return arr.reduce((result: Record<string, T[]>, item: T) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * 去除数组中的重复项
 * @param {Array<T>} arr - 输入数组
 * @param {keyof T} [key] - 可选，按照对象的某个属性去重
 * @returns {Array<T>} 去重后的数组
 */
export const unique = <T>(arr: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(arr)];
  }

  const seen = new Set<string>();
  return arr.filter((item: T) => {
    const value =
      typeof item === 'object' && item !== null
        ? String((item as Record<string, unknown>)[key as string])
        : String(item);

    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * 对数组进行排序
 * @param {Array<T>} arr - 要排序的数组
 * @param {keyof T} key - 排序的键
 * @param {'asc' | 'desc'} order - 排序方向，asc为升序，desc为降序
 * @returns {Array<T>} 排序后的数组
 */
export const sortBy = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  const sortedArr = [...arr].sort((a: T, b: T) => {
    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return valueA - valueB;
    }

    const strA = String(valueA);
    const strB = String(valueB);

    return strA.localeCompare(strB);
  });

  return order === 'asc' ? sortedArr : sortedArr.reverse();
};

/**
 * 将数组转换为对象
 * @param {Array<T>} arr - 要转换的数组
 * @param {keyof T} key - 作为对象键的属性
 * @returns {Record<string, T>} 转换后的对象
 */
export const arrayToObject = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T
): Record<string, T> => {
  return arr.reduce((result: Record<string, T>, item: T) => {
    result[String(item[key])] = item;
    return result;
  }, {});
};

/**
 * 对数组进行切片操作
 * @param {Array<T>} arr - 输入数组
 * @param {number} start - 开始索引
 * @param {number} end - 结束索引
 * @returns {Array<T>} 切片后的数组
 */
export const slice = <T>(arr: T[], start: number, end?: number): T[] => {
  return arr.slice(start, end);
};

/**
 * 获取数组中的最大值
 * @param {Array<number>} arr - 数字数组
 * @returns {number} 最大值
 */
export const max = (arr: number[]): number => {
  return Math.max(...arr);
};

/**
 * 获取数组中的最小值
 * @param {Array<number>} arr - 数字数组
 * @returns {number} 最小值
 */
export const min = (arr: number[]): number => {
  return Math.min(...arr);
};

/**
 * 获取数组中的第一个元素
 * @param {Array<T>} arr - 输入数组
 * @returns {T | undefined} 第一个元素或undefined
 */
export const getFirst = <T>(arr: T[]): T | undefined => {
  return arr.length > 0 ? arr[0] : undefined;
};

/**
 * 获取数组中的最后一个元素
 * @param {Array<T>} arr - 输入数组
 * @returns {T | undefined} 最后一个元素或undefined
 */
export const getLast = <T>(arr: T[]): T | undefined => {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
};

/**
 * 计算两个数组的差集
 * @param {Array<T>} arr1 - 第一个数组
 * @param {Array<T>} arr2 - 第二个数组
 * @returns {Array<T>} 差集数组
 */
export const getDifference = <T>(arr1: T[], arr2: T[]): T[] => {
  return difference(arr1, arr2);
};

/**
 * 将数组分块
 * @param {Array<T>} arr - 输入数组
 * @param {number} size - 每个块的大小
 * @returns {Array<Array<T>>} 分块后的二维数组
 */
export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return chunk(arr, size);
};

// 创建命名的对象
const arrayUtils = {
  groupBy,
  unique,
  sortBy,
  arrayToObject,
  slice,
  max,
  min,
  getFirst,
  getLast,
  getDifference,
  chunkArray,
};

export default arrayUtils;
