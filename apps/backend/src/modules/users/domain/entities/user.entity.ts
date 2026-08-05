export interface PublicUser {
  uuid: string;
  login: string;
  createdAt: string;
  updatedAt: string;
}

export class User {
  constructor(
    public readonly uuid: string,
    public readonly login: string,
    public readonly hashPassword: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  toPublic(): PublicUser {
    return {
      uuid: this.uuid,
      login: this.login,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
