export type ApiErrorBody = {
  statusCode: number;
  path: string;
  message: string;
  details?: string;
  timestamp: string;
};

export class ApiError extends Error {
  readonly statusCode: number;
  readonly path: string;
  readonly details?: string;
  readonly timestamp: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.statusCode = body.statusCode;
    this.path = body.path;
    this.details = body.details;
    this.timestamp = body.timestamp;
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.details ? `${error.message}: ${error.details}` : error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
