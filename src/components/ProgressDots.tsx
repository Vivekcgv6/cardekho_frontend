export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current
              ? "w-8 bg-(--color-ember)"
              : i < current
              ? "w-1.5 bg-(--color-ember-soft)"
              : "w-1.5 bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}
