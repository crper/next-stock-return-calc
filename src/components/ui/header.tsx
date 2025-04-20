import clsx from 'clsx';
import { BarChart3, Github, Home, Info } from 'lucide-react';
import Link from 'next/link';
import { Glassmorphism } from './glassmorphism';
import { NavigationMenu, NavItem } from './navigation-menu';

const navigationItems: NavItem[] = [
  {
    label: '首页',
    href: '/',
    icon: <Home className="w-4 h-4" />,
  },
  {
    label: '关于',
    href: '/about',
    icon: <Info className="w-4 h-4" />,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/crper/next-stock-return-calc',
    icon: <Github className="w-4 h-4" />,
    external: true,
  },
];

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={clsx('fixed top-0 left-0 right-0 z-50 transition-all duration-300', className)}
    >
      <Glassmorphism
        className="border-b border-white/10 dark:border-gray-800/30 py-3 px-4"
        rounded="none"
        intensity="light"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <Link
                href="/"
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400"
              >
                股票收益计算器
              </Link>
            </div>

            <NavigationMenu items={navigationItems} />
          </div>
        </div>
      </Glassmorphism>
    </header>
  );
}
