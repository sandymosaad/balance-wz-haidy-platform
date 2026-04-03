import type {ReactNode} from 'react';

type StatsCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  hint?: string;
};

export function StatsCard({title, value, icon, hint}: StatsCardProps) {
  return (
    <article className="rounded-2xl border border-art-sage bg-art-beige/60 p-5 shadow-soft transition-all duration-calm hover:-translate-y-0.5 hover:shadow-card">
      <div className="mb-3 flex items-center justify-between text-art-terracotta">{icon}</div>
      <p className="text-sm text-art-clay">{title}</p>
      <p className="mt-1 font-serif text-3xl text-art-charcoal">{value.toLocaleString()}</p>
      {hint ? <p className="mt-1 text-xs text-art-clay">{hint}</p> : null}
    </article>
  );
}
