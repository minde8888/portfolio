import { Auth } from "../entities/auth/Auth";
import { IBaseRepository } from "./IRepository";

export interface IAuthRepository extends IBaseRepository<Auth> {
    findByEmail(email: string): Promise<Auth | null>;
    create(auth: Omit<Auth, 'id'>): Promise<{ status: number; error?: string; data?: Auth }>;
}