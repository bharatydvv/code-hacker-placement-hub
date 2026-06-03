'use client';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/marketing/animated-counter';
import type { LucideIcon } from 'lucide-react';

export function StatCard({ icon: Icon, label, value, suffix }: { icon: LucideIcon; label: string; value: number; suffix?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10">
          <Icon className="h-4 w-4 text-accent" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold"><AnimatedCounter value={value} suffix={suffix} /></div>
    </motion.div>
  );
}
