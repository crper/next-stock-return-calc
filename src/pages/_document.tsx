import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  // 获取basePath
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <Html lang="zh-CN" className="scroll-smooth">
      <Head>
        {/* 解决静态资源路径问题 */}
        {basePath && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var pathPrefix = '${basePath}';
                  window.__BASE_PATH__ = pathPrefix;

                  // 创建一个函数来修正资源路径
                  window.getAssetPath = function(path) {
                    if (path.startsWith('/')) {
                      return pathPrefix + path;
                    }
                    return pathPrefix + '/' + path;
                  };
                })();
              `,
            }}
          />
        )}
      </Head>
      <body className="flex flex-col min-h-screen">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 -z-10"></div>
        <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 -z-10"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
