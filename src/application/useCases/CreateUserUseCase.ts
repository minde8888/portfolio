import { UserAlreadyExistsError } from "src/utils/errors";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, name: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const user = new User(0, email, name);
    return this.userRepository.save(user);
  }
}
