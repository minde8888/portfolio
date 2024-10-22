import { UserNotFoundError, ValidationError } from "../../utils/Errors/Errors";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ICacheService } from "../../domain/services/ICacheService";
import { validate as uuidValidate } from 'uuid';

export class GetUserByIdUseCase {
  constructor(
    private userRepository: IUserRepository,
    private cacheService: ICacheService
  ) {}

  async execute(id: string): Promise<User> {
    if (uuidValidate(id)) {
      throw new ValidationError("Invalid user ID");
    }
    const cacheKey = `user:${id}`;
    const cachedUser = await this.cacheService.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }

    if (user) {
      await this.cacheService.set(cacheKey, JSON.stringify(user), 3600); // Cache for 1 hour
    }

    return user;
  }
}
