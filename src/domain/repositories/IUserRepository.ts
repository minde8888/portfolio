import { User } from "../entities/User";

export interface IUserRepository {
  findById(id: number): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
  getAll(): Promise<User[] | undefined>;
  update(user: User): Promise<User>;
  remove(id:number): Promise<void> ;
}
