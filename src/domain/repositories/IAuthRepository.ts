import { Auth } from "../entities/Auth";

export interface IAuthRepository {
    findById(id: string): Promise<Auth | null>;
    findByEmail(email: string): Promise<Auth | null>;
    create(user: Omit<Auth, "id">): Promise<Auth>;
    update(id: string, user: Partial<Auth>): Promise<Auth>;
}