'use client';
import { motion } from 'framer-motion';

export function ProgressBar({ label, percent, hint }: { label: string; percent: number; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{hint ?? `${percent}%`}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
        />
      </div>
    </div>
  );
}
