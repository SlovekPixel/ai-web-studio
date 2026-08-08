import type { PublicUserType } from "@repo/types";

import { InfoRow } from "@/components/shared/field";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatBoolean, formatDateTime } from "@/lib/format";

type ProfileDetailsProps = {
  user: PublicUserType;
  compact?: boolean;
};

export function ProfileDetails({ user, compact = false }: ProfileDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Мой профиль</CardTitle>
            <CardDescription>
              Данные текущего пользователя из API
            </CardDescription>
          </div>
          <Badge variant={user.active ? "default" : "secondary"}>
            {user.active ? "Активен" : "Неактивен"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl>
          <InfoRow label="ID" value={user.id} />
          <InfoRow label="Логин" value={user.login} />
          <InfoRow label="ФИО" value={user.fullName} />
          <InfoRow label="Email" value={user.email ?? "—"} />
          {!compact ? (
            <>
              <InfoRow label="ID организации" value={user.orgId ?? "—"} />
              <InfoRow
                label="Организация"
                value={user.organization?.name ?? "Не назначена"}
              />
              <InfoRow label="Последний вход" value={formatDateTime(user.loginAt)} />
              <InfoRow label="Создан" value={formatDateTime(user.createdAt)} />
              <InfoRow label="Обновлён" value={formatDateTime(user.updatedAt)} />
              <InfoRow label="Активен" value={formatBoolean(user.active)} />
            </>
          ) : (
            <>
              <InfoRow
                label="Организация"
                value={user.organization?.name ?? "Не назначена"}
              />
              <InfoRow label="Последний вход" value={formatDateTime(user.loginAt)} />
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
