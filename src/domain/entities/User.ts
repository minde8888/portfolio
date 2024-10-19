import { AutoMap } from '@automapper/classes';

export class User {
  @AutoMap()
  id: number;

  @AutoMap()
  email: string;

  @AutoMap()
  name: string;

  @AutoMap()
  role: string;

  @AutoMap()
  refreshToken: string | null;

  constructor(
    id: number,
    email: string,
    name: string,
    role: string,
    refreshToken: string | null = null
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.refreshToken = refreshToken;
  }
}