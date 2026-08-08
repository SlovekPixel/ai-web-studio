"use client";

import {
  Building2,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useMe } from "@/features/users/hooks/use-me";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Главная",
    icon: LayoutDashboard,
  },
  {
    href: "/organizations",
    label: "Моя организация",
    icon: Building2,
  },
  {
    href: "/profile",
    label: "Мой профиль",
    icon: UserRound,
  },
] as const;

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin/users",
    label: "Управление пользователями",
    icon: Users,
  },
  {
    href: "/admin/organizations",
    label: "Управление организациями",
    icon: Shield,
  },
] as const;

type AppSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const me = useMe();
  const isAdmin = Boolean(me.data?.isAdmin);

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="px-5 py-6">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          AI Web Studio
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">Кабинет</h1>
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={active}
              onNavigate={onNavigate}
            />
          );
        })}
      </nav>

      <div className="space-y-3 p-3">
        {isAdmin ? (
          <div className="space-y-1">
            <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Администрирование
            </p>
            {ADMIN_NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={active}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        ) : null}

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          <LogOut className="size-4" />
          {logout.isPending ? "Выход..." : "Выйти"}
        </Button>
      </div>
    </aside>
  );
}
