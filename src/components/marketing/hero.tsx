'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SITE } from '@/lib/constants';
import { AnimatedCounter } from './animated-counter';

type Stats = { resources: number; subjects: number; companies: number; downloads: number; students: number };

export function Hero({ stats }: { stats: Stats }) {
  const items = [
    { label: 'Resources', value: stats.resources },
    { label: 'Subjects', value: stats.subjects },
    { label: 'Companies', value: stats.companies },
    { label: 'Downloads', value: stats.downloads },
    { label: 'Students', value: stats.students },
  ];
  return (
    <section className="relative pt-20 pb-16 md:pt-28">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="mx-auto mb-6">🚀 Premium Placement Preparation Platform</Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl"
        >
          <span className="text-gradient">{SITE.tagline}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          {SITE.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg"><Link href="/subjects">Start Learning <ArrowRight className="h-4 w-4" /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/companies"><Building2 className="h-4 w-4" /> Explore Companies</Link></Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-5"
        >
          {items.map((it) => (
            <div key={it.label} className="glass-card p-5">
              <div className="text-2xl md:text-3xl font-bold text-gradient">
                <AnimatedCounter value={it.value} suffix="+" />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{it.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
