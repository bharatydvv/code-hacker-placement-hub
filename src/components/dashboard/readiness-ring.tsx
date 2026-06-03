'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export function ReadinessRing({ score }: { score: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, score, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setVal(Math.round(v)) });
    return () => controls.stop();
  }, [inView, score]);

  const offset = circumference - (val / 100) * circumference;
  const label = score >= 75 ? 'Placement Ready' : score >= 45 ? 'On Track' : 'Getting Started';

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative h-44 w-44">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="12" />
          <circle cx="80" cy="80" r={radius} fill="none" stroke="url(#grad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(221 83% 53%)" />
              <stop offset="50%" stopColor="hsl(263 70% 60%)" />
              <stop offset="100%" stopColor="hsl(189 94% 55%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gradient">{val}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-accent">{label}</p>
    </div>
  );
}
