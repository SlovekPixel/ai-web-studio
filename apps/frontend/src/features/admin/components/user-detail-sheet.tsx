"use client";

import type { PublicUserType } from "@repo/types";
import { useState } from "react";

import { InfoRow } from "@/components/shared/field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useUpdateUser } from "@/features/users/hooks/use-update-user";
import { formatBoolean, formatDateTime } from "@/lib/format";

type UserDetailSheetProps = {
  user: PublicUserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserDetailSheet({
  user,
  open,
  onOpenChange,
}: UserDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 sm:max-w-lg"
        showCloseButton
      >
        {user ? (
          <UserDetailContent
            key={user.id}
            user={user}
            onOpenChange={onOpenChange}
          />
        ) : (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>Пользователь</SheetTitle>
              <SheetDescription>
                Полная информация о пользователе и его организации
              </SheetDescription>
            </SheetHeader>
            <SheetFooter className="border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Закрыть
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

type UserDetailContentProps = {
  user: PublicUserType;
  onOpenChange: (open: boolean) => void;
};

function UserDetailContent({ user, onOpenChange }: UserDetailContentProps) {
  const updateUser = useUpdateUser();
  const [active, setActive] = useState(user.active);
  const hasChanges = active !== user.active;

  const handleSave = async () => {
    if (!hasChanges) {
      return;
    }

    await updateUser.mutateAsync({
      id: user.id,
      body: { active },
    });
    onOpenChange(false);
  };

  return (
    <>
      <SheetHeader className="border-b">
        <SheetTitle>{user.fullName}</SheetTitle>
        <SheetDescription>
          Полная информация о пользователе и его организации
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant={active ? "default" : "secondary"}>
            {active ? "Активен" : "Неактивен"}
          </Badge>
          {user.isAdmin ? <Badge variant="outline">Админ</Badge> : null}
          {user.isOrgOwner ? (
            <Badge variant="outline">Владелец организации</Badge>
          ) : null}
        </div>

        <dl>
          <InfoRow label="ID" value={user.id} />
          <InfoRow label="Логин" value={user.login} />
          <InfoRow label="ФИО" value={user.fullName} />
          <InfoRow label="Email" value={user.email ?? "—"} />
          <InfoRow label="Админ" value={formatBoolean(user.isAdmin)} />
          <InfoRow
            label="Владелец организации"
            value={formatBoolean(user.isOrgOwner)}
          />
          <InfoRow
            label="Последний вход"
            value={formatDateTime(user.loginAt)}
          />
          <InfoRow label="Создан" value={formatDateTime(user.createdAt)} />
          <InfoRow
            label="Обновлён"
            value={formatDateTime(user.updatedAt)}
          />
        </dl>

        <div className="mt-4 flex items-center justify-between rounded-lg border px-3 py-3">
          <div>
            <p className="text-sm font-medium">Активен</p>
            <p className="text-xs text-muted-foreground">
              Отключённый пользователь не сможет войти в систему
            </p>
          </div>
          <Switch
            checked={active}
            onCheckedChange={setActive}
            disabled={updateUser.isPending}
          />
        </div>

        <Separator className="my-5" />

        <div>
          <h3 className="mb-2 text-sm font-medium">Организация</h3>
          {user.organization ? (
            <dl>
              <InfoRow label="UUID" value={user.organization.uuid} />
              <InfoRow label="Название" value={user.organization.name} />
              <InfoRow
                label="Описание"
                value={user.organization.description?.trim() || "—"}
              />
              <InfoRow label="ИНН" value={user.organization.inn ?? "—"} />
              <InfoRow label="Владелец" value={user.organization.ownerId} />
              <InfoRow
                label="Активна"
                value={formatBoolean(user.organization.active)}
              />
              <InfoRow
                label="Создана"
                value={formatDateTime(user.organization.createdAt)}
              />
              <InfoRow
                label="Обновлена"
                value={formatDateTime(user.organization.updatedAt)}
              />
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Организация не назначена
            </p>
          )}
        </div>
      </div>

      <SheetFooter className="border-t">
        <Button
          type="button"
          disabled={!hasChanges || updateUser.isPending}
          onClick={() => void handleSave()}
        >
          {updateUser.isPending ? "Сохраняем..." : "Сохранить"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Закрыть
        </Button>
      </SheetFooter>
    </>
  );
}
