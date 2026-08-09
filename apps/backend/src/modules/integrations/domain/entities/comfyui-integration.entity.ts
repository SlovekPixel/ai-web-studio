export class ComfyUiIntegration {
  constructor(
    public readonly orgId: string,
    public readonly token: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
