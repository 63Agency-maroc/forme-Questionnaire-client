export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`} dir="ltr">
      <span className="font-[family-name:var(--font-display)] text-[1.7rem] leading-none tracking-tight">
        63
      </span>
      <span className="font-[family-name:var(--font-display)] text-[1.05rem] leading-none tracking-[0.18em] uppercase">
        Agency
      </span>
    </div>
  );
}
