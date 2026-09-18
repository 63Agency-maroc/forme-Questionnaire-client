"use client";

type FieldProps = {
  label: React.ReactNode;
  optional?: boolean;
  optionalLabel?: string;
  error?: string;
  children: React.ReactNode;
};

export function Field({
  label,
  optional,
  optionalLabel,
  error,
  children,
}: FieldProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="block text-[1.05rem] font-medium leading-relaxed text-white">
          {!optional ? <span className="me-1 text-white/40">*</span> : null}
          {label}
          {optional ? (
            <span className="ms-2 text-xs font-normal text-white/40">
              ({optionalLabel})
            </span>
          ) : null}
        </label>
      </div>
      {children}
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  dir = "ltr",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <input
      dir={dir}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-white/40 focus:bg-white/[0.05]"
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  dir = "ltr",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  dir?: "rtl" | "ltr";
}) {
  return (
    <textarea
      dir={dir}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3.5 text-base leading-relaxed text-white outline-none transition placeholder:text-white/30 focus:border-white/40 focus:bg-white/[0.05]"
    />
  );
}

export function ChoiceGroup({
  options,
  value,
  onChange,
  columns = 2,
  dir = "ltr",
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3;
  dir?: "rtl" | "ltr";
}) {
  const grid =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`grid gap-2.5 ${grid}`}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            dir={dir}
            onClick={() => onChange(option.value)}
            className={`rounded-2xl border px-4 py-3.5 text-start text-[0.95rem] transition ${
              selected
                ? "border-white bg-white text-black"
                : "border-white/12 bg-white/[0.03] text-white hover:border-white/30 hover:bg-white/[0.06]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ScoreScale({
  min,
  max,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  min: number;
  max: number;
  value: number | null;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  const scores = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-3" dir="ltr">
      <div className="flex flex-wrap justify-center gap-1.5 sm:justify-between">
        {scores.map((score) => {
          const selected = value === score;
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`h-11 w-11 rounded-full border text-sm font-medium transition sm:h-12 sm:w-12 ${
                selected
                  ? "border-white bg-white text-black"
                  : "border-white/15 bg-white/[0.03] text-white hover:border-white/40"
              }`}
              aria-label={`${score}`}
            >
              {score}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-white/40">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
