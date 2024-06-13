import { RMIssueController } from './rm-issue.controller';
import { RMIssueService } from './rm-issue.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [RMIssueController],
  providers: [RMIssueService],
})
export class RMIssueModule {}
