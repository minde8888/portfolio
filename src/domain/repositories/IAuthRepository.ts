import { Auth } from "../entities/Auth";

export interface IAuthRepository {
    findById(id: number): Promise<Auth | null>;
    findByEmail(email: string): Promise<Auth | null>;
    create(user: Omit<Auth, "id">): Promise<Auth>;
    update(id: number, user: Partial<Auth>): Promise<Auth>;
}