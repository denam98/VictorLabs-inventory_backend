/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ErrorStructure } from 'src/common/interfaces/error.interface';

@Injectable()
export class ErrorService {
  config = JSON.parse(
    fs.readFileSync('src/config/error/error-config.json', 'utf-8'),
  );

  newError(err: ErrorStructure, originalError?: any): Error {
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

    return error;
  }

  getErrConfig(): any {
    return this.config;
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
