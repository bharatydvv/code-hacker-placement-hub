'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/marketing/animated-counter';
import {
  Eye,
  Download,
  Bookmark,
  BookOpen,
  Flame,
  Trophy,
} from 'lucide-react';

type IconName =
  | 'eye'
  | 'download'
  | 'bookmark'
  | 'book'
  | 'flame'
  | 'trophy';

const icons = {
  eye: Eye,
  download: Download,
  bookmark: Bookmark,
  book: BookOpen,
  flame: Flame,
  trophy: Trophy,
};

export function StatCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: IconName;
  label: string;
  value: number;
  suffix?: string;
}) {
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>

        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-primary/20 to-secondary/20">
          <Icon className="h-4 w-4 text-accent" />
        </span>
      </div>

      <div className="mt-3 text-3xl font-bold">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
    </motion.div>
  );
}