import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[28rem] w-full max-w-md rounded-xl" />}>
      <LoginForm />
    </Suspense>
  );
}
