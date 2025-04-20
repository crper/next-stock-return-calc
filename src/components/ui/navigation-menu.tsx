'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
};

type NavigationMenuProps = {
  items: NavItem[];
  className?: string;
};

export function NavigationMenu({ items, className }: NavigationMenuProps) {
  const pathname = usePathname();

  return (
    <nav className={clsx('flex items-center gap-1 sm:gap-2 md:gap-4', className)}>
      {items.map(item => {
        const isActive = pathname === item.href;

        // 为外部链接创建特殊的链接元素
        if (item.external) {
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'relative flex items-center px-3 py-2 text-sm md:text-base font-medium transition-all duration-200',
                'rounded-lg group hover:bg-white/10',
                'text-gray-600 hover:text-blue-500'
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </a>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'relative flex items-center px-3 py-2 text-sm md:text-base font-medium transition-all duration-200',
              'rounded-lg group hover:bg-white/10',
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'
            )}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
            {isActive && (
              <span
                className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600 rounded-full"
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
