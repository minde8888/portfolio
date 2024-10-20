import { AutoMap } from '@automapper/classes';

export class Auth {
  @AutoMap()
  id: number;

  @AutoMap()
  email: string;

  @AutoMap()
  name: string;

  @AutoMap()
  password: string;

  @AutoMap()
  role: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;

  @AutoMap()
  refreshToken: string | null;

  constructor(
    id: number,
    email: string,
    name: string,
    password: string,
    role: string,
    refreshToken: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.role = role;
    this.refreshToken = refreshToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}