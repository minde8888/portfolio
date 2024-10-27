import { User } from "../entities/User";

export interface IUserRepository {
  getAll(): Promise<User[] | undefined>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<{ status: number; error?: string }>;
  update(id: string, user: Partial<User>): Promise<User>;
  remove(id: string): Promise<{ status: number; error?: string }>;
}
