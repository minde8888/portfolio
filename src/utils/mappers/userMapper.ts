import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { UserDTO } from '../../application/dtos/UserDTO';
import { Auth } from '../../domain/entities/auth/Auth';
import { User } from '../../domain/entities/user/User';

export function configureUserMapper(mapper: Mapper) {
    createMap(mapper, Auth, User,
        forMember(dest => dest.id, mapFrom(src => src.id)),
        forMember(dest => dest.email, mapFrom(src => src.email)),
        forMember(dest => dest.name, mapFrom(src => src.name)),
        forMember(dest => dest.role, mapFrom(src => src.role))
    );
    
      createMap(
        mapper,
        UserDTO,
        User,
        forMember(dest => dest.email, mapFrom(src => src.email)),
        forMember(dest => dest.name, mapFrom(src => src.name)),
        forMember(dest => dest.role, mapFrom(src => src.role)),
        forMember(dest => dest.isDeleted, mapFrom(src => src.isDeleted))
      );

    // UpdateUserDTO to User mapping
    //   createMap(
    //     mapper,
    //     UpdateUserDTO,
    //     User,
    //     forMember(dest => dest.email, mapFrom(src => src.email)),
    //     forMember(dest => dest.name, mapFrom(src => src.name)),
    //     forMember(dest => dest.role, mapFrom(src => src.role))
    //   );
}

