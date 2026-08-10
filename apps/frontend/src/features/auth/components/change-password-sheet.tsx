"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@repo/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Field } from "@/components/shared/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useChangePassword } from "@/features/auth/hooks/use-change-password";
import { getErrorMessage } from "@/lib/api/errors";

const formSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: "Новый пароль должен отличаться от текущего",
    path: ["newPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

type ChangePasswordSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangePasswordSheet({
  open,
  onOpenChange,
}: ChangePasswordSheetProps) {
  const changePassword = useChangePassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [form, open]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await changePassword.mutateAsync(values);
      onOpenChange(false);
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error, "Не удалось сменить пароль"),
      });
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 sm:w-1/4 sm:max-w-none"
        showCloseButton
      >
        <SheetHeader className="border-b">
          <SheetTitle>Смена пароля</SheetTitle>
          <SheetDescription>
            Введите текущий пароль и дважды новый пароль
          </SheetDescription>
        </SheetHeader>

        <form
          id="change-password-form"
          onSubmit={onSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        >
          {form.formState.errors.root?.message ? (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          ) : null}

          <Field
            label="Текущий пароль"
            htmlFor="currentPassword"
            error={form.formState.errors.currentPassword?.message}
          >
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(form.formState.errors.currentPassword)}
              {...form.register("currentPassword")}
            />
          </Field>

          <Field
            label="Новый пароль"
            htmlFor="newPassword"
            error={form.formState.errors.newPassword?.message}
          >
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(form.formState.errors.newPassword)}
              {...form.register("newPassword")}
            />
          </Field>

          <Field
            label="Подтверждение нового пароля"
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
        </form>

        <SheetFooter className="border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            form="change-password-form"
            disabled={
              form.formState.isSubmitting || changePassword.isPending
            }
          >
            {form.formState.isSubmitting || changePassword.isPending
              ? "Сохраняем..."
              : "Сменить пароль"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
