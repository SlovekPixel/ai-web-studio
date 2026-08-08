import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
