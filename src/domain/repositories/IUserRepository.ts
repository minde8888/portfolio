import { User } from "../entities/user/User";
import { IBaseRepository } from "./IRepository";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}