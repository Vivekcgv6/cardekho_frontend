export function CardSkeleton() {
  return (
    <div className="glass-panel rounded-3xl p-6 animate-pulse">
      <div className="h-40 rounded-2xl bg-white/5 mb-4" />
      <div className="h-4 w-2/3 rounded bg-white/5 mb-2" />
      <div className="h-3 w-1/2 rounded bg-white/5 mb-6" />
      <div className="h-3 w-full rounded bg-white/5 mb-2" />
      <div className="h-3 w-5/6 rounded bg-white/5" />
    </div>
  );
}

export function LoadingPulse({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-(--color-ember)/20" />
        <div className="absolute inset-0 rounded-full border-2 border-t-(--color-ember) animate-spin" />
      </div>
      <p className="font-display text-(--color-ink-muted) text-sm">{label}</p>
    </div>
  );
}
