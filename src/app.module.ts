import { AppConfigModule } from './config/app/app-config.module';
import { UserModule } from './models/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { PostgresConfigModule } from './config/database/postgres/config.module';
import { ErrorModule } from './config/error/error.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthenticationMiddleware } from './common/middleware/authentication.middleware';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import { RawMaterialModule } from './models/raw-material/raw-material.module';
import { SupplierModule } from './models/supplier/supplier.module';
import { RawMaterialSupplierModule } from './models/rawmaterial-supplier/rm-supplier.module';
import { PrnModule } from './models/prn/prn.module';
import { PoModule } from './models/po/po.module';
import { SrnModule } from './models/srn/srn.module';
import { TaxModule } from './models/tax/tax.module';
import { GrnModule } from './models/grn/grn.module';
import { CustomerModule } from './models/customer/customer.module';
import { BatchModule } from './models/batch/batch.module';
import { RMIssueModule } from './models/rm-issue/rm-issue.module';

@Module({
  imports: [
    AppConfigModule,
    UserModule,
    RawMaterialModule,
    SupplierModule,
    RawMaterialSupplierModule,
    AuthModule,
    PrnModule,
    SrnModule,
    TaxModule,
    PoModule,
    GrnModule,
    CustomerModule,
    BatchModule,
    RMIssueModule,
    PostgresConfigModule,
    ErrorModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'dchamath5@gmail.com',
          pass: 'vano opfd nhqq xhrf',
        },
      },
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/info/'),
          filename: 'info.log',
          level: 'info',
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/debug/'),
          filename: 'debug.log',
          level: 'debug',
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/error/'),
          filename: 'error.log',
          level: 'error',
        }),
      ],
    }),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: 'api/v1/auth/authenticate', method: RequestMethod.POST })
      .forRoutes({ path: 'api/v1/*', method: RequestMethod.ALL });
  }
}
