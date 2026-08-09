import type { PublicComfyUiIntegrationType } from '@repo/types';

export class ComfyUiIntegration {
  constructor(
    public readonly orgId: string,
    public readonly token: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  toPublic(): PublicComfyUiIntegrationType {
    return {
      orgId: this.orgId,
      token: this.token,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
