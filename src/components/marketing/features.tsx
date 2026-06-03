'use client';
import { motion } from 'framer-motion';
import { Building2, FileText, MessagesSquare, FileQuestion, Calculator, Bookmark, LayoutDashboard, TrendingUp } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

const FEATURES = [
  { icon: Building2, title: 'Company Wise Preparation', desc: 'Targeted prep for TCS, Infosys, Amazon, Google and more.' },
  { icon: FileText, title: 'Quick Notes', desc: 'Crisp, exam-ready notes across every core subject.' },
  { icon: MessagesSquare, title: 'Interview Questions', desc: 'Technical and HR questions curated for real interviews.' },
  { icon: FileQuestion, title: 'PYQs', desc: 'Previous year questions to master patterns.' },
  { icon: Calculator, title: 'Aptitude Practice', desc: 'Quant, logical and verbal aptitude resources.' },
  { icon: Bookmark, title: 'Bookmark Resources', desc: 'Save and organize what matters for you.' },
  { icon: LayoutDashboard, title: 'Student Dashboard', desc: 'Track progress with a modern analytics dashboard.' },
  { icon: TrendingUp, title: 'Placement Tracking', desc: 'Measure your placement readiness over time.' },
];

export function Features() {
  return (
    <section className="container py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to <span className="text-gradient">get placed</span></h2>
        <p className="mt-3 text-muted-foreground">A complete, database-driven preparation platform built for serious candidates.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -6 }}
          >
            <Card className="h-full transition-colors hover:border-white/20">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10">
                <f.icon className="h-5 w-5 text-accent" />
              </div>
              <CardTitle>{f.title}</CardTitle>
              <CardDescription className="mt-2">{f.desc}</CardDescription>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
