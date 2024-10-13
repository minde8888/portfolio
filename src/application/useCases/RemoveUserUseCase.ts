import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class RemoveUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number) {
    await this.userRepository.remove(id);
  }
}
