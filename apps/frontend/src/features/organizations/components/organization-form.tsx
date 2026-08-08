"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOrganizationRequestSchema,
  type PublicOrganizationType,
  type PublicUserType,
} from "@repo/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { organizationsQueryKey } from "@/features/organizations/hooks/use-organizations";
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
  ownerId: z.uuid("Выберите владельца организации"),
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
      ownerId?: string;
      ownerCandidates?: PublicUserType[];
      organization?: undefined;
      redirectTo?: string;
      invalidateOrganizations?: boolean;
    }
  | {
      mode: "edit";
      ownerId?: undefined;
      ownerCandidates?: undefined;
      organization: PublicOrganizationType;
      redirectTo?: string;
      invalidateOrganizations?: boolean;
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
      ownerId: props.mode === "create" ? (props.ownerId ?? "") : "",
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
    const ownerCandidates = props.ownerCandidates;
    const requireOwnerSelect = Boolean(ownerCandidates);

    if (requireOwnerSelect && ownerCandidates!.length === 0) {
      return (
        <Alert>
          <AlertTitle>Нет доступных владельцев</AlertTitle>
          <AlertDescription>
            Чтобы создать организацию, сначала зарегистрируйте пользователя без
            организации — он станет её владельцем.
          </AlertDescription>
        </Alert>
      );
    }

    const onSubmit = createForm.handleSubmit(async (values) => {
      try {
        const organization = await organizationsApi.create({
          name: values.name,
          description: values.description?.trim()
            ? values.description.trim()
            : null,
          inn: values.inn?.trim() ? values.inn.trim() : null,
          ownerId: values.ownerId,
        });

        if (props.invalidateOrganizations) {
          await queryClient.invalidateQueries({
            queryKey: organizationsQueryKey,
          });
        } else {
          await authApi.refresh();
          await queryClient.invalidateQueries({ queryKey: meQueryKey });
        }

        toast.success("Организация создана");
        router.replace(
          props.redirectTo ?? `/organizations/${organization.uuid}`,
        );
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
            {requireOwnerSelect
              ? "Заполните данные организации и выберите владельца."
              : "Заполните данные организации. Вы будете указаны как владелец."}
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
              <Input
                id="inn"
                inputMode="numeric"
                {...createForm.register("inn")}
              />
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

            {requireOwnerSelect ? (
              <Field
                label="Владелец"
                htmlFor="ownerId"
                error={createForm.formState.errors.ownerId?.message}
              >
                <Controller
                  control={createForm.control}
                  name="ownerId"
                  render={({ field }) => (
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                    >
                      <SelectTrigger id="ownerId" className="w-full">
                        <SelectValue placeholder="Выберите пользователя" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {ownerCandidates!.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.fullName} ({user.login})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            ) : (
              <input type="hidden" {...createForm.register("ownerId")} />
            )}
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
      router.replace(
        props.redirectTo ?? `/organizations/${organization.uuid}`,
      );
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
