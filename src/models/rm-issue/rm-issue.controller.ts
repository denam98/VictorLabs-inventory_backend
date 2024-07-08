import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { RMIssueService } from './rm-issue.service';
import { RMIssueDTO, RMIssueItemDTO } from 'src/common/dtos/dto';

@Controller('api/v1/rm-issue')
export class RMIssueController {
  constructor(private rmIssueService: RMIssueService) {}

  @Get('all')
  async getAllRMIssues() {
    return await this.rmIssueService.getAllRMIssues();
  }

  @Get('/:id')
  async getRMIssueById(@Param('id') rmIssueId: string) {
    return await this.rmIssueService.getRMIssueById(rmIssueId);
  }

  @Get('/')
  async findRMIssueByIssueNoteNo(
    @Param('noteNo', ParseIntPipe) noteNo: number,
  ) {
    return await this.rmIssueService.findRMIssueByIssueNoteNo(noteNo);
  }

  @Post('/add')
  async addRMIssue(
    @Body()
    data: {
      addRMIssueDto: RMIssueDTO;
      rmIssueItems: RMIssueItemDTO[];
    },
  ) {
    return await this.rmIssueService.addRMIssue(data);
  }

  @Delete('/:id')
  async deleteRMIssue(@Param('id') rmIssueId: string) {
    return await this.rmIssueService.deleteRMIssue(rmIssueId);
  }

  @Put('/:id')
  async updateRMIssue(
    @Param('id') rmIssueId: string,
    @Body() addRMIssueDto: RMIssueDTO,
  ) {
    const params = {
      where: { id: rmIssueId, is_active: true },
      data: addRMIssueDto,
    };
    return await this.rmIssueService.updateRMIssue(params);
  }

  @Put('/contacts/:id')
  async updateRMIssueItems(
    @Param('id') rmIssueId: string,
    @Body() itemDTOs: RMIssueItemDTO[],
  ) {
    return await this.rmIssueService.updateRMIssueItems(itemDTOs, rmIssueId);
  }
}
