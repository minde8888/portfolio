import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { UserDTO } from '../dtos/user/UserDTO';
import { Auth } from '../../domain/entities/auth/Auth';
import { User } from '../../domain/entities/user/User';
import { UpdateUserDTO } from '../dtos/user/UpdateUserDTO';
import { UserRole } from '../../domain/entities/user/UserRole';

export function configureUserMapper(mapper: Mapper) {
  // Auth to User mapping
  createMap(
    mapper,
    Auth,
    User,
    forMember((destination) => destination.id, mapFrom((source) => source.id)),
    forMember((destination) => destination.email, mapFrom((source) => source.email)),
    forMember((destination) => destination.name, mapFrom((source) => source.name)),
    forMember((destination) => destination.role, mapFrom(() => UserRole.USER)));

  // UserDTO to User mapping
  createMap(
    mapper,
    UserDTO,
    User,
    forMember(dest => dest.id, mapFrom(src => src.id)),
    forMember(dest => dest.email, mapFrom(src => src.email)),
    forMember(dest => dest.name, mapFrom(src => src.name)),
    forMember(dest => dest.isDeleted, mapFrom(src => src.isDeleted))
  );

    //User to UserDTO mapping
  createMap(
    mapper,   
    User,
    UserDTO,
    forMember(dest => dest.id, mapFrom(src => src.id)),
    forMember(dest => dest.email, mapFrom(src => src.email)),
    forMember(dest => dest.name, mapFrom(src => src.name))
  );

  // UpdateUserDTO to User mapping
  createMap(
    mapper,
    UpdateUserDTO,
    User,
    forMember(dest => dest.id, mapFrom(src => src.id)),
    forMember(dest => dest.email, mapFrom(src => src.email)),
    forMember(dest => dest.name, mapFrom(src => src.name))
  );
}