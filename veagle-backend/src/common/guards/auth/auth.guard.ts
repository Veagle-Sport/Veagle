import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JWTAuthService } from '../../../modules/utils/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly JWTAuthService: JWTAuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
   
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.JWTAuthService.VerifyToken({
        token,
        secret: process.env.AUTH_SECRET as string,
      });

      if (!decoded) throw new UnauthorizedException('Invalid token');
        req['userId'] = decoded.payload._id;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
