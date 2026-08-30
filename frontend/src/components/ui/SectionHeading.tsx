import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}

export function SectionHeading({ eyebrow, title, description, dark = false }: SectionHeadingProps) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${
          dark
            ? 'border-white/20 bg-white/5 text-clinical-300'
            : 'border-clinical-200 bg-clinical-50 text-clinical-600'
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-clinical-400" />
        {eyebrow}
      </span>
      <h2
        className={`mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
