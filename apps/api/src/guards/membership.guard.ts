import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TechniciansService } from 'src/technicians/technicians.service';

@Injectable()
export class MembershipGuard implements CanActivate {
  constructor(private readonly techniciansService: TechniciansService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'];

    // If user context isn't present, assume AuthGuard should have run before
    if (!user || !user.username) return true;

    // Only restrict technicians; if user has no technician profile, allow
    const tech = await this.techniciansService.findByUsername(user.username);
    if (!tech) return true;

    if (!tech.membershipActive) {
      throw new ForbiddenException('Technician membership is not active');
    }

    return true;
  }
}
