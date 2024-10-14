import { ValidationError } from "../../utils/Errors";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class RemoveUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number) {
    if (isNaN(id)) {
      throw new ValidationError("Invalid user ID");
    }
    await this.userRepository.remove(id);
  }
}
