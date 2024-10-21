import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import { configureUserMapper } from '../../utils/mappers/userMapper';
import { ConfigurableCache } from '../cache/ConfigurableCache';
import { CreateUserUseCase } from "../../application/useCases/CreateUserUseCase";
import { GetAllUsersUseCase } from "../../application/useCases/GetAllUsersUseCase";
import { UserEntity } from "../entities/UserEntity";
import { TypeORMUserRepository } from "../repositories/TypeORMUserRepository";
import { UserController } from "../../presentation/controllers/UserController";
import { Database } from "../database/Database";
import { GetUserByIdUseCase } from "../../application/useCases/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/useCases/UpdateUserUseCase";
import { RemoveUserUseCase } from "../../application/useCases/RemoveUserUseCase";
import { ICacheService } from "../../domain/services/ICacheService";
import { JwtAuthService } from '../auth/JwtAuthService';
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase';
import { RegisterUseCase } from '../../application/useCases/auth/RegisterUseCase';
import { TypeORMAuthRepository } from '../repositories/TypeORMAuthRepository';
import { AuthEntity } from '../entities/AuthEntity';
import { AuthController } from '../..//presentation/controllers/AuthController';
import { IAuthService } from '../../domain/services/IAuthService';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase';
import { IContainerResult } from '../interfaces/IContainerResult';


export async function container(): Promise<IContainerResult> {
  const database = new Database();
  await database.connect();

  const dataSource = database.getDataSource();

  const userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );

  const authRepository = new TypeORMAuthRepository(
    dataSource.getRepository(AuthEntity)
  );

  // Services
  const cacheService: ICacheService = new ConfigurableCache();
  const authService: IAuthService = new JwtAuthService(authRepository);

  // Configure AutoMapper
  const mapper = createMapper({
    strategyInitializer: classes(),
  });
  configureUserMapper(mapper);

  // User Use Cases
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository, cacheService);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const removeUserUseCase = new RemoveUserUseCase(userRepository);

  // Auth Use Cases
  const loginUseCase = new LoginUseCase(authRepository, authService);
  const registerUseCase = new RegisterUseCase(authRepository, userRepository, mapper);
  const refreshTokenUseCase = new RefreshTokenUseCase(authRepository, authService);

  // Controllers
  const userController = new UserController(
    createUserUseCase,
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