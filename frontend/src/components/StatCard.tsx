import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
  bg: string;
}

export default function StatCard({ label, value, icon: Icon, accent, bg }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
        <Icon size={18} className={accent} strokeWidth={2} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}
