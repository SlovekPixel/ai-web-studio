"use client";

import { useState } from "react";

import { QueryState } from "@/components/shared/query-state";
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
import { Label } from "@/components/ui/label";
import { useDeleteComfyUiIntegration } from "@/features/integrations/hooks/use-delete-comfyui-integration";
import { useComfyUiIntegrationStatus } from "@/features/integrations/hooks/use-comfyui-integration-status";
import { useSaveComfyUiToken } from "@/features/integrations/hooks/use-save-comfyui-token";

type ComfyUiIntegrationCardProps = {
  isOrgOwner: boolean;
};

export function ComfyUiIntegrationCard({
  isOrgOwner,
}: ComfyUiIntegrationCardProps) {
  const status = useComfyUiIntegrationStatus();
  const saveToken = useSaveComfyUiToken();
  const deleteIntegration = useDeleteComfyUiIntegration();

  const [token, setToken] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const connected = Boolean(status.data?.connected);
  const showTokenForm = isOrgOwner && (!connected || isEditing);
  const isPending = saveToken.isPending || deleteIntegration.isPending;

  const handleSave = async () => {
    const trimmed = token.trim();
    if (!trimmed) {
      return;
    }

    await saveToken.mutateAsync({ token: trimmed });
    setToken("");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Удалить интеграцию ComfyUI? Токен будет удалён из организации.",
    );
    if (!confirmed) {
      return;
    }

    await deleteIntegration.mutateAsync();
    setToken("");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>ComfyUI</CardTitle>
            <CardDescription>
              Интеграция организации с ComfyUI API
            </CardDescription>
          </div>
          {status.data ? (
            <Badge variant={connected ? "default" : "secondary"}>
              {connected ? "Подключена" : "Не подключена"}
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        <QueryState
          isLoading={status.isLoading}
          error={status.error}
          loadingRows={1}
        >
          {status.data ? (
            <div className="space-y-4">
              {!isOrgOwner ? (
                <p className="text-sm text-muted-foreground">
                  {connected
                    ? "Интеграция подключена"
                    : "Интеграция не подключена"}
                </p>
              ) : null}

              {isOrgOwner && connected && !isEditing ? (
                <p className="text-sm text-muted-foreground">Токен указан</p>
              ) : null}

              {showTokenForm ? (
                <div className="space-y-2">
                  <Label htmlFor="comfyui-token">API-токен</Label>
                  <Input
                    id="comfyui-token"
                    type="password"
                    autoComplete="off"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    placeholder="Введите API-токен ComfyUI"
                    disabled={isPending}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </QueryState>
      </CardContent>

      {isOrgOwner && status.data ? (
        <CardFooter className="flex flex-wrap gap-2">
          {showTokenForm ? (
            <>
              <Button
                type="button"
                onClick={() => void handleSave()}
                disabled={isPending || token.trim().length === 0}
              >
                {saveToken.isPending ? "Сохранение..." : "Сохранить"}
              </Button>
              {connected && isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setToken("");
                  }}
                  disabled={isPending}
                >
                  Отмена
                </Button>
              ) : null}
            </>
          ) : null}

          {connected && !isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={isPending}
              >
                Сменить
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleDelete()}
                disabled={isPending}
              >
                {deleteIntegration.isPending ? "Удаление..." : "Удалить"}
              </Button>
            </>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  );
}
