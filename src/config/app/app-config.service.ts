/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppConfigService {
  private saltRounds: number = 12;

  hashPassword(myPlaintextPassword: string): Promise<string> {
    return bcrypt.hash(myPlaintextPassword, this.saltRounds);
  }

  exclude(user: User, keys: string[]): User {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }
}
