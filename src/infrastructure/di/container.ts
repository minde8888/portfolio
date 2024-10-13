import { CreateUserUseCase } from '../../application/useCases/CreateUserUseCase';
import { UserEntity } from '../entities/UserEntity';
import { TypeORMUserRepository } from '../repositories/TypeORMUserRepository';
import { UserController } from '../../presentation/controllers/UserController';
import { AppDataSource } from '../../infrastructure/config/database';

export function container(): UserController {
  const userRepository = new TypeORMUserRepository(AppDataSource.getRepository(UserEntity));
  const createUserUseCase = new CreateUserUseCase(userRepository);
  return new UserController(createUserUseCase);
}