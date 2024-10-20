import * as bcrypt from "bcrypt";
import { IAuthRepository } from './../../../domain/repositories/IAuthRepository';
import { EmailAlreadyExistsError } from "../../../utils/Errors";

export class RegisterUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(email: string, name: string, password: string, role: string): Promise<number> {
        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) {
            throw new EmailAlreadyExistsError();
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.authRepository.create({
            email, password: hashedPassword, role,
            name: name,
            refreshToken: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return user.id;
    }
}