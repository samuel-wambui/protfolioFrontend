type SectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
};

export function Section({ eyebrow, title, description, children, id }: SectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" id={id}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-success-500">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          {description ? <p className="mt-4 text-base leading-7 text-slate-300">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
