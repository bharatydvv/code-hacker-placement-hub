'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';
import type { DailyActivity } from '@/lib/dashboard-queries';

export function ActivityChart({ data }: { data: DailyActivity[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(189 94% 55%)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="hsl(221 83% 53%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: 'hsl(224 71% 6%)', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
          />
          <Area type="monotone" dataKey="count" stroke="hsl(189 94% 55%)" strokeWidth={2} fill="url(#areaGrad)" name="Activity" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
