"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterOrgAdminRequestSchema,
  passwordSchema,
} from "@repo/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { authApi } from "@/features/auth/api";
import { getErrorMessage } from "@/lib/api/errors";

const formSchema = z
  .object({
    fullName: RegisterOrgAdminRequestSchema.shape.fullName,
    login: RegisterOrgAdminRequestSchema.shape.login,
    password: RegisterOrgAdminRequestSchema.shape.password,
    confirmPassword: passwordSchema,
    description: z.string().trim().max(5000).optional(),
    inn: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || /^\d{10}(\d{2})?$/.test(value),
        "ИНН должен содержать 10 или 12 цифр",
      )
      .optional(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

type RegisterOrgAdminFormProps = {
  token: string;
  organizationName: string;
};

export function RegisterOrgAdminForm({
  token,
  organizationName,
}: RegisterOrgAdminFormProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      login: "",
      password: "",
      confirmPassword: "",
      description: "",
      inn: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await authApi.registerOrgAdmin({
        token,
        fullName: values.fullName,
        login: values.login,
        password: values.password,
        description: values.description?.trim()
          ? values.description.trim()
          : null,
        inn: values.inn?.trim() ? values.inn.trim() : null,
      });
      toast.success("Регистрация выполнена");
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error, "Не удалось зарегистрироваться"),
      });
    }
  });

  return (
    <Card className="w-full max-w-md border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle>Регистрация владельца</CardTitle>
        <CardDescription>
          Вы присоединяетесь к организации{" "}
          <span className="font-medium text-foreground">{organizationName}</span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {form.formState.errors.root?.message ? (
            <Alert variant="destructive">
              <AlertTitle>Ошибка регистрации</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          ) : null}

          <Field label="Организация" htmlFor="organizationName">
            <Input id="organizationName" value={organizationName} readOnly />
          </Field>

          <Field
            label="ФИО"
            htmlFor="fullName"
            error={form.formState.errors.fullName?.message}
          >
            <Input
              id="fullName"
              autoComplete="name"
              aria-invalid={Boolean(form.formState.errors.fullName)}
              {...form.register("fullName")}
            />
          </Field>

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
          >
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
          </Field>

          <Field
            label="Подтверждение пароля"
            htmlFor="confirmPassword"
            error={form.formState.errors.confirmPassword?.message}
          >
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(form.formState.errors.confirmPassword)}
              {...form.register("confirmPassword")}
            />
          </Field>

          <Field
            label="ИНН"
            htmlFor="inn"
            error={form.formState.errors.inn?.message}
          >
            <Input
              id="inn"
              inputMode="numeric"
              aria-invalid={Boolean(form.formState.errors.inn)}
              {...form.register("inn")}
            />
          </Field>

          <Field
            label="Описание организации"
            htmlFor="description"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              id="description"
              rows={3}
              aria-invalid={Boolean(form.formState.errors.description)}
              {...form.register("description")}
            />
          </Field>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Создаём..." : "Зарегистрироваться"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Войти
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
