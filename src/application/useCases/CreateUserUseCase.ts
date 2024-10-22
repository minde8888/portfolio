import { EmailAlreadyExistsError, ValidationError } from "../../utils/Errors/Errors";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  // async execute(email: string, name: string): Promise<User> {
  //   if (!email || !name) {
  //     throw new ValidationError("Email and name are required");
  //   }
  //   const existingUser = await this.userRepository.findByEmail(email);
  //   if (existingUser) {
  //     throw new EmailAlreadyExistsError();
  //   }

  //   const user = new User(0, email, name);
  //   return this.userRepository.save(user);
  // }
}
