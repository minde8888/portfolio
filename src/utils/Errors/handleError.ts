import { HttpStatus } from "@nestjs/common";
import { DatabaseError, EmailAlreadyExistsError } from "./Errors";


export const handleError = (error: any): { status: number; error?: string } => {
    if (error instanceof EmailAlreadyExistsError) {
        return { status: HttpStatus.CONFLICT, error: 'Email already exists' };
    }

    if (error instanceof DatabaseError) {
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Database error occurred' };
    }

    console.error('Unexpected error in RegisterUseCase:', error);
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'An unexpected error occurred' };
}
