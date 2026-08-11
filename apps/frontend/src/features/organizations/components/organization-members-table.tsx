"use client";

import type { PublicUserType } from "@repo/types";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeactivateOrganizationMember } from "@/features/organizations/hooks/use-deactivate-organization-member";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDateTime } from "@/lib/format";

type OrganizationMembersTableProps = {
  members: PublicUserType[];
  canManageMembers?: boolean;
};

export function OrganizationMembersTable({
  members,
  canManageMembers = false,
}: OrganizationMembersTableProps) {
  const deactivateMember = useDeactivateOrganizationMember();
  const columnCount = canManageMembers ? 7 : 6;

  const handleDeactivate = async (member: PublicUserType) => {
    const confirmed = window.confirm(
      `Убрать ${member.fullName} из организации? Аккаунт станет неактивным, восстановить статус через этот интерфейс нельзя.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deactivateMember.mutateAsync(member.id);
      toast.success("Участник деактивирован");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не удалось убрать участника"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Участники</CardTitle>
        <CardDescription>
          Пользователи, входящие в вашу организацию
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ФИО</TableHead>
                <TableHead>Логин</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Создан</TableHead>
                {canManageMembers ? <TableHead>Действия</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Участники не найдены
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => {
                  const canDeactivate =
                    canManageMembers &&
                    member.active &&
                    !member.isOrgOwner;

                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.fullName}
                      </TableCell>
                      <TableCell>{member.login}</TableCell>
                      <TableCell>{member.email ?? "—"}</TableCell>
                      <TableCell>
                        {member.isOrgOwner ? "Владелец" : "Участник"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={member.active ? "default" : "secondary"}
                        >
                          {member.active ? "Активен" : "Неактивен"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDateTime(member.createdAt)}
                      </TableCell>
                      {canManageMembers ? (
                        <TableCell>
                          {canDeactivate ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={deactivateMember.isPending}
                              onClick={() => void handleDeactivate(member)}
                            >
                              Убрать
                            </Button>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      ) : null}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
