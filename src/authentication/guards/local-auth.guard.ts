/* eslint-disable @typescript-eslint/no-unused-vars */
/*
https://docs.nestjs.com/guards#guards
*/
import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') {}
