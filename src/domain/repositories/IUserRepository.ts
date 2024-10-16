import { User } from "../entities/User";

export interface IUserRepository {
  // findById(id: number): Promise<User | undefined>;
  // findByEmail(email: string): Promise<User | undefined>;
  // getAll(): Promise<User[] | undefined>;
  // update(user: User): Promise<User>;
  // remove(id:number): Promise<void> ;
  // create(user: Omit<User, "id">): Promise<User>;
  // update(id: number, user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(user: Omit<User, "id">): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User>;
}
