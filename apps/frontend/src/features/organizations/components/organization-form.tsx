"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  organizationNameSchema,
  type PublicOrganizationType,
} from "@repo/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Field } from "@/components/shared/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/api/errors";
import { organizationsApi } from "@/features/organizations/api";

const updateFormSchema = z.object({
  name: organizationNameSchema,
  description: z.string().trim().max(5000).nullable().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

type OrganizationFormProps = {
  organization: PublicOrganizationType;
  redirectTo?: string;
};

export function OrganizationForm({
  organization,
  redirectTo,
}: OrganizationFormProps) {
  const router = useRouter();

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: organization.name,
      description: organization.description ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const updated = await organizationsApi.update(organization.uuid, {
        name: values.name,
        description: values.description?.trim()
          ? values.description.trim()
          : null,
      });
      toast.success("Организация обновлена");
      router.replace(redirectTo ?? `/organizations/${updated.uuid}`);
      router.refresh();
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error, "Не удалось обновить организацию"),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Редактирование организации</CardTitle>
        <CardDescription>
          Можно изменить название и описание организации
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {form.formState.errors.root?.message ? (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          ) : null}

          <Field
            label="Название"
            htmlFor="name"
            error={form.formState.errors.name?.message}
          >
            <Input id="name" {...form.register("name")} />
          </Field>

          <Field
            label="Описание"
            htmlFor="description"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              id="description"
              rows={4}
              {...form.register("description")}
            />
          </Field>
        </CardContent>
        <CardFooter className="gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Сохраняем..." : "Сохранить"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
