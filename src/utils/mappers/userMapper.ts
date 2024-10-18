import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { User } from '../../domain/entities/User'
import { UserDTO } from '../../application/dtos/UserDTO';

export function configureUserMapper(mapper: Mapper) {
    createMap(mapper, User, UserDTO,
        forMember(dest => dest.id, mapFrom(src => src.id)),
        forMember(dest => dest.email, mapFrom(src => src.email)),
        forMember(dest => dest.name, mapFrom(src => src.name)),
        forMember(dest => dest.role, mapFrom(src => src.role))
    );
}

export function mapUserToDTO(mapper: Mapper, user: User): UserDTO {
    return mapper.map(user, User, UserDTO);
}