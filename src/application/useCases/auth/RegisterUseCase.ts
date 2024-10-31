import * as bcrypt from "bcrypt";
import { Mapper } from '@automapper/core';
import { HttpStatus } from "@nestjs/common";

import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Auth } from '../../../domain/entities/auth/Auth';
import { User } from "../../../domain/entities/user/User";

import { handleError } from "../../../utils/Errors/handleError";

export class RegisterUseCase {
    constructor(
        private authRepository: IAuthRepository,
        private userRepository: IUserRepository,
        private mapper: Mapper
    ) { }

    async execute(email: string, name: string, password: string, role: string): Promise<{ status: number; error?: string }> {

        try {
            if (!email || !name || !password || !role) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Missing required fields'
                };
            }

            const existingUser = await this.authRepository.findByEmail(email);
            if (existingUser) {
                return {
                    status: HttpStatus.CONFLICT,
                    error: 'Email already exists'
                };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const authCreationResult = await this.authRepository.create({
                email,
                password: hashedPassword,
                role,
                name: name,
                createdAt: new Date(),
                updatedAt: null
            });

            const { auth: auth } = authCreationResult;
            const user = this.mapper.map(auth, Auth, User);
            await this.userRepository.create(user);

            return {
                status: HttpStatus.CREATED,
            };

        } catch (error) {
            return handleError(error);
        }
    }
}