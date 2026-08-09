"use client";

import type { PublicUserType } from "@repo/types";

import { Badge } from "@/components/ui/badge";
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
import { formatDateTime } from "@/lib/format";

type OrganizationMembersTableProps = {
  members: PublicUserType[];
};

export function OrganizationMembersTable({
  members,
}: OrganizationMembersTableProps) {
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Участники не найдены
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
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
                      <Badge variant={member.active ? "default" : "secondary"}>
                        {member.active ? "Активен" : "Неактивен"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(member.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
