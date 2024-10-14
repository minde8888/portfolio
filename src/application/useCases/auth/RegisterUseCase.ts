import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import * as bcrypt from "bcrypt";

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string, role: string): Promise<number> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ email, password: hashedPassword, role });
    return user.id;
  }
}