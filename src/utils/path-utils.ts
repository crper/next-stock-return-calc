/**
 * 获取带有正确basePath的资源路径
 * 在开发和生产环境中都能正确处理路径前缀
 * @param path 资源路径，例如 /images/logo.png
 * @returns 带有正确basePath的完整路径
 */
export const getAssetPath = (path: string): string => {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // 获取basePath
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // 返回完整路径
  return `${basePath}${normalizedPath}`;
};
