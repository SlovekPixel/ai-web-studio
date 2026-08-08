"use client";

import type { PublicOrganizationType } from "@repo/types";
import { useMemo, useState } from "react";

import { OrganizationDetailSheet } from "@/features/admin/components/organization-detail-sheet";
import {
  TablePagination,
  type PageSize,
} from "@/features/admin/components/table-pagination";
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

type OrganizationsTableProps = {
  organizations: PublicOrganizationType[];
};

export function OrganizationsTable({ organizations }: OrganizationsTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [selectedOrganization, setSelectedOrganization] =
    useState<PublicOrganizationType | null>(null);

  const totalPages = Math.max(1, Math.ceil(organizations.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return organizations.slice(start, start + pageSize);
  }, [organizations, pageSize, safePage]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>ИНН</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Создана</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Организации не найдены
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((organization) => (
                <TableRow
                  key={organization.uuid}
                  className="cursor-pointer"
                  onClick={() => setSelectedOrganization(organization)}
                >
                  <TableCell className="font-medium">
                    {organization.name}
                  </TableCell>
                  <TableCell>{organization.inn ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={organization.active ? "default" : "secondary"}
                    >
                      {organization.active ? "Активна" : "Неактивна"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDateTime(organization.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={safePage}
        pageSize={pageSize}
        total={organizations.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <OrganizationDetailSheet
        organization={selectedOrganization}
        open={selectedOrganization !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrganization(null);
          }
        }}
      />
    </div>
  );
}
