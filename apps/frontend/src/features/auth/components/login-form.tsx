"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequestSchema } from "@repo/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Field } from "@/components/shared/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authApi } from "@/features/auth/api";
import { getErrorMessage } from "@/lib/api/errors";

type LoginFormValues = z.infer<typeof LoginRequestSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await authApi.login(values);
      toast.success("Вход выполнен");
      router.replace(nextPath.startsWith("/") ? nextPath : "/dashboard");
      router.refresh();
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error, "Не удалось войти"),
      });
    }
  });

  return (
    <Card className="w-full max-w-md border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle>Вход</CardTitle>
        <CardDescription>
          Войдите в кабинет организации AI Web Studio
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {form.formState.errors.root?.message ? (
            <Alert variant="destructive">
              <AlertTitle>Ошибка входа</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          ) : null}

          <Field
            label="Логин"
            htmlFor="login"
            error={form.formState.errors.login?.message}
          >
            <Input
              id="login"
              autoComplete="username"
              aria-invalid={Boolean(form.formState.errors.login)}
              {...form.register("login")}
            />
          </Field>

          <Field
            label="Пароль"
            htmlFor="password"
            error={form.formState.errors.password?.message}
            className="mb-4"
          >
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
          </Field>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Входим..." : "Войти"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
