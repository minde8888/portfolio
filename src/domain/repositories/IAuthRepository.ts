import { Auth } from "../entities/Auth";

export interface IAuthRepository {
    findByEmail(email: string): Promise<Auth | null>;
    create(user: Omit<Auth, "id">): Promise<{ status: number; user: Auth; error?: string }>;
    update(id: string, user: Partial<Auth>): Promise<Auth>;
}