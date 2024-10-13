import { CreateUserUseCase } from "../../application/useCases/CreateUserUseCase";
import { GetAllUsersUseCase } from "../../application/useCases/GetAllUsersUseCase";
import { UserEntity } from "../entities/UserEntity";
import { TypeORMUserRepository } from "../repositories/TypeORMUserRepository";
import { UserController } from "../../presentation/controllers/UserController";
import { AppDataSource } from "../../infrastructure/config/database";
import { GetUserByIdUseCase } from "../../application/useCases/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/useCases/UpdateUserUseCase";
import { RemoveUserUseCase } from "../../application/useCases/RemoveUserUseCase";

export function container(): UserController {
  const userRepository = new TypeORMUserRepository(
    AppDataSource.getRepository(UserEntity)
  );
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const removeUserUseCase = new RemoveUserUseCase(userRepository);

  return new UserController(
    createUserUseCase,
    getAllUsersUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    removeUserUseCase
  );
}
