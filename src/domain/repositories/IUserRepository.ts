import { User } from "../entities/User";

export interface IUserRepository {
  getAll(): Promise<User[] | undefined>;
  remove(id: number): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  update(id: number, user: Partial<User>): Promise<User>;

  create(user: User): Promise<{ status: number; error?: string }>;
}
