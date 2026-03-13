interface StatCardProps {
  label: string;
  value: number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 py-4">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-[var(--muted)]">{label}</span>
    </div>
  );
}
