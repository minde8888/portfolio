import * as bcrypt from "bcrypt";
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { EmailAlreadyExistsError } from "../../../utils/Errors";
import { Mapper } from '@automapper/core';
import { Auth } from '../../../domain/entities/Auth';
import { User } from "src/domain/entities/User";

export class RegisterUseCase {
    constructor(
        private authRepository: IAuthRepository,
        private userRepository: IUserRepository,
        private mapper: Mapper
    ) { }

    async execute(email: string, name: string, password: string, role: string): Promise<{ status: number; error?: string }> {
        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) {
            throw new EmailAlreadyExistsError();
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const auth = await this.authRepository.create({
            email,
            password: hashedPassword,
            role,
            name: name,
            refreshToken: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const user = this.mapper.map(auth, Auth, User);
        const result = this.userRepository.create(user);

        return result;
    }
}