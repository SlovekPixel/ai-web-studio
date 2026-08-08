import type { z } from "zod";

import { ApiError, type ApiErrorBody } from "@/lib/api/errors";
import { apiRoutes } from "@/lib/api/routes";

type ApiRequestOptions<TBody, TResponse> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  bodySchema?: z.ZodType<TBody>;
  responseSchema?: z.ZodType<TResponse>;
  skipRefresh?: boolean;
  signal?: AbortSignal;
};

let refreshPromise: Promise<boolean> | null = null;

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (
      typeof body?.message === "string" &&
      typeof body?.statusCode === "number"
    ) {
      return new ApiError(body);
    }
  } catch {
    // ignore
  }

  return new ApiError({
    statusCode: response.status,
    path: response.url,
    message: "Не удалось выполнить запрос",
    timestamp: new Date().toISOString(),
  });
}

async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(apiRoutes.auth.refresh, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Accept-Language": "ru",
      },
    })
      .then((response) => response.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function parseResponse<TResponse>(
  response: Response,
  responseSchema?: z.ZodType<TResponse>,
): Promise<TResponse> {
  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();
  if (!text) {
    return undefined as TResponse;
  }

  const json: unknown = JSON.parse(text);
  return responseSchema ? responseSchema.parse(json) : (json as TResponse);
}

async function request<TBody, TResponse>(
  path: string,
  options: ApiRequestOptions<TBody, TResponse> = {},
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    bodySchema,
    responseSchema,
    skipRefresh = false,
    signal,
  } = options;

  const payload =
    bodySchema && body !== undefined ? bodySchema.parse(body) : body;

  const headers = new Headers({
    Accept: "application/json",
    "Accept-Language": "ru",
  });

  if (payload !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const execute = () =>
    fetch(path, {
      method,
      credentials: "include",
      headers,
      signal,
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });

  let response = await execute();

  if (
    response.status === 401 &&
    !skipRefresh &&
    !path.startsWith("/api/auth/")
  ) {
    const refreshed = await refreshSession();
    if (refreshed) {
      response = await execute();
    }
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return parseResponse(response, responseSchema);
}

export const api = {
  get<TResponse>(
    path: string,
    options?: Omit<ApiRequestOptions<never, TResponse>, "method" | "body">,
  ) {
    return request<never, TResponse>(path, { ...options, method: "GET" });
  },

  post<TBody, TResponse = void>(
    path: string,
    options?: Omit<ApiRequestOptions<TBody, TResponse>, "method">,
  ) {
    return request<TBody, TResponse>(path, { ...options, method: "POST" });
  },

  patch<TBody, TResponse = void>(
    path: string,
    options?: Omit<ApiRequestOptions<TBody, TResponse>, "method">,
  ) {
    return request<TBody, TResponse>(path, { ...options, method: "PATCH" });
  },

  delete<TResponse = void>(
    path: string,
    options?: Omit<ApiRequestOptions<never, TResponse>, "method" | "body">,
  ) {
    return request<never, TResponse>(path, { ...options, method: "DELETE" });
  },
};
