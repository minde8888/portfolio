import { User } from "../entities/User";

export interface IUserRepository {
  getAll(): Promise<User[] | undefined>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User>;

  create(user: User): Promise<{ status: number; error?: string }>;
}
