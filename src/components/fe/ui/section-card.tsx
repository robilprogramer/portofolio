import { ReactNode } from "react";

interface SectionCardProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ id, children, className = "" }: SectionCardProps) {
  return (
    <section
      id={id}
      className={`relative w-full rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 lg:p-16 overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}