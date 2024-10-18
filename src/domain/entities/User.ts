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

  constructor(
    id: number,
    email: string,
    name: string,
    role: string
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
  }
}