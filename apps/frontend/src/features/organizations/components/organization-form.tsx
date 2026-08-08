"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOrganizationRequestSchema,
  type PublicOrganizationType,
} from "@repo/types";
import { useQueryClient } from "@tanstack/react-query";
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
import { meQueryKey } from "@/features/users/hooks/use-me";
import { authApi } from "@/features/auth/api";
import { getErrorMessage } from "@/lib/api/errors";
import { organizationsApi } from "@/features/organizations/api";

const createFormSchema = z.object({
  name: CreateOrganizationRequestSchema.shape.name,
  description: z.string().trim().max(5000).optional(),
  inn: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{10}(\d{2})?$/.test(value),
      "ИНН должен содержать 10 или 12 цифр",
    )
    .optional(),
});

const updateFormSchema = z.object({
  name: CreateOrganizationRequestSchema.shape.name,
  description: z.string().trim().max(5000).nullable().optional(),
});

type CreateFormValues = z.infer<typeof createFormSchema>;
type UpdateFormValues = z.infer<typeof updateFormSchema>;

type OrganizationFormProps =
  | {
      mode: "create";
      ownerId: string;
      organization?: undefined;
    }
  | {
      mode: "edit";
      ownerId?: undefined;
      organization: PublicOrganizationType;
    };

export function OrganizationForm(props: OrganizationFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      description: "",
      inn: "",
    },
  });

  const editForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: props.organization?.name ?? "",
      description: props.organization?.description ?? "",
    },
  });

  if (props.mode === "create") {
    const onSubmit = createForm.handleSubmit(async (values) => {
      try {
        const organization = await organizationsApi.create({
          name: values.name,
          description: values.description?.trim()
            ? values.description.trim()
            : null,
          inn: values.inn?.trim() ? values.inn.trim() : null,
          ownerId: props.ownerId,
        });
        await authApi.refresh();
        await queryClient.invalidateQueries({ queryKey: meQueryKey });
        toast.success("Организация создана");
        router.replace(`/organizations/${organization.uuid}`);
        router.refresh();
      } catch (error) {
        createForm.setError("root", {
          message: getErrorMessage(error, "Не удалось создать организацию"),
        });
      }
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>Новая организация</CardTitle>
          <CardDescription>
            Заполните данные организации. Вы будете указаны как владелец.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {createForm.formState.errors.root?.message ? (
              <Alert variant="destructive">
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>
                  {createForm.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            ) : null}

            <Field
              label="Название"
              htmlFor="name"
              error={createForm.formState.errors.name?.message}
            >
              <Input id="name" {...createForm.register("name")} />
            </Field>

            <Field
              label="ИНН"
              htmlFor="inn"
              error={createForm.formState.errors.inn?.message}
            >
              <Input id="inn" inputMode="numeric" {...createForm.register("inn")} />
            </Field>

            <Field
              label="Описание"
              htmlFor="description"
              error={createForm.formState.errors.description?.message}
            >
              <Textarea
                id="description"
                rows={4}
                {...createForm.register("description")}
              />
            </Field>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="submit" disabled={createForm.formState.isSubmitting}>
              {createForm.formState.isSubmitting ? "Создаём..." : "Создать"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Отмена
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  const onSubmit = editForm.handleSubmit(async (values) => {
    try {
      const organization = await organizationsApi.update(
        props.organization.uuid,
        {
          name: values.name,
          description: values.description?.trim()
            ? values.description.trim()
            : null,
        },
      );
      toast.success("Организация обновлена");
      router.replace(`/organizations/${organization.uuid}`);
      router.refresh();
    } catch (error) {
      editForm.setError("root", {
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
          {editForm.formState.errors.root?.message ? (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>
                {editForm.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          ) : null}

          <Field
            label="Название"
            htmlFor="name"
            error={editForm.formState.errors.name?.message}
          >
            <Input id="name" {...editForm.register("name")} />
          </Field>

          <Field
            label="Описание"
            htmlFor="description"
            error={editForm.formState.errors.description?.message}
          >
            <Textarea
              id="description"
              rows={4}
              {...editForm.register("description")}
            />
          </Field>
        </CardContent>
        <CardFooter className="gap-2">
          <Button type="submit" disabled={editForm.formState.isSubmitting}>
            {editForm.formState.isSubmitting ? "Сохраняем..." : "Сохранить"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
