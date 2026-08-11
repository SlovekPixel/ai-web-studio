"use client";

import type { OrganizationMemberInviteResponseType } from "@repo/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type CreateMemberInviteCardProps = {
  isAtMemberLimit?: boolean;
};

export function CreateMemberInviteCard({
  isAtMemberLimit = false,
}: CreateMemberInviteCardProps) {
  const [invite, setInvite] =
    useState<OrganizationMemberInviteResponseType | null>(null);
  const [now, setNow] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const generateInvite = async () => {
    if (isAtMemberLimit) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await organizationsApi.createMemberInvite();
      setInvite(created);
      toast.success("Ссылка сгенерирована");
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось сгенерировать ссылку"));
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <CardTitle>Добавить пользователя</CardTitle>
        <CardDescription>
          Сгенерируйте одноразовую ссылку на регистрацию участника. Действует 2
          минуты; новая ссылка отменяет предыдущую.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAtMemberLimit ? (
          <Alert>
            <AlertTitle>Лимит участников</AlertTitle>
            <AlertDescription>
              Достигнут лимит активных участников организации. Уберите
              участника, чтобы освободить место для нового.
            </AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {invite && !isAtMemberLimit ? (
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
        <Button
          type="button"
          onClick={generateInvite}
          disabled={isSubmitting || isAtMemberLimit}
        >
          {isSubmitting ? "Генерируем..." : "Сгенерировать"}
        </Button>
      </CardFooter>
    </Card>
  );
}
