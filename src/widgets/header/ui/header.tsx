'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, MoveRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { AppButton } from '@/shared/ui';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Locations', href: '/locations' },
  { label: 'About', href: '/about' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-muted px-2xl h-[102px] flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="text-brand-desktop text-text-primary">
          VERDANT
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-xl">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-h5-bold transition-colors py-2 px-4 rounded-md",
                isActive 
                  ? "text-brand-primary border border-brand-primary" 
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-lg">
        <div className="flex items-center gap-md">
          <AppButton variant="ghost" size="icon">
            <ShoppingCart className="size-6" />
          </AppButton>
          <AppButton variant="ghost" size="icon">
            <User className="size-6" />
          </AppButton>
        </div>
        
        <AppButton variant="primary" className="gap-sm">
          ORDER NOW
          <MoveRight className="size-5" />
        </AppButton>
      </div>
    </header>
  );
}
