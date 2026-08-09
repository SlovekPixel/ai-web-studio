"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOrganizationInviteRequestSchema,
  type OrganizationInviteResponseType,
} from "@repo/types";
import { useEffect, useMemo, useState } from "react";
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
import { organizationsApi } from "@/features/organizations/api";
import { getErrorMessage } from "@/lib/api/errors";

type InviteFormValues = z.infer<typeof CreateOrganizationInviteRequestSchema>;

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function CreateOrganizationInviteForm() {
  const [invite, setInvite] = useState<OrganizationInviteResponseType | null>(
    null,
  );
  const [now, setNow] = useState(0);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(CreateOrganizationInviteRequestSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!invite) {
      return;
    }

    const tick = () => {
      setNow(Date.now());
    };

    tick();
    const timer = window.setInterval(tick, 1000);

    return () => window.clearInterval(timer);
  }, [invite]);

  const remainingMs = useMemo(() => {
    if (!invite) {
      return 0;
    }

    return new Date(invite.expiresAt).getTime() - now;
  }, [invite, now]);

  const inviteUrl = useMemo(() => {
    if (!invite || typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}${invite.invitePath}`;
  }, [invite]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const created = await organizationsApi.createInvite(values);
      setInvite(created);
      toast.success("Ссылка сгенерирована");
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error, "Не удалось сгенерировать ссылку"),
      });
    }
  });

  const copyLink = async () => {
    if (!inviteUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Создание организации</CardTitle>
        <CardDescription>
          Укажите название организации и сгенерируйте одноразовую ссылку на
          регистрацию владельца. Ссылка действует 2 минуты.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {form.formState.errors.root?.message ? (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          ) : null}

          <Field
            label="Название организации"
            htmlFor="name"
            error={form.formState.errors.name?.message}
          >
            <Input id="name" autoComplete="organization" {...form.register("name")} />
          </Field>

          {invite ? (
            <div className="space-y-3 rounded-lg border border-border/80 p-4">
              {remainingMs > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Временная ссылка. Осталось:{" "}
                    <span className="font-medium text-foreground">
                      {formatRemaining(remainingMs)}
                    </span>
                  </p>
                  <Input readOnly value={inviteUrl} />
                  <Button type="button" variant="outline" onClick={copyLink}>
                    Скопировать ссылку
                  </Button>
                </>
              ) : (
                <Alert variant="destructive">
                  <AlertTitle>Ссылка истекла</AlertTitle>
                  <AlertDescription>
                    Сгенерируйте новую ссылку, чтобы продолжить.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Генерируем..." : "Сгенерировать"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
