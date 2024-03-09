import { AuthGuard } from '@nestjs/passport';
/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshJwtGuard extends AuthGuard('jwt-refresh') {}
