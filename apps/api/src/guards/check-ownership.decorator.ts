// decorators/check-ownership.decorator.ts
import { UseGuards, applyDecorators } from '@nestjs/common';
import { OwnershipGuardFactory } from './ownership.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export function CheckOwnership(
    service: any,
    options?: {
        paramKey?: string;
        ownerFields?: string[];
    },
) {
    return applyDecorators(
        UseGuards(JwtAuthGuard, OwnershipGuardFactory(service, options)),
    );
}

