export default function StatBlock({ value, label }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[clamp(32px,5vw,48px)] font-medium text-accent leading-none tracking-tight">{value}</span>
      <span className="text-[13px] uppercase tracking-[0.1em] text-muted mt-3">{label}</span>
    </div>
  );
}

export function StatStrip({ stats, columns = 4 }) {
  const colClass = columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';
  return (
    <div className={`grid grid-cols-2 ${colClass} gap-y-10 gap-x-4 md:divide-x md:divide-line`}>
      {stats.map((s, i) => (
        <div key={i} className="md:px-6 first:md:pl-0">
          <StatBlock value={s.value} label={s.label} />
        </div>
      ))}
    </div>
  );
}
