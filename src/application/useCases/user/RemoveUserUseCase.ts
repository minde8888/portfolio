import { validate as uuidValidate } from 'uuid';

import { IUserRepository } from "../../../domain/repositories/IUserRepository";

import { ValidationError } from "../../../utils/Errors/Errors";

export class RemoveUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(id: string) {
    try {
      if (!uuidValidate(id)) {
        throw new ValidationError("Invalid user ID");
      }
      await this.userRepository.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
