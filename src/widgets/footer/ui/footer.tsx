import Link from 'next/link';
import { MapPin, Share2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function Footer() {
  return (
    <footer className="w-full bg-surface-inverse text-inverse-text px-2xl py-lg flex flex-col md:flex-row items-center justify-between h-[120px]">
      <div className="flex flex-col gap-xs">
        <span className="text-body-sm-semibold text-inverse-text opacity-80 uppercase tracking-wider">
          VERDANT AMBER COFFEE COLLECTIVE
        </span>
        <span className="text-caption-inter text-inverse-text opacity-60 uppercase">
          © 2024 Verdant Amber Coffee Collective
        </span>
      </div>

      <nav className="flex items-center gap-xl">
        <Link href="/privacy" className="text-overline-inter text-text-muted hover:text-inverse-text transition-colors">
          CHÍNH SÁCH BẢO MẬT
        </Link>
        <Link href="/sustainability" className="text-overline-inter text-text-muted hover:text-inverse-text transition-colors">
          PHÁT TRIỂN BỀN VỮNG
        </Link>
        <Link href="/careers" className="text-overline-inter text-text-muted hover:text-inverse-text transition-colors">
          TUYỂN DỤNG
        </Link>
      </nav>

      <div className="flex items-center gap-md">
        <Button variant="ghost" size="icon" className="size-10 text-inverse-text hover:bg-white/10">
          <MapPin className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-10 text-inverse-text hover:bg-white/10">
          <Share2 className="size-5" />
        </Button>
      </div>
    </footer>
  );
}
