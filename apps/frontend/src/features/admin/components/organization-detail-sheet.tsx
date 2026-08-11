"use client";

import type { PublicOrganizationType } from "@repo/types";
import { useState } from "react";

import { InfoRow } from "@/components/shared/field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useUpdateOrganization } from "@/features/organizations/hooks/use-update-organization";
import { formatDateTime } from "@/lib/format";

type OrganizationDetailSheetProps = {
  organization: PublicOrganizationType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrganizationDetailSheet({
  organization,
  open,
  onOpenChange,
}: OrganizationDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 sm:w-1/4 sm:max-w-none"
        showCloseButton
      >
        {organization ? (
          <OrganizationDetailContent
            key={organization.uuid}
            organization={organization}
            onOpenChange={onOpenChange}
          />
        ) : (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>Организация</SheetTitle>
              <SheetDescription>
                Полная информация об организации
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

type OrganizationDetailContentProps = {
  organization: PublicOrganizationType;
  onOpenChange: (open: boolean) => void;
};

function OrganizationDetailContent({
  organization,
  onOpenChange,
}: OrganizationDetailContentProps) {
  const updateOrganization = useUpdateOrganization();
  const [active, setActive] = useState(organization.active);
  const hasChanges = active !== organization.active;

  const handleSave = async () => {
    if (!hasChanges) {
      return;
    }

    await updateOrganization.mutateAsync({
      uuid: organization.uuid,
      body: { active },
    });
    onOpenChange(false);
  };

  return (
    <>
      <SheetHeader className="border-b">
        <SheetTitle>{organization.name}</SheetTitle>
        <SheetDescription>Полная информация об организации</SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4">
          <Badge variant={active ? "default" : "secondary"}>
            {active ? "Активна" : "Неактивна"}
          </Badge>
        </div>

        <dl>
          <InfoRow label="UUID" value={organization.uuid} />
          <InfoRow label="Название" value={organization.name} />
          <InfoRow
            label="Описание"
            value={organization.description?.trim() || "—"}
          />
          <InfoRow label="ИНН" value={organization.inn ?? "—"} />
          <InfoRow
            label="Участники (активные)"
            value={`${organization.currentMembersActive} / ${organization.maxMembers}`}
          />
          <InfoRow
            label="Участники (всего)"
            value={String(organization.currentMembersAll)}
          />
          <InfoRow label="ID владельца" value={organization.ownerId} />
          <InfoRow
            label="Создана"
            value={formatDateTime(organization.createdAt)}
          />
          <InfoRow
            label="Обновлена"
            value={formatDateTime(organization.updatedAt)}
          />
        </dl>

        <div className="mt-4 flex items-center justify-between rounded-lg border px-3 py-3">
          <div>
            <p className="text-sm font-medium">Активна</p>
            <p className="text-xs text-muted-foreground">
              Неактивная организация отключается в системе
            </p>
          </div>
          <Switch
            checked={active}
            onCheckedChange={setActive}
            disabled={updateOrganization.isPending}
          />
        </div>
      </div>

      <SheetFooter className="border-t">
        <Button
          type="button"
          disabled={!hasChanges || updateOrganization.isPending}
          onClick={() => void handleSave()}
        >
          {updateOrganization.isPending ? "Сохраняем..." : "Сохранить"}
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
