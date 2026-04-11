import Link from 'next/link';
import { MapPin, Share2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function Footer() {
  return (
    <footer className="w-full bg-surface-inverse text-text-inverse px-2xl py-lg flex flex-col md:flex-row items-center justify-between h-[120px]">
      <div className="flex flex-col gap-xs">
        <span className="text-body-sm-semibold text-text-inverse opacity-80 uppercase tracking-wider">
          VERDANT AMBER COFFEE COLLECTIVE
        </span>
        <span className="text-caption-inter text-text-inverse opacity-60 uppercase">
          © 2024 Verdant Amber Coffee Collective
        </span>
      </div>

      <nav className="flex items-center gap-xl">
        <Link href="/privacy" className="text-overline-inter text-text-muted hover:text-text-inverse transition-colors">
          PRIVACY POLICY
        </Link>
        <Link href="/sustainability" className="text-overline-inter text-text-muted hover:text-text-inverse transition-colors">
          SUSTAINABILITY
        </Link>
        <Link href="/careers" className="text-overline-inter text-text-muted hover:text-text-inverse transition-colors">
          CAREERS
        </Link>
      </nav>

      <div className="flex items-center gap-md">
        <Button variant="ghost" size="icon" className="size-10 text-text-inverse hover:bg-white/10">
          <MapPin className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-10 text-text-inverse hover:bg-white/10">
          <Share2 className="size-5" />
        </Button>
      </div>
    </footer>
  );
}
