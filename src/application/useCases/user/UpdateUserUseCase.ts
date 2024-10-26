import { UserNotFoundError, UserUpdateError, ValidationError } from "../../../utils/Errors/Errors";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { validate as uuidValidate } from 'uuid';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(
    id: string,
    updates: { email?: string; name?: string }
  ): Promise<User> {

    if (uuidValidate(id)) {
      throw new ValidationError("Invalid user ID");
    }

    const existingUser = await this.userRepository.findById(id);
    
    if (!existingUser) {
      throw new UserNotFoundError(`User with id ${id} not found`);
    }

    if (updates.email !== undefined) existingUser.email = updates.email;
    if (updates.name !== undefined) existingUser.name = updates.name;

    if (updates.email !== undefined && updates.email !== existingUser.email) {
      const userWithNewEmail = await this.userRepository.findByEmail(
        updates.email
      );
      if (userWithNewEmail && userWithNewEmail.id !== id) {
        throw new Error("Email is already in use by another user");
      }
    }

    return this.userRepository.update(id, existingUser);
  }
}
