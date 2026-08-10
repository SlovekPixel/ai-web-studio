import type { PublicOrganizationType } from "@repo/types";
import Link from "next/link";

import { InfoRow } from "@/components/shared/field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatBoolean, formatDateTime } from "@/lib/format";

type OrganizationDetailsProps = {
  organization: PublicOrganizationType;
  showEdit?: boolean;
  compact?: boolean;
};

export function OrganizationDetails({
  organization,
  showEdit = false,
  compact = false,
}: OrganizationDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Моя организация</CardTitle>
          </div>
          <Badge variant={organization.active ? "default" : "secondary"}>
            {organization.active ? "Активна" : "Неактивна"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl>
          <InfoRow label="UUID" value={organization.uuid} />
          <InfoRow label="Название" value={organization.name} />
          <InfoRow
            label="Описание"
            value={organization.description?.trim() || "—"}
          />
          <InfoRow label="ИНН" value={organization.inn ?? "—"} />
          {!compact ? (
            <>
              <InfoRow label="ID владельца" value={organization.ownerId} />
              <InfoRow
                label="Создана"
                value={formatDateTime(organization.createdAt)}
              />
              <InfoRow
                label="Обновлена"
                value={formatDateTime(organization.updatedAt)}
              />
              <InfoRow
                label="Активна"
                value={formatBoolean(organization.active)}
              />
            </>
          ) : null}
        </dl>
      </CardContent>
      {showEdit ? (
        <CardFooter>
          <Button render={<Link href={`/organizations/${organization.uuid}/edit`} />}>
            Редактировать
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
