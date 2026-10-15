'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function CaseStudyChart({ title, series, note }) {
  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <span className="eyebrow mb-2">Evidence</span>
          <h3 className="text-[20px] font-semibold mt-2">{title}</h3>
        </div>
      </div>
      <div className="h-[280px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(31,94,255)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="rgb(31,94,255)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgb(230,228,222)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="x" stroke="rgb(94,99,107)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgb(94,99,107)" fontSize={12} tickLine={false} axisLine={false} width={40} />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid rgb(230,228,222)', borderRadius: 8, fontSize: 13 }} />
            <Area type="monotone" dataKey="y" stroke="rgb(31,94,255)" strokeWidth={2} fill="url(#g1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {note && <p className="text-[12px] text-muted mt-4 font-mono">{note}</p>}
    </div>
  );
}
