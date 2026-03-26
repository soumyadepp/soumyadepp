import { ReactNode } from "react";

interface PageHeaderProps {
  children: ReactNode;
  maxWidth?: string;
}

export default function PageHeader({
  children,
  maxWidth = "max-w-5xl",
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-zinc-200/60 dark:border-zinc-800/60 pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
      <div
        className="absolute inset-0 opacity-[0.11] dark:opacity-[0.09]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,165,233,1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 110%, transparent 20%, var(--background) 80%)",
        }}
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-sky-600/8 blur-[120px] pointer-events-none" />
      <div className={`relative ${maxWidth} mx-auto`}>{children}</div>
    </div>
  );
}
