import { RequestService } from './../services/request.service';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ErrorService } from 'src/config/error/error.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);
  constructor(
    private readonly requestService: RequestService,
    private readonly errorService: ErrorService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      // Removing 'Bearer ' from the token string
      const token = authHeader.substring(7);
      const decoded: any = jwt.verify(token, `${process.env.jwt_secret}`);

      if (decoded && decoded.sub && decoded.sub.id) {
        this.requestService.setUserId(decoded.sub.id);
        this.logger.log(decoded.sub.id);
      }

      next();
    } catch (error) {
      throw this.errorService.newError(this.errorService.ErrConfig.E003, error);
    }
  }
}
