import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';

import { GetAllUsersUseCase } from "../../application/useCases/user/GetAllUsersUseCase";
import { configureUserMapper } from '../../application/mappers/userMapper';
import { GetUserByIdUseCase } from "../../application/useCases/user/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/useCases/user/UpdateUserUseCase";
import { RemoveUserUseCase } from "../../application/useCases/user/RemoveUserUseCase";
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase';
import { RegisterUseCase } from '../../application/useCases/auth/RegisterUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase';

import { AuthEntity } from '../entities/AuthEntity';
import { UserEntity } from "../entities/UserEntity";

import { TypeORMAuthRepository } from '../repositories/TypeORMAuthRepository';
import { TypeORMUserRepository } from "../repositories/TypeORMUserRepository";

import { IAuthService } from '../../domain/services/IAuthService';
import { ICacheService } from "../../domain/services/ICacheService";

import { UserController } from "../../presentation/controllers/UserController";
import { AuthController } from '../../presentation/controllers/AuthController';

import { Database } from "../database/Database";

import { JwtAuthService } from '../auth/JwtAuthService';

import { ConfigurableCache } from '../cache/ConfigurableCache';

import { IContainerResult } from '../interfaces/IContainerResult';

import { IJwtConfig } from '../types';


export async function container(
  config?: Partial<IJwtConfig>,
  use_redis?: boolean,
  redis_url?: string
): Promise<IContainerResult> {
  
  const database = Database.getInstance();
  await database.connect();

  const dataSource = database.getDataSource();

  const userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );

  const authRepository = new TypeORMAuthRepository(
    dataSource.getRepository(AuthEntity)
  );

  // Services
  const cacheService: ICacheService = new ConfigurableCache(use_redis, redis_url);
  const authService: IAuthService = new JwtAuthService(authRepository, config);

  // Configure AutoMapper
  const mapper = createMapper({
    strategyInitializer: classes(),
  });
  configureUserMapper(mapper);

  // User Use Cases
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository, mapper);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository, cacheService, mapper);
  const updateUserUseCase = new UpdateUserUseCase(userRepository, authRepository, mapper);
  const removeUserUseCase = new RemoveUserUseCase(userRepository);

  // Auth Use Cases
  const loginUseCase = new LoginUseCase(userRepository, authService, mapper);
  const registerUseCase = new RegisterUseCase(authRepository, userRepository, mapper);
  const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, authService);

  // Controllers
  const userController = new UserController(
    getAllUsersUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    removeUserUseCase
  );

  const authController = new AuthController(
    loginUseCase,
    registerUseCase,
    refreshTokenUseCase
  );

  return { userController, authController, mapper };
}