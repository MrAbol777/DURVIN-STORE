import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        {eyebrow ? <p className="mb-3 text-xs font-medium tracking-[0.15em] text-primary">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
