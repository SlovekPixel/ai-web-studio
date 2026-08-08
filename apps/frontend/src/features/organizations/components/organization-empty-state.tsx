import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OrganizationEmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Организация не назначена</CardTitle>
        <CardDescription>
          Сейчас у вашего аккаунта нет организации. Обратитесь к администратору,
          чтобы вас добавили в организацию.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl bg-muted/50 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            После назначения организации здесь появятся название, ИНН, описание
            и другие данные из контракта API.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
