import { Auth } from "../entities/auth/Auth";

export interface IAuthRepository {
    findByEmail(email: string): Promise<Auth | null>;
    create(auth: Omit<Auth, 'id'>): Promise<{ status: number; error?: string; auth?: Auth }>;
}