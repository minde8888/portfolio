import { UserNotFoundError } from "../../utils/errors";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class GetUserByIdUseCase {
    constructor(private userRepository: IUserRepository) {}
  
    async execute(id: number): Promise<User> {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new UserNotFoundError();
      }
      return user;
    }
  }