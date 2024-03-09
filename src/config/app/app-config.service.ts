/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppConfigService {
  private saltRounds: number = 12;

  hashPassword(myPlaintextPassword: string) {
    bcrypt.hash(myPlaintextPassword, this.saltRounds).then(function (hash) {
      return hash;
    });
  }
}
