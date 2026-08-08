import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_45%),linear-gradient(180deg,_oklch(0.99_0_0),_oklch(0.96_0_0))] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.12),_transparent_40%),linear-gradient(180deg,_oklch(0.16_0_0),_oklch(0.12_0_0))]">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            AI Web Studio
          </p>
          <p className="text-sm text-muted-foreground">Кабинет организации</p>
        </div>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
