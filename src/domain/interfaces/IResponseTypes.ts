import { IDeletableEntity } from '../../domain/interfaces/IDeletableEntity';

export type UserResponse<T> = {
  [K in keyof T]: T[K] extends IDeletableEntity | IDeletableEntity[]
    ? T[K]
    : T[K] extends object
    ? UserResponse<T[K]>
    : T[K];
};

export interface AuthResponse<T extends IDeletableEntity> {
  accessToken: string;
  refreshToken: string;
  userDTO: T;
}