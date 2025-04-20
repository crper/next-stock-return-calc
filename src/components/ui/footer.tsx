import { getCurrentYear } from '@/app/utils';
import clsx from 'clsx';
import { Glassmorphism } from './glassmorphism';

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={clsx('mt-auto', className)}>
      <Glassmorphism className="py-8 px-4" rounded="none" intensity="light">
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
          <p>© {getCurrentYear()} 股票涨跌停计算器 - 仅供参考，不构成投资建议</p>
        </div>
      </Glassmorphism>
    </footer>
  );
}
