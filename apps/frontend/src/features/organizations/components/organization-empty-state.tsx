import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type OrganizationEmptyStateProps = {
  canCreate?: boolean;
};

export function OrganizationEmptyState({
  canCreate = true,
}: OrganizationEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Организация не назначена</CardTitle>
        <CardDescription>
          Сейчас у вашего аккаунта нет организации. Создайте её, чтобы начать
          работу в кабинете.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl bg-muted/50 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            После создания организации здесь появятся название, ИНН, описание и
            другие данные из контракта API.
          </p>
        </div>
      </CardContent>
      {canCreate ? (
        <CardFooter>
          <Button render={<Link href="/organizations/new" />}>
            Создать организацию
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
