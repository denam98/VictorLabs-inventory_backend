import { RequestService } from 'src/common/services/request.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, RequestService],
})
export class UserModule {}
