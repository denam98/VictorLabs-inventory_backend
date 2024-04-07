/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PostgresConfigService } from '../database/postgres/config.service';
import {
  SystemActivity,
  SystemActivityMsg,
} from 'src/common/util/system-activity.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { ErrorService } from '../error/error.service';

@Injectable()
export class AppConfigService {
  private saltRounds: number = 12;

  constructor(
    private postgresService: PostgresConfigService,
    private mailerService: MailerService,
    private errorService: ErrorService,
  ) {}

  hashPassword(myPlaintextPassword: string): Promise<string> {
    return bcrypt.hash(myPlaintextPassword, this.saltRounds);
  }

  // Function to remove keys from a user object
  exclude(user: user, keys: string[]): user {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }

  // Function to record system activity
  async recordSystemActivity(
    type: SystemActivity,
    userId: string,
    recordId?: string | number,
  ) {
    if (type === SystemActivity.user_login)
      await this.postgresService.sys_login.create({
        data: {
          timestamp: new Date(),
          user_id: userId,
        },
      });
    else
      await this.postgresService.user_activity.create({
        data: {
          timestamp: new Date(),
          user_id: userId,
          activity_id: type,
          record_id: typeof recordId === 'number' ? String(recordId) : recordId,
        },
      });
    this.errorService.printLog(
      'info',
      'Surtex Inventory',
      SystemActivityMsg[type],
    );
  }

  // Function to send emails
  sendMail(
    from: string,
    to: string,
    text: string,
    subject: string,
    html: string,
  ) {
    this.mailerService.sendMail({
      to: to,
      from: from,
      subject: subject,
      text: text,
      html: html,
    });
  }
}
