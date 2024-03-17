/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PostgresConfigService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: `${process.env.DATABASE_URL}`,
        },
      },
    });
  }
}
