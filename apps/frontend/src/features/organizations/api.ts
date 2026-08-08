import {
  CreateOrganizationRequestSchema,
  PublicOrganizationSchema,
  UpdateOrganizationRequestSchema,
  type CreateOrganizationRequestType,
  type PublicOrganizationType,
  type UpdateOrganizationRequestType,
} from "@repo/types";
import { z } from "zod";

import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";

const PublicOrganizationListSchema = z.array(PublicOrganizationSchema);

export const organizationsApi = {
  list(): Promise<PublicOrganizationType[]> {
    return api.get(apiRoutes.organizations.root, {
      responseSchema: PublicOrganizationListSchema,
    });
  },

  getByUuid(uuid: string): Promise<PublicOrganizationType> {
    return api.get(apiRoutes.organizations.byUuid(uuid), {
      responseSchema: PublicOrganizationSchema,
    });
  },

  create(body: CreateOrganizationRequestType): Promise<PublicOrganizationType> {
    return api.post(apiRoutes.organizations.root, {
      body,
      bodySchema: CreateOrganizationRequestSchema,
      responseSchema: PublicOrganizationSchema,
    });
  },

  update(
    uuid: string,
    body: UpdateOrganizationRequestType,
  ): Promise<PublicOrganizationType> {
    return api.patch(apiRoutes.organizations.byUuid(uuid), {
      body,
      bodySchema: UpdateOrganizationRequestSchema,
      responseSchema: PublicOrganizationSchema,
    });
  },
};
