import { ConfigurableCache } from '../cache/ConfigurableCache';
import { CreateUserUseCase } from "../../application/useCases/CreateUserUseCase";
import { GetAllUsersUseCase } from "../../application/useCases/GetAllUsersUseCase";
import { UserEntity } from "../entities/UserEntity";
import { TypeORMUserRepository } from "../repositories/TypeORMUserRepository";
import { UserController } from "../../presentation/controllers/UserController";
import { AppDataSource } from "../../infrastructure/config/database";
import { GetUserByIdUseCase } from "../../application/useCases/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/useCases/UpdateUserUseCase";
import { RemoveUserUseCase } from "../../application/useCases/RemoveUserUseCase";
import { ICacheService } from "../../domain/services/ICacheService";
import { JwtAuthService } from '../auth/JwtAuthService';
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase';
import { RegisterUseCase } from '../../application/useCases/auth/RegisterUseCase';

export function container(): UserController {
  const userRepository = new TypeORMUserRepository(
    AppDataSource.getRepository(UserEntity)
  );

  const cacheService: ICacheService = new ConfigurableCache();

  const createUserUseCase = new CreateUserUseCase(userRepository);
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(
    userRepository,
    cacheService
  );
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const removeUserUseCase = new RemoveUserUseCase(userRepository);
  const authService = new JwtAuthService(userRepository);
  const loginUseCase = new LoginUseCase(userRepository, authService);
  const registerUseCase = new RegisterUseCase(userRepository);

  return new UserController(
    createUserUseCase,
    getAllUsersUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    removeUserUseCase,
    loginUseCase,
    registerUseCase
  );
}
