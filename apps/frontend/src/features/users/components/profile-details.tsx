"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateMeRequestSchema,
  userFullNameSchema,
  type PublicUserType,
} from "@repo/types";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { InfoRow } from "@/components/shared/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { useUpdateMe } from "@/features/users/hooks/use-update-me";
import { getErrorMessage } from "@/lib/api/errors";
import { formatBoolean, formatDateTime } from "@/lib/format";

const profileFormSchema = z.object({
  fullName: userFullNameSchema,
  email: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "Введите корректный email",
    ),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileDetailsProps = {
  user: PublicUserType;
  compact?: boolean;
};

export function ProfileDetails({ user, compact = false }: ProfileDetailsProps) {
  const updateMe = useUpdateMe();
  const emailLocked = user.email !== null;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      fullName: user.fullName,
      email: user.email ?? "",
    });
  }, [form, user.email, user.fullName]);

  const onSubmit = form.handleSubmit(async (values) => {
    const body: z.infer<typeof UpdateMeRequestSchema> = {
      fullName: values.fullName,
    };

    if (!emailLocked) {
      const email = values.email.trim();
      if (email) {
        body.email = email;
      }
    }

    try {
      await updateMe.mutateAsync(body);
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error, "Не удалось обновить профиль"),
      });
    }
  });

  const fullName = useWatch({ control: form.control, name: "fullName" });
  const email = useWatch({ control: form.control, name: "email" });
  const hasChanges =
    fullName.trim() !== user.fullName ||
    (!emailLocked &&
      email.trim() !== "" &&
      email.trim() !== (user.email ?? ""));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Мой профиль</CardTitle>
            <CardDescription>
              {compact
                ? "Данные текущего пользователя из API"
                : "Можно изменить ФИО. Email задаётся один раз."}
            </CardDescription>
          </div>
          <Badge variant={user.active ? "default" : "secondary"}>
            {user.active ? "Активен" : "Неактивен"}
          </Badge>
        </div>
      </CardHeader>

      {compact ? (
        <CardContent>
          <dl>
            <InfoRow label="ID" value={user.id} />
            <InfoRow label="Логин" value={user.login} />
            <InfoRow label="ФИО" value={user.fullName} />
            <InfoRow label="Email" value={user.email ?? "—"} />
            <InfoRow
              label="Организация"
              value={user.organization?.name ?? "Не назначена"}
            />
            <InfoRow
              label="Последний вход"
              value={formatDateTime(user.loginAt)}
            />
          </dl>
        </CardContent>
      ) : (
        <form onSubmit={onSubmit}>
          <CardContent>
            {form.formState.errors.root?.message ? (
              <Alert variant="destructive" className="mb-3">
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            ) : null}

            <dl>
              <InfoRow label="ID" value={user.id} />
              <InfoRow label="Логин" value={user.login} />
              <InfoRow
                label="ФИО"
                value={
                  <div className="space-y-1">
                    <Input id="fullName" {...form.register("fullName")} />
                    {form.formState.errors.fullName?.message ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.fullName.message}
                      </p>
                    ) : null}
                  </div>
                }
              />
              <InfoRow
                label="Email"
                value={
                  <div className="space-y-1">
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      disabled={emailLocked}
                      placeholder={
                        emailLocked ? undefined : "Укажите email"
                      }
                      {...form.register("email")}
                    />
                    {form.formState.errors.email?.message ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {emailLocked
                          ? "Email уже установлен и не может быть изменён."
                          : "После сохранения email изменить будет нельзя."}
                      </p>
                    )}
                  </div>
                }
              />
              <InfoRow label="ID организации" value={user.orgId ?? "—"} />
              <InfoRow
                label="Организация"
                value={user.organization?.name ?? "Не назначена"}
              />
              <InfoRow
                label="Последний вход"
                value={formatDateTime(user.loginAt)}
              />
              <InfoRow
                label="Создан"
                value={formatDateTime(user.createdAt)}
              />
              <InfoRow
                label="Обновлён"
                value={formatDateTime(user.updatedAt)}
              />
              <InfoRow
                label="Активен"
                value={formatBoolean(user.active)}
              />
            </dl>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={
                !hasChanges ||
                form.formState.isSubmitting ||
                updateMe.isPending
              }
            >
              {form.formState.isSubmitting || updateMe.isPending
                ? "Сохраняем..."
                : "Сохранить"}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
