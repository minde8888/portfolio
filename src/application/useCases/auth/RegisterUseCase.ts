import * as bcrypt from "bcrypt";
import { IUserRepository } from './../../../domain/repositories/IUserRepository';

export class RegisterUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(email: string, name: string, password: string, role: string): Promise<number> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({
            email, password: hashedPassword, role,
            name: name,
            refreshToken: null
        });
        return user.id;
    }
}