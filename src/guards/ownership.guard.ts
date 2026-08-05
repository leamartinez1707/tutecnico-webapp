// guards/ownership.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector, ModuleRef } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { get as getProperty } from 'lodash';
import { ConfigService } from '@nestjs/config';

export function OwnershipGuardFactory(
  serviceToken: string | symbol,
  options?: {
    paramKey?: string;
    ownerFields?: string[];
  },
): Type<CanActivate> {
  const paramKey = options?.paramKey ?? 'id';
  const ownerFields = options?.ownerFields ?? ['ownerId'];

  @Injectable()
  class OwnershipGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
      private readonly jwtService: JwtService,
      private readonly moduleRef: ModuleRef,
      private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException();
      }

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
        request['user'] = payload;
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        }
        throw new UnauthorizedException();
      }

      const userId = request.user.sub;
      const resourceId = +request.params[paramKey];

      const service = this.moduleRef.get(serviceToken, { strict: false });
      const resource = await service.findOne(resourceId);
      if (!resource) {
        throw new NotFoundException('Resource not found');
      }

      const isOwner = ownerFields.some((field) => {
        const value = getProperty(resource, field);
        return value === userId;
      });

      if (!isOwner) {
        throw new ForbiddenException('Access denied');
      }

      return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }

  return mixin(OwnershipGuard);
}