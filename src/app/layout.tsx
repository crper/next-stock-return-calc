import { Footer } from '@/components/ui/footer';
import { Header } from '@/components/ui/header';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '股票投资收益计算工具',
  description: '计算不同涨跌幅情况下的股票收益变化，提供表格、卡片和图表多种视图方式',
  keywords: '股票, 投资收益, 计算器, 涨跌幅, 财务分析',
  authors: [{ name: 'Stock Calculator Team' }],
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        {/* 背景渐变和图案已移至_document.tsx */}
        <Header />

        <main className="flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
