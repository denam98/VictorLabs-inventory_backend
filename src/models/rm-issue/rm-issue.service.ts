import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { rm_issue, rm_issue_item } from '@prisma/client';
import { RMIssueDTO, RMIssueItemDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class RMIssueService {
  currUser: string;

  constructor(
    private postgreService: PostgresConfigService,
    private errorService: ErrorService,
    private commonService: AppConfigService,
    private readonly requestService: RequestService,
  ) {
    this.currUser = this.requestService.getUserId();
    this.errorService.printLog(
      'info',
      RMIssueService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findRMIssueByIssueNoteNo(noteNo: number): Promise<rm_issue[]> {
    try {
      return await this.postgreService.rm_issue.findMany({
        where: {
          issue_note_no: noteNo,
          is_active: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
            RMIssueService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            RMIssueService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RMIssueService.name,
      );
    }
  }

  async getAllRMIssues(): Promise<rm_issue[]> {
    try {
      const rm_issue: rm_issue[] = await this.postgreService.rm_issue.findMany({
        where: {
          is_active: true,
        },
        include: {
          rm_issue_item: {
            where: { is_active: true },
          },
        },
      });
      return rm_issue;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          RMIssueService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RMIssueService.name,
      );
    }
  }

  async getRMIssueById(rmIssueId: string): Promise<rm_issue> {
    try {
      const rm_issue: rm_issue =
        await this.postgreService.rm_issue.findFirstOrThrow({
          where: {
            id: rmIssueId,
            is_active: true,
          },
          include: {
            rm_issue_item: {
              where: {
                is_active: true,
              },
            },
          },
        });
      return rm_issue;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            RMIssueService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            RMIssueService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RMIssueService.name,
      );
    }
  }

  async addRMIssue(data: {
    addRMIssueDto: RMIssueDTO;
    rmIssueItems: RMIssueItemDTO[];
  }): Promise<rm_issue> {
    try {
      const rm_issue: rm_issue = await this.postgreService.rm_issue.create({
        data: data.addRMIssueDto,
      });

      await this.postgreService.rm_issue_item.createMany({
        data: data.rmIssueItems.map((item: RMIssueItemDTO) => {
          item.rm_issue_id = rm_issue.id;
          return item;
        }),
      });

      await this.commonService.recordSystemActivity(
        SystemActivity.create_RM_issue,
        this.currUser,
        rm_issue.id,
      );
      return rm_issue;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
            RMIssueService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            RMIssueService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RMIssueService.name,
      );
    }
  }

  async deleteRMIssue(rm_issueId: string): Promise<rm_issue> {
    try {
      const rm_issue: rm_issue = await this.postgreService.rm_issue.update({
        where: {
          id: rm_issueId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });

      await this.postgreService.rm_issue_item.updateMany({
        where: {
          rm_issue_id: rm_issue.id,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });

      await this.commonService.recordSystemActivity(
        SystemActivity.delete_RM_issue,
        this.currUser,
        rm_issue.id,
      );
      return rm_issue;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            RMIssueService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            RMIssueService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RMIssueService.name,
      );
    }
  }

  async updateRMIssue(params: {
    where: { id: string; is_active: boolean };
    data: RMIssueDTO;
  }): Promise<rm_issue> {
    try {
      const { where, data } = params;
      const rm_issue: rm_issue = await this.postgreService.rm_issue.update({
        where,
        data,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.update_RM_issue,
        this.currUser,
        rm_issue.id,
      );
      return rm_issue;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            RMIssueService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            RMIssueService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RMIssueService.name,
      );
    }
  }

  async updateRMIssueItems(
    items: RMIssueItemDTO[],
    rm_issueId: string,
  ): Promise<rm_issue_item[]> {
    try {
      const updatedItems: Promise<rm_issue_item>[] = await items.map(
        async (item: RMIssueItemDTO) => {
          const id = item.id ? item.id : -1;
          item.id ? delete item.id : null;
          console.log(item);
          return await this.postgreService.rm_issue_item.upsert({
            where: {
              id: id,
              rm_issue_id: rm_issueId,
              is_active: true,
            },
            update: item,
            create: item,
          });
        },
      );
      await this.commonService.recordSystemActivity(
        SystemActivity.update_RM_issue_item,
        this.currUser,
        rm_issueId,
      );
      return Promise.all(updatedItems).then((data) => {
        return data;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            RMIssueService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            RMIssueService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RMIssueService.name,
      );
    }
  }
}
