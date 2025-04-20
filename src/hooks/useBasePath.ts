/**
 * 获取应用基础路径的钩子
 * 用于处理开发环境和生产环境的路径差异
 * @returns 应用的基础路径
 */
export const useBasePath = () => {
  // 在客户端，我们可以从window.location获取
  if (typeof window !== 'undefined') {
    // GitHub Pages的模式是/仓库名/...
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.length > 1) {
      // 如果路径包含仓库名，返回/仓库名
      const repoName = 'next-stock-return-calc';
      if (window.location.pathname.includes(`/${repoName}`)) {
        return `/${repoName}`;
      }
    }
  }

  // 在服务器端，使用环境变量
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
};
