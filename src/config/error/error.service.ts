import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ErrorStructure } from 'src/common/interfaces/error.interface';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ErrorService {
  config = JSON.parse(
    fs.readFileSync('src/config/error/error-config.json', 'utf-8'),
  );

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  newError(err: ErrorStructure, originalError?: any, context?: string): Error {
    let error: CustomError;
    const customMessage: any = {
      message: err.DESCRIPTION ? err.DESCRIPTION : 'Discription not available',
      code: err.code,
    };

    if (originalError) {
      customMessage['stack'] = originalError.stack;
      error = new CustomError(customMessage, Number(err.STATUS));
    } else {
      error = new CustomError(customMessage, Number(err.STATUS));
    }

    this.logger.error({
      message: error.message,
      stack: error.stack,
      context: context,
    });

    return error;
  }

  get ErrConfig(): any {
    return this.config;
  }

  printLog(type: string, context: string, msg: string) {
    switch (type) {
      case 'info':
        this.logger.info({ message: msg, context: context });
      case 'debug':
        this.logger.debug({ message: msg, context: context });
    }
  }
}

class CustomError extends HttpException {
  description;
  code;
  stack;
  constructor(message: any, statusCode: HttpStatus) {
    super(message, statusCode);
  }
}
