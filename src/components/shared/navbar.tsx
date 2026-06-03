'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { NAV_ITEMS, SITE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl"
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="hidden sm:inline text-gradient">{SITE.name}</span>
        </Link>
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="hidden lg:block">
          <Button asChild size="sm"><Link href="/login">Login</Link></Button>
        </div>
        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      <div className={cn('lg:hidden overflow-hidden border-t border-white/10 transition-all', open ? 'max-h-[600px]' : 'max-h-0')}>
        <div className="container flex flex-col gap-1 py-4">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5">
              {item.label}
            </Link>
          ))}
          <Button asChild className="mt-2"><Link href="/login">Login</Link></Button>
        </div>
      </div>
    </motion.header>
  );
}
