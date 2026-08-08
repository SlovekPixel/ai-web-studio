"use client";

import type { PublicUserType } from "@repo/types";
import { useMemo, useState } from "react";

import {
  TablePagination,
  type PageSize,
} from "@/features/admin/components/table-pagination";
import { UserDetailSheet } from "@/features/admin/components/user-detail-sheet";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";

type UsersTableProps = {
  users: PublicUserType[];
};

export function UsersTable({ users }: UsersTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [selectedUser, setSelectedUser] = useState<PublicUserType | null>(null);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [pageSize, safePage, users]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ФИО</TableHead>
              <TableHead>Логин</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Организация</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Создан</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.login}</TableCell>
                  <TableCell>{user.email ?? "—"}</TableCell>
                  <TableCell>
                    {user.organization?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "default" : "secondary"}>
                      {user.active ? "Активен" : "Неактивен"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={safePage}
        pageSize={pageSize}
        total={users.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <UserDetailSheet
        user={selectedUser}
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
          }
        }}
      />
    </div>
  );
}
