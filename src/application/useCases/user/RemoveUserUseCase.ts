import { ValidationError } from "../../../utils/Errors/Errors";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { validate as uuidValidate } from 'uuid';

export class RemoveUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(id: string) {
    if (uuidValidate(id)) {
      throw new ValidationError("Invalid user ID");
    }
    await this.userRepository.remove(id);
  }
}
